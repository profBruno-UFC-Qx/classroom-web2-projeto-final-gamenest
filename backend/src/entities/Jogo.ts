import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm'
import { Avaliacao } from './Avaliacao.js'

@Entity('jogos')
export class Jogo {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('text')
  nome!: string

  @Column('text')
  descricao!: string

  @Column('text')
  desenvolvedora!: string

  @Column('decimal', { precision: 10, scale: 2 })
  preco!: number

  @Column('text')
  capaUrl!: string

  @OneToMany(() => Avaliacao, avaliacao => avaliacao.jogo)
  avaliacoes!: Avaliacao[]
}
