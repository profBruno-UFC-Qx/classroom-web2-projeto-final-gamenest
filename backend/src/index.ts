import 'reflect-metadata';
import express from 'express';
import gameRoutes from './routes/gameRoutes.js';
import { AppDataSource } from './config/data-source.js';

async function startServer() {
  try {
    await AppDataSource.initialize();
  
    const app = express()
    const port = 3000
  
    app.use(express.json())
    app.use('/jogos', gameRoutes)
  
    
    app.listen(port, () => {
      console.log(`Servidor escutando na porta ${port}`)
    })
  } catch (error) {
    throw error
  }
}

startServer();