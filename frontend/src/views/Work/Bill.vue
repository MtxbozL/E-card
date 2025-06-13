<template>
  <div class="bill-app">
    <div class="bill-header">
      <div class="bill-controls">
        <input type="month" v-model="billMonth" />
        <div class="bill-type-tab">
          <button :class="{active: billTypeTab === '全部'}" @click="billTypeTab = '全部'">全部</button>
          <button :class="{active: billTypeTab === '支出'}" @click="billTypeTab = '支出'">支出</button>
          <button :class="{active: billTypeTab === '收入'}" @click="billTypeTab = '收入'">收入</button>
        </div>
      </div>
      <div class="bill-summary">
        <div class="summary-item income">
          <span class="label">收入</span>
          <span class="amount">{{ monthIncome.toFixed(2) }}</span>
        </div>
        <div class="summary-item expense">
          <span class="label">支出</span>
          <span class="amount">{{ monthExpense.toFixed(2) }}</span>
        </div>
        <div class="summary-item balance">
          <span class="label">结余</span>
          <span class="amount">{{ (monthIncome - monthExpense).toFixed(2) }}</span>
        </div>
        <div class="summary-item account">
          <span class="label">账户余额</span>
          <span class="amount">{{ getTotalBalance().toFixed(2) }}</span>
        </div>
      </div>
      <button class="add-bill-btn" @click="openBillModal">添加账单</button>
    </div>

    <!-- 账单筛选 -->
    <div class="bill-filter">
      <div class="filter-item">
        <label>账户：</label>
        <select v-model="filterAccount">
          <option value="">全部账户</option>
          <option v-for="account in accounts" :key="account.name" :value="account.name">{{ account.name }}</option>
        </select>
      </div>
      <div class="filter-item">
        <label>分类：</label>
        <select v-model="filterCategory">
          <option value="">全部分类</option>
          <option v-for="cat in allCategories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      <div class="filter-item">
        <label>关键词：</label>
        <input type="text" v-model="filterKeyword" placeholder="搜索备注..." />
      </div>
    </div>

    <!-- 账单列表 -->
    <div class="bill-list-container">
      <table class="bill-list">
        <thead>
          <tr>
            <th>日期</th>
            <th>类型</th>
            <th>分类</th>
            <th>账户</th>
            <th>金额</th>
            <th>备注</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(bill, idx) in paginatedBills" :key="idx">
            <td>{{ bill.date }}</td>
            <td>{{ bill.type }}</td>
            <td>{{ bill.category }}</td>
            <td>{{ bill.account }}</td>
            <td :style="{color: bill.type === '支出' ? 'red' : 'green'}">
              {{ bill.type === '支出' ? '-' : '+' }}{{ bill.amount.toFixed(2) }}
            </td>
            <td>{{ bill.remark }}</td>
            <td class="bill-actions">
              <button @click="editBill(getOriginalIndex(idx))">编辑</button>
              <button @click="deleteBill(getOriginalIndex(idx))">删除</button>
            </td>
          </tr>
          <tr v-if="filteredBills.length === 0">
            <td colspan="7" class="no-data">暂无账单数据</td>
          </tr>
        </tbody>
      </table>
      
      <!-- 分页控件 -->
      <div class="pagination" v-if="filteredBills.length > pageSize">
        <button 
          class="page-btn prev" 
          :disabled="currentPage === 1" 
          @click="currentPage--"
        >
          &lt;
        </button>
        
        <button 
          v-for="page in totalPages" 
          :key="page" 
          :class="['page-btn', { active: page === currentPage }]"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
        
        <button 
          class="page-btn next" 
          :disabled="currentPage === totalPages" 
          @click="currentPage++"
        >
          &gt;
        </button>
      </div>
    </div>

    <!-- 数据统计 -->
    <div class="bill-stats">
      <h3>本月支出分类统计</h3>
      <div class="stats-container">
        <!-- 左侧柱状图 -->
        <div class="stats-chart">
          <div v-for="(stat, idx) in categoryStats" :key="idx" class="stat-item">
            <div class="stat-bar">
              <div class="stat-bar-inner" :style="{
                width: `${(stat.amount / maxCategoryAmount) * 100}%`,
                backgroundColor: getCategoryColor(stat.category)
              }"></div>
            </div>
            <div class="stat-info">
              <span class="stat-category">{{ stat.category }}</span>
              <span class="stat-amount">{{ stat.amount.toFixed(2) }}</span>
              <span class="stat-percent">{{ ((stat.amount / monthExpense) * 100).toFixed(1) }}%</span>
            </div>
          </div>
        </div>
        
        <!-- 右侧饼图 -->
        <div class="stats-pie-chart" v-if="categoryStats.length > 0">
          <div class="pie-container">
            <div class="pie-chart" :style="{ background: getPieChartBackground() }"></div>
            <div class="pie-legend">
              <div v-for="(stat, idx) in categoryStats" :key="idx" class="legend-item">
                <div class="color-box" :style="{ backgroundColor: getCategoryColor(stat.category) }"></div>
                <span>{{ stat.category }}: {{ (stat.amount / monthExpense * 100).toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑账单弹窗 -->
    <div v-if="showBillModal" class="modal-mask">
      <div class="modal-container">
        <h3>{{ isEditing ? '编辑账单' : '添加账单' }}</h3>
        <form @submit.prevent="saveBill">
          <div>
            <label>日期：</label>
            <input type="date" v-model="billForm.date" required />
          </div>
          <div>
            <label>类型：</label>
            <select v-model="billForm.type">
              <option value="支出">支出</option>
              <option value="收入">收入</option>
            </select>
          </div>
          <div>
            <label>分类：</label>
            <select v-model="billForm.category" required>
              <option v-for="cat in billCategories[billForm.type as '支出' | '收入']" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div>
            <label>账户：</label>
            <select v-model="billForm.account" required>
              <option v-for="account in accounts" :key="account.name" :value="account.name">{{ account.name }}</option>
            </select>
          </div>
          <div>
            <label>金额：</label>
            <input type="number" v-model="billForm.amount" required min="0.01" step="0.01" />
          </div>
          <div>
            <label>备注：</label>
            <input type="text" v-model="billForm.remark" />
          </div>
          <div class="modal-actions">
            <button type="submit">保存</button>
            <button type="button" @click="closeBillModal">取消</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 预算管理 -->
    <div class="budget-section">
      <div class="budget-header">
        <h3>预算管理</h3>
        <button @click="openBudgetModal" class="add-budget-btn">设置预算</button>
      </div>
      <div class="budget-items-container">
        <div class="budget-items">
          <div v-for="(budget, idx) in budgets" :key="idx" class="budget-item">
            <div class="budget-info">
              <span class="budget-category">{{ budget.category }}</span>
              <div class="budget-actions">
                <span class="budget-amount">{{ getUsedBudget(budget.category) }} / {{ budget.amount }}</span>
                <button class="delete-budget-btn" @click="deleteBudget(idx)" title="删除预算">
                  <span>×</span>
                </button>
              </div>
            </div>
            <div class="budget-progress">
              <div class="budget-bar">
                <div 
                  class="budget-bar-inner" 
                  :style="{
                    width: `${Math.min((getUsedBudget(budget.category) / budget.amount) * 100, 100)}%`,
                    backgroundColor: getBudgetColor(getUsedBudget(budget.category) / budget.amount)
                  }"
                ></div>
              </div>
              <span class="budget-percent">{{ ((getUsedBudget(budget.category) / budget.amount) * 100).toFixed(0) }}%</span>
            </div>
          </div>
          <div v-if="budgets.length === 0" class="no-budget">
            暂无预算设置，点击"设置预算"按钮添加
          </div>
        </div>
      </div>
    </div>

    <!-- 预算设置弹窗 -->
    <div v-if="showBudgetModal" class="modal-mask">
      <div class="modal-container">
        <h3>设置预算</h3>
        <form @submit.prevent="saveBudget">
          <div>
            <label>分类：</label>
            <select v-model="budgetForm.category" required>
              <option v-for="cat in billCategories['支出']" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div>
            <label>预算金额：</label>
            <input type="number" v-model="budgetForm.amount" required min="1" step="1" />
          </div>
          <div>
            <label>周期：</label>
            <select v-model="budgetForm.period">
              <option value="month">每月</option>
              <option value="week">每周</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="submit">保存</button>
            <button type="button" @click="closeBudgetModal">取消</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Bill {
  date: string;
  type: '支出' | '收入';
  category: string;
  account: string;
  amount: number;
  remark: string;
}

interface Account {
  name: string;
  type: string;
  balance: number;
}

interface Budget {
  category: string;
  amount: number;
  period: 'month' | 'week';
}

// 账单列表
const billList = ref<Bill[]>([
  { date: '2024-06-01', type: '支出', category: '餐饮', account: '我的现金', amount: 35, remark: '午餐' },
  { date: '2024-06-01', type: '收入', category: '工资', account: '工商银行', amount: 5000, remark: '6月工资' },
  { date: '2024-06-02', type: '支出', category: '交通', account: '微信钱包', amount: 10, remark: '地铁' },
  { date: '2024-06-03', type: '支出', category: '购物', account: '工商银行', amount: 299, remark: '衣服' },
  { date: '2024-06-05', type: '支出', category: '餐饮', account: '我的现金', amount: 45, remark: '晚餐' },
  { date: '2024-06-05', type: '支出', category: '餐饮', account: '我的现金', amount: 45, remark: '晚餐' },
  { date: '2024-06-05', type: '支出', category: '餐饮', account: '我的现金', amount: 45, remark: '晚餐' },
  { date: '2024-06-05', type: '支出', category: '餐饮', account: '我的现金', amount: 45, remark: '晚餐' },
  { date: '2024-06-05', type: '支出', category: '餐饮', account: '我的现金', amount: 45, remark: '晚餐' },
  { date: '2024-06-05', type: '支出', category: '餐饮', account: '我的现金', amount: 45, remark: '晚餐' },
  { date: '2024-06-05', type: '支出', category: '餐饮', account: '我的现金', amount: 45, remark: '晚餐' },
  { date: '2024-06-05', type: '支出', category: '餐饮', account: '我的现金', amount: 45, remark: '晚餐' },
  { date: '2024-06-05', type: '支出', category: '餐饮', account: '我的现金', amount: 45, remark: '晚餐' },
  { date: '2024-06-05', type: '支出', category: '餐饮', account: '我的现金', amount: 45, remark: '晚餐' },
  { date: '2024-06-05', type: '支出', category: '餐饮', account: '我的现金', amount: 45, remark: '晚餐' },
  { date: '2024-06-05', type: '支出', category: '餐饮', account: '我的现金', amount: 45, remark: '晚餐' },
  { date: '2024-06-05', type: '支出', category: '餐饮', account: '我的现金', amount: 45, remark: '晚餐' },
  { date: '2024-06-05', type: '支出', category: '餐饮', account: '我的现金', amount: 45, remark: '晚餐' },
  { date: '2024-06-05', type: '支出', category: '餐饮', account: '我的现金', amount: 45, remark: '晚餐' },
  { date: '2024-06-05', type: '支出', category: '餐饮', account: '我的现金', amount: 45, remark: '晚餐' },
  { date: '2024-06-10', type: '支出', category: '日用', account: '微信钱包', amount: 58, remark: '日用品' }
]);

// 账户列表
const accounts = ref<Account[]>([
  { name: '我的现金', type: '现金', balance: 1000 },
  { name: '工商银行', type: '储蓄卡', balance: 5000 },
  { name: '微信钱包', type: '微信支付', balance: 500 }
]);

// 预算列表
const budgets = ref<Budget[]>([
  { category: '餐饮', amount: 1000, period: 'month' },
  { category: '交通', amount: 300, period: 'month' },
  { category: '购物', amount: 500, period: 'month' }
]);

// 账单表单
const billForm = ref<Bill>({
  date: '',
  type: '支出',
  category: '',
  account: '',
  amount: 0,
  remark: ''
});

// 预算表单
const budgetForm = ref<Budget>({
  category: '',
  amount: 0,
  period: 'month'
});

// 控制弹窗显示
const showBillModal = ref(false);
const showBudgetModal = ref(false);
const isEditing = ref(false);
const editingIndex = ref(-1);

// 筛选条件
const billMonth = ref('2024-06');
const billTypeTab = ref('全部');
const filterAccount = ref('');
const filterCategory = ref('');
const filterKeyword = ref('');

// 分页相关
const currentPage = ref(1);
const pageSize = ref(15);

// 分类列表
const billCategories = {
  支出: ['餐饮', '交通', '购物', '娱乐', '日用', '住房', '通讯', '医疗', '教育', '其他'],
  收入: ['工资', '奖金', '红包', '理财', '兼职', '报销', '其他']
};

// 所有分类列表
const allCategories = computed(() => {
  return [...billCategories['支出'], ...billCategories['收入']];
});

// 筛选后的账单列表
const filteredBills = computed(() => {
  return billList.value.filter(b => {
    const matchType = billTypeTab.value === '全部' || b.type === billTypeTab.value;
    const matchMonth = b.date.startsWith(billMonth.value);
    const matchAccount = !filterAccount.value || b.account === filterAccount.value;
    const matchCategory = !filterCategory.value || b.category === filterCategory.value;
    const matchKeyword = !filterKeyword.value || b.remark.includes(filterKeyword.value);
    return matchType && matchMonth && matchAccount && matchCategory && matchKeyword;
  });
});

// 月度收入
const monthIncome = computed(() => {
  return billList.value
    .filter(b => b.date.startsWith(billMonth.value) && b.type === '收入')
    .reduce((sum, b) => sum + b.amount, 0);
});

// 月度支出
const monthExpense = computed(() => {
  return billList.value
    .filter(b => b.date.startsWith(billMonth.value) && b.type === '支出')
    .reduce((sum, b) => sum + b.amount, 0);
});

// 分类统计
const categoryStats = computed(() => {
  const stats: {category: string, amount: number}[] = [];
  
  // 按分类汇总支出
  billList.value
    .filter(b => b.date.startsWith(billMonth.value) && b.type === '支出')
    .forEach(bill => {
      const existingStat = stats.find(s => s.category === bill.category);
      if (existingStat) {
        existingStat.amount += bill.amount;
      } else {
        stats.push({ category: bill.category, amount: bill.amount });
      }
    });
  
  // 按金额降序排序
  return stats.sort((a, b) => b.amount - a.amount);
});

// 最大分类金额
const maxCategoryAmount = computed(() => {
  if (categoryStats.value.length === 0) return 0;
  return categoryStats.value[0].amount;
});

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredBills.value.length / pageSize.value);
});

// 当前页的账单数据
const paginatedBills = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredBills.value.slice(start, end);
});

// 获取原始索引（用于编辑和删除操作）
const getOriginalIndex = (paginatedIndex: number) => {
  const start = (currentPage.value - 1) * pageSize.value;
  return start + paginatedIndex;
};

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
    '教育': '#4CAF50'
  };
  
  return colors[category] || '#9E9E9E';
};

// 获取所有账户总余额
const getTotalBalance = () => {
  return accounts.value.reduce((sum, account) => sum + account.balance, 0);
};

// 监听筛选条件变化，重置分页到第一页
watch([billTypeTab, billMonth, filterAccount, filterCategory, filterKeyword], () => {
  currentPage.value = 1;
});

// 获取已使用预算
const getUsedBudget = (category: string) => {
  return billList.value
    .filter(b => b.date.startsWith(billMonth.value) && b.type === '支出' && b.category === category)
    .reduce((sum, b) => sum + b.amount, 0);
};

// 获取预算进度颜色
const getBudgetColor = (ratio: number) => {
  if (ratio < 0.7) return '#4CAF50';
  if (ratio < 0.9) return '#FF9800';
  return '#F44336';
};

// 打开添加账单弹窗
const openBillModal = () => {
  billForm.value = { 
    date: new Date().toISOString().split('T')[0], 
    type: '支出', 
    category: billCategories['支出'][0], 
    account: accounts.value[0]?.name || '',
    amount: 0, 
    remark: '' 
  };
  isEditing.value = false;
  showBillModal.value = true;
};

// 关闭账单弹窗
const closeBillModal = () => {
  showBillModal.value = false;
};

// 编辑账单
const editBill = (index: number) => {
  const bill = filteredBills.value[index];
  const originalIndex = billList.value.findIndex(b => 
    b.date === bill.date && 
    b.type === bill.type && 
    b.category === bill.category && 
    b.amount === bill.amount && 
    b.remark === bill.remark
  );
  
  if (originalIndex !== -1) {
    billForm.value = { ...billList.value[originalIndex] };
    editingIndex.value = originalIndex;
    isEditing.value = true;
    showBillModal.value = true;
  }
};

// 删除账单
const deleteBill = (index: number) => {
  const bill = filteredBills.value[index];
  const originalIndex = billList.value.findIndex(b => 
    b.date === bill.date && 
    b.type === bill.type && 
    b.category === bill.category && 
    b.amount === bill.amount && 
    b.remark === bill.remark
  );
  
  if (originalIndex !== -1) {
    billList.value.splice(originalIndex, 1);
  }
};

// 保存账单
const saveBill = () => {
  if (isEditing.value) {
    billList.value[editingIndex.value] = { ...billForm.value };
  } else {
    billList.value.push({ ...billForm.value });
  }
  showBillModal.value = false;
};

// 打开预算设置弹窗
const openBudgetModal = () => {
  budgetForm.value = {
    category: billCategories['支出'][0],
    amount: 0,
    period: 'month'
  };
  showBudgetModal.value = true;
};

// 关闭预算弹窗
const closeBudgetModal = () => {
  showBudgetModal.value = false;
};

// 保存预算
const saveBudget = () => {
  // 检查是否已存在该分类的预算
  const existingIndex = budgets.value.findIndex(b => b.category === budgetForm.value.category);
  
  if (existingIndex !== -1) {
    // 更新现有预算
    budgets.value[existingIndex] = { ...budgetForm.value };
  } else {
    // 添加新预算
    budgets.value.push({ ...budgetForm.value });
  }
  
  showBudgetModal.value = false;
};

// 删除预算
const deleteBudget = (index: number) => {
  if (confirm('确定要删除这个预算吗？')) {
    budgets.value.splice(index, 1);
  }
};

// 生成饼图背景 - 使用conic-gradient
const getPieChartBackground = () => {
  if (categoryStats.value.length === 0) return 'none';
  
  let totalAmount = categoryStats.value.reduce((sum, stat) => sum + stat.amount, 0);
  let gradientString = 'conic-gradient(';
  let startPercent = 0;
  
  categoryStats.value.forEach((stat, index) => {
    const percent = (stat.amount / totalAmount) * 100;
    const endPercent = startPercent + percent;
    const color = getCategoryColor(stat.category);
    
    gradientString += `${color} ${startPercent}% ${endPercent}%`;
    
    if (index < categoryStats.value.length - 1) {
      gradientString += ', ';
    }
    
    startPercent = endPercent;
  });
  
  gradientString += ')';
  return gradientString;
};
</script>

<style scoped lang="scss">
.bill-app {
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2.5fr 1fr;
  grid-template-areas: 
    "header header"
    "filter filter"
    "list stats"
    "list budget";
  gap: 24px;
  
  @media (min-width: 1600px) {
    max-width: 1600px;
    grid-template-columns: 2.7fr 1fr;
  }
}

.bill-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 24px;
  grid-area: header;
  
  .bill-controls {
    display: flex;
    align-items: center;
    gap: 16px;
    
    input[type="month"] {
      padding: 8px 12px;
      border: 1px solid var(--border-color, #333);
      border-radius: 8px;
      background-color: var(--background-elevated, #2d2d2d);
      color: var(--text-primary, #fff);
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      
      &:hover, &:focus {
        border-color: var(--primary-color, #9400D3);
        box-shadow: 0 2px 8px rgba(148, 0, 211, 0.3);
        outline: none;
      }
      
      &::-webkit-calendar-picker-indicator {
        filter: invert(1);
        cursor: pointer;
      }
    }
  }
  
  .bill-type-tab button {
    margin-right: 5px;
    padding: 8px 16px;
    border: none;
    background: var(--background-elevated, #2d2d2d);
    color: var(--text-secondary, #b3b3b3);
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    
    &:hover {
      background: var(--background-card, #1e1e1e);
      color: var(--text-primary, #fff);
    }
    
    &.active {
      background: var(--primary-color, #9400D3);
      color: #fff;
      box-shadow: 0 2px 8px rgba(148, 0, 211, 0.3);
    }
  }
  
  .bill-summary {
    display: flex;
    gap: 16px;
    
    .summary-item {
      padding: 12px 20px;
      border-radius: 12px;
      background: var(--background-elevated, #2d2d2d);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
      }
      
      .label {
        font-size: 12px;
        color: #6c757d;
        display: block;
      }
      
      .amount {
        font-size: 18px;
        font-weight: 600;
      }
      
      &.income .amount {
        color: var(--income-color, #4caf50);
        text-shadow: 0 0 2px rgba(76, 175, 80, 0.5);
      }
      
      &.expense .amount {
        color: var(--expense-color, #f44336);
        text-shadow: 0 0 2px rgba(244, 67, 54, 0.5);
      }
      
      &.balance .amount {
        color: var(--balance-color, #2196f3);
        text-shadow: 0 0 3px rgba(33, 150, 243, 0.7);
        font-weight: 700;
        font-size: 20px;
      }
      
      &.account .amount {
        color: var(--account-color, #1e88e5);
        text-shadow: 0 0 2px rgba(30, 136, 229, 0.5);
      }
    }
  }
  
  .add-bill-btn {
    margin-left: auto;
    background: #1976d2;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
  }
}

.bill-filter {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  grid-area: filter;
  
  .filter-item {
    display: flex;
    align-items: center;
    gap: 8px;
    
    label {
      font-size: 14px;
      color: #6c757d;
    }
    
    select, input {
      padding: 6px 12px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      min-width: 120px;
    }
  }
}

.bill-list-container {
  grid-area: list;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 30px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, transparent, var(--primary-color, #9400D3), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::after {
    opacity: 0.7;
  }
}

.bill-list {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--background-elevated, #2d2d2d);
  border-radius: 16px;
  overflow: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  max-height: 600px;
  
  /* 自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--background-base, #1a1a1a);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--primary-color, #9400D3);
    border-radius: 3px;
    
    &:hover {
      background: #7b00ad;
    }
  }
  
  th, td {
    border: 1px solid #dee2e6;
    padding: 12px;
    text-align: left;
  }
  
  th {
    background-color: var(--background-elevated, #2d2d2d);
    font-weight: 500;
    position: sticky;
    top: 0;
    z-index: 1;
    box-shadow: 0 1px 0 #dee2e6;
  }
  
  .bill-actions {
    display: flex;
    gap: 8px;
    
    button {
      padding: 4px 8px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s ease;
      
      &:first-child {
        background: var(--background-base, #1a1a1a);
        color: var(--text-primary, #fff);
        
        &:hover {
          background: var(--primary-color, #9400D3);
        }
      }
      
      &:last-child {
        background: rgba(244, 67, 54, 0.2);
        color: var(--expense-color, #f44336);
        
        &:hover {
          background: rgba(244, 67, 54, 0.4);
        }
      }
    }
  }
  
  .no-data {
    text-align: center;
    padding: 20px;
    color: #6c757d;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  
  .page-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: none;
    background: var(--background-elevated, #2d2d2d);
    color: var(--text-primary, #fff);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    
    &:hover:not(:disabled) {
      background: var(--background-card, #1e1e1e);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }
    
    &.active {
      background: var(--primary-color, #9400D3);
      color: #fff;
      box-shadow: 0 2px 8px rgba(148, 0, 211, 0.3);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    &.prev, &.next {
      font-weight: bold;
    }
  }
}

.bill-stats {
  margin-bottom: 30px;
  margin-top: -18px;
  grid-area: stats;
  background-color: var(--background-elevated, #2d2d2d);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  
  h3 {
    margin-bottom: 16px;
    font-size: 18px;
    font-weight: 500;
    color: var(--text-primary, #fff);
  }
  
  .stats-container {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
  }
  
  .stats-chart {
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
    min-width: 300px;
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .stat-bar {
      flex: 1;
      height: 24px;
      background: var(--background-elevated, #2d2d2d);
      border-radius: 4px;
      overflow: hidden;
      
      .stat-bar-inner {
        height: 100%;
        border-radius: 4px;
        transition: width 0.5s ease-out;
      }
    }
    
    .stat-info {
      width: 200px;
      display: flex;
      justify-content: space-between;
      
      .stat-category {
        font-weight: 500;
        color: var(--text-primary, #fff);
      }
      
      .stat-amount {
        color: var(--text-secondary, #b3b3b3);
      }
      
      .stat-percent {
        font-weight: 500;
        color: var(--text-primary, #fff);
      }
    }
  }
  
  .stats-pie-chart {
    flex: 1;
    min-width: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .pie-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
    
    .pie-chart {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      position: relative;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      transition: transform 0.3s ease;
      
      &:hover {
        transform: scale(1.05);
      }
    }
    
    .pie-legend {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 250px;
      
      .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: var(--text-secondary, #b3b3b3);
        
        .color-box {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }
      }
    }
  }
}

.budget-section {
  margin-bottom: 30px;
  margin-top: -18px;
  grid-area: budget;
  background-color: var(--background-elevated, #2d2d2d);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  
  .budget-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    h3 {
      font-size: 18px;
      font-weight: 500;
      margin: 0;
      color: var(--text-primary, #fff);
    }
    
    .add-budget-btn {
      background: var(--primary-color, #9400D3);
      color: #fff;
      border: none;
      padding: 6px 14px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      
      &:hover {
        background-color: #7b00ad;
        box-shadow: 0 2px 8px rgba(148, 0, 211, 0.3);
        transform: translateY(-1px);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
  }
  
  .budget-items-container {
    max-height: 300px;
    overflow-y: auto;
    padding-right: 8px;
    
    /* 自定义滚动条样式 */
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: var(--background-elevated, #2d2d2d);
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--primary-color, #9400D3);
      border-radius: 3px;
      
      &:hover {
        background: #7b00ad;
      }
    }
  }
  
  .budget-items {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .budget-item {
    background: var(--background-elevated, #2d2d2d);
    padding: 16px;
    border-radius: 8px;
    
    .budget-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      
      .budget-category {
        font-weight: 500;
        color: var(--text-primary, #fff);
      }
      
      .budget-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
    
    .budget-progress {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .budget-bar {
        flex: 1;
        height: 8px;
        background: var(--background-base, #1a1a1a);
        border-radius: 4px;
        overflow: hidden;
        
        .budget-bar-inner {
          height: 100%;
          border-radius: 4px;
        }
      }
      
      .budget-percent {
        font-size: 14px;
        font-weight: 500;
        min-width: 40px;
        text-align: right;
        color: var(--text-primary, #fff);
      }
    }
  }
  
  .delete-budget-btn {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--expense-color, #f44336);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 14px;
    cursor: pointer;
    opacity: 0.7;
    transition: all 0.2s ease;
    
    &:hover {
      opacity: 1;
      transform: scale(1.1);
    }
  }
  
  .no-budget {
    text-align: center;
    padding: 20px;
    color: var(--text-secondary, #b3b3b3);
    background: var(--background-elevated, #2d2d2d);
    border-radius: 8px;
  }
}

.modal-mask {
  position: fixed;
  z-index: 9999;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-container {
  background: var(--background-elevated, #2d2d2d);
  padding: 24px 32px;
  border-radius: 12px;
  min-width: 320px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  
  /* 自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--background-base, #1a1a1a);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--primary-color, #9400D3);
    border-radius: 3px;
    
    &:hover {
      background: #7b00ad;
    }
  }
  
  h3 { 
    margin-top: 0; 
    margin-bottom: 20px;
    color: var(--text-primary, #fff);
  }
  
  form > div { 
    margin-bottom: 16px; 
    
    label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      color: var(--text-primary, #fff);
    }
    
    input, select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--border-color, #333);
      border-radius: 6px;
      font-size: 16px;
      background-color: var(--background-base, #1a1a1a);
      color: var(--text-primary, #fff);
      transition: all 0.2s ease;
      
      &:focus {
        outline: none;
        border-color: var(--primary-color, #9400D3);
        box-shadow: 0 0 0 2px rgba(148, 0, 211, 0.25);
      }
    }
  }
  
  .modal-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 24px;
    
    button {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
      }
      
      &:active {
        transform: translateY(0);
      }
      
      &:first-child {
        background: var(--primary-color, #9400D3);
        color: #fff;
      }
      
      &:last-child {
        background: var(--background-base, #1a1a1a);
        color: var(--text-primary, #fff);
        border: 1px solid var(--border-color, #333);
      }
    }
  }
}
</style>