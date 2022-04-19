import { createRouter, createWebHistory } from 'vue-router'
import Learningcentre from '../layer/learningcentre'
import Learningcentre_details from '../components/learningcentre_details.vue'
import Learningcentre_beginne from '../components/learningcentre_beginner.vue'
import "@/assets/css/global.css"
import "@/assets/css/content_page.css"
import "@/utills/rem"
const routes = [
  {
    path: '/learningcentre.html',
    component: Learningcentre,
  },
  {
    path: '/learningcentre/learningcentre_details.html',
    name: 'Learningcentre_details',
    component:Learningcentre_details
  },
  {
    path: '/learningcentre/learningcentre_beginne.html',
    name: 'Learningcentre_beginne',
    component:Learningcentre_beginne
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
