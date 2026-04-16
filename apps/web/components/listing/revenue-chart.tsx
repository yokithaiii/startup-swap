'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface RevenueChartProps {
  data: number[]
}

const MONTHS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн']

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.map((value, i) => ({
    month: MONTHS[i] ?? `М${i + 1}`,
    revenue: value,
  }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#888" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#888" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
        />
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: 12,
            color: 'hsl(var(--foreground))',
          }}
          formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Выручка']}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#888"
          strokeWidth={2}
          fill="url(#revenueGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
