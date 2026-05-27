'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useEffect, useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { startKeepAlive } from '@/utils/keepAlive' 

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry:              1,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

   useEffect(() => {
    startKeepAlive()    
  }, [])
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-center" richColors />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}