<script setup lang="ts">
import { ref, computed } from "vue";
import { useGoodStore } from "@/stores/good";

const goodstore = useGoodStore();
goodstore.getFeatured();

const good_featured = computed(() => {
  return goodstore.good_featured;
});
</script>

<template>
  <div class="container h30"></div>
  <div class="container bg-white">
    <div class="row">
      <div class="good-featured">
        <div class="title">产品推荐</div>
        <div class="text">Product</div>
      </div>
    </div>
    <!-- 产品网格 -->
    <div class="row">
      <!-- 产品卡片 1 -->

      <div
        class="col-lg-2 col-md-3 col-sm-6"
        v-for="(v, i) in good_featured"
        :key="v.good_id"
      >
        <router-link :to="'/good/details?good_id=' + v.good_id">
          <div class="thumbnail product-card">
            <div class="product-image">
              <img :src="'http://lshop/storage/' + v.image" :alt="v.name" />
              <span class="badge badge-sale">热卖</span>
            </div>
            <div class="caption">
              <p>{{ v.name }}</p>
              <p>6.1英寸超视网膜XDR显示屏，A16仿生芯片</p>
              <div class="price">
                ¥{{ v.price }}
                <span class="original-price">¥{{ v.original_price }}</span>
              </div>

              <!-- <div class="rating">
                <i class="iconfont" style="color: #ffc107">&#xe730;</i>
                <i class="iconfont" style="color: #ffc107">&#xe730;</i>
                <i class="iconfont" style="color: #ffc107">&#xe730;</i>
                <i class="iconfont" style="color: #ffc107">&#xe730;</i>
              </div>
              <div class="btn-group btn-group-justified" role="group">
                <a href="#" class="btn btn-default"
                  ><i class="iconfont">&#xe730;</i></a
                >

                <a href="#" class="btn btn-primary"
                  ><i class="iconfont">&#xe698;</i> 加入购物车</a
                >
              </div> -->
            </div>
          </div>
        </router-link>
      </div>

      <!-- 更多产品卡片... -->
      <!-- 重复上面的产品卡片结构 -->
    </div>
  </div>
</template>

<style scoped>
p {
  color: #000;
}
.good-featured {
  text-align: center;
  font-size: 28px;
  margin-bottom: 30px;
}

h4 {
  color: #000;
}
.product-card {
  margin-bottom: 30px;
  transition: all 0.3s ease;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #f55000;
}
.product-image {
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.product-image img {
  aspect-ratio: 1;
  width: 100%;
}
.price {
  color: #ff6200;
  font-size: 14px;
  font-weight: bold;
}
.original-price {
  text-decoration: line-through;
  color: #999;
  margin-left: 10px;
}
.badge-sale {
  background: #e74c3c;
  position: absolute;
  top: 10px;
  right: 10px;
}
.sidebar-category {
  margin-bottom: 20px;
}
.filter-group {
  margin-bottom: 15px;
}
.pagination {
  margin: 20px 0;
}
</style>
