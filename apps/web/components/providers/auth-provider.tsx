'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/auth'
import { User } from '@/types'

function supabaseUserToUser(supabaseUser: any): User {
  const fullName = supabaseUser.user_metadata?.full_name as string | undefined
  const firstName =
    supabaseUser.user_metadata?.first_name ??
    (fullName ? fullName.split(' ')[0] : undefined) ??
    supabaseUser.user_metadata?.user_name

  const lastName =
    supabaseUser.user_metadata?.last_name ??
    (fullName && fullName.includes(' ')
      ? fullName.split(' ').slice(1).join(' ')
      : undefined)

  return {
    id: supabaseUser.id,
    email: supabaseUser.email!,
    role: supabaseUser.user_metadata?.role ?? 'BOTH',
    firstName,
    lastName,
    avatar:
      supabaseUser.user_metadata?.avatar_url ??
      supabaseUser.user_metadata?.picture,
    reputation: 0,
    createdAt: new Date(supabaseUser.created_at),
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile } = useAuthStore()

  useEffect(() => {
    const supabase = createClient()

    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setUser(null)
        setProfile(null)
        return
      }

      setUser(supabaseUserToUser(user))

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      console.log('[AuthProvider] profile fetch:', { profile, error })
      setProfile(profile ?? null)
    }

    // Слушаем все события — INITIAL_SESSION сработает сразу при монтировании
    // если сессия уже есть (например после OAuth редиректа)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          return
        }
        // INITIAL_SESSION, SIGNED_IN, TOKEN_REFRESHED — грузим профиль
        if (session?.user) {
          loadUser()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [setUser, setProfile])

  return <>{children}</>
}
