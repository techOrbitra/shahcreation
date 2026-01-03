// app/providers.tsx
'use client'
import { useCartStore } from '@/lib/store'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  )
}
