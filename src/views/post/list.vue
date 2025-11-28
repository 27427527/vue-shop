<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { usePostStore } from "@/stores/post";
import { useRoute, RouterLink, RouterView } from "vue-router";
const route = useRoute();
const poststore = usePostStore();
const cate_id = ref(route.query.cate_id);
poststore.getPostlist(cate_id.value);

const post_list = computed(() => {
  return poststore.post_list;
});

const nav_list = computed(() => {
  return poststore.nav_list;
});

const cate = computed(() => {
  return poststore.cate;
});

// 使用 watch 监听 cate_id 的变化
watch(
  () => route.query.cate_id,
  async (newId) => {
    if (newId) {
      cate_id.value = newId;
      poststore.getPostlist(newId);
    } else {
      // 处理 cate_id 为空的情况
    }
  }
);
const articles = ref([]);
// 初始化文章数据

articles.value = [
  {
    id: 1,
    title: "Vue3 Composition API 完全指南",
    author: "张三",
    publishDate: "2023-10-15",
    category: 1,
    tags: ["Vue.js", "JavaScript", "前端"],
    summary:
      "本文详细介绍了Vue3的Composition API，包括响应式系统、生命周期钩子、以及如何在实际项目中使用Composition API来组织代码。",
    coverImage: "https://via.placeholder.com/300x160/409EFF/FFFFFF?text=Vue3",
    status: "published",
  },
  {
    id: 2,
    title: "Element Plus 组件库使用技巧",
    author: "李四",
    publishDate: "2023-10-10",
    category: 1,
    tags: ["Vue.js", "Element Plus", "UI框架"],
    summary:
      "Element Plus是一个基于Vue3的桌面端组件库，本文分享一些使用Element Plus的高级技巧和最佳实践。",
    coverImage:
      "https://via.placeholder.com/300x160/67C23A/FFFFFF?text=Element+Plus",
    status: "published",
  },
  {
    id: 3,
    title: "探索JavaScript ES2023新特性",
    author: "王五",
    publishDate: "2023-09-28",
    category: 1,
    tags: ["JavaScript", "ES2023"],
    summary:
      "JavaScript每年都会发布新版本，本文将带你了解ES2023中引入的新特性，以及如何在项目中使用它们。",
    coverImage:
      "https://via.placeholder.com/300x160/E6A23C/FFFFFF?text=JavaScript",
    status: "published",
  },
  {
    id: 4,
    title: "我的日本旅行日记",
    author: "赵六",
    publishDate: "2023-10-05",
    category: 3,
    tags: ["旅行", "日本", "游记"],
    summary:
      "记录我在日本两周的旅行经历，包括东京、大阪、京都等城市的景点推荐和旅行小贴士。",
    coverImage: "https://via.placeholder.com/300x160/F56C6C/FFFFFF?text=旅行",
    status: "published",
  },
  {
    id: 5,
    title: "家庭烘焙入门指南",
    author: "钱七",
    publishDate: "2023-09-20",
    category: 4,
    tags: ["美食", "烘焙", "教程"],
    summary:
      "从零开始学习家庭烘焙，分享简单易学的面包、蛋糕和饼干制作方法，适合烘焙新手。",
    coverImage: "https://via.placeholder.com/300x160/909399/FFFFFF?text=美食",
    status: "published",
  },
  {
    id: 6,
    title: "CSS Grid布局完全指南",
    author: "孙八",
    publishDate: "2023-09-15",
    category: 1,
    tags: ["CSS", "布局", "前端"],
    summary:
      "CSS Grid是一种强大的二维布局系统，本文详细介绍Grid布局的基本概念和实际应用案例。",
    coverImage:
      "https://via.placeholder.com/300x160/409EFF/FFFFFF?text=CSS+Grid",
    status: "draft",
  },
];
</script>

<template>
  <div class="article-list">
    <div v-for="article in articles" :key="article.id" class="article-card">
      <img
        :src="article.coverImage"
        :alt="article.title"
        class="article-image"
      />
      <div class="article-content">
        <h3 class="article-title">{{ article.title }}</h3>
        <div class="article-meta">
          <span>{{ article.author }}</span>
          <span>{{ article.publishDate }}</span>
        </div>
        <div class="article-tags">
          <el-tag v-for="tag in article.tags" :key="tag" size="small">
            {{ tag }}
          </el-tag>
        </div>
        <p class="article-summary">{{ article.summary }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  color: #333;
  line-height: 1.6;
}

.is-active {
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

.main-container {
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
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
.article-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #303133;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
.article-summary {
  font-size: 14px;
  color: #606266;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
  .filter-row {
    flex-direction: column;
  }
  .article-list {
    grid-template-columns: 1fr;
  }
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
