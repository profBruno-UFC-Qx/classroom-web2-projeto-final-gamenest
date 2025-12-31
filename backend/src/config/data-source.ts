import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Jogo } from '../entities/Jogo.js'
import { Avaliacao } from '../entities/Avaliacao.js'
import { Carrinho } from '../entities/Carrinho.js'
import { User } from '../entities/User.js'

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  entities: [Jogo, Avaliacao, Carrinho, User]
})