'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sun, Moon, Bell, Plus, Menu } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { SidebarContent } from './sidebar'
import { useAuthStore } from '@/store/auth'
import { createClient } from '@/lib/supabase/client'

export function DashboardHeader() {
  const { theme, setTheme } = useTheme()
  const { profile, user }   = useAuthStore()
  const [unread, setUnread] = useState(0)

  const currentUserId = user?.id ?? profile?.id ?? ''

  const displayName = profile?.first_name ?? user?.firstName ?? profile?.email ?? ''
  const initials    = (profile?.first_name ?? user?.firstName ?? profile?.email ?? '?')
    .charAt(0).toUpperCase()

  // Загружаем начальное количество непрочитанных
  useEffect(() => {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(json => setUnread(json.unread ?? 0))
      .catch(() => {})
  }, [])

  // Realtime — новые уведомления
  useEffect(() => {
    if (!currentUserId) return
    const supabase = createClient()
    const channel = supabase
      .channel(`notif-badge:${currentUserId}`)
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'notifications',
          filter: `user_id=eq.${currentUserId}`,
        },
        () => setUnread(prev => prev + 1),
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [currentUserId])

  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0">
          <SheetTitle className="sr-only">Навигация</SheetTitle>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <Link href="/dashboard/notifications" onClick={() => setUnread(0)}>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full px-1 text-[10px]"
              >
                {unread > 99 ? '99+' : unread}
              </Badge>
            )}
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <Link href="/sell/new">
          <Button size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">Разместить проект</span>
            <span className="sm:hidden">Добавить</span>
          </Button>
        </Link>

        <Link href="/dashboard/settings">
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src={profile?.avatar_url ?? undefined} alt={displayName} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  )
}
