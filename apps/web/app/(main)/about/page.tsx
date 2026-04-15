import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

function SectionDivider() {
  return <div className="h-px w-full border-t border-dashed border-border" />
}

export default function AboutPage() {
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="container relative py-20 md:py-28 text-center max-w-3xl mx-auto">
          <p className="mb-3 text-sm font-medium italic text-muted-foreground">О нас</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Мы строим рынок для основателей
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            StartupSwap появился из личного опыта — мы сами были основателями, которые хотели быстро продать проект, но не могли найти нормальную платформу.
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* Mission */}
      <section className="py-20 md:py-28">
        <div className="container max-w-3xl">
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-2xl font-bold text-foreground">Наша миссия</h2>
            <p>
              Мы верим, что каждый технологический проект заслуживает второй жизни. Тысячи разработчиков создают продукты, которые работают и приносят пользу — но по разным причинам основатели не могут или не хотят их развивать дальше.
            </p>
            <p>
              Существующие платформы медленные, дорогие и не заточены под современный tech stack. Верификация занимает недели, процесс непрозрачный, а покупатели и продавцы не могут нормально общаться.
            </p>
            <p>
              StartupSwap решает это: верификация за 24–48 часов, AI-оценка стоимости, поиск по tech stack и защищённый эскроу. Мы делаем покупку и продажу проектов такой же простой, как покупка на маркетплейсе.
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Stats */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 max-w-3xl mx-auto">
            {[
              { value: '$10M+', label: 'Общий оборот' },
              { value: '150+', label: 'Закрытых сделок' },
              { value: '24–48ч', label: 'Верификация' },
              { value: '500+', label: 'Участников' },
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

      {/* Values */}
      <section className="py-20 md:py-28">
        <div className="container max-w-3xl">
          <h2 className="mb-8 text-2xl font-bold">Наши принципы</h2>
          <div className="space-y-4">
            {[
              { title: 'Прозрачность', desc: 'Все метрики верифицированы. Никаких скрытых комиссий. Процесс сделки понятен на каждом шаге.' },
              { title: 'Скорость', desc: 'Верификация за 24–48 часов. Сделка за 30–90 дней. Мы уважаем время основателей.' },
              { title: 'Безопасность', desc: 'Эскроу защищает обе стороны. Средства переходят только после выполнения всех условий.' },
              { title: 'Сообщество', desc: 'Мы строим не просто маркетплейс, а сообщество основателей, которые помогают друг другу.' },
            ].map(({ title, desc }) => (
              <div key={title} className="flex gap-5 rounded-xl border p-5">
                <div className="h-2 w-2 mt-2 rounded-full bg-foreground shrink-0" />
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Contact */}
      <section className="py-20 md:py-28">
        <div className="container max-w-3xl">
          <h2 className="mb-4 text-2xl font-bold">Связаться с нами</h2>
          <p className="text-muted-foreground mb-6">
            Есть вопросы, предложения или хотите партнёрство — пишите напрямую.
          </p>
          <div className="space-y-3">
            {[
              { label: 'Email', value: 'hello@startupswap.io' },
              { label: 'Telegram', value: '@startupswap' },
              { label: 'Twitter / X', value: '@startupswap' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-4 rounded-xl border px-5 py-4">
                <span className="text-sm text-muted-foreground w-24">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/sign-up">
              <Button size="lg">Начать <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
