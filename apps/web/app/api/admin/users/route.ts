import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'

export async function GET(request: Request) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error
  const { supabase } = auth

  const { searchParams } = new URL(request.url)
  const page  = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '20')
  const search = searchParams.get('search') ?? ''

  let query = supabase
    .from('profiles')
    .select('id, first_name, last_name, email, avatar_url, role, reputation, total_sales, total_purchases, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`)
  }

  const { data, error, count } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ users: data ?? [], total: count ?? 0, page, limit })
}
