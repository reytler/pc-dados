import bodyParser from 'body-parser'
import express from 'express'

import userRoutes from './routes/user'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(userRoutes)

export { app }
