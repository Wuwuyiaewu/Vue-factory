import {
  createRouter,
  createWebHistory
} from 'vue-router'
import "@/assets/css/global.css"
import "@/assets/css/animate.css"
import "@/assets/css/content_page.css"
const routes = [{
  path: '/learningcentre.html',
  alias: ['/Learningcentre', '/teaching_center.html'],
  name: "Learningcentre",
  meta: {
    breadcrumb: [{
      name: '首頁',
      link: '/'
    }, {
      name: '教学中心',
      link: '/learningcentre.html'
    }]
  },
  component: () => import( /* webpackChunkName: "about" */ '../views/Learningcentre.vue'),
  children: [{
    path: '',
    component: () => import( /* webpackChunkName: "about" */ '../layer/Learningcentre_bat.vue')
  },
  {
    path: 'beginner.html',
    alias: ['beginner'],
    name: "Beginner",
    meta: {
      breadcrumb: [
        {
          name: '首頁',
          link: '/'
        },
        {
          name: '教学中心',
          link: '/learningcentre.html'
        },
        {
          name: '新手入门',
          link: '/learningcentre/beginner.html'
        }]
    },
    component: () => import( /* webpackChunkName: "about" */ '../layer/Beginner.vue'),
  },
  {
    path: 'beginner/detail/:id',
    name: "Beginner_detail",
    meta: {
      breadcrumb: [
        {
          name: '首頁',
          link: '/'
        },
        {
          name: '教学中心',
          link: '/learningcentre.html'
        },
        {
          name: '新手入门',
          link: '/learningcentre/beginner.html'
        },
        {
          name: '文章详情',
          link: '/learningcentre/beginner/detail'
        }
      ]
    },
    props: true,
    component: () => import( /* webpackChunkName: "about" */ '../layer/Beginner_detail.vue'),
  },
  {
    path: 'advanced.html',
    alias: ['advanced'],
    name: "Advanced",
    meta: {
      breadcrumb: [
        {
          name: '首頁',
          link: '/'
        },
        {
          name: '教学中心',
          link: '/learningcentre.html'
        },
        {
          name: '进阶教学',
          link: '/learningcentre/Advanced.html'
        }]
    },
    component: () => import( /* webpackChunkName: "about" */ '../layer/Advanced.vue'),
  },
  {
    path: 'advanced/detail/:id',
    name: "Advanced_detail",
    props: true,
    meta: {
      breadcrumb: [
        {
          name: '首頁',
          link: '/'
        },
        {
          name: '教学中心',
          link: '/learningcentre.html'
        },
        {
          name: '进阶教学',
          link: '/learningcentre/Advanced.html'
        },
        {
          name: '文章详情',
          link: '/learningcentre/Advanced/detail'
        }
      ]
    },
    component: () => import( /* webpackChunkName: "about" */ '../layer/Advanced_detail.vue'),
  },
  {
    path: 'technical.html',
    alias: ['technical'],
    name: "Technical",
    meta: {
      breadcrumb: [
        {
          name: '首頁',
          link: '/'
        },
        {
          name: '教学中心',
          link: '/learningcentre.html'
        },
        {
          name: '技术指标',
          link: '/learningcentre/technical.html'
        }
      ]
    },
    component: () => import( /* webpackChunkName: "about" */ '../layer/Technical.vue'),
  },
  {
    path: 'technical/detail/:id',
    name: "Technical_detail",
    props: true,
    meta: {
      breadcrumb: [
        {
          name: '首頁',
          link: '/'
        },
        {
          name: '教学中心',
          link: '/learningcentre.html'
        },
        {
          name: '技术指标',
          link: '/learningcentre/technical.html'
        },
        {
          name: '文章详情',
          link: '/learningcentre/technical/detail'
        }
      ]
    },
    component: () => import( /* webpackChunkName: "about" */ '../layer/Technical_detail.vue'),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: '/learningcentre.html'
  },
  ]
},]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior: function (to, from, savedPosition) {
    if (to.hash) {
      // return { selector: to.hash }
      //Or for Vue 3:
      // return {el: to.hash}
      return {el: to.hash}
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes
})

export default router