import { createApp } from 'vue'
import App from './App.vue'
import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'
import rem from '@/utils/alert'
import $ from 'jquery'
const unsync = sync(store, router)
createApp(App).use(store).use(router).use(rem).use($).use(unsync).mount('#app')
