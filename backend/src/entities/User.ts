import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { Avaliacao } from './Avaliacao.js'
import { Carrinho } from './Carrinho.js'
import { Jogo } from './Jogo.js'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('text')
  username!: string

  @Column('text')
  email!: string

  @Column('text')
  password!: string

  @OneToOne(() => Carrinho, carrinho => carrinho.user)
  @JoinColumn()
  carrinho!: Carrinho

  @ManyToMany(() => Jogo)
  @JoinTable()
  jogos!: Jogo[]

  @OneToMany(() => Avaliacao, avaliacao => avaliacao.user)
  avaliacoes!: Avaliacao[]
}