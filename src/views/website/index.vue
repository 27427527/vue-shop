<template>
  <div></div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from "vue";
import { uselEcho } from "@/composables/uselEcho.js";
import { ElNotification } from "element-plus";
import { useLocalStorage } from "@/composables/useLocalStorage.js";

// 获取用户ID
const { data: user_id, clear: clearStorage } = useLocalStorage("user_id", "");

const {
  messages,
  connectionStatus,
  error,
  reconnectInfo,
  debugLog,
  subscribedChannels,
  connect,
  reconnect,
  disconnect,
  listenToPublic,
  listenToPrivate,
  sendTestMessage,
  clearMessages,
  clearLogs,
  getConnectionInfo,
  addDebugLog,
} = uselEcho();

const newChannel = reactive({
  name: "public",
  type: "public",
});

const connectionInfo = ref(null);

// 计算属性
const isConnected = computed(() => connectionStatus.value === "connected");
const isConnecting = computed(() => connectionStatus.value === "connecting");
const isReconnecting = computed(
  () => connectionStatus.value === "reconnecting"
);
const canReconnect = computed(() => !isConnected.value && !isConnecting.value);

const statusText = computed(() => {
  const statusMap = {
    connected: "已连接",
    connecting: "连接中",
    reconnecting: "重连中",
    disconnected: "未连接",
    error: "连接错误",
  };
  return statusMap[connectionStatus.value] || "未知状态";
});

const reconnectProgress = computed(() => {
  return (reconnectInfo.value.attempts / reconnectInfo.value.maxAttempts) * 100;
});

// 连接 WebSocket
const connectWebSocket = () => {
  connect({
    wsHost: "lshop",
    wsPort: 6001,
    key: "local",
    cluster: "mt1",
  });
};

// 重新连接
const reconnectWebSocket = () => {
  reconnect();
};

// 断开连接
const disconnectWebSocket = () => {
  disconnect();
};

// 测试连接
const testConnection = async () => {
  try {
    addDebugLog("开始连接测试...", "info");
    await sendTestMessage("测试消息 " + new Date().toLocaleTimeString());
  } catch (err) {
    addDebugLog("连接测试失败", "error", err);
  }
};

// 订阅私人频道
const subscribeToUser = () => {
  if (!user_id.value) return;
  let channelName = "user." + user_id.value;

  try {
    listenToPrivate(channelName, ".PrivateMessage", (data) => {
      console.log("收到私有消息:", data);
      ElNotification({
        title: "私有消息",
        message: data.fromUser.username + ":" + data.message,
        position: "bottom-right",
        type: "success",
      });
    });
  } catch (err) {
    addDebugLog(`订阅频道失败: ${channelName}`, "error", err);
  }
};

// 订阅公共频道
const subscribeToChannel = () => {
  if (!newChannel.name.trim()) return;

  try {
    listenToPublic(newChannel.name, ".ChatMessage", (data) => {
      console.log("收到频道消息:", data);

      ElNotification({
        title: "公共频道消息",
        message: data.user.username + ":" + data.message,
        position: "bottom-right",
        type: "success",
      });
    });

    addDebugLog(`订阅频道成功: ${newChannel.name}`, "success");
    newChannel.name = "";
  } catch (err) {
    addDebugLog(`订阅频道失败: ${newChannel.name}`, "error", err);
  }
};

// 取消订阅频道
const unsubscribeChannel = (channelName) => {
  // 这里需要实现取消订阅的逻辑
  subscribedChannels.delete(channelName);
};

// 导出消息
const exportMessages = () => {
  const data = JSON.stringify(messages.value, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `websocket-messages-${
    new Date().toISOString().split("T")[0]
  }.json`;
  a.click();
  URL.revokeObjectURL(url);
  addDebugLog("消息已导出", "success");
};

// 格式化时间
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString();
};

// 定时更新连接信息
const updateConnectionInfo = () => {
  connectionInfo.value = getConnectionInfo();
};

// 初始化
onMounted(() => {
  // 自动连接（可选）
  connectWebSocket();

  // 定时更新连接信息
  setInterval(updateConnectionInfo, 1000);

  subscribeToChannel();

  // 使用 watch 监听 cate_id 的变化
  watch(
    () => user_id.value,
    async (newId) => {
      subscribeToUser();
    }
  );

  subscribeToUser();
});

onUnmounted(() => {
  disconnectWebSocket();
});
</script>

<style scoped></style>
