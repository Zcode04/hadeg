'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button";

import { useRouter } from 'next/navigation'

const words = [
  'لنتعلم',
  'لنحلل',
  'لنكتشف',
  'لنبرمج',
  'لنبتكر',
  'لنبدع',
  'لنرتقي',
  'لنفكر بذكاء',
  'لنخترع'
]

export function WelcomeScreen() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-screen flex flex-col   items-center justify-center text-center px-4">
      <Image src="/kan.svg" alt="Kan Logo" width={700} height={700} className="mb-6" />
      <h1 className="text-2xl font-semibold mb-4 transition-all duration-500">
        {words[currentWordIndex]}
      </h1>
      <Button onClick={() => router.push('/chat')} className="mt-4  hover:bg-blue-400 px-6 py-2 text-lg">
        ابدأ
      </Button>
    </div>
  )
}