<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑分类' : '添加分类'"
    width="500px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      label-position="left"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入分类名称" />
      </el-form-item>
      
      <el-form-item label="分类描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="请输入分类描述"
        />
      </el-form-item>
      
      <el-form-item label="图标名称" prop="icon">
        <el-select v-model="form.icon" placeholder="请选择图标">
          <el-option
            v-for="icon in iconOptions"
            :key="icon.value"
            :label="icon.label"
            :value="icon.value"
          >
            <div style="display: flex; align-items: center; gap: 8px;">
              <el-icon><component :is="icon.component" /></el-icon>
              <span>{{ icon.label }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="排序" prop="sort_order">
        <el-input-number
          v-model="form.sort_order"
          :min="0"
          :max="999"
          placeholder="排序值"
          style="width: 100%"
        />
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
import { ElMessage } from 'element-plus'
import { 
  Cpu, 
  OfficeBuilding, 
  Brush, 
  Setting, 
  Connection, 
  VideoPlay, 
  Trophy, 
  WarningFilled,
  More,
  Folder
} from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  category: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const formRef = ref()
const loading = ref(false)

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isEdit = computed(() => !!props.category)

// 图标选项
const iconOptions = [
  { value: 'code', label: '开发工具', component: Cpu },
  { value: 'office', label: '办公软件', component: OfficeBuilding },
  { value: 'design', label: '设计软件', component: Brush },
  { value: 'system', label: '系统工具', component: Setting },
  { value: 'network', label: '网络工具', component: Connection },
  { value: 'media', label: '多媒体', component: VideoPlay },
  { value: 'game', label: '游戏娱乐', component: Trophy },
  { value: 'security', label: '安全软件', component: WarningFilled },
  { value: 'other', label: '其他', component: More },
  { value: 'folder', label: '文件夹', component: Folder }
]

// 表单数据
const form = reactive({
  name: '',
  description: '',
  icon: '',
  sort_order: 0
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 20, message: '分类名称长度在2-20个字符', trigger: 'blur' }
  ],
  description: [
    { max: 200, message: '描述长度不能超过200个字符', trigger: 'blur' }
  ]
}

// 方法
const resetForm = () => {
  Object.keys(form).forEach(key => {
    form[key] = key === 'sort_order' ? 0 : ''
  })
}

// 监听分类数据变化
watch(() => props.category, (newCategory) => {
  if (newCategory) {
    Object.keys(form).forEach(key => {
      form[key] = newCategory[key] || (key === 'sort_order' ? 0 : '')
    })
  } else {
    resetForm()
  }
}, { immediate: true })

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 调用分类的创建和更新API
    if (isEdit.value) {
      await api.put(`/categories/${props.category.id}`, form.value)
    } else {
      await api.post('/categories', form.value)
    }
    
    ElMessage.success(isEdit.value ? '分类更新成功' : '分类添加成功')
    emit('success')
    handleClose()
    
  } catch (error) {
    console.error('保存分类失败:', error)
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  visible.value = false
  resetForm()
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}
</style>
