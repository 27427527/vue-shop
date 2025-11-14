<template>
  <div class="card mb-3">
    <div class="card-body">
      <div class="row align-items-center">
        <!-- 商品图片 -->
        <div class="col-md-2">
          <img :src="item.image" :alt="item.name" class="img-fluid rounded" />
        </div>

        <!-- 商品信息 -->
        <div class="col-md-4">
          <h5 class="card-title mb-1">{{ item.name }}</h5>
          <p class="text-muted mb-0">{{ item.spec }}</p>
          <p class="text-success mb-0">库存: {{ item.stock }}</p>
        </div>

        <!-- 数量控制 -->
        <div class="col-md-3">
          <div class="input-group input-group-sm">
            <button
              class="btn btn-outline-secondary"
              type="button"
              :disabled="item.quantity <= 1"
              @click="updateQuantity(item.quantity - 1)"
            >
              -
            </button>
            <input
              type="number"
              class="form-control text-center"
              v-model.number="item.quantity"
              @change="handleQuantityChange"
              :max="item.stock"
              min="1"
            />
            <button
              class="btn btn-outline-secondary"
              type="button"
              :disabled="item.quantity >= item.stock"
              @click="updateQuantity(item.quantity + 1)"
            >
              +
            </button>
          </div>
        </div>

        <!-- 价格 -->
        <div class="col-md-2 text-center">
          <h5 class="text-primary">
            ¥{{ (item.price * item.quantity).toFixed(2) }}
          </h5>
          <small class="text-muted">单价: ¥{{ item.price }}</small>
        </div>

        <!-- 删除按钮 -->
        <div class="col-md-1 text-end">
          <button class="btn btn-outline-danger btn-sm" @click="removeItem">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
function isEmpty(value) {
  // 检查 null 和 undefined
  if (value == null) return true;

  // 检查数字
  if (typeof value === "number") return value === 0 || isNaN(value);

  // 检查布尔值
  if (typeof value === "boolean") return false;

  // 检查字符串
  if (typeof value === "string") return value.trim() === "";

  // 检查数组
  if (Array.isArray(value)) return value.length === 0;

  // 检查对象
  if (typeof value === "object") return Object.keys(value).length === 0;

  return false;
}

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update-quantity", "remove-item"]);

const updateQuantity = (newQuantity) => {
  if (newQuantity >= 1 && newQuantity <= props.item.stock) {
    emit("update-quantity", props.item.good_id, newQuantity);
  }
};

const handleQuantityChange = (event) => {
  const newQuantity = parseInt(event.target.value);
  if (!isNaN(newQuantity)) {
    updateQuantity(newQuantity);
  }
};

const removeItem = () => {
  emit("remove-item", props.item.good_id);
};
</script>

<style scoped>
.card {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.input-group {
  width: 120px;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}
</style>
