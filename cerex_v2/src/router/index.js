import { createRouter, createWebHistory } from 'vue-router'
import Learningcentre from '../views/Learningcentre'
import "@/assets/css/global.css"
import "@/assets/css/animate.css"
import "@/assets/css/content_page.css"
const routes = [
  {
    path: '/Learningcentre.html',
    component: Learningcentre,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
