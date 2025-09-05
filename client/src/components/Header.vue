<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo" @click="goHome">
          <div class="logo-icon">
            <el-icon size="28"><Download /></el-icon>
          </div>
          <div class="logo-text">
            <span class="logo-title">软件下载站</span>
            <span class="logo-subtitle">Software Hub</span>
          </div>
        </div>

        <!-- 导航菜单 -->
        <nav class="nav-menu">
          <el-menu
            :default-active="activeIndex"
            mode="horizontal"
            @select="handleSelect"
            class="nav-menu-list"
          >
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/software">软件列表</el-menu-item>
          </el-menu>
        </nav>

        <!-- 搜索框 -->
        <div class="search-box">
          <div class="search-container">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索软件、工具..."
              size="default"
              @keyup.enter="handleSearch"
              @focus="searchFocused = true"
              @blur="searchFocused = false"
              class="search-input"
            >
              <template #prefix>
                <el-icon class="search-prefix-icon"><Search /></el-icon>
              </template>
            </el-input>
            <el-button 
              @click="handleSearch" 
              class="search-btn"
              :class="{ focused: searchFocused }"
            >
              <el-icon><Search /></el-icon>
            </el-button>
          </div>
        </div>


        <!-- 移动端菜单按钮 -->
        <div class="mobile-menu-btn" @click="toggleMobileMenu">
          <el-icon size="20"><Menu /></el-icon>
        </div>
      </div>

      <!-- 移动端菜单 -->
      <div class="mobile-menu" :class="{ active: mobileMenuVisible }">
        <div class="mobile-menu-content">
          <div class="mobile-search">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索软件..."
              @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button @click="handleSearch">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>
          <div class="mobile-nav">
            <div class="nav-item" @click="goHome">首页</div>
            <div class="nav-item" @click="goToSoftwareList">软件列表</div>
            <div class="nav-item" v-if="!isLoggedIn" @click="goToLogin">登录</div>
            <div class="nav-item" v-else @click="handleLogout">退出登录</div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSoftwareStore } from '@/stores/software'
import { 
  Download, 
  Search, 
  User, 
  ArrowDown, 
  ArrowRight,
  Menu,
  Setting,
  SwitchButton
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const softwareStore = useSoftwareStore()

const searchKeyword = ref('')
const mobileMenuVisible = ref(false)
const activeIndex = ref('/')
const searchFocused = ref(false)

// 计算属性
const isLoggedIn = computed(() => {
  const token = localStorage.getItem('token')
  console.log('Token exists:', !!token)
  return !!token
})
const userInfo = computed(() => {
  const user = localStorage.getItem('user')
  console.log('User data:', user)
  if (user) {
    try {
      const parsedUser = JSON.parse(user)
      console.log('Parsed user:', parsedUser)
      return parsedUser
    } catch (error) {
      console.error('Error parsing user data:', error)
      return null
    }
  }
  return null
})

// 监听路由变化
watch(() => route.path, (newPath) => {
  activeIndex.value = newPath
  mobileMenuVisible.value = false
})

// 方法
const goHome = () => {
  router.push('/')
  mobileMenuVisible.value = false
}

const goToSoftwareList = () => {
  router.push('/software')
  mobileMenuVisible.value = false
}


const goToLogin = () => {
  router.push('/login')
  mobileMenuVisible.value = false
}

const handleSelect = (index) => {
  router.push(index)
}

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      name: 'SoftwareList',
      query: { search: searchKeyword.value.trim() }
    })
    mobileMenuVisible.value = false
  }
}

const handleUserCommand = (command) => {
  switch (command) {
    case 'admin':
      router.push('/admin')
      break
    case 'logout':
      handleLogout()
      break
  }
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/')
  mobileMenuVisible.value = false
}

const toggleMobileMenu = () => {
  mobileMenuVisible.value = !mobileMenuVisible.value
}



onMounted(async () => {
  activeIndex.value = route.path
  try {
    await softwareStore.fetchCategories()
  } catch (error) {
    console.error('加载分类失败:', error)
  }
  
})
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(102, 126, 234, 0.08);
  box-shadow: 0 2px 32px rgba(102, 126, 234, 0.06);
  z-index: 1000;
  height: 72px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent);
  }
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  gap: 32px;
  padding: 0 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  padding: 10px 18px;
  border-radius: 14px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.04) 0%, rgba(139, 92, 246, 0.04) 100%);
  border: 1px solid rgba(102, 126, 234, 0.08);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.12), transparent);
    transition: left 0.6s ease;
  }
  
  &:hover {
    transform: translateY(-1px) scale(1.01);
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%);
    border-color: rgba(102, 126, 234, 0.2);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.12);
    
    &::before {
      left: 100%;
    }
    
    .logo-icon {
      transform: rotate(15deg) scale(1.05);
    }
  }
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 10px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 3px 12px rgba(99, 102, 241, 0.25);
  
  .el-icon {
    color: white;
    font-size: 18px;
  }
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.logo-title {
  font-size: 1.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.logo-subtitle {
  font-size: 0.65rem;
  color: #6b7280;
  font-weight: 500;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  opacity: 0.8;
}

.nav-menu {
  flex: 1;
  max-width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-menu-list {
  border: none !important;
  border-bottom: none !important;
  background: transparent;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  
  // 强制去掉Element Plus的默认边框
  &::before,
  &::after {
    display: none !important;
  }
  
  // 覆盖Element Plus的默认样式
  :deep(.el-menu) {
    border: none !important;
    border-bottom: none !important;
  }
  
  :deep(.el-menu-item) {
    border: none !important;
    border-bottom: none !important;
    border-radius: 12px;
    margin: 0 6px;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
    padding: 0 24px;
    height: 42px;
    line-height: 42px;
    min-width: 90px;
    text-align: center;
    white-space: nowrap;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    color: #64748b;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.12), transparent);
      transition: left 0.6s ease;
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #6366f1, #8b5cf6);
      transition: all 0.3s ease;
      transform: translateX(-50%);
    }
    
    &:hover {
      background: rgba(99, 102, 241, 0.08);
      transform: translateY(-2px);
      color: #6366f1;
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.15);
      
      &::before {
        left: 100%;
      }
      
      &::after {
        width: 60%;
      }
    }
    
    &.is-active {
      color: #6366f1;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%);
      border: 1px solid rgba(99, 102, 241, 0.2);
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.2);
      transform: translateY(-1px);
      
      &::after {
        width: 80%;
        background: linear-gradient(90deg, #6366f1, #8b5cf6);
      }
    }
  }
  
  :deep(.el-sub-menu__title) {
    border: none !important;
    border-bottom: none !important;
    border-radius: 12px;
    margin: 0 6px;
    font-weight: 600;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    color: #64748b;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
      transition: left 0.5s;
    }
    
    &:hover {
      background: rgba(102, 126, 234, 0.08);
      color: #667eea;
      transform: translateY(-1px);
      
      &::before {
        left: 100%;
      }
    }
  }
  
  :deep(.el-sub-menu:hover .el-sub-menu__title) {
    background: rgba(102, 126, 234, 0.08);
    color: #667eea;
  }
  
  :deep(.el-sub-menu .el-menu) {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(102, 126, 234, 0.2) !important;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    padding: 8px;
    margin-top: 4px;
    min-width: 200px;
  }
  
  :deep(.el-sub-menu:hover .el-menu) {
    border: 1px solid rgba(102, 126, 234, 0.2) !important;
    background: rgba(255, 255, 255, 0.95) !important;
  }
  
  :deep(.el-sub-menu.is-opened .el-menu) {
    border: 1px solid rgba(102, 126, 234, 0.2) !important;
    background: rgba(255, 255, 255, 0.95) !important;
  }
  
  :deep(.el-sub-menu .el-menu-item) {
    border: none !important;
    background: transparent !important;
    border-bottom: none !important;
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
  }
  
  :deep(.el-sub-menu .el-menu-item:before) {
    display: none !important;
  }
  
  :deep(.el-sub-menu .el-menu-item:after) {
    display: none !important;
  }
  
  // 确保所有状态下的边框颜色一致
  :deep(.el-sub-menu .el-menu),
  :deep(.el-sub-menu:hover .el-menu),
  :deep(.el-sub-menu.is-opened .el-menu),
  :deep(.el-sub-menu.is-active .el-menu) {
    border: 1px solid rgba(102, 126, 234, 0.2) !important;
    background: rgba(255, 255, 255, 0.95) !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
  }
}

.category-submenu {
  :deep(.el-sub-menu__title) {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.category-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  
  .el-icon {
    font-size: 16px;
    color: #667eea;
  }
}

.category-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  margin: 2px 0;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none !important;
  background: transparent !important;
  
  .el-icon {
    font-size: 16px;
    color: #667eea;
  }
  
  &:hover {
    background: rgba(102, 126, 234, 0.08) !important;
    color: #667eea;
    transform: translateX(2px);
    border: none !important;
  }
  
  &.is-active {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%) !important;
    color: #667eea;
    font-weight: 600;
    border: none !important;
  }
}

.search-box {
  min-width: 280px;
  max-width: 360px;
  flex: 1;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 20px;
  padding: 6px;
  box-shadow: 0 2px 16px rgba(99, 102, 241, 0.08);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &:hover {
    border-color: rgba(99, 102, 241, 0.3);
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.12);
    transform: translateY(-1px);
  }
  
  &.focused {
    border-color: rgba(99, 102, 241, 0.5);
    box-shadow: 0 6px 24px rgba(99, 102, 241, 0.18);
    transform: translateY(-2px);
  }
}

.search-input {
  flex: 1;
  
  :deep(.el-input__wrapper) {
    border: none;
    background: transparent;
    box-shadow: none;
    border-radius: 20px;
    padding: 0 12px;
    
    &:hover, &.is-focus {
      border: none;
      box-shadow: none;
    }
  }
  
  :deep(.el-input__inner) {
    font-size: 0.9rem;
    color: #2c3e50;
    
    &::placeholder {
      color: #94a3b8;
      font-weight: 500;
    }
  }
}

.search-prefix-icon {
  color: #94a3b8;
  font-size: 16px;
  transition: color 0.3s ease;
}

.search-btn {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
  
  &.focused {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  }
  
  .el-icon {
    font-size: 16px;
  }
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.login-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  
  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
  
  .el-icon {
    font-size: 16px;
  }
}

.user-dropdown {
  cursor: pointer;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    border-color: rgba(102, 126, 234, 0.4);
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.15);
  }
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  
  .el-icon {
    color: white;
    font-size: 18px;
  }
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.username {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.2;
}

.user-role {
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 500;
}

.dropdown-arrow {
  color: #94a3b8;
  font-size: 14px;
  transition: transform 0.3s ease;
}

.user-dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.user-dropdown-menu {
  border-radius: 16px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.95);
  padding: 8px;
  
  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 12px;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(102, 126, 234, 0.08);
      color: #667eea;
    }
    
    &.logout-item:hover {
      background: rgba(239, 68, 68, 0.08);
      color: #ef4444;
    }
    
    .el-icon {
      font-size: 16px;
    }
  }
}

.mobile-menu-btn {
  display: none;
  cursor: pointer;
  padding: 12px;
  color: #2c3e50;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.08);
    transform: scale(1.1);
  }
}

.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
}

.mobile-menu-content {
  padding: 20px;
}

.mobile-search {
  margin-bottom: 20px;
}

.mobile-nav {
  .nav-item {
    padding: 16px 20px;
    cursor: pointer;
    color: #2c3e50;
    border-bottom: 1px solid rgba(102, 126, 234, 0.1);
    border-radius: 12px;
    margin: 4px 0;
    font-weight: 600;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
      transition: left 0.5s;
    }
    
    &:hover {
      color: #667eea;
      background: rgba(102, 126, 234, 0.08);
      transform: translateX(8px);
      
      &::before {
        left: 100%;
      }
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .nav-category-title {
    font-weight: 700;
    color: #667eea;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  }
  
  .nav-category-item {
    padding-left: 32px;
    font-size: 0.9rem;
    font-weight: 500;
  }
}

@media (max-width: 1024px) {
  .nav-menu {
    max-width: 350px;
  }
  
  .search-box {
    min-width: 240px;
    max-width: 300px;
  }
}

@media (max-width: 640px) {
  .nav-menu,
  .search-box {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .logo-text {
    display: none;
  }
  
  .logo {
    padding: 8px 12px;
    gap: 8px;
  }
  
  .logo-icon {
    width: 32px;
    height: 32px;
    
    .el-icon {
      font-size: 16px;
    }
  }
  
  .user-actions {
    gap: 8px;
  }
  
  .login-btn {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
  
  .user-profile {
    padding: 6px 12px;
    gap: 8px;
  }
  
  .user-avatar {
    width: 28px;
    height: 28px;
    
    .el-icon {
      font-size: 14px;
    }
  }
  
  .username {
    font-size: 0.8rem;
  }
  
  .user-role {
    font-size: 0.6rem;
  }
}

@media (max-width: 480px) {
  .user-actions {
    .el-button {
      padding: 8px 12px;
      font-size: 0.8rem;
    }
  }
}
</style>
