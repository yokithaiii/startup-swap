import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'

export async function GET() {
  const auth = await requireAdmin()
  if (auth.error) return auth.error
  const { supabase } = auth

  // Получаем все статусы одним запросом через группировку
  const { data: statusRows } = await supabase
    .from('listings')
    .select('status')

  const statusCounts = (statusRows ?? []).reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = (acc[row.status] ?? 0) + 1
    return acc
  }, {})

  const { data: profileRows } = await supabase
    .from('profiles')
    .select('id')

  const { data: offerRows } = await supabase
    .from('offers')
    .select('id')

  const { data: recentListings } = await supabase
    .from('listings')
    .select('id, title, status, created_at, price, currency, category')
    .order('created_at', { ascending: false })
    .limit(5)

  return NextResponse.json({
    stats: {
      pending: statusCounts['PENDING_REVIEW'] ?? 0,
      active:  statusCounts['ACTIVE']         ?? 0,
      users:   profileRows?.length            ?? 0,
      offers:  offerRows?.length              ?? 0,
    },
    recentListings: recentListings ?? [],
  })
}
