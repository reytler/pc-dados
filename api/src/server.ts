import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { app } from './app'

dotenv.config()

const port = process.env.PORT || 5000
const mongoUri = `mongodb://${process.env.USER_DB}:${process.env.PASSWORD_DB}@${process.env.HOST}:${process.env.PORT_DB}/dadospc?authSource=admin`
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  })
  .catch((err: any) => {
    console.error('Connection error: ', err.message)
  })
