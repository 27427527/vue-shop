<template>
  <Swiper />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import Swiper from "@/components/swiper.vue";
import { Carousel } from "bootstrap";

const slides = ref([
  {
    image: "https://picsum.photos/800/400?random=1",
    title: "美丽的风景",
    description: "大自然的壮丽景色",
  },
  {
    image: "https://picsum.photos/800/400?random=2",
    title: "城市风光",
    description: "现代都市的繁华景象",
  },
  {
    image: "https://picsum.photos/800/400?random=3",
    title: "海滩日落",
    description: "浪漫的海边黄昏",
  },
]);
</script>

<style scoped>
.carousel-item img {
  height: 400px;
  object-fit: cover;
}
</style>
