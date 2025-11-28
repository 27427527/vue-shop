<script setup lang="ts">
// import authService from '../../services/auth';
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api.ts";
import { useUserStore } from "@/stores/user";

const userstore = useUserStore();
const activeTab = ref("login");
const router = useRouter();
// 登录表单数据
const loginForm = reactive({
  email: "",
  password: "",
  remember: false,
});

// 注册表单数据
const registerForm = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

// 错误信息
const loginErrors = reactive({
  email: "",
  password: "",
});

const registerErrors = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

// 切换标签页
const switchTab = (tab) => {
  activeTab.value = tab;
  clearErrors();
};

// 清除错误信息
const clearErrors = () => {
  Object.keys(loginErrors).forEach((key) => (loginErrors[key] = ""));
  Object.keys(registerErrors).forEach((key) => (registerErrors[key] = ""));
};

// 验证登录表单
const validateLogin = () => {
  let isValid = true;
  clearErrors();

  if (!loginForm.email) {
    loginErrors.email = "请输入邮箱地址";
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
    loginErrors.email = "邮箱格式不正确";
    isValid = false;
  }

  if (!loginForm.password) {
    loginErrors.password = "请输入密码";
    isValid = false;
  } else if (loginForm.password.length < 6) {
    loginErrors.password = "密码至少6位";
    isValid = false;
  }

  return isValid;
};

// 验证注册表单
const validateRegister = () => {
  let isValid = true;
  clearErrors();

  if (!registerForm.name) {
    registerErrors.name = "请输入用户名";
    isValid = false;
  }

  if (!registerForm.email) {
    registerErrors.email = "请输入邮箱地址";
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
    registerErrors.email = "邮箱格式不正确";
    isValid = false;
  }

  if (!registerForm.password) {
    registerErrors.password = "请输入密码";
    isValid = false;
  } else if (registerForm.password.length < 6) {
    registerErrors.password = "密码至少6位";
    isValid = false;
  }

  if (!registerForm.password_confirmation) {
    registerErrors.password_confirmation = "请确认密码";
    isValid = false;
  } else if (registerForm.password !== registerForm.password_confirmation) {
    registerErrors.password_confirmation = "两次输入的密码不一致";
    isValid = false;
  }

  return isValid;
};

// 处理登录
const handleLogin = () => {
  if (validateLogin()) {
    // 这里应该是实际的登录API调用

    const promise = userstore.login(loginForm);

    promise.then((result) => {
      let rs = result;
      console.log(rs);

      if (rs.data.state == 200) {
        router.push("/index");
      } else {
        alert(rs.message || "登录失败，请重试");
      }
    });
  }
};

// 处理注册
const handleRegister = () => {
  if (validateRegister()) {
    // 这里应该是实际的注册API调用
    const promise = userstore.register(registerForm);

    promise.then((result) => {
      let rs = result;

      if (rs.data.state == 200) {
        router.push("/index");
      } else {
        alert(rs.message || "注册失败，请重试");
      }
    });
  }
};
</script>

<template>
  <div class="login">
    <div class="container">
      <div class="auth-card">
        <div class="card-header">
          <h1>欢迎回来</h1>
          <p>请登录您的账户或注册新账户</p>
        </div>

        <div class="tabs">
          <div
            class="tab"
            :class="{ active: activeTab === 'login' }"
            @click="switchTab('login')"
          >
            登录
          </div>
          <div
            class="tab"
            :class="{ active: activeTab === 'register' }"
            @click="switchTab('register')"
          >
            注册
          </div>
        </div>

        <div class="form-container">
          <!-- 登录表单 -->
          <form
            class="form"
            :class="{ hidden: activeTab !== 'login' }"
            @submit.prevent="handleLogin"
          >
            <div class="input-group">
              <label for="login-email">邮箱地址</label>
              <input
                type="email"
                id="login-email"
                v-model="loginForm.email"
                placeholder="请输入您的邮箱"
                required
              />
              <span class="error" v-if="loginErrors.email">{{
                loginErrors.email
              }}</span>
            </div>

            <div class="input-group">
              <label for="login-password">密码</label>
              <input
                type="password"
                id="login-password"
                v-model="loginForm.password"
                placeholder="请输入您的密码"
                required
              />
              <span class="error" v-if="loginErrors.password">{{
                loginErrors.password
              }}</span>
            </div>

            <!-- <div class="remember-forgot">
              <div class="remember">
                <input
                  type="checkbox"
                  id="remember"
                  v-model="loginForm.remember"
                />
                <label for="remember">记住我</label>
              </div>
              <a href="#" class="forgot">忘记密码?</a>
            </div> -->

            <button type="submit" class="btn">登录</button>
          </form>

          <!-- 注册表单 -->
          <form
            class="form"
            :class="{ hidden: activeTab !== 'register' }"
            @submit.prevent="handleRegister"
          >
            <div class="input-group">
              <label for="register-name">用户名</label>
              <input
                type="text"
                id="register-name"
                v-model="registerForm.name"
                placeholder="请输入您的用户名"
                required
              />
              <span class="error" v-if="registerErrors.name">{{
                registerErrors.name
              }}</span>
            </div>

            <div class="input-group">
              <label for="register-email">邮箱地址</label>
              <input
                type="email"
                id="register-email"
                v-model="registerForm.email"
                placeholder="请输入您的邮箱"
                required
              />
              <span class="error" v-if="registerErrors.email">{{
                registerErrors.email
              }}</span>
            </div>

            <div class="input-group">
              <label for="register-password">密码</label>
              <input
                type="password"
                id="register-password"
                v-model="registerForm.password"
                placeholder="请输入您的密码"
                required
              />
              <span class="error" v-if="registerErrors.password">{{
                registerErrors.password
              }}</span>
            </div>

            <div class="input-group">
              <label for="register-confirm">确认密码</label>
              <input
                type="password"
                id="register-confirm"
                v-model="registerForm.password_confirmation"
                placeholder="请再次输入密码"
                required
              />
              <span class="error" v-if="registerErrors.password_confirmation">{{
                registerErrors.password_confirmation
              }}</span>
            </div>

            <button type="submit" class="btn">注册</button>
          </form>

          <div class="social-login">
            <p>或使用以下方式登录</p>
            <div class="social-icons">
              <!-- <div class="social-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="24px"
                  height="24px"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  padding: 20px;
}

.container {
  width: 100%;
  max-width: 420px;
}

.auth-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative;
}

.card-header {
  padding: 30px 30px 20px;
  text-align: center;
}

.card-header h1 {
  color: #333;
  font-size: 28px;
  margin-bottom: 10px;
}

.card-header p {
  color: #666;
  font-size: 14px;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}

.tab {
  flex: 1;
  padding: 15px;
  text-align: center;
  font-weight: 600;
  cursor: pointer;
  color: #777;
  transition: all 0.3s ease;
}

.tab.active {
  color: #2575fc;
  border-bottom: 2px solid #2575fc;
}

.form-container {
  padding: 30px;
}

.form {
  transition: all 0.3s ease;
}

.form.hidden {
  display: none;
}

.input-group {
  margin-bottom: 20px;
  position: relative;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-size: 14px;
  font-weight: 500;
}

.input-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s ease;
}

.input-group input:focus {
  border-color: #2575fc;
  box-shadow: 0 0 0 2px rgba(37, 117, 252, 0.2);
  outline: none;
}

.input-group .error {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.remember {
  display: flex;
  align-items: center;
}

.remember input {
  margin-right: 8px;
}

.forgot {
  color: #2575fc;
  text-decoration: none;
  font-size: 14px;
}

.forgot:hover {
  text-decoration: underline;
}

.btn {
  width: 100%;
  padding: 12px;
  background: #2575fc;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn:hover {
  background: #1a68e8;
}

.social-login {
  margin-top: 25px;
  text-align: center;
}

.social-login p {
  color: #777;
  font-size: 14px;
  margin-bottom: 15px;
  position: relative;
}

.social-login p::before,
.social-login p::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 30%;
  height: 1px;
  background: #eee;
}

.social-login p::before {
  left: 0;
}

.social-login p::after {
  right: 0;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-icon:hover {
  background: #eaeaea;
  transform: translateY(-2px);
}

.social-icon img {
  width: 20px;
  height: 20px;
}

@media (max-width: 480px) {
  .auth-card {
    border-radius: 12px;
  }

  .card-header,
  .form-container {
    padding: 20px;
  }
}
</style>
