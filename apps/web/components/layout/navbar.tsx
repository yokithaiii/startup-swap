'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { 
  Rocket, 
  Menu,
  Sun,
  Moon,
  X,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet'
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
            <SheetContent side="right" className="w-72 p-0">
              <SheetTitle className="sr-only">Меню</SheetTitle>

              {/* Header */}
              <div className="flex h-16 items-center justify-between border-b px-6">
                <Link href="/" className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  <span className="font-bold">StartupSwap</span>
                </Link>
              </div>

              {/* Nav links */}
              <nav className="flex flex-col p-4 space-y-1">
                {[
                  { href: '/browse',        label: 'Каталог' },
                  { href: '/buy',           label: 'Купить' },
                  { href: '/sell',          label: 'Продать' },
                  { href: '/how-it-works',  label: 'Как это работает' },
                  { href: '/valuation',     label: 'Оценить проект' },
                  { href: '/faq',           label: 'FAQ' },
                ].map(({ href, label }) => (
                  <SheetClose asChild key={href}>
                    <Link
                      href={href}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              {/* Auth section */}
              <div className="border-t p-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url ?? undefined} />
                        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {profile?.first_name ?? user?.firstName ?? 'Пользователь'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
                      </div>
                    </div>
                    <SheetClose asChild>
                      <Link href="/dashboard">
                        <Button className="w-full" size="sm">Дашборд</Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/sell/new">
                        <Button variant="outline" className="w-full mt-2" size="sm">Разместить проект</Button>
                      </Link>
                    </SheetClose>
                    <Button
                      variant="ghost"
                      className="w-full text-destructive hover:text-destructive mt-2"
                      size="sm"
                      onClick={signOut}
                    >
                      Выйти
                    </Button>
                  </>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Link href="/sign-in">
                        <Button variant="outline" className="w-full" size="sm">Войти</Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/sign-up">
                        <Button className="w-full mt-2" size="sm">Начать бесплатно</Button>
                      </Link>
                    </SheetClose>
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
