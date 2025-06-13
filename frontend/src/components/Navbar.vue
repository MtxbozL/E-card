<template>
  <div class="floating-nav" v-if="isNavbarVisible">
    <div class="nav-links">
      <router-link to="/services" class="nav-link" :class="{ 'active': $route.path === '/services' }">
        <span class="link-text">Services</span>
        <span v-if="$route.path === '/services'" class="dot"></span>
      </router-link>
      <router-link to="/blog" class="nav-link" :class="{ 'active': $route.path === '/blog' }">
        <span class="link-text">Blog</span>
        <span v-if="$route.path === '/blog'" class="dot"></span>
      </router-link>
      <router-link to="/Repository" class="nav-link" :class="{ 'active': $route.path === '/Repository' }">
        <span class="link-text">Repository</span>
        <span v-if="$route.path === '/Repository'" class="dot"></span>
      </router-link>
      <!-- Works下拉菜单 -->
      <div class="nav-link works-dropdown" @mouseenter="showWorksMenu = true" @mouseleave="showWorksMenu = false">
        <span class="link-text" :class="{ 'active': $route.path.startsWith('/works') || $route.path.startsWith('/work/bill') }">Works</span>
        <span v-if="$route.path.startsWith('/works') || $route.path.startsWith('/work/bill')" class="dot"></span>
        <div v-show="showWorksMenu" class="dropdown-menu">
          <div class="dropdown-item" @click="goToBill">记账软件</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, ref } from 'vue';

const route = useRoute();
const router = useRouter();
const showWorksMenu = ref(false);

const isNavbarVisible = computed(() => {
  return router.currentRoute.value.path !== '/work/bill' 
      && router.currentRoute.value.path !== '/Repository'
      && router.currentRoute.value.path !== '/blog'
      && router.currentRoute.value.path !== '/work' ;
});

const goToBill = () => {
  showWorksMenu.value = false;
  router.push('/work/bill');
};
</script>

<style scoped lang="scss">
.floating-nav {
  position: fixed;
  top: 150px;
  right: 760px;
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

    .works-dropdown {
      position: relative;
      cursor: pointer;

      .dropdown-menu {
        position: absolute;
        top: 2.2rem;
        left: 50%;
        transform: translateX(-50%);
        min-width: 150px;
        background: linear-gradient(120deg, rgba(25,118,210,0.98) 0%, rgba(67,206,162,0.98) 100%);
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(25,118,210,0.18);
        z-index: 10;
        padding: 12px 0;
        display: block;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s cubic-bezier(.4,2,.6,1), transform 0.25s cubic-bezier(.4,2,.6,1);
      }

      &:hover .dropdown-menu, .dropdown-menu:focus, .dropdown-menu[style*="display: block"] {
        opacity: 1;
        pointer-events: auto;
        transform: translateX(-50%) translateY(8px) scale(1.04);
      }

      .dropdown-item {
        color: #fff;
        padding: 14px 32px;
        cursor: pointer;
        font-size: 1.18rem;
        border-radius: 10px;
        margin: 2px 10px;
        transition: background 0.18s, color 0.18s, transform 0.18s;
        white-space: nowrap;
        text-align: center;
        font-weight: 500;
        letter-spacing: 1px;
      }

      .dropdown-item:hover {
        background: rgba(255,255,255,0.18);
        color: #FFD15C;
        transform: scale(1.06);
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