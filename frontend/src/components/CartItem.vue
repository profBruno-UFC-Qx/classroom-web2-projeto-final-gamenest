<script setup lang="ts">
import { BASE_URL } from '@/api'
import { defineProps, computed} from 'vue'

const props = defineProps<{
  Nome: string
  Preco: number
  Capa: { url: string }
  id: string | number
}>()

const emit = defineEmits(['remove'])

const precoFormatado = computed(() => props.Preco.toFixed(2))

function remover() {
    emit('remove', props.id)
}
</script>

<template>
    <div class="d-flex cart-item">
            <div class="game-cover">
                <router-link :to="`/games/${id}`"><img :src="`${BASE_URL}${Capa.url}`" :alt="`capa do jogo ${Nome}`"></router-link>
            </div>
            <div class="game-info">
                <div class="title">
                    <router-link :to="`/games/${id}`">
                        <h5>{{ Nome }}</h5>
                    </router-link>
                    <i class="bi bi-trash3 px-1" @click="remover"></i>
                </div>
                <hr>
                <p>Preço: <span style="color: green; font-weight: bold;">R${{ precoFormatado }}</span></p>
            </div>
        </div>
</template>

<style scoped>
.cart-item {
        border: 1px solid rgb(219, 219, 219);
        border-radius: 5px;
        width: 550px;
    }

    .game-cover {
        height: 100%;
        width: 20%;
    }

    .game-cover img {
        width: 100%;
        height: 100%;
        border-radius: 5px 0px 0px 5px;
    }

    .game-info {
        width: 80%;
        height: 100%;
        padding: 10px;
    }

    .title {
        display: flex;
        justify-content: space-between;
    }

    a {
        text-decoration: none;
        color: black;
    }

    .title h5{
        margin: 0;
    }

    i {
        transition: 0.2s;
    }

    i:hover {
        cursor: pointer;
        color: rgb(255, 95, 95);
    }
</style>