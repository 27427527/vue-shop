import { ref, computed } from "vue";
import { defineStore } from "pinia";
import Api from "../services/api.ts";

export const useCateStore = defineStore("cate", {
  state: () => ({
    cate_list: [],
    nav_list: [],
    loading: false,
    error: null,
  }),

  actions: {
    // 使用 Axios 获取数据
    async getNavs() {
      this.loading = true;
      try {
        const response = await Api.get("/cate");
        this.nav_list = response.data.cate_list;
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    // 使用 Axios 获取数据
    async getCates() {
      this.loading = true;
      try {
        const response = await Api.get("/cate");
        this.cate_list = response.data.cate_list;
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
