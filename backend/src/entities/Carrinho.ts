import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm'
import { Jogo } from './Jogo.js'
import { User } from './User.js'

@Entity('carrinhos')
export class Carrinho {
  @PrimaryGeneratedColumn()
  id!: number

  @OneToOne(() => User, user => user.carrinho)
  user!: User

  @ManyToMany(() => Jogo)
  @JoinTable()
  jogos!: Jogo[]
}