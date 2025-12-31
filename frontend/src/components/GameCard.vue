<script setup lang="ts">
import { BASE_URL } from '@/api'
import { defineProps, computed } from 'vue'

const props = defineProps<{
  Nome: string
  Preco: number
  Capa: { url: string }
  id: string | number
}>()

const precoFormatado = computed(() => props.Preco.toFixed(2))
</script>

<template>
  <div class="col-12 col-md-6 col-xl-3 mt-0 mb-4">
    <div class="card h-100" style="width: 100%">
      <router-link :to="`/games/${id}`">
        <img :src="`${BASE_URL}${Capa.url}`" class="card-img-top" :alt="`capa do jogo ${Nome}`" />
      </router-link>
      <div class="card-body d-flex flex-column">
        <h5 class="card-title mb-3">{{ Nome }}</h5>
        <div class="mt-auto w-100">
          <p class="preco-jogo mb-2">R${{ precoFormatado }}</p>
          <router-link :to="`/games/${id}`">
            <a href="#" class="btn btn-primary w-100">Ver mais</a>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
img {
  transition: 0.3s;
}

img:hover {
  filter: brightness(120%);
  cursor: pointer;
}

.preco-jogo {
  font-size: larger;
}

.card-body {
  display: flex;
  flex-direction: column;
}
</style>
