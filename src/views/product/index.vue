<script setup lang="ts">
import {ref} from 'vue'
let productlist=ref([
    {
        name:'纺织面料',
        img:'g1.jpg',
        des:'红色',
    },
    {
        name:'纺织面料',
        img:'g2.jpg',
        des:'红色',
    },
    {
        name:'纺织面料',
        img:'g3.jpg',
        des:'红色',
    },
    {
        name:'纺织面料',
        img:'g4.jpg',
        des:'红色',
    },
    {
        name:'纺织面料',
        img:'g5.jpg',
        des:'红色',
    },
    {
        name:'纺织面料',
        img:'g6.jpg',
        des:'红色',
    },
    {
        name:'纺织面料',
        img:'g7.jpg',
        des:'红色',
    },
    {
        name:'纺织面料',
        img:'g8.jpg',
        des:'红色',
    },
])
</script>

<template>
    <div class="product w">
        <div class="title">产品推荐</div>
        <div class="text">Product</div>
        <div class="product-content">
            <ul>
                <li v-for="(v,i) in productlist" :key="i">
                    <div class="product-img">
                        <img :src="`/src/assets/image/${v.img}`" :alt="v.name">
                    </div>
                     <div class="product-title">
                       <h4>{{v.name+(i+1)}}</h4>
                       <p>{{v.des}}</p>
                    </div>
                </li>
            </ul>
        </div>
        
    </div>
 
</template>

<style scoped>
/* 产品推荐 */
.product {
  text-align: center;
  margin-bottom: 50px;
}

.title {
  font-size: 30px;
  letter-spacing: 5px;
  margin-top: 20px;
}

.text {
  margin-top: 20px;
}

.product-content ul {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
}

.product-content ul li {
  width: calc(100% / 4 - 10px);
  height: 100%;
  margin-top: 20px;
  position: relative;
}

.product-img {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
}

.product-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s;
}

.product-img img:hover {
  scale: 1.2;
}

.product-title {
  padding: 7px;
  text-align: center;
}

.product-title h4 {
  font-weight: 600;
  margin: 5px 0;
  font-size: 16px;
}
</style>