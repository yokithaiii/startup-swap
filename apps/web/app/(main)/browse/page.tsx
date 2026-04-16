'use client'

import { Suspense, useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { ListingCard } from '@/components/listing/listing-card'
import { ListingRow } from '@/components/listing/listing-row'
import { FilterSidebar } from '@/components/search/filter-sidebar'
import { SearchFilters, Listing } from '@/types'
import { dbToListing } from '@/lib/adapters/listing'
import { Search, SlidersHorizontal, Grid3x3, List } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Сначала новые' },
  { value: 'price_asc',  label: 'Цена: по возрастанию' },
  { value: 'price_desc', label: 'Цена: по убыванию' },
  { value: 'popular',    label: 'Популярные' },
]

function BrowseContent() {
  const searchParams = useSearchParams()
  const [listings, setListings]     = useState<Listing[]>([])
  const [loading, setLoading]       = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage]             = useState(1)
  const [hasMore, setHasMore]       = useState(false)
  const [filters, setFilters]       = useState<SearchFilters>({
    category: searchParams.get('category')
      ? [searchParams.get('category') as any]
      : undefined,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy]           = useState('newest')
  const [viewMode, setViewMode]       = useState<'grid' | 'list'>('grid')

  const LIMIT = 9

  const fetchListings = async (p: number, replace: boolean) => {
    const params: Record<string, string> = { sort: sortBy, page: String(p), limit: String(LIMIT) }
    if (filters.priceMin !== undefined) params.priceMin = String(filters.priceMin)
    if (filters.priceMax !== undefined) params.priceMax = String(filters.priceMax)

    const res  = await fetch('/api/listings?' + new URLSearchParams(params))
    const json = await res.json()
    const rows = (json.listings ?? []).map(dbToListing)
    const total: number = json.total ?? 0

    if (replace) {
      setListings(rows)
    } else {
      setListings(prev => [...prev, ...rows])
    }
    setHasMore(p * LIMIT < total)
  }

  // Перезагрузка при смене сортировки или ценовых фильтров
  useEffect(() => {
    setLoading(true)
    setPage(1)
    fetchListings(1, true)
      .catch(() => setListings([]))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, filters.priceMin, filters.priceMax])

  const handleLoadMore = async () => {
    const next = page + 1
    setLoadingMore(true)
    await fetchListings(next, false).catch(() => {})
    setPage(next)
    setLoadingMore(false)
  }

  // Клиентская фильтрация (категория, поиск, tech stack, mrr)
  const filtered = useMemo(() => {
    let res = [...listings]

    if (filters.category?.length) {
      res = res.filter(l => filters.category!.includes(l.category))
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      res = res.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.tagline?.toLowerCase().includes(q)
      )
    }

    if (filters.techStack?.length) {
      res = res.filter(l => {
        const all = [
          ...l.techStack.frontend, ...l.techStack.backend,
          ...l.techStack.database, ...l.techStack.infrastructure,
          ...l.techStack.services,
        ]
        return filters.techStack!.some(t => all.includes(t))
      })
    }

    if (filters.mrrMin !== undefined)
      res = res.filter(l => (l.metrics.mrr ?? 0) >= filters.mrrMin!)
    if (filters.mrrMax !== undefined)
      res = res.filter(l => (l.metrics.mrr ?? 0) <= filters.mrrMax!)

    return res
  }, [listings, searchQuery, filters.category, filters.techStack, filters.mrrMin, filters.mrrMax])

  const activeFiltersCount =
    (filters.category?.length || 0) +
    (filters.techStack?.length || 0) +
    (filters.priceMin !== undefined ? 1 : 0) +
    (filters.priceMax !== undefined ? 1 : 0) +
    (filters.mrrMin !== undefined ? 1 : 0) +
    (filters.mrrMax !== undefined ? 1 : 0)

  return (
    <div className="container py-10 ml-auto mr-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Каталог проектов</h1>
        <p className="text-muted-foreground">
          {loading ? 'Загрузка...' : `${filtered.length} верифицированных проектов`}
        </p>
      </div>

      {/* Search & Sort bar */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию или описанию..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Фильтры
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2" variant="secondary">{activeFiltersCount}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <div className="mt-8">
                <FilterSidebar filters={filters} onFiltersChange={setFilters} />
              </div>
            </SheetContent>
          </Sheet>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(o => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="hidden md:flex border rounded-md">
            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden md:block w-72 shrink-0">
          <div className="sticky top-20">
            <FilterSidebar filters={filters} onFiltersChange={setFilters} />
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Найдено: <span className="font-medium text-foreground">{filtered.length}</span> проектов
            </p>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={() => { setFilters({}); setSearchQuery('') }}>
                Сбросить всё
              </Button>
            )}
          </div>

          {loading ? (
            viewMode === 'grid' ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="rounded-xl border overflow-hidden">
                    <Skeleton className="h-44 w-full rounded-none" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="rounded-xl border p-5">
                    <Skeleton className="h-16 w-full" />
                  </div>
                ))}
              </div>
            )
          ) : filtered.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map(listing => (
                  <ListingRow key={listing.id} listing={listing} />
                ))}
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border bg-muted/50">
                <Search className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Ничего не найдено</h3>
              <p className="mb-6 text-muted-foreground max-w-sm">
                Попробуйте изменить параметры поиска или сбросить фильтры
              </p>
              <Button onClick={() => { setFilters({}); setSearchQuery('') }}>
                Сбросить фильтры
              </Button>
            </div>
          )}

          {/* Load more */}
          {!loading && hasMore && filtered.length > 0 && !searchQuery && !filters.category?.length && !filters.techStack?.length && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="min-w-40"
              >
                {loadingMore ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Загрузка...
                  </>
                ) : (
                  'Показать ещё'
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BrowsePage() {
  return (
    <Suspense>
      <BrowseContent />
    </Suspense>
  )
}
