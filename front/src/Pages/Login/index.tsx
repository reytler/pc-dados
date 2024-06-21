import { FormEvent, useState } from 'react'
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import Cookies from 'js-cookie'
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

export function Login() {
  const [usuario, setUsuario] = useState<number>(0)
  const [senha, setSenha] = useState<string>('')
  const { notify } = useNotification()

  async function fetchLogin(loginDTO: LoginDTO): Promise<any> {
    const res = await api.post('/user/login', loginDTO)
    return res.data
  }

  const mutationLogin = useMutation({
    mutationFn: async (loginDTO: LoginDTO) => fetchLogin(loginDTO),
    onSuccess: async (ok) => {
      Cookies.remove('token')
      Cookies.set('token', ok.token, { expires: 1 })

      notify(enumTypeNotification.SUCCESS, 'Login realizado com sucesso')
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
