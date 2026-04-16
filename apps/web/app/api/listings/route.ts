import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { listingSchema } from '@/lib/schemas/listing'

// GET /api/listings — публичный каталог
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const supabase = await createClient()

  let query = supabase
    .from('listings')
    .select(`
      *,
      profiles:user_id (
        id, first_name, last_name, avatar_url, reputation
      )
    `, { count: 'exact' })
    .eq('status', 'ACTIVE')
    .eq('visibility', 'public')

  // Фильтры
  const category = searchParams.get('category')
  if (category) query = query.eq('category', category)

  const priceMin = searchParams.get('priceMin')
  if (priceMin) query = query.gte('price', priceMin)

  const priceMax = searchParams.get('priceMax')
  if (priceMax) query = query.lte('price', priceMax)

  // Сортировка
  const sort = searchParams.get('sort') ?? 'newest'
  if (sort === 'newest')    query = query.order('created_at', { ascending: false })
  if (sort === 'price_asc') query = query.order('price', { ascending: true })
  if (sort === 'price_desc') query = query.order('price', { ascending: false })
  if (sort === 'popular')   query = query.order('views', { ascending: false })

  // Пагинация
  const page  = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '12')
  query = query.range((page - 1) * limit, page * limit - 1)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(
    { listings: data, total: count, page, limit },
    {
      headers: {
        // Кэш на CDN 60 сек, браузер переспрашивает каждый раз
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    }
  )
}

// POST /api/listings — создание листинга
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = listingSchema.parse(body)

    // Генерируем slug в JS — надёжнее чем RPC
    const baseSlug = data.title
      .toLowerCase()
      .replace(/[^a-zа-яё0-9\s-]/gi, '')
      .replace(/[а-яё]/gi, (c) => {
        const map: Record<string, string> = {
          а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',
          й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',
          у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',
          э:'e',ю:'yu',я:'ya'
        }
        return map[c.toLowerCase()] ?? c
      })
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 60)

    // Проверяем уникальность и добавляем суффикс если нужно
    let slug = baseSlug
    let counter = 0
    while (true) {
      const { data: existing } = await supabase
        .from('listings')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()
      if (!existing) break
      counter++
      slug = `${baseSlug}-${counter}`
    }

    const metrics = {
      mrr: data.mrr ?? 0,
      arr: data.arr ?? (data.mrr ? data.mrr * 12 : 0),
      users: {
        total: data.usersTotal,
        active: data.usersActive,
        growth: data.usersGrowth,
      },
      revenue: { total: 0, monthly: [] },
      costs: { hosting: data.costHosting, other: data.costOther },
      traffic: { monthly: data.trafficMonthly, sources: {} },
      churn: data.churn,
    }

    const { data: listing, error } = await supabase
      .from('listings')
      .insert({
        user_id:          user.id,
        title:            data.title,
        tagline:          data.tagline,
        description:      data.description,
        category:         data.category,
        slug,
        tech_frontend:    data.techFrontend,
        tech_backend:     data.techBackend,
        tech_database:    data.techDatabase,
        tech_infra:       data.techInfra,
        tech_services:    data.techServices,
        price:            data.price,
        currency:         data.currency,
        price_negotiable: data.priceNegotiable,
        metrics,
        demo_url:         data.demoUrl || null,
        github_url:       data.githubUrl || null,
        thumbnail_url:    data.thumbnailUrl || null,
        images:           data.images ?? [],
        status:           'PENDING_REVIEW',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ listing }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 422 })
    }
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 })
  }
}
