import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

/**
 * Проверяет что текущий пользователь — ADMIN.
 * Возвращает { user, supabase } где supabase — service role клиент
 * который обходит RLS и видит все данные.
 */
export async function requireAdmin() {
  // Проверяем авторизацию через обычный клиент (с cookies)
  const supabaseUser = await createClient()
  const { data: { user } } = await supabaseUser.auth.getUser()

  if (!user) {
    return {
      error: NextResponse.json({ error: 'Не авторизован' }, { status: 401 }),
    }
  }

  const { data: profile } = await supabaseUser
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'ADMIN') {
    return {
      error: NextResponse.json({ error: 'Нет доступа' }, { status: 403 }),
    }
  }

  // Возвращаем service role клиент — он обходит RLS
  // Если ключа нет — fallback на обычный клиент
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabase = serviceKey
    ? createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceKey,
        { auth: { autoRefreshToken: false, persistSession: false } }
      )
    : supabaseUser

  return { user, supabase }
}
