'use client';

import { ChatMessage as ChatMessageType } from '@/lib/api-config';
import ChatMessage from '@/components/Chat/ChatMessage';
import { useRef, useEffect } from 'react';
import { Sparkles, MessageCircle, Code, Edit3, BookOpen, Briefcase, Heart, Lightbulb, Calculator, Globe, PenTool, Camera } from 'lucide-react';
import Image from 'next/image';

interface ChatWindowProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  onSuggestionClick?: (suggestion: string) => void;
}

export default function ChatWindow({ messages, isLoading, onSuggestionClick }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // التمرير إلى أسفل عند إضافة رسالة جديدة
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const suggestions = [
    { 
      icon: Edit3, 
      text: "كتابة مقال احترافي", 
      prompt: "ساعدني في كتابة مقال احترافي عن موضوع: ",
      color: "from-blue-500 to-violet-500"
    },
    { 
      icon: Code, 
      text: "مراجعة وتحسين الكود", 
      prompt: "راجع وحسن هذا الكود:\n\n",
      color: "from-violet-500 to-blue-500"
    },
    { 
      icon: MessageCircle, 
      text: "ترجمة نصوص", 
      prompt: "ترجم هذا النص إلى الإنجليزية:\n\n",
      color: "from-blue-600 to-violet-600"
    },
    { 
      icon: BookOpen, 
      text: "شرح المفاهيم المعقدة", 
      prompt: "اشرح لي هذا المفهوم ببساطة: ",
      color: "from-violet-600 to-blue-600"
    },
    { 
      icon: Briefcase, 
      text: "خطة عمل تجارية", 
      prompt: "ساعدني في إنشاء خطة عمل لمشروع: ",
      color: "from-blue-500 to-violet-600"
    },
    { 
      icon: PenTool, 
      text: "كتابة إبداعية", 
      prompt: "اكتب لي قصة قصيرة أو قصيدة عن: ",
      color: "from-violet-500 to-blue-600"
    },
    { 
      icon: Calculator, 
      text: "حل مسائل رياضية", 
      prompt: "ساعدني في حل هذه المسألة الرياضية: ",
      color: "from-blue-600 to-violet-500"
    },
    { 
      icon: Globe, 
      text: "معلومات ثقافية", 
      prompt: "أخبرني عن تاريخ وثقافة: ",
      color: "from-violet-600 to-blue-500"
    },
    { 
      icon: Heart, 
      text: "نصائح صحية", 
      prompt: "أعطني نصائح صحية حول: ",
      color: "from-blue-500 to-violet-500"
    },
    { 
      icon: Lightbulb, 
      text: "أفكار إبداعية", 
      prompt: "اقترح علي أفكار إبداعية لـ: ",
      color: "from-violet-500 to-blue-500"
    },
    { 
      icon: Camera, 
      text: "وصف الصور", 
      prompt: "صف لي هذه الصورة بالتفصيل: ",
      color: "from-blue-600 to-violet-600"
    },
    { 
      icon: Sparkles, 
      text: "تطوير المهارات", 
      prompt: "كيف يمكنني تطوير مهاراتي في: ",
      color: "from-violet-600 to-blue-600"
    }
  ];

  // دالة التعامل مع النقر على الاقتراح
  const handleSuggestionClick = (suggestion: typeof suggestions[0]) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion.prompt);
    }
  };

  return (
      
    <div className="flex-1 overflow-y-auto relative ">
      {/* خلفية ثابتة جميلة مع دعم الوضع الليلي */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* الطبقة الأساسية */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/80 to-violet-50/60 dark:from-gray-900 dark:via-blue-950/50 dark:to-violet-950/30"></div>
        
        {/* عناصر زخرفية ثابتة */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400/20 via-violet-300/15 to-transparent dark:from-blue-600/30 dark:via-violet-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-violet-400/20 via-blue-300/15 to-transparent dark:from-violet-600/30 dark:via-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-200/10 via-violet-200/10 to-blue-200/10 dark:from-blue-400/10 dark:via-violet-400/10 dark:to-blue-400/10 rounded-full blur-2xl"></div>
        
        {/* طبقة التأثير الزجاجي */}
        <div className="absolute inset-0 backdrop-blur-[0.5px] bg-white/10 dark:bg-black/10"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="max-w-5xl w-full text-center px-4">
              {/* شعار وترحيب محسن */}
              <div className="mb-8 animate-fade-in">                
                <Image 
                  src="Had.svg" 
                  alt="Logo" 
                  width={96}
                  height={96}
                  className="mx-auto mb-4 h-16 sm:h-20 md:h-24 w-auto"
                />
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-6">
                  اختر من الاقتراحات أدناه أو ابدأ محادثة جديدة
                </p>
              </div>

              {/* اقتراحات تفاعلية على شكل أزرار - مصغرة */}
              <div className="suggestions-container flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-8 max-w-4xl mx-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="suggestion-button group flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl border border-gray-300/40 dark:border-gray-600/30 rounded-full hover:bg-white/30 dark:hover:bg-gray-900/30 hover:border-gray-400/60 dark:hover:border-gray-500/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-400/20 active:scale-[0.95]"
                    style={{ animationDelay: `${0.1 + index * 0.03}s` }}
                  >
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r ${suggestion.color} rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 flex-shrink-0`}>
                      <suggestion.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white drop-shadow-sm" />
                    </div>
                    <span className="suggestion-text text-gray-800 dark:text-gray-200 font-medium text-xs sm:text-sm group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors whitespace-nowrap">
                      {suggestion.text}
                    </span>
                    
                    {/* تأثير الهوفر */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${suggestion.color} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 rounded-full transition-opacity duration-300`}></div>
                  </button>
                ))}
              </div>

              {/* مؤشر بدء المحادثة */}
              <div className="flex items-center justify-center gap-3 text-gray-500 dark:text-gray-400">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-violet-400 dark:from-blue-300 dark:to-violet-300 rounded-full"></div>
                <span className="text-xs sm:text-sm font-medium">ابدأ بكتابة رسالتك أدناه</span>
                <div className="w-2 h-2 bg-gradient-to-r from-violet-400 to-blue-400 dark:from-violet-300 dark:to-blue-300 rounded-full"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {/* مؤشر التحميل الاحترافي على طراز ChatGPT */}
            {isLoading && (
              <div className="flex items-start gap-4 p-6 animate-slide-up">
                {/* أيقونة الذكي الاصطناعي */}
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-500 dark:from-blue-400 dark:to-violet-400 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                  <Image 
                    src="/kanai.png" 
                    alt="Had Logo" 
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* منطقة النقاط المتحركة */}
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1 mb-2">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse-dot"></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse-dot" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse-dot" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">حني شوي</span>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @keyframes pulse-dot {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          opacity: 0;
          animation: slide-up 0.6s ease-out forwards;
        }

        .animate-pulse-dot {
          animation: pulse-dot 1.4s ease-in-out infinite;
        }

        /* تحسينات للاستجابة */
        @media (max-width: 640px) {
          .flex-wrap {
            justify-content: center;
          }
        }
        
        /* تحسين للشاشات الصغيرة جداً */
        @media (max-width: 480px) {
          .suggestion-button {
            font-size: 0.7rem !important;
            padding: 0.375rem 0.625rem !important;
          }
          
          .suggestion-button .w-4 {
            width: 0.875rem !important;
            height: 0.875rem !important;
          }
          
          .suggestion-button .w-2\.5 {
            width: 0.5rem !important;
            height: 0.5rem !important;
          }
        }
      `}</style>
    </div>


  );
}