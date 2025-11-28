import { ref, computed } from "vue";
import { defineStore } from "pinia";
import Api from "../services/api.ts";

export const useBrandStore = defineStore("brand", {
  state: () => ({
    brand_list: [],
    good_list: [],
    nav_list: [],
    brand: {},
    loading: false,
    error: null,
  }),

  actions: {
    // 使用 Axios 获取数据
    async getBrands(cate_id: number) {
      this.loading = true;
      try {
        const response = await Api.get("/brand?cate_id=" + cate_id);
        this.brand_list = response.data.brand_list;
        this.nav_list = response.data.nav_list;
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    // 使用 Axios 获取数据
    async getGoods(brand_id: number) {
      this.loading = true;
      try {
        const response = await Api.get("/brand/good/" + brand_id);
        this.good_list = response.data.good_list;
        this.nav_list = response.data.nav_list;
        this.brand = response.data.brand;
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
