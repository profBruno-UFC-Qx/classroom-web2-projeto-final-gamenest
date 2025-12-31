<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '@/api'
import { useUserStore } from '@/stores/userStore'
import { useRoute } from 'vue-router'
import { isAxiosError } from 'axios'
import { isApplicationError } from '@/composables/useApplicationError'
import type { Game } from '@/types'
import type { ApplicationError } from '@/types'
import GamesAdminTableItem from '@/components/GamesAdminTableItem.vue'

const jogos = ref([] as Game[])

const userStore = useUserStore()

const gameToDelete = ref<Game | undefined>(undefined)
const exception = ref<ApplicationError>()
const loading = ref(false)

const feedback = ref('')
const error = ref<ApplicationError>()
const route = useRoute()

let message = route.query.message || ''

const fetchGames = async () => {
  try {
    const response = await api.get('/jogos?populate=Capa')
    jogos.value = response.data.data
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchGames()
})

function askDeleteGame(id: number) {
  gameToDelete.value = jogos.value.find((jogo) => jogo.id === id)
}

function close() {
  gameToDelete.value = undefined
}

async function deleteGame(id: number) {
  try {
    const response = await api.delete(`/jogos/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })

    const gameDeleted = response.data.data
    const index = jogos.value.findIndex((jogo) => jogo.id === gameDeleted.id)
    jogos.value.splice(index, 1)
  } catch (error) {
    if (isAxiosError(error) && isApplicationError(error.response?.data)) {
      exception.value = error.response?.data
    }
  } finally {
    loading.value = false
  }

  close()
}
</script>

<template>
  <div v-if="message" class="d-flex justify-content-center">
    <div
      class="col-10 col-lg-5 alert alert-dismissible fade show"
      :class="{ 'alert-danger': error, 'alert-success': !error }"
      role="alert"
    >
      {{ message }}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  </div>

  <h2 class="text-lg font-semibold text-center my-4">Lista de Jogos</h2>

  <div class="d-flex mb-4 px-5 py-2 w-full justify-content-center">
    <RouterLink to="/games/create">
      <button class="btn btn-outline-success fs-5">
        Criar Jogo <i class="bi bi-plus-circle"></i>
      </button>
    </RouterLink>
  </div>

  <div class="tabela flex">
    <table class="table table-striped">
      <thead>
        <tr>
          <th>id</th>
          <th>Capa</th>
          <th>Jogo</th>
          <th>Preço</th>
          <th>Ação</th>
        </tr>
      </thead>
      <tbody>
        <GamesAdminTableItem
          v-for="jogo in jogos"
          :key="jogo.id"
          :Nome="jogo.Nome"
          :Preco="jogo.Preco"
          :Capa="jogo.Capa"
          :id="jogo.id"
          @delete="askDeleteGame"
        />
      </tbody>
    </table>
  </div>

  <div v-if="gameToDelete" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Deletar jogo</h5>
        </div>
        <div class="modal-body">
          <p>
            Você tem certeza que deseja remover "<strong>{{ gameToDelete.Nome }}</strong
            >"?
          </p>
        </div>
        <div class="modal-footer">
          <button @click="close" type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Não
          </button>
          <button @click="deleteGame(gameToDelete.id)" type="button" class="btn btn-danger">
            Sim
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.tabela {
  display: flex;
  justify-content: center;
}

.table {
  width: 80%;
  border: 1px solid #dee2e6;
}

tbody {
  border: 1px solid #dee2e6;
}

td,
th {
  font-size: 1.1rem;
  vertical-align: middle;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1050;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
}
</style>
