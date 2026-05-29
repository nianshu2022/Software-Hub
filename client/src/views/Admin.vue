<template>
  <div class="admin-page">
    <div class="admin-layout">
      <!-- 侧边栏 -->
      <div class="admin-sidebar">
        <div class="sidebar-header">
          <h3>管理后台</h3>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="dashboard">
            <el-icon><DataAnalysis /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          <el-menu-item index="software">
            <el-icon><Download /></el-icon>
            <span>软件管理</span>
          </el-menu-item>
          <el-menu-item index="categories">
            <el-icon><Folder /></el-icon>
            <span>分类管理</span>
          </el-menu-item>
          <el-menu-item index="users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
        </el-menu>
      </div>
      
      <!-- 主内容区 -->
      <div class="admin-main">
        <!-- 顶部导航 -->
        <div class="admin-header">
          <div class="header-left">
            <h2>{{ pageTitle }}</h2>
          </div>
          <div class="header-right">
            <el-dropdown @command="handleUserCommand">
              <el-button type="text" class="user-button">
                <el-icon><User /></el-icon>
                {{ userInfo?.username }}
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
        
        <!-- 页面内容 -->
        <div class="admin-content">
          <!-- 仪表盘 -->
          <div v-if="activeMenu === 'dashboard'" class="dashboard">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon">
                  <el-icon><Download /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ stats.totalSoftware }}</div>
                  <div class="stat-label">软件总数</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">
                  <el-icon><Folder /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ stats.totalCategories }}</div>
                  <div class="stat-label">分类总数</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">
                  <el-icon><Star /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ stats.featuredSoftware }}</div>
                  <div class="stat-label">推荐软件</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">
                  <el-icon><TrendCharts /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ stats.totalDownloads }}</div>
                  <div class="stat-label">总下载量</div>
                </div>
              </div>
            </div>
            
            <div class="dashboard-content">
              <div class="recent-software">
                <h3>最近添加的软件</h3>
                <el-table :data="recentSoftware" style="width: 100%">
                  <el-table-column prop="name" label="软件名称" />
                  <el-table-column prop="developer" label="开发者" />
                  <el-table-column prop="platform" label="平台" />
                  <el-table-column prop="created_at" label="添加时间">
                    <template #default="scope">
                      {{ formatDate(scope.row.created_at) }}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          
          <!-- 软件管理 -->
          <div v-else-if="activeMenu === 'software'" class="software-management">
            <div class="management-header">
              <el-button type="primary" @click="showSoftwareDialog = true">
                <el-icon><Plus /></el-icon>
                添加软件
              </el-button>
            </div>
            
            <el-table :data="softwareList" style="width: 100%" v-loading="loading">
              <el-table-column prop="name" label="软件名称" />
              <el-table-column prop="developer" label="开发者" />
              <el-table-column prop="platform" label="平台" />
              <el-table-column prop="download_count" label="下载次数" />
              <el-table-column prop="is_featured" label="推荐">
                <template #default="scope">
                  <el-tag :type="scope.row.is_featured ? 'success' : 'info'">
                    {{ scope.row.is_featured ? '是' : '否' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template #default="scope">
                  <el-button size="small" @click="editSoftware(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteSoftware(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          
          <!-- 分类管理 -->
          <div v-else-if="activeMenu === 'categories'" class="categories-management">
            <div class="management-header">
              <el-button type="primary" @click="showCategoryDialog = true">
                <el-icon><Plus /></el-icon>
                添加分类
              </el-button>
            </div>
            
            <el-table :data="categories" style="width: 100%" v-loading="loading">
              <el-table-column prop="name" label="分类名称" />
              <el-table-column prop="description" label="描述" />
              <el-table-column prop="software_count" label="软件数量" />
              <el-table-column prop="sort_order" label="排序" />
              <el-table-column label="操作" width="200">
                <template #default="scope">
                  <el-button size="small" @click="editCategory(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteCategory(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          
          <!-- 用户管理 -->
          <div v-else-if="activeMenu === 'users'" class="users-management">
            <div class="management-header">
              <h3>用户管理</h3>
              <p>当前系统用户列表</p>
            </div>
            
            <el-table :data="usersList" style="width: 100%" v-loading="loading">
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="username" label="用户名" />
              <el-table-column prop="email" label="邮箱" />
              <el-table-column prop="role" label="角色">
                <template #default="scope">
                  <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'primary'">
                    {{ scope.row.role === 'admin' ? '管理员' : '编辑者' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="created_at" label="创建时间">
                <template #default="scope">
                  {{ formatDate(scope.row.created_at) }}
                </template>
              </el-table-column>
              <el-table-column prop="last_login" label="最后登录">
                <template #default="scope">
                  {{ scope.row.last_login ? formatDate(scope.row.last_login) : '从未登录' }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template #default="scope">
                  <el-button 
                    size="small" 
                    :type="scope.row.role === 'admin' ? 'warning' : 'success'"
                    @click="toggleUserRole(scope.row)"
                  >
                    {{ scope.row.role === 'admin' ? '设为编辑者' : '设为管理员' }}
                  </el-button>
                  <el-button 
                    size="small" 
                    type="danger" 
                    @click="deleteUser(scope.row)"
                    :disabled="scope.row.id === userInfo?.id"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 软件编辑对话框 -->
    <SoftwareDialog
      v-model="showSoftwareDialog"
      :software="editingSoftware"
      @success="handleSoftwareSuccess"
    />
    
    <!-- 分类编辑对话框 -->
    <CategoryDialog
      v-model="showCategoryDialog"
      :category="editingCategory"
      @success="handleCategorySuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSoftwareStore } from '@/stores/software'
import { apiFetch } from '@/utils/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import SoftwareDialog from '@/components/SoftwareDialog.vue'
import CategoryDialog from '@/components/CategoryDialog.vue'
import { 
  DataAnalysis, 
  Download, 
  Folder, 
  User, 
  ArrowDown, 
  Star, 
  TrendCharts, 
  Plus 
} from '@element-plus/icons-vue'

const router = useRouter()
const softwareStore = useSoftwareStore()

const activeMenu = ref('dashboard')
const loading = ref(false)
const showSoftwareDialog = ref(false)
const showCategoryDialog = ref(false)
const editingSoftware = ref(null)
const editingCategory = ref(null)
const usersList = ref([])

// 计算属性
const userInfo = computed(() => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
})

const pageTitle = computed(() => {
  const titles = {
    dashboard: '仪表盘',
    software: '软件管理',
    categories: '分类管理',
    users: '用户管理'
  }
  return titles[activeMenu.value] || '管理后台'
})

const softwareList = computed(() => softwareStore.softwareList)
const categories = computed(() => softwareStore.categories)

const stats = computed(() => ({
  totalSoftware: softwareList.value.length,
  totalCategories: categories.value.length,
  featuredSoftware: softwareList.value.filter(s => s.is_featured).length,
  totalDownloads: softwareList.value.reduce((sum, s) => sum + (s.download_count || 0), 0)
}))

const recentSoftware = computed(() => 
  softwareList.value
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10)
)

// 方法
const handleMenuSelect = (index) => {
  activeMenu.value = index
  if (index === 'software') {
    loadSoftwareList()
  } else if (index === 'categories') {
    loadCategories()
  } else if (index === 'users') {
    loadUsersList()
  }
}

const handleUserCommand = (command) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人资料功能开发中')
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
  ElMessage.success('已退出登录')
}

const loadSoftwareList = async () => {
  loading.value = true
  try {
    await softwareStore.fetchSoftwareList({ limit: 100 })
  } catch (error) {
    ElMessage.error('加载软件列表失败')
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  loading.value = true
  try {
    await softwareStore.fetchCategories()
  } catch (error) {
    ElMessage.error('加载分类列表失败')
  } finally {
    loading.value = false
  }
}

const loadUsersList = async () => {
  loading.value = true
  try {
    const response = await apiFetch('/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (response.ok) {
      const data = await response.json()
      usersList.value = data.users || []
    } else {
      throw new Error('获取用户列表失败')
    }
  } catch (error) {
    ElMessage.error('加载用户列表失败')
    console.error('Error loading users:', error)
  } finally {
    loading.value = false
  }
}

const toggleUserRole = async (user) => {
  try {
    const newRole = user.role === 'admin' ? 'editor' : 'admin'
    const response = await apiFetch(`/users/${user.id}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ role: newRole })
    })
    
    if (response.ok) {
      user.role = newRole
      ElMessage.success(`用户角色已更新为${newRole === 'admin' ? '管理员' : '编辑者'}`)
    } else {
      throw new Error('更新用户角色失败')
    }
  } catch (error) {
    ElMessage.error('更新用户角色失败')
    console.error('Error updating user role:', error)
  }
}

const deleteUser = async (user) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${user.username}" 吗？此操作不可撤销。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    const response = await apiFetch(`/users/${user.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (response.ok) {
      usersList.value = usersList.value.filter(u => u.id !== user.id)
      ElMessage.success('用户删除成功')
    } else {
      throw new Error('删除用户失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除用户失败')
      console.error('Error deleting user:', error)
    }
  }
}

const editSoftware = (software) => {
  editingSoftware.value = software
  showSoftwareDialog.value = true
}

const deleteSoftware = async (software) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除软件 "${software.name}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await softwareStore.deleteSoftware(software.id)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const editCategory = (category) => {
  editingCategory.value = category
  showCategoryDialog.value = true
}

const deleteCategory = async (category) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类 "${category.name}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 这里需要实现删除分类的API调用
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSoftwareSuccess = () => {
  showSoftwareDialog.value = false
  editingSoftware.value = null
  loadSoftwareList()
}

const handleCategorySuccess = () => {
  showCategoryDialog.value = false
  editingCategory.value = null
  loadCategories()
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

onMounted(async () => {
  try {
    await Promise.all([
      softwareStore.fetchCategories(),
      loadSoftwareList()
    ])
  } catch (error) {
    console.error('初始化失败:', error)
  }
})
</script>

<style lang="scss" scoped>
.admin-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-sidebar {
  width: 250px;
  background: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  
  h3 {
    margin: 0;
    color: #2c3e50;
    font-weight: 600;
  }
}

.sidebar-menu {
  border-right: none;
  
  :deep(.el-menu-item) {
    height: 50px;
    line-height: 50px;
    
    &:hover {
      background-color: #f5f7fa;
    }
    
    &.is-active {
      background-color: #e6f7ff;
      color: #1890ff;
    }
  }
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.admin-header {
  background: white;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  h2 {
    margin: 0;
    color: #2c3e50;
    font-weight: 600;
  }
}

.user-button {
  color: #2c3e50;
  
  &:hover {
    color: #1890ff;
  }
}

.admin-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.dashboard {
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }
  
  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
  }
  
  .stat-content {
    flex: 1;
  }
  
  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 4px;
  }
  
  .stat-label {
    color: #7f8c8d;
    font-size: 0.9rem;
  }
  
  .dashboard-content {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    
    h3 {
      margin: 0 0 20px 0;
      color: #2c3e50;
      font-weight: 600;
    }
  }
}

.management-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.software-management,
.categories-management {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .admin-sidebar {
    width: 200px;
  }
  
  .admin-content {
    padding: 16px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 16px;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
}
</style>
