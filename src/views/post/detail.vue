<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { usePostStore } from "@/stores/post";
import { useRoute, RouterLink, RouterView } from "vue-router";
const route = useRoute();
const poststore = usePostStore();
const post_id = ref(route.query.post_id);
poststore.getPost(post_id.value);

const post = computed(() => {
  return poststore.post;
});

const nav_list = computed(() => {
  return poststore.nav_list;
});

const cate = computed(() => {
  return poststore.cate;
});

// 使用 watch 监听 post_id 的变化
watch(
  () => route.query.post_id,
  async (newId) => {
    if (newId) {
      post_id.value = newId;
      poststore.getPost(newId);
    } else {
      // 处理 post_id 为空的情况
    }
  }
);
</script>

<template>
  <div class="h59"></div>

  <div class="container">
    <div class="main-content">
      <div class="left-side">
        <ul>
          <router-link
            v-for="item in nav_list"
            :key="item.cate_id"
            :to="'/post?cate_id=' + item.cate_id"
          >
            <li class="nav-item">
              <span :class="{ is_active: item.cate_id == post.cate_id }">{{
                item.name
              }}</span>
            </li>
          </router-link>
        </ul>
      </div>

      <div class="content">
        <div class="article-card">
          <div class="article-content">
            <h3 class="article-title">{{ post.title }}</h3>
            <div class="article-meta">
              <span>作者:本站 {{ $formatDate(post.published_at) }}</span>

              <span>阅读:{{ post.view_count }}</span>
            </div>

            <div class="article-detail" v-html="post.content"></div>
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
  line-height: 1.6;
}

.nav-item {
  height: 56px;
  line-height: 56px;
  font-size: 15px;
  font-weight: bold;
  color: #333;
  background-color: #f5f7fa;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding-left: 15px;
  margin-bottom: 5px;
}

.nav-item:hover {
  background-color: rgb(236, 245, 255);
}

.is_active {
  color: #409eff;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}
.container {
  max-width: 1320px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f7fa;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.main-content {
  display: flex;
  gap: 20px;
}

.content {
  flex: 1;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.left-side {
  width: 200px;
  flex-shrink: 1;
}

.article-list {
  margin-bottom: 20px;
}
.article-card {
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}
.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
}
.article-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}
.article-content {
  padding: 15px;
}

.article-detail {
  margin-top: 30px;
}
.article-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #303133;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-align: center;
}
.article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
  margin-bottom: 10px;
}
.article-tags {
  margin-bottom: 10px;
}

.article-actions {
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid #ebeef5;
}
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #909399;
}
.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  .article-list {
    grid-template-columns: 1fr;
  }

  .left-side {
    width: 100%;
  }
}
</style>
