import "./assets/css/common.css";
import "./assets/css/font.css"; // 引入字体样式

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
// 引入 Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// 引入 Bootstrap JavaScript
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
const app = createApp(App);

app.config.globalProperties.$formatDate = (
  date: any,
  format = "YYYY-MM-DD HH:mm:ss"
) => {
  return dayjs(date).format(format);
};

// 设置全局常量
app.config.globalProperties.$constants = {
  API_BASE_URL: "http://lshop/storage/",
  APP_VERSION: "1.0.0",
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  TIMEOUT: 5000,
};
app.use(ElementPlus);
app.use(createPinia());
app.use(router);
app.mount("#app");
