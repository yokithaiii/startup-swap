import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockListings } from '@/lib/mock-data'
import { CATEGORIES } from '@/lib/constants'
import {
  Package, Eye, MessageSquare, Handshake,
  TrendingUp, ArrowRight, ImageIcon, Clock
} from 'lucide-react'

// Mock data for dashboard
const myListings = mockListings.slice(0, 2).map(l => ({ ...l, userId: 'me' }))

const mockOffers = [
  { id: '1', listingTitle: 'AI-Powered Content Generator SaaS', amount: 68000, from: 'Дмитрий В.', status: 'pending', date: '2 часа назад' },
  { id: '2', listingTitle: 'AI-Powered Content Generator SaaS', amount: 55000, from: 'Анна К.', status: 'pending', date: '1 день назад' },
  { id: '3', listingTitle: 'E-Commerce Analytics Dashboard', amount: 115000, from: 'Сергей М.', status: 'accepted', date: '3 дня назад' },
]

const stats = [
  { label: 'Активных проектов', value: '2', icon: Package, trend: null },
  { label: 'Просмотров за месяц', value: '3 350', icon: Eye, trend: '+12%' },
  { label: 'Входящих офферов', value: '3', icon: MessageSquare, trend: '+2 новых' },
  { label: 'Активных сделок', value: '1', icon: Handshake, trend: null },
]

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  pending: { label: 'Ожидает', variant: 'secondary' },
  accepted: { label: 'Принят', variant: 'default' },
  rejected: { label: 'Отклонён', variant: 'outline' },
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Обзор</h1>
        <p className="mt-1 text-sm text-muted-foreground">Добро пожаловать, Алексей</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, trend }) => (
          <Card key={label} className="p-0">
            <CardContent className="pt-5 pb-5 h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
                  {trend && <p className="mt-1 text-xs text-emerald-500">{trend}</p>}
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted/50">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* My listings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-semibold">Мои проекты</CardTitle>
            <Link href="/dashboard/listings">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Все проекты <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {myListings.map(listing => {
              const category = CATEGORIES.find(c => c.value === listing.category)
              return (
                <Link key={listing.id} href={`/listing/${listing.slug}`}>
                  <div className="flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                    {/* Thumbnail */}
                    <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-md border bg-muted">
                      <ImageIcon className="h-5 w-5 text-muted-foreground/30" strokeWidth={1} />
                    </div>
                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{listing.title}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-normal">{category?.label}</Badge>
                        <span className="text-xs text-muted-foreground">{listing.views} просм.</span>
                        <span className="text-xs text-muted-foreground">{listing.inquiries} запросов</span>
                      </div>
                    </div>
                    {/* Price */}
                    <div className="text-right">
                      <p className="text-sm font-semibold">${(listing.price / 1000).toFixed(0)}K</p>
                      <Badge variant="secondary" className="mt-1 text-xs font-normal">Активен</Badge>
                    </div>
                  </div>
                </Link>
              )
            })}
            <Link href="/sell/new">
              <div className="flex items-center justify-center rounded-lg border border-dashed p-4 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground">
                + Разместить новый проект
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Recent offers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-semibold">Последние офферы</CardTitle>
            <Link href="/dashboard/offers">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Все <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockOffers.map(offer => {
              const s = STATUS_MAP[offer.status]
              return (
                <div key={offer.id} className="space-y-1.5 rounded-lg border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-tight line-clamp-1">{offer.listingTitle}</p>
                    <Badge variant={s.variant} className="shrink-0 text-xs font-normal">{s.label}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-bold text-foreground">${offer.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">от {offer.from}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {offer.date}
                    </div>
                  </div>
                  {offer.status === 'pending' && (
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" className="h-7 flex-1 text-xs">Принять</Button>
                      <Button size="sm" variant="outline" className="h-7 flex-1 text-xs">Отклонить</Button>
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Активность</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { icon: MessageSquare, text: 'Новый оффер на «AI-Powered Content Generator SaaS» — $68 000', time: '2 часа назад', color: 'text-violet-500' },
              { icon: Eye, text: '«E-Commerce Analytics Dashboard» просмотрели 45 раз за сегодня', time: '5 часов назад', color: 'text-blue-500' },
              { icon: TrendingUp, text: 'Оффер на «E-Commerce Analytics Dashboard» принят — $115 000', time: '3 дня назад', color: 'text-emerald-500' },
              { icon: Package, text: 'Проект «AI-Powered Content Generator SaaS» прошёл верификацию', time: '5 дней назад', color: 'text-amber-500' },
            ].map(({ icon: Icon, text, time, color }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-muted/50`}>
                  <Icon className={`h-3.5 w-3.5 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{text}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
