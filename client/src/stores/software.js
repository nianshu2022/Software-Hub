import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/api'

export const useSoftwareStore = defineStore('software', () => {
  // 状态
  const softwareList = ref([])
  const currentSoftware = ref(null)
  const categories = ref([])
  const loading = ref(false)
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  })
  const filters = ref({
    category: '',
    platform: '',
    search: '',
    featured: false
  })

  // 计算属性
  const featuredSoftware = computed(() => 
    softwareList.value.filter(software => software.is_featured)
  )

  const platformOptions = computed(() => [
    { label: 'Windows', value: 'Windows' },
    { label: 'macOS', value: 'macOS' },
    { label: 'Linux', value: 'Linux' },
    { label: 'Web', value: 'Web' },
    { label: 'Mobile', value: 'Mobile' },
    { label: 'Cross-platform', value: 'Cross-platform' }
  ])

  // 方法
  const fetchSoftwareList = async (params = {}) => {
    loading.value = true
    try {
      const queryParams = {
        page: pagination.value.currentPage,
        limit: pagination.value.itemsPerPage,
        ...filters.value,
        ...params
      }

      // 移除空值参数
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
          delete queryParams[key]
        }
      })

      const response = await api.get('/software', { params: queryParams })
      softwareList.value = response.data.data
      pagination.value = response.data.pagination
    } catch (error) {
      console.error('获取软件列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchSoftwareDetail = async (id) => {
    loading.value = true
    try {
      const response = await api.get(`/software/${id}`)
      currentSoftware.value = response.data.data
      return response.data.data
    } catch (error) {
      console.error('获取软件详情失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories')
      categories.value = response.data.data
    } catch (error) {
      console.error('获取分类列表失败:', error)
      throw error
    }
  }

  const createSoftware = async (softwareData) => {
    try {
      const response = await api.post('/software', softwareData)
      await fetchSoftwareList() // 刷新列表
      return response.data
    } catch (error) {
      console.error('创建软件失败:', error)
      throw error
    }
  }

  const updateSoftware = async (id, softwareData) => {
    try {
      const response = await api.put(`/software/${id}`, softwareData)
      await fetchSoftwareList() // 刷新列表
      return response.data
    } catch (error) {
      console.error('更新软件失败:', error)
      throw error
    }
  }

  const deleteSoftware = async (id) => {
    try {
      const response = await api.delete(`/software/${id}`)
      await fetchSoftwareList() // 刷新列表
      return response.data
    } catch (error) {
      console.error('删除软件失败:', error)
      throw error
    }
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.currentPage = 1 // 重置到第一页
  }

  const setPage = (page) => {
    pagination.value.currentPage = page
  }

  const resetFilters = () => {
    filters.value = {
      category: '',
      platform: '',
      search: '',
      featured: false
    }
    pagination.value.currentPage = 1
  }

  return {
    // 状态
    softwareList,
    currentSoftware,
    categories,
    loading,
    pagination,
    filters,
    
    // 计算属性
    featuredSoftware,
    platformOptions,
    
    // 方法
    fetchSoftwareList,
    fetchSoftwareDetail,
    fetchCategories,
    createSoftware,
    updateSoftware,
    deleteSoftware,
    setFilters,
    setPage,
    resetFilters
  }
})
