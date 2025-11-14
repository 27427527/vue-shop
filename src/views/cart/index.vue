<template>
  <div class="h59"></div>
  <div class="container bg-light min-vh-100">
    <div class="container py-4">
      <div class="row">
        <!-- 商品列表 -->
        <div class="col-lg-8">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">
              <i class="bi bi-cart3 text-primary"></i> 购物车
              <span v-if="totalItems > 0" class="badge bg-primary ms-2"
                >{{ totalItems }} 件商品</span
              >
            </h2>

            <button
              v-if="cartItems.length > 0"
              class="btn btn-outline-danger btn-sm"
              @click="clearCart"
            >
              <i class="bi bi-trash"></i> 清空购物车
            </button>
          </div>

          <!-- 空购物车状态 -->
          <div v-if="cartItems.length === 0" class="text-center py-5">
            <div class="mb-4">
              <i class="bi bi-cart-x display-1 text-muted"></i>
            </div>
            <h3 class="text-muted mb-3">购物车为空</h3>
            <p class="text-muted mb-4">快去挑选一些心仪的商品吧！</p>
            <button
              class="btn btn-primary btn-lg"
              @click="showProductList = true"
            >
              <i class="bi bi-bag-plus"></i> 去购物
            </button>
          </div>

          <!-- 购物车商品列表 -->
          <div v-else>
            <CartItem
              v-for="item in cartItems"
              :key="item.good_id"
              :item="item"
              @update-quantity="updateQuantity"
              @remove-item="removeFromCart"
            />
          </div>

          <!-- 推荐商品 -->
          <div v-if="showProductList || cartItems.length === 0" class="mt-5">
            <h4 class="mb-4">推荐商品</h4>
            <div class="row">
              <div
                v-for="product in goodstore.good_featured"
                :key="product.good_id"
                class="col-md-6 col-lg-3 mb-4"
              >
                <div class="card h-100 product-card">
                  <router-link :to="'/good/details?good_id=' + product.good_id">
                    <img
                      :src="'http://lshop/storage/' + product.image"
                      :alt="product.name"
                      class="card-img-top"
                      style="height: 200px; object-fit: cover"
                    />

                    <div class="card-body d-flex flex-column">
                      <h6 class="card-title">{{ product.name }}</h6>
                      <p class="card-text text-muted small">
                        {{ product.intro }}
                      </p>
                      <div class="mt-auto">
                        <div
                          class="d-flex justify-content-between align-items-center mb-2"
                        >
                          <span class="h5 text-primary mb-0"
                            >¥{{ product.price }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 购物车摘要 -->
        <div class="col-lg-4">
          <CartSummary
            :total-items="totalItems"
            :total-price="totalPrice"
            @checkout="handleCheckout"
            @clear-cart="clearCart"
            @continue-shopping="showProductList = true"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- 结算确认模态框 -->
  <div class="modal fade" id="checkoutModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">订单确认</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <p>确认要结算吗？</p>
          <div class="alert alert-info">
            <strong>订单总金额: ¥{{ grandTotal.toFixed(2) }}</strong
            ><br />
            <small>包含 {{ totalItems }} 件商品</small>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="confirmCheckout"
          >
            确认结算
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCart } from "@/composables/useCart.js";
import { Modal } from "bootstrap";
import CartItem from "@/components/CartItem.vue";
import CartSummary from "@/components/CartSummary.vue";
import { useCartStore } from "@/stores/cart";
import { useGoodStore } from "@/stores/good";
const cartstore = useCartStore();
const goodstore = useGoodStore();
const router = useRouter();
goodstore.getFeatured();

const {
  cartItems,
  addToCart,
  removeFromCart,
  updateQuantity,
  totalPrice,
  totalItems,
  clearCart: clearCartComposable,
  isInCart,
  getCartQuantity,
} = useCart();
cartstore.number = totalItems;
const showProductList = ref(true);

// 计算总金额（包含运费）
const grandTotal = computed(() => {
  const shipping = totalPrice.value >= 100 || totalPrice.value === 0 ? 0 : 10;
  return totalPrice.value + shipping;
});

// 处理结算
const handleCheckout = () => {
  router.push("/orderconfirm?from=cart");
};

// 确认结算
const confirmCheckout = () => {
  alert(`结算成功！总金额: $${grandTotal.value.toFixed(2)}`);
  clearCartComposable();
  const modal = Modal.getInstance(document.getElementById("checkoutModal"));
  modal.hide();
};

// 清空购物车
const clearCart = () => {
  if (confirm("确定要清空购物车吗？")) {
    clearCartComposable();
  }
};

onMounted(() => {
  // 可以在这里初始化一些数据
});
</script>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
}

.product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.navbar-brand {
  font-size: 1.5rem;
}

.badge {
  font-size: 0.7rem;
}
</style>
