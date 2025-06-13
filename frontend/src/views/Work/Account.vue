<template>
  <div class="account-manager">
    <div class="account-header">
      <h2>账户管理</h2>
      <button class="add-account-btn" @click="openAccountModal">
        <span class="icon">+</span>
        <span>添加账户</span>
      </button>
    </div>

    <!-- 账户列表 -->
    <div class="account-list">
      <div v-if="accounts.length === 0" class="no-accounts">
        <div class="empty-state">
          <div class="empty-icon">💰</div>
          <p>暂无账户，请添加您的第一个账户</p>
        </div>
      </div>
      <div v-else class="account-cards">
        <div 
          v-for="(account, index) in accounts" 
          :key="index" 
          class="account-card"
          :class="account.type"
        >
          <div class="account-card-header">
            <span class="account-type">{{ account.type }}</span>
            <span class="account-name">{{ account.name }}</span>
          </div>
          <div class="account-balance">
            <span class="balance-label">余额</span>
            <span class="balance-amount">{{ account.balance.toFixed(2) }}</span>
          </div>
          <div class="account-actions">
            <button class="action-btn edit" @click="editAccount(index)">
              <span>编辑</span>
            </button>
            <button class="action-btn transfer" @click="openTransferModal(index)">
              <span>转账</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑账户弹窗 -->
    <div v-if="showAccountModal" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h3>{{ isEditing ? '编辑账户' : '添加账户' }}</h3>
            <button class="close-btn" @click="closeAccountModal">×</button>
          </div>
          <form @submit.prevent="saveAccount" class="apple-form">
            <div class="form-group">
              <label>账户名称</label>
              <input type="text" v-model="accountForm.name" required placeholder="输入账户名称" />
            </div>
            <div class="form-group">
              <label>账户类型</label>
              <select v-model="accountForm.type" required>
                <option value="现金">现金</option>
                <option value="储蓄卡">储蓄卡</option>
                <option value="信用卡">信用卡</option>
                <option value="借记卡">借记卡</option>
                <option value="微信支付">微信支付</option>
                <option value="支付宝">支付宝</option>
                <option value="股票账户">股票账户</option>
                <option value="基金账户">基金账户</option>
                <option value="虚拟钱包">虚拟钱包</option>
                <option value="负债账户">负债账户</option>
              </select>
            </div>
            <div class="form-group">
              <label>初始余额</label>
              <input type="number" v-model="accountForm.balance" step="0.01" required placeholder="0.00" />
            </div>
            <div class="form-group">
              <label>备注</label>
              <input type="text" v-model="accountForm.remark" placeholder="可选" />
            </div>
            <div class="modal-actions">
              <button type="button" class="cancel-btn" @click="closeAccountModal">取消</button>
              <button type="submit" class="submit-btn">保存</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 账户间转账弹窗 -->
    <div v-if="showTransferModal" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h3>账户转账</h3>
            <button class="close-btn" @click="closeTransferModal">×</button>
          </div>
          <form @submit.prevent="saveTransfer" class="apple-form">
            <div class="form-group">
              <label>从账户</label>
              <select v-model="transferForm.fromAccount" required>
                <option v-for="(account, index) in accounts" :key="index" :value="index">
                  {{ account.name }} ({{ account.balance.toFixed(2) }})
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>至账户</label>
              <select v-model="transferForm.toAccount" required>
                <option v-for="(account, index) in accounts" :key="index" :value="index"
                  :disabled="index === transferForm.fromAccount">
                  {{ account.name }} ({{ account.balance.toFixed(2) }})
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>转账金额</label>
              <input type="number" v-model="transferForm.amount" min="0.01" step="0.01" required placeholder="0.00" />
            </div>
            <div class="form-group">
              <label>转账日期</label>
              <input type="date" v-model="transferForm.date" required />
            </div>
            <div class="form-group">
              <label>备注</label>
              <input type="text" v-model="transferForm.remark" placeholder="可选" />
            </div>
            <div class="modal-actions">
              <button type="button" class="cancel-btn" @click="closeTransferModal">取消</button>
              <button type="submit" class="submit-btn">确认转账</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

interface Account {
  name: string;
  type: string;
  balance: number;
  remark: string;
}

interface Transfer {
  fromAccount: number;
  toAccount: number;
  amount: number;
  date: string;
  remark: string;
}

// 账户列表
const accounts = ref<Account[]>([
  { name: '我的现金', type: '现金', balance: 1000, remark: '' },
  { name: '工商银行', type: '储蓄卡', balance: 5000, remark: '工资卡' },
  { name: '微信钱包', type: '微信支付', balance: 500, remark: '' }
]);

// 账户表单
const accountForm = ref<Account>({
  name: '',
  type: '现金',
  balance: 0,
  remark: ''
});

// 转账表单
const transferForm = ref<Transfer>({
  fromAccount: 0,
  toAccount: 1,
  amount: 0,
  date: new Date().toISOString().split('T')[0],
  remark: ''
});

// 控制弹窗显示
const showAccountModal = ref(false);
const showTransferModal = ref(false);
const isEditing = ref(false);
const editingIndex = ref(-1);

// 打开添加账户弹窗
const openAccountModal = () => {
  accountForm.value = {
    name: '',
    type: '现金',
    balance: 0,
    remark: ''
  };
  isEditing.value = false;
  showAccountModal.value = true;
};

// 关闭账户弹窗
const closeAccountModal = () => {
  showAccountModal.value = false;
};

// 编辑账户
const editAccount = (index: number) => {
  const account = accounts.value[index];
  accountForm.value = { ...account };
  editingIndex.value = index;
  isEditing.value = true;
  showAccountModal.value = true;
};

// 保存账户
const saveAccount = () => {
  if (isEditing.value) {
    accounts.value[editingIndex.value] = { ...accountForm.value };
  } else {
    accounts.value.push({ ...accountForm.value });
  }
  showAccountModal.value = false;
};

// 打开转账弹窗
const openTransferModal = (fromIndex: number) => {
  transferForm.value = {
    fromAccount: fromIndex,
    toAccount: accounts.value.findIndex((_, idx) => idx !== fromIndex),
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    remark: ''
  };
  showTransferModal.value = true;
};

// 关闭转账弹窗
const closeTransferModal = () => {
  showTransferModal.value = false;
};

// 保存转账
const saveTransfer = () => {
  const { fromAccount, toAccount, amount } = transferForm.value;
  
  // 确保转账金额为正数
  const transferAmount = Math.abs(Number(amount));
  
  // 更新账户余额
  accounts.value[fromAccount].balance -= transferAmount;
  accounts.value[toAccount].balance += transferAmount;
  
  // 关闭弹窗
  showTransferModal.value = false;
};
</script>

<style scoped lang="scss">
// Apple 风格的颜色变量
$apple-blue: #007aff;
$apple-green: #34c759;
$apple-red: #ff3b30;
$apple-orange: #ff9500;
$apple-purple: #af52de;
$apple-gray: #8e8e93;
$apple-light-gray: #f2f2f7;
$apple-dark-gray: #1c1c1e;

// 全局样式
.account-manager {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: $apple-dark-gray;
  background-color: #f5f5f7;
  min-height: 100vh;
}

// 头部样式
.account-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  
  h2 {
    margin: 0;
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.5px;
  }
  
  .add-account-btn {
    background: $apple-blue;
    color: #fff;
    border: none;
    padding: 10px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 122, 255, 0.2);
    
    .icon {
      font-size: 18px;
      font-weight: 600;
    }
    
    &:hover {
      background: darken($apple-blue, 5%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(0, 122, 255, 0.2);
    }
  }
}

// 账户卡片列表
.account-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

// 账户卡片样式
.account-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: linear-gradient(to right, rgba(255,255,255,0.5), rgba(255,255,255,0));
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  }
  
  // 账户类型颜色
  &.现金 { 
    background: linear-gradient(145deg, rgba(52, 199, 89, 0.1), rgba(52, 199, 89, 0.05));
    &::before { background: $apple-green; }
  }
  &.储蓄卡 { 
    background: linear-gradient(145deg, rgba(0, 122, 255, 0.1), rgba(0, 122, 255, 0.05));
    &::before { background: $apple-blue; }
  }
  &.信用卡 { 
    background: linear-gradient(145deg, rgba(255, 59, 48, 0.1), rgba(255, 59, 48, 0.05));
    &::before { background: $apple-red; }
  }
  &.微信支付 { 
    background: linear-gradient(145deg, rgba(7, 193, 96, 0.1), rgba(7, 193, 96, 0.05));
    &::before { background: #07c160; }
  }
  &.支付宝 { 
    background: linear-gradient(145deg, rgba(22, 119, 255, 0.1), rgba(22, 119, 255, 0.05));
    &::before { background: #1677ff; }
  }
  &.股票账户 { 
    background: linear-gradient(145deg, rgba(255, 149, 0, 0.1), rgba(255, 149, 0, 0.05));
    &::before { background: $apple-orange; }
  }
  &.基金账户 { 
    background: linear-gradient(145deg, rgba(175, 82, 222, 0.1), rgba(175, 82, 222, 0.05));
    &::before { background: $apple-purple; }
  }
  &.虚拟钱包 { 
    background: linear-gradient(145deg, rgba(142, 142, 147, 0.1), rgba(142, 142, 147, 0.05));
    &::before { background: $apple-gray; }
  }
  &.负债账户 { 
    background: linear-gradient(145deg, rgba(121, 85, 72, 0.1), rgba(121, 85, 72, 0.05));
    &::before { background: #795548; }
  }
  
  .account-card-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    
    .account-type {
      font-size: 14px;
      color: $apple-gray;
      font-weight: 500;
    }
    
    .account-name {
      font-weight: 600;
      font-size: 16px;
    }
  }
  
  .account-balance {
    margin-bottom: 24px;
    
    .balance-label {
      display: block;
      font-size: 14px;
      color: $apple-gray;
      margin-bottom: 6px;
      font-weight: 500;
    }
    
    .balance-amount {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
      background: linear-gradient(90deg, $apple-dark-gray, #4a4a4a);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  
  .account-actions {
    display: flex;
    gap: 12px;
    
    .action-btn {
      flex: 1;
      padding: 10px 0;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.2s ease;
      
      &.edit {
        background: rgba(0, 122, 255, 0.1);
        color: $apple-blue;
        
        &:hover {
          background: rgba(0, 122, 255, 0.2);
        }
      }
      
      &.transfer {
        background: rgba(52, 199, 89, 0.1);
        color: $apple-green;
        
        &:hover {
          background: rgba(52, 199, 89, 0.2);
        }
      }
      
      &:active {
        transform: scale(0.98);
      }
    }
  }
}

// 空状态样式
.no-accounts {
  text-align: center;
  padding: 60px 0;
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    
    .empty-icon {
      font-size: 48px;
      background: $apple-light-gray;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    p {
      color: $apple-gray;
      font-size: 16px;
      max-width: 300px;
      margin: 0;
    }
  }
}

// 弹窗样式
.modal-mask {
  position: fixed;
  z-index: 9999;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-wrapper {
  width: 100%;
  max-width: 420px;
  padding: 20px;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    
    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      color: $apple-gray;
      cursor: pointer;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s ease;
      
      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }
  
  .apple-form {
    padding: 24px;
    
    .form-group {
      margin-bottom: 20px;
      
      label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        font-size: 14px;
        color: $apple-dark-gray;
      }
      
      input, select {
        width: 100%;
        padding: 12px 16px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        font-size: 16px;
        background: rgba(255, 255, 255, 0.8);
        transition: all 0.2s ease;
        
        &:focus {
          outline: none;
          border-color: $apple-blue;
          box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
        }
        
        &::placeholder {
          color: rgba(142, 142, 147, 0.6);
        }
      }
    }
    
    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 32px;
      
      button {
        padding: 12px 20px;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        font-weight: 500;
        font-size: 15px;
        transition: all 0.2s ease;
        
        &.cancel-btn {
          background: rgba(142, 142, 147, 0.1);
          color: $apple-gray;
          
          &:hover {
            background: rgba(142, 142, 147, 0.2);
          }
        }
        
        &.submit-btn {
          background: $apple-blue;
          color: white;
          box-shadow: 0 2px 8px rgba(0, 122, 255, 0.2);
          
          &:hover {
            background: darken($apple-blue, 5%);
            box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
          }
        }
        
        &:active {
          transform: scale(0.98);
        }
      }
    }
  }
}
</style>