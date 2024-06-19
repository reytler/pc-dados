import bodyParser from 'body-parser'
import express, { Request, Response, NextFunction } from 'express'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

export { app }
