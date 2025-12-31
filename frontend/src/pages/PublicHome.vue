<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '@/api'
import GameCard from '@/components/GameCard.vue'
import type { Game } from '@/types'

const jogos = ref([] as Game[])

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
</script>

<template>
  <h1 class="container text-center my-3 my-xl-5">Jogos em Destaque</h1>
  <div class="container row mx-auto g-4 my-4">
    <GameCard
      v-for="jogo in jogos"
      :Nome="jogo.Nome"
      :Preco="jogo.Preco"
      :Capa="jogo.Capa"
      :id="jogo.id"
    />
  </div>
</template>
