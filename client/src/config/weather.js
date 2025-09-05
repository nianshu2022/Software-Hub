// 天气API配置
export const WEATHER_CONFIG = {
  // 和风天气API配置
  QWEATHER: {
    // 开发版API Key (免费，有调用限制)
    // 申请地址: https://dev.qweather.com/
    API_KEY: 'e09ded2164594fd0bbbad1ea489db4a5',
    
    // API端点
    ENDPOINTS: {
      // 城市查询
      CITY_LOOKUP: 'https://geoapi.qweather.com/v2/city/lookup',
      // 实时天气
      WEATHER_NOW: 'https://devapi.qweather.com/v7/weather/now',
      // 3天预报
      WEATHER_3D: 'https://devapi.qweather.com/v7/weather/3d',
      // 7天预报
      WEATHER_7D: 'https://devapi.qweather.com/v7/weather/7d'
    }
  },
  
  // 备用API配置 (心知天气)
  SENIVERSE: {
    // 心知天气API Key
    // 申请地址: https://www.seniverse.com/
    API_KEY: 'your_seniverse_api_key',
    
    ENDPOINTS: {
      // 实时天气
      WEATHER_NOW: 'https://api.seniverse.com/v3/weather/now.json',
      // 3天预报
      WEATHER_3D: 'https://api.seniverse.com/v3/weather/daily.json'
    }
  },
  
  // 默认配置
  DEFAULT: {
    // 默认城市（当无法获取位置时）
    DEFAULT_CITY: {
      name: '北京',
      latitude: 39.9042,
      longitude: 116.4074
    },
    
    // 缓存时间（毫秒）
    CACHE_TIME: 5 * 60 * 1000, // 5分钟
    
    // 请求超时时间（毫秒）
    TIMEOUT: 10000 // 10秒
  }
}

// 获取天气API配置
export const getWeatherConfig = () => {
  return WEATHER_CONFIG
}

// 检查API密钥是否配置
export const isApiKeyConfigured = (apiKey) => {
  return apiKey && apiKey !== 'your_qweather_api_key' && apiKey !== 'your_seniverse_api_key'
}
