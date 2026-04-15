# StartupSwap - Frontend

Современный маркетплейс для покупки и продажи AI-стартапов.

## 🚀 Стек технологий

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📦 Установка

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для production
npm run build

# Запуск production сервера
npm start
```

## 🎨 Структура проекта

```
apps/web/
├── app/                    # Next.js App Router
│   ├── browse/            # Страница просмотра стартапов
│   ├── layout.tsx         # Root layout с Navbar и Footer
│   └── page.tsx           # Landing page
├── components/
│   ├── ui/                # shadcn/ui компоненты
│   ├── layout/            # Navbar, Footer
│   ├── listing/           # Компоненты листингов
│   └── search/            # Компоненты поиска и фильтров
├── lib/
│   ├── constants.ts       # Константы (категории, tech stacks)
│   ├── mock-data.ts       # Mock данные для разработки
│   └── utils.ts           # Утилиты
├── store/                 # Zustand stores
│   ├── auth.ts
│   └── listings.ts
└── types/
    └── index.ts           # TypeScript типы
```

## 🎯 Реализованные страницы

### ✅ Landing Page (/)
- Hero section с CTA
- Статистика платформы
- Featured листинги
- Категории стартапов
- How It Works секция
- Преимущества платформы
- CTA секция

### ✅ Browse Page (/browse)
- Поиск по названию и описанию
- Фильтры:
  - Категории
  - Ценовой диапазон (slider)
  - Tech stack (frontend, backend, database)
  - MRR диапазон
- Сортировка (новые, цена, популярность)
- Grid/List view
- Responsive дизайн
- Mobile-friendly фильтры (Sheet)

## 🎨 Компоненты

### ListingCard
Карточка стартапа с:
- Изображением
- Категорией и badges
- Названием и описанием
- Tech stack badges
- Метриками (MRR, Users, Traffic)
- Ценой
- Кнопкой "View Details"

### FilterSidebar
Боковая панель фильтров с:
- Price range slider
- Категории с иконками
- Tech stack фильтры
- MRR range inputs
- Кнопка "Clear All Filters"

### Navbar
- Логотип и навигация
- Поиск
- Уведомления (badge с количеством)
- Favorites
- User menu (dropdown)
- Mobile menu (Sheet)

### Footer
- Ссылки на разделы
- Социальные сети
- Copyright

## 📊 Mock Data

В `lib/mock-data.ts` есть 6 примеров стартапов:
1. AI-Powered Content Generator SaaS ($75K)
2. E-Commerce Analytics Dashboard ($120K)
3. NFT Marketplace Platform ($250K)
4. Fitness Tracking Mobile App ($45K)
5. AI Resume Builder ($28K)
6. Payment Gateway for Crypto ($180K)

## 🎨 Дизайн

- Современный, чистый дизайн
- Dark mode support (через Tailwind)
- Responsive для всех устройств
- Анимации и transitions
- shadcn/ui компоненты

## 🔜 Следующие шаги

### Страницы для реализации:
- [ ] Listing Detail Page (`/listing/[slug]`)
- [ ] Create Listing (`/sell/new`)
- [ ] Dashboard (`/dashboard`)
- [ ] My Listings (`/my-listings`)
- [ ] My Offers (`/my-offers`)
- [ ] My Deals (`/my-deals`)
- [ ] Settings (`/settings`)
- [ ] Admin Panel (`/admin`)

### Интеграции:
- [ ] Clerk для аутентификации
- [ ] API клиент для backend
- [ ] Real-time уведомления
- [ ] Image upload (S3)
- [ ] Rich text editor (Tiptap)

## 🌐 Dev Server

Сервер запущен на: http://localhost:3000

## 📝 Примечания

- Используются mock данные для разработки
- Все компоненты типизированы с TypeScript
- Следуем best practices Next.js 14
- Используем Server Components где возможно
- Client Components помечены 'use client'
