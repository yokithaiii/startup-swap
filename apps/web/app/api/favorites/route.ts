import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/favorites — избранные листинги текущего пользователя
// ?full=1 — вернуть полные данные листингов (для страницы избранного)
// без параметра — только ids (для хука useFavorites)
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ ids: [] })
  }

  const { searchParams } = new URL(request.url)
  const full = searchParams.get('full') === '1'

  if (full) {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        listing_id,
        created_at,
        listing:listing_id (
          id, title, tagline, slug, category, price, currency,
          thumbnail_url, views, favorites, metrics, status,
          tech_frontend, tech_backend, tech_database,
          published_at, featured
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ listings: [], ids: [] }, { status: 500 })
    }

    const listings = (data ?? [])
      .map(r => r.listing)
      .filter(Boolean)

    const ids = listings.map((l: any) => l.id)

    return NextResponse.json({ listings, ids })
  }

  // Только ids — для хука
  const { data, error } = await supabase
    .from('favorites')
    .select('listing_id')
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ ids: [] })
  }

  return NextResponse.json({ ids: (data ?? []).map(r => r.listing_id) })
}
