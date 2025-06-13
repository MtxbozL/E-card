<script setup lang="ts">
import Navbar from './components/Navbar.vue';
</script>

<template>
  <div class="app">
    <Navbar />
    <router-view />
  </div>
</template>

<style lang="scss">
html, body, #app {
  width: 100vw;
  height: 100vh;
  min-width: 100vw;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* 主色调 */
  --primary-color: #9400D3;
  --primary-light: #b388ff;
  --primary-dark: #7c00b3;
  
  /* 暗色主题背景 */
  --background-dark: #121212;
  --background-card: #1e1e1e;
  --background-elevated: #2d2d2d;
  
  /* 文本颜色 */
  --text-primary: #ffffff;
  --text-secondary: #b3b3b3;
  --text-disabled: #757575;
  
  /* 功能色 */
  --income-color: #4caf50;
  --expense-color: #f44336;
  --balance-color: #2196f3;
  
  /* 边框和分隔线 */
  --border-color: #333333;
  --divider-color: #424242;
  
  /* 交互状态 */
  --hover-color: rgba(255, 255, 255, 0.08);
  --active-color: rgba(255, 255, 255, 0.12);
  
  /* 滚动条 */
  --scrollbar-track: #1e1e1e;
  --scrollbar-thumb: #424242;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: var(--text-primary);
  line-height: 1.6;
  overflow-x: hidden;
  background-color: var(--background-dark);
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
}

::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.app {
  min-height: 100vh;
  width: 100%;
  background-color: var(--background-dark);
  box-sizing: border-box;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  flex: 1 0 auto;
  
  /* 添加全局过渡效果 */
  transition: all 0.3s ease;
}
</style>