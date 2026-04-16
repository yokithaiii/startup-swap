'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import { createClient } from '@/lib/supabase/client'
import {
  MessageCircle, Send, ArrowLeft,
  ExternalLink, Package,
} from 'lucide-react'

/* ─── Types ──────────────────────────────────────────────── */

interface ConvUser {
  id:         string
  first_name: string | null
  last_name:  string | null
  avatar_url: string | null
}

interface Conversation {
  id:          string
  listing:     { id: string; title: string; slug: string; thumbnail_url: string | null } | null
  buyer:       ConvUser | null
  seller:      ConvUser | null
  lastMessage: { content: string; sender_id: string; created_at: string } | null
  unreadCount: number
  updatedAt:   string
}

interface Message {
  id:         string
  content:    string
  sender_id:  string
  created_at: string
  sender:     ConvUser | null
}

/* ─── Helpers ────────────────────────────────────────────── */

function displayName(u: ConvUser | null) {
  if (!u) return 'Пользователь'
  return [u.first_name, u.last_name].filter(Boolean).join(' ') || 'Пользователь'
}

function initials(u: ConvUser | null) {
  return displayName(u).charAt(0).toUpperCase()
}

function formatTime(iso: string) {
  const d    = new Date(iso)
  const now  = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60_000)      return 'только что'
  if (diff < 3_600_000)   return `${Math.floor(diff / 60_000)} мин.`
  if (diff < 86_400_000)  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  if (diff < 604_800_000) return d.toLocaleDateString('ru-RU', { weekday: 'short' })
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

function formatMessageTime(iso: string) {
  return new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

function formatDateDivider(iso: string) {
  const d    = new Date(iso)
  const now  = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 86_400_000)  return 'Сегодня'
  if (diff < 172_800_000) return 'Вчера'
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
}

/* ─── ConvItem ───────────────────────────────────────────── */

function ConvItem({
  conv, active, currentUserId, onClick,
}: {
  conv: Conversation
  active: boolean
  currentUserId: string
  onClick: () => void
}) {
  const other = conv.buyer?.id === currentUserId ? conv.seller : conv.buyer

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60',
        active && 'bg-muted',
      )}
    >
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={other?.avatar_url ?? undefined} />
        <AvatarFallback>{initials(other)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold">{displayName(other)}</p>
          {conv.lastMessage && (
            <span className="shrink-0 text-[11px] text-muted-foreground">
              {formatTime(conv.lastMessage.created_at)}
            </span>
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground mt-0.5">
          {conv.listing?.title ?? 'Проект удалён'}
        </p>
        {conv.lastMessage && (
          <p className="truncate text-xs text-muted-foreground mt-0.5">
            {conv.lastMessage.sender_id === currentUserId ? 'Вы: ' : ''}
            {conv.lastMessage.content}
          </p>
        )}
      </div>
    </button>
  )
}

/* ─── ChatWindow ─────────────────────────────────────────── */

function ChatWindow({
  convId,
  currentUserId,
  onNewMessage,
}: {
  convId:        string
  currentUserId: string
  /** Колбэк — уведомляем родителя о новом входящем сообщении для обновления превью */
  onNewMessage:  (convId: string, msg: Message) => void
}) {
  const [messages, setMessages]   = useState<Message[]>([])
  const [conv, setConv]           = useState<any>(null)
  const [otherUser, setOtherUser] = useState<ConvUser | null>(null)
  const [loading, setLoading]     = useState(true)
  const [text, setText]           = useState('')
  const [sending, setSending]     = useState(false)
  const bottomRef                 = useRef<HTMLDivElement>(null)
  const textareaRef               = useRef<HTMLTextAreaElement>(null)
  // Храним id оптимистичных сообщений чтобы не дублировать при получении через Realtime
  const pendingIds                = useRef<Set<string>>(new Set())

  // ── Начальная загрузка ──────────────────────────────────
  const load = useCallback(async () => {
    const res  = await fetch(`/api/conversations/${convId}/messages`)
    const json = await res.json()
    setMessages(json.messages ?? [])
    setConv(json.conversation)
    setOtherUser(json.otherUser)
    setLoading(false)
  }, [convId])

  useEffect(() => {
    setLoading(true)
    setText('')
    pendingIds.current.clear()
    load()
  }, [load])

  // ── Supabase Realtime ───────────────────────────────────
  useEffect(() => {
    if (loading) return

    const supabase = createClient()

    const channel = supabase
      .channel(`messages:${convId}`)
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'messages',
          filter: `conversation_id=eq.${convId}`,
        },
        async (payload) => {
          const raw = payload.new as any

          // Если это наше оптимистичное сообщение — заменяем temp на реальное
          // Ищем temp по совпадению sender_id + content + близкому времени
          setMessages(prev => {
            const tempIdx = prev.findIndex(
              m =>
                m.id.startsWith('temp-') &&
                m.sender_id === raw.sender_id &&
                m.content   === raw.content,
            )
            if (tempIdx !== -1) {
              // Заменяем temp на реальное сообщение
              const next = [...prev]
              next[tempIdx] = {
                id:         raw.id,
                content:    raw.content,
                sender_id:  raw.sender_id,
                created_at: raw.created_at,
                sender:     null,
              }
              return next
            }

            // Входящее сообщение от собеседника — добавляем
            if (prev.some(m => m.id === raw.id)) return prev // дедупликация
            const incoming: Message = {
              id:         raw.id,
              content:    raw.content,
              sender_id:  raw.sender_id,
              created_at: raw.created_at,
              sender:     null,
            }
            // setTimeout чтобы не вызывать setState родителя во время рендера
            setTimeout(() => onNewMessage(convId, incoming), 0)
            return [...prev, incoming]
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [convId, loading, onNewMessage])

  // ── Scroll to bottom ────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Отправка ────────────────────────────────────────────
  const send = async () => {
    const content = text.trim()
    if (!content || sending) return

    const tempId = `temp-${Date.now()}`
    const temp: Message = {
      id:         tempId,
      content,
      sender_id:  currentUserId,
      created_at: new Date().toISOString(),
      sender:     null,
    }

    setMessages(prev => [...prev, temp])
    setText('')
    setSending(true)

    try {
      const res  = await fetch(`/api/conversations/${convId}/messages`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ content }),
      })
      const json = await res.json()

      if (!res.ok) {
        // Откатываем оптимистичное сообщение
        setMessages(prev => prev.filter(m => m.id !== tempId))
      } else {
        // Realtime заменит temp на реальное — но если Realtime не пришёл быстро,
        // заменяем сами чтобы не было дублей
        setMessages(prev =>
          prev.map(m => m.id === tempId ? { ...json.message } : m),
        )
      }
    } catch {
      setMessages(prev => prev.filter(m => m.id !== tempId))
    } finally {
      setSending(false)
      textareaRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  // ── Группировка по датам ────────────────────────────────
  const grouped: { date: string; messages: Message[] }[] = []
  messages.forEach(msg => {
    const date = new Date(msg.created_at).toDateString()
    const last = grouped[grouped.length - 1]
    if (last?.date === date) last.messages.push(msg)
    else grouped.push({ date, messages: [msg] })
  })

  // ── Skeleton ────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="border-b px-6 py-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-1 h-3 w-24" />
        </div>
        <div className="flex-1 space-y-4 p-6">
          {[1, 2, 3].map(i => (
            <div key={i} className={cn('flex gap-3', i % 2 === 0 && 'flex-row-reverse')}>
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <Skeleton className="h-12 w-48 rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col min-h-0">

      {/* Header */}
      <div className="flex items-center gap-3 border-b px-6 py-4 shrink-0">
        <Link href={`/dashboard/users/${otherUser?.id}`}>
          <Avatar className="h-9 w-9 transition-opacity hover:opacity-80">
            <AvatarImage src={otherUser?.avatar_url ?? undefined} />
            <AvatarFallback>{initials(otherUser)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            href={`/dashboard/users/${otherUser?.id}`}
            className="font-semibold leading-tight hover:underline underline-offset-2"
          >
            {displayName(otherUser)}
          </Link>
          {conv?.listing && (
            <Link
              href={`/listing/${conv.listing.slug}`}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {conv.listing.title}
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>
        {conv?.listing?.thumbnail_url && (
          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md border">
            <Image src={conv.listing.thumbnail_url} alt="" fill className="object-cover" />
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
            <MessageCircle className="mb-2 h-8 w-8 opacity-20" strokeWidth={1} />
            <p className="text-sm">Начните диалог</p>
          </div>
        ) : (
          grouped.map(group => (
            <div key={group.date}>
              {/* Date divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 border-t border-dashed" />
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatDateDivider(group.messages[0].created_at)}
                </span>
                <div className="flex-1 border-t border-dashed" />
              </div>

              <div className="space-y-2">
                {group.messages.map((msg, i) => {
                  const isMe    = msg.sender_id === currentUserId
                  const prev    = group.messages[i - 1]
                  const next    = group.messages[i + 1]
                  const isFirst = !prev || prev.sender_id !== msg.sender_id
                  const isLast  = !next || next.sender_id !== msg.sender_id
                  const isTemp  = msg.id.startsWith('temp-')

                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex items-end gap-2',
                        isMe ? 'flex-row-reverse' : 'flex-row',
                      )}
                    >
                      {/* Avatar — только у первого в группе собеседника */}
                      <div className="w-7 shrink-0">
                        {!isMe && isFirst && (
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={otherUser?.avatar_url ?? undefined} />
                            <AvatarFallback className="text-[10px]">
                              {initials(otherUser)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>

                      <div className={cn('flex flex-col gap-0.5 max-w-[70%]', isMe && 'items-end')}>
                        <div
                          className={cn(
                            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed transition-opacity',
                            // Мои сообщения — уголок справа снизу только у последнего
                            isMe && isFirst && !isLast  && 'rounded-br-md',
                            isMe && !isFirst && !isLast && 'rounded-r-md',
                            isMe && !isFirst && isLast  && 'rounded-br-sm rounded-r-md',
                            isMe && isFirst && isLast   && 'rounded-br-sm',
                            isMe ? 'bg-foreground text-background' : 'bg-muted text-foreground',
                            // Чужие сообщения — уголок слева снизу только у последнего
                            !isMe && isFirst && !isLast  && 'rounded-bl-md',
                            !isMe && !isFirst && !isLast && 'rounded-l-md',
                            !isMe && !isFirst && isLast  && 'rounded-bl-sm rounded-l-md',
                            !isMe && isFirst && isLast   && 'rounded-bl-sm',
                            isTemp && 'opacity-60',
                          )}
                        >
                          {msg.content}
                        </div>
                        {/* Время — только у последнего в группе */}
                        {isLast && (
                          <span className="text-[10px] text-muted-foreground px-1">
                            {isTemp ? 'отправка...' : formatMessageTime(msg.created_at)}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t px-4 py-3 shrink-0">
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Написать сообщение... (Enter — отправить, Shift+Enter — новая строка)"
            className="min-h-[44px] max-h-32 resize-none text-sm"
            rows={1}
          />
          <Button
            size="icon"
            onClick={send}
            disabled={!text.trim() || sending}
            className="h-11 w-11 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ─── MessagesPage ───────────────────────────────────────── */

export default function MessagesPage() {
  const searchParams                = useSearchParams()
  const { user, profile }           = useAuthStore()
  const [convs, setConvs]           = useState<Conversation[]>([])
  const [loading, setLoading]       = useState(true)
  const [activeId, setActiveId]     = useState<string | null>(searchParams.get('conv'))
  const [mobileOpen, setMobileOpen] = useState(!!searchParams.get('conv'))

  const currentUserId = user?.id ?? profile?.id ?? ''

  // ── Загрузка списка чатов ───────────────────────────────
  useEffect(() => {
    fetch('/api/conversations')
      .then(r => r.json())
      .then(json => {
        const list: Conversation[] = json.conversations ?? []
        setConvs(list)
        const fromUrl = searchParams.get('conv')
        if (fromUrl && list.find(c => c.id === fromUrl)) {
          setActiveId(fromUrl)
        } else if (!activeId && list.length > 0) {
          setActiveId(list[0].id)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Realtime: новые сообщения в любом чате ──────────────
  // Обновляем превью последнего сообщения в списке чатов
  useEffect(() => {
    if (!currentUserId || loading) return

    const supabase = createClient()

    // Подписываемся на все сообщения во всех чатах пользователя
    // Фильтруем на клиенте — Supabase Realtime не поддерживает JOIN-фильтры
    const channel = supabase
      .channel(`conv-list:${currentUserId}`)
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'messages',
        },
        (payload) => {
          const raw = payload.new as any
          setConvs(prev => {
            const idx = prev.findIndex(c => c.id === raw.conversation_id)
            if (idx === -1) return prev // не наш чат
            const next = [...prev]
            next[idx] = {
              ...next[idx],
              lastMessage: {
                content:    raw.content,
                sender_id:  raw.sender_id,
                created_at: raw.created_at,
              },
              updatedAt: raw.created_at,
            }
            // Поднимаем чат с новым сообщением наверх списка
            const [updated] = next.splice(idx, 1)
            return [updated, ...next]
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUserId, loading])

  // ── Колбэк из ChatWindow для обновления превью ──────────
  const handleNewMessage = useCallback((convId: string, msg: Message) => {
    setConvs(prev => {
      const idx = prev.findIndex(c => c.id === convId)
      if (idx === -1) return prev
      const next = [...prev]
      next[idx] = {
        ...next[idx],
        lastMessage: {
          content:    msg.content,
          sender_id:  msg.sender_id,
          created_at: msg.created_at,
        },
        updatedAt: msg.created_at,
      }
      const [updated] = next.splice(idx, 1)
      return [updated, ...next]
    })
  }, [])

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border bg-background">

      {/* ── Sidebar ── */}
      <div className={cn(
        'flex w-80 shrink-0 flex-col border-r',
        mobileOpen  && 'hidden lg:flex',
        !mobileOpen && 'flex',
      )}>
        <div className="flex items-center justify-between border-b px-4 py-4">
          <h2 className="font-semibold">Сообщения</h2>
          {convs.length > 0 && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {convs.length}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="space-y-px p-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3 rounded-lg p-3">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : convs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <MessageCircle className="mb-2 h-8 w-8 text-muted-foreground/20" strokeWidth={1} />
              <p className="text-sm font-medium">Нет сообщений</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Задайте вопрос продавцу на странице проекта
              </p>
              <Link href="/browse" className="mt-4">
                <Button variant="outline" size="sm">Перейти в каталог</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {convs.map(conv => (
                <ConvItem
                  key={conv.id}
                  conv={conv}
                  active={conv.id === activeId}
                  currentUserId={currentUserId}
                  onClick={() => {
                    setActiveId(conv.id)
                    setMobileOpen(true)
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Chat area ── */}
      <div className={cn(
        'flex flex-1 flex-col min-w-0',
        !mobileOpen && 'hidden lg:flex',
        mobileOpen  && 'flex',
      )}>
        {/* Mobile back */}
        <button
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 border-b px-4 py-3 text-sm text-muted-foreground hover:text-foreground lg:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад
        </button>

        {activeId ? (
          <ChatWindow
            key={activeId}
            convId={activeId}
            currentUserId={currentUserId}
            onNewMessage={handleNewMessage}
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center text-muted-foreground">
            <Package className="mb-3 h-10 w-10 opacity-20" strokeWidth={1} />
            <p className="font-medium">Выберите чат</p>
            <p className="mt-1 text-sm">или задайте вопрос продавцу на странице проекта</p>
          </div>
        )}
      </div>
    </div>
  )
}
