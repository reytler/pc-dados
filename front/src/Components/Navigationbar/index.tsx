import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import { useToken } from '../../Hooks/useToken'
import { enumRole } from '../../Pages/Login'

export function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const toggle = () => setIsOpen(!isOpen)
  const { decoded } = useToken()

  function Logoff() {
    Cookies.remove('token')
    navigate('/login')
  }

  return (
    <div>
      <Navbar container="fluid" expand="sm" color="light">
        <NavbarBrand href="/">Dados Sujeitos</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
              <NavLink
                href="/"
                style={{
                  color: location.pathname === '/' ? 'black' : 'gray',
                  fontWeight: location.pathname === '/' ? '500' : '400',
                }}
              >
                Início
              </NavLink>
            </NavItem>
            {decoded?.role === enumRole.ADMIN && (
              <NavItem>
                <NavLink
                  href="/usuarios"
                  style={{
                    color: location.pathname === '/usuarios' ? 'black' : 'gray',
                    fontWeight:
                      location.pathname === '/usuarios' ? '500' : '400',
                  }}
                >
                  Gerenciar Usuários
                </NavLink>
              </NavItem>
            )}
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Opções
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={() => navigate('/alterarsenha')}>
                  Alterar Senha
                </DropdownItem>
                <DropdownItem onClick={Logoff}>Sair</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  )
}
