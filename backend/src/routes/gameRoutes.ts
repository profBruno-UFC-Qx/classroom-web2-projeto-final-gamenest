import { Router } from 'express'
import { AppDataSource } from '../config/data-source.js'
import { Game } from '../entities/Game.js'

const router = Router()

router.post('/', async (req, res) => {
  const { Nome, Preco, Descricao, Desenvolvedora } = req.body

  if (!Nome || !Preco || !Descricao || !Desenvolvedora) {
    return res.status(400).json({
      error: {
        status: 400,
        name: 'BadRequest',
        message: 'Todos os campos são obrigatórios'
      }
    })
  }

  const gameRepository = AppDataSource.getRepository(Game)

  const newGame = gameRepository.create({
    nome: Nome,
    preco: Preco,
    descricao: Descricao,
    desenvolvedora: Desenvolvedora
  })

  await gameRepository.save(newGame)
  res.status(201).json({
    data: newGame
  })
})

router.get('/', async (req, res) => {
  const gameRepository = AppDataSource.getRepository(Game)
  const games = await gameRepository.find()

  res.json({
    data: games
  })
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  
  const gameRepository = AppDataSource.getRepository(Game)
  const game = await gameRepository.findOneBy({ id: parseInt(id) })

  if (!game) {
    return res.status(404).json({
      error: {
        status: 404,
        name: 'NotFound',
        message: 'Jogo não encontrado',
      }
    })
  }

  res.json({
    data: game
  })
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { Nome, Preco, Descricao, Desenvolvedora } = req.body

  const gameRepository = AppDataSource.getRepository(Game)
  const game = await gameRepository.findOneBy({ id: parseInt(id) })

  if (!game) {
    return res.status(404).json({
      error: {
        status: 404,
        name: 'NotFound',
        message: 'Jogo não encontrado',
      }
    })
  }

  game.nome = Nome || game.nome
  game.preco = Preco || game.preco
  game.descricao = Descricao || game.descricao
  game.desenvolvedora = Desenvolvedora || game.desenvolvedora

  await gameRepository.save(game)

  res.status(200).json({
    data: game
  })
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params

  const gameRepository = AppDataSource.getRepository(Game)
  const game = await gameRepository.findOneBy({ id: parseInt(id) })

  if (!game) {
    return res.status(404).json({
      error: {
        status: 404,
        name: 'NotFound',
        message: 'Jogo não encontrado',
      }
    })
  }

  await gameRepository.remove(game)

  res.status(204).send()
})

export default router