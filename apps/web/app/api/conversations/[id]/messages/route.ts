import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type Params = { params: Promise<{ id: string }> }

// GET /api/conversations/[id]/messages — сообщения чата
export async function GET(_req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  // Проверяем что пользователь участник чата
  const { data: conv } = await supabase
    .from('conversations')
    .select('id, buyer_id, seller_id, listing:listing_id (id, title, slug, thumbnail_url)')
    .eq('id', id)
    .single()

  if (!conv) {
    return NextResponse.json({ error: 'Чат не найден' }, { status: 404 })
  }

  if (conv.buyer_id !== user.id && conv.seller_id !== user.id) {
    return NextResponse.json({ error: 'Нет доступа' }, { status: 403 })
  }

  const { data: messages, error } = await supabase
    .from('messages')
    .select(`
      id, content, sender_id, created_at,
      sender:sender_id (id, first_name, last_name, avatar_url)
    `)
    .eq('conversation_id', id)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Определяем собеседника
  const otherUserId = conv.buyer_id === user.id ? conv.seller_id : conv.buyer_id
  const { data: otherUser } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url')
    .eq('id', otherUserId)
    .single()

  return NextResponse.json({
    messages: messages ?? [],
    conversation: conv,
    otherUser,
    currentUserId: user.id,
  })
}

// POST /api/conversations/[id]/messages — отправить сообщение
export async function POST(request: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  // Проверяем участие в чате
  const { data: conv } = await supabase
    .from('conversations')
    .select('id, buyer_id, seller_id')
    .eq('id', id)
    .single()

  if (!conv) {
    return NextResponse.json({ error: 'Чат не найден' }, { status: 404 })
  }

  if (conv.buyer_id !== user.id && conv.seller_id !== user.id) {
    return NextResponse.json({ error: 'Нет доступа' }, { status: 403 })
  }

  const body = await request.json()
  const content = body.content?.trim()

  if (!content) {
    return NextResponse.json({ error: 'Сообщение не может быть пустым' }, { status: 400 })
  }

  const { data: message, error } = await supabase
    .from('messages')
    .insert({ conversation_id: id, sender_id: user.id, content })
    .select(`
      id, content, sender_id, created_at,
      sender:sender_id (id, first_name, last_name, avatar_url)
    `)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Обновляем updated_at у чата
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', id)

  return NextResponse.json({ message }, { status: 201 })
}
