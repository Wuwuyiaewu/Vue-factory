import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import rem from '@/utils/alert'
import Global from '@/utils/global'

createApp(App).use(store).use(router).use(rem(750,true)).use(Global).mount('#app')
