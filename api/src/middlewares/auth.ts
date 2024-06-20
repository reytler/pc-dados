import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'

interface IDecoded {
  usuario: number
  role: string
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token')
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Ausência de token, não autorizado' })
  }

  try {
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`)
    req.headers['x-user-id'] = (decoded as IDecoded).usuario.toString()
    next()
  } catch (err) {
    console.log('ERRO: ', err)
    res.status(401).json({ message: 'Token inválido' })
  }
}

const permit = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findOne({ usuario: req.header('x-user-id') })
      if (!user) {
        return res.status(404).json({ message: 'Usuario não encontrado' })
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: 'Permissão negada' })
      }

      next()
    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor' })
    }
  }
}

export { auth, permit }
