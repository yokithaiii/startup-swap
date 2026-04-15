'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowRight } from 'lucide-react'

const MULTIPLES: Record<string, { min: number; max: number; label: string }> = {
  AI_ML:      { min: 3.5, max: 6,   label: 'AI & ML' },
  SAAS:       { min: 3,   max: 5,   label: 'SaaS' },
  ECOMMERCE:  { min: 1.5, max: 3,   label: 'E-commerce' },
  WEB3:       { min: 2,   max: 4,   label: 'Web3' },
  FINTECH:    { min: 3,   max: 5,   label: 'FinTech' },
  HEALTHTECH: { min: 2.5, max: 4.5, label: 'HealthTech' },
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

export function ValuationWidget() {
  const [mrr, setMrr] = useState('')
  const [category, setCategory] = useState('SAAS')
  const [result, setResult] = useState<{ min: number; max: number } | null>(null)

  const calculate = () => {
    const mrrNum = parseFloat(mrr.replace(/[^0-9.]/g, ''))
    if (!mrrNum || mrrNum <= 0) return
    const arr = mrrNum * 12
    const mult = MULTIPLES[category]
    setResult({
      min: Math.round(arr * mult.min),
      max: Math.round(arr * mult.max),
    })
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-2xl border bg-muted/30 p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row">
          <Input
            placeholder="MRR, например 5000 $"
            value={mrr}
            onChange={e => setMrr(e.target.value)}
            className="flex-1 bg-background"
            onKeyDown={e => e.key === 'Enter' && calculate()}
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-40 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(MULTIPLES).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={calculate} className="shrink-0">
            Оценить
          </Button>
        </div>

        {result ? (
          <div className="mt-6 flex items-center justify-between rounded-xl border bg-background px-6 py-4">
            <div>
              <p className="text-xs text-muted-foreground">Оценочная стоимость</p>
              <p className="text-2xl font-bold tracking-tight">
                {fmt(result.min)} — {fmt(result.max)}
              </p>
            </div>
            <Link href="/sell/new">
              <Button size="sm">
                Продать
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        ) : (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Расчёт основан на рыночных мультипликаторах.{' '}
            <Link href="/valuation" className="underline underline-offset-4 hover:text-foreground">
              Детальная оценка →
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
