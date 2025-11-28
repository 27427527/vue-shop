<template>
  <div class="avatar-cropper">
    <!-- 头像展示区域 -->
    <div class="avatar-preview-area">
      <div class="current-avatar">
        <img :src="users.profile_photo_url" alt="当前头像" class="avatar-img" />
        <div class="avatar-mask" @click="openFileDialog">
          <span class="change-text">更换头像</span>
        </div>
      </div>
    </div>

    <!-- 文件选择输入 -->
    <input
      type="file"
      ref="fileInputRef"
      accept="image/*"
      @change="handleFileSelect"
      class="file-input"
    />

    <!-- 裁剪模态框 -->
    <div v-if="showCropperModal" class="cropper-modal">
      <div class="cropper-dialog">
        <div class="cropper-header">
          <button class="close-btn" @click="closeCropper">×</button>
        </div>

        <div class="cropper-body">
          <div class="image-container">
            <img :src="selectedImage" ref="imageRef" alt="裁剪图片" />
          </div>

          <div class="cropper-controls">
            <div class="control-group">
              <label>缩放:</label>
              <button @click="zoom(-0.1)" class="control-btn">-</button>
              <button @click="zoom(0.1)" class="control-btn">+</button>
            </div>

            <div class="control-group">
              <label>旋转:</label>
              <button @click="rotate(-90)" class="control-btn">↺</button>
              <button @click="rotate(90)" class="control-btn">↻</button>
            </div>

            <button @click="reset" class="control-btn reset-btn">重置</button>
          </div>
        </div>

        <div class="cropper-footer">
          <button @click="closeCropper" class="btn btn-secondary">取消</button>
          <button
            @click="confirmCrop"
            :disabled="uploading"
            class="btn btn-primary"
          >
            {{ uploading ? "上传中..." : "确认" }}
          </button>
        </div>
      </div>
    </div>

    <!-- 加载遮罩 -->
    <div v-if="uploading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <div class="loading-text">头像上传中...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, inject } from "vue";
import { useUserStore } from "@/stores/user";
import "@/assets/css/cropper.css";
import Api from "@/services/api.ts";
const userstore = useUserStore();
const users = computed(() => {
  return userstore.users;
});

// 组件属性
const props = defineProps({
  aspectRatio: {
    type: Number,
    default: 1,
  },
  previewSize: {
    type: Number,
    default: 100,
  },
});

// 定义事件
const emit = defineEmits(["avatar-updated"]);

// 响应式数据
const fileInputRef = ref(null);
const imageRef = ref(null);

const cropperInstance = ref(null);
const showCropperModal = ref(false);
const uploading = ref(false);
const selectedImage = ref("");

const avatar_url = ref("");

// setTimeout(function () {

//   avatar_url.value = users.value.profile_photo_path;
// }, 100);

// 打开文件选择对话框
const openFileDialog = () => {
  fileInputRef.value?.click();
};
var file;
// 处理文件选择
const handleFileSelect = async (event) => {
  file = event.target.files[0];
  if (!file) return;

  // 验证文件
  if (!validateFile(file)) {
    event.target.value = "";
    return;
  }

  try {
    // 读取文件为 DataURL
    selectedImage.value = await readFileAsDataURL(file);
    showCropperModal.value = true;

    // 下一个 tick 初始化裁剪器
    await nextTick();
    initCropper();
  } catch (error) {
    console.error("文件读取失败:", error);
    alert("文件读取失败，请重试");
  }

  // 重置 input
  event.target.value = "";
};

// 文件验证
const validateFile = (file) => {
  const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    alert("请选择 JPEG、PNG、GIF 或 WebP 格式的图片");
    return false;
  }

  if (file.size > maxSize) {
    alert("图片大小不能超过 5MB");
    return false;
  }

  return true;
};

// 读取文件为 DataURL
const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// 初始化裁剪器
const initCropper = () => {
  if (!imageRef.value) return;

  // 销毁已有的裁剪器实例
  if (cropperInstance.value) {
    cropperInstance.value.destroy();
  }

  // 初始化新的裁剪器
  cropperInstance.value = new Cropper(imageRef.value, {
    aspectRatio: props.aspectRatio,
    viewMode: 1,

    guides: true,
    center: true,
    highlight: false,
    background: false,
    autoCropArea: 0.8,
    responsive: true,
    restore: false,
    checkCrossOrigin: false,
    checkOrientation: true,
    cropBoxMovable: true,
    cropBoxResizable: true,
    toggleDragModeOnDblclick: false,

    ready() {
      console.log("Cropper 初始化完成");
    },

    crop(event) {
      // 可以在这里获取裁剪数据
      // console.log(event.detail)
    },
  });
};

// 缩放控制
const zoom = (ratio) => {
  if (cropperInstance.value) {
    cropperInstance.value.zoom(ratio);
  }
};

// 旋转控制
const rotate = (degree) => {
  if (cropperInstance.value) {
    cropperInstance.value.rotate(degree);
  }
};

// 重置裁剪
const reset = () => {
  if (cropperInstance.value) {
    cropperInstance.value.reset();
  }
};

// 关闭裁剪模态框
const closeCropper = () => {
  showCropperModal.value = false;
  selectedImage.value = "";

  if (cropperInstance.value) {
    cropperInstance.value.destroy();
    cropperInstance.value = null;
  }
};

// 确认裁剪并上传
const confirmCrop = async () => {
  if (!cropperInstance.value) return;

  try {
    uploading.value = true;

    // 获取裁剪后的图片 blob
    cropperInstance.value
      .getCroppedCanvas({
        width: 400,
        height: 400,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      })
      .toBlob(
        async (blob) => {
          try {
            const formData = new FormData();
            formData.append("avatar", blob, `avatar_${Date.now()}.jpg`);
            formData.append("current_team_id", 1);
            // 调用上传 API（这里需要替换为你的实际 API）
            await uploadAvatar(formData);

            // 通知父组件
            // emit("avatar-updated", blob);

            // 关闭模态框
            closeCropper();
          } catch (error) {
            console.error("上传失败:", error);
            alert("头像上传失败，请重试");
          } finally {
            uploading.value = false;
          }
        },
        "image/jpeg",
        0.9
      );
  } catch (error) {
    console.error("裁剪失败:", error);
    alert("图片处理失败，请重试");
    uploading.value = false;
  }
};

// 上传头像 API（示例）
const uploadAvatar = async (formData) => {
  await Api.post("/user/avatar", formData)

    .then((response) => {
      // 请求成功处理

      ElMessage.success("修改成功！");
      userstore.users = response.data.user;
    })
    .catch((error) => {
      // 错误处理
      console.log(error);
      ElMessage.error("修改失败,请重试");
    })
    .finally(() => {
      // 无论成功失败都会执行
      // dialogdel.value = false;
    });

  // return URL.createObjectURL(formData.get("avatar"));
};

// 组件卸载时清理
onUnmounted(() => {
  if (cropperInstance.value) {
    cropperInstance.value.destroy();
  }
});
</script>

<style scoped>
.avatar-cropper {
  margin-right: 20px;
}

.avatar-preview-area {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  margin-bottom: 20px;
}

.current-avatar {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid #e1e5e9;
  transition: border-color 0.3s;
}

.current-avatar:hover {
  border-color: #1890ff;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
}

.current-avatar:hover .avatar-mask {
  opacity: 1;
}

.change-text {
  font-size: 14px;
  text-align: center;
}

.preview-container {
  text-align: center;
}

.preview-title {
  margin-bottom: 10px;
  color: #666;
  font-size: 14px;
}

.preview-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #ddd;
  background: #f5f5f5;
}

.file-input {
  display: none;
}

.cropper-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.cropper-dialog {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.cropper-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
}

.cropper-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.cropper-body {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.image-container {
  width: 100%;
  height: 400px;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
}

.image-container img {
  max-width: 100%;
  max-height: 100%;
  display: block;
}

.cropper-controls {
  display: flex;
  gap: 20px;
  align-items: center;

  padding: 5px 15px;
  background: #f9f9f9;
  border-radius: 4px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-group label {
  font-size: 14px;
  color: #666;
  margin-right: 5px;
}

.control-btn {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.control-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.reset-btn {
  margin-left: auto;
}

.cropper-footer {
  padding: 16px 20px;
  border-top: 1px solid #e8e8e8;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  min-width: 80px;
}

.btn-primary {
  background: #1890ff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #40a9ff;
}

.btn-primary:disabled {
  background: #bae7ff;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #d9d9d9;
}

.btn-secondary:hover {
  background: #e8e8e8;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

.loading-text {
  color: #666;
  font-size: 14px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
