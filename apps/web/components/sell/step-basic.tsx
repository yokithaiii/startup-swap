'use client'

import { UseFormReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ListingFormData } from '@/lib/schemas/listing'
import { CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface Props { form: UseFormReturn<ListingFormData, any> }

export function StepBasic({ form }: Props) {
  const { register, watch, setValue, formState: { errors } } = form
  const category = watch('category')
  const descLen = watch('description')?.length ?? 0

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Основная информация</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Расскажите о проекте — это первое, что увидит покупатель
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="title">
            Название <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Например: AI-инструмент для генерации контента"
            {...register('title')}
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline">Короткое описание</Label>
          <Input
            id="tagline"
            placeholder="Одна строка — суть проекта"
            {...register('tagline')}
          />
          <p className="text-xs text-muted-foreground">Отображается в карточке проекта</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Подробное описание <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Что делает проект, кто целевая аудитория, почему продаёте, что входит в сделку..."
            rows={5}
            {...register('description')}
          />
          <div className="flex items-center justify-between">
            {errors.description
              ? <p className="text-xs text-destructive">{errors.description.message}</p>
              : <span />
            }
            <p className={cn('text-xs', descLen < 50 ? 'text-muted-foreground' : 'text-emerald-500')}>
              {descLen} / 50+
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label>
          Категория <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setValue('category', cat.value as ListingFormData['category'])}
              className={cn(
                'rounded-lg border p-4 text-left text-sm font-medium transition-all hover:border-foreground/50',
                category === cat.value
                  ? 'border-foreground bg-foreground/5'
                  : 'border-border text-muted-foreground'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
      </div>
    </div>
  )
}
