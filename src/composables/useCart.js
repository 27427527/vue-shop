import { ref, computed, watch } from "vue";
import { useLocalStorage } from "./useLocalStorage.js";

export function useCart() {
  const { data: cartItems, clear: clearStorage } = useLocalStorage("cart", []);

  // 添加到购物车
  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.value.find(
      (item) => item.good_id === product.good_id
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
