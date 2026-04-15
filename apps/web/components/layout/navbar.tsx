'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { 
  Rocket, 
  Search, 
  User, 
  Menu,
  Plus,
  Heart,
  Bell,
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
import { Badge } from '@/components/ui/badge'

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
  const isAuthenticated = false
  const notificationCount = 3

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
            Каталог проектов
          </Link>
          <Link href="/how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
            Как это работает
          </Link>
          <Link href="/pricing" className="text-sm font-medium transition-colors hover:text-primary">
            Тарифы
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge variant="destructive" className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
                    {notificationCount}
                  </Badge>
                )}
              </Button>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <ThemeToggle />
              <Link href="/sell/new">
                <Button className="hidden md:flex">
                  <Plus className="mr-2 h-4 w-4" />
                  Продать стартап
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link href="/dashboard">Дашборд</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/my-listings">Мои листинги</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/my-offers">Мои офферы</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/my-deals">Мои сделки</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link href="/settings">Настройки</Link></DropdownMenuItem>
                  <DropdownMenuItem>Выйти</DropdownMenuItem>
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
                <Link href="/how-it-works" className="text-lg font-medium">Как это работает</Link>
                <Link href="/pricing" className="text-lg font-medium">Тарифы</Link>
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
