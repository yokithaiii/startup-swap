import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { listingSchema } from '@/lib/schemas/listing'

type Params = { params: Promise<{ id: string }> }

// GET /api/listings/[id]
export async function GET(_req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('listings')
    .select(`*, profiles:user_id (id, first_name, last_name, avatar_url, reputation, created_at)`)
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Не найдено' }, { status: 404 })
  }

  // Инкрементируем просмотры
  await supabase
    .from('listings')
    .update({ views: (data.views ?? 0) + 1 })
    .eq('id', id)

  return NextResponse.json({ listing: data })
}

// PATCH /api/listings/[id]
export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  // Проверяем владельца
  const { data: existing } = await supabase
    .from('listings')
    .select('user_id, status')
    .eq('id', id)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Не найдено' }, { status: 404 })
  }
  if (existing.user_id !== user.id) {
    return NextResponse.json({ error: 'Нет доступа' }, { status: 403 })
  }
  if (existing.status === 'SOLD') {
    return NextResponse.json({ error: 'Нельзя редактировать проданный листинг' }, { status: 400 })
  }

  try {
    const body = await request.json()
    const data = listingSchema.partial().parse(body)

    const updateData: Record<string, unknown> = {}
    if (data.title !== undefined)           updateData.title = data.title
    if (data.tagline !== undefined)         updateData.tagline = data.tagline
    if (data.description !== undefined)     updateData.description = data.description
    if (data.category !== undefined)        updateData.category = data.category
    if (data.techFrontend !== undefined)    updateData.tech_frontend = data.techFrontend
    if (data.techBackend !== undefined)     updateData.tech_backend = data.techBackend
    if (data.techDatabase !== undefined)    updateData.tech_database = data.techDatabase
    if (data.techInfra !== undefined)       updateData.tech_infra = data.techInfra
    if (data.techServices !== undefined)    updateData.tech_services = data.techServices
    if (data.price !== undefined)           updateData.price = data.price
    if (data.currency !== undefined)        updateData.currency = data.currency
    if (data.priceNegotiable !== undefined) updateData.price_negotiable = data.priceNegotiable
    if (data.demoUrl !== undefined)         updateData.demo_url = data.demoUrl || null
    if (data.githubUrl !== undefined)       updateData.github_url = data.githubUrl || null
    if (data.thumbnailUrl !== undefined)    updateData.thumbnail_url = data.thumbnailUrl || null
    if (data.images !== undefined)          updateData.images = data.images ?? []

    // Обновляем метрики если пришли
    if (data.mrr !== undefined || data.usersTotal !== undefined) {
      const { data: current } = await supabase
        .from('listings')
        .select('metrics')
        .eq('id', id)
        .single()

      updateData.metrics = {
        ...(current?.metrics ?? {}),
        ...(data.mrr !== undefined && { mrr: data.mrr }),
        ...(data.arr !== undefined && { arr: data.arr }),
        ...(data.usersTotal !== undefined && {
          users: {
            total: data.usersTotal,
            active: data.usersActive ?? 0,
            growth: data.usersGrowth ?? 0,
          },
        }),
        ...(data.trafficMonthly !== undefined && {
          traffic: { monthly: data.trafficMonthly, sources: {} },
        }),
        ...(data.costHosting !== undefined && {
          costs: { hosting: data.costHosting, other: data.costOther ?? 0 },
        }),
        ...(data.churn !== undefined && { churn: data.churn }),
      }
    }

    const { data: listing, error } = await supabase
      .from('listings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ listing })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 422 })
    }
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 })
  }
}

// DELETE /api/listings/[id]
export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  const { data: existing } = await supabase
    .from('listings')
    .select('user_id, status')
    .eq('id', id)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Не найдено' }, { status: 404 })
  }
  if (existing.user_id !== user.id) {
    return NextResponse.json({ error: 'Нет доступа' }, { status: 403 })
  }
  if (!['DRAFT', 'REJECTED', 'DELISTED'].includes(existing.status)) {
    return NextResponse.json({ error: 'Можно удалять только черновики и отклонённые' }, { status: 400 })
  }

  const { error } = await supabase.from('listings').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
