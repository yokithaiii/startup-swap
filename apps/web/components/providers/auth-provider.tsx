'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/auth'
import { User } from '@/types'

function supabaseUserToUser(supabaseUser: any): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email!,
    role: supabaseUser.user_metadata?.role ?? 'BOTH',
    firstName: supabaseUser.user_metadata?.first_name,
    lastName: supabaseUser.user_metadata?.last_name,
    avatar: supabaseUser.user_metadata?.avatar_url,
    reputation: 0,
    createdAt: new Date(supabaseUser.created_at),
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    const supabase = createClient()

    // Получаем текущую сессию
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user ? supabaseUserToUser(user) : null)
    })

    // Слушаем изменения сессии
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ? supabaseUserToUser(session.user) : null)
      }
    )

    return () => subscription.unsubscribe()
  }, [setUser])

  return <>{children}</>
}
