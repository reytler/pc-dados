import Cookies from 'js-cookie'
import { useJwt } from 'react-jwt'
import { Idecoded } from '../Pages/Login'

export function useToken() {
  const { decodedToken, isExpired } = useJwt<string>(
    `${Cookies.get('token')?.toString()}`,
  )

  //@ts-ignore
  const decoded: Idecoded = decodedToken

  return { decoded, isExpired }
}
