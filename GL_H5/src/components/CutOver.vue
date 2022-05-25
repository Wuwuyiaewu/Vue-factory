<template>
  <div v-if="isCutOver" class="popFixed">
    <div class="masking" @click="closePop" />
    <div class="tcCon">
      <div class="item">
        <span>提示</span>
        <p>{{ errMessage }}</p>
      </div>
      <div class="btnCon only">
        <span @click="closePop">确定</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CutOver',
  props: ['errMessage'],
  data() {
    return {
      isCutOver: false
    }
  },
  methods: {
    closePop() {
      this.isCutOver = !this.isCutOver
    }
  }
}
</script>
