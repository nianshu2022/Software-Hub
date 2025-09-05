<template>
  <div class="software-detail">
    <Header />
    
    <div class="page-container" v-loading="loading">
      <div class="container" v-if="software">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/" class="breadcrumb">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'SoftwareList' }">软件列表</el-breadcrumb-item>
          <el-breadcrumb-item v-if="software.category_name" :to="{ name: 'CategoryList', params: { id: software.category_id } }">
            {{ software.category_name }}
          </el-breadcrumb-item>
          <el-breadcrumb-item>{{ software.name }}</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="detail-content">
          <!-- 软件基本信息 -->
          <div class="software-info">
            <div class="software-header">
              <div class="software-icon">
                <img 
                  v-if="software.icon_url" 
                  :src="software.icon_url" 
                  :alt="software.name"
                  @error="handleImageError"
                />
                <div v-else class="default-icon">
                  <el-icon size="60"><Download /></el-icon>
                </div>
              </div>
              
              <div class="software-meta">
                <h1 class="software-name">{{ software.name }}</h1>
                <div class="software-version" v-if="software.version">
                  版本: {{ software.version }}
                </div>
                <div class="software-developer" v-if="software.developer">
                  开发者: {{ software.developer }}
                </div>
                <div class="software-platform" v-if="software.platform">
                  支持平台: {{ software.platform }}
                </div>
                <div class="software-license" v-if="software.license_type">
                  许可证: {{ software.license_type }}
                </div>
                <div class="software-size" v-if="software.file_size">
                  文件大小: {{ software.file_size }}
                </div>
              </div>
              
              <div class="software-actions">
                <el-button 
                  type="primary" 
                  size="large"
                  @click="handleDownload"
                >
                  <el-icon><Download /></el-icon>
                  立即下载
                </el-button>
                <el-button 
                  v-if="software.official_url"
                  size="large"
                  @click="goToOfficial"
                >
                  <el-icon><Link /></el-icon>
                  官方网站
                </el-button>
              </div>
            </div>
            
            <div class="software-stats">
              <div class="stat-item">
                <span class="stat-number">{{ formatDownloadCount(software.download_count) }}</span>
                <span class="stat-label">下载次数</span>
              </div>
              <div class="stat-item" v-if="software.rating > 0">
                <span class="stat-number">{{ software.rating }}</span>
                <span class="stat-label">评分</span>
              </div>
              <div class="stat-item" v-if="software.release_date">
                <span class="stat-number">{{ formatDate(software.release_date) }}</span>
                <span class="stat-label">发布日期</span>
              </div>
              <div class="stat-item" v-if="software.last_updated">
                <span class="stat-number">{{ formatDate(software.last_updated) }}</span>
                <span class="stat-label">最后更新</span>
              </div>
            </div>
          </div>

          <!-- 软件描述 -->
          <div class="software-description">
            <h2>软件介绍</h2>
            <div class="description-content">
              {{ software.description }}
            </div>
          </div>

          <!-- 软件截图 -->
          <div v-if="screenshots.length > 0" class="software-screenshots">
            <h2>软件截图</h2>
            <div class="screenshots-grid">
              <div 
                v-for="(screenshot, index) in screenshots" 
                :key="index"
                class="screenshot-item"
                @click="previewScreenshot(screenshot)"
              >
                <img :src="screenshot" :alt="`截图 ${index + 1}`" />
              </div>
            </div>
          </div>

          <!-- 软件标签 -->
          <div v-if="tags.length > 0" class="software-tags">
            <h2>相关标签</h2>
            <div class="tags-list">
              <el-tag 
                v-for="tag in tags" 
                :key="tag"
                size="large"
                type="info"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 404状态 -->
      <div v-else-if="!loading" class="not-found">
        <el-result
          icon="error"
          title="软件不存在"
          sub-title="抱歉，您访问的软件不存在或已被删除"
        >
          <template #extra>
            <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
          </template>
        </el-result>
      </div>
    </div>
    
    <Footer />
    
    <!-- 图片预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="软件截图"
      width="80%"
      center
    >
      <div class="preview-image">
        <img :src="previewImage" alt="软件截图" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSoftwareStore } from '@/stores/software'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { Download, Link } from '@element-plus/icons-vue'

const route = useRoute()
const softwareStore = useSoftwareStore()

const loading = ref(false)
const previewVisible = ref(false)
const previewImage = ref('')

// 计算属性
const software = computed(() => softwareStore.currentSoftware)
const screenshots = computed(() => {
  if (software.value?.screenshot_urls) {
    try {
      return Array.isArray(software.value.screenshot_urls) 
        ? software.value.screenshot_urls 
        : JSON.parse(software.value.screenshot_urls)
    } catch {
      return []
    }
  }
  return []
})
const tags = computed(() => {
  if (software.value?.tags) {
    try {
      return Array.isArray(software.value.tags) 
        ? software.value.tags 
        : JSON.parse(software.value.tags)
    } catch {
      return []
    }
  }
  return []
})

// 方法
const handleDownload = () => {
  if (software.value?.download_url) {
    window.open(software.value.download_url, '_blank')
  }
}

const goToOfficial = () => {
  if (software.value?.official_url) {
    window.open(software.value.official_url, '_blank')
  }
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
}

const previewScreenshot = (imageUrl) => {
  previewImage.value = imageUrl
  previewVisible.value = true
}

const formatDownloadCount = (count) => {
  if (!count) return '0'
  if (count < 1000) return count.toString()
  if (count < 10000) return (count / 1000).toFixed(1) + 'K'
  if (count < 1000000) return (count / 10000).toFixed(1) + 'W'
  return (count / 1000000).toFixed(1) + 'M'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const loadSoftwareDetail = async () => {
  const softwareId = route.params.id
  if (!softwareId) return
  
  loading.value = true
  try {
    await softwareStore.fetchSoftwareDetail(softwareId)
  } catch (error) {
    console.error('加载软件详情失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadSoftwareDetail()
})
</script>

<style lang="scss" scoped>
.software-detail {
  min-height: 100vh;
}

.breadcrumb {
  margin-bottom: 30px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.software-info {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.software-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 30px;
  align-items: start;
  margin-bottom: 30px;
}

.software-icon {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 80px;
    height: 80px;
    object-fit: contain;
  }

  .default-icon {
    color: #667eea;
  }
}

.software-meta {
  flex: 1;
}

.software-name {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 12px;
}

.software-version,
.software-developer,
.software-platform,
.software-license,
.software-size {
  color: #666;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.software-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 160px;
}

.software-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.stat-item {
  text-align: center;
  
  .stat-number {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: #667eea;
    margin-bottom: 4px;
  }
  
  .stat-label {
    font-size: 0.9rem;
    color: #666;
  }
}

.software-description,
.software-screenshots,
.software-tags {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.software-description h2,
.software-screenshots h2,
.software-tags h2 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
}

.description-content {
  color: #666;
  line-height: 1.8;
  font-size: 1rem;
}

.screenshots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.screenshot-item {
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  img {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.preview-image {
  text-align: center;
  
  img {
    max-width: 100%;
    max-height: 70vh;
    object-fit: contain;
  }
}

.not-found {
  padding: 60px 0;
}

@media (max-width: 768px) {
  .software-header {
    grid-template-columns: 1fr;
    gap: 20px;
    text-align: center;
  }
  
  .software-icon {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    
    img {
      width: 60px;
      height: 60px;
    }
  }
  
  .software-name {
    font-size: 1.5rem;
  }
  
  .software-actions {
    flex-direction: row;
    justify-content: center;
  }
  
  .software-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .screenshots-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .software-info,
  .software-description,
  .software-screenshots,
  .software-tags {
    padding: 20px;
  }
  
  .software-stats {
    grid-template-columns: 1fr;
  }
  
  .screenshots-grid {
    grid-template-columns: 1fr;
  }
}
</style>
