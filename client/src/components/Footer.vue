<template>
  <footer class="footer">
    <!-- 背景装饰 -->
    <div class="footer-background">
      <div class="footer-shapes">
        <div class="footer-shape footer-shape-1"></div>
        <div class="footer-shape footer-shape-2"></div>
        <div class="footer-shape footer-shape-3"></div>
      </div>
    </div>
    
    <div class="container">
      <div class="footer-content">
        <div class="footer-main">
          <div class="footer-info">
            <div class="info-item">
              <el-icon><Calendar /></el-icon>
              <span>© 2025 软件下载站</span>
            </div>
          </div>
        </div>
        
        <div class="footer-links">
          <div class="beian-links">
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" class="beian-link">
              <img src="/img/miit.ico" alt="ICP备案" class="beian-icon">
              <span>陇ICP备2023001612号-1</span>
            </a>
            <a href="https://beian.mps.gov.cn/" target="_blank" rel="noopener noreferrer" class="beian-link">
              <img src="/img/mps.ico" alt="公安部备案" class="beian-icon">
              <span>甘公网安备62010202004273号</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Calendar } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.footer {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  color: #2c3e50;
  position: relative;
  overflow: hidden;
  border-top: 1px solid rgba(102, 126, 234, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 20%, rgba(102, 126, 234, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, rgba(118, 75, 162, 0.08) 0%, transparent 50%);
    pointer-events: none;
  }
}

// 背景装饰
.footer-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.footer-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.footer-shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  animation: footerFloat 25s infinite ease-in-out;
  
  &.footer-shape-1 {
    width: 60px;
    height: 60px;
    top: 20%;
    left: 15%;
    animation-delay: 0s;
  }
  
  &.footer-shape-2 {
    width: 80px;
    height: 80px;
    top: 60%;
    right: 20%;
    animation-delay: 8s;
  }
  
  &.footer-shape-3 {
    width: 40px;
    height: 40px;
    bottom: 30%;
    left: 70%;
    animation-delay: 16s;
  }
}

@keyframes footerFloat {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
    opacity: 0.2;
  }
  25% { 
    transform: translateY(-15px) rotate(90deg);
    opacity: 0.4;
  }
  50% { 
    transform: translateY(-8px) rotate(180deg);
    opacity: 0.3;
  }
  75% { 
    transform: translateY(-20px) rotate(270deg);
    opacity: 0.5;
  }
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 0;
  gap: 40px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
  min-height: 120px;
}

.footer-main {
  display: flex;
  align-items: center;
  gap: 40px;
  flex: 1;
}


.footer-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
  
  .el-icon {
    color: #667eea;
    font-size: 16px;
  }
}


.footer-links {
  display: flex;
  align-items: center;
}

.beian-links {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.beian-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  backdrop-filter: blur(20px);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
    background-size: 200% 100%;
    animation: shimmer 3s ease-in-out infinite;
  }
  
  &:hover {
    color: #667eea;
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(102, 126, 234, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  }
  
  &:active {
    transform: translateY(0px);
  }
}

.beian-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

// 响应式设计
@media (max-width: 1024px) {
  .footer-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  
  .footer-info {
    flex-direction: row;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 30px;
    padding: 30px 0;
  }
  
  .footer-main {
    align-items: center;
    gap: 24px;
  }
  
  .footer-info {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  
  .beian-links {
    justify-content: center;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .footer-content {
    gap: 24px;
    padding: 24px 0;
  }
  
  
  .beian-links {
    gap: 8px;
    flex-direction: column;
    align-items: center;
  }
  
  .beian-link {
    font-size: 0.8rem;
    padding: 8px 14px;
  }
}
</style>
