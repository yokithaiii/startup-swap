'use client'

import { useState, useRef, useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ListingFormData } from '@/lib/schemas/listing'
import { ImageIcon, Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Props { form: UseFormReturn<ListingFormData, any> }

export function StepMedia({ form }: Props) {
  const { register, formState: { errors }, setValue, watch } = form
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Инициализируем previews из значения формы (для режима редактирования)
  const thumbnailUrl = watch('thumbnailUrl' as any) as string | undefined
  const existingImages = watch('images' as any) as string[] | undefined
  const [previews, setPreviews] = useState<string[]>(() =>
    existingImages?.length ? existingImages : thumbnailUrl ? [thumbnailUrl] : []
  )

  // Синхронизируем когда форма делает reset() с данными из БД
  useEffect(() => {
    const imgs = existingImages ?? []
    if (imgs.length > 0 && JSON.stringify(imgs) !== JSON.stringify(previews)) {
      setPreviews(imgs)
    }
  }, [JSON.stringify(existingImages)])

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const allowed = Array.from(files).filter(f => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024)
    if (allowed.length !== files.length) {
      toast.error('Только изображения до 5MB')
    }
    if (previews.length + allowed.length > 5) {
      toast.error('Максимум 5 изображений')
      return
    }

    setUploading(true)
    const supabase = createClient()
    const uploaded: string[] = []

    for (const file of allowed) {
      const ext  = file.name.split('.').pop()
      const path = `listings/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error } = await supabase.storage
        .from('listing-images')
        .upload(path, file, { upsert: false })

      if (error) {
        toast.error(`Ошибка загрузки ${file.name}`)
        continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(path)

      uploaded.push(publicUrl)
    }

    if (uploaded.length > 0) {
      const newPreviews = [...previews, ...uploaded]
      setPreviews(newPreviews)
      setValue('thumbnailUrl' as any, newPreviews[0])
      setValue('images' as any, newPreviews)
      toast.success(`Загружено ${uploaded.length} фото`)
    }

    setUploading(false)
  }

  const removeImage = (url: string) => {
    const updated = previews.filter(p => p !== url)
    setPreviews(updated)
    setValue('thumbnailUrl' as any, updated[0] ?? '')
    setValue('images' as any, updated)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Медиа и ссылки</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Скриншоты и демо увеличивают количество запросов в 3 раза
        </p>
      </div>

      {/* Upload zone */}
      <div className="space-y-3">
        <Label>Скриншоты проекта</Label>

        {/* Previews */}
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {previews.map((url, i) => (
              <div key={url} className="relative group">
                <img
                  src={url}
                  alt={`preview-${i}`}
                  className="h-24 w-36 rounded-lg border object-cover"
                />
                {i === 0 && (
                  <span className="absolute left-1.5 top-1.5 rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-medium backdrop-blur-sm">
                    Обложка
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Drop zone */}
        {previews.length < 5 && (
          <div
            onDrop={onDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-12 text-center transition-colors hover:border-foreground/30 hover:bg-muted/20 cursor-pointer"
          >
            {uploading ? (
              <Loader2 className="mb-2 h-7 w-7 animate-spin text-muted-foreground" />
            ) : (
              <ImageIcon className="mb-3 h-8 w-8 text-muted-foreground/30" strokeWidth={1} />
            )}
            <p className="text-sm font-medium">
              {uploading ? 'Загружаем...' : 'Перетащите или нажмите для загрузки'}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              PNG, JPG до 5MB · максимум 5 изображений
            </p>
            {!uploading && (
              <Button type="button" variant="outline" size="sm" className="mt-4" disabled={uploading}>
                <Upload className="mr-2 h-3.5 w-3.5" />
                Выбрать файлы
              </Button>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => handleFiles(e.target.files)}
            />
          </div>
        )}
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
