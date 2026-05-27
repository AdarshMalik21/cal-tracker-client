import BottomNav from './BottomNav'

export default function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto min-h-dvh max-w-107.5 bg-background pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
      {children}
      <BottomNav />
    </div>
  )
}