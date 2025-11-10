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
      path: "/cart",
      name: "cart",
      component: () => import("@/views/cart/index.vue"),
    },
    {
      path: "/post",
      name: "post",
      component: () => import("@/views/post/index.vue"),
    },
  ],
});

export default router;
