<template>
  <div class="featured-software-page">
    <!-- 头部导航 -->
    <Header />
    
    <!-- 主要内容 -->
    <div class="main-content">
      <!-- 页面标题区域 -->
      <section class="page-header">
        <div class="container">
          <div class="header-content">
            <div class="title-section">
              <h1 class="page-title">推荐软件</h1>
              <p class="page-subtitle">精选优质软件，提升工作效率</p>
            </div>
            <div class="header-actions">
              <el-button @click="goBack" size="large" class="back-btn">
                <el-icon><ArrowLeft /></el-icon>
                返回首页
              </el-button>
              <el-button @click="goToAllSoftware" type="primary" size="large">
                <el-icon><Download /></el-icon>
                浏览全部
              </el-button>
            </div>
          </div>
        </div>
      </section>

      <!-- 软件展示区域 -->
      <section class="software-showcase">
        <div class="container">
          <div class="showcase-content">
            <!-- 软件网格 -->
            <div class="software-grid" v-loading="loading">
              <SoftwareCard
                v-for="software in featuredSoftware"
                :key="software.id"
                :software="software"
                class="software-card"
              />
            </div>
            
            <!-- 空状态 -->
            <div v-if="!loading && featuredSoftware.length === 0" class="empty-state">
              <div class="empty-icon">
                <el-icon><Star /></el-icon>
              </div>
              <h3>暂无推荐软件</h3>
              <p>我们正在为您精选优质软件，请稍后再来查看</p>
              <el-button @click="goToAllSoftware" type="primary">
                浏览全部软件
              </el-button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSoftwareStore } from '@/stores/software'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import SoftwareCard from '@/components/SoftwareCard.vue'
import {
  ArrowLeft,
  Download,
  Star
} from '@element-plus/icons-vue'

const router = useRouter()
const softwareStore = useSoftwareStore()

const loading = ref(false)

// 计算属性
const featuredSoftware = computed(() => softwareStore.featuredSoftware)

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    await softwareStore.fetchSoftwareList({ featured: true })
  } catch (error) {
    console.error('加载推荐软件失败:', error)
  } finally {
    loading.value = false
  }
}

// 返回首页
const goBack = () => {
  router.push('/')
}

// 跳转到全部软件页面
const goToAllSoftware = () => {
  router.push('/software')
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.featured-software-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 70px;
}

// 页面标题区域
.page-header {
  padding: 30px 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  flex-shrink: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

.title-section {
  flex: 1;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  font-weight: 500;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 16px;
  flex-shrink: 0;
}

.back-btn {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(102, 126, 234, 0.2);
  color: #667eea;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 1);
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
  }
}

// 软件展示区域
.software-showcase {
  flex: 1;
  padding: 20px 0;
}

.showcase-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.software-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  flex: 1;
  padding: 10px 0;
  
  // 自定义滚动条
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(102, 126, 234, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 3px;
    
    &:hover {
      background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    }
  }
}

.software-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border-color: rgba(102, 126, 234, 0.3);
  }
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 40px;
  
  .empty-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    
    .el-icon {
      color: white;
      font-size: 40px;
    }
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 12px;
  }
  
  p {
    font-size: 1rem;
    color: #64748b;
    margin-bottom: 24px;
    max-width: 400px;
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .software-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding-top: 60px;
  }
  
  .page-header {
    padding: 20px 0;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
    
    .el-button {
      width: 100%;
    }
  }
  
  .software-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.8rem;
  }
  
  .software-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
