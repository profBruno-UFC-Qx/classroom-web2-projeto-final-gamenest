import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Game } from '../entities/Game.js'

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  entities: [Game]
})