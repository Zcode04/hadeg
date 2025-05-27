import { NextRequest, NextResponse } from 'next/server';
import { createOpenAIApi, ChatRequest, ChatResponse } from '@/lib/api-config';

export async function POST(request: NextRequest) {
  try {
    // استلام البيانات من الطلب
    const body: ChatRequest = await request.json();
    const { message, messages = [] } = body;

    // التحقق من وجود الرسالة
    if (!message || message.trim().length === 0) {
      return NextResponse.json<ChatResponse>({
        message: 'الرسالة مطلوبة',
        success: false,
        error: 'رسالة فارغة',
      }, { status: 400 });
    }

    // التحقق من وجود مفتاح API
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not defined');
      return NextResponse.json<ChatResponse>({
        message: 'خطأ في الإعدادات',
        success: false,
        error: 'مفتاح API غير موجود',
      }, { status: 500 });
    }

    // إنشاء Gemini API client
    const geminiApi = createOpenAIApi();

    // تحضير المحادثة لـ Gemini
    const conversationHistory = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // إضافة رسالة النظام والرسالة الجديدة
    const contents = [
      ...conversationHistory,
      {
        role: 'user',
        parts: [{ text: `أنت مساعد ذكي ومفيد. تجيب باللغة العربية بشكل واضح ومفيد.\n\n${message}` }]
      }
    ];

    console.log('Sending request to Gemini...');
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
    console.log('API Key first 10 chars:', process.env.GEMINI_API_KEY?.substring(0, 10));

    // إرسال الطلب إلى Gemini
    const response = await geminiApi.post('/models/gemini-1.5-flash:generateContent', {
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    });

    // استخراج الرد من Gemini
    const aiMessage = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiMessage) {
      return NextResponse.json<ChatResponse>({
        message: 'لم أتمكن من الحصول على رد',
        success: false,
        error: 'رد فارغ من Gemini',
      }, { status: 500 });
    }

    // إرجاع الرد
    return NextResponse.json<ChatResponse>({
      message: aiMessage,
      success: true,
    });

  } catch (error: unknown) {
    const err = error as { message?: string; response?: { status?: number; data?: { error?: { message?: string } } } };
    console.error('خطأ في API الدردشة:', error);
    console.error('Error details:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data
    });

    // التعامل مع أخطاء Gemini المختلفة
    if (err.response?.status === 401 || err.response?.status === 403) {
      return NextResponse.json<ChatResponse>({
        message: 'خطأ في المصادقة - تحقق من مفتاح API',
        success: false,
        error: `مفتاح API غير صحيح: ${err.response?.data?.error?.message || 'غير معروف'}`,
      }, { status: 401 });
    }

    if (err.response?.status === 429) {
      return NextResponse.json<ChatResponse>({
        message: 'تم تجاوز الحد المسموح، حاول لاحقاً',
        success: false,
        error: 'تجاوز الحد المسموح',
      }, { status: 429 });
    }

    if (err.response?.status === 400) {
      return NextResponse.json<ChatResponse>({
        message: 'طلب غير صحيح',
        success: false,
        error: `خطأ في البيانات: ${err.response?.data?.error?.message || 'غير معروف'}`,
      }, { status: 400 });
    }

    // خطأ عام
    return NextResponse.json<ChatResponse>({
      message: 'حدث خطأ في الخادم، حاول مرة أخرى',
      success: false,
      error: err.message || 'خطأ غير معروف',
    }, { status: 500 });
  }
}