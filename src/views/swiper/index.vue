<script setup lang="ts">
import { ref,computed} from "vue";

import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { useBannerStore } from "@/stores/banner"
// Import Swiper styles
import "swiper/css/bundle";
const modules = [Autoplay, EffectFade, Navigation];

const bannerstore = useBannerStore()
bannerstore.getBanners()
let swiperlist =computed(() => bannerstore.banners) 
console.log(swiperlist)

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
          ><img :src="`http://lshop/storage/${v.image}`"
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

}
</style>
