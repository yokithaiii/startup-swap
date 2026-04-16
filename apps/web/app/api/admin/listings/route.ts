import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'

export async function GET(request: Request) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error
  const { supabase } = auth

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') ?? 'PENDING_REVIEW'
  const page   = parseInt(searchParams.get('page') ?? '1')
  const limit  = parseInt(searchParams.get('limit') ?? '20')

  // Считаем отдельно — надёжнее с service role клиентом
  const { data: countData } = await supabase
    .from('listings')
    .select('id')
    .eq('status', status)

  const total = countData?.length ?? 0

  const { data, error } = await supabase
    .from('listings')
    .select(`
      id, title, tagline, category, status, price, currency,
      created_at, published_at, views, slug, thumbnail_url,
      profiles:user_id (id, first_name, last_name, email, avatar_url)
    `)
    .eq('status', status)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  console.log('[admin/listings] status:', status, 'error:', error?.message, 'total:', total, 'rows:', data?.length)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ listings: data ?? [], total, page, limit })
}
