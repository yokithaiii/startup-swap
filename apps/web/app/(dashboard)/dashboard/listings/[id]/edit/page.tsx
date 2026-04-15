'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { listingSchema, ListingFormData } from '@/lib/schemas/listing'
import { StepBasic } from '@/components/sell/step-basic'
import { StepTech } from '@/components/sell/step-tech'
import { StepMetrics } from '@/components/sell/step-metrics'
import { StepMedia } from '@/components/sell/step-media'
import { StepPricing } from '@/components/sell/step-pricing'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'sonner'
import { updateListing } from '@/lib/api/listings'
import Link from 'next/link'

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()
  const [loading, setLoading] = useState(true)

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    mode: 'onTouched',
  })

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then(r => r.json())
      .then(({ listing }) => {
        if (!listing) { router.push('/dashboard/listings'); return }
        const m = listing.metrics ?? {}
        form.reset({
          title:           listing.title,
          tagline:         listing.tagline ?? '',
          description:     listing.description,
          category:        listing.category,
          techFrontend:    listing.tech_frontend ?? [],
          techBackend:     listing.tech_backend ?? [],
          techDatabase:    listing.tech_database ?? [],
          techInfra:       listing.tech_infra ?? [],
          techServices:    listing.tech_services ?? [],
          mrr:             m.mrr,
          arr:             m.arr,
          usersTotal:      m.users?.total ?? 0,
          usersActive:     m.users?.active ?? 0,
          usersGrowth:     m.users?.growth ?? 0,
          trafficMonthly:  m.traffic?.monthly ?? 0,
          costHosting:     m.costs?.hosting ?? 0,
          costOther:       m.costs?.other ?? 0,
          churn:           m.churn,
          demoUrl:         listing.demo_url ?? '',
          githubUrl:       listing.github_url ?? '',
          thumbnailUrl:    listing.thumbnail_url ?? '',
          images:          listing.images ?? [],
          price:           Number(listing.price),
          currency:        listing.currency ?? 'USD',
          priceNegotiable: listing.price_negotiable ?? false,
        })
      })
      .catch(() => toast.error('Не удалось загрузить проект'))
      .finally(() => setLoading(false))
  }, [id])

  const onSubmit = async (data: ListingFormData) => {
    try {
      await updateListing(id, data)
      toast.success('Изменения сохранены')
      router.push('/dashboard/listings')
    } catch (err: any) {
      toast.error(err.message ?? 'Ошибка сохранения')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/listings">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Редактировать проект</h1>
          <p className="text-sm text-muted-foreground">Изменения сохраняются сразу</p>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div className="rounded-xl border bg-card p-8 space-y-10">
          <StepBasic form={form} />
          <div className="border-t border-dashed" />
          <StepTech form={form} />
          <div className="border-t border-dashed" />
          <StepMetrics form={form} />
          <div className="border-t border-dashed" />
          <StepMedia form={form} />
          <div className="border-t border-dashed" />
          <StepPricing form={form} />
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/dashboard/listings">
            <Button variant="outline">Отмена</Button>
          </Link>
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" />
            {form.formState.isSubmitting ? 'Сохраняем...' : 'Сохранить изменения'}
          </Button>
        </div>
      </form>
    </div>
  )
}
