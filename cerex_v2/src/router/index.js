import {
  createRouter,
  createWebHistory
} from 'vue-router'
import "@/assets/css/global.css"
import "@/assets/css/animate.css"
import "@/assets/css/content_page.css"
const routes = [{
  path: '/learningcentre.html',
  alias: ['/Learningcentre'],
  component: () => import( /* webpackChunkName: "about" */ '../views/Learningcentre.vue'),
  children: [{
      path: '',
      component: () => import( /* webpackChunkName: "about" */ '../layer/Learningcentre_bat.vue'),
    },
    {
      path: 'beginner.html',
      alias: ['beginner'],
      name: "Beginner",
      component: () => import( /* webpackChunkName: "about" */ '../layer/Beginner.vue'),
    },
    {
      path: 'beginner/detail/:id',
      alias: ['beginner/detail'],
      name: "Beginner_detail",
      props:true,
      component: () => import( /* webpackChunkName: "about" */ '../layer/Beginner_detail.vue'),
    },
    {
      path: 'advanced.html',
      alias: ['advanced'],
      name: "Advanced",
      component: () => import( /* webpackChunkName: "about" */ '../layer/Advanced.vue'),
    },
    {
      path: 'advanced/detail/:id',
      alias: ['detail'],
      name: "Advanced_detail",
      props:true,
      component: () => import( /* webpackChunkName: "about" */ '../layer/Advanced_detail.vue'),
    },
    {
      path: 'technical.html',
      alias: ['technical'],
      name: "Technical",
      component: () => import( /* webpackChunkName: "about" */ '../layer/Technical.vue'),
    },
    {
      path: 'technical/detail/:id',
      alias: ['detail'],
      name: "Technical_detail",
      props:true,
      component: () => import( /* webpackChunkName: "about" */ '../layer/Technical_detail.vue'),
    }
  ]
}, ]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router