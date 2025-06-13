<template>
  <div class="floating-nav">
    <div class="nav-links">
      <router-link to="/services" class="nav-link" :class="{ 'active': $route.path === '/services' }">
        <span class="link-text">Services</span>
        <span v-if="$route.path === '/services'" class="dot"></span>
      </router-link>
      <router-link to="/blog" class="nav-link" :class="{ 'active': $route.path === '/blog' }">
        <span class="link-text">Blog</span>
        <span v-if="$route.path === '/blog'" class="dot"></span>
      </router-link>
      <router-link to="/works" class="nav-link" :class="{ 'active': $route.path === '/works' }">
        <span class="link-text">Works</span>
        <span v-if="$route.path === '/works'" class="dot"></span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<style scoped lang="scss">
.floating-nav {
  position: fixed;
  top: 150px;
  right: 955px;
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  
  .nav-links {
    display: flex;
    /* 增大按钮间距到3.5rem */
    gap: 3.5rem; /* 修改这里 - 增加间距 */
    /* 移除了padding */
    background: transparent; /* 完全透明背景 */
    backdrop-filter: none; /* 移除模糊效果 */
    border-radius: 0; /* 移除圆角 */
    box-shadow: none; /* 移除阴影 */
    transition: all 0.3s ease;
    
    &:hover {
      background: transparent; /* 悬停时保持透明 */
      box-shadow: none; /* 移除悬停阴影 */
    }
    
    .nav-link {
      .link-text {
        color: rgba(255, 255, 255, 0.8);
        font-size: 1.6rem;
        font-weight: 500;
        letter-spacing: 1px;
        transition: all 0.3s ease;
        position: relative;
        padding: 0.5rem 0; /* 保留垂直内边距 */
      }

      &:hover,
      &.active {
        .link-text {
          color: #FFD15C;
          letter-spacing: 1.5px;
        }
      }

      .dot {
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        width: 6px;
        height: 6px;
        background-color: #FFD15C;
        border-radius: 50%;
        display: none;
      }

      &.active .dot {
        display: block;
      }
    }
  }
}

@media (max-width: 768px) {
  .floating-nav {
    top: 20px;
    right: 20px;
    
    .nav-links {
      /* 移动端也保持较大间距 */
      gap: 2.5rem;
      /* 移除了移动端的内边距 */
    }
  }
}

@media (max-width: 480px) {
  .floating-nav {
    top: 15px;
    right: 15px;
    
    .nav-links {
      gap: 1.8rem;
      
      .nav-link .link-text {
        font-size: 1rem;
      }
    }
  }
}
</style>