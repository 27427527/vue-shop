import "./assets/css/common.css";
import "./assets/css/font.css"; // 引入字体样式

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
// 引入 Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// 引入 Bootstrap JavaScript
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";

import "bootstrap-icons/font/bootstrap-icons.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

const app = createApp(App);
app.use(ElementPlus);
app.use(createPinia());
app.use(router);
app.mount("#app");
