'use client';

import { useState, useRef } from 'react';
import { ChatMessage as ChatMessageType, localApi } from '@/lib/api-config';
import { generateId, isValidMessage, sanitizeMessage } from '@/lib/utils';
import ChatWindow from '@/components/Chat/ChatWindow';
import { Send, Loader2, ImagePlus, Mic, Video, Globe,  Lightbulb, Image, FileText, Music, Code2, MoreHorizontal, Paperclip } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import { Header } from "@/components/navigation/Header";
import { Sidebar } from "@/components/navigation/Sidebar";

export default function ChatLayout() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = async () => {
    if (!isValidMessage(inputMessage) || isLoading) return;

    const cleanMessage = sanitizeMessage(inputMessage);
    const userMessage: ChatMessageType = {
      id: generateId(),
      role: 'user',
      content: cleanMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await localApi.post('/chat', {
        message: cleanMessage,
        messages: messages,
      });

      if (response.data.success) {
        const assistantMessage: ChatMessageType = {
          id: generateId(),
          role: 'assistant',
          content: response.data.message,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        setError(response.data.error || 'حدث خطأ غير معروف');
      }
    } catch (err: unknown) {
      console.error('خطأ في إرسال الرسالة:', err);
      const errorMessage = err instanceof Error && 'response' in err && err.response && 
        typeof err.response === 'object' && 'data' in err.response && 
        err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
        ? String(err.response.data.message)
        : 'فشل في الاتصال بالخادم، تأكد من اتصالك بالإنترنت وحاول مرة أخرى';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSuggestionClick = (suggestionText: string) => {
    setInputMessage(suggestionText);
    if (inputRef.current) {
      inputRef.current.focus();
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(suggestionText.length, suggestionText.length);
        }
      }, 100);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="flex-1 flex flex-col overflow-hidden">
          <ChatWindow 
            messages={messages} 
            isLoading={isLoading} 
            onSuggestionClick={handleSuggestionClick}  
          />

          {error && (
            <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">⚠️ {error}</p>
            </div>
          )}

          <footer className="p-4 backdrop-blur-md relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="mb-3 flex flex-wrap gap-2 justify-center">
                <TooltipProvider>
                  <div className="hidden md:flex gap-2">
                    {[{ icon: ImagePlus, label: "إنشاء صور" }, { icon: Globe, label: "البحث في الويب" }, { icon: Lightbulb, label: "تفكير عميق" },  { icon: Music, label: "موسيقى" }, { icon: Code2, label: "برمجة" }, { icon: Mic, label: "تسجيل صوت" }].map(({ icon: Icon, label }, index) => (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-full text-blue-600 dark:text-violet-300 border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                            aria-label={label}
                          >
                            <Icon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>{label}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>

                  <div className="md:hidden flex gap-2">
                    {[{ icon: ImagePlus, label: "إنشاء صور" }, { icon: Mic, label: "تسجيل صوت" }, { icon: Lightbulb, label: "تفكير عميق" }, ].map(({ icon: Icon, label }, index) => (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-full text-blue-600 dark:text-violet-300 border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                            aria-label={label}
                          >
                            <Icon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>{label}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-full text-blue-600 dark:text-blue-200 border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                          aria-label="المزيد"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="flex flex-wrap gap-2 justify-center w-72 p-4 bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-800 rounded-xl shadow-xl">
                        {[ { icon: Music, label: "موسيقى" }, { icon: Code2, label: "برمجة" },{ icon: Globe, label: "البحث في الويب" }, ].map(({ icon: Icon, label }, index) => (
                          <Tooltip key={index}>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-full text-blue-600 dark:text-blue-200 border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                                aria-label={label}
                              >
                                <Icon className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>{label}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </PopoverContent>
                    </Popover>
                  </div>
                </TooltipProvider>
              </div>

              {/* Input Area */}
              <div className="relative">
                <Textarea
                  ref={inputRef}
                  placeholder="اكتب رسالتك هنا..."
                  className="resize-none px-4 dark:bg-gray-950 dark:text-white text-gray-800 min-h-[56px] max-h-40 py-3.5 rounded-full border border-blue-200 dark:border-blue-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isLoading}
                />
              </div>

              {/* Send and Media Buttons */}
              <div className="flex justify-center items-center gap-3 mt-3">
                <TooltipProvider>
                  {/* Send Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={sendMessage}
                        disabled={!isValidMessage(inputMessage) || isLoading}
                        size="icon"
                        className={`h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 shadow-md hover:shadow-lg transition-all duration-200 ${!isValidMessage(inputMessage) || isLoading ? 'opacity-70' : 'opacity-100'}`}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                        ) : (
                          <Send className="h-4 w-4 text-white" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>إرسال</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Media Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 rounded-full text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200 shadow-sm"
                            aria-label="إرفاق وسائط"
                          >
                            <Paperclip className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent 
                          side="top" 
                          className="w-60 p-3 bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-800 rounded-xl shadow-xl mb-2"
                        >
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { icon: Image, label: "صورة", color: "text-blue-500" },
                              { icon: Video, label: "فيديو", color: "text-violet-500" },
                              { icon: FileText, label: "مستند", color: "text-violet-500" },
                              { icon: Music, label: "صوت", color: "text-blue-500" },
                            ].map(({ icon: Icon, label, color }, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                className={`flex items-center gap-2 p-3 h-auto justify-start ${color} border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200`}
                              >
                                <Icon className="h-4 w-4" />
                                <span className="text-sm">{label}</span>
                              </Button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>إرفاق وسائط</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}