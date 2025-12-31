<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router';

const userStore = useUserStore()

const router = useRouter()

function logout() {
  userStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="container-fluid px-0">
    <header
      class="d-flex flex-wrap align-items-center justify-content-between py-3 mb-4 border-bottom px-2"
    >
      <div class="col-md-3 ms-3 d-flex">
        <router-link to="/" class="nome mx-3 no-link-style">
          <h3 class="game-nest-text">GameNest</h3>
        </router-link>
      </div>

      <div
        v-if="userStore.username"
        class="col-md-3 text-end me-3 d-flex justify-content-end align-items-center"
      >
        <span style="font-size: 1.1rem">{{ userStore.username }}</span>

        <div class="dropdown ms-1">
          <div
            class="drop-button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-caret-down-fill"></i>
          </div>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
            <router-link :to="'/profile'">
              <li>
                <a class="dropdown-item" href="#"><i class="bi bi-person"></i> Perfil</a>
              </li>
            </router-link>
            <router-link :to="'/cart'">
              <li>
                <a class="dropdown-item" href="#"><i class="bi bi-cart2"></i> Carrinho</a>
              </li>
            </router-link>
            <router-link :to="'/library'">
              <li>
                <a class="dropdown-item" href="#"><i class="bi bi-collection"></i> Biblioteca</a>
              </li>
            </router-link>
            <router-link :to="'/admin'">
              <li v-if="userStore.role == 'Admin'">
                <a class="dropdown-item" href="#"><i class="bi bi-gear"></i> Admin</a>
              </li>
            </router-link>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <a @click="logout" class="dropdown-item" href="#"
                ><i class="bi bi-box-arrow-right"></i> Logout</a
              >
            </li>
          </ul>
        </div>
      </div>

      <div v-else class="col-md-3 text-end mx-3">
        <router-link :to="`/login`"><button type="button" class="btn btn-outline-primary me-2">Login</button></router-link>
        <router-link :to="'/register'"><button type="button" class="btn btn-primary">Criar Conta</button></router-link>
      </div>
    </header>
  </div>
</template>

<style scoped>
.no-link-style {
  text-decoration: none;
  color: inherit;
  margin: 0;
  padding: 0;
}

.nome {
  font-family: 'Tiny5';
  padding-top: 5px;
}

.game-nest-text {
  margin: 0;
  padding: 0;
  line-height: 1;
  display: inline;
}

.drop-button {
  cursor: pointer;
  padding-top: 4px;
}

.dropdown-menu {
  min-width: 150px; /* Tamanho customizado */
  max-width: 250px; /* Para não ficar grande demais */
  font-size: 1rem; /* Tamanho do texto */
}

a {
  text-decoration: none;
}
</style>
