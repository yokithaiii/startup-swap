'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { 
  Rocket, 
  Search, 
  Menu,
  Sun,
  Moon
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuthStore } from '@/store/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}

export function Navbar() {
  const { isAuthenticated, profile, user, signOut } = useAuthStore()

  const initials = (profile?.first_name ?? user?.firstName ?? profile?.email ?? '?')
    .charAt(0).toUpperCase()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between ml-auto mr-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Rocket className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">StartupSwap</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          <Link href="/browse" className="text-sm font-medium transition-colors hover:text-primary">
            Проекты
          </Link>
          <Link href="/buy" className="text-sm font-medium transition-colors hover:text-primary">
            Купить
          </Link>
          <Link href="/sell" className="text-sm font-medium transition-colors hover:text-primary">
            Продать
          </Link>
          <Link href="/how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
            Как это работает
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <ThemeToggle />
              <Link href="/dashboard">
                <Button>Дашборд</Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={profile?.avatar_url ?? user?.avatar ?? undefined} />
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="font-normal">
                    <p className="font-medium">{profile?.first_name ?? user?.firstName ?? 'Профиль'}</p>
                    <p className="text-xs text-muted-foreground">{profile?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link href="/dashboard">Дашборд</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/dashboard/listings">Мои проекты</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/dashboard/settings">Настройки</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">Выйти</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Link href="/sign-in" className="hidden md:block">
                <Button variant="ghost">Войти</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Начать</Button>
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                <Link href="/browse" className="text-lg font-medium">Каталог</Link>
                <Link href="/sell" className="text-lg font-medium">Продать</Link>
                <Link href="/buy" className="text-lg font-medium">Купить</Link>
                <Link href="/how-it-works" className="text-lg font-medium">Как это работает</Link>
                {isAuthenticated && (
                  <>
                    <hr />
                    <Link href="/sell/new" className="text-lg font-medium">Продать стартап</Link>
                    <Link href="/dashboard" className="text-lg font-medium">Дашборд</Link>
                    <Link href="/settings" className="text-lg font-medium">Настройки</Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
