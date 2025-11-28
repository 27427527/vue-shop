import axios from "axios";

// 创建 axios 实例
const api = axios.create({
  baseURL: "http://lshop/api", // Laravel 应用地址
  withCredentials: true, // 重要：允许发送 cookies
});

// 请求拦截器 - 自动添加 token
api.interceptors.request.use(
  (config) => {
    // 如果是 FormData，自动设置 Content-Type
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理认证错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token 过期或无效，清除本地存储并重定向到登录页
      localStorage.removeItem("access_token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
