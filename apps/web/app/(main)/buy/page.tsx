import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight, Search, Shield, BarChart3, CheckCircle2,
  FileText, MessageSquare, Lock, TrendingUp, Zap, Users
} from 'lucide-react'

function SectionDivider() {
  return <div className="h-px w-full border-t border-dashed border-border" />
}

export default function BuyPage() {
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="container relative py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-6 px-3 py-1">
              <CheckCircle2 className="mr-1.5 h-3 w-3" />
              Все проекты верифицированы
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Купите готовый бизнес
              <span className="block mt-2 text-muted-foreground">с реальными метриками</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              Никаких фейковых цифр. Только верифицированные проекты с подтверждёнными метриками, кодом и финансовой отчётностью.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/browse">
                <Button size="lg">
                  <Search className="mr-2 h-4 w-4" />
                  Смотреть проекты
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="lg" variant="outline">
                  Создать аккаунт
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-20 grid max-w-3xl grid-cols-3 gap-8">
            {[
              { value: '500+', label: 'Покупателей на платформе' },
              { value: '150+', label: 'Успешных сделок' },
              { value: '48ч', label: 'Средний ответ продавца' },
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
            <h2 className="text-3xl font-bold tracking-tight">Как купить проект</h2>
          </div>
          <div className="mx-auto max-w-3xl space-y-4">
            {[
              {
                step: '01',
                icon: Search,
                title: 'Найдите подходящий проект',
                desc: 'Фильтруйте по категории, tech stack, MRR и цене. Смотрите верифицированные метрики без регистрации.',
              },
              {
                step: '02',
                icon: FileText,
                title: 'Подпишите NDA и изучите детали',
                desc: 'Одна кнопка — и вы получаете доступ к финансовым отчётам, аналитике, коду и документации.',
              },
              {
                step: '03',
                icon: MessageSquare,
                title: 'Сделайте оффер',
                desc: 'Предложите цену и условия. Ведите переговоры напрямую с продавцом внутри платформы.',
              },
              {
                step: '04',
                icon: Lock,
                title: 'Получите проект через эскроу',
                desc: 'Средства замораживаются. Вы получаете код, домен, аккаунты и поддержку при передаче.',
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

      {/* Why buy here */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-medium italic text-muted-foreground">Преимущества</p>
            <h2 className="text-3xl font-bold tracking-tight">Почему покупатели выбирают нас</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: CheckCircle2, title: 'Верифицированные метрики', desc: 'Все данные проверены командой. Никаких фейковых цифр и накрученных показателей.' },
              { icon: Shield, title: 'Защищённый эскроу', desc: 'Деньги переходят продавцу только после того, как вы получили и проверили проект.' },
              { icon: BarChart3, title: 'Прозрачная аналитика', desc: 'MRR, трафик, churn, LTV — все метрики доступны после подписания NDA.' },
              { icon: Zap, title: 'Быстрый процесс', desc: 'От первого контакта до закрытия сделки — 30–90 дней. Без лишней бюрократии.' },
              { icon: TrendingUp, title: 'Tech Stack фильтр', desc: 'Ищите проекты по технологиям. Найдите то, что умеете развивать.' },
              { icon: Users, title: 'Поддержка при передаче', desc: 'Продавец обязан помочь с миграцией и онбордингом в течение 30 дней после сделки.' },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title}>
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

      {/* Categories */}
      <section className="py-20 md:py-28">
        <div className="container max-w-3xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-medium italic text-muted-foreground">Категории</p>
            <h2 className="text-3xl font-bold tracking-tight">Что можно купить</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: 'AI & ML инструменты', hint: 'Самая быстрорастущая категория', href: '/browse?category=AI_ML' },
              { label: 'SaaS продукты', hint: 'Подписочная модель, предсказуемый доход', href: '/browse?category=SAAS' },
              { label: 'E-commerce', hint: 'Магазины с готовой аудиторией', href: '/browse?category=ECOMMERCE' },
              { label: 'Web3 / крипто', hint: 'dApps, NFT, DeFi проекты', href: '/browse?category=WEB3' },
              { label: 'FinTech', hint: 'Платёжные решения и финансовые сервисы', href: '/browse?category=FINTECH' },
              { label: 'HealthTech', hint: 'Медицинские и wellness приложения', href: '/browse?category=HEALTHTECH' },
            ].map(({ label, hint, href }) => (
              <Link key={label} href={href}>
                <div className="flex items-center justify-between rounded-xl border px-5 py-4 transition-colors hover:bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground">{hint}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
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
                  Найдите свой следующий проект
                </h2>
                <p className="mx-auto max-w-xl text-background/70">
                  Регистрация бесплатна. Просматривайте листинги и делайте офферы уже сегодня.
                </p>
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <div className="flex gap-3 rounded-xl border bg-background p-2 shadow-lg">
                <Link href="/browse">
                  <Button size="lg">Смотреть проекты</Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="lg" variant="outline">Зарегистрироваться</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
