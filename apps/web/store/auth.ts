import { create } from 'zustand'
import { User } from '@/types'

export interface Profile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  bio: string | null
  company: string | null
  website: string | null
  role: string
  reputation: number
  total_sales: number
  total_purchases: number
  created_at: string
}

interface AuthStore {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isAuthenticated: boolean

  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (isLoading: boolean) => void
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set({ user, isAuthenticated: !!user, isLoading: false }),

  setProfile: (profile) =>
    set({ profile }),

  setLoading: (isLoading) =>
    set({ isLoading }),

  signOut: async () => {
    await fetch('/api/auth/sign-out', { method: 'POST' })
    set({ user: null, profile: null, isAuthenticated: false })
    window.location.href = '/'
  },
}))
