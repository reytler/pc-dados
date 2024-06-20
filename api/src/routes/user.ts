import { Router, Request, Response } from 'express'
import { listUsers, login, register } from '../controllers/userController'
import { auth, permit } from '../middlewares/auth'

const router = Router()
router.get('/user/working', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Rotas dos usuarios funcionando' })
})

router.post('/user/criar', register)

router.post('/user/login', login)

router.get('/user/list', auth, permit(['ADMIN']), listUsers)

export default router
