import { ref, computed, watch } from "vue";
import { useLocalStorage } from "./useLocalStorage.js";

export function useCart() {
  const { data: cartItems, clear: clearStorage } = useLocalStorage("cart", []);

  // 添加到购物车
  const addToCart = (product, quantity = 1) => {
    if (!isEmpty(product.category)) {
      let category = JSON.parse(product.category);

      let str = "";
      for (let attr of category) {
        str += attr[0] + ":" + attr[1] + " ";
      }

      product.spec = str;
    }

    let existingItem = cartItems.value.find(
      (item) =>
        item.good_id === product.good_id && item.category === product.category
    );

    if (existingItem) {
      if (existingItem.quantity + quantity <= product.stock) {
        existingItem.quantity += quantity;
      }
    } else {
      cartItems.value.push({
        ...product,
        quantity: Math.min(quantity, product.stock),
      });
    }
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

  function deepEqual(obj1, obj2) {
    // 基本类型比较
    if (obj1 === obj2) return true;

    // 处理 null 和 undefined
    if (
      obj1 == null ||
      obj2 == null ||
      typeof obj1 !== "object" ||
      typeof obj2 !== "object"
    ) {
      return obj1 === obj2;
    }

    // 处理 Date 对象
    if (obj1 instanceof Date && obj2 instanceof Date) {
      return obj1.getTime() === obj2.getTime();
    }

    // 处理数组
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) return false;
      return obj1.every((item, index) => deepEqual(item, obj2[index]));
    }

    // 处理对象
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    return keys1.every((key) => {
      if (!keys2.includes(key)) return false;
      return deepEqual(obj1[key], obj2[key]);
    });
  }

  function arraysEqual(arr1, arr2) {
    if (arr1 === arr2) return true;
    if (arr1.length !== arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {
      if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
        if (!arraysEqual(arr1[i], arr2[i])) return false;
      } else if (arr1[i] instanceof Object && arr2[i] instanceof Object) {
        if (!objectsEqual(arr1[i], arr2[i])) return false;
      } else if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }

  function objectsEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
      if (!keys2.includes(key)) return false;

      const val1 = obj1[key];
      const val2 = obj2[key];

      if (Array.isArray(val1) && Array.isArray(val2)) {
        if (!arraysEqual(val1, val2)) return false;
      } else if (val1 instanceof Object && val2 instanceof Object) {
        if (!objectsEqual(val1, val2)) return false;
      } else if (val1 !== val2) {
        return false;
      }
    }

    return true;
  }

  // 从购物车移除
  const removeFromCart = (productId) => {
    const index = cartItems.value.findIndex(
      (item) => item.good_id === productId
    );
    if (index > -1) {
      cartItems.value.splice(index, 1);
    }
  };

  // 更新数量
  const updateQuantity = (productId, newQuantity) => {
    const item = cartItems.value.find((item) => item.good_id === productId);
    if (item) {
      if (newQuantity <= 0) {
        removeFromCart(productId);
      } else if (newQuantity <= item.stock) {
        item.quantity = newQuantity;
      }
    }
  };

  // 计算总价
  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  });

  // 计算总数量
  const totalItems = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0);
  });

  // 清空购物车
  const clearCart = () => {
    cartItems.value = [];
    clearStorage();
  };

  // 检查商品是否在购物车中
  const isInCart = (productId) => {
    return cartItems.value.some((item) => item.good_id === productId);
  };

  // 获取购物车中的商品数量
  const getCartQuantity = (productId) => {
    const item = cartItems.value.find((item) => item.good_id === productId);
    return item ? item.quantity : 0;
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
    clearCart,
    isInCart,
    getCartQuantity,
  };
}
