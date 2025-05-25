import { createRouter, createWebHistory } from 'vue-router'
import MemberProfile from '../views/MemberProfile.vue'

const routes = [
  {
    path: '/',
    name: 'profile',
    component: MemberProfile,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router