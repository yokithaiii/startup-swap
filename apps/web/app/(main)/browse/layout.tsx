import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Каталог проектов — верифицированные стартапы и SaaS',
  description: 'Просматривайте верифицированные технологические проекты с фильтрацией по категории, цене, MRR и tech stack. SaaS, AI, e-commerce, Web3 и другие.',
  openGraph: {
    title: 'Каталог проектов — верифицированные стартапы и SaaS',
    description: 'Более 100 верифицированных проектов. Фильтрация по категории, цене, MRR и tech stack.',
  },
}

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
