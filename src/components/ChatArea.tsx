'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"

import {
  Mic,
  ImagePlus,
  Send,
  Loader2,
  Search,
  ScanSearch,
  Brain,
  Video,
  Image,
  FileText,
  Music,
  Code2,
  Speaker // Added the Speaker icon
} from "lucide-react";

import { 
  User, Bot,  Sparkles, Copy, CheckCheck, MoreVertical, Menu,
  Sun, Moon , RefreshCw, ThumbsUp, ThumbsDown,
  MessageSquare, Settings, PlusCircle, ChevronRight
} from "lucide-react"
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  liked?: boolean;
  disliked?: boolean;
}

export function ChatArea() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: ' شلحال ياك لباس شماسي تفضل شتبقي',
      role: 'assistant',
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isCopied, setIsCopied] = useState<{ [key: string]: boolean }>({})
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [darkMode, setDarkMode] = useState<boolean>(true)
  const [selectedChat, setSelectedChat] = useState<string>("current")
  
  const [chatHistory] = useState([
    { id: "chat1", title: "استفسار عن التسويق الرقمي", date: "اليوم" },
    { id: "chat2", title: "تطوير تطبيق موبايل", date: "أمس" },
    { id: "chat3", title: "استراتيجية المحتوى", date: "12 مايو" },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `شكراً على رسالتك. يسعدني مساعدتك في هذا الموضوع.\n\nيمكنني تقديم المزيد من المعلومات إذا احتجت لذلك.`,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
  }

  const copyMessageToClipboard = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setIsCopied(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setIsCopied(prev => ({ ...prev, [id]: false })), 2000);
  }

  const toggleMessageReaction = (id: string, reaction: 'like' | 'dislike') => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === id) {
        if (reaction === 'like') {
          return { 
            ...msg, 
            liked: !msg.liked, 
            disliked: false 
          };
        } else {
          return { 
            ...msg, 
            disliked: !msg.disliked, 
            liked: false 
          };
        }
      }
      return msg;
    }));
  }

  const regenerateResponse = () => {
    const lastAssistantMessageIndex = [...messages].reverse().findIndex(m => m.role === 'assistant');
    if (lastAssistantMessageIndex !== -1) {
      setIsLoading(true);
      
      setTimeout(() => {
        setMessages(prev => {
          const newMessages = [...prev];
          const realIndex = newMessages.length - 1 - lastAssistantMessageIndex;
          newMessages[realIndex] = {
            ...newMessages[realIndex],
            content: "هذا رد تم إعادة توليده بناءً على طلبك. أستطيع تقديم معلومات إضافية أو شرح مفصل إذا كنت بحاجة إلى ذلك.",
            timestamp: new Date()
          };
          return newMessages;
        });
        setIsLoading(false);
      }, 1000);
    }
  }

  const startNewChat = () => {
    setMessages([{
      id: Date.now().toString(),
      content: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
      role: 'assistant',
      timestamp: new Date(),
    }]);
  }

  // Function to handle text-to-speech
  const handleTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA'; // Arabic (Saudi Arabia) language code
      speechSynthesis.speak(utterance);
    } else {
      console.warn('Text-to-speech not supported in this browser');
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-950 dark:to-blue-950 overflow-hidden" dir="rtl">
      {/* Header */}
      <header className="py-3 px-4 border-b dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(prev => !prev)}
            className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
          >
            {isSidebarOpen ? 
              <ChevronRight className="h-5 w-5 text-blue-700 dark:text-blue-400" /> : 
              <Menu className="h-5 w-5 text-blue-700 dark:text-blue-400" />
            }
          </Button>
          <div className="bg-gradient-to-r from-blue-500 to-violet-600 text-white p-2 rounded-full shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-700 dark:from-blue-400 dark:to-violet-400">الحاذك</h1>
        </div>

        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDarkMode(prev => !prev)}
                  className="rounded-full border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200"
                >
                  {darkMode ? (
                    <Sun className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Moon className="h-4 w-4 text-blue-700" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{darkMode ? 'وضع النهار' : 'الوضع الليلي'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Avatar className="h-8 w-8 border-2 border-white dark:border-blue-900 shadow-sm hover:scale-105 transition-transform duration-200">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-600 text-white text-sm">
              م
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content (Sidebar + Chat Area) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`${isSidebarOpen ? 'w-72' : 'w-0'} shrink-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-l dark:border-gray-800 flex flex-col overflow-hidden shadow-lg transition-all duration-300 ease-in-out`}
        >
          <div className="p-4">
            <Button 
              onClick={startNewChat} 
              className="w-full justify-start gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 mb-4 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <PlusCircle className="h-4 w-4" />
              محادثة جديدة
            </Button>
          </div>
          
          <Tabs defaultValue="chats" className="flex-1 overflow-hidden">
            <div className="px-4">
              <TabsList className="w-full mb-4 bg-blue-100 dark:bg-gray-800 p-1 rounded-full">
                <TabsTrigger value="chats" className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-600 data-[state=active]:text-white">
                  <MessageSquare className="h-4 w-4 ml-2" />
                  المحادثات
                </TabsTrigger>
                <TabsTrigger value="settings" className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-600 data-[state=active]:text-white">
                  <Settings className="h-4 w-4 ml-2" />
                  الإعدادات
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="chats" className="flex-1 overflow-y-auto px-2">
              <div className="space-y-2 p-2">
                {chatHistory.map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`w-full text-right p-3 rounded-xl text-sm transition-all duration-200 ${
                      selectedChat === chat.id 
                        ? "bg-gradient-to-r from-blue-100 to-violet-100 dark:from-blue-900/40 dark:to-violet-900/40 text-blue-800 dark:text-blue-300 shadow-md" 
                        : "hover:bg-blue-50 dark:hover:bg-gray-800 hover:shadow-sm"
                    }`}
                  >
                    <div className="font-medium">{chat.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{chat.date}</div>
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <Card className="p-4 border-blue-100 dark:border-blue-900/40 shadow-sm">
                  <h3 className="text-sm font-semibold mb-4 text-blue-800 dark:text-blue-300">المظهر</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">الوضع الليلي</span>
                    <Switch 
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                </Card>
                
                <Card className="p-4 border-blue-100 dark:border-blue-900/40 shadow-sm">
                  <h3 className="text-sm font-semibold mb-4 text-blue-800 dark:text-blue-300">الإشعارات</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">تفعيل الإشعارات</span>
                      <Switch className="data-[state=checked]:bg-blue-600" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">الردود التلقائية</span>
                      <Switch className="data-[state=checked]:bg-blue-600" />
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 border-blue-100 dark:border-blue-900/40 shadow-sm">
                  <h3 className="text-sm font-semibold mb-2 text-blue-800 dark:text-blue-300">حول التطبيق</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    المساعد الذكي - الإصدار 1.2.0
                  </p>
                  <div className="mt-3">
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                      النسخة التجريبية
                    </Badge>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </aside>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col relative">
          <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none bg-center bg-repeat z-0" 
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")" }}
          ></div>

          {/* Messages */}
          <ScrollArea className="flex-1 py-6 px-4 md:px-8 relative z-10">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`group flex ${message.role === 'user' ? 'justify-start' : 'justify-end'} animate-fadeIn`}
                >
                  <div className={`flex ${message.role === 'user' ? 'flex-row' : 'flex-row-reverse'} gap-3 max-w-3xl`}>
                    <Avatar 
                      className={`h-10 w-10 self-end ring-2 ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-br from-blue-500 to-violet-600 border-2 border-white dark:border-gray-900 shadow-md ring-blue-200 dark:ring-blue-800' 
                          : 'bg-gradient-to-br from-blue-500 to-violet-600  border-2 border-white dark:border-gray-900 shadow-md ring-blue-200 dark:ring-blue-900'
                      }`}
                    >
                      <AvatarFallback>
                        {message.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 max-w-[calc(100%-4rem)]">
                      <Card 
                        className={`px-4 py-3 rounded-2xl ${
                          message.role === 'user' 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white dark:from-blue-700 dark:to-blue-800 border-none shadow-md hover:shadow-lg transition-shadow duration-200' 
                            : 'bg-white dark:bg-gray-800 dark:text-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200'
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                      </Card>
                      
                      <div className={`flex items-center text-xs gap-2 px-1 ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                        <span className="text-gray-500 dark:text-gray-400">
                          {formatTime(message.timestamp)}
                        </span>
                        
                        {message.role === 'assistant' && (
                          <div className="flex gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-300"
                                    onClick={() => copyMessageToClipboard(message.id, message.content)}
                                  >
                                    {isCopied[message.id] ? <CheckCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" /> : <Copy className="h-3.5 w-3.5" />}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{isCopied[message.id] ? 'تم النسخ!' : 'نسخ'}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {/* زر الصوت المضاف */}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-300"
                                    onClick={() => handleTextToSpeech(message.content)}
                                  >
                                    <Speaker className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>استماع للنص</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-6 w-6 rounded-full ${message.liked ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400' : 'hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-300'}`}
                                    onClick={() => toggleMessageReaction(message.id, 'like')}
                                  >
                                    <ThumbsUp className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>إعجاب</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-6 w-6 rounded-full ${message.disliked ? 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400' : 'hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-300'}`}
                                    onClick={() => toggleMessageReaction(message.id, 'dislike')}
                                  >
                                    <ThumbsDown className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>عدم إعجاب</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-300"
                                >
                                  <MoreVertical className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800">
                                <DropdownMenuItem onClick={regenerateResponse} className="hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer">
                                  <RefreshCw className="h-4 w-4 ml-2 text-blue-600 dark:text-blue-400" />
                                  إعادة توليد الرد
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-blue-100 dark:bg-blue-800" />
                                <DropdownMenuItem className="hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer" onClick={() => copyMessageToClipboard(message.id, message.content)}>
                                  <Copy className="h-4 w-4 ml-2 text-blue-600 dark:text-blue-400" />
                                  نسخ النص
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-end animate-fadeIn">
                  <div className="flex flex-row-reverse gap-3">
                    <Avatar className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-teal-700 border-2 border-white dark:border-gray-900 shadow-md ring-2 ring-emerald-200 dark:ring-emerald-900">
                      <AvatarFallback>
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <Card className="px-5 py-4 bg-white dark:bg-gray-800 shadow-sm rounded-2xl">
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <div className="w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-700 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Footer */}
          <footer className="p-4  backdrop-blur-md  relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="mb-3 flex flex-wrap gap-2 justify-center">
                <TooltipProvider>
                  {[
                    { icon: ImagePlus, label: "إنشاء صور" },
                    { icon: Search, label: "البحث في الويب" },
                    { icon: ScanSearch, label: "إجراء بحث" },
                    { icon: Brain, label: "تفكير عميق" },
                    { icon: Video, label: "فيديو" },
                    { icon: Image, label: "صورة" },
                    { icon: FileText, label: "مستندات" },
                    { icon: Music, label: "موسيقى" },
                    { icon: Code2, label: "برمجة" },
                    { icon: Mic, label: "تسجيل صوت" },
                  ].map(({ icon: Icon, label }, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-full text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
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
                </TooltipProvider>
              </div>

              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  placeholder="اكتب رسالتك هنا..."
                  className="resize-none pr-4 pl-14 dark:bg-gray-900 dark:text-white text-gray-800 min-h-[56px] max-h-40 py-3.5 rounded-full border border-blue-200 dark:border-blue-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />

                <div className="absolute left-2 bottom-2 flex gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-full text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                        >
                          <ImagePlus className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>إرفاق صورة</p>
                      </TooltipContent>
                    </Tooltip>

                    <Button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      size="icon"
                      className={`h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 shadow-md hover:shadow-lg transition-all duration-200 ${!input.trim() || isLoading ? 'opacity-70' : 'opacity-100'}`}
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </TooltipProvider>
                </div>
              </div>

              <div className="flex justify-center mt-3">
                <Badge 
                  variant="outline" 
                  className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 text-xs font-normal py-1 px-4 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                >
                  الحاذك - مساعدك الذكي اليومي
                </Badge>
              </div>
            </div>
          </footer>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .dark .dark\:from-gray-950 {
          --tw-gradient-from: #030712;
        }
        
        .dark .dark\:to-blue-950 {
          --tw-gradient-to: #172554;
        }
      `}</style>
    </div>
  )
}