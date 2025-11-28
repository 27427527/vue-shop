<script setup lang="ts">
import { ref, computed } from "vue";
import { useBannerStore } from "@/stores/banner";

const bannerstore = useBannerStore();

let swiperlist = computed(() => bannerstore.banners);

let state = ref(true);
</script>

<template>
  <div class="container h30"></div>

  <div class="w1320">
    <el-carousel height="400px" :autoplay="true" :loop="true">
      <el-carousel-item v-for="item in swiperlist">
        <img :src="$constants.API_BASE_URL + item.image" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<style scoped>
.el-carousel__item {
  width: 100%;
  height: 100%;
}

.el-carousel__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
