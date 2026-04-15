import { Listing } from '@/types'

// Конвертирует плоскую запись из Supabase в тип Listing
export function dbToListing(row: any): Listing {
  const m = row.metrics ?? {}
  return {
    id:              row.id,
    userId:          row.user_id,
    title:           row.title,
    tagline:         row.tagline ?? undefined,
    description:     row.description,
    category:        row.category,
    techStack: {
      frontend:       row.tech_frontend ?? [],
      backend:        row.tech_backend ?? [],
      database:       row.tech_database ?? [],
      infrastructure: row.tech_infra ?? [],
      services:       row.tech_services ?? [],
    },
    price:           Number(row.price),
    currency:        row.currency ?? 'USD',
    priceNegotiable: row.price_negotiable ?? false,
    metrics: {
      mrr:     m.mrr ?? 0,
      arr:     m.arr ?? 0,
      users: {
        total:  m.users?.total ?? 0,
        active: m.users?.active ?? 0,
        growth: m.users?.growth ?? 0,
      },
      revenue: {
        total:   m.revenue?.total ?? 0,
        monthly: m.revenue?.monthly ?? [],
      },
      costs: {
        hosting: m.costs?.hosting ?? 0,
        other:   m.costs?.other ?? 0,
      },
      traffic: {
        monthly: m.traffic?.monthly ?? 0,
        sources: m.traffic?.sources ?? {},
      },
      churn: m.churn,
      ltv:   m.ltv,
      cac:   m.cac,
    },
    status:      row.status,
    visibility:  row.visibility ?? 'public',
    featured:    row.featured ?? false,
    slug:        row.slug,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    images:      row.images ?? [],
    videoUrl:    row.video_url ?? undefined,
    demoUrl:     row.demo_url ?? undefined,
    githubUrl:   row.github_url ?? undefined,
    views:       row.views ?? 0,
    favorites:   row.favorites ?? 0,
    inquiries:   row.inquiries ?? 0,
    createdAt:   new Date(row.created_at),
    updatedAt:   new Date(row.updated_at),
    publishedAt: row.published_at ? new Date(row.published_at) : undefined,
  }
}
