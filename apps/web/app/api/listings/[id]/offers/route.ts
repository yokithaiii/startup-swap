import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const offerSchema = z.object({
  amount:     z.number().positive('Сумма должна быть положительной'),
  message:    z.string().min(10, 'Сообщение слишком короткое'),
  conditions: z.string().optional(),
})

type Params = { params: Promise<{ id: string }> }

// POST /api/listings/[id]/offers — создать оффер
export async function POST(request: Request, { params }: Params) {
  const { id: listingId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  // Получаем листинг чтобы узнать seller_id и проверить статус
  const { data: listing } = await supabase
    .from('listings')
    .select('id, user_id, status, currency')
    .eq('id', listingId)
    .single()

  if (!listing) {
    return NextResponse.json({ error: 'Листинг не найден' }, { status: 404 })
  }
  if (listing.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'Листинг недоступен для офферов' }, { status: 400 })
  }
  if (listing.user_id === user.id) {
    return NextResponse.json({ error: 'Нельзя делать оффер на свой листинг' }, { status: 400 })
  }

  try {
    const body = await request.json()
    const data = offerSchema.parse(body)

    const { data: offer, error } = await supabase
      .from('offers')
      .insert({
        listing_id:  listingId,
        buyer_id:    user.id,
        seller_id:   listing.user_id,
        amount:      data.amount,
        currency:    listing.currency,
        message:     data.message,
        conditions:  data.conditions ?? null,
        status:      'pending',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ offer }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 422 })
    }
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 })
  }
}
