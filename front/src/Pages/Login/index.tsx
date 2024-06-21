import { FormEvent, useEffect, useState } from 'react'
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import { decodeToken, useJwt } from 'react-jwt'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import styles from './login.module.css'
import api from '../../api/api'
import {
  enumTypeNotification,
  useNotification,
} from '../../Context/Notification'
import { useMutation } from '@tanstack/react-query'
interface LoginDTO {
  usuario: number
  senha: string
}

export interface Idecoded {
  usuario: number
  role: string
  iat: number
  exp: number
}

export const enumRole = {
  ADMIN: 'ADMIN',
  USER: 'USER',
}

export function Login() {
  const { decodedToken, isExpired } = useJwt<string>(
    `${Cookies.get('token')?.toString()}`,
  )
  const [usuario, setUsuario] = useState<number>(0)
  const [senha, setSenha] = useState<string>('')
  const { notify } = useNotification()
  const navigate = useNavigate()

  async function fetchLogin(loginDTO: LoginDTO): Promise<any> {
    const res = await api.post('/user/login', loginDTO)
    return res.data
  }

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

  useEffect(() => {
    if (!isExpired && decodedToken !== null) {
      //@ts-ignore
      const decoded: Idecoded = decodedToken
      defineRouteByRole(decoded?.role)
    }
  }, [decodedToken, isExpired])

  function loginSuccess(data: any) {
    try {
      Cookies.remove('token')
      Cookies.set('token', data.token, { expires: 1 })
      const decoded: Idecoded | null = decodeToken(data.token)
      notify(enumTypeNotification.SUCCESS, 'Login realizado com sucesso')
      if (decoded?.role !== undefined) {
        defineRouteByRole(decoded?.role)
      }
    } catch (error) {
      console.error(error)
      notify(enumTypeNotification.ERROR, 'Falha ao realizar login')
    }
  }

  const mutationLogin = useMutation({
    mutationFn: async (loginDTO: LoginDTO) => fetchLogin(loginDTO),
    onSuccess: async (ok) => {
      loginSuccess(ok)
    },
    onError: async (error: any) => {
      notify(enumTypeNotification.ERROR, error.response.data.message)
    },
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const loginDTO: LoginDTO = {
      senha: senha,
      usuario: usuario,
    }

    mutationLogin.mutateAsync(loginDTO)
  }

  return (
    <main className={styles.conteiner}>
      <h1>Base PC MT</h1>

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
              <Label>Usuário</Label>
              <Input
                type="number"
                onChange={(event) => setUsuario(parseInt(event.target.value))}
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
              <Label>Senha</Label>
              <Input
                type="password"
                onChange={(event) => setSenha(event.target.value)}
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
              <Button color="success">Entrar</Button>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    </main>
  )
}
