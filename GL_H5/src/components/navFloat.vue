<template>
  <div class="navFixed">
    <div v-if="isShow" class="masking" @click="clickPop" />
    <div class="btnList">
      <span @click="clickPop" />
      <div v-if="isShow" class="item">
        <a @click="openLive800"><em>在线客服</em><img src="@/assets/images/nav/nav_float_live800.png"></a>
        <p @click="goHome"><em>返回首页</em><img src="@/assets/images/nav/nav_float_home.png"></p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'NavFloat',
  data() {
    return {
      isShow: false
    }
  },
  methods: {
    clickPop() {
      this.isShow = !this.isShow
    },
    goHome() {
      this.$router.push({ path: '/home' })
    },
    openLive800() {
      var url = 'https://www.cf-service.com/k800/chatClient/chatbox.jsp?companyID=475&configID=56&jid='
      var left = (screen.width / 2) - (600 / 2)
      var top = (screen.height / 2) - (400 / 2)
      window.open(url,
        'DescriptiveWindowName',
        'resizable,scrollbars=yes,status=1,width=800, height=550, top=' + top + ', left=' + left)
    }
  }
}
</script>
