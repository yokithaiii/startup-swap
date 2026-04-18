'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { MessageCircle, Send } from 'lucide-react'

interface AskSellerDialogProps {
  sellerName:   string
  listingTitle: string
  listingId:    string
  sellerId:     string
  fullWidth?:   boolean
}

export function AskSellerDialog({
  sellerName,
  listingTitle,
  listingId,
  sellerId,
  fullWidth = false,
}: AskSellerDialogProps) {
  const router          = useRouter()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error('Напишите сообщение')
      return
    }

    setLoading(true)
    try {
      const res  = await fetch('/api/conversations', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ listingId, sellerId, firstMessage: message.trim() }),
      })
      const json = await res.json()

      if (res.status === 401) {
        toast.error('Войдите, чтобы написать продавцу')
        router.push(`/sign-in?redirectTo=/listing/${listingId}`)
        return
      }

      if (!res.ok) {
        toast.error(json.error ?? 'Не удалось отправить сообщение')
        return
      }

      setOpen(false)
      setMessage('')
      toast.success('Сообщение отправлено', {
        description: `Переходим в чат с ${sellerName}`,
        duration: 2000,
      })
      router.push(`/dashboard/messages?conv=${json.conversationId}`)
    } catch {
      toast.error('Ошибка сети')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={fullWidth ? 'w-full' : undefined}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Задать вопрос продавцу
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Вопрос продавцу</DialogTitle>
          <DialogDescription>
            Ваше сообщение будет отправлено{' '}
            <span className="font-medium text-foreground">{sellerName}</span>{' '}
            по проекту «{listingTitle}»
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <Label htmlFor="message">Сообщение</Label>
          <Textarea
            id="message"
            placeholder="Напишите ваш вопрос..."
            rows={5}
            className="mt-1.5"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && e.ctrlKey) handleSend()
            }}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">Ctrl+Enter — отправить</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Отмена
          </Button>
          <Button onClick={handleSend} disabled={loading || !message.trim()}>
            {loading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Отправка...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Отправить
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
