// components/navigation/Sidebar.tsx
import React, { useState, useMemo, useCallback } from "react";
import { 
  PlusCircle, 
  MessageSquare, 
  Archive, 
  Trash2, 
  Search,
  MoreHorizontal,
  Edit3,
  Clock,
  
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Chat {
  id: string;
  title: string;
  date: string;
  active: boolean;
  lastMessage?: string;
  timestamp: string;
}

interface SidebarProps {
  isOpen: boolean; // إضافة هذه الخاصية
  onChatSelect?: (chatId: string) => void;
  onNewChat?: () => void;
  onArchiveChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
  className?: string;
}

export function Sidebar({ 
  isOpen, // استخدام الخاصية المُمررة بدلاً من الحالة الداخلية
  onChatSelect,
  onNewChat,
  onArchiveChat,
  onDeleteChat,
  className 
}: SidebarProps) {
  // إزالة useState للـ isOpen لأننا نستخدم الخاصية المُمررة
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChatId, setSelectedChatId] = useState<string>("1");
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);

  // بيانات المحادثات مشابهة لتطبيقات الذكاء الاصطناعي
  const [chatHistory, setChatHistory] = useState<Chat[]>([
    { 
      id: "1", 
      title: "تطوير واجهات المستخدم المتقدمة", 
      date: "اليوم", 
      active: true,
      lastMessage: "كيف يمكنني تحسين الأداء وتجربة المستخدم...",
      timestamp: "10:30 ص"
    },
    { 
      id: "2", 
      title: "Next.js 15 والميزات الجديدة", 
      date: "أمس", 
      active: false,
      lastMessage: "Server Components تبدو رائعة للتطبيقات الكبيرة",
      timestamp: "03:45 م"
    },
    { 
      id: "3", 
      title: "استراتيجيات تصميم قواعد البيانات", 
      date: "قبل يومين", 
      active: false,
      lastMessage: "شكراً لك على الشرح المفصل والأمثلة العملية",
      timestamp: "11:20 ص"
    },
    { 
      id: "4", 
      title: "TypeScript Tips وأفضل الممارسات", 
      date: "قبل 3 أيام", 
      active: false,
      lastMessage: "الآن فهمت الـ Generic Types بشكل أفضل",
      timestamp: "05:15 م"
    },
    { 
      id: "5", 
      title: "تحليل البيانات باستخدام Python", 
      date: "قبل أسبوع", 
      active: false,
      lastMessage: "المكتبات التي اقترحتها مفيدة جداً",
      timestamp: "02:30 م"
    },
    { 
      id: "6", 
      title: "مفاهيم Machine Learning الأساسية", 
      date: "قبل أسبوع", 
      active: false,
      lastMessage: "خوارزميات التعلم العميق معقدة لكن مثيرة",
      timestamp: "01:15 م"
    },
    { 
      id: "7", 
      title: "تحسين أداء React Applications", 
      date: "قبل أسبوعين", 
      active: false,
      lastMessage: "useMemo و useCallback غيروا كل شيء",
      timestamp: "09:45 ص"
    },
    { 
      id: "8", 
      title: "Docker و Containerization", 
      date: "قبل أسبوعين", 
      active: false,
      lastMessage: "الآن يمكنني نشر التطبيقات بسهولة",
      timestamp: "04:20 م"
    },
    { 
      id: "9", 
      title: "مبادئ Clean Code", 
      date: "قبل ثلاثة أسابيع", 
      active: false,
      lastMessage: "الكود الآن أصبح أكثر قابلية للقراءة والصيانة",
      timestamp: "11:55 ص"
    },
    { 
      id: "10", 
      title: "GraphQL vs REST API", 
      date: "قبل ثلاثة أسابيع", 
      active: false,
      lastMessage: "GraphQL يحل مشاكل Over-fetching بذكاء",
      timestamp: "02:10 م"
    },
    { 
      id: "11", 
      title: "MongoDB وقواعد البيانات NoSQL", 
      date: "قبل شهر", 
      active: false,
      lastMessage: "المرونة في التعامل مع البيانات رائعة",
      timestamp: "10:30 ص"
    },
    { 
      id: "12", 
      title: "CSS Grid و Flexbox المتقدم", 
      date: "قبل شهر", 
      active: false,
      lastMessage: "أخيراً فهمت كيفية بناء تخطيطات معقدة",
      timestamp: "03:25 م"
    }
  ]);

  // تصفية المحادثات حسب البحث
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chatHistory;
    return chatHistory.filter(chat => 
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chatHistory, searchQuery]);

  // تجميع المحادثات حسب التاريخ
  const groupedChats = useMemo(() => {
    const groups: { [key: string]: Chat[] } = {};
    
    filteredChats.forEach(chat => {
      const key = chat.date;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(chat);
    });
    
    return groups;
  }, [filteredChats]);

  // معالجة الأحداث
  const handleChatSelect = useCallback((chatId: string) => {
    setSelectedChatId(chatId);
    onChatSelect?.(chatId);
  }, [onChatSelect]);

  const handleNewChat = useCallback(() => {
    const newChatId = `chat_${Date.now()}`;
    const newChat: Chat = {
      id: newChatId,
      title: "محادثة جديدة",
      date: "اليوم",
      active: true,
      lastMessage: "",
      timestamp: new Date().toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
    
    setChatHistory(prev => [newChat, ...prev.map(chat => ({ ...chat, active: false }))]);
    setSelectedChatId(newChatId);
    onNewChat?.();
  }, [onNewChat]);

  const handleDelete = useCallback((chatId: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    onDeleteChat?.(chatId);
  }, [onDeleteChat]);

  const handleArchive = useCallback((chatId: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    onArchiveChat?.(chatId);
  }, [onArchiveChat]);

  // إزالة toggleSidebar لأن الحالة تُدار من الخارج الآن

  return (
    <>
      {/* طبقة خلفية شفافة عند الفتح على الشاشات الصغيرة */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          // إزالة onClick لأن الإغلاق يُدار من الخارج
        />
      )}

      {/* الشريط الجانبي */}
      <div className={cn(
        "fixed right-0 top-0 h-full z-40 transition-transform duration-300 ease-in-out",
        "w-80 bg-gradient-to-b from-slate-50 via-blue-50/30 to-violet-50/20",
        "dark:from-slate-900 dark:via-blue-950/30 dark:to-violet-950/20",
        "border-l border-blue-200/50 dark:border-blue-800/30",
        "shadow-2xl backdrop-blur-xl",
        "font-cairo flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full",
        className
      )}>
        
        {/* رأس الشريط الجانبي */}
        <div className="flex-shrink-0 p-6 border-b border-blue-200/30 dark:border-blue-800/20">
        
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full  flex items-center justify-center">
             
            </div>
           
          </div>
          
          <Button 
            onClick={handleNewChat}
            className={cn(
              "w-full justify-start gap-3 h-12 font-medium transition-all duration-200",
              "bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700",
              "shadow-lg hover:shadow-xl text-white border-0",
              "hover:scale-[1.02] active:scale-[0.98]"
            )}
            aria-label="إنشاء محادثة جديدة"
          >
            <PlusCircle className="h-5 w-5" />
            <span className="font-medium font-cairo">محادثة جديدة</span>
          </Button>
        </div>
        
        {/* شريط البحث */}
        <div className="flex-shrink-0 px-6 py-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
            <Input
              placeholder="البحث في المحادثات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "pr-10 h-10 transition-all duration-200 font-cairo",
                "bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm",
                "border-blue-200/50 dark:border-blue-700/30",
                "focus:border-blue-400 dark:focus:border-blue-500",
                "focus:ring-2 focus:ring-blue-200/50 dark:focus:ring-blue-800/50",
                "placeholder:text-slate-400 dark:placeholder:text-slate-500"
              )}
              aria-label="البحث في المحادثات"
            />
          </div>
        </div>
        
        {/* قائمة المحادثات - مع إعطاء مساحة مرنة */}
        <div className="flex-1 min-h-0 px-4">
          <ScrollArea className="h-full">
            <div className="space-y-6 pb-4">
              {Object.entries(groupedChats).map(([dateGroup, chats]) => (
                <div key={dateGroup}>
                  <div className="flex items-center gap-2 px-3 py-2 mb-3">
                    <Clock className="h-3 w-3 text-blue-500" />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-cairo">
                      {dateGroup}
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-blue-200/50 to-transparent dark:from-blue-700/30"></div>
                  </div>
                  
                  <div className="space-y-2">
                    {chats.map((chat) => (
                      <ChatItem
                        key={chat.id}
                        chat={chat}
                        isSelected={selectedChatId === chat.id}
                        isHovered={hoveredChatId === chat.id}
                        onSelect={() => handleChatSelect(chat.id)}
                        onHover={setHoveredChatId}
                        onArchive={() => handleArchive(chat.id)}
                        onDelete={() => handleDelete(chat.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* رسالة عدم وجود نتائج */}
              {filteredChats.length === 0 && searchQuery && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 flex items-center justify-center">
                    <MessageSquare className="h-8 w-8 text-blue-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 font-cairo">
                    لا توجد محادثات مطابقة
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 font-cairo">
                    جرب مصطلحات بحث مختلفة
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        
        <Separator className="bg-gradient-to-r from-transparent via-blue-200/50 to-transparent dark:via-blue-700/30" />
        
        {/* أزرار الإجراءات السفلية */}
        <div className="flex-shrink-0 p-4 space-y-2">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-3 h-10 transition-all duration-200",
              "hover:bg-blue-50/50 dark:hover:bg-blue-900/20",
              "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
            )}
            aria-label="عرض المحادثات المؤرشفة"
          >
            <Archive className="h-4 w-4" />
            <span className="font-cairo">المحفوظات</span>
            <Badge variant="secondary" className="mr-auto bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-0">
              12
            </Badge>
          </Button>
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-3 h-10 transition-all duration-200",
              "hover:bg-red-50/50 dark:hover:bg-red-900/20",
              "text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
            )}
            aria-label="عرض سلة المحذوفات"
          >
            <Trash2 className="h-4 w-4" />
            <span className="font-cairo">المحذوفات</span>
            <Badge variant="secondary" className="mr-auto bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-0">
              5
            </Badge>
          </Button>
        </div>
      </div>
    </>
  );
}

// مكون عنصر المحادثة المُحسن
interface ChatItemProps {
  chat: Chat;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (chatId: string | null) => void;
  onArchive: () => void;
  onDelete: () => void;
}

function ChatItem({ 
  chat, 
  isSelected, 
  isHovered,
  onSelect, 
  onHover,
  onArchive,
  onDelete
}: ChatItemProps) {
  return (
    <div
      className={cn(
        "group relative rounded-xl p-4 cursor-pointer transition-all duration-200",
        "hover:scale-[1.02] active:scale-[0.98]",
        isSelected 
          ? "bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-300/30 dark:border-blue-600/30 shadow-md backdrop-blur-sm" 
          : "hover:bg-white/40 dark:hover:bg-slate-800/40 border border-transparent hover:border-blue-200/30 dark:hover:border-blue-700/20 hover:shadow-lg backdrop-blur-sm"
      )}
      onClick={onSelect}
      onMouseEnter={() => onHover(chat.id)}
      onMouseLeave={() => onHover(null)}
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`محادثة: ${chat.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className={cn(
              "h-4 w-4 transition-colors",
              isSelected ? "text-blue-600" : "text-slate-400"
            )} />
            <h3 className={cn(
              "text-sm font-semibold truncate transition-colors font-cairo",
              isSelected 
                ? "text-blue-700 dark:text-blue-300" 
                : "text-slate-700 dark:text-slate-300"
            )}>
              {chat.title}
            </h3>
          </div>
          
          {chat.lastMessage && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2 leading-relaxed font-cairo">
              {chat.lastMessage}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium font-cairo">
              {chat.timestamp}
            </span>
          </div>
        </div>

        {/* قائمة الإجراءات */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 transition-all duration-200",
                "opacity-0 group-hover:opacity-100",
                "hover:bg-blue-100 dark:hover:bg-blue-900/30",
                "hover:scale-110",
                isHovered && "opacity-100"
              )}
              onClick={(e) => e.stopPropagation()}
              aria-label="خيارات المحادثة"
            >
              <MoreHorizontal className="h-4 w-4 text-slate-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-blue-200/30 dark:border-blue-700/30 font-cairo">
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); /* إعادة تسمية */ }}
              className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Edit3 className="h-4 w-4 ml-2" />
              إعادة تسمية
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onArchive(); }}
              className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Archive className="h-4 w-4 ml-2" />
              أرشفة
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4 ml-2" />
              حذف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}