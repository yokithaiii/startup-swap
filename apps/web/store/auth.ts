import { create } from 'zustand'
import { User } from '@/types'

interface AuthStore {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean

  setUser: (user: User | null) => void
  setLoading: (isLoading: boolean) => void
  signOut: () => Promise<void>
  updateProfile: (data: Partial<User>) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set({ user, isAuthenticated: !!user, isLoading: false }),

  setLoading: (isLoading) =>
    set({ isLoading }),

  signOut: async () => {
    await fetch('/api/auth/sign-out', { method: 'POST' })
    set({ user: null, isAuthenticated: false })
    window.location.href = '/'
  },

  updateProfile: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),
}))
