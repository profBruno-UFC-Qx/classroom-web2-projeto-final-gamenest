import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm'
import { User } from './User.js'
import { Jogo } from './Jogo.js'

@Entity('avaliacoes')
export class Avaliacao {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('text')
  corpo!: string

  @Column('boolean', {default: true})
  feedback!: boolean

  @ManyToOne(() => User, user => user.avaliacoes)
  user!: User

  @ManyToOne(() => Jogo, jogo => jogo.avaliacoes)
  jogo!: Jogo
}