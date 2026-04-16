import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/notifications
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ notifications: [], unread: 0 })

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ notifications: [], unread: 0 })

  const unread = (data ?? []).filter(n => !n.read).length
  return NextResponse.json({ notifications: data ?? [], unread })
}

// PATCH /api/notifications — пометить все как прочитанные
export async function PATCH() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', user.id)
    .eq('read', false)

  return NextResponse.json({ ok: true })
}
