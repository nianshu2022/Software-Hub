<template>
  <div class="home">
    <!-- 头部导航 -->
    <Header />
    
    <!-- 主要内容 -->
    <div class="main-content">
      <!-- 英雄区域 -->
      <section class="hero-section">
        <!-- 背景装饰 -->
        <div class="hero-background">
          <div class="floating-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
            <div class="shape shape-4"></div>
          </div>
        </div>
        
        <div class="container">
          <div class="hero-layout">
            <!-- 左侧主要内容 -->
            <div class="hero-main">
              <div class="hero-content">
                <div class="hero-badge">
                  <el-icon><Star /></el-icon>
                  <span>精选推荐</span>
                </div>
                <h1 class="hero-title">
                  <span class="title-line-1">发现优质</span>
                  <span class="title-line-2">软件工具</span>
                </h1>
                <p class="hero-subtitle">精选实用工具，提升工作效率，让工作更高效更智能</p>
                <div class="hero-actions">
                  <el-button @click="goToSoftwareList" type="primary" size="large" class="hero-btn-primary">
                    <el-icon><Download /></el-icon>
                    <span>浏览软件</span>
                    <div class="btn-ripple"></div>
                  </el-button>
                  <el-button @click="goToFeatured" size="large" class="hero-btn-secondary">
                    <el-icon><Star /></el-icon>
                    <span>查看推荐</span>
                  </el-button>
                </div>
                <div class="hero-links">
                  <div class="link-item" @click="openLink('https://blog.csdn.net/qq_52716296')" title="CSDN">
                    <img src="/img/csdn.ico" alt="CSDN" class="platform-icon">
                  </div>
                  <div class="link-item" @click="openLink('https://www.cnblogs.com/nianshu')" title="博客园">
                    <img src="/img/cnblogs.ico" alt="博客园" class="platform-icon">
                  </div>
                  <div class="link-item" @click="openLink('https://github.com/nianshu2022')" title="GitHub">
                    <img src="/img/github.png" alt="GitHub" class="platform-icon">
                  </div>
                  <div class="link-item" @click="openLink('https://music.163.com/#/user/home?id=1646904424')" title="网易云音乐">
                     <img src="/img/wyy.ico" alt="网易云音乐" class="platform-icon">
                  </div>
                  <div class="link-item" @click="openLink('mailto:nianshu2022@qq.com')" title="邮箱">
                    <el-icon><Message /></el-icon>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 右侧信息面板 -->
            <div class="hero-info-panel">
              <!-- 第一行：时间、天气、节假日、古诗词、关于作者 -->
              <div class="info-row info-row-1">
                <!-- 实时时间卡片 -->
                <div class="info-widget time-widget">
                <div class="widget-content">
                  <div class="time-display">
                    <div class="time-header">
                      <div class="time-info">
                        <div class="header-icon">
                          <el-icon><Clock /></el-icon>
                        </div>
                        <div class="header-text">
                          <h4>当前时间</h4>
                        </div>
                      </div>
                    </div>
                    <div class="time-content">
                      <div class="time-card">
                        <div class="time-data">
                          <div class="time">{{ currentTime }}</div>
                          <div class="date">{{ currentDateOnly }}</div>
                          <div class="weekday">{{ currentWeekday }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
                
                <!-- 实时天气卡片 -->
              <div class="info-widget weather-widget" @click="refreshWeather">
                <div class="widget-content">
                  <div class="weather-display">
                    <div class="weather-header">
                      <div class="weather-info">
                        <div class="header-icon">
                          <el-icon><Sunny /></el-icon>
                        </div>
                        <div class="header-text">
                          <h4>实时天气</h4>
                        </div>
                      </div>
                      <div class="weather-location">
                        {{ weather.location }}
                      </div>
                    </div>
                    <div class="weather-content">
                      <div class="weather-today">
                        <div class="weather-card">
                          <div class="weather-label">
                            <span class="label-text">今天</span>
                            <span class="label-dot"></span>
                          </div>
                          <div class="weather-details">
                            <div class="temperature">{{ weather.temperature !== null ? weather.temperature + '°C' : '--' }}</div>
                            <div class="weather-desc">{{ weather.description }}</div>
                          </div>
                        </div>
                      </div>
                      <div class="weather-tomorrow">
                        <div class="weather-card">
                          <div class="weather-label">
                            <span class="label-text">明天</span>
                            <span class="label-dot"></span>
                          </div>
                          <div class="weather-details">
                            <div class="temperature">{{ weather.tomorrow.temperature !== null ? weather.tomorrow.temperature + '°C' : '--' }}</div>
                            <div class="weather-desc">{{ weather.tomorrow.description }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
                
                <!-- 节假日倒计时卡片 -->
                <div class="info-widget holiday-widget">
                  <div class="widget-content">
                    <div class="holiday-display">
                      <div class="holiday-header">
                        <div class="holiday-info">
                          <div class="header-icon">
                            <el-icon><Calendar /></el-icon>
                          </div>
                          <div class="header-text">
                            <h4>法定节假日</h4>
                          </div>
                        </div>
                      </div>
                      <div class="holiday-content">
                        <div class="holiday-card">
                          <div class="holiday-name">
                            {{ holidayInfo.name }}
                            <span class="holiday-days">休7</span>
                          </div>
                          <div class="holiday-date">{{ holidayInfo.date }}</div>
                          <div class="holiday-countdown">
                            <div class="countdown-item">
                              <span class="countdown-number">{{ holidayInfo.days }}</span>
                              <span class="countdown-label">天</span>
                            </div>
                            <div class="countdown-item">
                              <span class="countdown-number">{{ holidayInfo.hours }}</span>
                              <span class="countdown-label">时</span>
                            </div>
                            <div class="countdown-item">
                              <span class="countdown-number">{{ holidayInfo.minutes }}</span>
                              <span class="countdown-label">分</span>
                            </div>
                            <div class="countdown-item">
                              <span class="countdown-number">{{ holidayInfo.seconds }}</span>
                              <span class="countdown-label">秒</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 古诗词卡片 -->
                <div class="info-widget poetry-widget" @click="getPoetry">
                  <div class="widget-content">
                    <div class="poetry-display">
                      <div class="poetry-header">
                        <div class="poetry-info">
                          <div class="header-icon">
                            <el-icon><Reading /></el-icon>
                          </div>
                          <div class="header-text">
                            <h4>古诗词</h4>
                          </div>
                        </div>
                      </div>
                      <div class="poetry-content">
                        <div class="poetry-card">
                          <div class="poetry-text">{{ poetry.content }}</div>
                          <div class="poetry-author">{{ poetry.author }} · {{ poetry.title }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 关于作者卡片 -->
                <div class="info-widget author-widget">
                  <div class="widget-content">
                    <div class="author-display">
                      <div class="author-header">
                        <div class="author-info">
                          <div class="header-icon">
                            <el-icon><User /></el-icon>
                          </div>
                          <div class="header-text">
                            <h4>关于作者</h4>
                          </div>
                        </div>
                      </div>
                      <div class="author-content">
                        <div class="author-card">
                          <div class="author-name">念舒</div>
                          <div class="author-details">
                            <div class="detail-item">
                              <span class="detail-label">年龄:</span>
                              <span class="detail-value">24岁</span>
                            </div>
                            <div class="detail-item">
                              <span class="detail-label">星座:</span>
                              <span class="detail-value">双鱼座</span>
                            </div>
                            <div class="detail-item">
                              <span class="detail-label">性格:</span>
                              <span class="detail-value">ENFJ-A</span>
                            </div>
                            <div class="detail-item">
                              <span class="detail-label">职业:</span>
                              <span class="detail-value">产品运营</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 第二行：数据概览 -->
              <div class="info-row info-row-2">
                <!-- 数据统计仪表板 -->
              <div class="info-widget stats-dashboard">
                <div class="widget-header">
                  <div class="header-icon">
                    <el-icon><DataAnalysis /></el-icon>
                  </div>
                  <div class="header-text">
                    <h4>数据概览</h4>
                    <p>网站统计</p>
                  </div>
                </div>
                <div class="widget-content">
                  <div class="stats-grid">
                    <div class="stat-card" @click="goToSoftwareList">
                      <div class="stat-icon">
                        <el-icon><Download /></el-icon>
                      </div>
                      <div class="stat-content">
                        <div class="stat-number">{{ totalSoftware }}</div>
                        <div class="stat-label">软件总数</div>
                        <div class="stat-trend">
                          <el-icon><TrendCharts /></el-icon>
                          <span>持续增长</span>
                        </div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-icon">
                        <el-icon><Monitor /></el-icon>
                      </div>
                      <div class="stat-content">
                        <div class="stat-number">{{ platformStats.windows }}</div>
                        <div class="stat-label">Windows</div>
                        <div class="stat-trend">
                          <el-icon><TrendCharts /></el-icon>
                          <span>桌面平台</span>
                        </div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-icon">
                        <el-icon><Apple /></el-icon>
                      </div>
                      <div class="stat-content">
                        <div class="stat-number">{{ platformStats.macos }}</div>
                        <div class="stat-label">macOS</div>
                        <div class="stat-trend">
                          <el-icon><TrendCharts /></el-icon>
                          <span>苹果系统</span>
                        </div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-icon">
                        <el-icon><Cpu /></el-icon>
                      </div>
                      <div class="stat-content">
                        <div class="stat-number">{{ platformStats.linux }}</div>
                        <div class="stat-label">Linux</div>
                        <div class="stat-trend">
                          <el-icon><TrendCharts /></el-icon>
                          <span>开源系统</span>
                        </div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-icon">
                        <el-icon><Connection /></el-icon>
                      </div>
                      <div class="stat-content">
                        <div class="stat-number">{{ platformStats.web }}</div>
                        <div class="stat-label">Web</div>
                        <div class="stat-trend">
                          <el-icon><TrendCharts /></el-icon>
                          <span>网页应用</span>
                        </div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-icon">
                        <el-icon><Iphone /></el-icon>
                      </div>
                      <div class="stat-content">
                        <div class="stat-number">{{ platformStats.mobile }}</div>
                        <div class="stat-label">Mobile</div>
                        <div class="stat-trend">
                          <el-icon><TrendCharts /></el-icon>
                          <span>移动平台</span>
                        </div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-icon">
                        <el-icon><Monitor /></el-icon>
                      </div>
                      <div class="stat-content">
                        <div class="stat-number">{{ platformStats.crossPlatform }}</div>
                        <div class="stat-label">跨平台</div>
                        <div class="stat-trend">
                          <el-icon><TrendCharts /></el-icon>
                          <span>多平台</span>
                        </div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-icon">
                        <el-icon><User /></el-icon>
                      </div>
                      <div class="stat-content">
                        <div class="stat-number">{{ visitorStats.totalVisitors }}</div>
                        <div class="stat-label">总访客数</div>
                        <div class="stat-trend">
                          <el-icon><TrendCharts /></el-icon>
                          <span>51统计</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSoftwareStore } from '@/stores/software'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { WEATHER_CONFIG, isApiKeyConfigured } from '@/config/weather'
import {
  Download,
  Star,
  Clock,
  Sunny,
  DataAnalysis,
  Collection,
  Check,
  TrendCharts,
  Lightning,
  Monitor,
  User,
  Reading,
  Calendar,
  Document,
  Link,
  Headset,
  Message,
  Apple,
  Platform,
  Iphone,
  Cpu,
  Connection
} from '@element-plus/icons-vue'

const router = useRouter()
const softwareStore = useSoftwareStore()

const loading = ref(false)

// 时间相关数据
const currentTime = ref('')
const currentDate = ref('')
const currentDateOnly = ref('')
const currentWeekday = ref('')

// 天气数据
const weather = ref({
  temperature: null,
  description: '未知',
  location: '未知',
  tomorrow: {
    temperature: null,
    description: '未知'
  }
})

// 计算属性
const totalSoftware = computed(() => softwareStore.softwareList.length)

// 51统计访客数据
const visitorStats = ref({
  totalVisitors: 0
})

// 软件平台统计数据
const platformStats = ref({
  windows: 0,
  macos: 0,
  linux: 0,
  web: 0,
  mobile: 0,
  crossPlatform: 0
})


// 古诗词数据
const poetry = ref({
  content: '加载中...',
  author: '',
  title: ''
})

// 节假日倒计时数据
const holidayInfo = ref({
  name: '加载中...',
  date: '计算中...',
  days: '00',
  hours: '00',
  minutes: '00',
  seconds: '00',
  holidayDays: '0'
})


// 更新时间
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  currentDate.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
  
  // 分别设置日期和星期
  currentDateOnly.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  currentWeekday.value = now.toLocaleDateString('zh-CN', {
    weekday: 'long'
  })
}

// 获取用户位置
const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('浏览器不支持地理位置'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        const accuracyLevel = getLocationAccuracy(accuracy)
        console.log('获取到位置:', { 
          latitude, 
          longitude, 
          accuracy: accuracy + '米', 
          accuracyLevel 
        })
        resolve({ latitude, longitude, accuracy })
      },
      (error) => {
        console.warn('获取位置失败:', error.message, '错误代码:', error.code)
        // 如果获取位置失败，返回null表示无法获取位置
        resolve(null)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // 增加超时时间到15秒
        maximumAge: 60000 // 减少缓存时间到1分钟，获取更准确的位置
      }
    )
  })
}

// 根据位置获取天气信息
const getWeatherByLocation = async () => {
  try {
    const location = await getUserLocation()
    console.log('用户位置:', location)
    
    // 如果无法获取位置，直接返回未知状态
    if (!location) {
      console.warn('无法获取用户位置')
      weather.value = {
        temperature: null,
        description: '未知',
        location: '未知',
        tomorrow: {
          temperature: null,
          description: '未知'
        }
      }
      return
    }
    
    const config = WEATHER_CONFIG.QWEATHER
    const { API_KEY, ENDPOINTS } = config
    
    // 检查API密钥是否配置
    if (!isApiKeyConfigured(API_KEY)) {
      console.warn('和风天气API密钥未配置，使用默认数据')
      weather.value = {
        temperature: null,
        description: '未知',
        location: '未知',
        tomorrow: {
          temperature: null,
          description: '未知'
        }
      }
      return
    }
    
    try {
      // 先获取城市信息
      const cityUrl = `${ENDPOINTS.CITY_LOOKUP}?location=${location.longitude},${location.latitude}&key=${API_KEY}`
      const cityResponse = await fetch(cityUrl)
      const cityData = await cityResponse.json()
      
      if (cityData.code === '200' && cityData.location && cityData.location.length > 0) {
        const cityId = cityData.location[0].id
        const cityName = cityData.location[0].name
        
        // 获取今天天气信息
        const weatherUrl = `${ENDPOINTS.WEATHER_NOW}?location=${cityId}&key=${API_KEY}`
        const weatherResponse = await fetch(weatherUrl)
        const weatherData = await weatherResponse.json()
        
        // 获取明天天气信息
        const forecastUrl = `${ENDPOINTS.WEATHER_3D}?location=${cityId}&key=${API_KEY}`
        const forecastResponse = await fetch(forecastUrl)
        const forecastData = await forecastResponse.json()
        
        if (weatherData.code === '200' && weatherData.now) {
          const now = weatherData.now
          let tomorrowWeather = { temperature: null, description: '未知' }
          
          // 获取明天天气
          if (forecastData.code === '200' && forecastData.daily && forecastData.daily.length > 1) {
            const tomorrow = forecastData.daily[1] // 第二天
            tomorrowWeather = {
              temperature: parseInt(tomorrow.tempMax),
              description: tomorrow.textDay
            }
          }
          
          weather.value = {
            temperature: parseInt(now.temp),
            description: now.text,
            location: cityName,
            tomorrow: tomorrowWeather
          }
          console.log('成功获取天气数据:', weather.value)
          return
        }
      }
    } catch (apiError) {
      console.warn('和风天气API调用失败，使用模拟数据:', apiError)
    }
    
    // 如果API调用失败，设置未知状态
    weather.value = { 
      temperature: null, 
      description: '未知',
      location: '未知',
      tomorrow: {
        temperature: null,
        description: '未知'
      }
    }
    
  } catch (error) {
    console.error('获取天气失败:', error)
    // 设置未知状态
    weather.value = { 
      temperature: null, 
      description: '未知',
      location: '未知',
      tomorrow: {
        temperature: null,
        description: '未知'
      }
    }
  }
}



// 获取位置精度等级
const getLocationAccuracy = (accuracy) => {
  if (accuracy <= 100) return '高精度'
  if (accuracy <= 500) return '中等精度'
  if (accuracy <= 1000) return '低精度'
  return '很低精度'
}

// 获取51统计访客数据
const getVisitorStats = async () => {
  try {
    // 等待51统计加载完成
    await new Promise((resolve) => {
      if (typeof window.LA !== 'undefined') {
        resolve()
      } else {
        // 等待最多5秒
        let attempts = 0
        const checkLA = setInterval(() => {
          attempts++
          if (typeof window.LA !== 'undefined' || attempts > 50) {
            clearInterval(checkLA)
            resolve()
          }
        }, 100)
      }
    })

    // 检查51统计是否可用
    if (typeof window.LA !== 'undefined' && window.LA.getData) {
      try {
        // 获取总访客数
        const totalData = window.LA.getData('total')
        if (totalData && totalData.pv) {
          visitorStats.value.totalVisitors = totalData.pv
          console.log('获取到51统计总访客数:', totalData.pv)
        }
      } catch (apiError) {
        console.warn('51统计API调用失败:', apiError)
      }
    } else {
      console.warn('51统计未加载或API不可用')
    }
  } catch (error) {
    console.warn('获取51统计数据失败:', error)
  }
}

// 获取软件平台统计数据
const getPlatformStats = async () => {
  try {
    // 这里可以调用后端API获取真实的平台统计数据
    // 目前使用模拟数据
    const softwareList = softwareStore.softwareList
    
    // 根据软件列表统计各平台数量
    platformStats.value = {
      windows: softwareList.filter(software => 
        software.platform && software.platform.toLowerCase().includes('windows')
      ).length,
      macos: softwareList.filter(software => 
        software.platform && software.platform.toLowerCase().includes('mac')
      ).length,
      linux: softwareList.filter(software => 
        software.platform && software.platform.toLowerCase().includes('linux')
      ).length,
      web: softwareList.filter(software => 
        software.platform && software.platform.toLowerCase().includes('web')
      ).length,
      mobile: softwareList.filter(software => 
        software.platform && (software.platform.toLowerCase().includes('mobile') || 
        software.platform.toLowerCase().includes('android') || 
        software.platform.toLowerCase().includes('ios'))
      ).length,
      crossPlatform: softwareList.filter(software => 
        software.platform && software.platform.toLowerCase().includes('cross')
      ).length
    }
    
    console.log('获取到软件平台统计:', platformStats.value)
  } catch (error) {
    console.warn('获取平台统计数据失败:', error)
    // 使用默认值
    platformStats.value = {
      windows: 0,
      macos: 0,
      linux: 0,
      web: 0,
      mobile: 0,
      crossPlatform: 0
    }
  }
}


// 获取节假日倒计时
const getHolidayCountdown = async () => {
  try {
    const response = await fetch('/api/holidays/next')
    const result = await response.json()
    
    if (result.success && result.data) {
      const holiday = result.data
      const now = new Date()
      const holidayDate = new Date(holiday.date)
      const timeDiff = holidayDate.getTime() - now.getTime()
      
      const days = Math.floor(timeDiff / (1000 * 3600 * 24))
      const hours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600))
      const minutes = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60))
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
      
      // 格式化日期显示
      const dateStr = `${holidayDate.getFullYear()}年${(holidayDate.getMonth() + 1).toString().padStart(2, '0')}月${holidayDate.getDate().toString().padStart(2, '0')}日`
      
      holidayInfo.value = {
        name: holiday.name,
        date: dateStr,
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
        holidayDays: holiday.type === 'national' ? '法定节假日' : 
                    holiday.type === 'traditional' ? '传统节日' : '国际节日'
      }
    } else {
      holidayInfo.value = {
        name: '暂无节假日',
        date: '--',
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
        holidayDays: '0'
      }
    }
    
    console.log('节假日倒计时:', holidayInfo.value)
  } catch (error) {
    console.warn('获取节假日倒计时失败:', error)
    holidayInfo.value = {
      name: '获取失败',
      date: '--',
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
      holidayDays: '0'
    }
  }
}

// 实时更新节假日倒计时
const updateHolidayCountdown = () => {
  getHolidayCountdown()
}

// 获取古诗词
const getPoetry = async () => {
  try {
    const response = await fetch('/api/poetry/random')
    const result = await response.json()
    
    if (result.success && result.data) {
      const poetryData = result.data
      poetry.value = {
        content: poetryData.content,
        author: poetryData.author,
        title: poetryData.title
      }
    } else {
      poetry.value = {
        content: '暂无古诗词数据',
        author: '',
        title: ''
      }
    }
    
    console.log('获取古诗词:', poetry.value)
  } catch (error) {
    console.warn('获取古诗词失败:', error)
    poetry.value = {
      content: '诗词加载失败',
      author: '',
      title: ''
    }
  }
}

const loadData = async () => {
  loading.value = true
  try {
    await softwareStore.fetchSoftwareList()
    await softwareStore.fetchCategories()
    await getWeatherByLocation()
    await getVisitorStats()
    await getPlatformStats()
    await getPoetry()
    await getHolidayCountdown()
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

const goToSoftwareList = () => {
  router.push('/software')
}

const goToFeatured = () => {
  router.push('/featured')
}

// 打开外部链接
const openLink = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

const refreshTime = () => {
  updateTime()
}

const refreshWeather = () => {
  getWeatherByLocation()
}

onMounted(() => {
  loadData()
  updateTime()
  getWeatherByLocation() // 使用基于位置的天气获取
  
  // 每秒更新时间
  setInterval(updateTime, 1000)
  
  // 每秒更新节假日倒计时
  setInterval(updateHolidayCountdown, 1000)
  
  // 添加键盘事件监听器
  document.addEventListener('keydown', handleKeyDown)
})

// 键盘事件处理
const handleKeyDown = (event) => {
  // 检查是否按下了 Ctrl+Z
  if (event.ctrlKey && event.key === 'z') {
    event.preventDefault() // 阻止默认行为
    openAdminPanel()
  }
}

// 打开管理后台
const openAdminPanel = () => {
  window.open('/admin', '_blank', 'noopener,noreferrer')
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  max-width: 1700px;
  min-height: 100vh;
  max-height: 900px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.main-content {
  padding-top: 70px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.hero-section {
  padding: 40px 0 20px;
  position: relative;
  overflow: hidden;
  flex: 1;
  display: flex;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 20%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, rgba(118, 75, 162, 0.15) 0%, transparent 50%);
    pointer-events: none;
  }
}

// 背景装饰
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.floating-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  animation: float 20s infinite ease-in-out;
  
  &.shape-1 {
    width: 80px;
    height: 80px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }
  
  &.shape-2 {
    width: 120px;
    height: 120px;
    top: 60%;
    right: 15%;
    animation-delay: 5s;
  }
  
  &.shape-3 {
    width: 60px;
    height: 60px;
    top: 40%;
    left: 80%;
    animation-delay: 10s;
  }
  
  &.shape-4 {
    width: 100px;
    height: 100px;
    bottom: 20%;
    left: 20%;
    animation-delay: 15s;
  }
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  25% { 
    transform: translateY(-20px) rotate(90deg);
    opacity: 0.6;
  }
  50% { 
    transform: translateY(-10px) rotate(180deg);
    opacity: 0.4;
  }
  75% { 
    transform: translateY(-30px) rotate(270deg);
    opacity: 0.7;
  }
}

.hero-layout {
  display: flex;
  align-items: center;
  gap: 40px;
  position: relative;
  z-index: 1;
  flex: 1;
  max-height: 800px;
}

.hero-main {
  flex: 1;
  max-width: 600px;
}

.hero-content {
  animation: slideInLeft 1s ease-out;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
  animation: fadeInUp 0.8s ease-out 0.2s both;
  
  .el-icon {
    font-size: 16px;
  }
}

.hero-title {
  font-size: 2.8rem;
  font-weight: 900;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  animation: fadeInUp 0.8s ease-out 0.4s both;
  
  .title-line-1 {
    display: block;
  }
  
  .title-line-2 {
    display: block;
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.hero-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  margin-bottom: 24px;
  line-height: 1.5;
  font-weight: 500;
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 24px;
  animation: fadeInUp 0.8s ease-out 0.8s both;
}

.hero-btn-primary {
  position: relative;
  overflow: hidden;
  
  .btn-ripple {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  &:hover .btn-ripple {
    width: 300px;
    height: 300px;
  }
}

.hero-links {
  display: flex;
  flex-direction: row;
  gap: 12px;
  animation: fadeInUp 0.8s ease-out 1s both;
  justify-content: flex-start;
  align-items: center;
}

.link-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(102, 126, 234, 0.2);
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-2px) scale(1.1);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.25);
    border-color: rgba(102, 126, 234, 0.4);
  }
  
  .el-icon {
    color: #667eea;
    font-size: 28px;
    transition: all 0.3s ease;
  }
  
  .platform-icon {
    width: 32px;
    height: 32px;
    transition: all 0.3s ease;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1)) contrast(1.1) brightness(1.05);
    border-radius: 6px;
    object-fit: contain;
    padding: 2px;
    background: rgba(255, 255, 255, 0.1);
  }
  
  &:hover .el-icon {
    color: #5a67d8;
    transform: scale(1.1);
  }
  
  &:hover .platform-icon {
    transform: scale(1.15);
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15)) contrast(1.2) brightness(1.1);
    background: rgba(255, 255, 255, 0.2);
  }
}

.hero-btn-secondary {
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

// 右侧信息面板
.hero-info-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 800px;
  max-width: 900px;
  flex-wrap: wrap;
  align-items: flex-start;
}

// 信息行布局
.info-row {
  display: flex;
  flex-direction: row;
  gap: 16px;
  width: 100%;
  
  &.info-row-1 {
    // 第一行：5个小卡片
    .info-widget {
      flex: 1;
      min-width: 160px;
      max-width: 180px;
    }
  }
  
  &.info-row-2 {
    // 第二行：数据概览卡片
    .info-widget {
      width: 100%;
      height: auto;
      min-height: 200px;
    }
  }
}

.info-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  animation: slideInRight 1s ease-out;

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
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
    border-color: rgba(102, 126, 234, 0.3);
  }
  
  &:active {
    transform: translateY(-2px) scale(0.98);
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
  position: relative;

  .el-icon {
    color: #667eea;
    font-size: 16px;
  }
  
  .card-indicator {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    background: #10b981;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover .card-indicator {
    opacity: 1;
  }
}

// 时间卡片
.time-display {
  text-align: center;

  .date {
    font-size: 0.8rem;
    color: #64748b;
    margin-bottom: 4px;
    font-weight: 500;
  }
  
  .weekday {
    font-size: 0.75rem;
    color: #8b5cf6;
    font-weight: 600;
    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-align: center;
    padding: 2px 8px;
    border-radius: 12px;
    background-color: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.2);
    display: inline-block;
    margin: 0 auto;
  }

  .time {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-family: 'Courier New', monospace;
  }
}

// 天气卡片
.weather-display {
  display: flex;
  align-items: center;
  gap: 12px;

  .weather-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    .el-icon {
      color: white;
      font-size: 20px;
    }
  }

  .weather-info {
    flex: 1;

    .temperature {
      font-size: 1.3rem;
      font-weight: 700;
      color: #2c3e50;
      line-height: 1.2;
    }

    .weather-desc {
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 500;
    }
  }
}

// 统计卡片
.stats-display {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 10px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    transform: translateX(4px) scale(1.02);
  }
  
  &:active {
    transform: translateX(2px) scale(0.98);
  }

  .stat-icon {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    .el-icon {
      color: white;
      font-size: 16px;
    }
  }

  .stat-info {
    flex: 1;

    .stat-number {
      font-size: 1.1rem;
      font-weight: 700;
      color: #2c3e50;
      line-height: 1.2;
    }

    .stat-label {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
    }
  }
}

// 新的信息组件样式
.info-widget {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 16px;
  overflow: visible;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  animation: slideInRight 1s ease-out;
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 16px 48px rgba(102, 126, 234, 0.15);
    border-color: rgba(102, 126, 234, 0.3);

    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(-4px) scale(1.01);
  }
}

.widget-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px 12px;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);

  .header-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    .el-icon {
      color: white;
      font-size: 20px;
    }
  }

  .header-text {
    flex: 1;

    h4 {
      font-size: 1rem;
      font-weight: 700;
      color: #2c3e50;
      margin: 0 0 2px 0;
      line-height: 1.2;
    }

    p {
      font-size: 0.8rem;
      color: #64748b;
      margin: 0;
      font-weight: 500;
    }
  }
}

.widget-content {
  padding: 16px 20px 20px;
}

// 时间卡片
.time-widget {
  .widget-content {
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .time-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 20px 16px;
    background: rgba(59, 130, 246, 0.05);
    border-radius: 12px;
    height: 100%;
    text-align: center;
    box-sizing: border-box;
    flex: 1;

    .time-header {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 0 0 auto;
      margin-bottom: 8px;

      .time-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .header-icon {
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        .el-icon {
          color: white;
          font-size: 16px;
        }
      }

      .header-text {
        h4 {
          font-size: 0.9rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
          line-height: 1.2;
        }
      }
    }

    .time-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;

      .time-data {
        .time {
          font-size: 2rem;
          font-weight: 900;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: 16px;
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          letter-spacing: -0.03em;
          text-shadow: 0 3px 6px rgba(30, 64, 175, 0.15);
          filter: drop-shadow(0 2px 4px rgba(30, 64, 175, 0.1));
        }

        .date {
          font-size: 0.95rem;
          color: #64748b;
          font-weight: 600;
          line-height: 1.2;
          font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          letter-spacing: 0.01em;
          opacity: 0.9;
        }
      }
    }
  }
}

// 天气卡片
.weather-widget {
  .widget-content {
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .weather-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 18px 16px;
    background: rgba(249, 115, 22, 0.05);
    border-radius: 12px;
    height: 100%;
    text-align: center;
    box-sizing: border-box;
    flex: 1;
    gap: 12px;

    .weather-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      flex: 0 0 auto;
      margin-bottom: 8px;

      .weather-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .header-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;

          .el-icon {
            color: white;
            font-size: 16px;
          }
        }

        .header-text {
          h4 {
            font-size: 0.9rem;
            font-weight: 700;
            color: #2c3e50;
            margin: 0;
            line-height: 1.2;
          }
        }
      }

      .weather-location {
        font-size: 0.8rem;
        color: #64748b;
        font-weight: 500;
        text-align: center;
        padding: 4px 8px;
        background: rgba(249, 115, 22, 0.1);
        border-radius: 12px;
        border: 1px solid rgba(249, 115, 22, 0.2);
      }
    }

    .weather-content {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      gap: 12px;
      width: 100%;
      min-height: 0;

      .weather-today,
      .weather-tomorrow {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 10px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.8);
        min-height: 0;

        .weather-label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          margin-bottom: 6px;

          .label-text {
            font-size: 0.7rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .label-dot {
            width: 4px;
            height: 4px;
            border-radius: 50%;
            display: inline-block;
          }
        }

        .weather-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          min-height: 0;
          overflow: hidden;

          .temperature {
            font-size: 1.2rem;
            font-weight: 700;
            line-height: 1.1;
            margin-bottom: 3px;
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
          }

          .weather-desc {
            font-size: 0.7rem;
            font-weight: 500;
            line-height: 1.1;
            opacity: 0.8;
          }
        }
      }

      .weather-today {
        .weather-label .label-text {
          color: #059669;
        }
        .weather-label .label-dot {
          background: #10b981;
        }
        .weather-details .temperature {
          color: #059669;
        }
        .weather-details .weather-desc {
          color: #047857;
        }
      }

      .weather-tomorrow {
        .weather-label .label-text {
          color: #2563eb;
        }
        .weather-label .label-dot {
          background: #3b82f6;
        }
        .weather-details .temperature {
          color: #2563eb;
        }
        .weather-details .weather-desc {
          color: #1d4ed8;
        }
      }
    }
  }
}


// 关于作者卡片
.author-widget {
  .widget-content {
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .author-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 20px 16px;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%);
    border-radius: 12px;
    height: 100%;
    text-align: center;
    box-sizing: border-box;
    flex: 1;
    border: 1px solid rgba(99, 102, 241, 0.1);

    .author-header {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 0 0 auto;
      margin-bottom: 8px;

      .author-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .header-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);

          .el-icon {
            color: white;
            font-size: 16px;
          }
        }

        .header-text {
          h4 {
            font-size: 0.9rem;
            font-weight: 700;
            color: #2c3e50;
            margin: 0;
            line-height: 1.2;
          }
        }
      }
    }

    .author-content {
      text-align: center;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .author-card {
        .author-name {
          font-size: 1.3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
          margin-bottom: 10px;
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          letter-spacing: -0.02em;
          text-shadow: 0 2px 4px rgba(99, 102, 241, 0.1);
          position: relative;
          
          &::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 50%;
            transform: translateX(-50%);
            width: 30px;
            height: 2px;
            background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
            border-radius: 1px;
          }
        }

        .author-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
          width: 100%;
          
          .detail-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.8rem;
            line-height: 1.3;
            padding: 3px 0;
            border-radius: 4px;
            transition: all 0.2s ease;
            
            &:hover {
              background: rgba(99, 102, 241, 0.05);
              padding: 3px 6px;
            }
            
            .detail-label {
              color: #6b7280;
              font-weight: 600;
              flex: 0 0 auto;
              font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              letter-spacing: 0.01em;
              opacity: 0.9;
              font-size: 0.75rem;
            }
            
            .detail-value {
              color: #374151;
              font-weight: 700;
              flex: 1;
              text-align: right;
              margin-left: 8px;
              font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              letter-spacing: 0.01em;
              background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              font-size: 0.8rem;
            }
          }
        }
      }
    }
  }
}

// 古诗词卡片
.poetry-widget {
  .widget-content {
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .poetry-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 20px 16px;
    background: rgba(168, 85, 247, 0.05);
    border-radius: 12px;
    height: 100%;
    text-align: center;
    box-sizing: border-box;
    flex: 1;

    .poetry-header {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 0 0 auto;
      margin-bottom: 8px;

      .poetry-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .header-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;

          .el-icon {
            color: white;
            font-size: 16px;
          }
        }

        .header-text {
          h4 {
            font-size: 0.9rem;
            font-weight: 700;
            color: #2c3e50;
            margin: 0;
            line-height: 1.2;
          }
        }
      }
    }

    .poetry-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;

      .poetry-text {
        font-size: 1rem;
        font-weight: 500;
        color: #2c3e50;
        line-height: 1.4;
        margin-bottom: 12px;
        font-family: 'KaiTi', '楷体', serif;
        text-align: center;
      }

      .poetry-author {
        font-size: 0.8rem;
        color: #64748b;
        font-weight: 500;
        line-height: 1.2;
        text-align: center;
      }
    }
  }
}

// 节假日倒计时卡片
.holiday-widget {
  .widget-content {
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .holiday-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 20px 16px;
    background: rgba(236, 72, 153, 0.05);
    border-radius: 12px;
    height: 100%;
    text-align: center;
    box-sizing: border-box;
    flex: 1;
    overflow: visible;

    .holiday-header {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 0 0 auto;
      margin-bottom: 8px;

      .holiday-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .header-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;

          .el-icon {
            color: white;
            font-size: 16px;
          }
        }

        .header-text {
          h4 {
            font-size: 0.9rem;
            font-weight: 700;
            color: #2c3e50;
            margin: 0;
            line-height: 1.2;
          }
        }
      }
    }

    .holiday-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;

      .holiday-name {
        font-size: 1rem;
        font-weight: 600;
        color: #2c3e50;
        line-height: 1.2;
        margin-bottom: 8px;
        position: relative;
        
        .holiday-days {
          position: absolute;
          top: -2px;
          right: -18px;
          font-size: 0.6rem;
          color: #ec4899;
          font-weight: 600;
          background: rgba(236, 72, 153, 0.1);
          padding: 2px 6px;
          border-radius: 8px;
          line-height: 1;
        }
      }

      .holiday-date {
        font-size: 0.85rem;
        color: #64748b;
        font-weight: 600;
        line-height: 1.2;
        margin-bottom: 12px;
        font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        letter-spacing: 0.01em;
        opacity: 0.9;
      }

      .holiday-countdown {
        display: flex;
        gap: 6px;
        justify-content: center;
        align-items: center;
        
        .countdown-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 20px;
          
          .countdown-number {
            font-size: 1rem;
            font-weight: 800;
            background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1;
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
            letter-spacing: -0.02em;
            text-shadow: 0 1px 2px rgba(236, 72, 153, 0.1);
          }
          
          .countdown-label {
            font-size: 0.7rem;
            color: #64748b;
            font-weight: 600;
            line-height: 1;
            margin-top: 2px;
            font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
            letter-spacing: 0.01em;
            opacity: 0.8;
          }
        }
      }
    }
  }
}

// 数据统计仪表板
.stats-dashboard {
  width: 100%;
  min-width: 500px;
  height: auto;
  min-height: 200px;
  
  .widget-content {
    padding: 16px 20px 20px;
    height: auto;
    min-height: 150px;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(102, 126, 234, 0.05);
    border-radius: 12px;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background: rgba(102, 126, 234, 0.1);
      transform: translateX(4px) scale(1.02);
    }
    
    &:active {
      transform: translateX(2px) scale(0.98);
    }

    .stat-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      .el-icon {
        color: white;
        font-size: 18px;
      }
    }

    .stat-content {
      flex: 1;

      .stat-number {
        font-size: 1.3rem;
        font-weight: 700;
        color: #2c3e50;
        line-height: 1.2;
      }

      .stat-label {
        font-size: 0.8rem;
        color: #64748b;
        font-weight: 500;
        margin-bottom: 2px;
      }

      .stat-trend {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.7rem;
        color: #10b981;
        font-weight: 500;

        .el-icon {
          font-size: 12px;
        }
      }
    }
  }
}


@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .home {
    max-height: 800px;
  }
  
  .hero-layout {
    flex-direction: column;
    gap: 30px;
    flex: 1;
    max-height: 700px;
  }
  
  .hero-info-panel {
    min-width: auto;
    max-width: none;
    flex-direction: column;
    gap: 12px;
  }
  
  .info-row {
    flex-direction: row;
    gap: 12px;
    flex-wrap: wrap;
    
    &.info-row-1 {
      .info-widget {
        flex: 1;
        min-width: 140px;
        max-width: 160px;
      }
    }
  }
  
  .info-widget {
    width: 180px;
    height: 180px;
  }
  
  .stats-dashboard {
    flex: 1;
    min-width: 400px;
    max-width: 500px;
    height: auto;
    min-height: 180px;
    
    .stats-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
  }
  
  .hero-links {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: flex-start;
  }
  
  .link-item {
    width: 36px;
    height: 36px;
    
    .el-icon {
      font-size: 22px;
    }
    
    .platform-icon {
      width: 24px;
      height: 24px;
    }
  }
}


@media (max-width: 768px) {
  .home {
    max-height: 700px;
  }
  
  .main-content {
    padding-top: 60px;
    height: calc(100% - 60px);
  }

  .hero-section {
    padding: 20px 0 15px;
    height: 100%;
  }

  .hero-layout {
    flex-direction: column;
    gap: 20px;
    text-align: center;
    flex: 1;
    max-height: 600px;
  }

  .hero-title {
    font-size: 2.2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-info-panel {
    flex-direction: column;
    gap: 16px;
    min-width: auto;
    max-width: none;
  }
  
  .info-row {
    flex-direction: column;
    gap: 12px;
    
    &.info-row-1 {
      .info-widget {
        width: 100%;
        min-width: auto;
        max-width: none;
      }
    }
  }

  .info-widget {
    width: 150px;
    height: 150px;
  }
  
  .stats-dashboard {
    flex: none;
    min-width: auto;
    max-width: none;
    height: auto;
    min-height: 160px;
    
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
  }
  
  .hero-links {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: flex-start;
  }
  
  .link-item {
    width: 32px;
    height: 32px;
    
    .el-icon {
      font-size: 20px;
    }
    
    .platform-icon {
      width: 22px;
      height: 22px;
    }
  }
}

@media (max-width: 480px) {
  .home {
    max-height: 600px;
  }
  
  .hero-section {
    padding: 15px 0 10px;
  }
  
  .hero-title {
    font-size: 1.8rem;
  }
  
  .hero-subtitle {
    font-size: 0.9rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  
  .hero-btn-primary,
  .hero-btn-secondary {
    width: 100%;
    padding: 10px 16px;
    font-size: 0.9rem;
  }
  
  .info-widget {
    .widget-header {
      padding: 12px 16px 8px;
      
      .header-icon {
        width: 32px;
        height: 32px;
        
        .el-icon {
          font-size: 16px;
        }
      }
      
      .header-text h4 {
        font-size: 0.9rem;
      }
    }
    
    .widget-content {
      padding: 12px 16px 16px;
    }
  }
  
  .time-weather-widget {
    .time-display .time {
      font-size: 1.5rem;
    }
    
    .weather-display .weather-icon {
      width: 36px;
      height: 36px;
    }
  }
  
  .stats-dashboard .stat-card .stat-icon {
    width: 32px;
    height: 32px;
  }
}
</style>
