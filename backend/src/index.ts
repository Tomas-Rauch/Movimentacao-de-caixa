import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './docs/swagger'
import authRoutes from './routes/authRoutes'
import movimentacaoRoutes from './routes/movimentacaoRoutes';
import categoriaRoutes from './routes/categoriaRoutes';

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Rotas
app.use('/auth', authRoutes)

app.use('/movimentacoes', movimentacaoRoutes);
app.use('/categorias', categoriaRoutes);

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Inicialização do servidor
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
  console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`)
})