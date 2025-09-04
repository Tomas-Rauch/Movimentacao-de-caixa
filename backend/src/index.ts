import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './docs/swagger'
import authRoutes from './routes/authRoutes'
import movimentacaoRoutes from './routes/movimentacaoRoutes';
import categoriaRoutes from './routes/categoriaRoutes';
import userRoutes from './routes/userRoutes';


const app = express()

// Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'https://movimentacao-de-caixa-production-1e26.up.railway.app'
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (origin && allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (!origin) {
      // Permitir requisições sem origem (ex: Postman, mobile apps)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json())

// Rotas
app.use('/auth', authRoutes);
app.use('/movimentacoes', movimentacaoRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/users', userRoutes);

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
  console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`)
})