export default function TermsPage() {
  return (
    <div className="container ml-auto mr-auto py-16 md:py-24 max-w-3xl">
      <div className="mb-12">
        <p className="mb-3 text-sm font-medium italic text-muted-foreground">Документы</p>
        <h1 className="text-4xl font-bold tracking-tight">Условия использования</h1>
        <p className="mt-3 text-sm text-muted-foreground">Последнее обновление: 1 января 2025</p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">1. Общие положения</h2>
          <p>Используя платформу StartupSwap, вы соглашаетесь с настоящими условиями. Если вы не согласны с какими-либо положениями, пожалуйста, не используйте платформу.</p>
          <p>StartupSwap предоставляет маркетплейс для покупки и продажи технологических проектов. Мы выступаем посредником и не являемся стороной сделок между пользователями.</p>
        </section>

        <div className="h-px bg-border" />

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">2. Регистрация и аккаунт</h2>
          <p>Для использования платформы необходимо создать аккаунт. Вы несёте ответственность за сохранность данных для входа и все действия, совершённые под вашим аккаунтом.</p>
          <p>Вы обязуетесь предоставлять достоверную информацию при регистрации и обновлять её при изменении.</p>
        </section>

        <div className="h-px bg-border" />

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">3. Правила размещения</h2>
          <p>Продавцы обязуются предоставлять достоверную информацию о проекте, включая реальные метрики, финансовые показатели и техническое описание.</p>
          <p>Запрещено размещать проекты с фиктивными метриками, нарушающие права третьих лиц, содержащие вредоносный код или нарушающие законодательство.</p>
          <p>StartupSwap оставляет за собой право отклонить или удалить любой листинг без объяснения причин.</p>
        </section>

        <div className="h-px bg-border" />

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">4. Комиссии и оплата</h2>
          <p>Размещение проекта бесплатно. Комиссия взимается только при успешном закрытии сделки и составляет от 5% до 10% в зависимости от тарифного плана.</p>
        </section>

        <div className="h-px bg-border" />

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">5. Сделки и передача проекта</h2>
          <p>После принятия оффера платформа фиксирует процесс передачи проекта. Стороны самостоятельно договариваются об условиях оплаты и проводят расчёты напрямую.</p>
          <p>В случае спора между сторонами StartupSwap может выступить посредником и помочь найти решение на основании предоставленных доказательств.</p>
        </section>

        <div className="h-px bg-border" />

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">6. Ограничение ответственности</h2>
          <p>StartupSwap не несёт ответственности за убытки, возникшие в результате сделок между пользователями, недостоверной информации в листингах или технических сбоев.</p>
          <p>Платформа предоставляется «как есть». Мы не гарантируем непрерывную работу сервиса.</p>
        </section>

        <div className="h-px bg-border" />

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">7. Изменения условий</h2>
          <p>Мы оставляем за собой право изменять настоящие условия. О существенных изменениях мы уведомим пользователей по email не менее чем за 14 дней.</p>
        </section>

        <div className="h-px bg-border" />

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">8. Контакты</h2>
          <p>По вопросам, связанным с условиями использования, обращайтесь: <span className="text-foreground">legal@startupswap.io</span></p>
        </section>

      </div>
    </div>
  )
}
