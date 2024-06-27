import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Layout } from '../../Components/Layout'
import api from '../../api/api'
import {
  enumTypeNotification,
  useNotification,
} from '../../Context/Notification'
import { useEffect} from 'react'
import { AxiosError } from 'axios'
import { Button, Input, Table } from 'reactstrap'
import { useNavigate } from 'react-router-dom'
import { SwitchAdmin } from '../../Components/SwitchAdmin'

export interface IUsuario {
  _id: string
  usuario: number
  role: string
  alterarSenha: boolean
  ativo: boolean
}

interface IAtivaDesativaDTO {
  novoStatus: boolean
}

interface IMutationStatus {
  ativaDesativaDTO: IAtivaDesativaDTO,
  id: string
}

export function Usuarios() {
  const { notify } = useNotification()
  const navigate = useNavigate()
  const queryClient = useQueryClient();

  function atualizarStatusNaTela(mutationStatus: IMutationStatus){
    queryClient.setQueryData(['usuarios'],(prev:Array<IUsuario>)=>{
      return prev.map(usuario=>{
        if(usuario._id !== mutationStatus.id){
          return usuario
        }

        return {
          ...usuario,
          ativo: mutationStatus.ativaDesativaDTO.novoStatus
        }
      })
    })
  }

  async function fetchUsuarios() {
    const res = api.get('/user/list')
    notify(enumTypeNotification.PROMISE, 'Buscando usuários...', res)
    const response = await res
    return response.data
  }

  async function AlterarStatus(ativaDesativaDTO: IAtivaDesativaDTO, id: string):Promise<any>{
    const promise = api.patch(`/user/alterarstatus/${id}`,ativaDesativaDTO)
    notify(enumTypeNotification.PROMISE,`Alterando status do usuário de id: ${id}`,promise)
    const res  = await promise
    return res.data
  }

  const {
    data: usuarios,
    isError,
    error,
  } = useQuery({
    queryKey: ['usuarios'],
    queryFn: fetchUsuarios,
  })

  const mutationStatus = useMutation({
    mutationFn: async (mutationStatusDTO: IMutationStatus)=>AlterarStatus(mutationStatusDTO.ativaDesativaDTO,mutationStatusDTO.id),
    onSuccess:(ok:any,variables:IMutationStatus)=>{
      notify(enumTypeNotification.SUCCESS,ok.message)
      atualizarStatusNaTela(variables)
    },
    onError:(error: any)=>{
      notify(enumTypeNotification.ERROR, error.response.data.message)
    }
  })

  useEffect(() => {
    if (isError) {
      const axiosError: AxiosError<any, any> = error as AxiosError
      notify(enumTypeNotification.ERROR, axiosError.response?.data.message)
    }
  }, [isError])

  function handleAtivarDesativar(checked:boolean,idUser: string){
    const mutationStatusDTO: IMutationStatus = {
      ativaDesativaDTO: {novoStatus: checked},
      id: idUser
    }
    mutationStatus.mutate(mutationStatusDTO)
  }

  return (
    <Layout title="Gerenciar Usuários">
      <>
      <Button size='sm' color='primary' style={{
        padding:'0 3px',
        fontSize:'12px'
      }}>
        <i className="bi bi-person-fill-add" style={{
          fontSize:'16px'
        }}></i>
        {' '}
        Adicionar Usuário
      </Button>
      <Table hover responsive striped>
        <thead style={{ fontWeight: 'bold' }}>
          <tr>
            <th># ID</th>
            <th>Usuário</th>
            <th>Admin ?</th>
            <th 
            title='O usuário alterou a senha depois do primeiro login com senha nova?'
            >Senha Alterada</th>
            <th>Ativo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios?.map((usuario: IUsuario) => (
            <tr key={usuario._id}>
              <td>{usuario._id}</td>
              <td>{usuario.usuario}</td>
              <td>
                <SwitchAdmin role={usuario.role} id={usuario._id}/>
              </td>
              <td>{usuario.alterarSenha ? <i className="bi bi-ban" style={{color:'red'}}></i> : <i className="bi bi-check2-circle" style={{color:'green'}}></i>}</td>
              <td>
                <Input type="checkbox" checked={usuario.ativo} onChange={(event)=>handleAtivarDesativar(event.target.checked,usuario._id)}/>
              </td>
              <td>
                <Button title="Alterar Senha" color='info' onClick={()=>navigate(`/alterarsenha/${usuario._id}`)}>
                <i className="bi bi-key-fill"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </>
    </Layout>
  )
}
