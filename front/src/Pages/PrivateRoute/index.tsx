import React from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { decodeToken } from 'react-jwt'
import { Idecoded } from '../Login'
import {
  enumTypeNotification,
  useNotification,
} from '../../Context/Notification'

interface PrivateRouteProps {
  children: JSX.Element
  roles: Array<string>
}

function havePermission(roles: Array<string>, userRole: string): boolean {
  return roles.includes(userRole)
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  let userRole = ''
  let isAuthenticated = false
  const { notify } = useNotification()
  try {
    const token = Cookies.get('token')
    if (token !== undefined) {
      isAuthenticated = true
      const decoded: Idecoded | null = decodeToken(token)
      if (decoded !== null) {
        userRole = decoded.role
      }
    }
  } catch (error: any) {
    notify(enumTypeNotification.ERROR, error.message)
  }

  return isAuthenticated && havePermission(roles, userRole) ? (
    children
  ) : (
    <Navigate to="/login" />
  )
}

export { PrivateRoute }
