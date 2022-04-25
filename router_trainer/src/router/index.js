import {
  createRouter,
  createWebHistory
} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import User from "../views/User.vue"
import User_every from "../views/User_every.vue"
import User_child from "../views/User_child.vue"
import Post from "../views/Post.vue"
import Notfound from "../views/Notfound.vue"
import Mutiple_routerView from "../views/Mutiple_routerView"
import Mutiple_one from "../components/Mutiple_one"
import Mutiple_two from "../components/Mutiple_two"
import Mutiple_three from "../components/Mutiple_three"
const routes = [{
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( /* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: "/mutiple_routerView",
    components: {
      default: Mutiple_routerView,
      Mutiple_one: Mutiple_one,
      Mutiple_two: Mutiple_two,
      Mutiple_three: Mutiple_three
    }
  },
  {
    path: "/users/:userId",
    component: User
  },
  {
    path: "/user_child/:userId",
    component: User_child,
    name: "User_child",
    children: [{
      path: 'posts',
      name: "User_child_post",
      component: Post
    }]
  },
  // ? 代表此參數可有可無
  {
    path: "/user/:u?",
    component: User_every
  },
  // 動態搭配 reg，找不到的網頁都去那，此配置要放最後，route 有讀取順序
  {
    path: "/:pathMatch(.*)*",
    name: "Notfound",
    component: Notfound
  },
  // 多層路由 router-view

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router