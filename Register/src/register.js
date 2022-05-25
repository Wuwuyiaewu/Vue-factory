import _ from 'lodash';
import { createApp } from 'vue'
import printMe from './print.js';
const HTTP_BASE_URL = "https://api.mircoinfolab9.com:1315"
printMe()

createApp({
  data() {
    return {
      count: 0
    }
  }
}).mount('#app')