<template>
  <div class="work-menu">
    <h2>我的工具箱</h2>
    <div class="tool-cards">
      <div class="tool-card" @click="navigateTo('/work')">
        <div class="card-icon">💰</div>
        <div class="card-content">
          <h3>个人财务管理系统</h3>
          <p>记账、预算、统计分析、账户管理</p>
        </div>
      </div>
      <!-- 未来可以在这里添加更多工具卡片 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped lang="scss">
.work-menu {
  margin: 40px auto;
  max-width: 900px;
  padding: 0 20px;
  
  h2 {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
    font-size: 28px;
  }
}

.tool-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.tool-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
  }
  
  .card-icon {
    font-size: 36px;
    margin-right: 20px;
  }
  
  .card-content {
    h3 {
      margin: 0 0 8px 0;
      color: #1976d2;
    }
    
    p {
      margin: 0;
      color: #666;
    }
  }
}
</style>
