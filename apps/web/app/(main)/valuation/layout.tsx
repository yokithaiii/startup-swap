import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Оценить стоимость проекта — бесплатный калькулятор',
  description: 'Бесплатно рассчитайте рыночную стоимость вашего SaaS или AI-проекта. Введите MRR, количество пользователей и трафик — получите оценку за 30 секунд.',
  openGraph: {
    title: 'Оценить стоимость проекта — бесплатный калькулятор',
    description: 'Бесплатно рассчитайте рыночную стоимость вашего SaaS или AI-проекта за 30 секунд.',
  },
}

export default function ValuationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
