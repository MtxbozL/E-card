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
      component: () => import('../views/Works.vue')
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