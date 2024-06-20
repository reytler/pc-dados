import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { ContextGlobalProvider } from '../Context'

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
