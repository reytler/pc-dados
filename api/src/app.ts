import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'

import userRoutes from './routes/user'

const app = express()

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(userRoutes)

export { app }
