import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    number: 0,
    loading: false,
    error: null,
  }),

  actions: {
    setnumber(num: number) {
      this.number = num;
    },
  },
});
