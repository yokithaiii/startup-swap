'use client'

import { UseFormReturn } from 'react-hook-form'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ListingFormData } from '@/lib/schemas/listing'
import { CATEGORIES } from '@/lib/constants'
import { TrendingUp, Users, BarChart3, DollarSign, ImageIcon } from 'lucide-react'

interface Props { form: UseFormReturn<ListingFormData, any> }

export function StepPreview({ form }: Props) {
  // watch() реактивен — обновляется при изменении формы
  const data = form.watch()
  const category = CATEGORIES.find(c => c.value === data.category)
  const symbol = data.currency === 'USD' ? '$' : data.currency === 'EUR' ? '€' : '₽'
  const profit = (data.mrr || 0) - (data.costHosting || 0) - (data.costOther || 0)
  const multiple = profit > 0 && data.price > 0 ? (data.price / (profit * 12)).toFixed(1) : '—'

  const fmt = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
    return n.toString()
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Проверьте данные перед публикацией. После отправки проект уйдёт на верификацию (24–48 часов).
      </p>

      <Card className="overflow-hidden">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-muted">
          {data.thumbnailUrl ? (
            <img
              src={data.thumbnailUrl}
              alt={data.title}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground/20">
                <ImageIcon className="h-12 w-12" strokeWidth={1} />
              </div>
            </div>
          )}
        </div>

        <CardContent className="pt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{category?.label}</Badge>
          </div>

          <div>
            <h2 className="text-xl font-bold">{data.title || '—'}</h2>
            {data.tagline && <p className="mt-1 text-muted-foreground">{data.tagline}</p>}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3">{data.description}</p>

          <div className="flex flex-wrap gap-1.5">
            {[...(data.techFrontend ?? []).slice(0, 3), ...(data.techBackend ?? []).slice(0, 2)].map(t => (
              <Badge key={t} variant="secondary" className="font-normal text-xs">{t}</Badge>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-3 border-t pt-4">
            {[
              { icon: TrendingUp, label: 'MRR',      value: `${symbol}${fmt(data.mrr || 0)}`,          color: 'text-emerald-500' },
              { icon: Users,      label: 'Польз.',    value: fmt(data.usersTotal || 0),                 color: 'text-blue-500' },
              { icon: BarChart3,  label: 'Трафик',    value: fmt(data.trafficMonthly || 0),             color: 'text-violet-500' },
              { icon: DollarSign, label: 'Мультипл',  value: `${multiple}x`,                           color: 'text-amber-500' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="text-center">
                <Icon className={`mx-auto mb-1 h-4 w-4 ${color}`} />
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-semibold text-sm text-foreground">{value}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <p className="text-2xl font-bold">{symbol}{(data.price || 0).toLocaleString()}</p>
              {data.priceNegotiable && <p className="text-xs text-muted-foreground">Торг уместен</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border border-dashed p-4 space-y-2 text-sm">
        <p className="font-medium">После публикации:</p>
        <ul className="space-y-1 text-muted-foreground">
          <li>• Проект уйдёт на верификацию (24–48 часов)</li>
          <li>• Вы получите уведомление на email</li>
          <li>• После одобрения проект появится в каталоге</li>
          <li>• Комиссия 10% только при успешной продаже</li>
        </ul>
      </div>
    </div>
  )
}
