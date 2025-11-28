import { ref, reactive, onUnmounted } from "vue";
import lEcho from "@/utils/lEcho.js";

export function uselEcho() {
  const messages = ref([]);
  const connectionStatus = ref("disconnected");
  const error = ref(null);
  const reconnectInfo = ref({
    attempts: 0,
    maxAttempts: 5,
    nextDelay: 0,
  });

  const debugLog = ref([]);
  const subscribedChannels = ref(new Set());

  // 添加调试日志
  const addDebugLog = (message, type = "info", data = null) => {
    const logEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      message,
      type,
      data,
    };
    debugLog.value.unshift(logEntry);
    // console.log(`[WebSocket] ${message}`, data || "");
  };

  // 设置连接监听器
  const setupConnectionListeners = () => {
    lEcho.on("onConnected", (data) => {
      connectionStatus.value = "connected";
      error.value = null;
      addDebugLog("连接成功", "success", data);
    });

    lEcho.on("onDisconnected", (data) => {
      connectionStatus.value = "disconnected";
      if (!data.isManual) {
        addDebugLog("连接断开，尝试重连...", "warning");
      } else {
        addDebugLog("手动断开连接", "info");
      }
    });

    lEcho.on("onReconnecting", (data) => {
      connectionStatus.value = "reconnecting";
      reconnectInfo.value.attempts = data.attempt;
      reconnectInfo.value.nextDelay = lEcho.calculateReconnectDelay();
      addDebugLog(
        `重连尝试 ${data.attempt}/${data.maxAttempts}`,
        "warning",
        data
      );
    });

    lEcho.on("onError", (data) => {
      connectionStatus.value = "error";
      error.value = data.error?.message || data.message || "连接错误";
      addDebugLog("连接错误", "error", data);
    });
  };

  // 初始化连接
  const connect = (config = {}) => {
    try {
      addDebugLog("开始连接 WebSocket...", "info", config);
      connectionStatus.value = "connecting";

      lEcho.init(config);
      setupConnectionListeners();
    } catch (err) {
      connectionStatus.value = "error";
      error.value = err.message;
      addDebugLog("连接初始化失败", "error", err);
    }
  };

  // 重新连接
  const reconnect = () => {
    addDebugLog("手动触发重新连接", "info");
    lEcho.reconnect();
  };

  // 断开连接
  const disconnect = () => {
    addDebugLog("手动断开连接", "info");
    lEcho.disconnect();
    connectionStatus.value = "disconnected";
    subscribedChannels.value.clear();
  };

  // 监听频道（自动重连后重新订阅）
  const listenToChannel = (
    channelName,
    eventName,
    callback,
    channelType = "public"
  ) => {
    addDebugLog(`监听频道: ${channelName}, 事件: ${eventName}`, "info");

    subscribedChannels.value.add(channelName);

    const eventHandlers = {
      [eventName]: (data) => {
        addDebugLog(`收到事件: ${eventName}`, "success", data);

        // 添加到消息列表
        messages.value.push({
          id: Date.now() + Math.random(),
          channel: channelName,
          event: eventName,
          data: data,
          timestamp: new Date().toISOString(),
          direction: "incoming",
        });

        if (callback) {
          callback(data);
        }
      },
    };

    return lEcho.subscribeToChannel(channelName, channelType, eventHandlers);
  };

  // 监听公共频道
  const listenToPublic = (channelName, eventName, callback) => {
    return listenToChannel(channelName, eventName, callback, "public");
  };

  // 监听私有频道
  const listenToPrivate = (channelName, eventName, callback) => {
    return listenToChannel(channelName, eventName, callback, "private");
  };

  // 加入存在频道
  const joinPresence = (channelName, callbacks = {}) => {
    addDebugLog(`加入存在频道: ${channelName}`, "info");
    subscribedChannels.value.add(channelName);

    const eventHandlers = {};

    if (callbacks.here) {
      eventHandlers["here"] = callbacks.here;
    }
    if (callbacks.joining) {
      eventHandlers["joining"] = callbacks.joining;
    }
    if (callbacks.leaving) {
      eventHandlers["leaving"] = callbacks.leaving;
    }

    return lEcho.subscribeToChannel(channelName, "presence", eventHandlers);
  };

  // 发送测试消息
  const sendTestMessage = async (message, roomId = null) => {
    try {
      addDebugLog("发送测试消息", "info", { message, roomId });

      // 这里调用你的 API 端点
      const response = await fetch("/api/test-broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ message, room_id: roomId }),
      });

      const result = await response.json();
      addDebugLog("测试消息发送成功", "success", result);

      return result;
    } catch (err) {
      addDebugLog("测试消息发送失败", "error", err);
      throw err;
    }
  };

  // 获取连接状态信息
  const getConnectionInfo = () => {
    return {
      status: connectionStatus.value,
      state: lEcho.getConnectionState(),
      reconnect: lEcho.getReconnectInfo(),
      subscribedChannels: Array.from(subscribedChannels.value),
    };
  };

  // 清空消息
  const clearMessages = () => {
    messages.value = [];
    addDebugLog("清空消息历史", "info");
  };

  // 清空日志
  const clearLogs = () => {
    debugLog.value = [];
  };

  // 组件卸载时清理
  onUnmounted(() => {
    disconnect();
  });

  return {
    // 状态
    messages,
    connectionStatus,
    error,
    reconnectInfo,
    debugLog,
    subscribedChannels,

    // 方法
    connect,
    reconnect,
    disconnect,
    listenToPublic,
    listenToPrivate,
    joinPresence,
    sendTestMessage,
    getConnectionInfo,
    clearMessages,
    clearLogs,
    addDebugLog,
  };
}
