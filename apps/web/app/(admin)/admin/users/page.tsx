'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Search, Calendar, TrendingUp, ShoppingBag, ExternalLink } from 'lucide-react'

const ROLES = ['BUYER', 'SELLER', 'BOTH', 'ADMIN']

const ROLE_STYLES: Record<string, string> = {
  ADMIN:  'text-violet-500 bg-violet-500/10 border-violet-500/20',
  SELLER: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  BUYER:  'text-blue-500 bg-blue-500/10 border-blue-500/20',
  BOTH:   'text-amber-500 bg-amber-500/10 border-amber-500/20',
}

interface AdminUser {
  id:               string
  first_name:       string | null
  last_name:        string | null
  email:            string
  avatar_url:       string | null
  role:             string
  reputation:       number
  total_sales:      number
  total_purchases:  number
  created_at:       string
}

export default function AdminUsersPage() {
  const [users, setUsers]       = useState<AdminUser[]>([])
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  const load = (q = '') => {
    setLoading(true)
    fetch(`/api/admin/users?limit=50${q ? `&search=${q}` : ''}`)
      .then(r => r.json())
      .then(json => { setUsers(json.users ?? []); setTotal(json.total ?? 0) })
      .catch(() => toast.error('Ошибка загрузки'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    load(search)
  }

  const handleRoleChange = async (userId: string, role: string) => {
    setUpdating(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ role }),
      })
      const json = await res.json()
      if (!res.ok) { toast.error(json.error); return }
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u))
      toast.success('Роль обновлена')
    } catch {
      toast.error('Ошибка обновления')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Пользователи</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? '...' : `${total} участников`}
          </p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Имя или email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="outline">Найти</Button>
      </form>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <Card key={i}><CardContent className="p-5"><Skeleton className="h-12 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="flex items-center justify-center rounded-xl border border-dashed py-16">
          <p className="text-sm text-muted-foreground">Пользователи не найдены</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map(u => {
            const name = [u.first_name, u.last_name].filter(Boolean).join(' ') || u.email
            const init = name.charAt(0).toUpperCase()
            return (
              <Card key={u.id} className="p-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={u.avatar_url ?? undefined} />
                      <AvatarFallback>{init}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-sm">{name}</p>
                        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${ROLE_STYLES[u.role] ?? ''}`}>
                          {u.role}
                        </span>
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>{u.email}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(u.created_at).toLocaleDateString('ru-RU')}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Продаж: {u.total_sales}
                        </span>
                        <span className="flex items-center gap-1">
                          <ShoppingBag className="h-3 w-3" />
                          Покупок: {u.total_purchases}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Select
                        value={u.role}
                        onValueChange={role => handleRoleChange(u.id, role)}
                        disabled={updating === u.id}
                      >
                        <SelectTrigger className="h-8 w-28 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map(r => (
                            <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Link href={`/dashboard/users/${u.id}`} target="_blank">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
