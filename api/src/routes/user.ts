import { Router, Request, Response } from 'express'
import {
  alterarPermissao,
  alterarSenha,
  ativaDesativaUsuario,
  listUsers,
  login,
  register,
} from '../controllers/userController'
import { auth, permit } from '../middlewares/auth'

const router = Router()
router.get('/user/working', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Rotas dos usuarios funcionando' })
})

router.post('/user/criar', auth, permit(['ADMIN']), register)

router.post('/user/login', login)

router.get('/user/list', auth, permit(['ADMIN']), listUsers)

router.patch(
  '/user/alterarsenha/:id',
  auth,
  permit(['ADMIN', 'USER']),
  alterarSenha,
)

router.patch(
  '/user/alterarpermissao/:id',
  auth,
  permit(['ADMIN']),
  alterarPermissao,
)

router.patch(
  '/user/alterarstatus/:id',
  auth,
  permit(['ADMIN']),
  ativaDesativaUsuario,
)

export default router
