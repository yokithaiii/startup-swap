import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface Props {
  params: Promise<{ id: string }>
}

// POST /api/listings/[id]/favorite — добавить в избранное
export async function POST(_req: Request, { params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  // Upsert — если уже есть, ничего не делаем
  const { error } = await supabase
    .from('favorites')
    .upsert({ user_id: user.id, listing_id: id }, { onConflict: 'user_id,listing_id' })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Инкрементируем счётчик
  await supabase.rpc('increment_favorites', { listing_id: id })

  return NextResponse.json({ favorited: true })
}

// DELETE /api/listings/[id]/favorite — убрать из избранного
export async function DELETE(_req: Request, { params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('listing_id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Декрементируем счётчик
  await supabase.rpc('decrement_favorites', { listing_id: id })

  return NextResponse.json({ favorited: false })
}
