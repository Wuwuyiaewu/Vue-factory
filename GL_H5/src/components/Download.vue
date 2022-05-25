<template>
  <div
    v-if="isShow"
    class="download"
  >
    <div class="downCon">
      <img
        class="logo"
        src="../assets/images/index/logo.png"
      >
      <div class="item">
        <p>下载官方APP</p>
        <span>交易最高送5000美元</span>
      </div>
    </div>
    <a
      @click="appDown"
    >立即下载</a>
    <img
      class="close"
      src="../assets/images/login/a_top_closel.png"
      @click="downPop"
    >
  </div>
</template>

<script>
import Util from '@/utils/tradeDataUtil'
const u = navigator.userAgent
export default {
  name: 'Download',
  data() {
    return {
      isShow: true,
      sign: process.env.VUE_APP_GA_SIGN,
      isAndroid: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
      isIOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    }
  },
  methods: {
    appDown() {
      // this.$firebase.logEvent('download_app', {
      //   'platform_type': 'cfdwell',
      //   'account_type': localStorage.getItem('zsmn'),
      //   'time': Util.getThisTime(),
      //   'url': window.location.href,
      //   'source': '顶部悬浮层'
      // })
      if (this.isIOS) {
        window.location.href = 'https://itunes.apple.com/us/app/chuang-fucfd/id1153506842?mt=8'
      } else if (this.isAndroid) {
        window.location.href = 'https://img.getfc.com.cn/source/material/CFD_APP.apk'
      }
    },
    downPop() {
      this.isShow = !this.isShow
    }
  }
}
</script>
