<template>
  <div class="order-container">
    <!-- 页面标题 -->
    <div class="order-header">
      <h1>订单确认</h1>
      <p>请确认您的订单信息，确认无误后提交订单</p>
    </div>

    <!-- 步骤指示器 -->
    <el-steps :active="2" align-center class="order-steps">
      <el-step title="购物车" description="选择商品"></el-step>
      <el-step title="确认订单" description="核对信息"></el-step>
      <el-step title="支付" description="完成支付"></el-step>
      <el-step title="完成" description="订单完成"></el-step>
    </el-steps>

    <div class="order-content">
      <!-- 主要内容区域 -->
      <div class="order-main">
        <!-- 商品信息 -->
        <div class="section">
          <div class="section-title">
            <el-icon><ShoppingCart /></el-icon>
            商品信息
          </div>
          <div class="product-list">
            <div class="product-item" v-for="item in products" :key="item.id">
              <div class="product-image">
                <img :src="item.image" :alt="item.name" />
              </div>
              <div class="product-info">
                <div class="product-name">{{ item.name }}</div>
                <div class="product-spec">{{ item.spec }}</div>
                <div class="product-price">¥{{ item.price }}</div>
              </div>
              <div class="product-quantity">x{{ item.quantity }}</div>
            </div>
          </div>
        </div>

        <!-- 收货地址 -->
        <Address @sendaddress="getaddress"></Address>
      </div>
      <!-- 侧边栏 - 订单总结 -->
      <div class="order-sidebar">
        <div class="section">
          <div class="section-title">
            <el-icon><Document /></el-icon>
            订单总结
          </div>
          <div class="order-summary">
            <div class="order-summary-item">
              <span>商品总价</span>
              <span>¥{{ totalPrice }}</span>
            </div>
            <div class="order-summary-item">
              <span>运费</span>
              <span v-if="shippingFee === 0">免费</span>
              <span v-else>¥{{ shippingFee }}</span>
            </div>
            <div class="order-summary-item">
              <span>优惠券</span>
              <span>-¥{{ discount }}</span>
            </div>
            <div class="order-summary-item order-total">
              <span>实付款</span>
              <span>¥{{ actualPayment }}</span>
            </div>
          </div>

          <div class="order-actions">
            <el-button @click="goBack" size="large">返回购物车</el-button>
            <el-button type="primary" @click="submitOrder" size="large"
              >提交订单</el-button
            >
          </div>
        </div>

        <!-- 支付方式 -->
        <div class="section">
          <div class="section-title">
            <el-icon><Wallet /></el-icon>
            支付方式
          </div>
          <div class="payment-list">
            <div
              class="payment-item"
              v-for="payment in payments"
              :key="payment.id"
              :class="{ active: selectedPayment === payment.id }"
              @click="selectPayment(payment.id)"
            >
              <div class="payment-icon">
                <img :src="payment.image" />
              </div>
              <div class="payment-info">
                <div class="payment-name">{{ payment.name }}</div>
                <div class="payment-desc">{{ payment.desc }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 订单备注 -->
        <div class="section">
          <div class="section-title">
            <el-icon><Edit /></el-icon>
            订单备注
          </div>
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入订单备注（选填）"
            v-model="orderNote"
            maxlength="100"
            show-word-limit
          ></el-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits } from "vue";
import {
  ElMessage,
  ElMessageBox,
  ElSteps,
  ElStep,
  ElButton,
  ElInput,
  ElLoading,
} from "element-plus";
import {
  ShoppingCart,
  Location,
  Wallet,
  Edit,
  Document,
  Plus,
} from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import { useCart } from "@/composables/useCart.js";
import { useOrder } from "@/composables/useOrder.js";

import { useUserStore } from "@/stores/user";
import Address from "@/components/Address.vue";
import Api from "@/services/api.ts";
const route = useRoute();
const router = useRouter();
const { clearCart: clearCartComposable, cartItems } = useCart();
const { addToOrder: addorder, clearToOrder: clearorder, Order } = useOrder();

const userstore = useUserStore();
const loading = ref(false);
const from = route.query.from;

// 获取选中的地址id
const getaddress = (id) => {
  selectedAddress.value = id;
  console.log(selectedAddress.value);
};
const products = ref("");

if (from == "cart") {
  // 商品数据
  products.value = cartItems.value;
} else {
  // 商品数据
  products.value = [Order.value];
}

// 支付方式数据
const payments = ref([
  {
    id: 1,
    name: "支付宝",
    desc: "推荐支付宝用户使用",
    image: "./src/assets/image/zfb.png",
  },
  {
    id: 2,
    name: "微信支付",
    desc: "推荐微信用户使用",
    image: "./src/assets/image/wx.png",
  },
]);

// 选中的地址
const selectedAddress = ref("");

// 选中的支付方式
const selectedPayment = ref(1);

// 订单备注
const orderNote = ref("");

// 运费
const shippingFee = ref(0);

// 优惠金额
const discount = ref(0);

// 选择支付方式
const selectPayment = (id) => {
  selectedPayment.value = id;
};

// 计算商品总价
const totalPrice = computed(() => {
  return products.value.reduce((sum, product) => {
    return sum + product.price * product.quantity;
  }, 0);
});

// 计算实付款
const actualPayment = computed(() => {
  return totalPrice.value + shippingFee.value - discount.value;
});

// 返回购物车
const goBack = () => {
  ElMessage.info("返回购物车功能");
};

// 发送订单数据
async function creatOrder(order) {
  let loading = ElLoading.service();

  let rs = "";
  await Api.post("/orders", order)
    .then((response) => {
      // 请求成功处理
      if (from == "cart") {
        clearCartComposable();
      }
      ElMessage.success("订单提交成功！");
      rs = response.data;
    })
    .catch((error) => {
      // 错误处理

      ElMessage.error("提交订单失败");
    })
    .finally(() => {
      // 无论成功失败都会执行
      loading.close();
    });
}
// 提交订单
const submitOrder = () => {
  if (!selectedAddress.value) {
    ElMessage.warning("请选择收货地址");
    return;
  }

  if (!selectedPayment.value) {
    ElMessage.warning("请选择支付方式");
    return;
  }

  ElMessageBox.confirm("确认提交订单吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      let data = {
        items: products.value,
        address: selectedAddress.value,
        remark: orderNote.value,
        payment_method: selectedPayment.value,
      };

      creatOrder(data);
    })
    .catch(() => {
      ElMessage.info("已取消提交");
    });
};
</script>

<style scoped>
.order-container {
  max-width: 1320px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.order-header {
  text-align: center;
  padding: 30px 20px;
  background: linear-gradient(135deg, #409eff 0%, #67c23a 100%);
  color: white;
}

.order-header h1 {
  font-size: 28px;
  margin-bottom: 10px;
}

.order-header p {
  opacity: 0.9;
}

.order-steps {
  padding: 30px 20px;
  background: #f8f9fa;
}

.order-content {
  display: flex;
  padding: 20px;
  gap: 20px;
}

.order-main {
  flex: 1;
  min-width: 0;
}

.order-sidebar {
  width: 350px;
}

.section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #ebeef5;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.product-item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #ebeef5;
}

.product-item:last-child {
  border-bottom: none;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 15px;
  background: #f5f7fa;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
}

.product-name {
  font-weight: 500;
  margin-bottom: 5px;
}

.product-spec {
  color: #909399;
  font-size: 14px;
  margin-bottom: 5px;
}

.product-price {
  color: #f56c6c;
  font-weight: 600;
}

.product-quantity {
  color: #606266;
  font-weight: 500;
}

.payment-item {
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s;
}

.payment-item:hover {
  border-color: #409eff;
}

.payment-item.active {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.payment-icon {
  width: 40px;
  height: 40px;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 4px;
  color: #409eff;
}

.payment-info {
  flex: 1;
}

.payment-name {
  font-weight: 500;
  margin-bottom: 5px;
}

.payment-desc {
  color: #909399;
  font-size: 14px;
}

.order-summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 5px 0;
}

.order-total {
  border-top: 1px solid #ebeef5;
  padding-top: 15px;
  margin-top: 15px;
  font-size: 18px;
  font-weight: 600;
  color: #f56c6c;
}

.order-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.order-actions .el-button {
  flex: 1;
}

@media (max-width: 768px) {
  .order-content {
    flex-direction: column;
  }

  .order-sidebar {
    width: 100%;
  }

  .order-actions {
    flex-direction: column;
  }
}
</style>
