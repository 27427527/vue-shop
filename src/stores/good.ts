import { ref, computed } from "vue";
import { defineStore } from "pinia";
import Api from "../services/api.ts";

export const useGoodStore = defineStore("good", {
  state: () => ({
    nav_list: [],
    good_list: [], //商品列表页数据
    good_details: [], //商品详情页数据
    select_list: [], //已选数据
    dis_list: [], //所有禁用价格组合
    dis_arr: [], //当前禁用价格值
    price_list: [], //所有价格
    good_featured: [], //商品推荐列表页数据
    good_search: [], //商品搜索列表页数据
    loading: false,
    error: null,
  }),

  actions: {
    // 使用 Axios 获取数据
    async getGood(good_id: number) {
      this.loading = true;

      try {
        const response = await Api.get("/good/details?good_id=" + good_id);
        this.good_details = response.data.good_details;
        this.select_list = [];

        // 是否有默认选中价格

        let default_prices = this.good_details.default_prices;

        if (this.isEmpty(default_prices)) {
          this.price_list = [
            this.good_details.price,
            this.good_details.original_price,
            this.good_details.stock,
          ];
        } else {
          this.price_list = [
            default_prices.price,
            default_prices.org_price,
            default_prices.stock,
          ];
          // 默认选中属性
          let select_arr = [];
          let i = 0;
          // let obj = JSON.parse(default_prices.attr);
          let obj = default_prices.attr;

          for (let name in obj) {
            select_arr[i] = [name, obj[name]];
            i++;
          }
          this.select_list = select_arr;
        }

        // 是否有禁用价格
        let dis_prices = this.good_details.dis_prices;
        if (!this.isEmpty(dis_prices)) {
          let temp = [];
          for (let item of dis_prices) {
            let arr = [];

            // let obj = JSON.parse(item);
            for (let key in item) {
              arr.push(item[key]);
            }
            temp.push(arr);
          }

          this.dis_list = temp;

          this.dis_price();
        }
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async getCates(cate_id: number) {
      this.loading = true;

      if (
        this.good_list.length == 0 ||
        this.good_list[cate_id] == undefined ||
        this.good_list[cate_id].length == 0
      ) {
        try {
          const response = await Api.get("/good?cate_id=" + cate_id);
          this.good_list[cate_id] = response.data.good_list;
          this.nav_list[cate_id] = response.data.nav_list;
        } catch (err: any) {
          this.error = err.message;
        } finally {
          this.loading = false;
        }
      }
      this.loading = false;
    },
    // 使用 Axios 获取数据
    async getFeatured() {
      this.loading = true;
      if (this.good_featured.length == 0) {
        try {
          const response = await Api.get("/good/featured");
          this.good_featured = response.data.good_list;
        } catch (err: any) {
          this.error = err.message;
        } finally {
          this.loading = false;
        }
      }
      this.loading = false;
    },
    dis_price() {
      let dis_temp = [];
      // 禁用属性值
      for (let dis_item of this.dis_list) {
        for (let val of dis_item) {
          //val=白色 禁用列表的每个值来匹配,如果存在则移除匹配的值,把其它值放进禁用数组
          for (let sel of this.select_list) {
            if (val == sel[1]) {
              let new_arr = dis_item.filter((v) => v != val);
              Array.prototype.push.apply(dis_temp, new_arr);
            }
          }
        }
      }

      this.dis_arr = dis_temp;
    },
    isEmpty(value: any) {
      // 检查 null 和 undefined
      if (value == null) return true;

      // 检查数字
      if (typeof value === "number") return value === 0 || isNaN(value);

      // 检查布尔值
      if (typeof value === "boolean") return false;

      // 检查字符串
      if (typeof value === "string") return value.trim() === "";

      // 检查数组
      if (Array.isArray(value)) return value.length === 0;

      // 检查对象
      if (typeof value === "object") return Object.keys(value).length === 0;

      return false;
    },
  },
});
