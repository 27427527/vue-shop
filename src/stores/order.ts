import { ref, computed } from "vue";
import { defineStore } from "pinia";
import Api from "../services/api.ts";
export const useOrderStore = defineStore("order", {
  state: () => ({
    order_list: [],
    loading: false,
    error: null,
  }),

  actions: {
    // 发送订单数据
    async creatOrder(order: object) {
      this.loading = true;
      try {
        const response = await Api.post("/orders", order);

        return response.data;
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    // 订单数据
    async getOrderlist() {
      this.loading = true;
      try {
        const response = await Api.get("/orders/list");
        this.order_list = response.data.order_list;
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
