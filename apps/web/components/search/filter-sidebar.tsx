'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { X } from 'lucide-react'
import { CATEGORIES, TECH_STACKS } from '@/lib/constants'
import { SearchFilters, StartupCategory } from '@/types'

const PRICE_RANGES = [
  { label: 'до $10K', min: 0, max: 10000 },
  { label: '$10K–$50K', min: 10000, max: 50000 },
  { label: '$50K–$100K', min: 50000, max: 100000 },
  { label: '$100K–$500K', min: 100000, max: 500000 },
  { label: 'от $500K', min: 500000, max: Infinity },
]

interface FilterSidebarProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
}

export function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.priceMin || 0,
    filters.priceMax || 1000000
  ])

  const toggleCategory = (category: StartupCategory) => {
    const current = filters.category || []
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category]
    onFiltersChange({ ...filters, category: updated })
  }

  const toggleTechStack = (tech: string) => {
    const current = filters.techStack || []
    const updated = current.includes(tech)
      ? current.filter(t => t !== tech)
      : [...current, tech]
    onFiltersChange({ ...filters, techStack: updated })
  }

  const clearFilters = () => {
    onFiltersChange({})
    setPriceRange([0, 1000000])
  }

  const hasActiveFilters = 
    (filters.category && filters.category.length > 0) ||
    (filters.techStack && filters.techStack.length > 0) ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined

  return (
    <div className="space-y-6">
      {hasActiveFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" />
          Сбросить фильтры
        </Button>
      )}

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Цена</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Slider
              min={0}
              max={1000000}
              step={10000}
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              onValueCommit={(value) => {
                onFiltersChange({
                  ...filters,
                  priceMin: value[0],
                  priceMax: value[1]
                })
              }}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>${(priceRange[0] / 1000).toFixed(0)}K</span>
              <span>${(priceRange[1] / 1000).toFixed(0)}K</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRICE_RANGES.map((range) => (
              <Badge
                key={range.label}
                variant="outline"
                className="cursor-pointer text-xs font-normal transition-colors hover:bg-primary hover:text-primary-foreground"
                onClick={() => {
                  setPriceRange([range.min, range.max === Infinity ? 1000000 : range.max])
                  onFiltersChange({
                    ...filters,
                    priceMin: range.min,
                    priceMax: range.max === Infinity ? undefined : range.max
                  })
                }}
              >
                {range.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Категория</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {CATEGORIES.map((category) => {
              const isSelected = filters.category?.includes(category.value as StartupCategory)
              return (
                <div
                  key={category.value}
                  className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm cursor-pointer transition-colors ${
                    isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => toggleCategory(category.value as StartupCategory)}
                >
                  <span className="font-medium">{category.label}</span>
                  {isSelected && <div className="h-2 w-2 rounded-full bg-primary" />}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Технологии</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Frontend</Label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {TECH_STACKS.frontend.slice(0, 6).map((tech) => (
                  <Badge
                    key={tech}
                    variant={filters.techStack?.includes(tech) ? 'default' : 'outline'}
                    className="cursor-pointer text-xs font-normal"
                    onClick={() => toggleTechStack(tech)}
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Backend</Label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {TECH_STACKS.backend.slice(0, 6).map((tech) => (
                  <Badge
                    key={tech}
                    variant={filters.techStack?.includes(tech) ? 'default' : 'outline'}
                    className="cursor-pointer text-xs font-normal"
                    onClick={() => toggleTechStack(tech)}
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">База данных</Label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {TECH_STACKS.database.slice(0, 6).map((tech) => (
                  <Badge
                    key={tech}
                    variant={filters.techStack?.includes(tech) ? 'default' : 'outline'}
                    className="cursor-pointer text-xs font-normal"
                    onClick={() => toggleTechStack(tech)}
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MRR Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Ежемесячная выручка (MRR)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="mrr-min" className="text-xs text-muted-foreground">От</Label>
              <Input
                id="mrr-min"
                type="number"
                placeholder="0"
                className="mt-1"
                value={filters.mrrMin || ''}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  mrrMin: e.target.value ? Number(e.target.value) : undefined
                })}
              />
            </div>
            <div>
              <Label htmlFor="mrr-max" className="text-xs text-muted-foreground">До</Label>
              <Input
                id="mrr-max"
                type="number"
                placeholder="Любая"
                className="mt-1"
                value={filters.mrrMax || ''}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  mrrMax: e.target.value ? Number(e.target.value) : undefined
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
