import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type Params = { params: Promise<{ id: string }> }

// PATCH /api/offers/[id] — изменить статус оффера
export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  const { data: offer } = await supabase
    .from('offers')
    .select('id, buyer_id, seller_id, status')
    .eq('id', id)
    .single()

  if (!offer) {
    return NextResponse.json({ error: 'Оффер не найден' }, { status: 404 })
  }

  const isSeller = offer.seller_id === user.id
  const isBuyer  = offer.buyer_id  === user.id

  if (!isSeller && !isBuyer) {
    return NextResponse.json({ error: 'Нет доступа' }, { status: 403 })
  }

  if (offer.status !== 'pending') {
    return NextResponse.json({ error: 'Оффер уже обработан' }, { status: 400 })
  }

  const body = await request.json()
  const { status } = body as { status: string }

  // Продавец может принять или отклонить, покупатель — только отозвать (rejected)
  const allowed = isSeller
    ? ['accepted', 'rejected']
    : ['rejected']

  if (!allowed.includes(status)) {
    return NextResponse.json({ error: 'Недопустимый статус' }, { status: 400 })
  }

  const { data: updated, error } = await supabase
    .from('offers')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ offer: updated })
}
