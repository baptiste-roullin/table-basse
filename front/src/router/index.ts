import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(//import.meta.env.BASE_URL
  ),
  routes: [
    {
      alias: '/',
      path: '/items/:category?/:year?',
      //path: '/',
      name: 'home',
      component: HomeView
    },
  ]
})

export default router
