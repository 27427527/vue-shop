import { ref, computed } from "vue";
import { defineStore } from "pinia";
import Api from "../services/api.ts";

export const usePostStore = defineStore("post", {
  state: () => ({
    post_list: [],
    nav_list: [],
    post: {},
    cate: {},
    loading: false,
    error: null,
  }),

  actions: {
    // 使用 Axios 获取数据
    async getPostlist(cate_id: number) {
      this.loading = true;
      try {
        const response = await Api.get("/post/list/" + cate_id);
        this.post_list = response.data.post_list;
        this.nav_list = response.data.nav_list;
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    // 使用 Axios 获取数据
    async getPost(post_id: number) {
      this.loading = true;
      try {
        const response = await Api.get("/post/" + post_id);
        this.post = response.data.post;
        this.nav_list = response.data.nav_list;
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
