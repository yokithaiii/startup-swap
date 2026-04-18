'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'cookie_consent'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Показываем только если ещё не принял
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className={cn(
      'fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl',
      'rounded-xl border bg-background/95 px-4 py-3 shadow-lg backdrop-blur-sm',
      'animate-in slide-in-from-bottom-4 duration-300',
    )}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <p className="flex-1 text-sm text-muted-foreground leading-relaxed">
          Мы используем файлы cookie для улучшения работы сайта и аналитики.{' '}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground transition-colors">
            Политика конфиденциальности
          </Link>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <Button size="sm" onClick={accept} className="h-8 text-xs">
            Принять
          </Button>
          <Button size="sm" variant="outline" onClick={decline} className="h-8 text-xs">
            Отклонить
          </Button>
        </div>
      </div>
    </div>
  )
}
