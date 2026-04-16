import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type Params = { params: Promise<{ id: string }> }

// PATCH /api/notifications/[id] — пометить одно как прочитанное
export async function PATCH(_req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id)
    .eq('user_id', user.id)

  return NextResponse.json({ ok: true })
}

// DELETE /api/notifications/[id]
export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  await supabase
    .from('notifications')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  return NextResponse.json({ ok: true })
}
