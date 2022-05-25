<template>
  <div class="aboutUs headNav">
    <div class="navTitle">
      <div class="navItem">
        <img class="black" src="@/assets/images/nav/a_top_return.png" @click="back">
        <span>关于我们</span>
      </div>
    </div>
    <div class="content" v-html="content[0].content" />
  </div>
</template>

<script>
require('@/assets/css/about.css')
export default {
  name: 'AboutUs',
  data() {
    return {
      content: JSON.parse(process.env.VUE_APP_ABOUTUS)
    }
  },
  mounted() {
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
