// Core types for StartupSwap

export type UserRole = 'BUYER' | 'SELLER' | 'BOTH' | 'ADMIN'

export type ListingStatus = 
  | 'DRAFT' 
  | 'PENDING_REVIEW' 
  | 'ACTIVE' 
  | 'SOLD' 
  | 'DELISTED' 
  | 'REJECTED'

export type StartupCategory = 
  | 'AI_ML' 
  | 'SAAS' 
  | 'ECOMMERCE' 
  | 'WEB3' 
  | 'FINTECH' 
  | 'HEALTHTECH'

export interface User {
  id: string
  email: string
  role: UserRole
  firstName?: string
  lastName?: string
  avatar?: string
  bio?: string
  company?: string
  website?: string
  reputation: number
  createdAt: Date
}

export interface TechStack {
  frontend: string[]
  backend: string[]
  database: string[]
  infrastructure: string[]
  services: string[]
  ai_ml?: string[]
}

export interface StartupMetrics {
  mrr?: number
  arr?: number
  users: {
    total: number
    active: number
    growth: number
  }
  revenue: {
    total: number
    monthly: number[]
  }
  costs: {
    hosting: number
    other: number
  }
  traffic: {
    monthly: number
    sources: Record<string, number>
  }
  churn?: number
  ltv?: number
  cac?: number
}

export interface Listing {
  id: string
  userId: string
  title: string
  tagline?: string
  description: string
  category: StartupCategory
  subcategory?: string
  techStack: TechStack
  price: number
  currency: string
  priceNegotiable: boolean
  metrics: StartupMetrics
  status: ListingStatus
  visibility: 'public' | 'private' | 'verified_buyers_only'
  featured: boolean
  slug: string
  thumbnailUrl?: string
  images: string[]
  videoUrl?: string
  demoUrl?: string
  githubUrl?: string
  views: number
  favorites: number
  inquiries: number
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
}

export interface Offer {
  id: string
  listingId: string
  buyerId: string
  sellerId: string
  amount: number
  currency: string
  message: string
  conditions?: string
  status: 'pending' | 'accepted' | 'rejected' | 'countered'
  createdAt: Date
  updatedAt: Date
}

export interface SearchFilters {
  query?: string
  category?: StartupCategory[]
  priceMin?: number
  priceMax?: number
  techStack?: string[]
  mrrMin?: number
  mrrMax?: number
  usersMin?: number
  usersMax?: number
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'popular'
}
