import express from 'express'
import 'reflect-metadata'
import authRoutes from './routes/authRoutes'

const app = express()
app.use(express.json())

app.use('/auth', authRoutes)

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})