'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { ArrowRight, Send } from 'lucide-react'

const schema = z.object({
  amount:     z.coerce.number().positive('Укажите сумму'),
  message:    z.string().min(10, 'Минимум 10 символов'),
  conditions: z.string().optional(),
})
type FormData = z.infer<typeof schema>

interface OfferDialogProps {
  listingId:    string
  listingTitle: string
  askingPrice:  number
  currency:     string
}

export function OfferDialog({ listingId, listingTitle, askingPrice, currency }: OfferDialogProps) {
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState(false)
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₽'

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { amount: askingPrice },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/listings/${listingId}/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        toast.error(json.error ?? 'Не удалось отправить оффер')
        return
      }

      toast.success('Предложение отправлено!', {
        description: `Продавец получит уведомление и ответит вам в ближайшее время.`,
      })
      setOpen(false)
      reset()
    } catch {
      toast.error('Ошибка сети. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          Сделать предложение
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Предложение о покупке</DialogTitle>
          <p className="text-sm text-muted-foreground">{listingTitle}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="amount">Ваша цена</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                {symbol}
              </span>
              <Input
                id="amount"
                type="number"
                className="pl-7"
                {...register('amount')}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Запрашиваемая цена: {symbol}{askingPrice.toLocaleString()}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message">Сообщение продавцу</Label>
            <Textarea
              id="message"
              placeholder="Расскажите о себе и почему вас интересует этот проект..."
              rows={4}
              {...register('message')}
            />
            {errors.message && (
              <p className="text-xs text-destructive">{errors.message.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="conditions">Условия <span className="text-muted-foreground">(необязательно)</span></Label>
            <Textarea
              id="conditions"
              placeholder="Особые условия, сроки, этапы передачи..."
              rows={2}
              {...register('conditions')}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
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
        </form>
      </DialogContent>
    </Dialog>
  )
}
