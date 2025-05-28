import { createRouter, createWebHistory } from 'vue-router'
import SignUp from '../views/SignUp.vue'
import Profile from '../views/Profile.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home', // 首頁路徑，檢查signup.vue所以暫時不設為首頁
      name: 'home',
      component: HomeView,
    },
    {
      path: '/', // 註冊頁路徑
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/profile', // 會員資料頁路徑
      name: 'Profile',
      component: Profile
    },
    {
      path: '/about',
      name: 'about',
      
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
