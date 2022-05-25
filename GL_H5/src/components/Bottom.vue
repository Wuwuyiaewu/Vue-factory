<template>
  <div :class="user.loginname?'bottom isShow':'bottom'">
    <span>{{ content }}</span>
    <a
      v-if="!user.loginname"
      @click="login()"
    >登录/开户</a>
  </div>
</template>
<script>
import { mapState } from 'vuex'

import Util from '@/utils/tradeDataUtil'
export default {
  name: 'Bottom',
  props: ['content'],
  computed: {
    ...mapState(['user'])
  },
  data() {
    return {
      sign: process.env.VUE_APP_GA_SIGN
    }
  },
  methods: {
    login() {
      // this.$firebase.logEvent('click_login', {
      //   'platform_type': 'cfdwell',
      //   'source': '首页底部',
      //   'time': Util.getThisTime(),
      //   'url': window.location.href
      // })
      this.$bus.$emit('loading', false)
      this.$router.push({ path: '/Login' })
    }
  }
}
</script>
