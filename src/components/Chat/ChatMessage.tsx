'use client';

import { ChatMessage as ChatMessageType } from '@/lib/api-config';
import {  cn } from '@/lib/utils';
import {  ThumbsUp, ThumbsDown, Copy, RotateCcw, Volume2 } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const handleLike = () => {
    setFeedbackMessage('تم إعجابك بالرد!');
    setTimeout(() => setFeedbackMessage(''), 2000);
  };

  const handleDislike = () => {
    setFeedbackMessage('تم تسجيل عدم إعجابك');
    setTimeout(() => setFeedbackMessage(''), 2000);
  };

  const handleRegenerate = () => {
    setFeedbackMessage('يتم إعادة توليد الرد...');
    setTimeout(() => setFeedbackMessage(''), 2000);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setFeedbackMessage('تم نسخ النص!');
    } catch {
      setFeedbackMessage('فشل في النسخ');
    }
    setTimeout(() => setFeedbackMessage(''), 2000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.lang = 'ar-SA';
      speechSynthesis.speak(utterance);
      setFeedbackMessage('يتم قراءة النص...');
    } else {
      setFeedbackMessage('القراءة الصوتية غير مدعومة');
    }
    setTimeout(() => setFeedbackMessage(''), 2000);
  };

  // رسائل المستخدم - التصميم الجديد
  if (isUser) {
    return (
      <>
        <div className="flex justify-end mb-6 group">
          <div className="max-w-[75%] min-w-0">
            {/* اسم المستخدم والوقت */}
            <div className="flex items-center gap-3 mb-3 justify-end">
            
              <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent font-cairo">
                أنت
              </span>
            </div>

            {/* حاوية الرسالة بالتصميم الجديد */}
            <div className={cn(
              "relative p-4 rounded-2xl backdrop-blur-md transition-all duration-300",
              "bg-gradient-to-br  via-violet-500 to-blue-600",
              "dark:from-blue-400/15 dark:via-violet-500/2 dark:to-blue-500/2",
              "border border-blue-200/30 dark:border-blue-400/30",
              "shadow-lg hover:shadow-xl",
              "group-hover:scale-[1.02] group-hover:border-blue-300/40 dark:group-hover:border-blue-400/40",
              "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/20 before:to-transparent before:pointer-events-none",
              "after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-tl after:from-blue-500/5 after:via-transparent after:to-violet-500/5 after:pointer-events-none"
            )}>
              {/* نص الرسالة */}
              <div className="relative text-sm leading-relaxed whitespace-pre-wrap break-words text-slate-100 dark:text-gray-100 font-cairo text-right z-10">
                {message.content}
              </div>
              
              {/* تأثير الإضاءة الداخلية */}
              <div className="absolute top-2 right-2 w-16 h-16 bg-gradient-to-br from-blue-300/20 to-violet-300/20 rounded-full blur-xl pointer-events-none opacity-60" />
            </div>
          </div>
        </div>
        
        {feedbackMessage && (
          <div className={cn(
            "fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-xl shadow-2xl transition-all duration-300 z-50 font-cairo",
            "bg-gradient-to-r from-slate-800/95 to-slate-900/95 dark:from-slate-700/95 dark:to-slate-800/95",
            "backdrop-blur-md border border-blue-200/20 dark:border-blue-700/20",
            "text-white dark:text-slate-100"
          )}>
            {feedbackMessage}
          </div>
        )}
      </>
    );
  }

  // رسائل المساعد - مع لوجو Had.svg
  if (isAssistant) {
    return (
      <>
        <div className="flex gap-4 mb-6 group">
          {/* أيقونة المساعد بالصورة */}
          <div className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
            "",
            "shadow-lg hover:shadow-xl group-hover:scale-105",
            "",
            "overflow-hidden"
          )}>
            <Image 
              src="/kanai.png" 
              alt="Had Logo" 
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>

          {/* محتوى الرسالة */}
          <div className="flex-1 min-w-0">
            {/* اسم المساعد والوقت */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-violet-600 bg-clip-text text-transparent font-cairo">
                الـحـاذگ
              </span>
           
            </div>

            {/* نص الرسالة */}
            <div className="text-sm leading-relaxed whitespace-pre-wrap break-words text-slate-800 dark:text-slate-100 font-cairo mb-4">
              {message.content}
            </div>

            {/* أزرار التفاعل */}
            <div className="flex items-center gap-1">
              <button 
                onClick={handleLike}
                className={cn(
                  "p-2.5 rounded-xl transition-all duration-200 group/btn",
                  "hover:scale-110 active:scale-95",
                  "text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400",
                  "hover:shadow-lg"
                )}
                title="إعجاب"
              >
                <ThumbsUp size={14} className="transition-transform group-hover/btn:scale-110" />
              </button>
              
              <button 
                onClick={handleDislike}
                className={cn(
                  "p-2.5 rounded-xl transition-all duration-200 group/btn",
                  "hover:scale-110 active:scale-95",
                  "text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400",
                  "hover:shadow-lg"
                )}
                title="عدم إعجاب"
              >
                <ThumbsDown size={14} className="transition-transform group-hover/btn:scale-110" />
              </button>
              
              <button 
                onClick={handleCopy}
                className={cn(
                  "p-2.5 rounded-xl transition-all duration-200 group/btn",
                  "hover:scale-110 active:scale-95",
                  "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400",
                  "hover:shadow-lg"
                )}
                title="نسخ"
              >
                <Copy size={14} className="transition-transform group-hover/btn:scale-110" />
              </button>
              
              <button 
                onClick={handleRegenerate}
                className={cn(
                  "p-2.5 rounded-xl transition-all duration-200 group/btn",
                  "hover:scale-110 active:scale-95",
                  "text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400",
                  "hover:shadow-lg"
                )}
                title="إعادة توليد"
              >
                <RotateCcw size={14} className="transition-transform group-hover/btn:scale-110 group-hover/btn:rotate-180" />
              </button>
              
              <button 
                onClick={handleSpeak}
                className={cn(
                  "p-2.5 rounded-xl transition-all duration-200 group/btn",
                  "hover:scale-110 active:scale-95",
                  "text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400",
                  "hover:shadow-lg"
                )}
                title="قراءة صوتية"
              >
                <Volume2 size={14} className="transition-transform group-hover/btn:scale-110" />
              </button>
            </div>
          </div>
        </div>
        
        {feedbackMessage && (
          <div className={cn(
            "fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-xl shadow-2xl transition-all duration-300 z-50 font-cairo",
            "bg-gradient-to-r from-slate-800/95 to-slate-900/95 dark:from-slate-700/95 dark:to-slate-800/95",
            "backdrop-blur-md border border-blue-200/20 dark:border-blue-700/20",
            "text-white dark:text-slate-100"
          )}>
            {feedbackMessage}
          </div>
        )}
      </>
    );
  }

  return null;
}