import { ref, computed } from "vue";
import { defineStore } from "pinia";
import Api from "../services/api.ts";

export const useBannerStore = defineStore("banner", {
  state: () => ({
    banners: [{ image: "/img/default.jpg" }],
    loading: false,
    error: null,
  }),

  actions: {
    // 使用 Axios 获取数据
    async getBanners() {
      this.loading = true;
      try {
        const response = await Api.get("/banner?cate_id=4");
        this.banners = response.data.banner_list;
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
