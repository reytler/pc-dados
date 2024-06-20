import './App.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Route, Routes } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import { Login } from './Pages/Login'
import { Home } from './Pages/Home'
import { NotFound } from './Pages/NotFound'
import { PrivateRoute } from './Pages/PrivateRoute'
import { Usuarios } from './Pages/Usuarios'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute roles={['ADMIN', 'USER']}>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/usuarios"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <Usuarios />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
