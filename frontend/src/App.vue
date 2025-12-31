<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'

const route = useRoute();
</script>

<template>
  <div>
    <NavBar v-if="route.name !== 'loginPage' && route.name !== 'registerPage'" />
    <!-- <NavBar/> -->
    <RouterView />
    <Footer />
  </div>
</template>

<style>
</style>