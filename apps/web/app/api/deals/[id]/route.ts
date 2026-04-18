import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createNotification } from '@/lib/notifications'

type Params = { params: Promise<{ id: string }> }

// PATCH /api/deals/[id] — обновить статус или milestone
export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const { data: deal } = await supabase
    .from('deals')
    .select('id, buyer_id, seller_id, status, milestones, final_price, currency, listing:listing_id(title, slug)')
    .eq('id', id)
    .single()

  if (!deal) return NextResponse.json({ error: 'Сделка не найдена' }, { status: 404 })

  const isBuyer  = deal.buyer_id  === user.id
  const isSeller = deal.seller_id === user.id
  if (!isBuyer && !isSeller) return NextResponse.json({ error: 'Нет доступа' }, { status: 403 })

  const body = await request.json()
  const { action, milestoneIndex } = body

  // Завершить сделку
  if (action === 'complete') {
    const { data: updated, error } = await supabase
      .from('deals')
      .update({ status: 'COMPLETED', completed_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Уведомляем обоих участников
    const title = (deal.listing as any)?.title ?? 'проект'
    const otherId = isBuyer ? deal.seller_id : deal.buyer_id
    await createNotification({
      supabase, userId: otherId,
      type: 'offer_accepted', title: 'Сделка завершена',
      message: `Сделка по проекту «${title}» успешно завершена.`,
      link: '/dashboard/deals',
    })

    return NextResponse.json({ deal: updated })
  }

  // Отметить milestone как выполненный
  if (action === 'milestone' && typeof milestoneIndex === 'number') {
    const milestones = [...(deal.milestones as any[])]
    if (!milestones[milestoneIndex]) {
      return NextResponse.json({ error: 'Milestone не найден' }, { status: 400 })
    }

    milestones[milestoneIndex] = { ...milestones[milestoneIndex], done: true }

    // Если все выполнены — автоматически завершаем сделку
    const allDone = milestones.every(m => m.done)

    const { data: updated, error } = await supabase
      .from('deals')
      .update({
        milestones,
        ...(allDone && { status: 'COMPLETED', completed_at: new Date().toISOString() }),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Уведомляем другую сторону
    const title = (deal.listing as any)?.title ?? 'проект'
    const otherId = isBuyer ? deal.seller_id : deal.buyer_id
    await createNotification({
      supabase, userId: otherId,
      type: 'offer_accepted',
      title: allDone ? 'Сделка завершена' : 'Этап выполнен',
      message: allDone
        ? `Все этапы по «${title}» выполнены. Сделка завершена.`
        : `Этап "${milestones[milestoneIndex].title}" по «${title}» отмечен как выполненный.`,
      link: '/dashboard/deals',
    })

    return NextResponse.json({ deal: updated })
  }

  return NextResponse.json({ error: 'Неверное действие' }, { status: 400 })
}
