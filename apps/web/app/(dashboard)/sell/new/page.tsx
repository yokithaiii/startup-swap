'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { listingSchema, ListingFormData, defaultValues } from '@/lib/schemas/listing'
import { StepBasic } from '@/components/sell/step-basic'
import { StepTech } from '@/components/sell/step-tech'
import { StepMetrics } from '@/components/sell/step-metrics'
import { StepMedia } from '@/components/sell/step-media'
import { StepPricing } from '@/components/sell/step-pricing'
import { StepPreview } from '@/components/sell/step-preview'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const STEPS = [
  { id: 1, title: 'Основное' },
  { id: 2, title: 'Технологии' },
  { id: 3, title: 'Метрики' },
  { id: 4, title: 'Медиа' },
  { id: 5, title: 'Цена' },
  { id: 6, title: 'Превью' },
]

const STEP_FIELDS: Record<number, (keyof ListingFormData)[]> = {
  1: ['title', 'description', 'category'],
  2: ['techFrontend', 'techBackend'],
  3: ['usersTotal'],
  4: [],
  5: ['price'],
  6: [],
}

export default function NewListingPage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues,
    mode: 'onTouched',
  })

  const next = async () => {
    const fields = STEP_FIELDS[step]
    const valid = fields.length === 0 || await form.trigger(fields)
    if (valid) setStep(s => Math.min(s + 1, STEPS.length))
  }

  const prev = () => setStep(s => Math.max(s - 1, 1))

  const onSubmit = (data: ListingFormData) => {
    console.log('Submit:', data)
    toast.success('Проект отправлен на верификацию!')
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="mx-auto max-w-sm text-center space-y-6 px-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border bg-muted/50">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Проект отправлен!</h1>
            <p className="mt-2 text-muted-foreground">
              Мы проверим его в течение 24–48 часов и уведомим вас по email.
            </p>
          </div>
          <Button onClick={() => { setSubmitted(false); setStep(1); form.reset() }}>
            Разместить ещё один проект
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-2xl font-bold tracking-tight">Разместить проект</h1>
            <p className="mt-1.5 text-muted-foreground text-sm">
              Шаг {step} из {STEPS.length} — {STEPS[step - 1].title}
            </p>
          </div>

          {/* Stepper */}
          <div className="mb-10 flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex flex-1 items-center gap-2 last:flex-none">
                <button
                  type="button"
                  disabled={step <= s.id}
                  onClick={() => step > s.id && setStep(s.id)}
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all',
                    step === s.id && 'bg-foreground text-background',
                    step > s.id && 'bg-foreground text-background opacity-60 hover:opacity-100 cursor-pointer',
                    step < s.id && 'border border-border text-muted-foreground'
                  )}
                >
                  {step > s.id ? '✓' : s.id}
                </button>
                {i < STEPS.length - 1 && (
                  <div className={cn(
                    'h-px flex-1',
                    step > s.id ? 'bg-foreground/30' : 'bg-border'
                  )} />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="rounded-xl border bg-card p-8">
              {step === 1 && <StepBasic form={form} />}
              {step === 2 && <StepTech form={form} />}
              {step === 3 && <StepMetrics form={form} />}
              {step === 4 && <StepMedia form={form} />}
              {step === 5 && <StepPricing form={form} />}
              {step === 6 && <StepPreview form={form} />}
            </div>

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={prev}
                disabled={step === 1}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Button>

              {step < STEPS.length ? (
                <Button type="button" onClick={next}>
                  Далее
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Отправить на верификацию
                </Button>
              )}
            </div>
          </form>

    </div>
  )
}
