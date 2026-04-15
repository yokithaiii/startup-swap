'use client'

import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ListingFormData } from '@/lib/schemas/listing'
import { TECH_STACKS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Plus, X } from 'lucide-react'

interface Props { form: UseFormReturn<ListingFormData, any> }

type TechField = 'techFrontend' | 'techBackend' | 'techDatabase' | 'techInfra' | 'techServices'

const SECTIONS: { field: TechField; label: string; required?: boolean; suggestions: readonly string[] }[] = [
  { field: 'techFrontend', label: 'Frontend', required: true, suggestions: TECH_STACKS.frontend },
  { field: 'techBackend', label: 'Backend', required: true, suggestions: TECH_STACKS.backend },
  { field: 'techDatabase', label: 'База данных', suggestions: TECH_STACKS.database },
  { field: 'techInfra', label: 'Инфраструктура', suggestions: TECH_STACKS.infrastructure },
  { field: 'techServices', label: 'Сервисы', suggestions: TECH_STACKS.services },
]

function TechSection({ field, label, required, suggestions, form }: {
  field: TechField
  label: string
  required?: boolean
  suggestions: readonly string[]
  form: UseFormReturn<ListingFormData, any>
}) {
  const { watch, setValue, formState: { errors } } = form
  const selected: string[] = (watch(field) as string[]) || []
  const [custom, setCustom] = useState('')

  const toggle = (tech: string) => {
    setValue(field, selected.includes(tech)
      ? selected.filter(t => t !== tech)
      : [...selected, tech]
    )
  }

  const addCustom = () => {
    const val = custom.trim()
    if (val && !selected.includes(val)) setValue(field, [...selected, val])
    setCustom('')
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5">
        <Label className="text-sm font-medium">{label}</Label>
        {required && <span className="text-xs text-destructive">*</span>}
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2">
        {suggestions.map(tech => {
          const active = selected.includes(tech)
          return (
            <button
              key={tech}
              type="button"
              onClick={() => toggle(tech)}
              className={cn(
                'rounded-md border px-3 py-1.5 text-xs font-medium transition-all',
                active
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-transparent text-muted-foreground hover:border-foreground/50 hover:text-foreground'
              )}
            >
              {tech}
            </button>
          )
        })}
      </div>

      {/* Selected custom */}
      {selected.filter(t => !suggestions.includes(t as any)).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.filter(t => !suggestions.includes(t as any)).map(tech => (
            <button
              key={tech}
              type="button"
              onClick={() => toggle(tech)}
              className="flex items-center gap-1.5 rounded-md border border-foreground bg-foreground px-3 py-1.5 text-xs font-medium text-background"
            >
              {tech}
              <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}

      {/* Custom input */}
      <div className="flex gap-2">
        <Input
          placeholder="Добавить свою технологию..."
          value={custom}
          onChange={e => setCustom(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustom() } }}
          className="max-w-xs text-sm"
        />
        <Button type="button" variant="outline" size="icon" onClick={addCustom}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {errors[field] && (
        <p className="text-xs text-destructive">{(errors[field] as any)?.message}</p>
      )}
    </div>
  )
}

export function StepTech({ form }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Стек технологий</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Выберите технологии из списка или добавьте свои
        </p>
      </div>

      {SECTIONS.map((s, i) => (
        <div key={s.field}>
          {i > 0 && <div className="border-t border-dashed" />}
          <div className={i > 0 ? 'pt-8' : ''}>
            <TechSection {...s} form={form} />
          </div>
        </div>
      ))}
    </div>
  )
}
