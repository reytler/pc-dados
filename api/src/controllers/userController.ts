import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User'

const register = async (req: Request, res: Response) => {
  try {
    const { usuario, senha, role } = req.body

    const user = new User({
      usuario: usuario,
      senha: await bcrypt.hash(senha, 10),
      role: role,
      alterarSenha: true,
    })

    await user.save()

    res.status(201).json({ message: 'Usuario criado com sucesso' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export { register }
