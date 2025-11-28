<script setup lang="ts">
import { ref, computed } from "vue";
import {
  ElMessage,
  ElMessageBox,
  ElSteps,
  ElStep,
  ElButton,
  ElInput,
  ElLoading,
  ElTable,
} from "element-plus";
import { useOrderStore } from "@/stores/order";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
const orderstore = useOrderStore();
orderstore.getOrderlist();

const order_list = computed(() => {
  return orderstore.order_list;
});

// 统计待付款订单
const pendingCount = computed(() => {
  return order_list.value.filter((order) => order.status === "pending").length;
});

// 统计已发货订单
const shippedCount = computed(() => {
  return order_list.value.filter((order) => order.status === "shipped").length;
});

// 已支付
const paidCount = computed(() => {
  return order_list.value.filter((order) => order.status === "paid").length;
});

// 已完成
const completedCount = computed(() => {
  return order_list.value.filter((order) => order.status === "completed")
    .length;
});

// 已退款
const cancelledCount = computed(() => {
  return order_list.value.filter((order) => order.status === "cancelled")
    .length;
});

// 退款中
const cancelingCount = computed(() => {
  return order_list.value.filter((order) => order.status === "canceling")
    .length;
});
const setAddress = (status) => {};

// 获取订单状态文本
const getStatusText = (status) => {
  const statusMap = {
    pending: "待付款",
    shipped: "已发货",
    completed: "已完成",
    paid: "已支付",
    cancelled: "已退款",
    canceling: "退款中",
  };
  return statusMap[status] || "未知状态";
};
</script>

<template>
  <!-- 统计卡片 -->
  <div class="stats-cards">
    <div class="stat-card">
      <div class="value">{{ order_list.length }}</div>
      <div class="label">全部订单</div>
    </div>
    <div class="stat-card">
      <div class="value">{{ pendingCount }}</div>
      <div class="label">待付款</div>
    </div>
    <div class="stat-card">
      <div class="value">{{ shippedCount }}</div>
      <div class="label">待收货</div>
    </div>
    <div class="stat-card">
      <div class="value">{{ cancelingCount }}</div>
      <div class="label">售后/退款</div>
    </div>
  </div>

  <!-- 最近订单 -->
  <h3 class="section-title">最近订单</h3>
  <div class="order-list">
    <div v-if="order_list.length === 0" class="empty-state">
      <div class="icon">📦</div>
      <p>暂无订单记录</p>
      <el-button type="primary" size="small" style="margin-top: 10px"
        >去购物</el-button
      >
    </div>

    <table
      v-else
      width="100%"
      cellspacing="0"
      cellpadding="0"
      class="layui-table"
    >
      <tbody>
        <tr>
          <th>订单信息</th>

          <th>金额</th>
          <th class="min-hide">状态</th>
          <th>操作</th>
        </tr>
        <tr v-for="order in order_list" :key="order.order_id" class="order-tr">
          <td>
            <p>
              {{ $formatDate(order.created_at) }}
              订单号:{{ order.order_no }}
            </p>
            <p>收货人:{{ order.name + " " + order.phone }}</p>

            <div class="order-details" v-for="item in order.items">
              <div class="item-img">
                <img
                  :src="$constants.API_BASE_URL + item.image"
                  :alt="item.good_name"
                  class="order-img"
                />
              </div>
              <div class="item-details">
                <h5>{{ item.good_name }}</h5>
                <p>{{ item.good_price }}</p>
                <p>x{{ item.quantity }}</p>
              </div>
            </div>
          </td>

          <td>
            {{ order.pay_amount }}
          </td>

          <td class="min-hide">
            <span :class="['order-status', `status-${order.status}`]">
              {{ getStatusText(order.status) }}
            </span>
          </td>

          <td>
            <el-button @click="setAddress()" link type="success"
              >确认收货</el-button
            >

            <el-button @click="setAddress()" link type="success"
              >去付款</el-button
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.item-img {
  width: 70px;
}

.item-details {
  flex: 1;
}
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}
.stat-card {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
}
.stat-card .value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 10px;
}
.stat-card .label {
  color: #909399;
  font-size: 14px;
}
.section-title {
  font-size: 18px;
  margin: 20px 0 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e6e8eb;
  color: #303133;
}
.order-list {
  margin-top: 15px;
}
.order-tr {
  border-bottom: 1px solid #ececec;
}
.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #e6e8eb;
}
.order-item:last-child {
  border-bottom: none;
}
.order-info {
  display: flex;
  align-items: center;
}
.order-img {
  width: 70px;
  height: 70px;
  border-radius: 4px;
  margin-right: 15px;
  object-fit: cover;
}
.order-details {
  display: flex;
  gap: 20px;
  padding-bottom: 20px;
}

.item-details p {
  margin: 0;
  font-size: 14px;
  color: #ccc;
}
.order-name {
  font-weight: 500;
  margin-bottom: 5px;
}
.order-price {
  color: #f56c6c;
  font-weight: bold;
}
.order-status {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
}
.status-pending {
  background: #fdf6ec;
  color: #e6a23c;
}
.status-shipped {
  background: #f0f9ff;
  color: #409eff;
}
.status-completed {
  background: #f0f9f4;
  color: #67c23a;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #909399;
}
.empty-state .icon {
  font-size: 48px;
  margin-bottom: 15px;
  color: #c0c4cc;
}
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
  }
  .stats-cards {
    grid-template-columns: 1fr 1fr;
  }
  .min-hide {
    display: none;
  }
}
@media (max-width: 480px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
  .address-list {
    grid-template-columns: 1fr;
  }
}
</style>
