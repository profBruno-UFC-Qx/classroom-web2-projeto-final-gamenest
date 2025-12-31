<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { isAxiosError } from 'axios'
import { api } from '@/api'
import { useUpload } from '@/composables/useUpload'
import { useUserStore } from '@/stores/userStore'
import type { ApplicationError, Game } from '@/types'
import { isApplicationError } from '@/composables/useApplicationError'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const id = ref<number | null>(null)
const nome = ref('')
const capa = ref<File>()
const capaURL = ref('')
const descricao = ref('')
const desenvolvedora = ref('')
const preco = ref<number>()

const userStore = useUserStore()

const loading = ref(false)
const feedback = ref('')
const error = ref<ApplicationError>()

const route = useRoute()
const router = useRouter()

onMounted(() => {
  id.value = route.params.id ? Number(route.params.id) : null

  if (id.value) {
    getGame()
  }
})

async function getGame() {
  try {
    loading.value = true
    const { data } = await api.get(`/jogos/${route.params.id}`, {
      params: {
        populate: 'cover'
      }
    })
    const game = data.data as Game
    nome.value = game.Nome
    preco.value = game.Preco
    descricao.value = game.Descricao
    desenvolvedora.value = game.Desenvolvedora
    capaURL.value = game.Capa.url
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      error.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
}

function handleUpload(event: Event) {
  const inputEvent = event as InputEvent
  const target = inputEvent.target as HTMLInputElement
  capa.value = target.files?.item(0) as File
}

async function createGame() {
  try {
    loading.value = true
    const formData = new FormData()
    formData.append('files.Capa', capa.value as File)
    formData.append(
      'data',
      JSON.stringify({
        Nome: nome.value,
        Preco: preco.value,
        Descricao: descricao.value,
        Desenvolvedora: desenvolvedora.value
      })
    )

    const { data } = await api.post('/jogos', formData, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })

    feedback.value = 'Jogo criado com sucesso.'
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      error.value = e.response?.data
      feedback.value = error.value.error.message
    }
  } finally {
    loading.value = false
    router.push({ path: '/admin', query: { message: feedback.value } })
  }
}

async function updateGame() {
  try {
    loading.value = true

    if (capa.value) {
      const formData = new FormData()
      formData.append('files.Capa', capa.value as File)
      formData.append(
        'data',
        JSON.stringify({
          Nome: nome.value,
          Preco: preco.value,
          Descricao: descricao.value,
          Desenvolvedora: desenvolvedora.value
        })
      )

      const { data } = await api.put(`/jogos/${id.value}`, formData, {
        headers: {
          Authorization: `Bearer ${userStore.jwt}`
        }
      })

    } else {
      const { data } = await api.put(
        `/jogos/${id.value}`,
        {
          data: {
            Nome: nome.value,
            Preco: preco.value,
            Descricao: descricao.value,
            Desenvolvedora: desenvolvedora.value
          }
        },
        {
          headers: {
            Authorization: `Bearer ${userStore.jwt}`
          }
        }
      )
      await getGame()
    }
    feedback.value = 'Jogo atualizado com sucesso.'
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      error.value = e.response?.data
      feedback.value = error.value.error.message
    }
  } finally {
    loading.value = false
    router.push({ path: '/admin', query: { message: feedback.value } })
  }
}
</script>

<template>
  <div v-if="loading" class="text-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div
    v-if="feedback"
    class="col-12 alert alert-dismissible fade show"
    :class="{ 'alert-danger': error, 'alert-success': !error }"
    role="alert"
  >
    {{ feedback }}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>

  <div class="d-flex justify-content-center">
    <form @submit.prevent="id ? updateGame() : createGame()" class="w-75">
      <img class="col-auto" v-if="capaURL" :src="useUpload()(capaURL)" />
      <div class="d-flex flex-column justify-content-center">
        <div class="col-12 col-lg-6 mb-3">
          <label for="coverInput" class="form-label">Capa</label>
          <input
            @change="handleUpload"
            type="file"
            id="coverInput"
            accept="image/*"
            class="form-control"
            required
          />
        </div>

        <div class="col-12 col-lg-6 mb-3">
          <label for="nameInput" class="form-label">Nome</label>
          <input
            v-model="nome"
            type="text"
            id="nameInput"
            class="form-control"
            placeholder="Nome do jogo"
            required
          />
        </div>

        <div class="col-12 col-lg-6 mb-3">
          <label for="priceInput" class="form-label">Preço</label>
          <input
            v-model="preco"
            type="number"
            id="priceInput"
            class="form-control"
            placeholder="00.00"
            step="0.01"
            required
          />
        </div>

        <div class="col-12 col-lg-6 mb-3">
          <label for="developerInput" class="form-label">Desenvolvedora</label>
          <input
            v-model="desenvolvedora"
            type="text"
            id="developerInput"
            class="form-control"
            placeholder="Desenvolvedora"
            required
          />
        </div>

        <div class="col-12 col-lg-6 mb-3">
          <label for="descriptionInput" class="form-label">Descrição</label>
          <textarea
            v-model="descricao"
            id="descriptionInput"
            class="form-control"
            placeholder="Descrição do jogo"
            style="height: 200px; padding-top: 10px; padding-bottom: 10px"
            required
          ></textarea>
        </div>
      </div>
      <div class="mt-3">
        <RouterLink to="/admin" class="btn btn-danger me-2">
          Cancelar<i class="ms-1 bi bi-x-lg"></i>
        </RouterLink>

        <button v-if="id" type="submit" class="btn btn-primary">
          Editar<i class="ms-1 bi bi-pencil-square"></i>
        </button>

        <button v-else type="submit" class="btn btn-success">
          Criar<i class="ms-1 bi bi-plus-circle"></i>
        </button>
      </div>
    </form>
  </div>
</template>
