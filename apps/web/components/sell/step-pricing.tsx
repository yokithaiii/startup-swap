'use client'

import { UseFormReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { ListingFormData } from '@/lib/schemas/listing'
import { cn } from '@/lib/utils'
import { TrendingUp, Sparkles } from 'lucide-react'

interface Props { form: UseFormReturn<ListingFormData, any> }

const CURRENCIES = [
  { value: 'USD', label: 'USD', symbol: '$' },
  { value: 'EUR', label: 'EUR', symbol: '€' },
  { value: 'RUB', label: 'RUB', symbol: '₽' },
]

export function StepPricing({ form }: Props) {
  const { register, watch, setValue, formState: { errors } } = form
  const currency = watch('currency')
  const price = Number(watch('price')) || 0
  const mrr = Number(watch('mrr')) || 0
  const costHosting = Number(watch('costHosting')) || 0
  const costOther = Number(watch('costOther')) || 0
  const profit = mrr - costHosting - costOther
  const multiple = profit > 0 && price > 0 ? (price / (profit * 12)).toFixed(1) : null
  const suggestedMin = profit > 0 ? Math.round(profit * 12 * 2) : null
  const suggestedMax = profit > 0 ? Math.round(profit * 12 * 4) : null
  const symbol = CURRENCIES.find(c => c.value === currency)?.symbol ?? '$'

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Цена проекта</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Установите цену — мы подскажем рыночный диапазон на основе ваших метрик
        </p>
      </div>

      {/* Currency */}
      <div className="space-y-3">
        <Label>Валюта</Label>
        <div className="flex gap-2">
          {CURRENCIES.map(c => (
            <button
              key={c.value}
              type="button"
              onClick={() => setValue('currency', c.value as ListingFormData['currency'])}
              className={cn(
                'rounded-lg border px-5 py-2.5 text-sm font-medium transition-all',
                currency === c.value
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price input */}
      <div className="space-y-3">
        <Label htmlFor="price">
          Цена <span className="text-destructive">*</span>
        </Label>
        <div className="relative max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{symbol}</span>
          <Input
            id="price"
            type="number"
            min={0}
            placeholder="0"
            className="pl-7 text-xl font-semibold h-12"
            {...register('price')}
          />
        </div>
        {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}

        {multiple && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            Мультипл: <span className="font-semibold text-foreground">{multiple}x</span> от годовой прибыли
          </div>
        )}
      </div>

      {/* AI suggestion */}
      {suggestedMin && suggestedMax && (
        <div className="rounded-lg border border-dashed p-4 space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-amber-500" />
            AI-оценка на основе ваших метрик
          </div>
          <p className="text-sm text-muted-foreground">
            Рекомендуемый диапазон:{' '}
            <span className="font-semibold text-foreground">
              {symbol}{suggestedMin.toLocaleString()} — {symbol}{suggestedMax.toLocaleString()}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            2–4x годовой прибыли · {symbol}{profit.toLocaleString()}/мес чистой прибыли
          </p>
        </div>
      )}

      {/* Negotiable */}
      <div className="flex items-center gap-3">
        <Checkbox
          id="negotiable"
          checked={watch('priceNegotiable')}
          onCheckedChange={v => setValue('priceNegotiable', !!v)}
        />
        <Label htmlFor="negotiable" className="cursor-pointer font-normal text-sm">
          Цена договорная — готов рассматривать предложения
        </Label>
      </div>
    </div>
  )
}
