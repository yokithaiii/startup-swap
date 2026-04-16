import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/conversations — список всех чатов текущего пользователя
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('conversations')
    .select(`
      id,
      listing_id,
      buyer_id,
      seller_id,
      created_at,
      updated_at,
      listing:listing_id (id, title, slug, thumbnail_url),
      buyer:buyer_id (id, first_name, last_name, avatar_url),
      seller:seller_id (id, first_name, last_name, avatar_url),
      messages (
        id, content, sender_id, created_at
      )
    `)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('updated_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Добавляем последнее сообщение и количество непрочитанных
  const conversations = (data ?? []).map(conv => {
    const msgs = (conv.messages ?? []) as any[]
    const sorted = [...msgs].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    const lastMessage = sorted[0] ?? null
    const unreadCount = msgs.filter(m => m.sender_id !== user.id).length

    return {
      id:          conv.id,
      listing:     conv.listing,
      buyer:       conv.buyer,
      seller:      conv.seller,
      lastMessage,
      unreadCount,
      updatedAt:   conv.updated_at,
    }
  })

  return NextResponse.json({ conversations })
}

// POST /api/conversations — создать или найти существующий чат
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  const body = await request.json()
  const { listingId, sellerId, firstMessage } = body

  if (!listingId || !sellerId) {
    return NextResponse.json({ error: 'listingId и sellerId обязательны' }, { status: 400 })
  }

  if (user.id === sellerId) {
    return NextResponse.json({ error: 'Нельзя писать самому себе' }, { status: 400 })
  }

  // Ищем существующий чат
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('listing_id', listingId)
    .eq('buyer_id', user.id)
    .eq('seller_id', sellerId)
    .single()

  let conversationId: string

  if (existing) {
    conversationId = existing.id
  } else {
    const { data: created, error } = await supabase
      .from('conversations')
      .insert({ listing_id: listingId, buyer_id: user.id, seller_id: sellerId })
      .select('id')
      .single()

    if (error || !created) {
      return NextResponse.json({ error: error?.message ?? 'Ошибка создания чата' }, { status: 500 })
    }
    conversationId = created.id
  }

  // Если есть первое сообщение — сразу отправляем
  if (firstMessage?.trim()) {
    await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id:       user.id,
      content:         firstMessage.trim(),
    })

    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)
  }

  return NextResponse.json({ conversationId })
}
