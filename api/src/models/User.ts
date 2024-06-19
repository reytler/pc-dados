import { Schema, model, Document } from 'mongoose'

export interface IUser extends Document {
  usuario: string
  senha: string
  role: string
  alterarSenha: boolean
}

const userSchema = new Schema<IUser>({
  usuario: { type: String, required: true },
  senha: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin'],
    default: 'user',
  },
})

const User = model<IUser>('User', userSchema)

export default User
