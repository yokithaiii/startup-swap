'use client'

import { UseFormReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ListingFormData } from '@/lib/schemas/listing'

interface Props { form: UseFormReturn<ListingFormData, any> }

function MetricField({
  id, label, hint, prefix, suffix, placeholder = '0', form, field,
}: {
  id: string
  label: string
  hint?: string
  prefix?: string
  suffix?: string
  placeholder?: string
  form: UseFormReturn<ListingFormData, any>
  field: keyof ListingFormData
}) {
  const { register, formState: { errors } } = form
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm">{label}</Label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none">{prefix}</span>
        )}
        <Input
          id={id}
          type="number"
          min={0}
          placeholder={placeholder}
          className={prefix ? 'pl-7' : suffix ? 'pr-10' : ''}
          {...register(field)}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none">{suffix}</span>
        )}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {errors[field] && <p className="text-xs text-destructive">{(errors[field] as any).message}</p>}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  )
}

export function StepMetrics({ form }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Метрики проекта</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Реальные цифры повышают доверие и ускоряют продажу
        </p>
      </div>

      <Section title="Выручка">
        <MetricField id="mrr" label="MRR" prefix="$" form={form} field="mrr" hint="Ежемесячная регулярная выручка" />
        <MetricField id="arr" label="ARR" prefix="$" form={form} field="arr" hint="Оставьте пустым — рассчитается автоматически" />
      </Section>

      <div className="border-t border-dashed" />

      <Section title="Пользователи">
        <MetricField id="usersTotal" label="Всего пользователей" form={form} field="usersTotal" />
        <MetricField id="usersActive" label="Активных за 30 дней" form={form} field="usersActive" />
        <MetricField id="usersGrowth" label="Рост в месяц" suffix="%" form={form} field="usersGrowth" />
        <MetricField id="churn" label="Churn rate" suffix="%" form={form} field="churn" hint="Процент отписок в месяц" />
      </Section>

      <div className="border-t border-dashed" />

      <Section title="Трафик и расходы">
        <MetricField id="trafficMonthly" label="Посетителей в месяц" form={form} field="trafficMonthly" />
        <MetricField id="costHosting" label="Хостинг в месяц" prefix="$" form={form} field="costHosting" />
        <MetricField id="costOther" label="Прочие расходы" prefix="$" form={form} field="costOther" hint="Инструменты, API, прочее" />
      </Section>
    </div>
  )
}
