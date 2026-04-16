import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/offers — все офферы текущего пользователя (входящие + исходящие)
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') // 'received' | 'sent'

  let query = supabase
    .from('offers')
    .select(`
      *,
      listing:listing_id (id, title, slug, thumbnail_url),
      buyer:buyer_id (id, first_name, last_name, avatar_url),
      seller:seller_id (id, first_name, last_name, avatar_url)
    `)
    .order('created_at', { ascending: false })

  if (type === 'received') {
    query = query.eq('seller_id', user.id)
  } else if (type === 'sent') {
    query = query.eq('buyer_id', user.id)
  } else {
    // Оба направления
    query = query.or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ offers: data ?? [] })
}
