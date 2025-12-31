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

const emit = defineEmits(['delete'])

function deleteGame() {
  emit('delete', props.id)
}
</script>

<template>
  <tr>
    <th scope="row">{{ id }}</th>
    <td>
      <router-link :to="`/games/${id}`"
        ><img v-if="Capa && Capa.url" :src="`${BASE_URL}${Capa.url}`" :alt="`capa do jogo ${Nome}`"
      /></router-link>
    </td>
    <td>
      <router-link :to="`/games/${id}`">{{ Nome }}</router-link>
    </td>
    <td>
      <span style="font-weight: bold; color: green">R${{ precoFormatado }}</span>
    </td>
    <td>
      <router-link :to="`/games/edit/${id}`">
        <i class="bi bi-pencil-square edit fs-5"></i>
      </router-link>
      <i class="bi bi-trash3 px-1 delete fs-5" @click="deleteGame"></i>
    </td>
  </tr>
</template>

<style scoped>
img {
  width: 50px;
  border-radius: 5px;
}
.edit {
  color: #007bff;
  cursor: pointer;
}
.delete {
  color: #dc3545;
  cursor: pointer;
}

a {
  text-decoration: none;
  color: inherit;
}

a:hover {
  color: rgb(69, 108, 238);
  text-decoration: underline;
}
</style>
