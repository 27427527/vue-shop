import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/", //首页
      redirect: "/index",
    },
    {
      path: "/index",
      name: "index",
      component: () => import("@/views/index.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/login/login.vue"),
    },
    {
      path: "/good",
      name: "good",
      component: () => import("@/views/good/index.vue"),
    },
    {
      path: "/good/details",
      name: "good_details",
      component: () => import("@/views/good/details.vue"),
    },
    {
      path: "/good/featured",
      name: "good_featured",
      component: () => import("@/views/good/featured.vue"),
    },
    {
      path: "/search",
      name: "search",
      component: () => import("@/views/good/search.vue"),
    },
    {
      path: "/cart",
      name: "cart",
      component: () => import("@/views/cart/index.vue"),
    },
    {
      path: "/orderconfirm",
      name: "orderconfirm",
      component: () => import("@/views/order/orderconfirm.vue"),
    },
    {
      path: "/post",
      name: "post",
      component: () => import("@/views/post/index.vue"),
    },

    {
      path: "/post/detail",
      name: "detail",
      component: () => import("@/views/post/detail.vue"),
    },

    {
      path: "/brand",
      name: "brand",
      component: () => import("@/views/brand/index.vue"),
    },
    {
      path: "/brand/list",
      name: "brand_list",
      component: () => import("@/views/brand/list.vue"),
    },
    {
      path: "/website",
      name: "web",
      component: () => import("@/views/website/index.vue"),
    },
    {
      path: "/website/admin",
      name: "admin",
      component: () => import("@/views/website/admin.vue"),
    },
    {
      path: "/user",
      name: "user",
      component: () => import("@/views/user/index.vue"),
      children: [
        {
          path: "order",
          name: "order",
          component: () => import("@/views/order/index.vue"),
        },
        {
          path: "address",
          name: "address",
          component: () => import("@/views/address/index.vue"),
        },
        {
          path: "info",
          name: "info",
          component: () => import("@/views/user/info.vue"),
        },
      ],
    },
  ],
});

export default router;
