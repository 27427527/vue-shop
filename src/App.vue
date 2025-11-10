<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import Header from "./views/public/header.vue";
import Swiper from "./views/swiper/index.vue";
import Footer from "./views/public/footer.vue";
</script>

<template>
  <Header></Header>
  <Swiper />
  <RouterView />

  <Footer></Footer>
</template>

<style scoped></style>
