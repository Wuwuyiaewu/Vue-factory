<template>
  <div v-if="loading" class="loading">
    <img src="../assets/images/nav/loading.gif">
    <span>{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  data() {
    return {
      loading: false,
      text: '数据正在加载中...'
    }
  },
  created() {
    this.$bus.$on('loading', (data, text) => {
      this.loading = !data
      if (text != null && text != '') this.text = text
      else this.text = '数据正在加载中...'
    })
  },
  beforeDestroy() {
    this.$bus.$off('loading', (data, text) => {
      this.loading = data
      if (text != null && text != '') this.text = text
      else this.text = '数据正在加载中...'
    })
  }
}
</script>
