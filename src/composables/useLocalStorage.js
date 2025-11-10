import { ref, watch } from "vue";

export function useLocalStorage(key, defaultValue = null) {
  const data = ref(getStoredValue());

  function getStoredValue() {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  function setStoredValue(value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }

  watch(
    data,
    (newValue) => {
      setStoredValue(newValue);
    },
    { deep: true }
  );

  const clear = () => {
    data.value = defaultValue;
    window.localStorage.removeItem(key);
  };

  return {
    data,
    clear,
  };
}
