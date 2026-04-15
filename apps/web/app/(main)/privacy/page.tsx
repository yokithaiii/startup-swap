export default function PrivacyPage() {
  return (
    <div className="container ml-auto mr-auto py-16 md:py-24 max-w-3xl">
      <div className="mb-12">
        <p className="mb-3 text-sm font-medium italic text-muted-foreground">Документы</p>
        <h1 className="text-4xl font-bold tracking-tight">Политика конфиденциальности</h1>
        <p className="mt-3 text-sm text-muted-foreground">Последнее обновление: 1 января 2025</p>
      </div>

      <div className="space-y-8 text-muted-foreground leading-relaxed">

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">1. Какие данные мы собираем</h2>
          <p>При регистрации: имя, email, данные OAuth-провайдера (GitHub, Google).</p>
          <p>При использовании платформы: информация о листингах, офферах, сделках, история просмотров.</p>
          <p>Технические данные: IP-адрес, тип браузера, данные cookies, аналитика использования.</p>
        </section>

        <div className="h-px bg-border" />

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">2. Как мы используем данные</h2>
          <p>Для предоставления услуг платформы: авторизация, управление листингами, проведение сделок.</p>
          <p>Для улучшения сервиса: анализ использования, выявление ошибок, разработка новых функций.</p>
          <p>Для коммуникации: уведомления о сделках, офферах, обновлениях платформы.</p>
          <p>Мы не продаём ваши данные третьим лицам.</p>
        </section>

        <div className="h-px bg-border" />

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">3. Хранение данных</h2>
          <p>Данные хранятся на серверах Supabase (PostgreSQL) с шифрованием в покое и при передаче.</p>
          <p>Мы храним данные в течение всего срока действия аккаунта и 90 дней после его удаления.</p>
        </section>

        <div className="h-px bg-border" />

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">4. Передача данных третьим лицам</h2>
          <p>Мы используем следующие сервисы, которые могут обрабатывать ваши данные:</p>
          <ul className="space-y-2 ml-4">
            {[
              { name: 'Supabase', desc: 'база данных и авторизация' },
              { name: 'Stripe', desc: 'обработка платежей' },
              { name: 'Resend', desc: 'отправка email' },
              { name: 'Vercel', desc: 'хостинг' },
            ].map(({ name, desc }) => (
              <li key={name} className="flex gap-2">
                <span className="text-foreground font-medium">{name}</span>
                <span>— {desc}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="h-px bg-border" />

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">5. Cookies</h2>
          <p>Мы используем cookies для авторизации и аналитики. Вы можете отключить cookies в настройках браузера, однако это может повлиять на работу платформы.</p>
        </section>

        <div className="h-px bg-border" />

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">6. Ваши права</h2>
          <p>Вы имеете право: получить копию своих данных, исправить неточные данные, удалить аккаунт и все связанные данные, отозвать согласие на обработку данных.</p>
          <p>Для реализации прав обратитесь: <span className="text-foreground">privacy@startupswap.io</span></p>
        </section>

        <div className="h-px bg-border" />

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">7. Безопасность</h2>
          <p>Мы применяем технические и организационные меры для защиты данных: шифрование, контроль доступа, мониторинг безопасности.</p>
          <p>При обнаружении утечки данных мы уведомим затронутых пользователей в течение 72 часов.</p>
        </section>

        <div className="h-px bg-border" />

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">8. Контакты</h2>
          <p>По вопросам конфиденциальности: <span className="text-foreground">privacy@startupswap.io</span></p>
        </section>

      </div>
    </div>
  )
}
