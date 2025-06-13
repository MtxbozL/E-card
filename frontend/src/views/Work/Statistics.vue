<template>
  <div class="statistics-app">
    <div class="stats-header">
      <h2>数据统计</h2>
      <div class="time-selector">
        <select v-model="timeRange">
          <option value="month">本月</option>
          <option value="quarter">本季度</option>
          <option value="year">本年</option>
          <option value="custom">自定义</option>
        </select>
        <div v-if="timeRange === 'custom'" class="date-range">
          <input type="date" v-model="startDate" />
          <span>至</span>
          <input type="date" v-model="endDate" />
        </div>
      </div>
    </div>

    <!-- 收支概览 -->
    <div class="overview-cards">
      <div class="overview-card income">
        <div class="card-icon">💰</div>
        <div class="card-content">
          <div class="card-title">总收入</div>
          <div class="card-value">{{ totalIncome.toFixed(2) }}</div>
        </div>
      </div>
      <div class="overview-card expense">
        <div class="card-icon">💸</div>
        <div class="card-content">
          <div class="card-title">总支出</div>
          <div class="card-value">{{ totalExpense.toFixed(2) }}</div>
        </div>
      </div>
      <div class="overview-card balance">
        <div class="card-icon">📊</div>
        <div class="card-content">
          <div class="card-title">结余</div>
          <div class="card-value">{{ (totalIncome - totalExpense).toFixed(2) }}</div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="chart-container">
      <!-- 支出分类饼图 -->
      <div class="chart-card">
        <h3>支出分类占比</h3>
        <div class="pie-chart">
          <div v-for="(item, index) in expenseByCategory" :key="index" class="pie-segment"
            :style="{
              backgroundColor: getCategoryColor(item.category),
              width: '100%',
              height: '20px',
              marginBottom: '8px',
              borderRadius: '4px',
              position: 'relative'
            }">
            <div class="pie-label">
              <span class="category-name">{{ item.category }}</span>
              <span class="category-amount">{{ item.amount.toFixed(2) }}</span>
              <span class="category-percent">{{ ((item.amount / totalExpense) * 100).toFixed(1) }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 月度收支趋势 -->
      <div class="chart-card">
        <h3>收支趋势</h3>
        <div class="trend-chart">
          <div class="chart-legend">
            <div class="legend-item">
              <span class="legend-color" style="background-color: #4CAF50"></span>
              <span>收入</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background-color: #F44336"></span>
              <span>支出</span>
            </div>
          </div>
          <div class="chart-bars">
            <div v-for="(item, index) in monthlyTrend" :key="index" class="month-column">
              <div class="bar-group">
                <div class="bar income-bar" :style="{
                  height: `${(item.income / maxMonthlyAmount) * 150}px`,
                  backgroundColor: '#4CAF50'
                }"></div>
                <div class="bar expense-bar" :style="{
                  height: `${(item.expense / maxMonthlyAmount) * 150}px`,
                  backgroundColor: '#F44336'
                }"></div>
              </div>
              <div class="month-label">{{ item.month }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 收入来源分析 -->
      <div class="chart-card">
        <h3>收入来源分析</h3>
        <div class="pie-chart">
          <div v-for="(item, index) in incomeByCategory" :key="index" class="pie-segment"
            :style="{
              backgroundColor: getCategoryColor(item.category),
              width: '100%',
              height: '20px',
              marginBottom: '8px',
              borderRadius: '4px',
              position: 'relative'
            }">
            <div class="pie-label">
              <span class="category-name">{{ item.category }}</span>
              <span class="category-amount">{{ item.amount.toFixed(2) }}</span>
              <span class="category-percent">{{ ((item.amount / totalIncome) * 100).toFixed(1) }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 账户余额分布 -->
      <div class="chart-card">
        <h3>账户余额分布</h3>
        <div class="account-balance-chart">
          <div v-for="(account, index) in accounts" :key="index" class="account-bar">
            <div class="account-info">
              <span class="account-name">{{ account.name }}</span>
              <span class="account-type">{{ account.type }}</span>
            </div>
            <div class="balance-bar-container">
              <div class="balance-bar" :style="{
                width: `${(account.balance / maxAccountBalance) * 100}%`,
                backgroundColor: getAccountColor(account.type)
              }"></div>
              <span class="balance-value">{{ account.balance.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据导出 -->
    <div class="export-section">
      <h3>数据导出</h3>
      <div class="export-options">
        <button @click="exportData('csv')">导出为CSV</button>
        <button @click="exportData('excel')">导出为Excel</button>
        <button @click="exportData('pdf')">导出为PDF</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// 模拟数据
const billList = ref([
  { date: '2024-01-15', type: '支出', category: '餐饮', account: '我的现金', amount: 35, remark: '午餐' },
  { date: '2024-01-20', type: '收入', category: '工资', account: '工商银行', amount: 5000, remark: '1月工资' },
  { date: '2024-02-05', type: '支出', category: '交通', account: '微信钱包', amount: 10, remark: '地铁' },
  { date: '2024-02-10', type: '支出', category: '购物', account: '工商银行', amount: 299, remark: '衣服' },
  { date: '2024-02-15', type: '支出', category: '餐饮', account: '我的现金', amount: 45, remark: '晚餐' },
  { date: '2024-03-01', type: '收入', category: '奖金', account: '工商银行', amount: 2000, remark: '季度奖金' },
  { date: '2024-03-10', type: '支出', category: '日用', account: '微信钱包', amount: 58, remark: '日用品' },
  { date: '2024-03-15', type: '支出', category: '娱乐', account: '信用卡', amount: 150, remark: '电影' },
  { date: '2024-04-05', type: '支出', category: '住房', account: '工商银行', amount: 1500, remark: '房租' },
  { date: '2024-04-20', type: '收入', category: '工资', account: '工商银行', amount: 5000, remark: '4月工资' },
  { date: '2024-05-01', type: '支出', category: '医疗', account: '微信钱包', amount: 200, remark: '药品' },
  { date: '2024-05-15', type: '收入', category: '理财', account: '支付宝', amount: 300, remark: '基金收益' },
  { date: '2024-06-01', type: '支出', category: '餐饮', account: '我的现金', amount: 35, remark: '午餐' },
  { date: '2024-06-01', type: '收入', category: '工资', account: '工商银行', amount: 5000, remark: '6月工资' },
  { date: '2024-06-02', type: '支出', category: '交通', account: '微信钱包', amount: 10, remark: '地铁' },
  { date: '2024-06-03', type: '支出', category: '购物', account: '工商银行', amount: 299, remark: '衣服' },
  { date: '2024-06-05', type: '支出', category: '餐饮', account: '我的现金', amount: 45, remark: '晚餐' },
  { date: '2024-06-10', type: '支出', category: '日用', account: '微信钱包', amount: 58, remark: '日用品' }
]);

// 账户列表
const accounts = ref([
  { name: '我的现金', type: '现金', balance: 1000 },
  { name: '工商银行', type: '储蓄卡', balance: 5000 },
  { name: '微信钱包', type: '微信支付', balance: 500 },
  { name: '支付宝', type: '支付宝', balance: 800 },
  { name: '信用卡', type: '信用卡', balance: -2000 }
]);

// 时间范围选择
const timeRange = ref('month');
const startDate = ref('');
const endDate = ref('');

// 根据时间范围筛选账单
const filteredBills = computed(() => {
  let start, end;
  const now = new Date();
  
  switch (timeRange.value) {
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    case 'quarter':
      const quarter = Math.floor(now.getMonth() / 3);
      start = new Date(now.getFullYear(), quarter * 3, 1);
      end = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
      break;
    case 'year':
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31);
      break;
    case 'custom':
      if (startDate.value && endDate.value) {
        start = new Date(startDate.value);
        end = new Date(endDate.value);
      } else {
        // 默认显示最近30天
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
        end = now;
      }
      break;
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }
  
  // 格式化日期为字符串进行比较
  const startStr = start.toISOString().split('T')[0];
  const endStr = end.toISOString().split('T')[0];
  
  return billList.value.filter(bill => {
    return bill.date >= startStr && bill.date <= endStr;
  });
});

// 总收入
const totalIncome = computed(() => {
  return filteredBills.value
    .filter(bill => bill.type === '收入')
    .reduce((sum, bill) => sum + bill.amount, 0);
});

// 总支出
const totalExpense = computed(() => {
  return filteredBills.value
    .filter(bill => bill.type === '支出')
    .reduce((sum, bill) => sum + bill.amount, 0);
});

// 按支出分类统计
const expenseByCategory = computed(() => {
  const stats: {category: string, amount: number}[] = [];
  
  filteredBills.value
    .filter(bill => bill.type === '支出')
    .forEach(bill => {
      const existingStat = stats.find(s => s.category === bill.category);
      if (existingStat) {
        existingStat.amount += bill.amount;
      } else {
        stats.push({ category: bill.category, amount: bill.amount });
      }
    });
  
  return stats.sort((a, b) => b.amount - a.amount);
});

// 按收入分类统计
const incomeByCategory = computed(() => {
  const stats: {category: string, amount: number}[] = [];
  
  filteredBills.value
    .filter(bill => bill.type === '收入')
    .forEach(bill => {
      const existingStat = stats.find(s => s.category === bill.category);
      if (existingStat) {
        existingStat.amount += bill.amount;
      } else {
        stats.push({ category: bill.category, amount: bill.amount });
      }
    });
  
  return stats.sort((a, b) => b.amount - a.amount);
});

// 月度收支趋势
const monthlyTrend = computed(() => {
  const trend: {month: string, income: number, expense: number}[] = [];
  
  // 获取最近6个月
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
    
    const monthIncome = billList.value
      .filter(bill => bill.date.startsWith(monthStr) && bill.type === '收入')
      .reduce((sum, bill) => sum + bill.amount, 0);
    
    const monthExpense = billList.value
      .filter(bill => bill.date.startsWith(monthStr) && bill.type === '支出')
      .reduce((sum, bill) => sum + bill.amount, 0);
    
    trend.push({
      month: `${month.getMonth() + 1}月`,
      income: monthIncome,
      expense: monthExpense
    });
  }
  
  return trend;
});

// 最大月度金额（用于图表比例计算）
const maxMonthlyAmount = computed(() => {
  if (monthlyTrend.value.length === 0) return 0;
  
  return Math.max(
    ...monthlyTrend.value.map(item => Math.max(item.income, item.expense))
  );
});

// 最大账户余额（用于图表比例计算）
const maxAccountBalance = computed(() => {
  if (accounts.value.length === 0) return 0;
  
  return Math.max(
    ...accounts.value.map(account => Math.abs(account.balance))
  );
});

// 获取分类颜色
const getCategoryColor = (category: string) => {
  const colors: {[key: string]: string} = {
    '餐饮': '#FF5722',
    '交通': '#2196F3',
    '购物': '#9C27B0',
    '娱乐': '#FF9800',
    '日用': '#607D8B',
    '住房': '#795548',
    '通讯': '#00BCD4',
    '医疗': '#F44336',
    '教育': '#4CAF50',
    '工资': '#4CAF50',
    '奖金': '#8BC34A',
    '红包': '#F44336',
    '理财': '#FF9800',
    '兼职': '#03A9F4',
    '报销': '#E91E63'
  };
  
  return colors[category] || '#9E9E9E';
};

// 获取账户类型颜色
const getAccountColor = (type: string) => {
  const colors: {[key: string]: string} = {
    '现金': '#4CAF50',
    '储蓄卡': '#2196F3',
    '信用卡': '#F44336',
    '微信支付': '#07C160',
    '支付宝': '#1677FF'
  };
  
  return colors[type] || '#9E9E9E';
};

// 导出数据
const exportData = (format: string) => {
  // 实际项目中这里会实现导出功能
  alert(`数据将导出为${format.toUpperCase()}格式`);
};
</script>

<style scoped lang="scss">
.statistics-app {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
  
  h2 {
    margin: 0;
  }
  
  .time-selector {
    display: flex;
    align-items: center;
    gap: 12px;
    
    select {
      padding: 8px 12px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 16px;
    }
    
    .date-range {
      display: flex;
      align-items: center;
      gap: 8px;
      
      input {
        padding: 8px 12px;
        border: 1px solid #ced4da;
        border-radius: 4px;
      }
    }
  }
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  
  .overview-card {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    
    .card-icon {
      font-size: 32px;
      margin-right: 16px;
    }
    
    .card-content {
      .card-title {
        font-size: 14px;
        color: #6c757d;
        margin-bottom: 4px;
      }
      
      .card-value {
        font-size: 24px;
        font-weight: 600;
      }
    }
    
    &.income {
      border-left: 4px solid #4CAF50;
      .card-value { color: #4CAF50; }
    }
    
    &.expense {
      border-left: 4px solid #F44336;
      .card-value { color: #F44336; }
    }
    
    &.balance {
      border-left: 4px solid #1976D2;
      .card-value { color: #1976D2; }
    }
  }
}

.chart-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
  
  .chart-card {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    
    h3 {
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: 500;
    }
  }
}

.pie-chart {
  .pie-segment {
    .pie-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 12px;
      height: 100%;
      color: white;
      font-weight: 500;
      
      .category-name {
        flex: 1;
      }
      
      .category-amount {
        margin-right: 12px;
      }
    }
  }
}

.trend-chart {
  .chart-legend {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .legend-color {
        width: 16px;
        height: 16px;
        border-radius: 4px;
      }
    }
  }
  
  .chart-bars {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    height: 200px;
    
    .month-column {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      
      .bar-group {
        display: flex;
        gap: 4px;
        height: 150px;
        align-items: flex-end;
        margin-bottom: 8px;
        
        .bar {
          width: 20px;
          min-height: 1px;
          border-radius: 2px 2px 0 0;
        }
      }
      
      .month-label {
        font-size: 12px;
        color: #6c757d;
      }
    }
  }
}

.account-balance-chart {
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  .account-bar {
    .account-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
      
      .account-name {
        font-weight: 500;
      }
      
      .account-type {
        font-size: 12px;
        color: #6c757d;
      }
    }
    
    .balance-bar-container {
      height: 24px;
      background: #f1f1f1;
      border-radius: 4px;
      position: relative;
      overflow: hidden;
      
      .balance-bar {
        height: 100%;
        border-radius: 4px;
      }
      
      .balance-value {
        position: absolute;
        right: 8px;
        top: 0;
        height: 100%;
        display: flex;
        align-items: center;
        font-weight: 500;
        color: #fff;
        text-shadow: 0 0 2px rgba(0,0,0,0.5);
      }
    }
  }
}

.export-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  
  h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 18px;
    font-weight: 500;
  }
  
  .export-options {
    display: flex;
    gap: 12px;
    
    button {
      padding: 8px 16px;
      background: #1976d2;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      
      &:hover {
        background: #1565c0;
      }
    }
  }
}
</style>