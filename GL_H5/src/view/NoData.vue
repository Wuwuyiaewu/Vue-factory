<template>
  <div class="noData">
    <img src="../assets/images/news/no_data.png">
    <p>暂时没有数据!</p>
    <span
      v-if="isTrade"
      @click="goQuotationView"
    >去交易</span>
  </div>
</template>

<script>
export default {
  name: 'NoData',
  props: ['isTrade'],
  data() {
    return {
      height: 0,
      sign: process.env.VUE_APP_GA_SIGN
    }
  },
  methods: {
    goQuotationView() {
      this.$bus.$emit('loading', false)
      // this.$firebase.logEvent('click_product', {
      //   'platform_type': 'cfdwell',
      //   'account_type': localStorage.getItem('zsmn'),
      //   'source': '我的持仓页面，点击【去交易】',
      //   'product_name': '美国DJ30',
      //   'time': this.getThisTimes(),
      //   'url': window.location.href
      // })
      this.$router.push({ path: '/home/QuotationView' })
    },
    getThisTimes() {
      var _this = this
      const yy = new Date().getFullYear()
      const mm = new Date().getMonth() + 1
      const dd = new Date().getDate()
      const hh = new Date().getHours()
      const mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      _this.gettime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
      return _this.gettime
    },
    // docHeight() {
    //   this.height = window.innerHeight || document.documentElement.clientHeight;
    // }
  },
  mounted() {
    // this.docHeight();
  }
}
</script>
