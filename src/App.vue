<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from "./views/public/header.vue";
import Footer from "./views/public/footer.vue";
</script>

<template>

 <Header></Header>


  <RouterView />

  <Footer></Footer>
</template>

<style scoped>

</style>
