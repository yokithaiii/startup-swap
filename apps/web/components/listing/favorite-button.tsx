'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useFavorites } from '@/hooks/use-favorites'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  listingId: string
  initialCount?: number
}

export function FavoriteButton({ listingId, initialCount = 0 }: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavorites()
  const [count, setCount] = useState(initialCount)
  const fav = isFavorite(listingId)

  const handleClick = async () => {
    const wasFav = fav
    setCount(c => wasFav ? Math.max(0, c - 1) : c + 1)
    const ok = await toggle(listingId)
    if (!ok) {
      setCount(c => wasFav ? c + 1 : Math.max(0, c - 1))
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick}>
      <Heart className={cn('mr-1.5 h-4 w-4 transition-colors', fav && 'fill-rose-500 text-rose-500')} />
      {fav ? 'В избранном' : 'Сохранить'}
      {count > 0 && (
        <span className={cn('ml-1.5 text-xs', fav ? 'text-rose-500' : 'text-muted-foreground')}>
          {count}
        </span>
      )}
    </Button>
  )
}
