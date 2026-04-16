import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/counts — счётчики для сайдбара
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ offers: 0, messages: 0 })

  const [{ data: offerRows }, { data: convRows }] = await Promise.all([
    // Pending входящие офферы
    supabase
      .from('offers')
      .select('id')
      .eq('seller_id', user.id)
      .eq('status', 'pending'),
    // Чаты где участник
    supabase
      .from('conversations')
      .select('id')
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`),
  ])

  // Непрочитанные сообщения — только если есть чаты
  let messages = 0
  if (convRows?.length) {
    const ids = convRows.map(c => c.id)
    const { data: msgRows } = await supabase
      .from('messages')
      .select('id')
      .in('conversation_id', ids)
      .neq('sender_id', user.id)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    messages = msgRows?.length ?? 0
  }

  return NextResponse.json({
    offers:   offerRows?.length  ?? 0,
    messages,
  })
}
