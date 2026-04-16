import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'

type Params = { params: Promise<{ id: string }> }

// PATCH /api/admin/users/[id] — изменить роль пользователя
export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params
  const auth = await requireAdmin()
  if (auth.error) return auth.error
  const { user, supabase } = auth

  // Нельзя изменить свою роль
  if (id === user.id) {
    return NextResponse.json({ error: 'Нельзя изменить свою роль' }, { status: 400 })
  }

  const body = await request.json()
  const { role } = body

  if (!['BUYER', 'SELLER', 'BOTH', 'ADMIN'].includes(role)) {
    return NextResponse.json({ error: 'Неверная роль' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', id)
    .select('id, role')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ user: data })
}
