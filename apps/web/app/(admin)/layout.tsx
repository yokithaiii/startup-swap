import Link from 'next/link'
import { Rocket, LayoutDashboard, Package, Users, ArrowLeft } from 'lucide-react'

const NAV = [
  { href: '/admin',          label: 'Обзор',        icon: LayoutDashboard },
  { href: '/admin/listings', label: 'Проекты',      icon: Package },
  { href: '/admin/users',    label: 'Пользователи', icon: Users },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r bg-background lg:flex sticky top-0 h-screen">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Rocket className="h-5 w-5" />
          <span className="font-bold">Admin</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t p-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            К дашборду
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b px-6 lg:hidden">
          <span className="font-bold">Admin Panel</span>
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
