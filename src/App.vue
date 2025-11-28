<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import Header from "./views/public/header.vue";
import Message from "@/components/Message.vue";

import Footer from "./views/public/footer.vue";
</script>

<template>
  <Header></Header>
  <Message />

  <RouterView />

  <Footer></Footer>
</template>

<style scoped></style>
