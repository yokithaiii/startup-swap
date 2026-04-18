import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { CookieBanner } from "@/components/layout/cookie-banner";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://startup-swap-seven.vercel.app/'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'StartupSwap — Биржа готовых AI-проектов',
    template: '%s | StartupSwap',
  },
  description: 'Покупайте и продавайте прибыльные технологические проекты. Верификация за 24–48 часов, AI-оценка стоимости и защищённый эскроу.',
  keywords: ['купить стартап', 'продать стартап', 'маркетплейс стартапов', 'купить saas', 'продать saas', 'AI проекты', 'готовый бизнес'],
  authors: [{ name: 'StartupSwap' }],
  creator: 'StartupSwap',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: APP_URL,
    siteName: 'StartupSwap',
    title: 'StartupSwap — Биржа готовых AI-проектов',
    description: 'Покупайте и продавайте прибыльные технологические проекты. Верификация за 24–48 часов, AI-оценка стоимости и защищённый эскроу.',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'StartupSwap — Биржа готовых AI-проектов',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StartupSwap — Биржа готовых AI-проектов',
    description: 'Покупайте и продавайте прибыльные технологические проекты. Верификация за 24–48 часов.',
    images: ['/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: APP_URL,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster position="top-right" />
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
