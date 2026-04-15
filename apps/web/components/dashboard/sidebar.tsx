'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Rocket, LayoutDashboard, Package, MessageSquare, Handshake, Settings, ArrowLeft, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

const NAV = [
  { href: '/dashboard', label: 'Обзор', icon: LayoutDashboard },
  { href: '/dashboard/listings', label: 'Мои проекты', icon: Package },
  { href: '/dashboard/offers', label: 'Офферы', icon: MessageSquare },
  { href: '/dashboard/deals', label: 'Сделки', icon: Handshake },
  { href: '/dashboard/settings', label: 'Настройки', icon: Settings },
]

export function SidebarContent() {
  const pathname = usePathname()
  const { signOut } = useAuthStore()

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
        {NAV.map(({ href, label, icon: Icon }) => {
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
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Back to site + Sign out */}
      <div className="border-t p-4 space-y-1">
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
