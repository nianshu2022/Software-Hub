<template>
  <div class="category-list">
    <Header />
    
    <div class="page-container">
      <div class="container">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/" class="breadcrumb">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'SoftwareList' }">软件列表</el-breadcrumb-item>
          <el-breadcrumb-item v-if="category">{{ category.name }}</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 分类信息 -->
        <div v-if="category" class="category-header">
          <div class="category-info">
            <div class="category-icon">
              <el-icon size="48">
                <component :is="getCategoryIcon(category.icon)" />
              </el-icon>
            </div>
            <div class="category-details">
              <h1 class="category-name">{{ category.name }}</h1>
              <p class="category-description">{{ category.description }}</p>
              <div class="category-stats">
                <span class="stat-item">
                  <el-icon><Download /></el-icon>
                  {{ category.software_count }} 个软件
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 筛选器 -->
        <div class="filters-section">
          <div class="filters-row">
            <div class="filter-group">
              <label>平台:</label>
              <el-select 
                v-model="filters.platform" 
                placeholder="选择平台"
                clearable
                @change="handleFilterChange"
              >
                <el-option
                  v-for="platform in platformOptions"
                  :key="platform.value"
                  :label="platform.label"
                  :value="platform.value"
                />
              </el-select>
            </div>
            
            <div class="filter-group">
              <label>搜索:</label>
              <el-input
                v-model="filters.search"
                placeholder="搜索软件名称、开发者..."
                @keyup.enter="handleFilterChange"
                @clear="handleFilterChange"
                clearable
              >
                <template #append>
                  <el-button @click="handleFilterChange">
                    <el-icon><Search /></el-icon>
                  </el-button>
                </template>
              </el-input>
            </div>
            
            <div class="filter-group">
              <el-checkbox 
                v-model="filters.featured" 
                @change="handleFilterChange"
              >
                仅显示推荐
              </el-checkbox>
            </div>
          </div>
          
          <div class="filter-actions">
            <el-button @click="resetFilters">重置筛选</el-button>
            <el-button type="primary" @click="handleFilterChange">应用筛选</el-button>
          </div>
        </div>

        <!-- 软件列表 -->
        <div class="software-grid" v-loading="loading">
          <SoftwareCard 
            v-for="software in softwareList" 
            :key="software.id"
            :software="software"
          />
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && softwareList.length === 0" class="empty-state">
          <el-empty description="该分类下暂无软件">
            <el-button type="primary" @click="goToSoftwareList">浏览所有软件</el-button>
          </el-empty>
        </div>

        <!-- 分页 -->
        <div v-if="pagination.totalPages > 1" class="pagination-wrapper">
          <el-pagination
            v-model:current-page="pagination.currentPage"
            :page-size="pagination.itemsPerPage"
            :total="pagination.totalItems"
            layout="total, prev, pager, next, jumper"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSoftwareStore } from '@/stores/software'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import SoftwareCard from '@/components/SoftwareCard.vue'
import { 
  Search, 
  Download, 
  Cpu, 
  OfficeBuilding, 
  Brush, 
  Setting, 
  Connection, 
  VideoPlay, 
  Trophy, 
  WarningFilled,
  More
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const softwareStore = useSoftwareStore()

const loading = ref(false)
const category = ref(null)

// 计算属性
const softwareList = computed(() => softwareStore.softwareList)
const platformOptions = computed(() => softwareStore.platformOptions)
const pagination = computed(() => softwareStore.pagination)
const filters = computed(() => softwareStore.filters)

// 图标映射
const iconMap = {
  code: Cpu,
  office: OfficeBuilding,
  design: Brush,
  system: Setting,
  network: Connection,
  media: VideoPlay,
  game: Trophy,
  security: WarningFilled,
  other: More
}

// 方法
const getCategoryIcon = (iconName) => {
  return iconMap[iconName] || More
}

const handleFilterChange = async () => {
  softwareStore.setFilters(filters.value)
  await loadSoftwareList()
}

const handlePageChange = async (page) => {
  softwareStore.setPage(page)
  await loadSoftwareList()
}

const resetFilters = async () => {
  softwareStore.resetFilters()
  await loadSoftwareList()
}

const goToSoftwareList = () => {
  router.push({ name: 'SoftwareList' })
}

const loadCategory = async () => {
  const categoryId = route.params.id
  if (!categoryId) return
  
  try {
    const response = await softwareStore.fetchCategories()
    category.value = response.find(c => c.id == categoryId)
  } catch (error) {
    console.error('加载分类信息失败:', error)
  }
}

const loadSoftwareList = async () => {
  const categoryId = route.params.id
  if (!categoryId) return
  
  loading.value = true
  try {
    await softwareStore.fetchSoftwareList({
      category: categoryId,
      ...filters.value
    })
  } catch (error) {
    console.error('加载软件列表失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    await Promise.all([
      loadCategory(),
      loadSoftwareList()
    ])
  } catch (error) {
    console.error('初始化失败:', error)
  }
})
</script>

<style lang="scss" scoped>
.category-list {
  min-height: 100vh;
}

.breadcrumb {
  margin-bottom: 30px;
}

.category-header {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.category-info {
  display: flex;
  align-items: center;
  gap: 24px;
}

.category-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.category-details {
  flex: 1;
}

.category-name {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8px;
}

.category-description {
  color: #666;
  font-size: 1rem;
  margin-bottom: 16px;
  line-height: 1.6;
}

.category-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 0.9rem;
}

.filters-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.filters-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  label {
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.9rem;
  }
}

.filter-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.software-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

@media (max-width: 768px) {
  .category-info {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .category-name {
    font-size: 1.5rem;
  }
  
  .filters-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .filter-actions {
    justify-content: center;
  }
  
  .software-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .category-header {
    padding: 20px;
  }
  
  .category-icon {
    width: 60px;
    height: 60px;
  }
  
  .category-name {
    font-size: 1.3rem;
  }
  
  .software-grid {
    grid-template-columns: 1fr;
  }
}
</style>
