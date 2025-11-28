<template>
  <!-- 商品详情内容 -->
  <div class="container my-5 bg-white">
    <div class="row">
      <div class="h59"></div>

      <!-- 商品图片区域 -->
      <div class="col-md-6">
        <Swiper :item="good.images ? good.images : []" />
      </div>
      <!-- 商品信息区域 -->
      <div class="col-md-6">
        <h1 class="product-title">{{ good.name }}</h1>
        <div class="d-flex align-items-center mb-3">
          <div class="rating-stars me-2">
            <i
              v-for="n in 5"
              :key="n"
              class="bi"
              :class="n <= product.rating ? 'bi-star-fill' : 'bi-star'"
            ></i>
          </div>
          <span class="text-muted">({{ product.reviewCount }} 条评价)</span>
        </div>

        <div class="price-section mb-4">
          <div class="d-flex align-items-center">
            <span class="discount-price me-3"
              >¥{{ goodstore.price_list[0] }}</span
            >
            <span class="original-price me-3"
              >¥{{ goodstore.price_list[1] }}</span
            >
            <span class="badge bg-danger"
              >节省 ¥{{
                (goodstore.price_list[1] - goodstore.price_list[0]).toFixed(2)
              }}</span
            >
          </div>
          <div class="mt-2">
            <span class="stock-info">
              <i class="bi bi-check-circle-fill"></i> 库存充足({{
                goodstore.price_list[2]
              }})
            </span>
          </div>
        </div>

        <div class="mb-4" v-for="(item, index) in good.attr_names">
          <h6 class="mb-2">选择{{ item.name }}:</h6>
          <div class="d-flex flex-wrap">
            <button
              v-for="(val, i) in item.attr_vals"
              :key="i"
              :disabled="dis_arr.find((item) => item === val.name)"
              class="spec-option"
              :class="{ active: selectarr.find((item) => item === val.name) }"
              @click="selectAttr(item.name, val.name)"
            >
              {{ val.name }}
            </button>
          </div>
        </div>

        <div class="mb-4">
          <h6 class="mb-2">购买数量：</h6>
          <div class="d-flex align-items-center">
            <div class="input-group quantity-selector">
              <button
                class="btn btn-outline-secondary"
                type="button"
                @click="decreaseQuantity"
              >
                -
              </button>
              <input
                type="text"
                class="form-control text-center"
                v-model="quantity"
              />
              <button
                class="btn btn-outline-secondary"
                type="button"
                @click="increaseQuantity"
              >
                +
              </button>
            </div>
            <span class="ms-3 text-muted"
              >库存 {{ goodstore.price_list[2] }} 件</span
            >
          </div>
        </div>

        <div class="delivery-info">
          <div class="d-flex align-items-center">
            <i class="bi bi-truck me-2"></i>
            <div><strong>配送信息：</strong> 预计 1-3 个工作日送达</div>
          </div>
        </div>

        <div class="mb-4">
          <div class="guarantee-badge">
            <i class="bi bi-shield-check text-success me-1"></i> 正品保证
          </div>
          <div class="guarantee-badge">
            <i class="bi bi-arrow-clockwise text-primary me-1"></i>
            7天无理由退货
          </div>
          <div class="guarantee-badge">
            <i class="bi bi-telephone text-info me-1"></i> 24小时客服
          </div>
        </div>

        <div class="action-buttons d-grid gap-2 d-md-flex">
          <button class="btn btn-primary flex-fill" @click="addToCart">
            <i class="bi bi-cart-plus"></i> 加入购物车
          </button>
          <button class="btn btn-danger flex-fill" @click="buyNow">
            <i class="bi bi-lightning"></i> 立即购买
          </button>
        </div>
      </div>
    </div>

    <div class="row">
      <!-- 商品图片区域 -->
      <div class="col-md-6">
        <!-- 商品详情标签页 -->
        <div class="product-tabs">
          <ul class="nav nav-tabs" id="productTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active"
                id="details-tab"
                data-bs-toggle="tab"
                data-bs-target="#details"
                type="button"
                role="tab"
              >
                商品详情
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="specs-tab"
                data-bs-toggle="tab"
                data-bs-target="#specs"
                type="button"
                role="tab"
              >
                规格参数
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="reviews-tab"
                data-bs-toggle="tab"
                data-bs-target="#reviews"
                type="button"
                role="tab"
              >
                用户评价
              </button>
            </li>
          </ul>
          <div
            class="tab-content p-3 border border-top-0 rounded-bottom"
            id="productTabsContent"
          >
            <div
              v-html="description"
              class="tab-pane fade show active"
              id="details"
              role="tabpanel"
            ></div>
            <div class="tab-pane fade" id="specs" role="tabpanel">
              <table class="table table-striped">
                <tbody>
                  <tr v-for="(spec, index) in good.specifications" :key="index">
                    <td style="width: 30%">{{ spec.name }}</td>

                    <td>{{ spec.value }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="tab-pane fade" id="reviews" role="tabpanel">
              <div
                class="d-flex justify-content-between align-items-center mb-4"
              >
                <h5 class="mb-0">用户评价 ({{ product.reviewCount }})</h5>
                <div class="d-flex align-items-center">
                  <span class="me-2">综合评分：</span>
                  <div class="rating-stars">
                    <i
                      v-for="n in 5"
                      :key="n"
                      class="bi"
                      :class="n <= product.rating ? 'bi-star-fill' : 'bi-star'"
                    ></i>
                  </div>
                  <span class="ms-2">{{ product.rating.toFixed(1) }}分</span>
                </div>
              </div>

              <div
                class="review-item"
                v-for="review in product.reviews"
                :key="review.id"
              >
                <div class="d-flex justify-content-between">
                  <div>
                    <strong>{{ review.user }}</strong>
                    <div class="rating-stars">
                      <i
                        v-for="n in 5"
                        :key="n"
                        class="bi"
                        :class="n <= review.rating ? 'bi-star-fill' : 'bi-star'"
                      ></i>
                    </div>
                  </div>
                  <span class="text-muted">{{ review.date }}</span>
                </div>
                <p class="mt-2 mb-1">{{ review.content }}</p>
                <div class="text-muted small">
                  颜色：{{ review.color }} | 版本：{{ review.version }}
                </div>
              </div>

              <div class="text-center mt-4">
                <button class="btn btn-outline-primary">查看更多评价</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="h59"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, watchEffect, onMounted, toRaw } from "vue";
import { useGoodStore } from "@/stores/good";
import { useCartStore } from "@/stores/cart";

import { useCart } from "@/composables/useCart.js";
import { useOrder } from "@/composables/useOrder.js";
import { useRoute, useRouter } from "vue-router";
import Swiper from "@/components/swiper.vue";
import DOMPurify from "dompurify";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";
const open = (msg) => {
  ElMessage({
    message: msg,
    grouping: true,
    type: "success",
  });
};
const userstore = useUserStore();
const auth = computed(() => userstore.auth);
const route = useRoute();
const router = useRouter();
const goodstore = useGoodStore();

const cartstore = useCartStore();

const good_id = ref(route.query.good_id);
goodstore.getGood(good_id.value);

const good = computed(() => {
  return goodstore.good_details;
});

const selectarr = computed(() => {
  let arr = [];

  for (let item of goodstore.select_list) {
    Array.prototype.push.apply(arr, item);
  }

  return arr;
});

const description = computed(() => {
  return DOMPurify.sanitize(goodstore.good_details.description);
});

const { addToCart: addcart, totalItems } = useCart();
const { addToOrder: addorder, Order } = useOrder();
cartstore.number = totalItems;
// 使用 watch 监听 good_id 的变化
watch(
  () => route.query.good_id,
  async (newId) => {
    if (newId) {
      goodstore.getGood(newId);
    } else {
      // 处理 good_id 为空的情况
    }
  }
);

// 用户选择
// 商品数据
const product = ref({
  rating: 4.5,
  reviewCount: 128,

  reviews: [
    {
      id: 1,
      user: "张三",
      rating: 5,
      date: "2023-05-15",
      content: "手表功能很强大，续航能力出色，运动数据记录准确，非常满意！",
      color: "曜石黑",
      version: "标准版",
    },
    {
      id: 2,
      user: "李四",
      rating: 4,
      date: "2023-05-10",
      content: "外观设计时尚，佩戴舒适，就是表带有点硬，希望改进。",
      color: "月光银",
      version: "运动版",
    },
    {
      id: 3,
      user: "王五",
      rating: 5,
      date: "2023-05-05",
      content: "性价比很高，功能齐全，比同价位产品好很多，推荐购买！",
      color: "深海蓝",
      version: "尊享版",
    },
  ],
});
const quantity = ref(1);
const cartCount = ref(3);
watchEffect(() => {
  if (!Number.isInteger(quantity.value)) {
    quantity.value = 1;
  }
});

const select_arr = computed(() => {
  return goodstore.select_list;
});

const dis_arr = computed(() => {
  return goodstore.dis_arr;
});

function selectAttr(name, val) {
  let i = 0;
  for (let item of goodstore.select_list) {
    if (item[0] == name) {
      goodstore.select_list[i][1] = val;
    }
    i++;
  }
  setTimeout(() => {
    selectPrice();
  }, 100);
  setTimeout(() => {
    goodstore.dis_price();
  }, 200);
}

// 选中的属性的价格库存为0的

// 选中的属性的价格
//  select_arr[index][1] == val.name
function selectPrice() {
  goodstore.good_details.attr_prices.forEach(function (item, index) {
    let flag = false;
    let i = 0;
    let obj = item.attr;

    for (let name in obj) {
      let attr_name = goodstore.select_list[i][0];
      let attr_val = goodstore.select_list[i][1];
      if (attr_name == name && attr_val == obj[name]) {
        flag = true;
      } else {
        flag = false;
        break;
      }

      i++;
    }

    if (flag == true) {
      goodstore.price_list = [item.price, item.org_price, item.stock];
    }
  });
}

// 方法
const increaseQuantity = () => {
  if (quantity.value < good.value.stock) {
    quantity.value++;
  }
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const addToCart = () => {
  let product = {
    good_id: good.value.good_id,
    name: good.value.name,
    price: goodstore.price_list[0],
    image: good.value.image,
    category: JSON.stringify(select_arr.value),
    stock: goodstore.price_list[2],
  };

  addcart(product, quantity.value);

  open(`已添加 ${quantity.value} 件商品到购物车`);
};

const buyNow = () => {
  if (!auth.value) {
    alert(`跳转登录界面`);
  } else {
    let new_good = {
      good_id: good.value.good_id,
      name: good.value.name,
      quantity: quantity.value,
      price: goodstore.price_list[0],
      image: good.value.image,
      category: select_arr.value,
      stock: goodstore.price_list[2],
    };
    console.log(new_good);
    addorder(new_good);

    router.push("/orderconfirm");
  }
};
</script>
<style scoped>
.product-image {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
.carousel-item img {
  height: 400px;
  object-fit: cover;
}
.price-section {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
}
.original-price {
  text-decoration: line-through;
  color: #6c757d;
}
.discount-price {
  color: #dc3545;
  font-size: 1.8rem;
  font-weight: bold;
}
.spec-option {
  border: 1px solid #dee2e6;
  border-radius: 5px;
  padding: 10px 15px;
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s;
}
.spec-option:hover,
.spec-option.active {
  border-color: #ff5000;
  color: #ff5000;
  background-color: rgba(13, 110, 253, 0.05);
}
.quantity-selector {
  width: 120px;
}
.action-buttons .btn {
  padding: 10px 20px;
}
.product-tabs {
  margin-top: 40px;
}

#details img {
  width: 100%;
}
.review-item {
  border-bottom: 1px solid #e9ecef;
  padding: 15px 0;
}
.review-item:last-child {
  border-bottom: none;
}
.rating-stars {
  color: #ffc107;
}
.badge-discount {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
}
.product-title {
  font-weight: 600;
  margin-bottom: 10px;
}
.stock-info {
  color: #28a745;
  font-weight: 500;
}
.delivery-info {
  background-color: #e7f3ff;
  border-radius: 5px;
  padding: 10px 15px;
  margin: 15px 0;
}
.guarantee-badge {
  display: inline-flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 20px;
  padding: 5px 15px;
  margin-right: 10px;
  margin-bottom: 10px;
  font-size: 0.9rem;
}
</style>
