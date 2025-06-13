<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
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
  background: #2d3146;
  overflow: hidden;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #9400D3;
  --secondary-color: #b388ff;
  --background-dark: #1a1a1a;
  --text-color: #ffffff;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: var(--text-color);
  line-height: 1.6;
  overflow-x: hidden;
}

.app {
  min-height: 100vh;
  background: #2d3146;
  /* 不再需要为导航栏预留空间 */
  box-sizing: border-box;
  overflow-y: auto;
  
  /* 添加全局过渡效果 */
  transition: all 0.3s ease;
}
</style>