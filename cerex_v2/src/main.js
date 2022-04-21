import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import rem from '@/utils/alert'
import $ from 'jquery'
createApp(App).use(store).use(router).use(rem).use($).mount('#app')
