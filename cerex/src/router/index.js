import { createRouter, createWebHistory } from 'vue-router'
import Learningcentre from '../components/learningcentre.vue'
import Learningcentre_details from '../components/learningcentre_details.vue'
import Learningcentre_beginne from '../components/learningcentre_beginner.vue'
import "@/assets/css/global.css"
import "@/assets/css/content_page.css"
const routes = [
  {
    path: '/',
    component: Learningcentre,
  },
  {
    path: '/learningcentre_details',
    name: 'Learningcentre_details',
    component:Learningcentre_details
  },
  {
    path: '/learningcentre_beginne',
    name: 'Learningcentre_beginne',
    component:Learningcentre_beginne
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
