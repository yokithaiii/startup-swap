'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight } from 'lucide-react'

interface OfferDialogProps {
  listingTitle: string
  askingPrice: number
  currency: string
}

export function OfferDialog({ listingTitle, askingPrice, currency }: OfferDialogProps) {
  const [amount, setAmount] = useState(askingPrice.toString())
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₽'

  return (
    <Dialog>
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

        <form className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="amount">Ваша цена</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                {symbol}
              </span>
              <Input
                id="amount"
                type="number"
                className="pl-7"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Запрашиваемая цена: {symbol}{askingPrice.toLocaleString()}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Сообщение продавцу</Label>
            <Textarea
              id="message"
              placeholder="Расскажите о себе и почему вас интересует этот проект..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="conditions">Условия (необязательно)</Label>
            <Textarea
              id="conditions"
              placeholder="Особые условия, сроки, этапы передачи..."
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">
              Отправить предложение
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
