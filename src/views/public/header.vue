<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from "vue-router";
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/user";
import { useBannerStore } from "@/stores/banner";
import { useCateStore } from "@/stores/cate";
import { useCartStore } from "@/stores/cart";
import { useGoodStore } from "@/stores/good";
import { useCart } from "@/composables/useCart.js";
import Api from "@/services/api.ts";
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
const router = useRouter();
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
  router.push("/index");
}

const hasSubItems = (item) => {
  return item.children && item.children.length > 1;
};

// 搜索数据
async function creatSearch(search: string) {
  let load = ElLoading.service();

  let searchData = {
    keyword: search,
  };

  await Api.post("/good/search", searchData)
    .then((response) => {
      // 请求成功处理
      if (response.data.success) {
        goodstore.good_search = response.data.search_list;
        router.push("/search");
      } else {
        ElMessage.error(response.data.message);
      }
    })
    .catch((error) => {
      // 错误处理

      ElMessage.error("添加失败,请重试");
    })
    .finally(() => {
      // 无论成功失败都会执行
      load.close();
      loading.value = false;
    });
}

// 搜索
const goodstore = useGoodStore();
const search = ref("");
const loading = ref(false);
const performSearch = () => {
  if (search.value.trim() !== "" && !loading.value) {
    loading.value = true;
    creatSearch(search.value);
  }
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
                data-toggle="dropdown"
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
            <router-link class="nav-link" to="/post/detail?post_id=18"
              >网站前台</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/post/detail?post_id=19"
              >网站后台</router-link
            >
          </li>
        </ul>

        <!-- 搜索框 -->

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
              <img
                :src="users.profile_photo_url"
                alt="当前头像"
                class="avatar-img"
              />{{ users.name }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <router-link class="dropdown-item" to="/user/order"
                  ><i class="bi bi-person"></i> 个人中心</router-link
                >
              </li>

              <!-- 二级下拉菜单 -->
              <!-- <li class="dropend">
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
             
                </ul>
              </li> -->

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

  <div class="h59"></div>
  <div class="search-container">
    <div class="container">
      <div class="main-container">
        <input
          type="text"
          v-model="search"
          class="form-control"
          placeholder="请输入"
        />
        <button
          type="submit"
          @click="performSearch"
          class="submit btn btn-default"
        >
          提交
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义样式 */
.navbar-brand {
  font-weight: bold;
}
.main-container {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.submit {
  width: 80px;
  background-color: #007bff;
  color: white;
}

.submit:hover {
  background-color: #0056b3;
  color: white;
}

.form-control {
  flex: 1;
}

.search-container {
  position: fixed;
  top: 59px;
  right: 0;
  left: 0;
  z-index: 100;
  background-color: #f8f9fa;
  padding: 10px 0;
}

.avatar-img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
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
