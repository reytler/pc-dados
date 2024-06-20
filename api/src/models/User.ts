import { Schema, model, Document } from 'mongoose'

export interface IUser extends Document {
  usuario: number
  senha: string
  role: string
  alterarSenha: boolean
  ativo: boolean
}

const userSchema = new Schema<IUser>({
  usuario: { type: Number, required: true },
  senha: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['USER', 'ADMIN'],
    default: 'USER',
  },
  alterarSenha: { type: Boolean, required: false },
  ativo: { type: Boolean, required: false },
})

const User = model<IUser>('User', userSchema)

export default User
