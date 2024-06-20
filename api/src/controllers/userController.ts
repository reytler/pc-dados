import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User'

const register = async (req: Request, res: Response) => {
  try {
    const { usuario, senha, role } = req.body

    const userExists = await User.findOne({ usuario })

    if (userExists) {
      return res
        .status(422)
        .json({ message: 'O usuário informado já existe na base.' })
    }

    const user = new User({
      usuario: usuario,
      senha: await bcrypt.hash(senha, 10),
      role: role,
      alterarSenha: true,
      ativo: true,
    })

    await user.save()

    res.status(201).json({ message: 'Usuario criado com sucesso' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const { usuario, senha } = req.body
    const user = await User.findOne({ usuario })

    if (!user) {
      return res.status(400).json({ message: 'Usuário inválido' })
    }

    const isMatch = await bcrypt.compare(senha, user.senha)

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: 'Senha para o usuário está incorreta' })
    }

    if (!user.ativo) {
      return res
        .status(400)
        .json({
          message:
            'Usuário inativo, peça para o administrador ativar seu usuário.',
        })
    }

    const token = jwt.sign(
      { usuario: user.usuario, role: user.role },
      `${process.env.JWT_SECRET}`,
      { expiresIn: '1h' },
    )

    res.json({ token })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

const listUsers = async (req: Request, res: Response) => {
  try {
    const { usuario, role, alterarSenha } = req.query
    const filter: any = {}

    if (usuario) filter.usuario = usuario
    if (role) filter.role = role
    if (alterarSenha) filter.alterarSenha

    const users = await User.find(filter).select('-senha')

    res.json(users)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export { register, login, listUsers }
