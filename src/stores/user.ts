import { ref, computed } from "vue";
import { defineStore } from "pinia";
import api from "../services/api.ts";

export const useUserStore = defineStore("user", {
  state: () => ({
    users: {},
    address_list: [],
    auth: false,
    loading: false,
    error: null,
  }),

  actions: {
    // 使用 Axios 获取数据
    async getCurrentUser() {
      this.loading = true;
      try {
        const response = await api.get("/user");
        this.users = response.data.user;
        this.address_list = response.data.address_list;
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async getCsrfToken() {
      try {
        await api.get("/csrf-cookie");
        return true;
      } catch (error) {
        console.error("获取 CSRF token 失败:", error);
        return false;
      }
    },

    // 用户注册
    async register(userData: object) {
      try {
        const response = await api.post("/register", userData);

        if (response.data.access_token) {
          localStorage.setItem("access_token", response.data.access_token);
        }

        if (response.data.state == 200) {
          this.users = response.data.user;
          this.auth = true;
        }

        return response;
      } catch (error: any) {
        throw error.response?.data || error;
      }
    },

    // 用户登录
    async login(credentials: object) {
      try {
        // 确保先获取 CSRF token
        await this.getCsrfToken();

        const response = await api.post("/login", credentials);

        if (response.data.access_token) {
          localStorage.setItem("access_token", response.data.access_token);
        }

        if (response.data.state == 200) {
          this.users = response.data.user;
          this.auth = true;
        }

        return response;
      } catch (error: any) {
        throw error.response?.data || error;
      }
    },

    // 用户登出
    async logout() {
      try {
        this.auth = false;
        await api.post("/logout");
        localStorage.removeItem("access_token");

        return true;
      } catch (error) {
        console.error("登出失败:", error);
        localStorage.removeItem("access_token"); // 无论如何都清除本地 token
        return false;
      }
    },

    updateUser(obj: object) {
      this.users = obj;
    },

    // 检查是否已认证
    isAuthenticated() {
      this.auth = !!localStorage.getItem("access_token");
    },
  },
});
