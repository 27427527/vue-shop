<template>
  <div class="carousel-container">
    <div id="vueCarousel" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators">
        <button
          v-for="(slide, index) in good.images"
          :key="index"
          type="button"
          :data-bs-target="'#vueCarousel'"
          :data-bs-slide-to="index"
          :class="{ active: currentIndex === index }"
          @click="currentIndex = index"
        ></button>
      </div>

      <div class="carousel-inner">
        <div
          v-for="(slide, index) in good.images"
          :key="index"
          class="carousel-item"
          :class="{ active: currentIndex === index }"
        >
          <img :src="'http://lshop/storage/' + slide" class="d-block w-100" />
          <div class="carousel-caption"></div>
        </div>
      </div>

      <button class="carousel-control-prev" type="button" @click="prevSlide">
        <span class="carousel-control-prev-icon"></span>
      </button>
      <button class="carousel-control-next" type="button" @click="nextSlide">
        <span class="carousel-control-next-icon"></span>
      </button>
    </div>

    <!-- 缩略图 -->
    <div class="row mt-3">
      <div v-for="(image, index) in good.images" :key="index" class="col-3">
        <img
          :src="'http://lshop/storage/' + image"
          class="img-thumbnail"
          :class="{ active: index === 0 }"
          style="cursor: pointer; height: 80px; object-fit: cover"
          @click="goToSlide(index)"
        />
      </div>
    </div>

    <!-- <div class="text-center mt-3">
      <button class="btn btn-primary me-2" @click="prevSlide">上一张</button>
      <button class="btn btn-primary me-2" @click="nextSlide">下一张</button>
      <button
        v-for="(slide, index) in slides"
        :key="index"
        class="btn btn-outline-primary me-1"
        @click="goToSlide(index)"
      >
        {{ index + 1 }}
      </button>
    </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useGoodStore } from "@/stores/good";
const goodstore = useGoodStore();

const good = computed(() => {
  return goodstore.good_details;
});

import { Carousel } from "bootstrap";

const currentIndex = ref(0);

let carousel = null;

onMounted(() => {
  const element = document.getElementById("vueCarousel");
  if (element) {
    carousel = new Carousel(element, {
      interval: 3000,
      wrap: true,
    });

    // 监听幻灯片变化
    element.addEventListener("slid.bs.carousel", (event) => {
      currentIndex.value = event.to;
    });
  }
});

const nextSlide = () => {
  if (carousel) {
    carousel.next();
  }
};

const prevSlide = () => {
  if (carousel) {
    carousel.prev();
  }
};

const goToSlide = (index) => {
  if (carousel) {
    carousel.to(index);
    currentIndex.value = index;
  }
};

onUnmounted(() => {
  if (carousel) {
    carousel.dispose();
  }
});
</script>

<style scoped>
.carousel-item img {
  object-fit: cover;
  height: 100%;
}
</style>
