import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

const received = [
  { id: '1', listing: 'AI-Powered Content Generator SaaS', slug: 'ai-content-generator-saas', amount: 68000, from: 'Дмитрий В.', message: 'Интересует проект, готов обсудить условия передачи.', status: 'pending', date: '2 часа назад' },
  { id: '2', listing: 'AI-Powered Content Generator SaaS', slug: 'ai-content-generator-saas', amount: 55000, from: 'Анна К.', message: 'Хочу купить проект, есть вопросы по метрикам.', status: 'pending', date: '1 день назад' },
  { id: '3', listing: 'E-Commerce Analytics Dashboard', slug: 'ecommerce-analytics-dashboard', amount: 115000, from: 'Сергей М.', message: 'Отличный проект, готов к сделке.', status: 'accepted', date: '3 дня назад' },
]

const sent = [
  { id: '4', listing: 'NFT Marketplace Platform', slug: 'nft-marketplace-platform', amount: 230000, to: 'Продавец', message: 'Интересует проект, готов к переговорам.', status: 'pending', date: '1 день назад' },
  { id: '5', listing: 'Payment Gateway for Crypto', slug: 'crypto-payment-gateway', amount: 160000, to: 'Продавец', message: 'Рассматриваю покупку, есть вопросы.', status: 'rejected', date: '5 дней назад' },
]

const STATUS: Record<string, { label: string; className: string }> = {
  pending: { label: 'Ожидает', className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  accepted: { label: 'Принят', className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  rejected: { label: 'Отклонён', className: 'bg-muted text-muted-foreground border-border' },
  countered: { label: 'Встречный', className: 'bg-violet-500/10 text-violet-500 border-violet-500/20' },
}

function OfferCard({ offer, type }: { offer: typeof received[0] & { to?: string; from?: string }; type: 'received' | 'sent' }) {
  const s = STATUS[offer.status]
  return (
    <Card className="p-0">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/listing/${offer.slug}`} className="group flex items-center gap-1.5">
              <p className="font-semibold leading-tight group-hover:underline underline-offset-4">{offer.listing}</p>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {type === 'received' ? `от ${offer.from}` : `для ${offer.to}`}
            </p>
          </div>
          <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.className}`}>
            {s.label}
          </span>
        </div>

        <p className="text-2xl font-bold text-foreground">${offer.amount.toLocaleString()}</p>

        <p className="text-sm text-muted-foreground line-clamp-2">{offer.message}</p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {offer.date}
          </div>
          {type === 'received' && offer.status === 'pending' && (
            <div className="flex gap-2">
              <Button size="sm" className="h-7 text-xs">Принять</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs">Отклонить</Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs">Встречный</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function OffersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Офферы</h1>
        <p className="mt-1 text-sm text-muted-foreground">Управляйте входящими и исходящими предложениями</p>
      </div>

      <Tabs defaultValue="received">
        <TabsList>
          <TabsTrigger value="received">
            Входящие
            <span className="rounded-full bg-foreground px-1.5 py-0.5 text-[10px] font-semibold text-background">
              {received.filter(o => o.status === 'pending').length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="sent">Исходящие</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="mt-4 space-y-3">
          {received.map(o => <OfferCard key={o.id} offer={o} type="received" />)}
        </TabsContent>

        <TabsContent value="sent" className="mt-4 space-y-3">
          {sent.map(o => <OfferCard key={o.id} offer={o as any} type="sent" />)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
