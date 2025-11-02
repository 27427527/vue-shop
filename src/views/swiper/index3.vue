<script setup lang="ts">
import { ref } from "vue";

import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css/bundle";
const modules = [Autoplay, EffectFade, Navigation];
let swiperlist = ref([
  { id: 1, img_url: "banner1.jpg" },
  { id: 2, img_url: "banner2.jpg" },
  { id: 3, img_url: "banner3.jpg" },
]);

let state = ref(true);
</script>

<template>
  <div id="swiper" @mouseover="state = true" @mouseleave="state = false">
    <div class="swiper-content">
      <swiper
        :modules="modules"
        :slides-per-view="1"
        :loop="true"
        :autoplay="{
          delay: 3000,
        }"
        :Navigation="{
          nextEl: 'swiper-button-next',
          prevEl: 'swiper-button-prev',
        }"
      >
        <swiper-slide v-for="(v, i) in swiperlist" :key="i"
          ><img :src="`/src/assets/image/${v.img_url}`"
        /></swiper-slide>
      </swiper>

      <div class="swiper-button-prev" v-show="state"></div>
      <div class="swiper-button-next" v-show="state"></div>
    </div>
  </div>
</template>

<style scoped>
.swiper-container {
  width: 100%;
  height: 400px;
}
</style>
