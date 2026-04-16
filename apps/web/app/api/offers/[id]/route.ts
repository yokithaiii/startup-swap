import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createNotification } from '@/lib/notifications'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const { data: offer } = await supabase
    .from('offers')
    .select('id, buyer_id, seller_id, status, amount, currency, listing_id, listing:listing_id(title)')
    .eq('id', id)
    .single()

  if (!offer) return NextResponse.json({ error: 'Оффер не найден' }, { status: 404 })

  const isSeller = offer.seller_id === user.id
  const isBuyer  = offer.buyer_id  === user.id

  if (!isSeller && !isBuyer) return NextResponse.json({ error: 'Нет доступа' }, { status: 403 })
  if (offer.status !== 'pending') return NextResponse.json({ error: 'Оффер уже обработан' }, { status: 400 })

  const body = await request.json()
  const { status } = body as { status: string }

  const allowed = isSeller ? ['accepted', 'rejected'] : ['rejected']
  if (!allowed.includes(status)) return NextResponse.json({ error: 'Недопустимый статус' }, { status: 400 })

  const { data: updated, error } = await supabase
    .from('offers')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Уведомление покупателю о результате
  const listingTitle = (offer.listing as any)?.title ?? 'проект'
  const symbol = offer.currency === 'USD' ? '$' : offer.currency === 'EUR' ? '€' : '₽'
  const amount = `${symbol}${Number(offer.amount).toLocaleString()}`

  if (status === 'accepted') {
    await createNotification({
      supabase,
      userId:    offer.buyer_id,
      type:      'offer_accepted',
      title:     'Оффер принят',
      message:   `Ваш оффер ${amount} на «${listingTitle}» принят. Сделка начата.`,
      listingId: offer.listing_id,
      offerId:   offer.id,
      link:      '/dashboard/deals',
    })
  } else if (status === 'rejected' && isSeller) {
    await createNotification({
      supabase,
      userId:    offer.buyer_id,
      type:      'offer_rejected',
      title:     'Оффер отклонён',
      message:   `Ваш оффер ${amount} на «${listingTitle}» был отклонён.`,
      listingId: offer.listing_id,
      offerId:   offer.id,
      link:      '/dashboard/offers',
    })
  }

  return NextResponse.json({ offer: updated })
}
