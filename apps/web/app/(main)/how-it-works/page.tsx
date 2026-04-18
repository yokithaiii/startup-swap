import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Metadata } from 'next'
import {
  Search, FileText, MessageSquare, Shield, CheckCircle2,
  ArrowRight, Upload, BarChart3, Zap, Lock, Users
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Как это работает — процесс покупки и продажи проектов',
  description: 'Узнайте как купить или продать технологический проект на StartupSwap. Три шага: изучите проект, сделайте предложение, получите проект.',
  openGraph: {
    title: 'Как это работает — процесс покупки и продажи проектов',
    description: 'Три шага от поиска до закрытия сделки. Верификация за 24–48 часов.',
  },
}

function SectionDivider() {
  return <div className="h-px w-full border-t border-dashed border-border" />
}

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="container relative py-20 md:py-28 text-center">
          <p className="mb-3 text-sm font-medium italic text-muted-foreground">Процесс</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Как работает StartupSwap
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            От размещения до закрытия сделки — прозрачный процесс для продавцов и покупателей
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* For sellers */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-medium italic text-muted-foreground">Для продавцов</p>
            <h2 className="text-3xl font-bold tracking-tight">Продайте проект за 30–90 дней</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '01', icon: Upload, title: 'Разместите проект', desc: 'Заполните форму: описание, метрики, tech stack, цена. AI подскажет справедливую оценку.' },
              { step: '02', icon: Zap, title: 'Верификация 24–48ч', desc: 'Мы проверяем метрики и документы. Верифицированные проекты получают больше доверия покупателей.' },
              { step: '03', icon: MessageSquare, title: 'Получайте офферы', desc: 'Покупатели присылают предложения. Ведите переговоры прямо на платформе.' },
              { step: '04', icon: Lock, title: 'Закройте сделку', desc: 'Договоритесь об условиях передачи. Поэтапно передайте проект и получите оплату.' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <Card key={step} className="relative overflow-hidden">
                <div className="absolute right-4 top-4 text-5xl font-bold text-muted/30 select-none leading-none">{step}</div>
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/50">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/sell/new"><Button size="lg">Разместить проект <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* For buyers */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-medium italic text-muted-foreground">Для покупателей</p>
            <h2 className="text-3xl font-bold tracking-tight">Найдите и купите готовый бизнес</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '01', icon: Search, title: 'Найдите проект', desc: 'Фильтруйте по категории, tech stack, MRR и цене. Смотрите верифицированные метрики.' },
              { step: '02', icon: FileText, title: 'Изучите детали', desc: 'Подпишите NDA и получите доступ к финансовым отчётам, аналитике и коду.' },
              { step: '03', icon: MessageSquare, title: 'Сделайте оффер', desc: 'Предложите цену и условия. Договоритесь с продавцом напрямую.' },
              { step: '04', icon: CheckCircle2, title: 'Получите проект', desc: 'Платформа фиксирует этапы передачи. Получите код, документацию и поддержку.' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <Card key={step} className="relative overflow-hidden">
                <div className="absolute right-4 top-4 text-5xl font-bold text-muted/30 select-none leading-none">{step}</div>
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/50">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/browse"><Button size="lg" variant="outline">Смотреть проекты <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Deal stages */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-medium italic text-muted-foreground">Безопасность</p>
            <h2 className="text-3xl font-bold tracking-tight">Этапы передачи проекта</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Платформа фиксирует каждый этап. Обе стороны видят прогресс и подтверждают выполнение.
            </p>
          </div>
          <div className="mx-auto max-w-3xl space-y-3">
            {[
              { pct: '30%', title: 'Передача кода и доступов', desc: 'Продавец передаёт репозиторий, домен, аккаунты сервисов' },
              { pct: '30%', title: 'Документация и обучение', desc: 'Техническая документация, онбординг, ответы на вопросы' },
              { pct: '30%', title: 'Миграция и настройка', desc: 'Помощь с переносом инфраструктуры и настройкой' },
              { pct: '10%', title: 'Поддержка 30 дней', desc: 'Продавец остаётся на связи месяц после передачи' },
            ].map(({ pct, title, desc }) => (
              <div key={title} className="flex items-center gap-5 rounded-xl border px-6 py-4">
                <div className="w-14 shrink-0 text-center">
                  <p className="text-xl font-bold">{pct}</p>
                </div>
                <div className="h-8 w-px bg-border shrink-0" />
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
                <Shield className="ml-auto h-4 w-4 shrink-0 text-muted-foreground/40" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Why us */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-medium italic text-muted-foreground">Преимущества</p>
            <h2 className="text-3xl font-bold tracking-tight">Почему StartupSwap</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Zap, title: 'Верификация за 24–48ч', desc: 'Против 2–4 недель на других платформах. AI автоматизирует проверку метрик.' },
              { icon: BarChart3, title: 'Реальные метрики', desc: 'Все данные проверены. Никаких фейковых цифр — только подтверждённые показатели.' },
              { icon: Users, title: 'Сообщество', desc: 'Нетворкинг с другими основателями, менторство и поддержка на каждом этапе.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border bg-muted/50">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
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
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-background sm:text-4xl">Готовы начать?</h2>
                <p className="mx-auto max-w-xl text-background/70">Регистрация бесплатна. Комиссия только при успешной сделке.</p>
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <div className="flex gap-3 rounded-xl border bg-background p-2 shadow-lg">
                <Link href="/sign-up"><Button size="lg">Зарегистрироваться</Button></Link>
                <Link href="/browse"><Button size="lg" variant="outline">Смотреть проекты</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
