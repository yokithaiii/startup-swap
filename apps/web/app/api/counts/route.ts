import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/counts — счётчики для сайдбара
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ offers: 0, messages: 0 })

  const { data: offerRows } = await supabase
    .from('offers')
    .select('id')
    .eq('seller_id', user.id)
    .eq('status', 'pending')

  return NextResponse.json({
    offers:   offerRows?.length ?? 0,
    messages: 0, // требует поле read в таблице messages
  })
}
