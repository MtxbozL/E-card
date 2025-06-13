import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/services',
      name: 'Services',
      component: () => import('../views/Services.vue')
    },
    {
      path: '/works',
      name: 'Works',
      component: () => import('../views/Works.vue') // 确认路径正确
    },
    {
      path: '/blog',
      name: 'Blog',
      component: () => import('../views/Blog.vue')
    },
    {
      path: '/Repository',
      name: 'Repository',
      component: () => import('../views/Repository.vue')
    },
    {
      path: '/work',
      name: 'Dashboard',
      component: () => import('@/views/Work/Dashboard.vue')
    },
    // 重定向旧路径到新的统一界面
    {
      path: '/work/bill',
      redirect: '/work'
    },
    {
      path: '/work/account',
      redirect: '/work'
    },
    {
      path: '/work/category',
      redirect: '/work'
    },
    {
      path: '/work/statistics',
      redirect: '/work'
    },
  //   {
  //   path: '/images',
  //     component: () => import('../views/Images.vue')
  //   },
  //   {
  //     path: '/videos',
  //     component: () => import('../views/Videos.vue')
  //   },
  ]
})

export default router