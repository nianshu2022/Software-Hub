<template>
  <div class="software-card" @click="goToDetail">
    <div class="card-image">
      <img 
        v-if="software.icon_url" 
        :src="software.icon_url" 
        :alt="software.name"
        @error="handleImageError"
      />
      <div v-else class="default-icon">
        <el-icon size="40"><Download /></el-icon>
      </div>
      <div v-if="software.is_featured" class="featured-badge">
        <el-icon><Star /></el-icon>
        推荐
      </div>
    </div>
    
    <div class="card-content">
      <div class="card-header">
        <h3 class="software-name">{{ software.name }}</h3>
        <div class="software-version" v-if="software.version">
          v{{ software.version }}
        </div>
      </div>
      
      <p class="software-description">
        {{ truncateDescription(software.description) }}
      </p>
      
      <div class="software-meta">
        <div class="meta-item" v-if="software.developer">
          <el-icon><User /></el-icon>
          <span>{{ software.developer }}</span>
        </div>
        <div class="meta-item" v-if="software.platform">
          <el-icon><Monitor /></el-icon>
          <span>{{ software.platform }}</span>
        </div>
        <div class="meta-item" v-if="software.file_size">
          <el-icon><Folder /></el-icon>
          <span>{{ software.file_size }}</span>
        </div>
      </div>
      
      <div class="card-footer">
        <div class="download-info">
          <span class="download-count">
            <el-icon><Download /></el-icon>
            {{ formatDownloadCount(software.download_count) }}
          </span>
          <div class="rating" v-if="software.rating > 0">
            <el-rate 
              :model-value="software.rating" 
              disabled 
              show-score 
              text-color="#ff9900"
              score-template="{value}"
            />
          </div>
        </div>
        
        <div class="category-tag" v-if="software.category_name">
          <el-tag size="small" type="info">
            {{ software.category_name }}
          </el-tag>
        </div>
      </div>
      
      <div class="card-actions">
        <el-button 
          type="primary" 
          size="small" 
          @click.stop="handleDownload"
        >
          <el-icon><Download /></el-icon>
          下载
        </el-button>
        <el-button 
          size="small" 
          @click.stop="goToDetail"
        >
          详情
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { 
  Download, 
  Star, 
  User, 
  Monitor, 
  Folder 
} from '@element-plus/icons-vue'

const props = defineProps({
  software: {
    type: Object,
    required: true
  }
})

const router = useRouter()

// 方法
const goToDetail = () => {
  router.push(`/software/${props.software.id}`)
}

const handleDownload = () => {
  if (props.software.download_url) {
    window.open(props.software.download_url, '_blank')
  }
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
  event.target.nextElementSibling?.classList.add('show')
}

const truncateDescription = (description) => {
  if (!description) return ''
  return description.length > 100 
    ? description.substring(0, 100) + '...' 
    : description
}

const formatDownloadCount = (count) => {
  if (!count) return '0'
  if (count < 1000) return count.toString()
  if (count < 10000) return (count / 1000).toFixed(1) + 'K'
  if (count < 1000000) return (count / 10000).toFixed(1) + 'W'
  return (count / 1000000).toFixed(1) + 'M'
}
</script>

<style lang="scss" scoped>
.software-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
    background-size: 200% 100%;
    animation: shimmer 3s ease-in-out infinite;
  }

  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    border-color: rgba(102, 126, 234, 0.3);
  }
}

.card-image {
  position: relative;
  height: 120px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);

  img {
    width: 70px;
    height: 70px;
    object-fit: contain;
    border-radius: 16px;
    transition: all 0.3s ease;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  }

  .default-icon {
    color: #667eea;
    font-size: 48px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .featured-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: linear-gradient(135deg, #ff6b6b, #ffa500);
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 4px;
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
    animation: pulse 2s infinite;
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.card-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.software-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  flex: 1;
  line-height: 1.3;
  background: linear-gradient(135deg, #2c3e50 0%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.software-version {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: #667eea;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  margin-left: 8px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.software-description {
  color: #64748b;
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 12px;
  flex: 1;
  font-weight: 500;
}

.software-meta {
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 0.8rem;
  margin-bottom: 6px;
  font-weight: 500;

  .el-icon {
    font-size: 14px;
    color: #667eea;
  }
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.download-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.download-count {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 600;

  .el-icon {
    font-size: 14px;
    color: #667eea;
  }
}

.rating {
  :deep(.el-rate) {
    font-size: 12px;
  }
}

.category-tag {
  .el-tag {
    font-size: 0.7rem;
  }
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;

  .el-button {
    flex: 1;
    font-size: 0.8rem;
    font-weight: 600;
    border-radius: 10px;
    height: 32px;
    transition: all 0.3s ease;
    
    &.el-button--primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }
    }
    
    &.el-button--default {
      background: rgba(102, 126, 234, 0.1);
      border: 1px solid rgba(102, 126, 234, 0.2);
      color: #667eea;
      
      &:hover {
        background: rgba(102, 126, 234, 0.15);
        border-color: #667eea;
        transform: translateY(-1px);
      }
    }
  }
}

@media (max-width: 768px) {
  .card-content {
    padding: 12px;
  }

  .software-name {
    font-size: 1rem;
  }

  .card-actions {
    gap: 6px;
    
    .el-button {
      font-size: 0.75rem;
      height: 28px;
    }
  }
}
</style>
