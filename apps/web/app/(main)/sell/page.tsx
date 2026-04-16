import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight, Zap, Shield, BarChart3, CheckCircle2,
  Clock, DollarSign, Users, TrendingUp, FileText, Lock
} from 'lucide-react'

function SectionDivider() {
  return <div className="h-px w-full border-t border-dashed border-border" />
}

export default function SellPage() {
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="container relative py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-6 p-3">
              <Clock className="mr-1.5 h-3 w-3" />
              Верификация за 24–48 часов
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Продайте проект
              <span className="block mt-2 text-muted-foreground">быстро и безопасно</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              Размещение бесплатно. Комиссия 10% только после успешной сделки. Средняя сделка закрывается за 30–90 дней.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/sell/new">
                <Button size="lg">
                  Разместить проект
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/valuation">
                <Button size="lg" variant="outline">
                  Оценить стоимость
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-20 grid max-w-3xl grid-cols-3 gap-8">
            {[
              { value: '$10M+', label: 'Выплачено продавцам' },
              { value: '150+', label: 'Закрытых сделок' },
              { value: '30–90', label: 'Дней до закрытия' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-bold tracking-tight">{value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Process */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-medium italic text-muted-foreground">Процесс</p>
            <h2 className="text-3xl font-bold tracking-tight">Как продать проект</h2>
          </div>
          <div className="mx-auto max-w-3xl space-y-4">
            {[
              {
                step: '01',
                icon: FileText,
                title: 'Заполните форму',
                desc: 'Описание, метрики, tech stack, цена. Занимает 15–20 минут. AI подскажет справедливую оценку.',
              },
              {
                step: '02',
                icon: Zap,
                title: 'Верификация за 24–48 часов',
                desc: 'Мы проверяем метрики и документы. Верифицированные проекты получают значок доверия и больше просмотров.',
              },
              {
                step: '03',
                icon: Users,
                title: 'Получайте офферы',
                desc: 'Покупатели из нашей базы получают уведомления. Ведите переговоры прямо на платформе.',
              },
              {
                step: '04',
                icon: Lock,
                title: 'Закройте сделку через эскроу',
                desc: 'Средства замораживаются до передачи проекта. Вы получаете деньги поэтапно по мере выполнения условий.',
              },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="flex gap-5 rounded-xl border p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-sm font-bold text-muted-foreground">
                  {step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <p className="font-semibold">{title}</p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Why sell here */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-medium italic text-muted-foreground">Преимущества</p>
            <h2 className="text-3xl font-bold tracking-tight">Почему продавцы выбирают нас</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Zap, title: 'Быстрее в 10 раз', desc: 'Верификация за 24–48 часов против 2–4 недель на других платформах.' },
              { icon: DollarSign, title: 'Бесплатное размещение', desc: 'Никаких листинг-фи. Платите только 10% комиссии после успешной сделки.' },
              { icon: BarChart3, title: 'AI-оценка', desc: 'Автоматический расчёт справедливой стоимости на основе метрик и рынка.' },
              { icon: Shield, title: 'Защищённый эскроу', desc: 'Средства в безопасности. Вы получаете деньги только после передачи проекта.' },
              { icon: Users, title: 'База покупателей', desc: 'Уведомляем подходящих покупателей сразу после публикации вашего листинга.' },
              { icon: TrendingUp, title: 'Поддержка при передаче', desc: 'Помогаем с миграцией кода, документацией и онбордингом покупателя.' },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="pt-0">
                <CardContent className="pt-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/50">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* What can you sell */}
      <section className="py-20 md:py-28">
        <div className="container max-w-3xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-medium italic text-muted-foreground">Типы проектов</p>
            <h2 className="text-3xl font-bold tracking-tight">Что можно продать</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: 'SaaS продукты', hint: 'С подпиской или разовой оплатой' },
              { label: 'AI-инструменты', hint: 'Боты, генераторы, автоматизации' },
              { label: 'E-commerce', hint: 'Магазины, маркетплейсы, дропшиппинг' },
              { label: 'Web3 / крипто', hint: 'dApps, NFT платформы, DeFi' },
              { label: 'Мобильные приложения', hint: 'iOS, Android, кросс-платформенные' },
              { label: 'Side projects', hint: 'Даже без выручки — с пользователями' },
            ].map(({ label, hint }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border px-5 py-4">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                <div>
                  <p className="font-medium text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{hint}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="relative mx-8 md:mx-16 lg:mx-24">
            <div className="relative overflow-hidden rounded-2xl bg-foreground px-8 pb-20 pt-16 text-center md:px-16">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="relative">
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-background sm:text-4xl">
                  Готовы продать проект?
                </h2>
                <p className="mx-auto max-w-xl text-background/70">
                  Размещение бесплатно. Заполните форму за 15 минут — мы сделаем остальное.
                </p>
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <div className="flex gap-3 rounded-xl border bg-background p-2 shadow-lg">
                <Link href="/sell/new">
                  <Button size="lg">Разместить проект</Button>
                </Link>
                <Link href="/valuation">
                  <Button size="lg" variant="outline">Оценить стоимость</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
