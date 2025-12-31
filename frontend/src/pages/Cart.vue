<script setup lang="ts">
import { ref, computed } from 'vue'
import { api } from '@/api'

import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import type { ApplicationError } from '@/types'
import { isAxiosError } from 'axios'
import { isApplicationError } from '@/composables/useApplicationError'
import CartItem from '@/components/CartItem.vue'
import router from '@/router'

const userStore = useUserStore()

const error = ref<ApplicationError>()
const feedback = ref('')

const cartId = ref(userStore.user.carrinho.id)
const cartGames = ref(userStore.user.carrinho.jogos)

const precoFinal = ref(total())
const precoFormatado = computed(() => precoFinal.value.toFixed(2))

function total() {
  let total = 0
  cartGames.value.forEach((jogo) => {
    total += jogo.Preco
  })
  return total
}

function remove(id: number) {
  try {
    cartGames.value = cartGames.value.filter((jogo) => jogo.id !== id)
    userStore.user.carrinho.jogos = cartGames.value

    const newCart = {
      data: {
        jogos: cartGames.value
      }
    }

    api.put(`/carrinhos/${cartId.value}`, newCart, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })

    precoFinal.value = total()
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      error.value = e.response?.data
      feedback.value = error.value.error.message
    }
  }
}

async function buy() {
  try {
    // Getting user's owned games
    const { data } = await api.get(`users/${userStore.user.id}/?populate=jogos`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })
    const ownedGames = data.jogos

    // Adding cart games to owned games
    const order = {
      jogos: cartGames.value.concat(ownedGames)
    }

    await api.put(`users/${userStore.user.id}`, order, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })

    // Cleaning cart
    const newCart = {
      data: {
        jogos: []
      }
    }

    api.put(`/carrinhos/${cartId.value}`, newCart, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })
    userStore.user.carrinho.jogos = []
    precoFinal.value = total()

    router.push({ path: '/library', query: { message: 'Compra realizada com sucesso!' } })
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      error.value = e.response?.data
      feedback.value = error.value.error.message
    }
  }
}
</script>

<template>
  <div v-if="feedback" class="d-flex justify-content-center">
    <div
      class="col-4 alert alert-dismissible fade show"
      :class="{ 'alert-danger': error, 'alert-success': !error }"
      role="alert"
    >
      {{ feedback }}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  </div>
  <h2 class="my-5 text-center">Carrinho de Compras</h2>
  <div class="geral">
    <div v-if="cartGames.length" class="cart">
      <CartItem
        v-for="jogo in cartGames"
        :Nome="jogo.Nome"
        :Preco="jogo.Preco"
        :Capa="jogo.Capa"
        :id="jogo.id"
        @remove="remove"
      />
    </div>
    <div class="cart-review">
      <h5>Resumo</h5>
      <p>
        Total estimado: <span style="font-weight: bold; color: green">R${{ precoFormatado }}</span>
      </p>
      <button @click="buy" type="button" class="btn btn-primary w-100">Realizar pagamento</button>
    </div>
  </div>
</template>

<style>
.geral {
  display: flex;
  justify-content: center;
  gap: 3rem;
}

.cart {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
}

.cart-review {
  border: 1px solid rgb(219, 219, 219);
  border-radius: 5px;
  width: 300px;
  height: fit-content;
  padding: 15px;
}
</style>
