'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ListingCard } from '@/components/listing/listing-card'
import { FilterSidebar } from '@/components/search/filter-sidebar'
import { mockListings } from '@/lib/mock-data'
import { SearchFilters } from '@/types'
import { Search, SlidersHorizontal, Grid3x3, List } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Сначала новые' },
  { value: 'price_asc', label: 'Цена: по возрастанию' },
  { value: 'price_desc', label: 'Цена: по убыванию' },
  { value: 'popular', label: 'Популярные' },
]

export default function BrowsePage() {
  const [filters, setFilters] = useState<SearchFilters>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredListings = useMemo(() => {
    let results = [...mockListings]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (listing) =>
          listing.title.toLowerCase().includes(query) ||
          listing.description.toLowerCase().includes(query) ||
          listing.tagline?.toLowerCase().includes(query)
      )
    }

    if (filters.category && filters.category.length > 0) {
      results = results.filter((listing) =>
        filters.category!.includes(listing.category)
      )
    }

    if (filters.priceMin !== undefined) {
      results = results.filter((listing) => listing.price >= filters.priceMin!)
    }
    if (filters.priceMax !== undefined) {
      results = results.filter((listing) => listing.price <= filters.priceMax!)
    }

    if (filters.techStack && filters.techStack.length > 0) {
      results = results.filter((listing) => {
        const allTech = [
          ...listing.techStack.frontend,
          ...listing.techStack.backend,
          ...listing.techStack.database,
          ...listing.techStack.infrastructure,
          ...listing.techStack.services,
        ]
        return filters.techStack!.some((tech) => allTech.includes(tech))
      })
    }

    if (filters.mrrMin !== undefined) {
      results = results.filter((listing) => (listing.metrics.mrr || 0) >= filters.mrrMin!)
    }
    if (filters.mrrMax !== undefined) {
      results = results.filter((listing) => (listing.metrics.mrr || 0) <= filters.mrrMax!)
    }

    switch (sortBy) {
      case 'newest':
        results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case 'price_asc':
        results.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        results.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        results.sort((a, b) => b.views - a.views)
        break
    }

    return results
  }, [filters, searchQuery, sortBy])

  const activeFiltersCount = 
    (filters.category?.length || 0) +
    (filters.techStack?.length || 0) +
    (filters.priceMin !== undefined ? 1 : 0) +
    (filters.priceMax !== undefined ? 1 : 0) +
    (filters.mrrMin !== undefined ? 1 : 0) +
    (filters.mrrMax !== undefined ? 1 : 0)

  return (
    <div className="container py-10 ml-auto mr-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Каталог проектов</h1>
        <p className="text-muted-foreground">
          {mockListings.length} верифицированных проектов готовы к продаже
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию или описанию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Фильтры
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2" variant="secondary">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <div className="mt-8">
                <FilterSidebar filters={filters} onFiltersChange={setFilters} />
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="hidden md:flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-72 shrink-0">
          <div className="sticky top-20">
            <FilterSidebar filters={filters} onFiltersChange={setFilters} />
          </div>
        </aside>

        {/* Listings Grid */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Найдено: <span className="font-medium text-foreground">{filteredListings.length}</span> проектов
            </p>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilters({})
                  setSearchQuery('')
                }}
              >
                Сбросить всё
              </Button>
            )}
          </div>

          {filteredListings.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? 'grid gap-6 md:grid-cols-2 xl:grid-cols-3'
                : 'space-y-6'
            }>
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
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
        </div>
      </div>
    </div>
  )
}
