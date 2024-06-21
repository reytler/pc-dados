import { useQuery } from '@tanstack/react-query'
import { Layout } from '../../Components/Layout'
import api from '../../api/api'
import {
  enumTypeNotification,
  useNotification,
} from '../../Context/Notification'
import { useEffect } from 'react'
import { AxiosError } from 'axios'

export function Usuarios() {
  const { notify } = useNotification()
  async function fetchUsuarios() {
    const res = api.get('/user/list')
    notify(enumTypeNotification.PROMISE, 'Buscando usuários...', res)
    const response = await res
    return response.data
  }

  const {
    data: usuarios,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['usuarios'],
    queryFn: fetchUsuarios,
  })

  useEffect(() => {
    if (isError) {
      const axiosError: AxiosError<any, any> = error as AxiosError
      notify(enumTypeNotification.ERROR, axiosError.response?.data.message)
    }
  }, [isError])

  useEffect(() => {
    if (!isPending) {
      console.log(usuarios)
    }
  }, [usuarios, isPending])

  return (
    <Layout title="Gerenciar Usuários">
      <></>
    </Layout>
  )
}
