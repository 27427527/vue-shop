import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/", //首页
      redirect: "/index",
    },
    {
      path: "/index", //首页
      name: "index",
      component: () => import("@/views/index.vue"),
    },
    {
      path: "/login", //登录
      name: "login",
      component: () => import("@/views/login/login.vue"),
    },
  ],
});

export default router;
