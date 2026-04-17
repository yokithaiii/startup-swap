import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Metadata } from 'next'

export const revalidate = 300

import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { RevenueChart } from '@/components/listing/revenue-chart'
import { OfferDialog } from '@/components/listing/offer-dialog'
import { ImageSlider } from '@/components/listing/image-slider'
import { AskSellerDialog } from '@/components/listing/ask-seller-dialog'
import { ShareButton } from '@/components/listing/share-button'
import { FavoriteButton } from '@/components/listing/favorite-button'
import { createClient } from '@/lib/supabase/server'
import { dbToListing } from '@/lib/adapters/listing'
import { CATEGORIES } from '@/lib/constants'
import {
  Eye, Heart, ExternalLink, Code2,
  TrendingUp, Users, BarChart3, DollarSign,
  ArrowLeft, CheckCircle2, Shield,
  FileText, Star
} from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: row } = await supabase
    .from('listings')
    .select('title, tagline, description, price, currency, thumbnail_url, images, category')
    .eq('slug', slug)
    .single()

  if (!row) return { title: 'Проект не найден' }

  const symbol = row.currency === 'USD' ? '$' : row.currency === 'EUR' ? '€' : '₽'
  const price  = `${symbol}${Number(row.price).toLocaleString('ru-RU')}`
  const title  = `${row.title} — ${price}`
  const desc   = row.tagline ?? row.description?.slice(0, 155) ?? ''
  const image  = row.images?.[0] ?? row.thumbnail_url ?? undefined

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: 'website',
      ...(image && { images: [{ url: image, width: 1200, height: 630, alt: row.title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      ...(image && { images: [image] }),
    },
  }
}

export default async function ListingPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: row } = await supabase
    .from('listings')
    .select(`*, profiles:user_id (id, first_name, last_name, avatar_url, reputation, created_at, total_sales)`)
    .eq('slug', slug)
    .single()

  if (!row) notFound()

  // Инкрементируем просмотры (fire-and-forget)
  supabase.from('listings').update({ views: (row.views ?? 0) + 1 }).eq('id', row.id)

  const listing = dbToListing(row)
  const seller  = row.profiles as any

  const category = CATEGORIES.find(c => c.value === listing.category)
  const symbol   = listing.currency === 'USD' ? '$' : listing.currency === 'EUR' ? '€' : '₽'

  const fmt = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`
    return n.toString()
  }

  const profit   = (listing.metrics.mrr || 0) - listing.metrics.costs.hosting - listing.metrics.costs.other
  const multiple = profit > 0 ? (listing.price / (profit * 12)).toFixed(1) : '—'

  const sellerName = seller?.first_name
    ? `${seller.first_name}${seller.last_name ? ' ' + seller.last_name : ''}`
    : 'Продавец'

  const sellerInitial = sellerName.charAt(0).toUpperCase()

  const joinedDate = seller?.created_at
    ? new Date(seller.created_at).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
    : '—'

  return (
    <div className="container py-8 ml-auto mr-auto">
      <Link href="/browse" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Назад к каталогу
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* LEFT */}
        <div className="space-y-6">

          {/* Hero image */}
          <ImageSlider
            images={listing.images?.length ? listing.images : listing.thumbnailUrl ? [listing.thumbnailUrl] : []}
            title={listing.title}
            featured={listing.featured}
          />

          {/* Title */}
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="outline">{category?.label}</Badge>
              {row.status === 'ACTIVE' && (
                <Badge variant="secondary" className="font-normal">
                  <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-500" />
                  Верифицирован
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{listing.title}</h1>
            {listing.tagline && (
              <p className="mt-2 text-lg text-muted-foreground">{listing.tagline}</p>
            )}
            <div className="mt-4 flex items-center gap-3">
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />{listing.views} просмотров
              </span>
              <div className="ml-auto flex gap-2">
                <FavoriteButton listingId={listing.id} initialCount={listing.favorites} />
                <ShareButton slug={listing.slug} />
              </div>
            </div>
          </div>

          <Separator className="border-dashed" />

          {/* Tabs */}
          <Tabs defaultValue="overview">
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1">Обзор</TabsTrigger>
              <TabsTrigger value="metrics"  className="flex-1">Метрики</TabsTrigger>
              <TabsTrigger value="tech"     className="flex-1">Технологии</TabsTrigger>
              <TabsTrigger value="docs"     className="flex-1">Документы</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="mt-6 space-y-6">
              <div>
                <h3 className="mb-3 font-semibold">О проекте</h3>
                <p className="leading-relaxed text-muted-foreground">{listing.description}</p>
              </div>
              {(listing.demoUrl || listing.githubUrl) && (
                <div className="flex flex-wrap gap-3">
                  {listing.demoUrl && (
                    <a href={listing.demoUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" />Демо
                      </Button>
                    </a>
                  )}
                  {listing.githubUrl && (
                    <a href={listing.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <Code2 className="mr-2 h-4 w-4" />GitHub
                      </Button>
                    </a>
                  )}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { icon: TrendingUp, label: 'MRR',          value: `${symbol}${fmt(listing.metrics.mrr || 0)}`,       color: 'text-emerald-500' },
                  { icon: Users,      label: 'Пользователи', value: fmt(listing.metrics.users.total),                  color: 'text-blue-500' },
                  { icon: BarChart3,  label: 'Трафик/мес',   value: fmt(listing.metrics.traffic.monthly),              color: 'text-violet-500' },
                  { icon: DollarSign, label: 'Мультипл',     value: `${multiple}x`,                                    color: 'text-amber-500' },
                ].map(({ icon: Icon, label, value, color }) => (
                  <Card key={label}>
                    <CardContent className="pt-4">
                      <Icon className={`mb-2 h-5 w-5 ${color}`} />
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-xl font-bold">{value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Metrics */}
            <TabsContent value="metrics" className="mt-6 space-y-6">
              <div>
                <h3 className="mb-4 font-semibold">Динамика выручки</h3>
                {listing.metrics.revenue.monthly.length > 0 ? (
                  <RevenueChart data={listing.metrics.revenue.monthly} />
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-10 text-center">
                    <BarChart3 className="mb-2 h-8 w-8 text-muted-foreground/30" strokeWidth={1} />
                    <p className="text-sm text-muted-foreground">Продавец не добавил данные о выручке</p>
                  </div>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'MRR',                  value: `${symbol}${(listing.metrics.mrr || 0).toLocaleString()}` },
                  { label: 'ARR',                  value: `${symbol}${(listing.metrics.arr || 0).toLocaleString()}` },
                  { label: 'Всего пользователей',  value: listing.metrics.users.total.toLocaleString() },
                  { label: 'Активных',             value: listing.metrics.users.active.toLocaleString() },
                  { label: 'Рост в месяц',         value: `+${listing.metrics.users.growth}%` },
                  { label: 'Churn',                value: listing.metrics.churn != null ? `${listing.metrics.churn}%` : '—' },
                  { label: 'LTV',                  value: listing.metrics.ltv ? `${symbol}${listing.metrics.ltv}` : '—' },
                  { label: 'CAC',                  value: listing.metrics.cac ? `${symbol}${listing.metrics.cac}` : '—' },
                  { label: 'Хостинг/мес',          value: `${symbol}${listing.metrics.costs.hosting}` },
                  { label: 'Прочие расходы',       value: `${symbol}${listing.metrics.costs.other}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between rounded-lg border px-4 py-3">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="font-semibold">{value}</span>
                  </div>
                ))}
              </div>
              {Object.keys(listing.metrics.traffic.sources).length > 0 && (
                <div>
                  <h3 className="mb-4 font-semibold">Источники трафика</h3>
                  <div className="space-y-3">
                    {Object.entries(listing.metrics.traffic.sources).map(([source, count]) => {
                      const pct = listing.metrics.traffic.monthly > 0
                        ? Math.round((count / listing.metrics.traffic.monthly) * 100)
                        : 0
                      const labels: Record<string, string> = { organic: 'Органика', paid: 'Платный', referral: 'Реферальный' }
                      return (
                        <div key={source}>
                          <div className="mb-1 flex justify-between text-sm">
                            <span className="text-muted-foreground">{labels[source] ?? source}</span>
                            <span className="font-medium">{pct}% · {fmt(count)}</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-foreground" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Tech */}
            <TabsContent value="tech" className="mt-6 space-y-5">
              {[
                { label: 'Frontend',        items: listing.techStack.frontend },
                { label: 'Backend',         items: listing.techStack.backend },
                { label: 'База данных',     items: listing.techStack.database },
                { label: 'Инфраструктура',  items: listing.techStack.infrastructure },
                { label: 'Сервисы',         items: listing.techStack.services },
              ].filter(({ items }) => items.length > 0).map(({ label, items }) => (
                <div key={label}>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">{label}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map(tech => (
                      <Badge key={tech} variant="secondary" className="font-normal">{tech}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Docs */}
            <TabsContent value="docs" className="mt-6">
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
                <FileText className="mb-3 h-10 w-10 text-muted-foreground/30" strokeWidth={1} />
                <p className="font-medium">Документы доступны после подписания NDA</p>
                <p className="mt-1 text-sm text-muted-foreground">Финансовые отчёты, аналитика и доступ к коду</p>
                <Button className="mt-6" variant="outline">
                  <Shield className="mr-2 h-4 w-4" />
                  Подписать NDA и получить доступ
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <Card className="sticky top-20 p-0 pb-6 z-[1]">
            <CardContent className="space-y-5 pt-5">
              <div>
                <p className="text-sm text-muted-foreground">Запрашиваемая цена</p>
                <p className="text-4xl font-bold tracking-tight">
                  {symbol}{listing.price.toLocaleString()}
                </p>
                {listing.priceNegotiable && (
                  <p className="mt-1 text-xs text-muted-foreground">Торг уместен</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: 'MRR',          value: `${symbol}${fmt(listing.metrics.mrr || 0)}` },
                  { label: 'Мультипл',     value: `${multiple}x` },
                  { label: 'Пользователи', value: fmt(listing.metrics.users.total) },
                  { label: 'Рост',         value: `+${listing.metrics.users.growth}%`, className: 'text-emerald-500' },
                ].map(({ label, value, className }) => (
                  <div key={label} className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className={`font-semibold ${className ?? ''}`}>{value}</p>
                  </div>
                ))}
              </div>

              <Separator className="border-dashed" />

              <OfferDialog
                listingId={listing.id}
                listingTitle={listing.title}
                askingPrice={listing.price}
                currency={listing.currency}
              />
              <AskSellerDialog
                sellerName={sellerName}
                listingTitle={listing.title}
                listingId={listing.id}
                sellerId={seller?.id ?? ''}
              />

              <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                <Shield className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Сделка защищена эскроу. Средства переводятся только после передачи проекта.</span>
              </div>
            </CardContent>
          </Card>

          {/* Seller */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Продавец</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link
                href={`/dashboard/users/${seller?.id}`}
                className="flex items-center gap-3 group"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={seller?.avatar_url ?? undefined} />
                  <AvatarFallback>{sellerInitial}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold group-hover:underline underline-offset-2">{sellerName}</p>
                  <p className="text-xs text-muted-foreground">На платформе с {joinedDate}</p>
                </div>
              </Link>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Сделок</p>
                  <p className="font-semibold">{seller?.total_sales ?? 0}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Репутация</p>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <p className="font-semibold">{seller?.reputation ?? 0}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meta */}
          <Card>
            <CardContent className="space-y-2 text-sm">
              {[
                { label: 'Опубликован', value: listing.publishedAt?.toLocaleDateString('ru-RU') ?? '—' },
                { label: 'Обновлён',    value: listing.updatedAt.toLocaleDateString('ru-RU') },
                { label: 'Запросов',    value: listing.inquiries },
                { label: 'Статус',      value: 'Активен' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
