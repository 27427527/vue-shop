import { useLocalStorage } from "./useLocalStorage.js";

export function useOrder() {
  const { data: Order, clear: clearStorage } = useLocalStorage("order", []);

  // 添加
  const addToOrder = (product) => {
    if (!isEmpty(product.category)) {
      let str = "";
      for (let attr of product.category) {
        str += attr[0] + ":" + attr[1] + " ";
      }

      product.spec = str;
    }
    Order.value = product;
  };

  function isEmpty(value) {
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
  }

  // 清空
  const clearToOrder = () => {
    Order.value = "";
    clearStorage();
  };

  return {
    Order,
    addToOrder,
    clearToOrder,
  };
}
