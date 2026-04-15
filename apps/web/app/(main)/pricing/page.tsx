import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const SELLER_PLANS = [
  {
    name: 'Базовый',
    price: 'Бесплатно',
    commission: '10% комиссия',
    description: 'Для первой продажи',
    features: [
      'Публичный листинг',
      'Базовая аналитика',
      'Стандартная поддержка',
      'Верификация за 48 часов',
    ],
    cta: 'Начать бесплатно',
    href: '/sign-up',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$99',
    commission: '7% комиссия',
    description: 'Для серьёзных продавцов',
    badge: 'Популярный',
    features: [
      'Всё из Базового',
      'Featured листинг',
      'AI-оценка стоимости',
      'Приоритетная поддержка',
      'Маркетинговый буст',
      'Расширенная аналитика',
    ],
    cta: 'Выбрать Pro',
    href: '/sign-up',
    highlighted: true,
  },
  {
    name: 'Premium',
    price: '$499',
    commission: '5% комиссия',
    description: 'Белые перчатки',
    features: [
      'Всё из Pro',
      'Персональный M&A советник',
      'Конструктор юр. шаблонов',
      'Кастомный NDA',
      'Несколько листингов',
      'Верификация за 24 часа',
    ],
    cta: 'Выбрать Premium',
    href: '/sign-up',
    highlighted: false,
  },
]

const BUYER_PLANS = [
  {
    name: 'Базовый',
    price: 'Бесплатно',
    commission: null,
    description: 'Просмотр и поиск',
    features: [
      'Публичные листинги',
      'Базовые фильтры',
      'Отправка офферов',
    ],
    cta: 'Начать бесплатно',
    href: '/sign-up',
    highlighted: false,
  },
  {
    name: 'Premium',
    price: '$49',
    priceHint: '/мес',
    commission: null,
    description: 'Для активных покупателей',
    badge: 'Популярный',
    features: [
      'Закрытые листинги',
      'AI-рекомендации',
      'Расширенный поиск',
      'Сохранённые поиски с алертами',
      'Инструменты due diligence',
      'Бейдж верифицированного покупателя',
    ],
    cta: 'Выбрать Premium',
    href: '/sign-up',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    commission: null,
    description: 'Для фондов и компаний',
    features: [
      'Всё из Premium',
      'Ранний доступ к листингам',
      'Персональный менеджер',
      'Кастомный deal flow',
      'API доступ',
      'White-label опция',
    ],
    cta: 'Связаться с нами',
    href: '/contact',
    highlighted: false,
  },
]

const EXTRAS = [
  { name: 'Эскроу', price: '2.5%', hint: 'от суммы сделки' },
  { name: 'Быстрая верификация', price: '$199', hint: 'за 24 часа' },
  { name: 'Featured листинг', price: '$299', hint: '30 дней' },
  { name: 'Due diligence', price: '$1 499', hint: 'профессиональный' },
  { name: 'Юридические шаблоны', price: '$99', hint: 'за шаблон' },
  { name: 'Помощь с миграцией', price: '$499', hint: 'техническая передача' },
]

type Plan = {
  name: string
  price: string
  priceHint?: string
  commission: string | null
  description: string
  badge?: string
  features: string[]
  cta: string
  href: string
  highlighted: boolean
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div className={cn(
      'relative flex flex-col rounded-xl border p-6',
      plan.highlighted
        ? 'border-foreground bg-foreground text-background'
        : 'border-border bg-card'
    )}>
      {plan.badge && (
        <Badge
          className={cn(
            'absolute right-5 top-5 text-xs',
            plan.highlighted
              ? 'bg-background text-foreground hover:bg-background/90'
              : ''
          )}
        >
          {plan.badge}
        </Badge>
      )}

      {/* Header */}
      <div className="mb-6">
        <p className={cn('text-xs', plan.highlighted ? 'text-background/60' : 'text-muted-foreground')}>
          {plan.description}
        </p>
        <h3 className="mt-1 text-lg font-semibold">{plan.name}</h3>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
          {plan.priceHint && (
            <span className={cn('text-sm', plan.highlighted ? 'text-background/60' : 'text-muted-foreground')}>
              {plan.priceHint}
            </span>
          )}
        </div>
        {plan.commission && (
          <p className={cn('mt-1 text-sm', plan.highlighted ? 'text-background/60' : 'text-muted-foreground')}>
            {plan.commission}
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="mb-8 flex-1 space-y-3">
        {plan.features.map(f => (
          <li key={f} className="flex items-center gap-2.5 text-sm">
            <CheckCircle2 className={cn(
              'h-4 w-4 shrink-0',
              plan.highlighted ? 'text-background' : 'text-emerald-500'
            )} />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link href={plan.href}>
        <Button
          className="w-full"
          variant={plan.highlighted ? 'secondary' : 'outline'}
        >
          {plan.cta}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  )
}

function SectionDivider() {
  return <div className="h-px w-full border-t border-dashed border-border" />
}

export default function PricingPage() {
  return (
    <div className="container ml-auto mr-auto py-16 md:py-24">
      {/* Header */}
      <div className="mx-auto mb-20 max-w-2xl text-center">
        <p className="mb-3 text-sm font-medium italic text-muted-foreground">Тарифы</p>
        <h1 className="relative inline-block text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="relative">
            Простые цены
            <svg width="453" height="8" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -bottom-1 left-0 w-full text-violet-500">
              <path d="M2 6.75068C53.4722 -1.10509 368.533 2.14284 451.5 6.75085" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Комиссия только при успешной продаже. Никаких скрытых платежей.
        </p>
      </div>

      {/* Sellers */}
      <div className="mb-20">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Для продавцов
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          {SELLER_PLANS.map(plan => <PlanCard key={plan.name} plan={plan} />)}
        </div>
      </div>

      <SectionDivider />

      {/* Buyers */}
      <div className="my-20">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Для покупателей
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          {BUYER_PLANS.map(plan => <PlanCard key={plan.name} plan={plan} />)}
        </div>
      </div>

      <SectionDivider />

      {/* Extras */}
      <div className="my-20">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Дополнительные услуги
        </p>
        <div className="mx-auto max-w-3xl grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EXTRAS.map(({ name, price, hint }) => (
            <div key={name} className="flex items-center justify-between rounded-xl border px-5 py-4">
              <div>
                <p className="text-sm font-medium">{name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
              </div>
              <p className="text-base font-bold">{price}</p>
            </div>
          ))}
        </div>
      </div>

      <SectionDivider />

      {/* FAQ */}
      <div className="my-20 mx-auto max-w-2xl">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Частые вопросы
        </p>
        <div className="space-y-3">
          {[
            { q: 'Когда списывается комиссия?', a: 'Только после успешного закрытия сделки через эскроу. Если сделка не состоялась — ничего не платите.' },
            { q: 'Можно ли сменить тариф?', a: 'Да, в любой момент. При апгрейде разница пересчитывается пропорционально.' },
            { q: 'Что входит в эскроу?', a: 'Средства замораживаются до выполнения всех этапов передачи проекта. Комиссия 2.5% от суммы сделки.' },
            { q: 'Есть ли пробный период?', a: 'Базовый тариф бесплатен навсегда. Pro и Premium можно попробовать 14 дней бесплатно.' },
          ].map(({ q, a }) => (
            <div key={q} className="rounded-xl border p-5">
              <p className="font-medium">{q}</p>
              <p className="mt-2 text-sm text-muted-foreground">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
