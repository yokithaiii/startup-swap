import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Vertical dashed rails */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="container relative h-full">
          <div className="absolute inset-y-0 left-0 w-px border-l border-dashed border-border/60" />
          <div className="absolute inset-y-0 right-0 w-px border-r border-dashed border-border/60" />
        </div>
      </div>
      <Navbar />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
    </>
  )
}
