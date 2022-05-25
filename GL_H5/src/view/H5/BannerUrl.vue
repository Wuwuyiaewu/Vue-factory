<template>
  <div class="iframe headNav">
    <div class="navTitle" id="navTitle">
      <div class="navItem">
        <img class="black" src="@/assets/images/nav/a_top_return.png" @click="back">
        <span>{{ $route.query.title }}</span>
      </div>
    </div>
    <div id="iframeCon">
      <iframe id="iframe" scrolling="auto" frameborder="0" :src="url" />
    </div>
  </div>
</template>
<style>
.iframe{
  height: 100vh;
}
#iframeCon{
  box-sizing: border-box; height: 100vh;
}
</style>
<script>
export default {
  name: 'BannerUrl',
  data() {
    return {
      url: this.$route.query.url
    }
  },
  mounted() {
    window.scrollTo(0, 0)
    this.$bus.$emit('loading', true)
    this.removeFixed()
    this.$nextTick(() => {
      var iframe = document.getElementById('iframe')
      var navTitleH = document.getElementById('navTitle').clientHeight
      const iframeConH = document.documentElement.clientHeight
      const iframeConw = document.documentElement.clientWidth
      iframe.setAttribute('height', iframeConH - navTitleH)
      iframe.setAttribute('width', iframeConw)
    })
  },
  activated() {
    window.scrollTo(0, 0)
    this.$bus.$emit('loading', true)
    this.removeFixed()
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    removeFixed() {
      const mainH = document.getElementById('main')
      mainH.classList.remove('mainFixed')
    }
  }
}
</script>
