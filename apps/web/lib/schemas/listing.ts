import { z } from 'zod'

export const listingSchema = z.object({
  // Step 1 — Basic Info
  title: z.string().min(10, 'Минимум 10 символов').max(100, 'Максимум 100 символов'),
  tagline: z.string().max(200).optional(),
  description: z.string().min(50, 'Минимум 50 символов'),
  category: z.enum(['AI_ML', 'SAAS', 'ECOMMERCE', 'WEB3', 'FINTECH', 'HEALTHTECH'], {
    required_error: 'Выберите категорию',
  }),

  // Step 2 — Tech Stack
  techFrontend: z.array(z.string()).min(1, 'Укажите хотя бы одну технологию'),
  techBackend: z.array(z.string()).min(1, 'Укажите хотя бы одну технологию'),
  techDatabase: z.array(z.string()),
  techInfra: z.array(z.string()),
  techServices: z.array(z.string()),

  // Step 3 — Metrics
  mrr: z.coerce.number().min(0).optional(),
  arr: z.coerce.number().min(0).optional(),
  usersTotal: z.coerce.number().min(0, 'Укажите количество пользователей'),
  usersActive: z.coerce.number().min(0),
  usersGrowth: z.coerce.number().min(0).max(1000),
  trafficMonthly: z.coerce.number().min(0),
  costHosting: z.coerce.number().min(0),
  costOther: z.coerce.number().min(0),
  churn: z.coerce.number().min(0).max(100).optional(),

  // Step 4 — Media
  demoUrl: z.string().url('Введите корректный URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Введите корректный URL').optional().or(z.literal('')),
  thumbnailUrl: z.string().optional(),
  images: z.array(z.string()).optional(),

  // Step 5 — Pricing
  price: z.coerce.number().min(100, 'Минимальная цена $100'),
  currency: z.enum(['USD', 'EUR', 'RUB']),
  priceNegotiable: z.boolean(),
})

export type ListingFormData = z.infer<typeof listingSchema>

export const defaultValues: ListingFormData = {
  title: '',
  tagline: '',
  description: '',
  category: 'SAAS',
  techFrontend: [],
  techBackend: [],
  techDatabase: [],
  techInfra: [],
  techServices: [],
  mrr: undefined,
  arr: undefined,
  usersTotal: 0,
  usersActive: 0,
  usersGrowth: 0,
  trafficMonthly: 0,
  costHosting: 0,
  costOther: 0,
  churn: undefined,
  demoUrl: '',
  githubUrl: '',
  thumbnailUrl: '',
  images: [],
  price: 0,
  currency: 'USD',
  priceNegotiable: false,
}
