import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'

interface CountsStore {
  offers:   number
  messages: number
  loaded:   boolean

  setOffers:   (n: number) => void
  setMessages: (n: number) => void
  load:        () => Promise<void>
  subscribeRealtime: (userId: string) => () => void
}

export const useCountsStore = create<CountsStore>((set, get) => ({
  offers:   0,
  messages: 0,
  loaded:   false,

  setOffers:   (n) => set({ offers:   Math.max(0, n) }),
  setMessages: (n) => set({ messages: Math.max(0, n) }),

  load: async () => {
    if (get().loaded) return
    try {
      // Один запрос — получаем оба счётчика
      const res  = await fetch('/api/counts')
      if (!res.ok) return
      const json = await res.json()
      set({ offers: json.offers ?? 0, messages: json.messages ?? 0, loaded: true })
    } catch {
      set({ loaded: true })
    }
  },

  subscribeRealtime: (userId: string) => {
    const supabase = createClient()

    const channel = supabase
      .channel(`sidebar-counts:${userId}`)
      // Новый оффер для продавца
      .on('postgres_changes', {
        event:  'INSERT',
        schema: 'public',
        table:  'offers',
        filter: `seller_id=eq.${userId}`,
      }, () => set(s => ({ offers: s.offers + 1 })))
      // Оффер обработан — убираем из счётчика
      .on('postgres_changes', {
        event:  'UPDATE',
        schema: 'public',
        table:  'offers',
        filter: `seller_id=eq.${userId}`,
      }, (payload) => {
        if ((payload.new as any).status !== 'pending') {
          set(s => ({ offers: Math.max(0, s.offers - 1) }))
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  },
}))
