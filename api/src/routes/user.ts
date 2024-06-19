import { Router, Request, Response } from 'express'
import { register } from '../controllers/userController'

const router = Router()
router.get('/user/working', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Rotas dos usuarios funcionando' })
})
router.post('/user/criar', register)

export default router
