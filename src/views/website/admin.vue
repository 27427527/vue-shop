<template>
  <div class="reconnect-container">
    <h3>🔄 WebSocket 连接管理</h3>

    <!-- 连接状态卡片 -->
    <div class="status-cards">
      <div :class="['status-card', connectionStatus]">
        <div class="card-icon">
          <span v-if="connectionStatus === 'connected'">✅</span>
          <span v-else-if="connectionStatus === 'reconnecting'">🔄</span>
          <span v-else-if="connectionStatus === 'error'">❌</span>
          <span v-else>⏸️</span>
        </div>
        <div class="card-content">
          <div class="status-text">{{ statusText }}</div>
          <div class="status-details" v-if="connectionInfo">
            Socket ID: {{ connectionInfo.state }}
            <span v-if="reconnectInfo.attempts > 0">
              | 重连: {{ reconnectInfo.attempts }}/{{
                reconnectInfo.maxAttempts
              }}
            </span>
          </div>
        </div>
      </div>

      <div class="info-card">
        <div class="card-icon">📊</div>
        <div class="card-content">
          <div>消息: {{ messages.length }}</div>
          <div>频道: {{ subscribedChannels.size }}</div>
          <div>日志: {{ debugLog.length }}</div>
        </div>
      </div>
    </div>

    <!-- 连接控制 -->
    <div class="control-section">
      <h4>连接控制</h4>
      <div class="control-buttons">
        <button
          @click="connectWebSocket"
          :disabled="isConnecting || isConnected"
          class="btn-connect"
        >
          <span v-if="isConnecting">🔄 连接中...</span>
          <span v-else>🔗 连接</span>
        </button>

        <button
          @click="reconnectWebSocket"
          :disabled="!canReconnect"
          class="btn-reconnect"
        >
          🔄 重新连接
        </button>

        <button
          @click="disconnectWebSocket"
          :disabled="!isConnected"
          class="btn-disconnect"
        >
          🛑 断开
        </button>

        <button
          @click="testConnection"
          :disabled="!isConnected"
          class="btn-test"
        >
          🧪 测试
        </button>
      </div>

      <!-- 重连信息 -->
      <div v-if="isReconnecting" class="reconnect-progress">
        <div class="progress-info">
          正在尝试重连... ({{ reconnectInfo.attempts }}/{{
            reconnectInfo.maxAttempts
          }})
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: reconnectProgress + '%' }"
          ></div>
        </div>
        <div class="next-attempt">
          下次尝试: {{ Math.ceil(reconnectInfo.nextDelay / 1000) }} 秒后
        </div>
      </div>
    </div>

    <!-- 频道管理 -->
    <div class="channels-section">
      <h4>频道管理</h4>
      <div class="channel-controls">
        <div class="channel-input">
          <input
            v-model="newChannel.name"
            placeholder="频道名称"
            @keyup.enter="subscribeToChannel"
          />
          <select v-model="newChannel.type">
            <option value="public">公共频道</option>
            <option value="private">私有频道</option>
            <option value="presence">存在频道</option>
          </select>
          <button
            @click="subscribeToChannel"
            :disabled="!isConnected"
            class="btn-subscribe"
          >
            📡 订阅
          </button>
        </div>

        <div class="active-channels">
          <div
            v-for="channel in Array.from(subscribedChannels)"
            :key="channel"
            class="channel-tag"
          >
            {{ channel }}
            <button
              @click="unsubscribeChannel(channel)"
              class="btn-unsubscribe"
            >
              ×
            </button>
          </div>
          <div v-if="subscribedChannels.size === 0" class="no-channels">
            暂无订阅频道
          </div>
        </div>
      </div>
    </div>

    <!-- 实时消息 -->
    <div class="messages-section">
      <h4>
        实时消息
        <button @click="clearMessages" class="btn-clear">清空</button>
        <button @click="exportMessages" class="btn-export">导出</button>
      </h4>
      <div class="messages-container">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['message', message.direction]"
        >
          <div class="message-header">
            <span class="channel">{{ message.channel }}</span>
            <span class="event">{{ message.event }}</span>
            <span class="time">{{ formatTime(message.timestamp) }}</span>
          </div>
          <pre class="message-content">{{
            JSON.stringify(message.data, null, 2)
          }}</pre>
        </div>
        <div v-if="messages.length === 0" class="no-messages">暂无消息</div>
      </div>
    </div>

    <!-- 调试日志 -->
    <div class="logs-section">
      <h4>
        调试日志
        <button @click="clearLogs" class="btn-clear">清空</button>
      </h4>
      <div class="logs-container">
        <div
          v-for="log in debugLog"
          :key="log.id"
          :class="['log-entry', log.type]"
        >
          <span class="log-time">{{ formatTime(log.timestamp) }}</span>
          <span class="log-message">{{ log.message }}</span>
          <pre v-if="log.data" class="log-data">{{
            JSON.stringify(log.data, null, 2)
          }}</pre>
        </div>
      </div>
    </div>

    <!-- 错误显示 -->
    <div v-if="error" class="error-section">
      <h4>❌ 错误信息</h4>
      <div class="error-message">{{ error }}</div>
      <button @click="error = null" class="btn-dismiss">忽略</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import { uselEcho } from "@/composables/uselEcho.js";

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
  sendTestMessage,
  clearMessages,
  clearLogs,
  getConnectionInfo,
  addDebugLog,
} = uselEcho();

const newChannel = reactive({
  name: "public.chat",
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
    wsHost: "localhost",
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

// 订阅频道
const subscribeToChannel = () => {
  if (!newChannel.name.trim()) return;

  try {
    listenToPublic(newChannel.name, ".chat.message", (data) => {
      console.log("收到频道消息:", data);
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
  addDebugLog(`取消订阅频道: ${channelName}`, "info");
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

  addDebugLog("WebSocket 管理界面已加载", "info");
});

onUnmounted(() => {
  disconnectWebSocket();
});
</script>

<style scoped>
.reconnect-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.status-cards {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
}

.status-card,
.info-card {
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.status-card.connected {
  background: linear-gradient(135deg, #d4edda, #c3e6cb);
  border: 2px solid #28a745;
}

.status-card.reconnecting {
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  border: 2px solid #ffc107;
}

.status-card.error {
  background: linear-gradient(135deg, #f8d7da, #f5c6cb);
  border: 2px solid #dc3545;
}

.status-card.disconnected {
  background: linear-gradient(135deg, #e9ecef, #dee2e6);
  border: 2px solid #6c757d;
}

.info-card {
  background: linear-gradient(135deg, #d1ecf1, #bee5eb);
  border: 2px solid #17a2b8;
}

.card-icon {
  font-size: 2em;
}

.card-content {
  flex: 1;
}

.status-text {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 5px;
}

.status-details {
  font-size: 0.9em;
  color: #666;
}

.control-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.control-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.control-buttons button {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.control-buttons button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-connect {
  background: #28a745;
  color: white;
}

.btn-reconnect {
  background: #ffc107;
  color: black;
}

.btn-disconnect {
  background: #dc3545;
  color: white;
}

.btn-test {
  background: #17a2b8;
  color: white;
}

.reconnect-progress {
  background: white;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.progress-info {
  margin-bottom: 10px;
  font-weight: 500;
}

.progress-bar {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffc107, #fd7e14);
  transition: width 0.3s ease;
}

.next-attempt {
  font-size: 0.9em;
  color: #6c757d;
  text-align: center;
}

.channels-section,
.messages-section,
.logs-section {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
}

.channels-section h4,
.messages-section h4,
.logs-section h4 {
  background: #343a40;
  color: white;
  margin: 0;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.channel-controls {
  padding: 20px;
}

.channel-input {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.channel-input input,
.channel-input select {
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  flex: 1;
}

.btn-subscribe {
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.active-channels {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.channel-tag {
  background: #e9ecef;
  padding: 6px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9em;
}

.btn-unsubscribe {
  background: #dc3545;
  color: white;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-channels,
.no-messages {
  text-align: center;
  color: #6c757d;
  padding: 20px;
}

.messages-container,
.logs-container {
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
}

.message,
.log-entry {
  margin-bottom: 10px;
  padding: 12px;
  border-radius: 6px;
  border-left: 4px solid #007bff;
}

.message.incoming {
  border-left-color: #28a745;
  background: #f8fff9;
}

.message.outgoing {
  border-left-color: #17a2b8;
  background: #f0f9ff;
}

.log-entry.success {
  border-left-color: #28a745;
  background: #f8fff9;
}

.log-entry.error {
  border-left-color: #dc3545;
  background: #fff5f5;
}

.log-entry.warning {
  border-left-color: #ffc107;
  background: #fffdf0;
}

.message-header,
.log-time {
  display: flex;
  justify-content: space-between;
  font-size: 0.8em;
  color: #666;
  margin-bottom: 5px;
}

.channel,
.event {
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 3px;
  margin-right: 5px;
}

.message-content,
.log-data {
  margin: 0;
  font-size: 0.9em;
  background: rgba(0, 0, 0, 0.02);
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
}

.log-message {
  font-weight: 500;
}

.error-section {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.error-message {
  color: #721c24;
  margin-bottom: 10px;
}

.btn-clear,
.btn-export,
.btn-dismiss {
  background: #6c757d;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8em;
}

.btn-export {
  background: #17a2b8;
}

.btn-dismiss {
  background: #dc3545;
}
</style>
