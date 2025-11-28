<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useGoodStore } from "@/stores/good";
import { useRoute } from "vue-router";
const route = useRoute();
const goodstore = useGoodStore();

const good_search = computed(() => {
  return goodstore.good_search;
});
</script>

<template>
  <div class="container h30"></div>
  <div class="container bg-white">
    <div class="row">
      <!-- 面包屑导航 -->
      <div class="col-md-12">
        <ol class="breadcrumb">
          <li>
            <router-link to="/"> 首页 </router-link>
          </li>

          <li><i> /</i> 搜索结果</li>
        </ol>
      </div>
    </div>
    <!-- 产品网格 -->
    <div class="row">
      <!-- 产品卡片 1 -->

      <div
        class="col-lg-2 col-md-3 col-sm-6"
        v-for="(v, i) in good_search"
        :key="v.good_id"
      >
        <router-link :to="'/good/details?good_id=' + v.good_id">
          <div class="thumbnail product-card">
            <div class="product-image">
              <img :src="$constants.API_BASE_URL + v.image" :alt="v.name" />
              <span class="badge badge-sale">热卖</span>
            </div>
            <div class="caption">
              <p>{{ v.name }}</p>
              <p>{{ v.intro }}</p>
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

.breadcrumb {
  padding: 15px;
  margin-bottom: 15px;
  list-style: none;
  background-color: @breadcrumb-bg;
  border-radius: @border-radius-base;
  border-bottom: 1px solid #ececec;
}

.breadcrumb li {
  display: inline-block;
  margin-right: 15px;
  color: #337ab7;
}
.breadcrumb a {
  color: #337ab7;
}
.breadcrumb i {
  color: #ccc;
  margin-right: 5px;
}

.breadcrumb .active {
  color: @breadcrumb-active-color;
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
  max-width: 100%;
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
