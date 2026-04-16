'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { CATEGORIES } from '@/lib/constants'
import { Package, Users, MessageSquare, Clock, ArrowRight, TrendingUp } from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
  ACTIVE:         'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  PENDING_REVIEW: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  DRAFT:          'text-muted-foreground bg-muted border-border',
  SOLD:           'text-blue-500 bg-blue-500/10 border-blue-500/20',
  REJECTED:       'text-destructive bg-destructive/10 border-destructive/20',
}
const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Активен', PENDING_REVIEW: 'На проверке',
  DRAFT: 'Черновик', SOLD: 'Продан', REJECTED: 'Отклонён',
}

export default function AdminPage() {
  const [stats, setStats]           = useState<any>(null)
  const [recentListings, setRecent] = useState<any[]>([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(json => {
        setStats(json.stats)
        setRecent(json.recentListings ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  const tiles = [
    { icon: Clock,        color: 'text-amber-500',   label: 'На проверке', value: stats?.pending,  href: '/admin/listings' },
    { icon: Package,      color: 'text-emerald-500', label: 'Активных',    value: stats?.active,   href: '/admin/listings?status=ACTIVE' },
    { icon: Users,        color: 'text-blue-500',    label: 'Участников',  value: stats?.users,    href: '/admin/users' },
    { icon: MessageSquare,color: 'text-violet-500',  label: 'Офферов',     value: stats?.offers,   href: '#' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Панель управления</h1>
        <p className="mt-1 text-sm text-muted-foreground">Обзор платформы StartupSwap</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map(({ icon: Icon, color, label, value, href }) => (
          <Link key={label} href={href}>
            <Card className="transition-shadow hover:shadow-md cursor-pointer">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted/50">
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  {loading
                    ? <Skeleton className="mt-1 h-6 w-12" />
                    : <p className="text-2xl font-bold">{value ?? 0}</p>
                  }
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent listings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold">Последние проекты</CardTitle>
          <Link href="/admin/listings" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            Все <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-px">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-4 px-6 py-3">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="ml-auto h-5 w-20" />
                </div>
              ))}
            </div>
          ) : recentListings.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">Нет листингов</p>
          ) : (
            <div className="divide-y">
              {recentListings.map(l => {
                const cat    = CATEGORIES.find(c => c.value === l.category)
                const symbol = l.currency === 'USD' ? '$' : l.currency === 'EUR' ? '€' : '₽'
                return (
                  <div key={l.id} className="flex items-center gap-4 px-6 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{l.title}</p>
                      <p className="text-xs text-muted-foreground">{cat?.label} · {symbol}{Number(l.price).toLocaleString()}</p>
                    </div>
                    <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[l.status] ?? ''}`}>
                      {STATUS_LABELS[l.status] ?? l.status}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
