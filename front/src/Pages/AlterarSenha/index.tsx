import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap'
import { Layout } from '../../Components/Layout'
import { useToken } from '../../Hooks/useToken'
import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import api from '../../api/api'
import { enumTypeNotification, useNotification } from '../../Context/Notification'
import { enumRole } from '../Login'

interface IAlterarSenhaDTO {
  novaSenha: string
  alterarSenha: boolean
}

export function AlterarSenha() {
  const { id } = useParams();
  const { decoded } = useToken()
  const [novaSenha, setNovaSenha] = useState<string>('')
  const [confirmaNovaSenha, setConfirmaNovaSenha] = useState<string>('')
  const [comprimento, setComprimento] = useState(false)
  const [iguais, setIguais] = useState(false)
  const [umaLetra,setUmaLetra] = useState(false)
  const [umNumero,setUmNumero] = useState(false)
  const [mostrarSenhas, setMostrarSenhas] = useState(false)
  const [idParaAlterarSenha,setIdParaAlterarSenha] = useState<string>('')
  const {notify} = useNotification()
  const navigate = useNavigate()

  function defineRouteByRole(role: string) {
    switch (role) {
      case enumRole.ADMIN:
        navigate('/usuarios')
        break
      case enumRole.USER:
        navigate('/')
        break
      default:
        navigate('/')
        break
    }
  }

  useEffect(()=>{
    if(id !== undefined){
      setIdParaAlterarSenha(id)
    }else{
      setIdParaAlterarSenha(decoded?._id)
    }
  },[id,decoded])

  async function AlterarSenhaApi(alterarSenhaDTO: IAlterarSenhaDTO, id: string):Promise<any>{
    const promise = api.patch(`/user/alterarsenha/${id}`,alterarSenhaDTO)
    notify(enumTypeNotification.PROMISE,`Alterando senha do usuário de id: ${id}`,promise)
    const res = await promise
    return res.data
  }

  const mutationAlterarSenha = useMutation({
    mutationFn: async (alterarSenhaDTO: IAlterarSenhaDTO)=>AlterarSenhaApi(alterarSenhaDTO,idParaAlterarSenha),
    onSuccess: async (ok: any)=>{
      notify(enumTypeNotification.SUCCESS,ok.message)
      defineRouteByRole(decoded.role)
    },
    onError: async (error: any)=>{
      notify(enumTypeNotification.ERROR, error.response.data.message)
    },
   
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const alterarSenhaDTO: IAlterarSenhaDTO = {
      alterarSenha: id !== undefined ? false : true,
      novaSenha: novaSenha
    }
    mutationAlterarSenha.mutate(alterarSenhaDTO)
  }

  function validatePassword() {
    if (novaSenha.length >= 6) {
      setComprimento(true)
    } else {
      setComprimento(false)
    }

    if (novaSenha === confirmaNovaSenha) {
      setIguais(true)
    } else {
      setIguais(false)
    }

    if(/[A-Z]/.test(novaSenha)){
      setUmaLetra(true)
    }else{
      setUmaLetra(false)
    }

    if(/\d/.test(novaSenha)){
      setUmNumero(true)
    }else{
      setUmNumero(false)
    }
  }

  useEffect(() => {
    validatePassword()
  }, [novaSenha, confirmaNovaSenha])

  return (
    <Layout title={id !== undefined ? `Alterar Senha do id: ${id}` : "Alterar Senha"}>
      <>
        <Form
          style={{
            marginTop: '150px',
          }}
          onSubmit={(event) => handleSubmit(event)}
        >
          <Row
            style={{
              justifyContent: 'center',
            }}
          >
            <Col xs="11" sm="4" md="6" xl="3">
              <FormGroup>
                <Input
                  type="checkbox"
                  onChange={(event) => setMostrarSenhas(event.target.checked)}
                  checked={mostrarSenhas}
                  />
                <Label>Mostrar Senha</Label>
              </FormGroup>
            </Col>
          </Row>
          <Row
            style={{
              justifyContent: 'center',
            }}
          >
            <Col xs="11" sm="4" md="6" xl="3">
              <FormGroup>
                <Label>Nova Senha:</Label>
                <Input
                  type={mostrarSenhas ? 'text' : 'password'}
                  onChange={(event) => setNovaSenha(event.target.value)}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Row
            style={{
              justifyContent: 'center',
            }}
          >
            <Col xs="11" sm="4" md="6" xl="3">
              <FormGroup>
                <Label>Confirmar Nova Senha:</Label>
                <Input
                  type={mostrarSenhas ? 'text' : 'password'}
                  onChange={(event) => setConfirmaNovaSenha(event.target.value)}
                  required
                  invalid={!iguais}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row
            style={{
              justifyContent: 'center',
            }}
          >
            <Col xs="11" sm="4" md="6" xl="3">
              <FormGroup>
                <Button color="success">Redefinir</Button>
              </FormGroup>
            </Col>
          </Row>
        </Form>
        <ul
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <li style={{ width: '300px', color: comprimento ? 'green' : 'red' }}>
            A senha deve ter no mínimo 6 caractres
          </li>
          <li style={{ width: '300px', color: iguais ? 'green' : 'red' }}>
            A confirmação da senha deve ser igual a nova senha
          </li>
          <li style={{ width: '300px', color: umaLetra ? 'green' : 'red' }}>
            A senha deve ter no mínimo uma letra maiúscula
          </li>
          <li style={{ width: '300px', color: umNumero ? 'green' : 'red' }}>
            A senha deve ter no mínimo um número
          </li>
        </ul>
      </>
    </Layout>
  )
}
