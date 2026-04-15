import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'

export default function SettingsPage() {
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
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Имя</Label>
              <Input id="firstName" defaultValue="Алексей" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Фамилия</Label>
              <Input id="lastName" defaultValue="К." />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="alex@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">О себе</Label>
            <Textarea id="bio" placeholder="Расскажите о себе..." rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Сайт</Label>
            <Input id="website" type="url" placeholder="https://yoursite.com" />
          </div>
          <Button>Сохранить изменения</Button>
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
