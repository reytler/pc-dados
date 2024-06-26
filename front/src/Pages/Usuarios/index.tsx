import { useQuery } from '@tanstack/react-query'
import { Layout } from '../../Components/Layout'
import api from '../../api/api'
import {
  enumTypeNotification,
  useNotification,
} from '../../Context/Notification'
import { useEffect } from 'react'
import { AxiosError } from 'axios'
import { Button, Table } from 'reactstrap'
import { useNavigate } from 'react-router-dom'

interface IUsuario {
  _id: string
  usuario: number
  role: string
  alterarSenha: boolean
  ativo: boolean
}

export function Usuarios() {
  const { notify } = useNotification()
  const navigate = useNavigate()
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
      <Table hover responsive striped>
        <thead style={{ fontWeight: 'bold' }}>
          <tr>
            <th># ID</th>
            <th>Usuário</th>
            <th>Perfil</th>
            <th>Alterar Senha</th>
            <th>Ativo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios?.map((usuario: IUsuario) => (
            <tr key={usuario._id}>
              <td>{usuario._id}</td>
              <td>{usuario.usuario}</td>
              <td>{usuario.role}</td>
              <td>{usuario.alterarSenha ? 'Sim' : 'Não'}</td>
              <td>{usuario.ativo ? 'Sim' : 'Não'}</td>
              <td>
                <Button title="Alterar Senha" color='info' onClick={()=>navigate(`/alterarsenha/${usuario._id}`)}>
                <i className="bi bi-key-fill"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Layout>
  )
}
