import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm'

@Entity('games')
export class Game {
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

  @Column('text', { nullable: true })
  capaUrl!: string
}
