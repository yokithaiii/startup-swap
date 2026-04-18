import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ — Часто задаваемые вопросы',
  description: 'Ответы на частые вопросы о покупке и продаже проектов на StartupSwap: верификация, комиссии, безопасность сделок.',
  openGraph: {
    title: 'FAQ — Часто задаваемые вопросы о StartupSwap',
    description: 'Ответы на частые вопросы о покупке и продаже проектов, верификации и комиссиях.',
  },
}

const FAQ = [
  {
    category: 'Общие вопросы',
    items: [
      { q: 'Что такое StartupSwap?', a: 'StartupSwap — маркетплейс для покупки и продажи готовых технологических проектов. Мы помогаем основателям быстро найти покупателя, а инвесторам — приобрести работающий бизнес с проверенными метриками.' },
      { q: 'Кто может продавать на платформе?', a: 'Любой владелец технологического проекта: SaaS, AI-инструменты, e-commerce, Web3 и другие. Проект должен иметь реальных пользователей или выручку.' },
      { q: 'Кто покупает проекты?', a: 'Serial entrepreneurs, инвесторы, компании для acquihire, разработчики ищущие готовый продукт. Все покупатели проходят базовую верификацию.' },
    ],
  },
  {
    category: 'Продажа',
    items: [
      { q: 'Сколько стоит разместить проект?', a: 'Размещение бесплатно. Мы берём комиссию только после успешной сделки: 10% на базовом тарифе, 7% на Pro, 5% на Premium.' },
      { q: 'Как долго идёт верификация?', a: 'Стандартная верификация занимает 24–48 часов. Мы проверяем метрики, документы и соответствие требованиям платформы.' },
      { q: 'Какие документы нужны для продажи?', a: 'Минимум: скриншоты аналитики и выручки. Рекомендуем также: P&L отчёт, доступ к Google Analytics или аналогу, описание tech stack.' },
      { q: 'Можно ли продать проект без выручки?', a: 'Да, если у проекта есть активные пользователи, трафик или уникальная технология. Оценка будет основана на потенциале.' },
    ],
  },
  {
    category: 'Покупка',
    items: [
      { q: 'Как получить доступ к финансовым данным?', a: 'После подписания NDA вы получаете доступ к детальным метрикам, финансовым отчётам и технической документации.' },
      { q: 'Можно ли провести due diligence?', a: 'Да. Вы можете задавать вопросы продавцу, запрашивать дополнительные документы и проводить технический аудит кода.' },
      { q: 'Что происходит после принятия оффера?', a: 'Запускается процесс передачи проекта. Платформа фиксирует 4 этапа: передача кода, документация, миграция и поддержка 30 дней. Обе стороны отмечают выполнение каждого этапа.' },
    ],
  },
  {
    category: 'Безопасность сделок',
    items: [
      { q: 'Как платформа защищает участников сделки?', a: 'Платформа фиксирует все этапы передачи проекта. Обе стороны подтверждают выполнение каждого шага. История сделки сохраняется.' },
      { q: 'Что если продавец не выполнит условия?', a: 'Если продавец не выполняет обязательства, покупатель может открыть спор. Наша команда рассматривает ситуацию и помогает найти решение.' },
      { q: 'Как происходит передача проекта?', a: 'Передача разбита на 4 этапа: код и доступы (30%), документация и обучение (30%), миграция и настройка (30%), поддержка 30 дней (10%). Каждый этап подтверждается обеими сторонами.' },
    ],
  },
]

export default function FaqPage() {
  return (
    <div className="container ml-auto mr-auto py-16 md:py-24 max-w-3xl">
      <div className="mb-16 text-center">
        <p className="mb-3 text-sm font-medium italic text-muted-foreground">Поддержка</p>
        <h1 className="text-4xl font-bold tracking-tight">Частые вопросы</h1>
        <p className="mt-4 text-muted-foreground">
          Не нашли ответ?{' '}
          <Link href="/about" className="underline underline-offset-4 hover:text-foreground">
            Напишите нам
          </Link>
        </p>
      </div>

      <div className="space-y-12">
        {FAQ.map(({ category, items }) => (
          <div key={category}>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {category}
            </h2>
            <div className="space-y-3">
              {items.map(({ q, a }) => (
                <div key={q} className="rounded-xl border p-5">
                  <p className="font-medium">{q}</p>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-xl border p-8 text-center">
        <h3 className="font-semibold">Остались вопросы?</h3>
        <p className="mt-2 text-sm text-muted-foreground">Мы отвечаем в течение нескольких часов</p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/sign-up"><Button>Начать <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>
      </div>
    </div>
  )
}
