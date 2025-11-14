<style scoped>
.section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #ebeef5;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}
.address-item {
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.address-item:hover {
  border-color: #409eff;
}

.address-item.active {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.address-name {
  font-weight: 500;
  margin-bottom: 5px;
}

.address-detail {
  color: #606266;
  font-size: 14px;
}

.add-address-btn {
  width: 100%;
  margin-top: 10px;
}
</style>

<template>
  <!-- 收货地址 -->
  <div class="section">
    <div class="section-title">
      <el-icon><Location /></el-icon>
      收货地址
    </div>

    <div class="address-list">
      <div
        class="address-item"
        :id="'address-item-' + address.address_id"
        v-for="address in address_list"
        :key="address.address_id"
        :class="{ active: seladdress_id === address.address_id }"
        @click="selectAddress(address.address_id)"
      >
        <div class="address-name">{{ address.name }} {{ address.phone }}</div>
        <div class="address-detail">
          {{ address.province }}{{ address.city }}{{ address.district
          }}{{ address.detail }}
        </div>
      </div>
    </div>

    <div class="address-item">
      <el-button
        type="primary"
        text
        @click="addAddress"
        class="add-address-btn"
      >
        <el-icon><Plus /></el-icon>
        添加新地址
      </el-button>
    </div>

    <div v-show="newAddress">
      <el-form
        ref="formRef"
        style="max-width: 600px"
        :model="addressForm"
        label-width="auto"
      >
        <el-form-item
          label="姓名"
          prop="name"
          :rules="[{ required: true, message: '姓名不能为空' }]"
        >
          <el-input v-model="addressForm.name" type="text" autocomplete="off" />
        </el-form-item>

        <el-form-item
          label="电话"
          prop="phone"
          :rules="[{ required: true, message: '电话不能为空' }]"
        >
          <el-input
            v-model="addressForm.phone"
            type="text"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item
          label="省市区"
          prop="city"
          :rules="[{ required: true, message: '请选择地区' }]"
        >
          <el-cascader
            style="width: 100%"
            clearable
            v-model="addressForm.city"
            :options="options"
            :props="props"
            @change="handleChange"
          />
        </el-form-item>

        <el-form-item
          label="详细地址"
          prop="detail"
          :rules="[{ required: true, message: '详细地址不能为空' }]"
        >
          <el-input
            v-model="addressForm.detail"
            type="text"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm(formRef)"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ShoppingCart,
  Location,
  Wallet,
  Edit,
  Document,
  Plus,
} from "@element-plus/icons-vue";
import { reactive, ref, computed, defineProps } from "vue";
import Api from "../services/api.ts";
import { useUserStore } from "@/stores/user";
import type { FormInstance } from "element-plus";
import { useCity } from "@/composables/useCity.js";
const userstore = useUserStore();
const formRef = ref<FormInstance>();

const address_list = computed(() => {
  return userstore.address_list;
});

const seladdress_id = ref("");
const emit = defineEmits(["sendaddress"]);

setTimeout(function () {
  let id = userstore.users.default_address_id;
  selectAddress(id);
}, 2000);

const addressForm = reactive({
  name: "",
  phone: "",
  city: "",
  detail: "",
});
const newAddress = ref(false);
// 添加新地址
const addAddress = () => {
  newAddress.value = !newAddress.value;
};

// 选择地址
const selectAddress = (id) => {
  seladdress_id.value = id;
  emit("sendaddress", id);
};

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      creatAddress(addressForm);
    } else {
      ElMessage.warning("请输入完整地址");
    }
  });
};

// 发送订单数据
async function creatAddress(addressForm) {
  let loading = ElLoading.service();

  await Api.post("/address", addressForm)
    .then((response) => {
      // 请求成功处理

      ElMessage.success("添加成功！");
      userstore.address_list = response.data.address_list;
      userstore.users = response.data.user;
      selectAddress(response.data.user.default_address_id);
    })
    .catch((error) => {
      // 错误处理

      ElMessage.error("添加失败,请重试");
    })
    .finally(() => {
      // 无论成功失败都会执行
      loading.close();
    });
}
const props = {
  expandTrigger: "hover" as const,
};

const handleChange = (value) => {
  //   console.log(value);
};

const { Citydata } = useCity();
const options = Citydata;
</script>
