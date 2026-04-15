import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, CheckCircle2, Circle, Clock } from 'lucide-react'
import Link from 'next/link'

const deals = [
  {
    id: '1',
    listing: 'E-Commerce Analytics Dashboard',
    slug: 'ecommerce-analytics-dashboard',
    price: 115000,
    buyer: 'Сергей М.',
    role: 'seller' as const,
    status: 'IN_PROGRESS',
    startedAt: '10 апреля 2024',
    milestones: [
      { title: 'Передача кода и доступов', pct: 30, done: true },
      { title: 'Документация и обучение', pct: 30, done: false },
      { title: 'Миграция и настройка', pct: 30, done: false },
      { title: 'Поддержка 30 дней', pct: 10, done: false },
    ],
  },
]

const STATUS: Record<string, { label: string; className: string }> = {
  IN_PROGRESS: { label: 'В процессе', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  COMPLETED: { label: 'Завершена', className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  ESCROW_PENDING: { label: 'Эскроу', className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  DISPUTED: { label: 'Спор', className: 'bg-destructive/10 text-destructive border-destructive/20' },
}

export default function DealsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Сделки</h1>
        <p className="mt-1 text-sm text-muted-foreground">Отслеживайте прогресс активных сделок</p>
      </div>

      {deals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
          <p className="font-medium">Нет активных сделок</p>
          <p className="mt-1 text-sm text-muted-foreground">Сделки появятся после принятия оффера</p>
        </div>
      ) : (
        <div className="space-y-4">
          {deals.map(deal => {
            const s = STATUS[deal.status]
            const doneMilestones = deal.milestones.filter(m => m.done).length
            const progress = deal.milestones
              .filter(m => m.done)
              .reduce((acc, m) => acc + m.pct, 0)

            return (
              <Card key={deal.id} className="p-0">
                <CardContent className="p-6 space-y-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link href={`/listing/${deal.slug}`} className="group flex items-center gap-1.5">
                        <h3 className="font-semibold group-hover:underline underline-offset-4">{deal.listing}</h3>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {deal.role === 'seller' ? `Покупатель: ${deal.buyer}` : `Продавец: ${deal.buyer}`}
                        {' · '}Начата {deal.startedAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-xl font-bold">${deal.price.toLocaleString()}</p>
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.className}`}>
                        {s.label}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Прогресс сделки</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-foreground transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="space-y-2">
                    {deal.milestones.map((m, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {m.done
                          ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                          : <Circle className="h-4 w-4 shrink-0 text-muted-foreground/30" />
                        }
                        <span className={`flex-1 text-sm ${m.done ? 'text-foreground line-through opacity-50' : 'text-foreground'}`}>
                          {m.title}
                        </span>
                        <span className="text-xs text-muted-foreground">{m.pct}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 border-t pt-4">
                    <Button size="sm">
                      <CheckCircle2 className="mr-1.5 h-4 w-4" />
                      Подтвердить этап
                    </Button>
                    <Button size="sm" variant="outline">Написать покупателю</Button>
                    <Button size="sm" variant="ghost" className="ml-auto text-muted-foreground">
                      Открыть спор
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
