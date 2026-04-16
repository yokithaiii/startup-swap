'use client'

import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'
import { toast } from 'sonner'

interface ShareButtonProps {
  slug: string
}

export function ShareButton({ slug }: ShareButtonProps) {
  const handleShare = async () => {
    const url = `${window.location.origin}/listing/${slug}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Ссылка скопирована', {
        description: url,
      })
    } catch {
      // Fallback для браузеров без clipboard API
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      toast.success('Ссылка скопирована')
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <Share2 className="mr-1.5 h-4 w-4" />
      Поделиться
    </Button>
  )
}
