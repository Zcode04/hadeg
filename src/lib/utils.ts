import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// تنسيق الوقت
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

// تنسيق التاريخ
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// إنشاء معرف فريد
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// تحقق من صحة النص
export function isValidMessage(message: string): boolean {
  return message.trim().length > 0 && message.trim().length <= 4000;
}

// تنظيف النص
export function sanitizeMessage(message: string): string {
  return message.trim().replace(/\s+/g, ' ');
}