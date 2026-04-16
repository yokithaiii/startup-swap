import Link from 'next/link'
import { Rocket } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16 ml-auto mr-auto">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Rocket className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">StartupSwap</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Самый быстрый маркетплейс для покупки и продажи готовых технологических проектов.
            </p>
          </div>

          {/* Marketplace */}
          <div>
            <h3 className="font-semibold mb-4">Маркетплейс</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/browse" className="text-muted-foreground hover:text-foreground">
                  Все проекты
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-muted-foreground hover:text-foreground">
                  Продать проект
                </Link>
              </li>
              <li>
                <Link href="/buy" className="text-muted-foreground hover:text-foreground">
                  Купить проект
                </Link>
              </li>
              <li>
                <Link href="/valuation" className="text-muted-foreground hover:text-foreground">
                  Оценить стоимость
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Ресурсы</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground">
                  Как это работает
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Компания</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Условия использования
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Политика конфиденциальности
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2026 StartupSwap. Все права защищены.
          </p>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <a href="https://github.com/yokithaiii/startup-swap" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
