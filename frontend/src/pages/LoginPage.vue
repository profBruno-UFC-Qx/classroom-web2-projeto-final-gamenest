<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { api } from '@/api'
import { useUserStore } from '@/stores/userStore'
import { isAxiosError } from 'axios'
import { isApplicationError } from '@/composables/useApplicationError'
import type { ApplicationError } from '@/types'

const identifier = ref('')
const password = ref('')
const loading = ref(false)
const exception = ref<ApplicationError>()
const router = useRouter()
const route = useRoute()

const userStore = useUserStore()

let message = route.query.message || ''

async function authenticate() {
  try {
    loading.value = true
    exception.value = undefined
    const { data } = await api.post('auth/local', {
      identifier: identifier.value,
      password: password.value
    })
    const { jwt } = data

    const res = await api.get('users/me', {
      headers: {
        Authorization: `Bearer ${jwt}`
      },
      params: {
        populate: {
          role: true,
          carrinho: {
            populate: {
              jogos: {
                populate: 'Capa'
              }
            }
          }
        }
      }
    })

    const role = res.data.role.type

    userStore.authenticated(res.data, jwt)

    if (role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/')
    }
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data
      message = ''
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="border-bottom fill"></div>

  <div class="caixa-login">
    <div class="container col col-md-6 col-xl-3">
      <router-link :to="'/'" class="no-link-style">
        <h1 class="mb-4">GameNest</h1>
      </router-link>
      <form @submit.prevent="authenticate" class="border p-3 rounded my-3">
        <h4>Entrar</h4>
        <div v-if="message">
          <div class="alert alert-success" role="alert">
            {{ message }}
          </div>
        </div>
        <div v-if="exception" class="alert alert-danger" role="alert">
          {{ exception.error.message }}
        </div>
        <div class="mb-3 mt-4">
          <label for="exampleInputEmail1" class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            v-model="identifier"
            placeholder="exemplo@mail.com"
            required
          />
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Senha</label>
          <input
            type="password"
            class="form-control"
            v-model="password"
            id="exampleInputPassword1"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary mt-2">Entrar</button>
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
