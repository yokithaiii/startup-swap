// Constants for StartupSwap

export const CATEGORIES = [
  { value: 'AI_ML', label: 'ИИ и машинное обучение' },
  { value: 'SAAS', label: 'SaaS' },
  { value: 'ECOMMERCE', label: 'Электронная коммерция' },
  { value: 'WEB3', label: 'Web3 и крипто' },
  { value: 'FINTECH', label: 'FinTech' },
  { value: 'HEALTHTECH', label: 'HealthTech' },
] as const

export const TECH_STACKS = {
  frontend: [
    'React', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'Solid.js',
    'React Native', 'Flutter', 'Tailwind CSS', 'shadcn/ui'
  ],
  backend: [
    'Node.js', 'Python', 'Go', 'Rust', 'Java', 'PHP',
    'Express', 'Fastify', 'Django', 'FastAPI', 'Ruby on Rails'
  ],
  database: [
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase',
    'Firebase', 'DynamoDB', 'Prisma', 'Drizzle'
  ],
  infrastructure: [
    'AWS', 'Vercel', 'Railway', 'Render', 'Fly.io',
    'Docker', 'Kubernetes', 'Cloudflare', 'Netlify'
  ],
  services: [
    'Stripe', 'Clerk', 'Auth0', 'SendGrid', 'Resend',
    'Twilio', 'OpenAI', 'Anthropic', 'Replicate'
  ]
} as const

export const PRICE_RANGES = [
  { label: 'Under $10K', min: 0, max: 10000 },
  { label: '$10K - $50K', min: 10000, max: 50000 },
  { label: '$50K - $100K', min: 50000, max: 100000 },
  { label: '$100K - $500K', min: 100000, max: 500000 },
  { label: '$500K+', min: 500000, max: Infinity },
] as const

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
] as const

export const CURRENCIES = [
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' },
  { value: 'RUB', label: 'RUB (₽)', symbol: '₽' },
] as const
