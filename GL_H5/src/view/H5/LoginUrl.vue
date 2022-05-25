<template>
  <div class="iframe headNav">
    <div class="navTitle">
      <div class="navItem">
        <img class="black" src="@/assets/images/nav/a_top_return.png" @click="back">
        <span>{{ $route.query.title }}</span>
      </div>
    </div>
    <div id="iframeCon">
      <iframe id="iframe" scrolling="auto" frameborder="0" :src="$route.query.url" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginUrl',
  mounted() {
    window.scrollTo(0, 0)
    this.$bus.$emit('loading', true)
    this.removeFixed()
    this.$nextTick(() => {
      var iframe = document.getElementById('iframe')
      var iframeCon = document.getElementById('iframeCon')
      const iframeConH = document.documentElement.clientHeight
      const iframeConw = document.documentElement.clientWidth
      iframeCon.setAttribute('style', 'min-height:' + iframeConH + 'px')
      iframe.setAttribute('height', iframeConH + 'px')
      iframe.setAttribute('width:', iframeConw + 'px')
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
