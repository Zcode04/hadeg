// app/layout.tsx
import './globals.css'
import { Tajawal } from 'next/font/google'

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700'], // يمكنك تغيير الأوزان حسب حاجتك
  display: 'swap',
})

export const metadata = {
  title: 'الحاذگ',
  description: 'نموذج ذكاء اصطناعي متكامل وناطق با لهجة الحسانية الموريتاني',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.className} bg-gray-950 text-white`}>
        {children}
      </body>
    </html>
  )
}