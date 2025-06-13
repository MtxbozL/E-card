<template>
  <div class="category-manager">
    <div class="category-header">
      <h2>分类管理</h2>
      <div class="category-tabs">
        <button 
          :class="{active: activeTab === '支出'}" 
          @click="activeTab = '支出'"
        >支出分类</button>
        <button 
          :class="{active: activeTab === '收入'}" 
          @click="activeTab = '收入'"
        >收入分类</button>
      </div>
      <button class="add-category-btn" @click="openCategoryModal()">添加分类</button>
    </div>

    <!-- 分类列表 -->
    <div class="category-list">
      <div v-if="filteredCategories.length === 0" class="no-categories">
        暂无{{ activeTab }}分类，请添加
      </div>
      <div v-else class="category-items">
        <div 
          v-for="(category, index) in filteredCategories" 
          :key="index" 
          class="category-item"
          :style="{borderLeftColor: category.color || getCategoryDefaultColor(category.name)}"
        >
          <div class="category-info">
            <span class="category-icon" :style="{backgroundColor: category.color || getCategoryDefaultColor(category.name)}">
              {{ category.name.charAt(0) }}
            </span>
            <span class="category-name">{{ category.name }}</span>
            <span v-if="category.budget" class="category-budget">预算: {{ category.budget }}元</span>
          </div>
          <div class="category-actions">
            <button @click="editCategory(index)">编辑</button>
            <button @click="confirmDeleteCategory(index)" :disabled="category.isDefault">删除</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑分类弹窗 -->
    <div v-if="showCategoryModal" class="modal-mask">
      <div class="modal-container">
        <h3>{{ isEditing ? '编辑分类' : '添加分类' }}</h3>
        <form @submit.prevent="saveCategory">
          <div>
            <label>分类名称：</label>
            <input type="text" v-model="categoryForm.name" required />
          </div>
          <div>
            <label>分类类型：</label>
            <select v-model="categoryForm.type" required>
              <option value="支出">支出</option>
              <option value="收入">收入</option>
            </select>
          </div>
          <div>
            <label>父分类：</label>
            <select v-model="categoryForm.parent">
              <option value="">无 (一级分类)</option>
              <option 
                v-for="cat in categories.filter(c => c.type === categoryForm.type && !c.parent)"
                :key="cat.name"
                :value="cat.name"
              >
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div>
            <label>分类颜色：</label>
            <div class="color-picker">
              <div 
                v-for="color in colorOptions" 
                :key="color"
                class="color-option"
                :style="{backgroundColor: color}"
                :class="{selected: categoryForm.color === color}"
                @click="categoryForm.color = color"
              ></div>
            </div>
          </div>
          <div>
            <label>预算金额：</label>
            <input 
              type="number" 
              v-model="categoryForm.budget" 
              min="0" 
              step="100"
              :disabled="categoryForm.type === '收入'"
              placeholder="可选，仅支出类别可设置"
            />
          </div>
          <div>
            <label>排序：</label>
            <input type="number" v-model="categoryForm.sort" min="0" step="1" />
          </div>
          <div class="modal-actions">
            <button type="submit">保存</button>
            <button type="button" @click="closeCategoryModal">取消</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div v-if="showDeleteConfirm" class="modal-mask">
      <div class="modal-container confirm-dialog">
        <h3>确认删除</h3>
        <p>确定要删除分类 "{{ categoryToDelete?.name }}" 吗？</p>
        <p class="warning-text">注意：删除分类后，使用该分类的账单将变为"其他"分类。</p>
        <div class="modal-actions">
          <button @click="deleteCategory" class="delete-btn">确认删除</button>
          <button @click="showDeleteConfirm = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Category {
  name: string;
  type: '支出' | '收入';
  parent: string;
  color: string;
  budget: number;
  sort: number;
  isDefault: boolean;
}

// 分类列表
const categories = ref<Category[]>([
  // 支出分类
  { name: '餐饮', type: '支出', parent: '', color: '#FF5722', budget: 1000, sort: 0, isDefault: true },
  { name: '早餐', type: '支出', parent: '餐饮', color: '#FF5722', budget: 0, sort: 0, isDefault: false },
  { name: '午餐', type: '支出', parent: '餐饮', color: '#FF5722', budget: 0, sort: 1, isDefault: false },
  { name: '晚餐', type: '支出', parent: '餐饮', color: '#FF5722', budget: 0, sort: 2, isDefault: false },
  { name: '交通', type: '支出', parent: '', color: '#2196F3', budget: 300, sort: 1, isDefault: true },
  { name: '公交地铁', type: '支出', parent: '交通', color: '#2196F3', budget: 0, sort: 0, isDefault: false },
  { name: '打车', type: '支出', parent: '交通', color: '#2196F3', budget: 0, sort: 1, isDefault: false },
  { name: '购物', type: '支出', parent: '', color: '#9C27B0', budget: 500, sort: 2, isDefault: true },
  { name: '日用', type: '支出', parent: '', color: '#607D8B', budget: 200, sort: 3, isDefault: true },
  { name: '娱乐', type: '支出', parent: '', color: '#FF9800', budget: 300, sort: 4, isDefault: true },
  { name: '住房', type: '支出', parent: '', color: '#795548', budget: 0, sort: 5, isDefault: true },
  { name: '通讯', type: '支出', parent: '', color: '#00BCD4', budget: 0, sort: 6, isDefault: true },
  { name: '医疗', type: '支出', parent: '', color: '#F44336', budget: 0, sort: 7, isDefault: true },
  { name: '教育', type: '支出', parent: '', color: '#4CAF50', budget: 0, sort: 8, isDefault: true },
  { name: '其他', type: '支出', parent: '', color: '#9E9E9E', budget: 0, sort: 9, isDefault: true },
  
  // 收入分类
  { name: '工资', type: '收入', parent: '', color: '#4CAF50', budget: 0, sort: 0, isDefault: true },
  { name: '奖金', type: '收入', parent: '', color: '#8BC34A', budget: 0, sort: 1, isDefault: true },
  { name: '红包', type: '收入', parent: '', color: '#F44336', budget: 0, sort: 2, isDefault: true },
  { name: '理财', type: '收入', parent: '', color: '#FF9800', budget: 0, sort: 3, isDefault: true },
  { name: '兼职', type: '收入', parent: '', color: '#03A9F4', budget: 0, sort: 4, isDefault: true },
  { name: '报销', type: '收入', parent: '', color: '#E91E63', budget: 0, sort: 5, isDefault: true },
  { name: '其他', type: '收入', parent: '', color: '#9E9E9E', budget: 0, sort: 6, isDefault: true },
]);

// 分类表单
const categoryForm = ref<Category>({
  name: '',
  type: '支出',
  parent: '',
  color: '',
  budget: 0,
  sort: 0,
  isDefault: false
});

// 控制弹窗显示
const showCategoryModal = ref(false);
const showDeleteConfirm = ref(false);
const isEditing = ref(false);
const editingIndex = ref(-1);
const categoryToDelete = ref<Category | null>(null);

// 当前激活的标签
const activeTab = ref<'支出' | '收入'>('支出');

// 颜色选项
const colorOptions = [
  '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
  '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
  '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
  '#FF5722', '#795548', '#9E9E9E', '#607D8B'
];

// 根据当前标签筛选分类
const filteredCategories = computed(() => {
  return categories.value
    .filter(c => c.type === activeTab.value)
    .sort((a, b) => {
      // 先按父分类排序
      if (a.parent !== b.parent) {
        if (!a.parent) return -1;
        if (!b.parent) return 1;
        return a.parent.localeCompare(b.parent);
      }
      // 再按排序字段排序
      return a.sort - b.sort;
    });
});

// 获取分类默认颜色
const getCategoryDefaultColor = (name: string) => {
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
  
  return colors[name] || '#9E9E9E';
};

// 打开添加分类弹窗
const openCategoryModal = () => {
  categoryForm.value = {
    name: '',
    type: activeTab.value,
    parent: '',
    color: colorOptions[0],
    budget: 0,
    sort: filteredCategories.value.length,
    isDefault: false
  };
  isEditing.value = false;
  showCategoryModal.value = true;
};

// 关闭分类弹窗
const closeCategoryModal = () => {
  showCategoryModal.value = false;
};

// 编辑分类
const editCategory = (index: number) => {
  const category = filteredCategories.value[index];
  const originalIndex = categories.value.findIndex(c => 
    c.name === category.name && 
    c.type === category.type
  );
  
  if (originalIndex !== -1) {
    categoryForm.value = { ...categories.value[originalIndex] };
    editingIndex.value = originalIndex;
    isEditing.value = true;
    showCategoryModal.value = true;
  }
};

// 确认删除分类
const confirmDeleteCategory = (index: number) => {
  const category = filteredCategories.value[index];
  categoryToDelete.value = category;
  showDeleteConfirm.value = true;
};

// 删除分类
const deleteCategory = () => {
  if (!categoryToDelete.value) return;
  
  const categoryName = categoryToDelete.value.name;
  const categoryType = categoryToDelete.value.type;
  
  // 找到要删除的分类索引
  const deleteIndex = categories.value.findIndex(c => 
    c.name === categoryName && 
    c.type === categoryType
  );
  
  if (deleteIndex !== -1) {
    // 删除分类
    categories.value.splice(deleteIndex, 1);
    
    // 将子分类的父分类设为空
    categories.value.forEach(c => {
      if (c.parent === categoryName && c.type === categoryType) {
        c.parent = '';
      }
    });
  }
  
  showDeleteConfirm.value = false;
  categoryToDelete.value = null;
};

// 保存分类
const saveCategory = () => {
  if (isEditing.value) {
    // 更新现有分类
    categories.value[editingIndex.value] = { ...categoryForm.value };
  } else {
    // 检查是否已存在同名分类
    const exists = categories.value.some(c => 
      c.name === categoryForm.value.name && 
      c.type === categoryForm.value.type
    );
    
    if (!exists) {
      // 添加新分类
      categories.value.push({ ...categoryForm.value });
    } else {
      alert(`${categoryForm.value.type}分类 "${categoryForm.value.name}" 已存在！`);
      return;
    }
  }
  
  showCategoryModal.value = false;
};
</script>

<style scoped lang="scss">
.category-manager {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
}

.category-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
  
  h2 {
    margin: 0;
    margin-right: 20px;
  }
  
  .category-tabs {
    display: flex;
    
    button {
      padding: 8px 16px;
      border: none;
      background: #f1f1f1;
      cursor: pointer;
      
      &:first-child {
        border-radius: 4px 0 0 4px;
      }
      
      &:last-child {
        border-radius: 0 4px 4px 0;
      }
      
      &.active {
        background: #1976d2;
        color: #fff;
      }
    }
  }
  
  .add-category-btn {
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

.category-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.category-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid #ccc;
  
  .category-info {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .category-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 500;
    }
    
    .category-name {
      font-weight: 500;
    }
    
    .category-budget {
      font-size: 12px;
      color: #6c757d;
      background: #e9ecef;
      padding: 2px 6px;
      border-radius: 4px;
    }
  }
  
  .category-actions {
    display: flex;
    gap: 8px;
    
    button {
      padding: 4px 8px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      
      &:first-child {
        background: #e9ecef;
      }
      
      &:last-child {
        background: #f8d7da;
        color: #721c24;
        
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }
  }
}

.no-categories {
  text-align: center;
  padding: 40px 0;
  color: #6c757d;
  background: #f8f9fa;
  border-radius: 8px;
}

.modal-mask {
  position: fixed;
  z-index: 9999;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-container {
  background: #fff;
  padding: 24px 32px;
  border-radius: 8px;
  min-width: 320px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  
  h3 { 
    margin-top: 0; 
    margin-bottom: 20px;
  }
  
  form > div { 
    margin-bottom: 16px; 
    
    label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
    }
    
    input, select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 16px;
    }
  }
  
  .color-picker {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
    
    .color-option {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      cursor: pointer;
      transition: transform 0.2s;
      
      &:hover {
        transform: scale(1.1);
      }
      
      &.selected {
        box-shadow: 0 0 0 2px #fff, 0 0 0 4px #000;
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
      border-radius: 4px;
      cursor: pointer;
      
      &:first-child {
        background: #1976d2;
        color: #fff;
      }
      
      &:last-child {
        background: #e9ecef;
      }
    }
  }
  
  &.confirm-dialog {
    max-width: 400px;
    
    p {
      margin-bottom: 16px;
    }
    
    .warning-text {
      color: #721c24;
      background-color: #f8d7da;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .delete-btn {
      background-color: #dc3545 !important;
    }
  }
}
</style>