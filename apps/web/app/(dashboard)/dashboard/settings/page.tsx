'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/auth'

const schema = z.object({
  first_name: z.string().min(1, 'Введите имя'),
  last_name: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().url('Введите корректный URL').optional().or(z.literal('')),
  company: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function SettingsPage() {
  const { profile, setProfile } = useAuthStore()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  // Заполняем форму когда профиль загрузился
  useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name ?? '',
        last_name: profile.last_name ?? '',
        bio: profile.bio ?? '',
        website: profile.website ?? '',
        company: profile.company ?? '',
      })
    }
  }, [profile, reset])

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()

    if (!res.ok) {
      toast.error(json.error ?? 'Ошибка сохранения')
      return
    }

    setProfile(json.profile)
    toast.success('Профиль обновлён')
  }

  const initials = profile?.first_name
    ? `${profile.first_name[0]}${profile.last_name?.[0] ?? ''}`.toUpperCase()
    : (profile?.email?.[0] ?? '?').toUpperCase()

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Настройки</h1>
        <p className="mt-1 text-sm text-muted-foreground">Управляйте профилем и аккаунтом</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Профиль</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.avatar_url ?? undefined} />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{profile?.email}</p>
                <p className="text-xs text-muted-foreground">Аватар берётся из GitHub/Google</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">Имя</Label>
                <Input id="first_name" {...register('first_name')} />
                {errors.first_name && (
                  <p className="text-xs text-destructive">{errors.first_name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Фамилия</Label>
                <Input id="last_name" {...register('last_name')} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Компания</Label>
              <Input id="company" placeholder="Название компании" {...register('company')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">О себе</Label>
              <Textarea id="bio" placeholder="Расскажите о себе..." rows={3} {...register('bio')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Сайт</Label>
              <Input id="website" type="url" placeholder="https://yoursite.com" {...register('website')} />
              {errors.website && (
                <p className="text-xs text-destructive">{errors.website.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Сохранить изменения
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Уведомления</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { id: 'notif-offer', label: 'Новый оффер на мой проект', hint: 'Получать email при новом предложении' },
            { id: 'notif-deal', label: 'Изменение статуса сделки', hint: 'Обновления по активным сделкам' },
            { id: 'notif-views', label: 'Новые просмотры проекта', hint: 'Еженедельная сводка' },
          ].map(({ id, label, hint }) => (
            <div key={id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{hint}</p>
              </div>
              <Switch id={id} defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Опасная зона</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Удалить аккаунт</p>
              <p className="text-xs text-muted-foreground">Все данные будут удалены безвозвратно</p>
            </div>
            <Button variant="destructive" size="sm">Удалить</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
