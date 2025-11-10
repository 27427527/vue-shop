<template>
  <div class="card">
    <div class="card-header bg-primary text-white">
      <h5 class="card-title mb-0"><i class="bi bi-cart3"></i> 购物车摘要</h5>
    </div>
    <div class="card-body">
      <!-- 商品统计 -->
      <div class="d-flex justify-content-between mb-3">
        <span>商品数量:</span>
        <strong>{{ totalItems }} 件</strong>
      </div>

      <!-- 小计 -->
      <div class="d-flex justify-content-between mb-3">
        <span>商品小计:</span>
        <strong>¥{{ totalPrice.toFixed(2) }}</strong>
      </div>

      <!-- 运费 -->
      <div class="d-flex justify-content-between mb-3">
        <span>运费:</span>
        <strong v-if="totalPrice > 0">¥{{ shippingCost.toFixed(2) }}</strong>
        <strong v-else class="text-muted">-</strong>
      </div>

      <hr />

      <!-- 总计 -->
      <div class="d-flex justify-content-between mb-4">
        <span class="h5">总计:</span>
        <span class="h5 text-primary">¥{{ grandTotal.toFixed(2) }}</span>
      </div>

      <!-- 操作按钮 -->
      <div class="d-grid gap-2">
        <button
          class="btn btn-success btn-lg"
          :disabled="totalItems === 0"
          @click="checkout"
        >
          <i class="bi bi-bag-check"></i> 立即结算
        </button>

        <button
          class="btn btn-outline-secondary"
          :disabled="totalItems === 0"
          @click="clearCart"
        >
          <i class="bi bi-trash"></i> 清空购物车
        </button>

        <button class="btn btn-outline-primary" @click="continueShopping">
          <i class="bi bi-arrow-left"></i> 继续购物
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps({
  totalItems: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["checkout", "clear-cart", "continue-shopping"]);

// 运费计算（满100免运费）
const shippingCost = computed(() => {
  return props.totalPrice >= 100 || props.totalPrice === 0 ? 0 : 10;
});

// 总金额
const grandTotal = computed(() => {
  return props.totalPrice + shippingCost.value;
});

const checkout = () => {
  emit("checkout");
};

const clearCart = () => {
  emit("clear-cart");
};

const continueShopping = () => {
  emit("continue-shopping");
  router.push("/index");
};
</script>

<style scoped>
.card {
  position: sticky;
  top: 20px;
}

.btn:disabled {
  cursor: not-allowed;
}
</style>
