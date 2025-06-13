<template>
  <div class="terabox-repo">
    <!-- 左侧导航栏 -->
    <aside class="sidebar">
      <div class="logo">TeraBox</div>
      <ul class="nav-list">
        <li v-for="(item, index) in navItems" :key="index" :class="{active: currentNav === item.label}" @click="handleNavClick(item)">
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </li>
      </ul>
    </aside>
    <!-- 主内容区 -->
    <div class="main-area">
      <!-- 顶部操作栏 -->
      <div class="topbar">
        <div class="actions">
          <button class="action-btn" @click="uploadFile"><i class="fas fa-upload"></i> 上传</button>
          <button class="action-btn" @click="createFolder"><i class="fas fa-folder-plus"></i> 新建文件夹</button>
          <button class="action-btn"><i class="fas fa-ellipsis-h"></i> 更多</button>
        </div>
        <div class="search-box">
          <input type="text" v-model="search" placeholder="搜索我的网盘文件" />
          <i class="fas fa-search"></i>
        </div>
      </div>
      <!-- 文件列表 -->
      <table class="file-list">
        <thead>
          <tr>
            <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /></th>
            <th>文件名</th>
            <th>修改时间</th>
            <th>大小</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(file, index) in filteredFiles" :key="index">
            <td><input type="checkbox" v-model="file.selected" /></td>
            <td>
              <i :class="file.isFolder ? 'fas fa-folder' : 'fas fa-file-alt'" :style="{color: file.isFolder ? '#1976d2' : '#888'}"></i>
              <span class="file-name">{{ file.name }}</span>
            </td>
            <td>{{ file.modifiedTime }}</td>
            <td>{{ file.size }}</td>
            <td>
              <button class="file-op" @click="downloadFile(file)"><i class="fas fa-download"></i></button>
              <button class="file-op" @click="deleteFile(file)"><i class="fas fa-trash"></i></button>
              <button class="file-op"><i class="fas fa-ellipsis-h"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const navItems = [
  { label: '全部文件', icon: 'fas fa-hdd' },
  { label: '图片', icon: 'fas fa-image' },
  { label: '文档', icon: 'fas fa-file-alt' },
  { label: '视频', icon: 'fas fa-video' },
  { label: '音乐', icon: 'fas fa-music' },
  { label: '其他', icon: 'fas fa-ellipsis-h' },
  { label: '回收站', icon: 'fas fa-trash-alt' }
];
const currentNav = ref(navItems[0].label);
const search = ref('');
const selectAll = ref(false);
const fileList = ref([
  { name: 'Cosplay', isFolder: true, modifiedTime: '05-03', size: '-', selected: false },
  { name: '九宫 - 交错战线 杜兰德尔.rar', isFolder: false, modifiedTime: '06-06', size: '650.8M', selected: false },
  { name: '【富本裕】碧蓝档案cos--凛.rar', isFolder: false, modifiedTime: '06-06', size: '45.4M', selected: false },
  { name: '九宫 - NIKKE胜利女神 素达.rar', isFolder: false, modifiedTime: '06-06', size: '29GM', selected: false },
  { name: 'TeraBox Beginner\'s Guide.pdf', isFolder: false, modifiedTime: '09-07', size: '5.7M', selected: false }
]);
const filteredFiles = computed(() => {
  if (!search.value) return fileList.value;
  return fileList.value.filter(f => f.name.includes(search.value));
});
const handleNavClick = (item: any) => {
  currentNav.value = item.label;
};
const uploadFile = () => {
  alert('上传文件功能待实现');
};
const createFolder = () => {
  alert('新建文件夹功能待实现');
};
const downloadFile = (file: any) => {
  alert('下载 ' + file.name);
};
const deleteFile = (file: any) => {
  alert('删除 ' + file.name);
};
const toggleSelectAll = () => {
  fileList.value.forEach(f => f.selected = selectAll.value);
};
</script>

<style scoped lang="scss">
.terabox-repo {
  display: flex;
  width: 100vw; // 占满整个窗口宽度
  height: 100vh; // 占满整个窗口高度
  position: fixed; // 固定定位
  left: 0;
  top: 0;
  overflow: hidden; // 防止滚动条
  background: #f4f6fa;
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  .sidebar {
    width: 210px;
    background: #fff;
    border-right: 1px solid #e5e6eb;
    display: flex;
    flex-direction: column;
    align-items: center;
    .logo {
      font-size: 2rem;
      font-weight: bold;
      color: #1976d2;
      margin: 32px 0 24px 0;
      letter-spacing: 2px;
    }
    .nav-list {
      width: 100%;
      list-style: none;
      padding: 0;
      margin: 0;
      li {
        width: 100%;
        padding: 14px 0 14px 36px;
        display: flex;
        align-items: center;
        font-size: 1.1rem;
        color: #333;
        cursor: pointer;
        border-left: 4px solid transparent;
        transition: background 0.2s, border-color 0.2s;
        i {
          margin-right: 16px;
          font-size: 1.2rem;
        }
        &.active, &:hover {
          background: #e3f1fd;
          border-left: 4px solid #1976d2;
          color: #1976d2;
        }
      }
    }
  }
  .main-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24px 32px 12px 32px;
      .actions {
        display: flex;
        gap: 12px;
        .action-btn {
          background: #1976d2;
          color: #fff;
          border: none;
          border-radius: 4px;
          padding: 7px 18px;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.2s;
          &:hover {
            background: #1565c0;
          }
        }
      }
      .search-box {
        position: relative;
        input {
          padding: 7px 36px 7px 12px;
          border: 1px solid #e5e6eb;
          border-radius: 4px;
          font-size: 1rem;
          background: #fff;
          outline: none;
        }
        i {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #888;
        }
      }
    }
    .file-list {
      width: 98%;
      margin: 0 auto;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      border-collapse: separate;
      border-spacing: 0;
      th, td {
        padding: 14px 10px;
        text-align: left;
        font-size: 1rem;
      }
      th {
        color: #888;
        font-weight: 500;
        background: #f4f6fa;
        border-bottom: 1px solid #e5e6eb;
      }
      tr {
        transition: background 0.2s;
        &:hover {
          background: #f0f7ff;
        }
      }
      td {
        color: #333;
        .file-name {
          margin-left: 8px;
        }
        .file-op {
          background: none;
          border: none;
          color: #1976d2;
          font-size: 1.1rem;
          margin-right: 8px;
          cursor: pointer;
          transition: color 0.2s;
          &:hover {
            color: #1565c0;
          }
        }
      }
      input[type='checkbox'] {
        width: 18px;
        height: 18px;
      }
    }
  }
}
</style>