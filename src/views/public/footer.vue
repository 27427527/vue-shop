<script setup lang="ts">
import { ref } from "vue";
</script>

<template>
  <!-- 页脚 -->
  <footer class="bg-light py-4 mt-5">
    <div class="container">
      <div class="row">
        <div class="col-md-4 mb-3">
          <h5>ShopMall</h5>
          <p class="text-muted">为您提供优质的商品和贴心的服务</p>
        </div>
        <div class="col-md-2 mb-3">
          <h6>购物指南</h6>
          <ul class="list-unstyled">
            <li>
              <a href="#" class="text-muted text-decoration-none">购物流程</a>
            </li>
            <li>
              <a href="#" class="text-muted text-decoration-none">会员介绍</a>
            </li>
            <li>
              <a href="#" class="text-muted text-decoration-none">常见问题</a>
            </li>
          </ul>
        </div>
        <div class="col-md-2 mb-3">
          <h6>配送方式</h6>
          <ul class="list-unstyled">
            <li>
              <a href="#" class="text-muted text-decoration-none">上门自提</a>
            </li>
            <li>
              <a href="#" class="text-muted text-decoration-none">配送服务</a>
            </li>
            <li>
              <a href="#" class="text-muted text-decoration-none">配送费标准</a>
            </li>
          </ul>
        </div>
        <div class="col-md-2 mb-3">
          <h6>支付方式</h6>
          <ul class="list-unstyled">
            <li>
              <a href="#" class="text-muted text-decoration-none">货到付款</a>
            </li>
            <li>
              <a href="#" class="text-muted text-decoration-none">在线支付</a>
            </li>
            <li>
              <a href="#" class="text-muted text-decoration-none">分期付款</a>
            </li>
          </ul>
        </div>
        <div class="col-md-2 mb-3">
          <h6>售后服务</h6>
          <ul class="list-unstyled">
            <li>
              <a href="#" class="text-muted text-decoration-none">售后政策</a>
            </li>
            <li>
              <a href="#" class="text-muted text-decoration-none">退款说明</a>
            </li>
            <li>
              <a href="#" class="text-muted text-decoration-none">联系客服</a>
            </li>
          </ul>
        </div>
      </div>
      <hr />
      <div class="text-center text-muted">
        <p>&copy; 2023 ShopMall 版权所有</p>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
