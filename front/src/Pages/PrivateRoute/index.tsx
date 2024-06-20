import React from 'react'
import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
  children: JSX.Element
  roles: Array<string>
}

function havePermission(roles: Array<string>, userRole: string): boolean {
  return roles.includes(userRole)
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const userRole = ''
  const isAuthenticated = false

  return isAuthenticated && havePermission(roles, userRole) ? (
    children
  ) : (
    <Navigate to="/login" />
  )
}

export { PrivateRoute }
