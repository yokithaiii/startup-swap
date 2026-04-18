import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/deals — сделки текущего пользователя
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const { data, error } = await supabase
    .from('deals')
    .select(`
      id, status, final_price, currency, milestones, created_at,
      listing:listing_id (id, title, slug, thumbnail_url),
      buyer:buyer_id   (id, first_name, last_name, avatar_url),
      seller:seller_id (id, first_name, last_name, avatar_url)
    `)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ deals: data ?? [], currentUserId: user.id })
}
