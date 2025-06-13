<template>
  <div class="dashboard" @wheel="handleWheel" @keydown="handleKeyDown" tabindex="0">
    <!-- 页面容器 -->
    <div class="pages-container" ref="pagesContainer">
      <!-- 第一页：记账和统计 -->
      <div class="page" id="page-1">
        <div class="page-content">
          <div class="section bill-section">
            <Bill />
          </div>
          <div class="section statistics-section">
            <Statistics />
          </div>
        </div>
      </div>
      <!-- 第二页：分类 -->
      <div class="page" id="page-2">
        <div class="page-content">
          <div class="section category-section">
            <Category />
          </div>
        </div>
      </div>
      <!-- 第三页：账户 -->
      <div class="page" id="page-3">
        <div class="page-content">
          <div class="section account-section">
            <Account />
          </div>
        </div>
      </div>
    </div>
    <!-- 滚动指示器 -->
    <div class="scroll-indicator" :class="{ 'show-down': currentPage < 2, 'show-up': currentPage > 0 }">
      <div class="arrow-icon" v-if="currentPage < 2">↓</div>
      <div class="arrow-icon" v-else>↑</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Bill from './Bill.vue';
import Statistics from './Statistics.vue';
import Account from './Account.vue';
import Category from './Category.vue';

// 当前页面索引
const currentPage = ref(0);
const pagesContainer = ref<HTMLElement | null>(null);
const isScrolling = ref(false);
const touchStartY = ref(0);

// 滚动到指定页面
const scrollToPage = (pageIndex: number) => {
  if (isScrolling.value) return;
  if (pageIndex < 0 || pageIndex > 2) return;
  isScrolling.value = true;
  currentPage.value = pageIndex;
  if (pagesContainer.value) {
    const targetPosition = pageIndex * window.innerHeight;
    pagesContainer.value.style.transform = `translateY(-${targetPosition}px)`;
    setTimeout(() => {
      isScrolling.value = false;
    }, 1000);
  }
};

// 处理鼠标滚轮事件
const handleWheel = (event: WheelEvent) => {
  event.preventDefault();
  if (isScrolling.value) return;
  if (event.deltaY > 0 && currentPage.value < 2) {
    scrollToPage(currentPage.value + 1);
  } else if (event.deltaY < 0 && currentPage.value > 0) {
    scrollToPage(currentPage.value - 1);
  }
};

// 处理键盘事件
const handleKeyDown = (event: KeyboardEvent) => {
  if (isScrolling.value) return;
  if ((event.key === 'ArrowDown' || event.key === 'PageDown') && currentPage.value < 2) {
    event.preventDefault();
    scrollToPage(currentPage.value + 1);
  } else if ((event.key === 'ArrowUp' || event.key === 'PageUp') && currentPage.value > 0) {
    event.preventDefault();
    scrollToPage(currentPage.value - 1);
  }
};

// 处理触摸事件
const handleTouchStart = (event: TouchEvent) => {
  touchStartY.value = event.touches[0].clientY;
};
const handleTouchMove = (event: TouchEvent) => {
  if (isScrolling.value) return;
  const touchY = event.touches[0].clientY;
  const diff = touchStartY.value - touchY;
  if (diff > 50 && currentPage.value < 2) {
    scrollToPage(currentPage.value + 1);
  } else if (diff < -50 && currentPage.value > 0) {
    scrollToPage(currentPage.value - 1);
  }
};

onMounted(() => {
  document.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('touchmove', handleTouchMove);
  if (pagesContainer.value) {
    pagesContainer.value.focus();
  }
});
onUnmounted(() => {
  document.removeEventListener('touchstart', handleTouchStart);
  document.removeEventListener('touchmove', handleTouchMove);
});
</script>

<style scoped lang="scss">
// 使用CSS变量引用全局暗色主题变量
$background-dark: var(--background-dark);
$background-card: var(--background-card);
$background-elevated: var(--background-elevated);
$text-primary: var(--text-primary);
$text-secondary: var(--text-secondary);
$primary-color: var(--primary-color);
$border-color: var(--border-color);
$divider-color: var(--divider-color);

.dashboard {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background-color: $background-dark;
  color: $text-primary;
  outline: none; // 移除焦点轮廓
  
  // 自定义滚动条
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--scrollbar-track);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: 4px;
  }
}

.pages-container {
  width: 100%;
  height: 100vh;
  transition: transform 1s cubic-bezier(0.645, 0.045, 0.355, 1.000);
}

.page {
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  
  // 自定义滚动条
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--scrollbar-track);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: 4px;
  }
}

.page-content {
  padding: 24px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100%;
}

.section {
  background-color: $background-card;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  }
}

.scroll-indicator {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba($background-elevated, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 90;
  opacity: 0;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  
  &.show-down, &.show-up {
    opacity: 1;
  }
  
  .arrow-icon {
    font-size: 20px;
    color: $text-primary;
    animation: bounce 2s infinite;
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-3px);
  }
}

// 深度选择器，修改子组件样式以适应暗色主题
:deep(.bill-app),
:deep(.account-manager),
:deep(.category-manager),
:deep(.statistics-app) {
  background-color: transparent !important;
  color: $text-primary !important;
  min-height: auto !important;
  padding: 20px !important;
  
  // 修改表格样式
  table {
    background-color: $background-card !important;
    
    th {
      background-color: $background-elevated !important;
      color: $text-primary !important;
    }
    
    td {
      border-color: $border-color !important;
      color: $text-primary !important;
    }
  }
  
  // 修改卡片样式
  .account-card,
  .category-item,
  .overview-card,
  .chart-container,
  .budget-item {
    background-color: $background-elevated !important;
    border-color: $border-color !important;
  }
  
  // 修改按钮样式
  button:not(.action-btn) {
    background-color: $background-elevated !important;
    color: $text-primary !important;
    
    &.active,
    &.primary {
      background-color: $primary-color !important;
      color: white !important;
    }
  }
  
  // 修改输入框样式
  input, select {
    background-color: $background-elevated !important;
    color: $text-primary !important;
    border-color: $border-color !important;
  }
  
  // 修改标签文本颜色
  label {
    color: $text-secondary !important;
  }
}
</style>