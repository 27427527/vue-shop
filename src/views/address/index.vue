<style scoped>
.section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #ebeef5;
}
.address-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
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
  position: relative;
}

.address-item:hover {
  border-color: #409eff;
}

.address-item.active {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.address-card.default {
  border-color: #409eff;
}
.address-default-tag {
  position: absolute;
  top: 0;
  right: 0;
  background: #409eff;
  color: white;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 0 4px 0 4px;
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

  <el-dialog v-model="dialogdefault" title="Tips" width="500">
    <span>设为默认地址吗</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogdefault = false">取消</el-button>
        <el-button type="primary" @click="addressdefault"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="dialogdel" title="Tips" width="500">
    <span>删除地址吗</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogdel = false">取消</el-button>
        <el-button type="primary" @click="dstoryaddress"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>

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
      >
        <div
          v-if="seladdress_id === address.address_id"
          class="address-default-tag"
        >
          默认
        </div>
        <div class="address-name">{{ address.name }} {{ address.phone }}</div>
        <div class="address-detail">
          {{ address.province }}{{ address.city }}{{ address.district
          }}{{ address.detail }}
        </div>

        <div class="address-actions">
          <el-button
            link
            type="primary"
            @click="editAddress(address.address_id)"
            size="small"
            >编辑</el-button
          >
          <el-button
            @click="delAddress(address.address_id)"
            link
            type="danger"
            size="small"
            >删除</el-button
          >

          <el-button
            @click="setAddress(address.address_id)"
            link
            type="success"
            size="small"
            >设为默认</el-button
          >
        </div>
      </div>

      <div class="address-item" @click="addAddress">
        <el-button type="primary" text class="add-address-btn">
          <el-icon><Plus /></el-icon>
          添加新地址
        </el-button>
      </div>
    </div>
  </div>

  <!-- 编辑地址表单 -->
  <el-dialog v-model="oldAddress" title="编辑地址" width="500">
    <el-form :model="editForm" ref="editformRef">
      <el-form-item
        label="姓  名"
        prop="name"
        :rules="[{ required: true, message: '姓名不能为空' }]"
      >
        <el-input v-model="editForm.name" type="text" autocomplete="off" />
      </el-form-item>

      <el-form-item
        label="电  话"
        prop="phone"
        :rules="[{ required: true, message: '电话不能为空' }]"
      >
        <el-input v-model="editForm.phone" type="text" autocomplete="off" />
      </el-form-item>

      <el-form-item
        label="省市区 "
        prop="city"
        :rules="[{ required: true, message: '请选择地区' }]"
      >
        <el-cascader
          style="width: 100%"
          clearable
          v-model="editForm.allcity"
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
        <el-input v-model="editForm.detail" type="text" autocomplete="off" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="oldAddress = false">取消</el-button>
        <el-button type="primary" @click="subeditForm(editformRef)">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 新地址表单 -->
  <el-dialog v-model="newAddress" title="添加新地址" width="500">
    <el-form :model="addressForm" ref="formRef">
      <el-form-item
        label="姓  名"
        prop="name"
        :rules="[{ required: true, message: '姓名不能为空' }]"
      >
        <el-input v-model="addressForm.name" type="text" autocomplete="off" />
      </el-form-item>

      <el-form-item
        label="电  话"
        prop="phone"
        :rules="[{ required: true, message: '电话不能为空' }]"
      >
        <el-input v-model="addressForm.phone" type="text" autocomplete="off" />
      </el-form-item>

      <el-form-item
        label="省市区 "
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
        <el-input v-model="addressForm.detail" type="text" autocomplete="off" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="oldAddress = false">取消</el-button>
        <el-button type="primary" @click="subeditForm(formRef)">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
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
import Api from "@/services/api.ts";
import { useUserStore } from "@/stores/user";

import { useCity } from "@/composables/useCity.js";
const userstore = useUserStore();

const address_list = computed(() => {
  return userstore.address_list;
});

const seladdress_id = ref("");
const emit = defineEmits(["sendaddress"]);

setTimeout(function () {
  let id = userstore.users.default_address_id;
  selectAddress(id);
}, 2000);

// 添加新地址
const formRef = ref();
const addressForm = reactive({
  name: "",
  phone: "",
  city: "",
  detail: "",
});
const newAddress = ref(false);
const addAddress = () => {
  newAddress.value = true;
};
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      newAddress.value = false;
      creatAddress(addressForm);
    } else {
      ElMessage.warning("请输入完整地址");
    }
  });
};

// 地址编辑
const editformRef = ref();
const editForm = ref("");
var edit_id;
const oldAddress = ref(false);
const editAddress = (id) => {
  edit_id = id;
  oldAddress.value = true;
  editForm.value = address_list.value.find((item) => item.address_id == id);

  editForm.value.allcity = [
    editForm.value.province,
    editForm.value.city,
    editForm.value.district,
  ];
};

const subeditForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      oldAddress.value = false;
      updataAddress(editForm);
    } else {
      ElMessage.warning("请输入完整地址");
    }
  });
};

// 删除地址
const dialogdel = ref(false);
var del_id;

const delAddress = (id) => {
  del_id = id;
  dialogdel.value = true;
};

// 设为默认地址
const dialogdefault = ref(false);
var default_id;
// 选中
const selectAddress = (id) => {
  seladdress_id.value = id;
};

const setAddress = (id) => {
  default_id = id;
  dialogdefault.value = true;
};

// 删除地址
async function dstoryaddress() {
  let loading = ElLoading.service();

  await Api.delete("/address/" + del_id)
    .then((response) => {
      // 请求成功处理

      ElMessage.success("删除成功！");
      userstore.address_list = response.data.address_list;
      selectAddress(default_id);
    })
    .catch((error) => {
      // 错误处理
      console.log(error);
      ElMessage.error("删除失败,请重试");
    })
    .finally(() => {
      // 无论成功失败都会执行
      loading.close();
      dialogdel.value = false;
    });
}
// 发送默认地址
async function addressdefault() {
  let loading = ElLoading.service();

  await Api.put("/address/default/" + default_id)
    .then((response) => {
      // 请求成功处理

      ElMessage.success("修改成功！");
      userstore.users = response.data.user;
      selectAddress(default_id);
    })
    .catch((error) => {
      // 错误处理
      console.log(error);
      ElMessage.error("修改失败,请重试");
    })
    .finally(() => {
      // 无论成功失败都会执行
      loading.close();
      dialogdefault.value = false;
    });
}

// 发送更新数据
async function updataAddress(editForm) {
  let loading = ElLoading.service();

  console.log(editForm);

  await Api.put("/address/" + edit_id, editForm.value)
    .then((response) => {
      // 请求成功处理

      ElMessage.success("修改成功！");
      userstore.address_list = response.data.address_list;
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

// 发送数据
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
