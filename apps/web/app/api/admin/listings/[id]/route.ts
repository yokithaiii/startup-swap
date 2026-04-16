import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { createNotification } from '@/lib/notifications'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params
  const auth = await requireAdmin()
  if (auth.error) return auth.error
  const { supabase } = auth

  const body = await request.json()
  const { action } = body

  if (!['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Неверное действие' }, { status: 400 })
  }

  const newStatus = action === 'approve' ? 'ACTIVE' : 'REJECTED'

  const { data, error } = await supabase
    .from('listings')
    .update({
      status:       newStatus,
      published_at: action === 'approve' ? new Date().toISOString() : null,
    })
    .eq('id', id)
    .select('id, title, status, user_id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Уведомление продавцу
  if (data) {
    await createNotification({
      supabase,
      userId:    data.user_id,
      type:      action === 'approve' ? 'listing_approved' : 'listing_rejected',
      title:     action === 'approve' ? 'Проект опубликован' : 'Проект отклонён',
      message:   action === 'approve'
        ? `«${data.title}» прошёл верификацию и опубликован в каталоге.`
        : `«${data.title}» не прошёл верификацию. Свяжитесь с поддержкой для уточнений.`,
      listingId: data.id,
      link:      action === 'approve' ? `/listing/${id}` : '/dashboard/listings',
    })
  }

  return NextResponse.json({ listing: data })
}

// GET /api/admin/listings/[id] — полные данные листинга для просмотра
export async function GET(_req: Request, { params }: Params) {
  const { id } = await params
  const auth = await requireAdmin()
  if (auth.error) return auth.error
  const { supabase } = auth

  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      profiles:user_id (id, first_name, last_name, email, avatar_url, reputation, created_at)
    `)
    .eq('id', id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Не найден' }, { status: 404 })

  return NextResponse.json({ listing: data })
}
