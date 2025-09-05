<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑软件' : '添加软件'"
    width="800px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="left"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="软件名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入软件名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="版本号" prop="version">
            <el-input v-model="form.version" placeholder="请输入版本号" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-form-item label="软件描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请输入软件描述"
        />
      </el-form-item>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="开发者" prop="developer">
            <el-input v-model="form.developer" placeholder="请输入开发者" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="支持平台" prop="platform">
            <el-select v-model="form.platform" placeholder="请选择平台">
              <el-option
                v-for="platform in platformOptions"
                :key="platform.value"
                :label="platform.label"
                :value="platform.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="分类" prop="category_id">
            <el-select v-model="form.category_id" placeholder="请选择分类">
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文件大小" prop="file_size">
            <el-input v-model="form.file_size" placeholder="如: 50MB" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-form-item label="下载链接" prop="download_url">
        <el-input v-model="form.download_url" placeholder="请输入下载链接" />
      </el-form-item>
      
      <el-form-item label="官方网站" prop="official_url">
        <el-input v-model="form.official_url" placeholder="请输入官方网站链接" />
      </el-form-item>
      
      <el-form-item label="软件图标" prop="icon_url">
        <el-input v-model="form.icon_url" placeholder="请输入图标链接" />
      </el-form-item>
      
      <el-form-item label="许可证类型" prop="license_type">
        <el-input v-model="form.license_type" placeholder="如: 免费、付费、开源" />
      </el-form-item>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="发布日期" prop="release_date">
            <el-date-picker
              v-model="form.release_date"
              type="date"
              placeholder="选择发布日期"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最后更新" prop="last_updated">
            <el-date-picker
              v-model="form.last_updated"
              type="date"
              placeholder="选择最后更新日期"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-form-item label="软件标签">
        <el-input
          v-model="tagInput"
          placeholder="输入标签后按回车添加"
          @keyup.enter="addTag"
        />
        <div class="tags-display" v-if="form.tags && form.tags.length > 0">
          <el-tag
            v-for="(tag, index) in form.tags"
            :key="index"
            closable
            @close="removeTag(index)"
            style="margin: 4px 4px 0 0"
          >
            {{ tag }}
          </el-tag>
        </div>
      </el-form-item>
      
      <el-form-item label="截图链接">
        <el-input
          v-model="screenshotInput"
          placeholder="输入截图链接后按回车添加"
          @keyup.enter="addScreenshot"
        />
        <div class="screenshots-display" v-if="form.screenshot_urls && form.screenshot_urls.length > 0">
          <div
            v-for="(url, index) in form.screenshot_urls"
            :key="index"
            class="screenshot-item"
          >
            <img :src="url" alt="截图" @error="handleImageError" />
            <el-button
              type="danger"
              size="small"
              circle
              @click="removeScreenshot(index)"
            >
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
        </div>
      </el-form-item>
      
      <el-form-item>
        <el-checkbox v-model="form.is_featured">设为推荐软件</el-checkbox>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          {{ loading ? '保存中...' : '保存' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useSoftwareStore } from '@/stores/software'
import { ElMessage } from 'element-plus'
import { Close } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  software: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const softwareStore = useSoftwareStore()

const formRef = ref()
const loading = ref(false)
const tagInput = ref('')
const screenshotInput = ref('')

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isEdit = computed(() => !!props.software)
const categories = computed(() => softwareStore.categories)
const platformOptions = computed(() => softwareStore.platformOptions)

// 表单数据
const form = reactive({
  name: '',
  description: '',
  version: '',
  download_url: '',
  official_url: '',
  category_id: '',
  icon_url: '',
  screenshot_urls: [],
  tags: [],
  file_size: '',
  platform: 'Windows',
  license_type: '',
  developer: '',
  release_date: '',
  last_updated: '',
  is_featured: false
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入软件名称', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入软件描述', trigger: 'blur' }
  ],
  download_url: [
    { required: true, message: '请输入下载链接', trigger: 'blur' },
    { type: 'url', message: '请输入有效的URL', trigger: 'blur' }
  ],
  official_url: [
    { type: 'url', message: '请输入有效的URL', trigger: 'blur' }
  ],
  icon_url: [
    { type: 'url', message: '请输入有效的URL', trigger: 'blur' }
  ]
}

// 方法
const resetForm = () => {
  Object.keys(form).forEach(key => {
    if (key === 'screenshot_urls' || key === 'tags') {
      form[key] = []
    } else if (key === 'platform') {
      form[key] = 'Windows'
    } else if (key === 'is_featured') {
      form[key] = false
    } else {
      form[key] = ''
    }
  })
}

// 监听软件数据变化
watch(() => props.software, (newSoftware) => {
  if (newSoftware) {
    Object.keys(form).forEach(key => {
      if (key === 'screenshot_urls' || key === 'tags') {
        form[key] = newSoftware[key] ? JSON.parse(newSoftware[key]) : []
      } else {
        form[key] = newSoftware[key] || ''
      }
    })
  } else {
    resetForm()
  }
}, { immediate: true })

const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !form.tags.includes(tag)) {
    form.tags.push(tag)
    tagInput.value = ''
  }
}

const removeTag = (index) => {
  form.tags.splice(index, 1)
}

const addScreenshot = () => {
  const url = screenshotInput.value.trim()
  if (url && !form.screenshot_urls.includes(url)) {
    form.screenshot_urls.push(url)
    screenshotInput.value = ''
  }
}

const removeScreenshot = (index) => {
  form.screenshot_urls.splice(index, 1)
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    const submitData = { 
      ...form,
      category_id: form.category_id ? parseInt(form.category_id) : null,
      release_date: form.release_date ? new Date(form.release_date).toISOString().split('T')[0] : null,
      last_updated: form.last_updated ? new Date(form.last_updated).toISOString().split('T')[0] : null,
      // 处理空字符串，转换为 null
      official_url: form.official_url && form.official_url.trim() ? form.official_url : null,
      icon_url: form.icon_url && form.icon_url.trim() ? form.icon_url : null,
      version: form.version && form.version.trim() ? form.version : null,
      developer: form.developer && form.developer.trim() ? form.developer : null,
      file_size: form.file_size && form.file_size.trim() ? form.file_size : null,
      license_type: form.license_type && form.license_type.trim() ? form.license_type : null
    }
    
    if (isEdit.value) {
      await softwareStore.updateSoftware(props.software.id, submitData)
      ElMessage.success('软件更新成功')
    } else {
      await softwareStore.createSoftware(submitData)
      ElMessage.success('软件添加成功')
    }
    
    emit('success')
    handleClose()
    
  } catch (error) {
    console.error('保存软件失败:', error)
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  visible.value = false
  resetForm()
  tagInput.value = ''
  screenshotInput.value = ''
}
</script>

<style lang="scss" scoped>
.tags-display {
  margin-top: 8px;
}

.screenshots-display {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.screenshot-item {
  position: relative;
  width: 120px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .el-button {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 20px;
    height: 20px;
    min-height: 20px;
    padding: 0;
  }
}

.dialog-footer {
  text-align: right;
}
</style>
