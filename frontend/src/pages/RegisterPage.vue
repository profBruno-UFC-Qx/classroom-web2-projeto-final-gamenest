<script setup lang="ts">
import { ref } from 'vue'
import { api } from '@/api'
import { isAxiosError } from 'axios'
import type { ApplicationError } from '@/types'
import { isApplicationError } from '@/composables/useApplicationError'
import { useRouter } from 'vue-router'

const username = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()

const error = ref<ApplicationError>()
const feedback = ref('')

async function register() {
  try {
    const newCart = {
      data: {
        jogos: []
      }
    }

    const dataCart = await api.post('/carrinhos', newCart)

    const newUser = {
      username: username.value,
      email: email.value,
      password: password.value,
      role: {
        id: 1
      },
      carrinho: {
        id: dataCart.data.data.id
      }
    }

    const { data } = await api.post('/auth/local/register', newUser)

    feedback.value = 'Registrado com sucesso!'

    router.push({ path: '/login', query: { message: feedback.value } })
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      error.value = e.response?.data
      feedback.value = error.value.error.message
    }
  }
}
</script>

<template>
  <div class="border-bottom fill"></div>

  <div class="caixa-login my-5">
    <div class="container col col-md-6 col-xl-3">
      <router-link :to="'/'" class="no-link-style">
        <h1 class="mb-4">GameNest</h1>
      </router-link>
      <form class="border p-3 rounded my-3" @submit.prevent="register">
        <div
          v-if="feedback"
          class="col-12 alert alert-dismissible fade show"
          :class="{ 'alert-danger': error, 'alert-success': !error }"
          role="alert"
        >
          {{ feedback }}
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
        <h4>Criar Conta</h4>
        <div class="mb-3 mt-4">
          <label for="username" class="form-label">Nome de usuário</label>
          <input type="text" class="form-control" id="username" v-model="username" />
        </div>
        <div class="mb-3 mt-4">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            id="email"
            v-model="email"
            aria-describedby="emailHelp"
            placeholder="exemplo@mail.com"
            required
          />
        </div>
        <div class="mb-3">
          <label for="senha" class="form-label">Senha</label>
          <input type="password" class="form-control" id="senha" v-model="password" required />
        </div>
        <button type="submit" class="btn btn-primary mt-2">Registrar</button>
      </form>
      <p class="mt-5 mb-3 text-body-secondary">© 2024-2024</p>
    </div>
  </div>
</template>

<style scoped>
.no-link-style {
  text-decoration: none;
  color: inherit;
  margin: 0;
  padding: 0;
}

.fill {
  height: 71px;
}

.caixa-login {
  height: 70vh;
  display: flex;
  align-items: center;
}

h1 {
  font-family: 'Tiny5';
  text-align: center;
  font-size: xxx-large;
}
</style>
