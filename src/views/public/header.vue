<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/user";
import { useBannerStore } from "@/stores/banner";
import { useCateStore } from "@/stores/cate";
import { useCartStore } from "@/stores/cart";
import { useCart } from "@/composables/useCart.js";
const { totalItems } = useCart();
const cartstore = useCartStore();
cartstore.number = totalItems;
const bannerstore = useBannerStore();
bannerstore.getBanners();

const caterstore = useCateStore();
caterstore.getNavs();

const userstore = useUserStore();
userstore.isAuthenticated();
const auth = computed(() => userstore.auth);

if (auth.value == true) {
  userstore.getCurrentUser();
}

const users = computed(() => {
  return userstore.users;
});

const cate_list = computed(() => {
  return caterstore.nav_list;
});

function logout() {
  userstore.logout();
}

const hasSubItems = (item) => {
  return item.children && item.children.length > 1;
};
</script>
<template>
  <div class="h59"></div>
  <nav class="navbar navbar-expand-lg bg-white fixed-top">
    <div class="container">
      <!-- 品牌 Logo -->
      <router-link class="navbar-brand" to="/">
        <img
          src="@/assets/image/logo.png"
          alt="Logo"
          height="30"
          class="d-inline-block align-text-top"
        />
      </router-link>

      <!-- 移动端切换按钮 -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- 导航菜单 -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <!-- 普通菜单项 -->
          <li class="nav-item">
            <router-link class="nav-link" to="/">首页</router-link>
          </li>

          <!-- 一级下拉菜单 -->
          <li
            class="nav-item"
            v-for="(cate, i) in cate_list"
            :key="cate.cate_id"
            :class="cate.children_count > 1 ? 'dropdown' : ''"
          >
            <template v-if="cate.children_count > 1">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ cate.name }}
              </a>
              <ul class="dropdown-menu">
                <li v-for="item in cate.children" :key="item.cate_id">
                  <router-link
                    class="dropdown-item"
                    :to="cate.slug + '?cate_id=' + item.cate_id"
                    >{{ item.name }}</router-link
                  >
                </li>
              </ul>
            </template>

            <template v-else>
              <router-link
                class="nav-link"
                :to="cate.slug + '?cate_id=' + cate.children[0].cate_id"
                >{{ cate.name }}</router-link
              >
            </template>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/about">关于我们</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/contact">联系我们</router-link>
          </li>
        </ul>

        <!-- 右侧菜单 -->
        <ul class="navbar-nav dropdown">
          <li class="nav-item" v-show="!auth">
            <router-link class="nav-link" to="/login">登录/注册</router-link>
          </li>

          <li class="nav-item" v-show="auth">
            <router-link class="nav-link" to="/cart"
              ><i class="iconfont">&#xe698;</i>({{
                cartstore.number
              }})</router-link
            >
          </li>

          <li class="nav-item dropdown" v-show="auth">
            <a
              id="username"
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="iconfont">&#xe6b8;</i>{{ users.name }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <router-link class="dropdown-item" to="/user/order"
                  ><i class="bi bi-person"></i> 个人中心</router-link
                >
              </li>
              <li>
                <router-link class="dropdown-item" to="/settings"
                  ><i class="bi bi-gear"></i> 设置</router-link
                >
              </li>

              <!-- 二级下拉菜单 -->
              <li class="dropend">
                <a
                  class="dropdown-item dropdown-toggle"
                  href="#"
                  data-bs-toggle="dropdown"
                >
                  <i class="bi bi-bell"></i> 消息通知
                </a>
                <ul class="dropdown-menu">
                  <li>
                    <router-link
                      class="dropdown-item"
                      to="/notifications/system"
                      >系统消息</router-link
                    >
                  </li>
                  <li>
                    <router-link
                      class="dropdown-item"
                      to="/notifications/personal"
                      >个人消息</router-link
                    >
                  </li>
                </ul>
              </li>

              <li><hr class="dropdown-divider" /></li>
              <li>
                <button class="dropdown-item" @click="logout">
                  <i class="bi bi-box-arrow-right"></i> 退出登录
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* 自定义样式 */
.navbar-brand {
  font-weight: bold;
}

.nav-item {
  padding: 0 1rem;
}

#username {
  color: rgba(179, 141, 84, 1);
}

.nav-item a {
  color: #212121;
  font-weight: bold;
  font-size: 15px;
}
.nav-item a:hover {
  color: rgba(179, 141, 84, 1);
}

/* 下拉菜单悬停效果 */
.navbar-nav .dropdown:hover > .dropdown-menu {
  display: block;
}

.dropend:hover > .dropdown-menu {
  display: block;
  top: 0;
  left: 100%;
  margin-left: 0.125rem;
}

.dropstart:hover > .dropdown-menu {
  display: block;
  top: 0;
  right: 100%;
  margin-right: 0.125rem;
}

/* 响应式调整 */
@media (max-width: 991.98px) {
  .dropend > .dropdown-menu,
  .dropstart > .dropdown-menu {
    margin-left: 0;
    margin-right: 0;
  }
}

/* 图标间距 */
.nav-link i {
  margin-right: 1rem;
}
</style>
