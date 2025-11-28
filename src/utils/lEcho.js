import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

class LaravelEchoService {
  constructor() {
    this.echo = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
    this.isManualDisconnect = false;
    this.subscribedChannels = new Map(); // 保存订阅的频道信息
    this.connectionCallbacks = {
      onConnected: [],
      onDisconnected: [],
      onReconnecting: [],
      onError: [],
    };
  }

  // 添加连接状态回调
  on(event, callback) {
    if (this.connectionCallbacks[event]) {
      this.connectionCallbacks[event].push(callback);
    }
  }

  // 触发回调
  trigger(event, data) {
    if (this.connectionCallbacks[event]) {
      this.connectionCallbacks[event].forEach((callback) => callback(data));
    }
  }

  init(config = {}) {
    console.log("🔄 初始化 WebSocket 连接...");

    // 重置手动断开标志
    this.isManualDisconnect = false;

    const getAuthToken = () => {
      return (
        localStorage.getItem("access_token") ||
        localStorage.getItem("token") ||
        ""
      );
    };

    const getCsrfToken = () => {
      return (
        document
          .querySelector('meta[name="csrf-token"]')
          ?.getAttribute("content") || ""
      );
    };

    const echoConfig = {
      broadcaster: "pusher",
      key: config.key || import.meta.env.VITE_PUSHER_APP_KEY || "local",
      wsHost: config.wsHost || "lshop",
      wsPort: config.wsPort || 6001,
      wssPort: config.wssPort || 6001,
      forceTLS: false,
      encrypted: false,
      disableStats: true,
      enabledTransports: ["ws", "wss"],
      cluster: config.cluster || "mt1",

      // 重连配置
      auth: {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "X-CSRF-TOKEN": getCsrfToken(),
          Accept: "application/json",
        },
      },
      authEndpoint: "http://lshop/api/broadcasting/auth",
    };

    this.echo = new Echo(echoConfig);
    this.setupConnectionListeners();

    return this.echo;
  }

  setupConnectionListeners() {
    const pusher = this.echo.connector.pusher;

    pusher.connection.bind("connecting", () => {
      console.log("🔄 WebSocket 连接中...");
      this.trigger("onReconnecting", {
        attempt: this.reconnectAttempts + 1,
        maxAttempts: this.maxReconnectAttempts,
      });
    });

    pusher.connection.bind("connected", () => {
      console.log("✅ WebSocket 连接成功");
      this.reconnectAttempts = 0; // 重置重连计数
      this.trigger("onConnected", {
        socketId: pusher.connection.socket_id,
      });

      // 连接成功后重新订阅之前的频道
      if (this.reconnectAttempts > 0) {
        this.resubscribeChannels();
      }
    });

    pusher.connection.bind("disconnected", () => {
      console.log("❌ WebSocket 连接断开");
      this.trigger("onDisconnected", {
        isManual: this.isManualDisconnect,
      });

      // 如果不是手动断开，尝试重连
      if (!this.isManualDisconnect) {
        this.handleReconnect();
      }
    });

    pusher.connection.bind("error", (error) => {
      console.error("❌ WebSocket 错误:", error);
      this.trigger("onError", { error });
    });

    // 监听订阅事件
    pusher.connection.bind("subscription_succeeded", (channelName) => {
      console.log(`✅ 频道订阅成功: ${channelName}`);
    });

    pusher.connection.bind("subscription_error", (error) => {
      console.error(`❌ 频道订阅失败:`, error);
    });
  }

  // 处理自动重连
  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.calculateReconnectDelay();

      console.log(
        `🔄 ${delay}ms 后尝试重连... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );

      setTimeout(() => {
        if (!this.isManualDisconnect) {
          this.reconnect();
        }
      }, delay);
    } else {
      console.error("❌ 重连次数超限，停止重连");
      this.trigger("onError", {
        message: "重连次数超限，请检查网络连接",
        maxAttempts: this.maxReconnectAttempts,
      });
    }
  }

  // 计算重连延迟（指数退避算法）
  calculateReconnectDelay() {
    return Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
  }

  // 重新连接
  reconnect() {
    console.log("🔄 执行重新连接...");
    if (this.echo) {
      this.echo.disconnect();
    }

    // 重新初始化连接
    setTimeout(() => {
      if (!this.isManualDisconnect) {
        this.init({
          wsHost: "lshop",
          wsPort: 6001,
          key: "local",
        });
      }
    }, 1000);
  }

  // 保存频道订阅信息
  saveChannelSubscription(channelName, channelType, eventHandlers = {}) {
    if (!this.subscribedChannels.has(channelName)) {
      this.subscribedChannels.set(channelName, {
        type: channelType,
        eventHandlers,
        subscribed: false,
      });
    }
  }

  // 重新订阅频道
  resubscribeChannels() {
    if (this.subscribedChannels.size == 0) {
      return;
    }

    console.log("🔄 重新订阅频道...", this.subscribedChannels.size);
    this.subscribedChannels.forEach((channelInfo, channelName) => {
      if (!channelInfo.subscribed) {
        this.subscribeToChannel(
          channelName,
          channelInfo.type,
          channelInfo.eventHandlers
        );
      }
    });
  }

  // 订阅频道（带保存功能）
  subscribeToChannel(channelName, channelType = "public", eventHandlers = {}) {
    if (!this.echo) {
      console.warn("❌ Echo 未初始化，无法订阅频道");
      return null;
    }

    let channel;

    try {
      switch (channelType) {
        case "private":
          channel = this.echo.private(channelName);
          break;
        case "presence":
          channel = this.echo.join(channelName);
          break;
        default:
          channel = this.echo.channel(channelName);
      }

      // 设置事件处理器
      Object.entries(eventHandlers).forEach(([eventName, handler]) => {
        if (typeof handler === "function") {
          channel.listen(eventName, handler);
        }
      });

      // 保存订阅信息
      this.saveChannelSubscription(channelName, channelType, eventHandlers);
      channelInfo.subscribed = true;

      console.log(`✅ 订阅频道: ${channelName} (${channelType})`);

      return channel;
    } catch (error) {
      // console.error(`❌ 订阅频道失败: ${channelName}`, error);
      return null;
    }
  }

  // 公共频道
  channel(channelName, eventHandlers = {}) {
    return this.subscribeToChannel(channelName, "public", eventHandlers);
  }

  // 私有频道
  private(channelName, eventHandlers = {}) {
    return this.subscribeToChannel(channelName, "private", eventHandlers);
  }

  // 存在频道
  join(channelName, eventHandlers = {}) {
    return this.subscribeToChannel(channelName, "presence", eventHandlers);
  }

  // 断开连接
  disconnect() {
    console.log("🛑 手动断开 WebSocket 连接");
    this.isManualDisconnect = true;

    if (this.echo) {
      this.echo.disconnect();
    }

    // 标记所有频道为未订阅
    this.subscribedChannels.forEach((channelInfo) => {
      channelInfo.subscribed = false;
    });
  }

  // 获取连接状态
  getConnectionState() {
    if (!this.echo) return "disconnected";

    const pusher = this.echo.connector.pusher;
    const state = pusher.connection.state;

    const stateMap = {
      initialized: "initialized",
      connecting: "connecting",
      connected: "connected",
      disconnected: "disconnected",
      failed: "error",
    };

    return stateMap[state] || "unknown";
  }

  // 获取重连信息
  getReconnectInfo() {
    return {
      attempts: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts,
      nextDelay: this.calculateReconnectDelay(),
    };
  }
}

const lEcho = new LaravelEchoService();

export default lEcho;
