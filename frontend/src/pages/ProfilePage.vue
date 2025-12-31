<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { api } from '@/api'
import type { User } from '@/types'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const user = ref<User | null>(null)
const error = ref<string | null>(null)
const router = useRouter()

// console.log(userStore.jwt)

const fetchUserProfile = async () => {
  try {
    const response = await api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })
    user.value = response.data
  } catch (err) {
    error.value = 'Failed to fetch user profile.'
  }
}

const updateUserProfile = async () => {
  try {
    const response = await api.put(`/users/${userStore.user.id}`, user.value, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })
    user.value = response.data

    router.push({ path: '/login', query: { message: 'Perfil atualizado com sucesso. Faça login novamente.' } })
  } catch (err) {
    error.value = 'Failed to update profile.'
  }
}

const deleteUserAccount = async () => {
  try {
    const response = await api.get(
      `/avaliacaos?filters[users_permissions_user][id][$eq]=${userStore.user.id}`,
      {
        headers: {
          Authorization: `Bearer ${userStore.jwt}`
        }
      }
    )
    for (const rating of response.data.data) {
      await api.delete(`/avaliacaos/${rating.id}`, {
        headers: {
          Authorization: `Bearer ${userStore.jwt}`
        }
      })
    }

    await api.delete(`/carrinhos/${userStore.user.carrinho.id}`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })

    await api.delete(`/users/${userStore.user.id}`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })

    userStore.logout()
    router.push({ path: '/login', query: { message: 'Conta deletada com sucesso.' } })
  } catch (err) {
    error.value = 'Falha ao deletar conta.'
  }
}

onMounted(() => {
  fetchUserProfile()
})
</script>

<template>
  <div class="profile-page container">
    <h1 class="text-center mb-5">Perfil</h1>
    <div v-if="error" class="alert" :class="error === 'Profile updated successfully.' || error === 'Conta deletada com sucesso.' ? 'alert-success' : 'alert-danger'">
      {{ error }}
    </div>
    <div v-if="user" class="profile-info fs-5">
      <p><strong>Usuário:</strong> {{ user.username }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <hr />
      <form @submit.prevent="updateUserProfile">
        <div class="form-group">
          <label for="username">Nome de usuário</label>
          <input type="text" id="username" v-model="user.username" class="form-control" />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="user.email" class="form-control" />
        </div>
        <div class="mt-4">
          <button type="submit" class="btn btn-primary">
            Editar <i class="bi bi-pencil-square fs-5"></i>
          </button>
        </div>
      </form>
      <div class="mt-2">
        <button @click="deleteUserAccount" class="btn btn-danger">
          Deletar Conta <i class="bi bi-trash fs-5"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.profile-info {
  text-align: start;
  border: 1px solid #ccc;
  padding: 30px;
  border-radius: 10px;
}

.profile-picture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.alert {
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 5px;
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}
</style>
