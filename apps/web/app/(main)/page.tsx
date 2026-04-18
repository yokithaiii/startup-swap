import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ListingCard } from '@/components/listing/listing-card'
import { CATEGORIES } from '@/lib/constants'
import { ValuationWidget } from '@/components/landing/valuation-widget'
import { createClient } from '@/lib/supabase/server'
import { dbToListing } from '@/lib/adapters/listing'
import type { Metadata } from 'next'
import { 
  Rocket, 
  Zap, 
  Shield,
  Search,
  CheckCircle2,
  ArrowRight,
  Lock,
  BarChart3,
  Clock,
  TrendingUp,
  DollarSign,
} from 'lucide-react'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'StartupSwap — Покупайте и продавайте готовые AI-проекты',
  description: 'Маркетплейс для быстрой покупки и продажи прибыльных технологических проектов. Верификация за 24–48 часов и AI-оценка стоимости.',
  openGraph: {
    title: 'StartupSwap — Покупайте и продавайте готовые AI-проекты',
    description: 'Маркетплейс для быстрой покупки и продажи прибыльных технологических проектов. Верификация за 24–48 часов и AI-оценка стоимости.',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'StartupSwap — Биржа готовых AI-проектов',
      },
    ],
  },
}

function SectionDivider() {
  return (
    <div className="h-px w-full border-t border-dashed border-border" />
  )
}

export default async function Home() {
  const supabase = await createClient()

  // Топ проекты: featured сначала, потом по просмотрам, лимит 3
  const { data: rows } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'ACTIVE')
    .eq('visibility', 'public')
    .order('featured', { ascending: false })
    .order('views', { ascending: false })
    .limit(3)

  const featuredListings = (rows ?? []).map(dbToListing)

  // Количество проектов по категориям
  const { data: categoryRows } = await supabase
    .from('listings')
    .select('category')
    .eq('status', 'ACTIVE')
    .eq('visibility', 'public')

  const categoryCounts = (categoryRows ?? []).reduce<Record<string, number>>((acc, row) => {
    acc[row.category] = (acc[row.category] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="absolute inset-x-0 top-0 h-[400px] bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(255,255,255,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(255,255,255,0.12),transparent)]" />
        
        <div className="container relative py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="outline" className="mb-6 p-3 border-border/60 bg-background text-foreground">
              <Clock className="mr-1.5 h-3 w-3" />
              Верификация за 24–48 часов
            </Badge>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Покупайте и продавайте
              <span className="block mt-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                готовые AI-проекты
              </span>
            </h1>
            
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Маркетплейс для быстрой покупки и продажи прибыльных технологических проектов.
              Верификация и AI-оценка стоимости.
            </p>
            
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/browse">
                <Button size="lg" className="w-full sm:w-auto">
                  <Search className="mr-2 h-4 w-4" />
                  Найти проект
                </Button>
              </Link>
              <Link href="/sell/new">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Rocket className="mr-2 h-4 w-4" />
                  Продать проект
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-20 grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: '$10M+', label: 'Общий оборот' },
              { value: '150+', label: 'Закрытых сделок' },
              { value: '24–48ч', label: 'Верификация' },
              { value: '500+', label: 'Участников' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Featured Listings */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mb-12 grid grid-cols-3 items-end">
            <div />
            <div className="text-center">
              <p className="mb-3 text-sm font-medium italic text-muted-foreground">Избранное</p>
              <h2 className="relative inline-block text-3xl font-bold tracking-tight sm:text-4xl">
                <span className="relative">
                  Топ проекты
                  <svg width="453" height="8" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -bottom-1 left-0 w-full text-violet-500">
                    <path d="M2 6.75068C53.4722 -1.10509 368.533 2.14284 451.5 6.75085" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"></path>
                  </svg>
                </span>
              </h2>
              <p className="mt-3 text-muted-foreground">
                Проверенные проекты с подтверждёнными метриками
              </p>
            </div>
            <div className="flex justify-end">
              <Link href="/browse" className="hidden sm:block">
                <Button variant="ghost" className="group">
                  Все проекты
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/browse">
              <Button variant="outline" className="w-full">
                Все проекты
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Buy / Sell banners */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="grid gap-5 md:grid-cols-2">
            {/* Buy */}
            <Link href="/buy">
              <div className="group relative overflow-hidden rounded-2xl border bg-muted/30 p-8 transition-all hover:bg-muted/50 hover:shadow-md">
                <div className="absolute right-6 top-6 opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border bg-background">
                  <Search className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold">Хочу купить проект</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Верифицированные проекты с реальными метриками. Фильтр по tech stack, MRR и категории.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['SaaS', 'AI & ML', 'E-commerce', 'Web3'].map(t => (
                    <Badge key={t} variant="secondary" className="font-normal">{t}</Badge>
                  ))}
                </div>
                <p className="mt-4 text-sm font-medium">
                  Смотреть проекты →
                </p>
              </div>
            </Link>

            {/* Sell */}
            <Link href="/sell">
              <div className="group relative overflow-hidden rounded-2xl border bg-foreground p-8 text-background transition-all hover:opacity-95 hover:shadow-md">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute right-6 top-6 opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowRight className="h-5 w-5 text-background/60" />
                </div>
                <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-background/20 bg-background/10">
                  <DollarSign className="h-5 w-5 text-background" />
                </div>
                <h3 className="relative text-xl font-bold text-background">Хочу продать проект</h3>
                <p className="relative mt-2 text-sm text-background/60 leading-relaxed">
                  Размещение бесплатно. Комиссия 10% только после сделки. Верификация за 24–48 часов.
                </p>
                <div className="relative mt-6 flex flex-wrap gap-2">
                  {['Бесплатно', '24–48ч', 'Сделка'].map(t => (
                    <span key={t} className="rounded-full border border-background/20 bg-background/10 px-3 py-0.5 text-xs text-background/70">{t}</span>
                  ))}
                </div>
                <p className="relative mt-4 text-sm font-medium text-background">
                  Разместить проект →
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <SectionDivider />
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-medium italic text-muted-foreground">Категории</p>
            <h2 className="relative inline-block text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="relative">
                Найдите своё направление
                <svg width="453" height="8" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -bottom-1 left-0 w-full text-amber-400">
                  <path d="M2 6.75068C53.4722 -1.10509 368.533 2.14284 451.5 6.75085" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"></path>
                </svg>
              </span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              От AI-инструментов до финтеха — проекты в любой нише
            </p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category) => (
              <Link key={category.value} href={`/browse?category=${category.value}`}>
                <Card className="group relative overflow-hidden transition-all hover:shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{category.label}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {categoryCounts[category.value] ?? 0} проектов доступно
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* How It Works */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-medium italic text-muted-foreground">Процесс</p>
            <h2 className="relative inline-block text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="relative">
                Как это работает
                <svg width="453" height="8" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -bottom-1 left-0 w-full text-emerald-500">
                  <path d="M2 6.75068C53.4722 -1.10509 368.533 2.14284 451.5 6.75085" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"></path>
                </svg>
              </span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Три шага от поиска до закрытия сделки
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Search,
                title: '1. Изучите проект',
                description: 'Просматривайте верифицированные проекты с реальными метриками, стеком технологий и финансовой отчётностью.',
              },
              {
                icon: CheckCircle2,
                title: '2. Сделайте предложение',
                description: 'Отправьте оффер с условиями и сроками. Ведите переговоры напрямую с продавцом внутри платформы.',
              },
              {
                icon: Shield,
                title: '3. Получите проект',
                description: 'Сделка проходит через платформу. Вы получаете код, документацию и поддержку при передаче.',
              },
            ].map((step, index) => (
              <Card key={index} className="relative overflow-hidden">
                <div className="absolute right-0 top-0 h-px w-20 bg-gradient-to-r from-transparent to-border" />
                <CardHeader>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/50">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Features */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-medium italic text-muted-foreground">Преимущества</p>
            <h2 className="relative inline-block text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="relative">
                Почему StartupSwap?
                <svg width="453" height="8" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -bottom-1 left-0 w-full text-rose-500">
                  <path d="M2 6.75068C53.4722 -1.10509 368.533 2.14284 451.5 6.75085" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"></path>
                </svg>
              </span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Платформа, которую строили для себя — и открыли для всех
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                iconClass: 'text-amber-500',
                bgClass: 'bg-amber-50 border-amber-100 dark:bg-amber-950/30 dark:border-amber-900',
                title: 'Быстрая верификация',
                description: '24–48 часов против 2–4 недель на других платформах. Никаких лишних согласований.',
              },
              {
                icon: BarChart3,
                iconClass: 'text-violet-500',
                bgClass: 'bg-violet-50 border-violet-100 dark:bg-violet-950/30 dark:border-violet-900',
                title: 'AI-оценка',
                description: 'Автоматический расчёт стоимости, анализ кода и подбор подходящих покупателей.',
              },
              {
                icon: Lock,
                iconClass: 'text-emerald-500',
                bgClass: 'bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900',
                title: 'Безопасная сделка',
                description: 'Условия сделки фиксируются на платформе. Поэтапная передача проекта защищает обе стороны.',
              },
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg border ${feature.bgClass}`}>
                  <feature.icon className={`h-6 w-6 ${feature.iconClass}`} />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Valuation widget */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-medium italic text-muted-foreground">Бесплатно</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Сколько стоит ваш проект?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Введите метрики — получите оценку за 30 секунд
            </p>
          </div>
          <ValuationWidget />
        </div>
      </section>

      <SectionDivider />

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="relative mx-0 md:mx-16 lg:mx-24">
            <div className="relative overflow-hidden rounded-2xl bg-foreground px-6 pb-20 pt-16 text-center md:px-16">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,255,255,0.07),transparent)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="relative">
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-background sm:text-4xl">
                  Готовы к первой сделке?
                </h2>
                <p className="mx-auto max-w-xl text-background/70">
                  Сотни предпринимателей уже покупают и продают проекты на StartupSwap. Присоединяйтесь — это быстро.
                </p>
              </div>
            </div>

            <div className="absolute -bottom-12 sm:-bottom-6 md:-bottom-6 left-1/2 -translate-x-1/2 w-full px-4 md:w-auto md:px-0">
              <div className="flex flex-col gap-2 rounded-xl border bg-background p-2 shadow-lg sm:flex-row sm:gap-3">
                <Link href="/browse" className="flex-1 md:flex-none">
                  <Button size="lg" className="w-full md:w-auto">
                    Найти проект
                  </Button>
                </Link>
                <Link href="/sell/new" className="flex-1 md:flex-none">
                  <Button size="lg" variant="outline" className="w-full md:w-auto">
                    Разместить проект
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
