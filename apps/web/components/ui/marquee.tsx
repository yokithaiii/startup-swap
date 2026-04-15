'use client'

import { cn } from '@/lib/utils'

interface MarqueeProps {
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  children: React.ReactNode
}

export function Marquee({ className, reverse, pauseOnHover, children }: MarqueeProps) {
  return (
    <div className={cn('group flex overflow-hidden gap-6', className)}>
      {[0, 1].map((i) => (
        <div
          key={i}
          className={cn(
            'flex min-w-full shrink-0 items-stretch gap-6',
            pauseOnHover && 'group-hover:[animation-play-state:paused]'
          )}
          style={{
            animation: `${reverse ? 'marquee-reverse' : 'marquee'} 40s linear infinite`,
          }}
        >
          {children}
        </div>
      ))}
    </div>
  )
}
