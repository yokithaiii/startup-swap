'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Rocket, LayoutDashboard, Package, MessageSquare,
  Handshake, Settings, ArrowLeft, LogOut,
  Heart, MessageCircle, ShieldCheck,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useCountsStore } from '@/store/counts'

export function SidebarContent() {
  const pathname           = usePathname()
  const { signOut, profile, user } = useAuthStore()
  const { offers, messages, load, subscribeRealtime } = useCountsStore()
  const isAdmin    = profile?.role === 'ADMIN'
  const currentUserId = user?.id ?? profile?.id ?? ''

  useEffect(() => {
    if (!currentUserId) return
    load()
    const unsub = subscribeRealtime(currentUserId)
    return unsub
  }, [currentUserId, load, subscribeRealtime])

  const NAV = [
    { href: '/dashboard',            label: 'Обзор',        icon: LayoutDashboard, count: 0 },
    { href: '/dashboard/listings',   label: 'Мои проекты',  icon: Package,         count: 0 },
    { href: '/dashboard/favorites',  label: 'Избранное',    icon: Heart,           count: 0 },
    { href: '/dashboard/messages',   label: 'Сообщения',    icon: MessageCircle,   count: messages },
    { href: '/dashboard/offers',     label: 'Офферы',       icon: MessageSquare,   count: offers },
    { href: '/dashboard/deals',      label: 'Сделки',       icon: Handshake,       count: 0 },
    { href: '/dashboard/settings',   label: 'Настройки',    icon: Settings,        count: 0 },
  ]

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2">
          <Rocket className="h-5 w-5" />
          <span className="font-bold">StartupSwap</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-4">
        {NAV.map(({ href, label, icon: Icon, count }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {count > 0 && (
                <span className={cn(
                  'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold',
                  active
                    ? 'bg-background/20 text-background'
                    : 'bg-foreground text-background'
                )}>
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t p-4 space-y-1">
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-amber-500 hover:bg-amber-500/10 transition-colors"
          >
            <ShieldCheck className="h-4 w-4 shrink-0" />
            Админ-панель
          </Link>
        )}
        <Link
          href="/browse"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          На сайт
        </Link>
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </button>
      </div>
    </div>
  )
}

export function DashboardSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r bg-background lg:flex lg:flex-col sticky top-0 h-screen">
      <SidebarContent />
    </aside>
  )
}
