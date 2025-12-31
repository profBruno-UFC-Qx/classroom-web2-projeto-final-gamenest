import 'reflect-metadata';
import express from 'express';
import path from 'path'
import jogoRoutes from './routes/jogoRoutes.js';
import { AppDataSource } from './config/data-source.js';

async function startServer() {
  try {
    await AppDataSource.initialize();
  
    const app = express()
    const port = 3000
  
    app.use(express.json())

    app.use(
      '/uploads',
      express.static(path.resolve(process.cwd(), 'uploads'))
    )

    app.use('/jogos', jogoRoutes)
  
    
    app.listen(port, () => {
      console.log(`Servidor escutando na porta ${port}`)
    })
  } catch (error) {
    throw error
  }
}

startServer();