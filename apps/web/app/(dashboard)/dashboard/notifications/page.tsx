'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  MessageSquare, DollarSign, CheckCircle2,
  Eye, Package, Bell, BellOff, Trash2
} from 'lucide-react'

type NotificationType = 'offer' | 'deal' | 'view' | 'verification' | 'message' | 'system'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  time: string
  read: boolean
  link?: string
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'offer',
    title: 'Новый оффер',
    message: 'Дмитрий В. предложил $68 000 за «AI-Powered Content Generator SaaS»',
    time: '2 часа назад',
    read: false,
    link: '/dashboard/offers',
  },
  {
    id: '2',
    type: 'offer',
    title: 'Новый оффер',
    message: 'Анна К. предложила $55 000 за «AI-Powered Content Generator SaaS»',
    time: '5 часов назад',
    read: false,
    link: '/dashboard/offers',
  },
  {
    id: '3',
    type: 'deal',
    title: 'Оффер принят',
    message: 'Ваш оффер на «E-Commerce Analytics Dashboard» был принят. Сделка начата.',
    time: '1 день назад',
    read: false,
    link: '/dashboard/deals',
  },
  {
    id: '4',
    type: 'verification',
    title: 'Проект верифицирован',
    message: '«AI-Powered Content Generator SaaS» прошёл верификацию и опубликован в каталоге.',
    time: '3 дня назад',
    read: true,
  },
  {
    id: '5',
    type: 'view',
    title: 'Рост просмотров',
    message: '«E-Commerce Analytics Dashboard» просмотрели 120 раз за последние 24 часа.',
    time: '4 дня назад',
    read: true,
  },
  {
    id: '6',
    type: 'message',
    title: 'Новое сообщение',
    message: 'Сергей М. задал вопрос по проекту «AI-Powered Content Generator SaaS».',
    time: '5 дней назад',
    read: true,
  },
  {
    id: '7',
    type: 'system',
    title: 'Добро пожаловать!',
    message: 'Ваш аккаунт успешно создан. Разместите первый проект и начните получать офферы.',
    time: '7 дней назад',
    read: true,
  },
]

const TYPE_CONFIG: Record<NotificationType, { icon: React.ElementType; color: string; bg: string }> = {
  offer:        { icon: DollarSign,   color: 'text-violet-500',  bg: 'bg-violet-500/10' },
  deal:         { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  view:         { icon: Eye,          color: 'text-blue-500',    bg: 'bg-blue-500/10' },
  verification: { icon: Package,      color: 'text-amber-500',   bg: 'bg-amber-500/10' },
  message:      { icon: MessageSquare,color: 'text-sky-500',     bg: 'bg-sky-500/10' },
  system:       { icon: Bell,         color: 'text-muted-foreground', bg: 'bg-muted' },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = notifications.filter(n => !n.read).length

  const visible = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  const markRead = (id: string) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  const remove = (id: string) =>
    setNotifications(prev => prev.filter(n => n.id !== id))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Уведомления</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} непрочитанных` : 'Всё прочитано'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <BellOff className="mr-2 h-4 w-4" />
            Прочитать все
          </Button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-lg border p-1 w-fit">
        {(['all', 'unread'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              filter === f
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {f === 'all' ? 'Все' : 'Непрочитанные'}
            {f === 'unread' && unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 h-4 min-w-4 rounded-full px-1 text-[10px]">
                {unreadCount}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
          <Bell className="mb-3 h-10 w-10 text-muted-foreground/30" strokeWidth={1} />
          <p className="font-medium">Нет уведомлений</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {filter === 'unread' ? 'Все уведомления прочитаны' : 'Пока ничего нет'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map(n => {
            const cfg = TYPE_CONFIG[n.type]
            const Icon = cfg.icon
            return (
              <div
                key={n.id}
                className={cn(
                  'group flex items-start gap-4 rounded-xl border p-4 transition-colors',
                  !n.read && 'bg-muted/40'
                )}
                onClick={() => markRead(n.id)}
              >
                {/* Icon */}
                <div className={cn('mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full', cfg.bg)}>
                  <Icon className={cn('h-4 w-4', cfg.color)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn('text-sm font-medium', !n.read && 'font-semibold')}>
                      {n.title}
                    </p>
                    <div className="flex shrink-0 items-center gap-2">
                      {!n.read && (
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</span>
                    </div>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">{n.message}</p>
                </div>

                {/* Delete */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  onClick={e => { e.stopPropagation(); remove(n.id) }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
