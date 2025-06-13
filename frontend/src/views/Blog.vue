<template>
  <div class="blog-page">
    <!-- 顶部Banner -->
    <header class="blog-banner">
      <div class="banner-content">
        <img class="avatar" src="https://i.loli.net/2021/09/01/6Qw2Jk3Xy8vZb1R.png" alt="avatar" />
        <h1>Hi, I'm YourName</h1>
        <p>欢迎来到我的个人博客，记录技术、生活与成长。</p>
      </div>
    </header>
    <!-- 博客列表 -->
    <section class="blog-list">
      <div v-for="(post, idx) in posts" :key="idx" class="blog-card" @click="goDetail(post)">
        <div class="card-bg"></div>
        <div class="card-content">
          <h2 class="post-title">{{ post.title }}</h2>
          <p class="post-desc">{{ post.desc }}</p>
          <div class="post-meta">
            <span class="tag" v-for="tag in post.tags" :key="tag">#{{ tag }}</span>
            <span class="date">{{ post.date }}</span>
            <span class="views"><i class="fas fa-eye"></i> {{ post.views }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const posts = ref([
  {
    title: 'Vue3 + Vite 打造高性能前端项目',
    desc: '介绍如何用Vue3和Vite快速搭建现代前端项目，提升开发体验和性能。',
    tags: ['Vue3', 'Vite', '前端'],
    date: '2024-06-10',
    views: 1234
  },
  {
    title: '深入理解JavaScript异步编程',
    desc: 'Promise、async/await、事件循环，彻底搞懂JS异步机制。',
    tags: ['JavaScript', '异步', 'Promise'],
    date: '2024-06-08',
    views: 888
  },
  {
    title: 'CSS3 动画与炫酷UI设计实战',
    desc: '用CSS3实现炫酷的动效和现代UI，提升页面吸引力。',
    tags: ['CSS3', '动画', 'UI'],
    date: '2024-06-05',
    views: 666
  }
]);

const goDetail = (post: any) => {
  // 这里可跳转到详情页，暂用alert演示
  alert('点击了: ' + post.title);
};
</script>

<style scoped lang="scss">
.blog-page {
  min-height: 100vh;
  width: 100vw;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(120deg, #232526 0%, #414345 100%);
  overflow-x: hidden;
  overflow-y: auto;
}
.blog-banner {
  width: 100vw; // 保证Banner也占满宽度
  min-height: 320px;
  background: linear-gradient(100deg, #1976d2 60%, #43cea2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  .banner-content {
    text-align: center;
    color: #fff;
    .avatar {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      margin-bottom: 18px;
      border: 4px solid #fff;
      box-shadow: 0 4px 24px rgba(0,0,0,0.15);
      background: #fff;
    }
    h1 {
      font-size: 2.4rem;
      font-weight: bold;
      margin-bottom: 8px;
      letter-spacing: 2px;
    }
    p {
      font-size: 1.2rem;
      opacity: 0.92;
    }
  }
}
.blog-list {
  max-width: 900px;
  margin: -60px auto 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: center;
  padding-bottom: 60px;
}
.blog-card {
  position: relative;
  width: 320px;
  min-height: 180px;
  background: rgba(255,255,255,0.08);
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(25,118,210,0.08);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.2s;
  .card-bg {
    position: absolute;
    left: 0; top: 0; right: 0; bottom: 0;
    background: linear-gradient(120deg, #43cea2 0%, #1976d2 100%);
    opacity: 0.12;
    z-index: 1;
    transition: opacity 0.3s;
  }
  .card-content {
    position: relative;
    z-index: 2;
    padding: 28px 24px 18px 24px;
    .post-title {
      font-size: 1.3rem;
      font-weight: bold;
      color: #fff;
      margin-bottom: 10px;
      letter-spacing: 1px;
      text-shadow: 0 2px 8px rgba(25,118,210,0.08);
    }
    .post-desc {
      color: #e0e0e0;
      font-size: 1rem;
      margin-bottom: 18px;
      min-height: 44px;
    }
    .post-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px 16px;
      align-items: center;
      font-size: 0.98rem;
      .tag {
        background: linear-gradient(90deg, #43cea2 0%, #1976d2 100%);
        color: #fff;
        border-radius: 12px;
        padding: 2px 12px;
        font-size: 0.92rem;
        margin-right: 2px;
        box-shadow: 0 2px 8px rgba(25,118,210,0.08);
      }
      .date, .views {
        color: #b0bec5;
        font-size: 0.95rem;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .views i {
        font-size: 1rem;
      }
    }
  }
  &:hover {
    transform: translateY(-8px) scale(1.04) rotate(-1deg);
    box-shadow: 0 8px 32px rgba(25,118,210,0.18);
    .card-bg {
      opacity: 0.22;
    }
  }
}
@media (max-width: 1000px) {
  .blog-list {
    gap: 18px;
  }
  .blog-card {
    width: 98vw;
    max-width: 360px;
  }
}
@media (max-width: 600px) {
  .blog-banner {
    min-height: 180px;
    .banner-content {
      .avatar { width: 64px; height: 64px; }
      h1 { font-size: 1.3rem; }
      p { font-size: 0.98rem; }
    }
  }
  .blog-list {
    gap: 10px;
    padding-bottom: 30px;
  }
  .blog-card {
    min-height: 120px;
    padding: 0;
    .card-content { padding: 16px 10px 10px 10px; }
  }
}
</style>