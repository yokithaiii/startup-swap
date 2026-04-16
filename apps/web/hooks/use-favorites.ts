'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

// Глобальный in-memory кэш чтобы не перезапрашивать при каждом монтировании карточки
let cachedIds: Set<string> | null = null
let fetchPromise: Promise<void> | null = null

function loadFavorites(): Promise<void> {
  if (fetchPromise) return fetchPromise
  fetchPromise = fetch('/api/favorites')
    .then(r => r.json())
    .then(json => { cachedIds = new Set(json.ids ?? []) })
    .catch(() => { cachedIds = new Set() })
  return fetchPromise
}

export function useFavorites() {
  const [ids, setIds] = useState<Set<string>>(cachedIds ?? new Set())
  const [loading, setLoading] = useState(!cachedIds)

  useEffect(() => {
    if (cachedIds) {
      setIds(new Set(cachedIds))
      setLoading(false)
      return
    }
    loadFavorites().then(() => {
      setIds(new Set(cachedIds!))
      setLoading(false)
    })
  }, [])

  const toggle = useCallback(async (listingId: string) => {
    const isFav = ids.has(listingId)

    // Optimistic update
    setIds(prev => {
      const next = new Set(prev)
      isFav ? next.delete(listingId) : next.add(listingId)
      cachedIds = next
      return next
    })

    try {
      const res = await fetch(`/api/listings/${listingId}/favorite`, {
        method: isFav ? 'DELETE' : 'POST',
      })

      if (res.status === 401) {
        // Откатываем
        setIds(prev => {
          const next = new Set(prev)
          isFav ? next.add(listingId) : next.delete(listingId)
          cachedIds = next
          return next
        })
        toast.error('Войдите, чтобы добавить в избранное')
        return
      }

      if (!res.ok) throw new Error()

      toast.success(isFav ? 'Убрано из избранного' : 'Добавлено в избранное')
    } catch {
      // Откатываем при ошибке
      setIds(prev => {
        const next = new Set(prev)
        isFav ? next.add(listingId) : next.delete(listingId)
        cachedIds = next
        return next
      })
      toast.error('Не удалось обновить избранное')
    }
  }, [ids])

  return { ids, loading, toggle, isFavorite: (id: string) => ids.has(id) }
}
