import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ContextGlobalProvider } from '../Context'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

interface propsProviders {
  children: JSX.Element
}

const queryClient = new QueryClient()

export function Providers({ children }: propsProviders) {
  return (
    <QueryClientProvider client={queryClient}>
      <ContextGlobalProvider>{children}</ContextGlobalProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
