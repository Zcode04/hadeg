// components/navigation/Header.tsx
import { User, Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface HeaderProps {
  onLogin?: () => void;
  onLogout?: () => void;
  userName?: string;
  isLoggedIn?: boolean;
  currentModel?: string;
  onModelChange?: (model: string) => void;
  toggleSidebar?: () => void; // أُضيف هذا السطر
}

// Profile Dropdown Component
const ProfileDropdown = ({ userName, isLoggedIn, onLogin, onLogout }: {
  userName?: string;
  isLoggedIn?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}) => {
  const { theme } = useTheme();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-10 w-10 transition-all duration-300 backdrop-blur-sm border rounded-xl shadow-lg hover:shadow-xl hover:scale-105 group relative ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-blue-500/20 to-violet-600/20 hover:from-blue-500/30 hover:to-violet-600/30 text-white border-blue-300/30 hover:border-violet-300/40'
              : 'bg-gradient-to-r from-blue-100 to-violet-100 hover:from-blue-200 hover:to-violet-200 text-gray-700 border-blue-200 hover:border-violet-300'
          }`}
          aria-label="الملف الشخصي"
        >
          <User className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
          {isLoggedIn && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {isLoggedIn ? (
          <>
            <div className="px-3 py-2 text-sm text-right">
              <p className="font-medium">مرحباً، {userName || "المستخدم"}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-right cursor-pointer">
              <span>تسجيل الخروج</span>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={onLogin} className="text-right cursor-pointer">
            <span>تسجيل الدخول</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Model Selector Component
const ModelSelector = ({ currentModel, onModelChange }: {
  currentModel?: string;
  onModelChange?: (model: string) => void;
}) => {
  const { theme } = useTheme();
  
  const models = [
    { value: "Hadg-m1", label: "Hadg-m1" },
    { value: "hadeg", label: "hadeg-1.2" },
    { value: "hadeg", label: "hadeg-2" },
    { value: "hadeg", label: "hadeg-3" }
  ];

  return (
    <Select value={currentModel} onValueChange={onModelChange}>
      <SelectTrigger className={`w-23 sm:w-28 md:w-24 h-10 transition-all duration-300 backdrop-blur-sm border rounded-xl shadow-lg hover:shadow-xl hover:scale-105 text-xs ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-blue-500/20 to-violet-600/20 hover:from-blue-500/30 hover:to-violet-600/30 text-white border-blue-300/30 hover:border-violet-300/40'
          : 'bg-gradient-to-r from-blue-100 to-violet-100 hover:from-blue-200 hover:to-violet-200 text-gray-700 border-blue-200 hover:border-violet-300'
      }`}>
        <SelectValue placeholder="اختر النموذج" />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.value} value={model.value} className="text-xs">
            {model.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export function Header({ 
  onLogin, 
  onLogout, 
  userName, 
  isLoggedIn = false,
  currentModel = "Hadg-m1",
  onModelChange,
  toggleSidebar // أُضيف هذا
}: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 transition-all duration-500 ${theme === 'dark' ? '' : ''}`} />
        <div className="absolute inset-0 backdrop-blur-sm" />
        <div className={`absolute bottom-0 w-full h-px transition-all duration-500 ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-transparent via-blue-400/30 to-violet-400/30'
            : 'bg-gradient-to-r from-transparent via-blue-300/50 to-violet-300/50'
        }`} />
        <div className="relative px-2 sm:px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Sidebar Toggle Button - أُضيف هذا القسم */}
          {toggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className={`h-10 w-10 transition-all duration-300 backdrop-blur-sm border rounded-xl shadow-lg hover:shadow-xl hover:scale-105 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-500/20 to-violet-600/20 hover:from-blue-500/30 hover:to-violet-600/30 text-white border-blue-300/30 hover:border-violet-300/40'
                  : 'bg-gradient-to-r from-blue-100 to-violet-100 hover:from-blue-200 hover:to-violet-200 text-gray-700 border-blue-200 hover:border-violet-300'
              }`}
              aria-label="تبديل الشريط الجانبي"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}

          <div className="flex-1"></div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 rtl:space-x-reverse">
          
            <ModelSelector currentModel={currentModel} onModelChange={onModelChange} />

            {/* Theme Toggle with space before Profile */}
            <div className="ml-1 sm:ml-2 rtl:mr-1 sm:rtl:mr-2 ">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className={`h-10 w-10 transition-all duration-300 backdrop-blur-sm border rounded-xl shadow-lg hover:shadow-xl hover:scale-105 group ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-500/20 to-violet-600/20 hover:from-blue-500/30 hover:to-violet-600/30 text-white border-blue-300/30 hover:border-violet-300/40'
                    : 'bg-gradient-to-r from-blue-100 to-violet-100 hover:from-blue-200 hover:to-violet-200 text-gray-700 border-blue-200 hover:border-violet-300'
                }`}
                aria-label="تغيير المظهر"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                ) : (
                  <Moon className="h-4 w-4 group-hover:-rotate-12 transition-transform duration-300" />
                )}
              </Button>
            </div>

            {/* Profile Dropdown */}
            <ProfileDropdown 
              userName={userName}
              isLoggedIn={isLoggedIn}
              onLogin={onLogin}
              onLogout={onLogout}
            />
          </div>
        </div>
      </div>
    </header>
  );
}