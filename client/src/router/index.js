import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import SoftwareList from '@/views/SoftwareList.vue'
import SoftwareDetail from '@/views/SoftwareDetail.vue'
import CategoryList from '@/views/CategoryList.vue'
import FeaturedSoftware from '@/views/FeaturedSoftware.vue'
import Admin from '@/views/Admin.vue'
import Login from '@/views/Login.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/software',
    name: 'SoftwareList',
    component: SoftwareList,
    meta: { title: '软件列表' }
  },
  {
    path: '/software/:id',
    name: 'SoftwareDetail',
    component: SoftwareDetail,
    meta: { title: '软件详情' }
  },
  {
    path: '/category/:id',
    name: 'CategoryList',
    component: CategoryList,
    meta: { title: '分类软件' }
  },
  {
    path: '/featured',
    name: 'FeaturedSoftware',
    component: FeaturedSoftware,
    meta: { title: '推荐软件' }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { title: '管理后台', requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '页面不存在' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 软件下载站` : '软件下载站'
  
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      next('/login')
      return
    }
  }
  
  next()
})

export default router
