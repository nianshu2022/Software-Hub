<template>
  <div class="software-list">
    <Header />
    
    <div class="page-container">
      <div class="container">
        <!-- 页面标题 -->
        <div class="page-header">
          <h1 class="page-title">软件列表</h1>
          <p class="page-subtitle">发现更多优质软件</p>
        </div>

        <!-- 筛选器 -->
        <div class="filters-section">
          <div class="filters-row">
            <div class="filter-group">
              <label>分类:</label>
              <el-select 
                v-model="filters.category" 
                placeholder="选择分类"
                clearable
                @change="handleFilterChange"
              >
                <el-option
                  v-for="category in categories"
                  :key="category.id"
                  :label="category.name"
                  :value="category.id"
                />
              </el-select>
            </div>
            
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
          <el-empty description="暂无软件数据">
            <el-button type="primary" @click="resetFilters">重置筛选</el-button>
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
import { Search } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const softwareStore = useSoftwareStore()

const loading = ref(false)

// 计算属性
const softwareList = computed(() => softwareStore.softwareList)
const categories = computed(() => softwareStore.categories)
const platformOptions = computed(() => softwareStore.platformOptions)
const pagination = computed(() => softwareStore.pagination)
const filters = computed(() => softwareStore.filters)

// 方法
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
  // 更新URL
  router.replace({ name: 'SoftwareList' })
}

const loadSoftwareList = async () => {
  loading.value = true
  try {
    await softwareStore.fetchSoftwareList()
  } catch (error) {
    console.error('加载软件列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 监听路由查询参数
watch(() => route.query, (newQuery) => {
  const { search, category, platform, featured } = newQuery
  
  if (search || category || platform || featured) {
    softwareStore.setFilters({
      search: search || '',
      category: category ? parseInt(category) : '',
      platform: platform || '',
      featured: featured === 'true'
    })
  }
}, { immediate: true })

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
.software-list {
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 12px;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
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
  .page-title {
    font-size: 2rem;
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
  .page-title {
    font-size: 1.8rem;
  }
  
  .filters-section {
    padding: 16px;
  }
  
  .software-grid {
    grid-template-columns: 1fr;
  }
}
</style>
