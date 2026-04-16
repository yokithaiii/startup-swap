'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { ArrowRight, BarChart3, TrendingUp, Info } from 'lucide-react'

// Мультипликаторы по категориям (x от ARR)
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

export default function ValuationPage() {
  const [mrr, setMrr] = useState('')
  const [growth, setGrowth] = useState([15])
  const [category, setCategory] = useState('SAAS')
  const [churn, setChurn] = useState([5])
  const [result, setResult] = useState<{ min: number; max: number; mid: number } | null>(null)

  const calculate = () => {
    const mrrNum = parseFloat(mrr.replace(/[^0-9.]/g, ''))
    if (!mrrNum || mrrNum <= 0) return

    const arr = mrrNum * 12
    const mult = MULTIPLES[category]

    // Корректируем мультипликатор на рост и churn
    const growthBonus = growth[0] > 20 ? 0.5 : growth[0] > 10 ? 0.25 : 0
    const churnPenalty = churn[0] > 10 ? -0.5 : churn[0] > 5 ? -0.25 : 0
    const adj = growthBonus + churnPenalty

    const min = Math.round(arr * (mult.min + adj))
    const max = Math.round(arr * (mult.max + adj))
    const mid = Math.round((min + max) / 2)

    setResult({ min, max, mid })
  }

  return (
    <div className="mx-auto w-full px-4 py-16 md:py-24 max-w-lg">

      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Оценка стоимости проекта</h1>
        <p className="mt-4 text-muted-foreground">
          Введите метрики — получите диапазон рыночной стоимости за 30 секунд
        </p>
      </div>

      {/* Calculator */}
      <Card className="pt-0">
        <CardContent className="pt-6 space-y-6">

          {/* MRR */}
          <div className="space-y-2">
            <Label htmlFor="mrr">Ежемесячная выручка (MRR), $</Label>
            <Input
              id="mrr"
              placeholder="Например: 5000"
              value={mrr}
              onChange={e => setMrr(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Среднее за последние 3 месяца</p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Категория</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MULTIPLES).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Growth */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Рост MRR в месяц</Label>
              <span className="text-sm font-medium">{growth[0]}%</span>
            </div>
            <Slider
              min={0} max={50} step={1}
              value={growth}
              onValueChange={setGrowth}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span><span>50%+</span>
            </div>
          </div>

          {/* Churn */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Месячный churn</Label>
              <span className="text-sm font-medium">{churn[0]}%</span>
            </div>
            <Slider
              min={0} max={20} step={0.5}
              value={churn}
              onValueChange={setChurn}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span><span>20%+</span>
            </div>
          </div>

          <Button className="w-full" onClick={calculate}>
            Рассчитать стоимость
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <div className="mt-6 space-y-4">
          <Card className="border-foreground/20 pt-0">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Оценочная стоимость</p>
              <p className="text-4xl font-bold tracking-tight">{fmt(result.mid)}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Диапазон: {fmt(result.min)} — {fmt(result.max)}
              </p>

              <div className="mt-4 h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-foreground w-1/2" />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">ARR</p>
                  <p className="font-semibold">{fmt(parseFloat(mrr) * 12)}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Мультипл</p>
                  <p className="font-semibold">
                    {MULTIPLES[category].min}x–{MULTIPLES[category].max}x
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Категория</p>
                  <p className="font-semibold">{MULTIPLES[category].label}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-start gap-2 rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <p>Это ориентировочная оценка на основе рыночных мультипликаторов. Реальная цена зависит от качества кода, трафика, команды и других факторов.</p>
          </div>

          <div className="flex gap-3">
            <Link href="/sell/new" className="flex-1">
              <Button className="w-full">
                Разместить проект
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" onClick={() => setResult(null)} className="flex-1">
              Пересчитать
            </Button>
          </div>
        </div>
      )}

      {/* How it works */}
      {!result && (
        <div className="mt-8 space-y-3">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Как считается оценка</p>
          {[
            { icon: BarChart3, text: 'Базовый мультипликатор зависит от категории (AI стартапы оцениваются выше)' },
            { icon: TrendingUp, text: 'Высокий рост MRR увеличивает оценку, высокий churn — снижает' },
            { icon: ArrowRight, text: 'Итоговая цена = ARR × мультипликатор с поправками' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
              <Icon className="h-4 w-4 shrink-0 mt-0.5" />
              <p>{text}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
