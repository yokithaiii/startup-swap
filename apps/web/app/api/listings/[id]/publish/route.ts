import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type Params = { params: Promise<{ id: string }> }

// POST /api/listings/[id]/publish — отправить на верификацию / опубликовать
export async function POST(_req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  const { data: listing } = await supabase
    .from('listings')
    .select('user_id, status')
    .eq('id', id)
    .single()

  if (!listing) return NextResponse.json({ error: 'Не найдено' }, { status: 404 })
  if (listing.user_id !== user.id) return NextResponse.json({ error: 'Нет доступа' }, { status: 403 })
  if (!['DRAFT', 'REJECTED'].includes(listing.status)) {
    return NextResponse.json({ error: 'Листинг уже опубликован или продан' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('listings')
    .update({ status: 'PENDING_REVIEW' })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ listing: data })
}

// DELETE /api/listings/[id]/publish — снять с публикации
export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  const { data: listing } = await supabase
    .from('listings')
    .select('user_id, status')
    .eq('id', id)
    .single()

  if (!listing) return NextResponse.json({ error: 'Не найдено' }, { status: 404 })
  if (listing.user_id !== user.id) return NextResponse.json({ error: 'Нет доступа' }, { status: 403 })
  if (listing.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'Листинг не активен' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('listings')
    .update({ status: 'DELISTED' })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ listing: data })
}
