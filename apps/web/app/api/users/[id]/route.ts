import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type Params = { params: Promise<{ id: string }> }

// GET /api/users/[id] — публичный профиль пользователя
export async function GET(_req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()

  // Профиль
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url, bio, company, website, twitter, linkedin, reputation, total_sales, total_purchases, created_at, email_verified, identity_verified')
    .eq('id', id)
    .single()

  if (error || !profile) {
    return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
  }

  // Активные публичные листинги
  const { data: listings } = await supabase
    .from('listings')
    .select('id, title, slug, tagline, category, price, currency, thumbnail_url, views, favorites, metrics, status, published_at')
    .eq('user_id', id)
    .eq('status', 'ACTIVE')
    .eq('visibility', 'public')
    .order('published_at', { ascending: false })

  // Кол-во всех листингов (включая проданные)
  const { count: totalListings } = await supabase
    .from('listings')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', id)
    .in('status', ['ACTIVE', 'SOLD'])

  return NextResponse.json({
    profile,
    listings: listings ?? [],
    stats: {
      totalListings: totalListings ?? 0,
      totalSales: profile.total_sales ?? 0,
      totalPurchases: profile.total_purchases ?? 0,
      reputation: profile.reputation ?? 0,
    },
  })
}
