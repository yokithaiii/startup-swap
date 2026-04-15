'use client'

import { UseFormReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ListingFormData } from '@/lib/schemas/listing'
import { ImageIcon, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props { form: UseFormReturn<ListingFormData, any> }

export function StepMedia({ form }: Props) {
  const { register, formState: { errors } } = form

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Медиа и ссылки</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Скриншоты и демо увеличивают количество запросов в 3 раза
        </p>
      </div>

      {/* Upload zone */}
      <div className="space-y-2">
        <Label>Скриншоты проекта</Label>
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-14 text-center transition-colors hover:border-foreground/30 hover:bg-muted/20 cursor-pointer">
          <ImageIcon className="mb-3 h-8 w-8 text-muted-foreground/30" strokeWidth={1} />
          <p className="text-sm font-medium">Перетащите файлы или нажмите для загрузки</p>
          <p className="mt-1 text-xs text-muted-foreground">PNG, JPG до 5MB · максимум 5 изображений</p>
          <Button type="button" variant="outline" size="sm" className="mt-4">
            <Upload className="mr-2 h-3.5 w-3.5" />
            Выбрать файлы
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Загрузка будет доступна после подключения бэкенда</p>
      </div>

      <div className="border-t border-dashed" />

      {/* Links */}
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="demoUrl">Ссылка на демо</Label>
          <Input
            id="demoUrl"
            type="url"
            placeholder="https://demo.yourproject.com"
            {...register('demoUrl')}
          />
          {errors.demoUrl && <p className="text-xs text-destructive">{errors.demoUrl.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="githubUrl">GitHub репозиторий</Label>
          <Input
            id="githubUrl"
            type="url"
            placeholder="https://github.com/username/repo"
            {...register('githubUrl')}
          />
          <p className="text-xs text-muted-foreground">
            Доступ к коду откроется только после подписания NDA покупателем
          </p>
          {errors.githubUrl && <p className="text-xs text-destructive">{errors.githubUrl.message}</p>}
        </div>
      </div>
    </div>
  )
}
