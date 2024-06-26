import './App.css'
import { Route, Routes } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import { Login, enumRole } from './Pages/Login'
import { Home } from './Pages/Home'
import { NotFound } from './Pages/NotFound'
import { PrivateRoute } from './Pages/PrivateRoute'
import { Usuarios } from './Pages/Usuarios'
import { Providers } from './Providers'
import { AlterarSenha } from './Pages/AlterarSenha'

function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute roles={[enumRole.ADMIN, enumRole.USER]}>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/usuarios"
            element={
              <PrivateRoute roles={[enumRole.ADMIN]}>
                <Usuarios />
              </PrivateRoute>
            }
          />
          <Route
            path="/alterarsenha/:id?"
            element={
              <PrivateRoute roles={[enumRole.ADMIN, enumRole.USER]}>
                <AlterarSenha />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  )
}

export default App
