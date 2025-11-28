<template>
  <el-form
    ref="formRef"
    style="max-width: 400px"
    :model="userInfo"
    label-width="auto"
  >
    <el-form-item
      label="昵称"
      prop="name"
      :rules="[{ required: true, message: '昵称不能为空' }]"
    >
      <el-input v-model="userInfo.name" type="text" autocomplete="off" />
    </el-form-item>

    <el-form-item label="电话" prop="phone">
      <el-input v-model="userInfo.phone" type="text" autocomplete="off" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(formRef)"
        >修改资料</el-button
      >
    </el-form-item>
  </el-form>
  <div class="h59"></div>

  <el-form
    ref="passformRef"
    style="max-width: 400px"
    :model="passInfo"
    label-width="auto"
  >
    <el-form-item
      label="当前密码"
      :rules="[{ required: true, message: '当前密码不能为空' }]"
      prop="current_password"
    >
      <el-input
        v-model="passInfo.current_password"
        type="password"
        autocomplete="off"
      />
    </el-form-item>

    <el-form-item
      label="新密码"
      :rules="[{ required: true, message: '新密码不能为空' }]"
      prop="password"
    >
      <el-input
        v-model="passInfo.password"
        type="password"
        autocomplete="off"
      />
    </el-form-item>

    <el-form-item
      label="确认密码"
      :rules="[{ required: true, message: '确认密码不能为空' }]"
      prop="password"
    >
      <el-input
        v-model="passInfo.password_confirmation"
        type="password"
        autocomplete="off"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitFormpass(passformRef)"
        >修改密码</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import Api from "@/services/api.ts";
const userstore = useUserStore();

const users = computed(() => {
  return userstore.users;
});
const userInfo = reactive({
  name: "",
  phone: "",
});
const passInfo = reactive({
  current_password: "",
  password: "",
  password_confirmation: "",
});

setTimeout(function () {
  userInfo.name = users.value.name;
  userInfo.phone = users.value.phone;
}, 1000);
const formRef = ref();
const passformRef = ref();

const submitForm = (formEl) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      updateUser();
    } else {
      ElMessage.warning("请输入完整");
    }
  });
};

const submitFormpass = (formEl) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      updatePass();
    } else {
      ElMessage.warning("请输入完整密码");
    }
  });
};

// 更新密码
async function updatePass() {
  let loading = ElLoading.service();

  await Api.put("/user/password", passInfo)

    .then((response) => {
      // 请求成功处理

      ElMessage.success("修改成功！");
      // userstore.users = response.data.users;
    })
    .catch((error) => {
      // 错误处理
      console.log(error);
      ElMessage.error("修改失败,请重试");
    })
    .finally(() => {
      // 无论成功失败都会执行
      loading.close();
      dialogdel.value = false;
    });
}

//修改信息
async function updateUser() {
  let loading = ElLoading.service();

  await Api.put("/user", userInfo)

    .then((response) => {
      // 请求成功处理

      ElMessage.success("修改成功！");
      userstore.users = response.data.users;
    })
    .catch((error) => {
      // 错误处理
      console.log(error);
      ElMessage.error("修改失败,请重试");
    })
    .finally(() => {
      // 无论成功失败都会执行
      loading.close();
    });
}
</script>
