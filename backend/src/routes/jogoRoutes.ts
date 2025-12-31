import fs from 'fs'
import path from 'path'
import { Router } from 'express'
import { AppDataSource } from '../config/data-source.js'
import { Jogo } from '../entities/Jogo.js'
import { uploadConfig } from '../config/upload.js'

const router = Router()

router.post('/', uploadConfig.single('files.Capa'), async (req, res) => {
  const parsedData = JSON.parse(req.body.data)
  const { nome, preco, descricao, desenvolvedora } = parsedData

  if (!nome || !preco || !descricao || !desenvolvedora) {
    return res.status(400).json({
      error: {
        status: 400,
        name: 'BadRequest',
        message: 'Todos os campos são obrigatórios'
      }
    })
  }

  const jogoRepository = AppDataSource.getRepository(Jogo)

  const newJogo = jogoRepository.create({
    nome: nome,
    preco: preco,
    descricao: descricao,
    desenvolvedora: desenvolvedora,
    capaUrl: `/uploads/${req.file!.filename}`
  })

  await jogoRepository.save(newJogo)
  res.status(201).json({
    data: newJogo
  })
})

router.get('/', async (req, res) => {
  const jogoRepository = AppDataSource.getRepository(Jogo)
  const jogos = await jogoRepository.find()

  res.json({
    data: jogos
  })
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  
  const jogoRepository = AppDataSource.getRepository(Jogo)
  const jogo = await jogoRepository.findOneBy({ id: parseInt(id) })

  if (!jogo) {
    return res.status(404).json({
      error: {
        status: 404,
        name: 'NotFound',
        message: 'Jogo não encontrado',
      }
    })
  }

  res.json({
    data: jogo
  })
})

router.put('/:id', uploadConfig.single('files.Capa'), async (req, res) => {
  const id = Number(req.params.id)

  const parsedData = JSON.parse(req.body.data)
  const { nome, preco, descricao, desenvolvedora } = parsedData

  const jogoRepository = AppDataSource.getRepository(Jogo)
  const jogo = await jogoRepository.findOneBy({ id })

  if (!jogo) {
    return res.status(404).json({
      error: {
        status: 404,
        name: 'NotFound',
        message: 'Jogo não encontrado',
      }
    })
  }

  jogo.nome = nome || jogo.nome
  jogo.preco = preco || jogo.preco
  jogo.descricao = descricao || jogo.descricao
  jogo.desenvolvedora = desenvolvedora || jogo.desenvolvedora

  if (req.file) {
    if (jogo.capaUrl) {
      const oldImagePath = path.resolve(
        process.cwd(),
        jogo.capaUrl.replace('/uploads/', 'uploads/')
      )

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath)
      }
    }
    jogo.capaUrl = `/uploads/${req.file.filename}`
  }

  await jogoRepository.save(jogo)

  res.status(200).json({
    data: jogo
  })
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params

  const jogoRepository = AppDataSource.getRepository(Jogo)
  const jogo = await jogoRepository.findOneBy({ id: parseInt(id) })

  if (!jogo) {
    return res.status(404).json({
      error: {
        status: 404,
        name: 'NotFound',
        message: 'Jogo não encontrado',
      }
    })
  }

  if (jogo.capaUrl) {
    const imagePath = path.resolve(
      process.cwd(),
      jogo.capaUrl.replace('/uploads/', 'uploads/')
    )

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath)
    }
  }

  await jogoRepository.remove(jogo)

  res.status(204).send()
})

export default router