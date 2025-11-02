import api from "./api";

class AuthService {
  // 获取 CSRF Cookie（首次访问时调用）
  async getCsrfToken() {
    try {
      await api.get("/csrf-cookie");
      return true;
    } catch (error) {
      console.error("获取 CSRF token 失败:", error);
      return false;
    }
  }

  // 用户注册
  async register(userData) {
    try {
      const response = await api.post("/register", userData);

      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // 用户登录
  async login(credentials) {
    try {
      // 确保先获取 CSRF token
      await this.getCsrfToken();

      const response = await api.post("/login", credentials);

      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // 用户登出
  async logout() {
    try {
      await api.post("/logout");
      localStorage.removeItem("access_token");
      return true;
    } catch (error) {
      console.error("登出失败:", error);
      localStorage.removeItem("access_token"); // 无论如何都清除本地 token
      return false;
    }
  }
}

export default new AuthService();
