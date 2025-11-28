<template>
  <div class="h59"></div>
  <div class="user-center-container">
    <!-- 用户头部信息 -->

    <div class="user-profile"></div>

    <div class="user-header">
      <div class="user-info">
        <AvatarCropper />

        <div class="user-details">
          <h2>{{ users.name }}</h2>

          <p>
            邮箱账号:
            {{ users.email }}
          </p>
          <p>
            会员等级: 1 | 注册时间:
            {{ $formatDate(users.created_at) }}
          </p>
        </div>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="main-content">
      <!-- 侧边栏 -->
      <div class="sidebar">
        <el-menu class="el-menu-vertical-demo">
          <el-menu-item index="1">
            <router-link
              class="nav-link"
              to="/user/info"
              active-class="is-active"
            >
              <el-icon><User /></el-icon>
              <span>个人信息</span></router-link
            >
          </el-menu-item>

          <el-menu-item index="2">
            <router-link
              class="nav-link"
              to="/user/order"
              active-class="is-active"
            >
              <el-icon><ShoppingBag /></el-icon>
              <span>我的订单</span></router-link
            >
          </el-menu-item>

          <el-menu-item index="3">
            <router-link
              class="nav-link"
              to="/user/address"
              active-class="is-active"
            >
              <el-icon><Location /></el-icon>地址管理</router-link
            >
          </el-menu-item>
          <!-- <el-menu-item index="4">
            <el-icon><Star /></el-icon>
            <span>我的收藏</span>
          </el-menu-item>
          <el-menu-item index="5">
            <el-icon><Ticket /></el-icon>
            <span>优惠券</span>
          </el-menu-item>
          <el-menu-item index="6">
            <el-icon><Wallet /></el-icon>
            <span>账户余额</span>
          </el-menu-item> -->

          <!-- <el-menu-item index="7">
            <el-icon><ChatDotRound /></el-icon>
            <span>消息中心</span>
          </el-menu-item> -->
        </el-menu>
      </div>

      <!-- 内容区 -->
      <div class="content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from "vue";
import {
  User,
  ShoppingBag,
  Location,
  Star,
  Ticket,
  Wallet,
  ChatDotRound,
} from "@element-plus/icons-vue";
import { RouterLink, RouterView } from "vue-router";
import { useUserStore } from "@/stores/user";

const userstore = useUserStore();

const users = computed(() => {
  return userstore.users;
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei",
    sans-serif;

  color: #333;
  line-height: 1.6;
}

.is-active {
  color: #409eff;
}
.user-center-container {
  max-width: 1320px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f7fa;
}
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e6e8eb;
}
.user-info {
  display: flex;
  align-items: center;
}
.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
  border: 2px solid #409eff;
}
.user-details h2 {
  margin-bottom: 5px;
  color: #303133;
}
.user-details p {
  color: #909399;
  font-size: 14px;
}
.main-content {
  display: flex;
  gap: 20px;
}
.sidebar {
  width: 220px;
  flex-shrink: 0;
}
.content {
  flex: 1;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
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
}
</style>
