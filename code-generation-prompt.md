# ПРОМПТ ДЛЯ ГЕНЕРАЦИИ КОДА: БИРЖА СТАРТАПОВ

## КОНТЕКСТ
Ты - эксперт full-stack разработчик. Создаешь маркетплейс для покупки/продажи AI-стартапов. Это аналог Acquire.com / Flippa, но с фокусом на скорость, AI-автоматизацию и современный tech stack.

## ТВОЯ ЗАДАЧА
Сгенерировать полный production-ready код для MVP маркетплейса стартапов со следующими возможностями:

### Функционал MVP:
1. **Аутентификация** (Clerk)
2. **Листинги стартапов** (создание, редактирование, публикация)
3. **Поиск и фильтрация** (Typesense)
4. **Система офферов** (предложения покупателей)
5. **Сделки и escrow** (Stripe Connect)
6. **Документы** (загрузка в S3)
7. **Уведомления** (email через Resend)
8. **Админ-панель** (верификация листингов)
9. **Базовая аналитика**

---

## TECH STACK (СТРОГО СОБЛЮДАТЬ)

```json
{
  "frontend": {
    "framework": "Next.js 14+ (App Router)",
    "language": "TypeScript",
    "styling": "Tailwind CSS + shadcn/ui",
    "state": "Zustand",
    "forms": "React Hook Form + Zod",
    "charts": "Recharts",
    "notifications": "Sonner"
  },
  "backend": {
    "runtime": "Node.js 20+",
    "framework": "Fastify 4+",
    "database": "PostgreSQL 15+",
    "cache": "Redis (Upstash)",
    "orm": "Prisma 5+",
    "validation": "Zod",
    "queue": "BullMQ"
  },
  "services": {
    "auth": "Clerk",
    "payments": "Stripe",
    "storage": "AWS S3",
    "email": "Resend",
    "search": "Typesense"
  },
  "infrastructure": {
    "containerization": "Docker + docker-compose",
    "frontend_host": "Vercel",
    "backend_host": "Railway"
  }
}
```

---

## СТРУКТУРА ПРОЕКТА

```
startup-marketplace/
├── apps/
│   ├── web/                          # Next.js frontend
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── sign-in/
│   │   │   │   └── sign-up/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── my-listings/
│   │   │   │   ├── my-offers/
│   │   │   │   ├── my-deals/
│   │   │   │   └── settings/
│   │   │   ├── (marketplace)/
│   │   │   │   ├── browse/
│   │   │   │   ├── listing/[id]/
│   │   │   │   └── search/
│   │   │   ├── (admin)/
│   │   │   │   └── admin/
│   │   │   ├── sell/
│   │   │   │   └── new/
│   │   │   ├── api/
│   │   │   │   └── webhooks/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui
│   │   │   ├── listing/
│   │   │   ├── offer/
│   │   │   ├── search/
│   │   │   └── layout/
│   │   ├── lib/
│   │   │   ├── api.ts                # API client
│   │   │   ├── hooks/
│   │   │   └── utils.ts
│   │   ├── store/                    # Zustand stores
│   │   │   ├── auth.ts
│   │   │   ├── listings.ts
│   │   │   └── notifications.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── middleware.ts
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │
│   └── api/                          # Fastify backend
│       ├── src/
│       │   ├── modules/
│       │   │   ├── listings/
│       │   │   │   ├── listings.routes.ts
│       │   │   │   ├── listings.service.ts
│       │   │   │   ├── listings.schema.ts
│       │   │   │   └── listings.controller.ts
│       │   │   ├── offers/
│       │   │   ├── deals/
│       │   │   ├── users/
│       │   │   ├── auth/
│       │   │   ├── search/
│       │   │   ├── documents/
│       │   │   ├── notifications/
│       │   │   └── admin/
│       │   ├── lib/
│       │   │   ├── prisma.ts
│       │   │   ├── redis.ts
│       │   │   ├── s3.ts
│       │   │   ├── stripe.ts
│       │   │   ├── typesense.ts
│       │   │   ├── email.ts
│       │   │   └── queue.ts
│       │   ├── plugins/
│       │   │   ├── auth.ts
│       │   │   ├── cors.ts
│       │   │   └── rate-limit.ts
│       │   ├── types/
│       │   │   └── index.ts
│       │   ├── utils/
│       │   │   ├── validation.ts
│       │   │   └── errors.ts
│       │   ├── app.ts
│       │   └── server.ts
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/
│       │   └── seed.ts
│       ├── Dockerfile
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── shared/                       # Shared types & utils
│   │   ├── src/
│   │   │   ├── types/
│   │   │   ├── schemas/
│   │   │   └── utils/
│   │   └── package.json
│   └── config/                       # Shared configs
│       ├── eslint/
│       ├── typescript/
│       └── tailwind/
│
├── docker-compose.yml
├── .env.example
├── turbo.json                        # Turborepo config
├── package.json
└── README.md
```

---

## ДЕТАЛЬНЫЕ ТРЕБОВАНИЯ ПО МОДУЛЯМ

### 1. FRONTEND (Next.js App)

#### 1.1 Landing Page (`app/page.tsx`)
```typescript
// Требования:
// - Hero section с CTA "Sell Your Startup" и "Browse Startups"
// - Статистика (X продано стартапов, $Y GMV, Z пользователей)
// - Featured listings (карусель)
// - Categories (AI/ML, SaaS, E-commerce, Web3)
// - How it works (3 steps)
// - Testimonials
// - CTA footer
// - Полностью responsive
// - Использовать shadcn/ui компоненты
// - Tailwind для стилей
```

#### 1.2 Browse/Search Page (`app/(marketplace)/browse`)
```typescript
// Требования:
// - Sidebar с фильтрами:
//   - Price range (slider)
//   - Category (multi-select)
//   - Tech stack (checkboxes)
//   - Revenue range
//   - Users range
// - Search bar (с автокомплитом через Typesense)
// - Sort options (newest, price ↑, price ↓, most popular)
// - Grid/List view toggle
// - Listing cards:
//   - Thumbnail
//   - Title, tagline
//   - Category badge
//   - Tech stack icons
//   - Price
//   - Key metrics (MRR, users)
//   - Favorite button
// - Pagination или infinite scroll
// - Skeleton loaders
// - Empty state
```

#### 1.3 Listing Detail Page (`app/(marketplace)/listing/[id]`)
```typescript
// Требования:
// - Hero section:
//   - Image gallery
//   - Title, tagline
//   - Category, tags
//   - Price (highlight)
//   - CTA "Make an Offer"
//   - Share button
//   - Favorite button
// - Tabs:
//   - Overview (description, features)
//   - Metrics (charts через Recharts)
//   - Tech Stack (badges)
//   - Documents (список файлов, требует NDA)
//   - Q&A (FAQ section)
// - Sidebar:
//   - Seller info (avatar, name, rating)
//   - Contact seller button
//   - Key stats box
//   - Similar listings
// - Offer modal (shadcn Dialog):
//   - Amount input
//   - Message textarea
//   - Payment terms
//   - Submit button
```

#### 1.4 Create Listing (`app/sell/new`)
```typescript
// Multi-step form (React Hook Form + Zod):
// 
// Step 1: Basic Info
// - Title (required)
// - Tagline
// - Category (select)
// - Description (rich text editor - Tiptap)
// 
// Step 2: Tech Stack
// - Frontend frameworks (multi-select)
// - Backend frameworks
// - Database
// - Infrastructure
// - Services
// - AI/ML tools
// 
// Step 3: Metrics
// - Revenue (MRR/ARR)
// - Users (total, active)
// - Traffic (monthly visitors)
// - Costs (hosting, tools)
// - Integration with Stripe/GA (optional)
// 
// Step 4: Media
// - Upload images (drag & drop, S3)
// - Demo URL
// - GitHub URL (optional)
// 
// Step 5: Pricing
// - Price (USD/EUR)
// - Negotiable checkbox
// - AI valuation suggestion (показать range)
// 
// Step 6: Documents
// - Pitch deck
// - Financial reports
// - Analytics screenshots
// - Each file с NDA checkbox
// 
// Step 7: Review & Publish
// - Preview listing
// - Terms acceptance
// - Submit for review button
// - Save as draft button
```

#### 1.5 Dashboard (`app/(dashboard)/dashboard`)
```typescript
// Seller view:
// - Stats cards:
//   - Active listings
//   - Total views
//   - Offers received
//   - Deals in progress
// - Charts (Recharts):
//   - Views over time
//   - Offer activity
// - Quick actions:
//   - Create new listing
//   - View offers
// - Recent activity feed
// 
// Buyer view:
// - Stats cards:
//   - Saved listings
//   - Offers sent
//   - Active deals
// - Recommended listings (AI)
// - Saved searches alerts
// - Recent activity
```

#### 1.6 My Listings (`app/(dashboard)/my-listings`)
```typescript
// - Table с листингами:
//   - Thumbnail
//   - Title
//   - Status badge (draft/pending/active/sold)
//   - Views, favorites, offers
//   - Actions (edit, delete, view stats)
// - Filters (status, date)
// - Search bar
// - Create new listing button
```

#### 1.7 Offers Management (`app/(dashboard)/my-offers`)
```typescript
// Tabs: "Sent" и "Received"
// 
// Sent offers (buyer):
// - Table с офферами
// - Status badges
// - Actions (edit, withdraw)
// - Chat с продавцом
// 
// Received offers (seller):
// - Cards с офферами от покупателей
// - Buyer info
// - Offer details
// - Actions (accept, reject, counter)
```

#### 1.8 Deals (`app/(dashboard)/my-deals`)
```typescript
// - Kanban board (в стиле Trello):
//   - Columns: Negotiation, Escrow, In Progress, Completed
//   - Deal cards (перетаскиваемые)
// - Deal detail modal:
//   - Timeline
//   - Milestones (progress bar)
//   - Documents
//   - Messages
//   - Actions по milestone
```

#### 1.9 Admin Panel (`app/(admin)/admin`)
```typescript
// Protected route (только admin)
// 
// Tabs:
// - Listings (pending verification)
//   - Table с pending листингами
//   - Quick view modal
//   - Actions (approve, reject, request changes)
//   - AI score display
// - Users
//   - Table с пользователями
//   - Stats
//   - Ban/unban
// - Analytics
//   - Platform stats (Recharts)
//   - Revenue charts
//   - User growth
// - Settings
//   - Platform config
//   - Fee settings
```

#### 1.10 Shared Components
```typescript
// В components/ui:
// - Button (shadcn)
// - Input (shadcn)
// - Select (shadcn)
// - Dialog (shadcn)
// - Card (shadcn)
// - Badge (shadcn)
// - Avatar (shadcn)
// - Tabs (shadcn)
// - DropdownMenu (shadcn)
// - Sheet (shadcn)
// - Skeleton (shadcn)
// - Toast (Sonner)
// 
// Custom components:
// - ListingCard
// - OfferCard
// - DealCard
// - MetricsChart
// - TechStackBadge
// - FileUpload
// - RichTextEditor
// - PriceInput
// - SearchBar
// - FilterSidebar
// - Navbar
// - Footer
```

#### 1.11 State Management (Zustand)
```typescript
// stores/auth.ts
interface AuthStore {
  user: User | null
  isLoading: boolean
  signIn: (token: string) => void
  signOut: () => void
  updateProfile: (data: Partial<User>) => void
}

// stores/listings.ts
interface ListingsStore {
  listings: Listing[]
  filters: Filters
  setFilters: (filters: Filters) => void
  addListing: (listing: Listing) => void
  updateListing: (id: string, data: Partial<Listing>) => void
  removeListing: (id: string) => void
}

// stores/notifications.ts
interface NotificationsStore {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => void
  clearAll: () => void
}
```

---

### 2. BACKEND (Fastify API)

#### 2.1 Server Setup (`src/server.ts`)
```typescript
import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import { authPlugin } from './plugins/auth'

const app = Fastify({ logger: true })

// Plugins
await app.register(cors, { origin: process.env.FRONTEND_URL })
await app.register(helmet)
await app.register(rateLimit, {
  max: 100,
  timeWindow: '15 minutes'
})
await app.register(authPlugin)

// Routes
await app.register(listingsRoutes, { prefix: '/api/listings' })
await app.register(offersRoutes, { prefix: '/api/offers' })
await app.register(dealsRoutes, { prefix: '/api/deals' })
await app.register(usersRoutes, { prefix: '/api/users' })
await app.register(searchRoutes, { prefix: '/api/search' })
await app.register(documentsRoutes, { prefix: '/api/documents' })
await app.register(adminRoutes, { prefix: '/api/admin' })

// Start
const start = async () => {
  try {
    await app.listen({ port: 3001, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
```

#### 2.2 Auth Plugin (`src/plugins/auth.ts`)
```typescript
// Интеграция с Clerk
// - Verify JWT tokens
// - Extract user from token
// - Декоратор `authenticate` для routes
// - Декоратор `authorize` для role-based access
```

#### 2.3 Listings Module

**Routes** (`src/modules/listings/listings.routes.ts`):
```typescript
// GET /api/listings - Browse all (с пагинацией)
// GET /api/listings/:id - Get single
// POST /api/listings - Create (authenticated)
// PATCH /api/listings/:id - Update (owner only)
// DELETE /api/listings/:id - Delete (owner only)
// POST /api/listings/:id/publish - Publish (owner only)
// POST /api/listings/:id/favorite - Toggle favorite (authenticated)
// GET /api/listings/:id/analytics - Get stats (owner only)

// AI endpoints:
// POST /api/listings/valuation - AI valuation
// GET /api/listings/recommendations - AI recommendations
```

**Service** (`src/modules/listings/listings.service.ts`):
```typescript
class ListingsService {
  // Бизнес-логика
  async create(data: CreateListingDto, userId: string)
  async update(id: string, data: UpdateListingDto, userId: string)
  async publish(id: string, userId: string)
  async delete(id: string, userId: string)
  async findAll(filters: ListingFilters, pagination: Pagination)
  async findById(id: string)
  async calculateValuation(metrics: Metrics): Promise<Valuation>
  async getRecommendations(userId: string): Promise<Listing[]>
  
  // Search integration
  async indexToTypesense(listing: Listing)
  async removeFromTypesense(listingId: string)
  
  // Cache
  async getCached(id: string)
  async invalidateCache(id: string)
}
```

**Controller** (`src/modules/listings/listings.controller.ts`):
```typescript
class ListingsController {
  // HTTP handlers
  async browse(request, reply)
  async show(request, reply)
  async create(request, reply)
  async update(request, reply)
  async destroy(request, reply)
  async publish(request, reply)
  async favorite(request, reply)
  async analytics(request, reply)
  async valuation(request, reply)
  async recommendations(request, reply)
}
```

**Schema** (`src/modules/listings/listings.schema.ts`):
```typescript
// Zod schemas для validation
export const createListingSchema = z.object({
  title: z.string().min(10).max(100),
  tagline: z.string().max(200).optional(),
  description: z.string().min(100),
  category: z.enum(['AI_ML', 'SAAS', 'ECOMMERCE', 'WEB3']),
  techStack: z.object({
    frontend: z.array(z.string()),
    backend: z.array(z.string()),
    database: z.array(z.string()),
    // ...
  }),
  metrics: z.object({
    mrr: z.number().optional(),
    users: z.object({
      total: z.number(),
      active: z.number(),
    }),
    // ...
  }),
  price: z.number().positive(),
  // ...
})

export const updateListingSchema = createListingSchema.partial()
```

#### 2.4 Offers Module
```typescript
// Routes:
// GET /api/offers - My offers
// POST /api/listings/:id/offers - Create offer
// PATCH /api/offers/:id - Update
// POST /api/offers/:id/accept - Accept
// POST /api/offers/:id/reject - Reject
// POST /api/offers/:id/counter - Counter-offer

// Service:
class OffersService {
  async create(listingId: string, buyerId: string, data: CreateOfferDto)
  async accept(offerId: string, sellerId: string)
  async reject(offerId: string, sellerId: string)
  async counter(offerId: string, sellerId: string, newAmount: number)
  
  // Notifications
  async notifySellerNewOffer(offer: Offer)
  async notifyBuyerOfferAccepted(offer: Offer)
}
```

#### 2.5 Deals Module
```typescript
// Routes:
// GET /api/deals - My deals
// GET /api/deals/:id - Single deal
// PATCH /api/deals/:id/milestone - Complete milestone
// POST /api/deals/:id/dispute - Raise dispute
// POST /api/deals/:id/complete - Mark complete

// Service:
class DealsService {
  async createFromOffer(offerId: string)
  async completeMilestone(dealId: string, milestoneId: number, userId: string)
  async raiseDispute(dealId: string, reason: string)
  async complete(dealId: string)
  
  // Escrow integration
  async initiateEscrow(dealId: string)
  async releaseEscrowFunds(dealId: string, milestoneId: number)
}
```

#### 2.6 Search Module (Typesense)
```typescript
// lib/typesense.ts
import Typesense from 'typesense'

const client = new Typesense.Client({
  nodes: [{
    host: process.env.TYPESENSE_HOST,
    port: 443,
    protocol: 'https'
  }],
  apiKey: process.env.TYPESENSE_API_KEY,
})

// Schema
const listingsSchema = {
  name: 'listings',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'description', type: 'string' },
    { name: 'category', type: 'string', facet: true },
    { name: 'price', type: 'float', facet: true },
    { name: 'techStack', type: 'string[]', facet: true },
    { name: 'createdAt', type: 'int64', sort: true },
    { name: 'views', type: 'int32', sort: true },
  ]
}

// Service
class SearchService {
  async indexListing(listing: Listing)
  async search(query: string, filters: Filters): Promise<SearchResults>
  async autocomplete(query: string): Promise<string[]>
}
```

#### 2.7 Documents Module (S3)
```typescript
// lib/s3.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({ region: process.env.AWS_REGION })

// Service
class DocumentsService {
  async upload(file: File, listingId: string, type: DocumentType)
  async generatePresignedUrl(key: string, expiresIn: number)
  async delete(key: string)
}

// Routes
// POST /api/documents/upload - Upload file
// GET /api/documents/:id - Get signed URL
// DELETE /api/documents/:id - Delete
```

#### 2.8 Notifications Module
```typescript
// Email (Resend)
// lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

class EmailService {
  async sendNewOfferEmail(seller: User, offer: Offer)
  async sendOfferAcceptedEmail(buyer: User, offer: Offer)
  async sendListingPublishedEmail(seller: User, listing: Listing)
  async sendMilestoneCompletedEmail(users: User[], deal: Deal)
  async sendWeeklyDigest(user: User, data: DigestData)
}

// In-app notifications
class NotificationsService {
  async create(userId: string, data: CreateNotificationDto)
  async markAsRead(notificationId: string)
  async getUnread(userId: string)
  
  // BullMQ for async processing
  async queueEmail(template: string, data: any)
}
```

#### 2.9 Stripe Integration
```typescript
// lib/stripe.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

class PaymentsService {
  // Escrow через Stripe Connect
  async createConnectedAccount(userId: string)
  async createEscrowPayment(dealId: string, amount: number)
  async releaseEscrowToSeller(dealId: string, amount: number)
  async refundEscrowToBuyer(dealId: string, reason: string)
  
  // Subscription plans
  async createCheckoutSession(plan: PricingPlan, userId: string)
  async handleWebhook(event: Stripe.Event)
}

// Webhook handler
// POST /api/webhooks/stripe
```

#### 2.10 BullMQ Queues
```typescript
// lib/queue.ts
import { Queue, Worker } from 'bullmq'
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

// Email queue
const emailQueue = new Queue('emails', { connection: redis })

const emailWorker = new Worker('emails', async (job) => {
  const { template, data } = job.data
  await emailService.send(template, data)
}, { connection: redis })

// Verification queue
const verificationQueue = new Queue('verification', { connection: redis })

const verificationWorker = new Worker('verification', async (job) => {
  const { listingId } = job.data
  await verificationService.verifyListing(listingId)
}, { connection: redis })
```

---

### 3. DATABASE (Prisma Schema)

```prisma
// Используй schema из файла startup-marketplace-spec.md
// Полная схема уже описана там
```

---

### 4. DOCKER SETUP

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: marketplace
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
  
  typesense:
    image: typesense/typesense:0.25.1
    environment:
      TYPESENSE_DATA_DIR: /data
      TYPESENSE_API_KEY: your-api-key
    ports:
      - "8108:8108"
    volumes:
      - typesense_data:/data
  
  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/marketplace
      REDIS_URL: redis://redis:6379
      TYPESENSE_HOST: typesense
      # Other env vars
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis
      - typesense
    volumes:
      - ./apps/api:/app
      - /app/node_modules
  
  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
      # Other env vars
    ports:
      - "3000:3000"
    depends_on:
      - api
    volumes:
      - ./apps/web:/app
      - /app/node_modules

volumes:
  postgres_data:
  redis_data:
  typesense_data:
```

**API Dockerfile** (`apps/api/Dockerfile`):
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

---

### 5. ENVIRONMENT VARIABLES

**.env.example**:
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/marketplace"

# Redis
REDIS_URL="redis://localhost:6379"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET=

# Typesense
TYPESENSE_HOST=
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=

# Resend
RESEND_API_KEY=

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API
PORT=3001
NODE_ENV=development
JWT_SECRET=
```

---

## ЗАДАНИЕ

Сгенерируй полный код для этого проекта со следующими приоритетами:

### ФАЗА 1 (сначала сгенерируй это):
1. **Backend setup**:
   - Fastify сервер с плагинами
   - Prisma schema и миграции
   - Auth plugin (Clerk интеграция)
   - Базовые роуты для listings, offers, deals
   - Redis и BullMQ setup
   - S3 integration
   - Email service (Resend)

2. **Frontend core**:
   - Next.js app с правильной структурой
   - Layout components (Navbar, Footer)
   - Auth pages (sign-in, sign-up)
   - shadcn/ui setup
   - Tailwind config
   - Zustand stores

### ФАЗА 2 (потом):
3. **Marketplace features**:
   - Landing page
   - Browse/Search page с Typesense
   - Listing detail page
   - Create listing flow
   - Dashboard

### ФАЗА 3 (в конце):
4. **Transactional features**:
   - Offers system
   - Deals management
   - Escrow integration
   - Admin panel

---

## ВАЖНЫЕ ТРЕБОВАНИЯ

### Code Quality:
- ✅ TypeScript строгая типизация (strict mode)
- ✅ ESLint + Prettier
- ✅ Комментарии для сложной логики
- ✅ Error handling везде (try/catch)
- ✅ Validation на фронте и бэке (Zod)
- ✅ Proper HTTP status codes
- ✅ Logging (Fastify logger)

### Performance:
- ✅ React Server Components где возможно
- ✅ Lazy loading
- ✅ Image optimization (next/image)
- ✅ Redis caching для частых запросов
- ✅ Database indexes (Prisma)
- ✅ Rate limiting

### Security:
- ✅ CORS правильно настроен
- ✅ Helmet для security headers
- ✅ Input sanitization
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection
- ✅ CSRF protection

### UX:
- ✅ Loading states (Skeletons)
- ✅ Error states
- ✅ Empty states
- ✅ Toast notifications (Sonner)
- ✅ Form validation feedback
- ✅ Responsive design (mobile-first)

### Testing (опционально для MVP, но хорошо бы):
- ✅ Unit tests (Vitest)
- ✅ Integration tests
- ✅ E2E tests (Playwright)

---

## ДОПОЛНИТЕЛЬНЫЕ ИНСТРУКЦИИ

1. **Используй современные практики**:
   - React Server Components
   - Server Actions где уместно
   - Параллельные роуты в Next.js
   - Streaming

2. **Модульность**:
   - Переиспользуемые компоненты
   - Shared types в packages/shared
   - DRY принцип

3. **Документация**:
   - README.md с инструкциями
   - API документация (Swagger/OpenAPI)
   - Примеры .env файлов

4. **Deployment ready**:
   - Docker для локальной разработки
   - Vercel config для фронтенда
   - Railway config для бэкенда

---

## НАЧНИ С ЭТОГО:

**Шаг 1**: Создай базовую структуру проекта (folders, package.json files)
**Шаг 2**: Backend setup (Fastify + Prisma + основные сервисы)
**Шаг 3**: Frontend setup (Next.js + shadcn/ui + layouts)
**Шаг 4**: Core features (listings CRUD)
**Шаг 5**: Search integration (Typesense)
**Шаг 6**: Transactional features (offers, deals, escrow)
**Шаг 7**: Polish (error handling, loading states, validation)

Генерируй код последовательно, модуль за модулем. Начни прямо сейчас!
