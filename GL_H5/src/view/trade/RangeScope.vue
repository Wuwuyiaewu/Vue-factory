<template>
  <div class="rangeScope">

    <div class="showItem">
      <p>最大偏差</p>
      <div class="rightCon"><label>{{ ranges }}</label><span :class="{'checked':isChoose}" @click="clickArrow" /></div>
    </div>

    <div class="rangbox" v-if="isChoose">
      <div class="rangeTit">最大偏差 <img src="@/assets/images/quotation/range_close.png" @click="clickArrow"></div>
      <div class="rangeDesc">成交价格与当前价格的最大差价，成交价<br>需要在该差价范围内才可成交</div>
      <div class="rangeNum">{{this.ranges?this.ranges:'--'}}<span>偏移点数</span></div>
      
      <div class="barbox">
        <span>0</span>
        <div ref="progressBar" class="rectItem" @click="progressClick">
          <div class="rect" />
          <div class="circle">
            <span id="rectWidth" ref="progress" :style="{width: sliderStyle + 'px'}" />
            <p ref="progressBtn" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove" />
          </div>
        </div>
        <span>{{ rangeScope }}</span>
      </div>

    </div>
    <div class="rangbox_bg" v-if="isChoose"></div>

  </div>
</template>

<script>
export default {
  name: 'RangeScope',
  props: ['rangeScope', 'range'],
  data() {
    return {
      isChoose: false,
      ranges: '',
      sliderStyle: 0
    }
  },
  watch: {
    range: {
      handler(newValue, oldValue) {
        if(newValue){
          this.ranges = newValue
          const rem = parseFloat(this.getRem())
          this.sliderStyle = (newValue / this.rangeScope * (5.3 * rem - 0.38 * 1.25 * rem)).toFixed(0)
        }
      },
      immediate: true
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    changeRange(range) {
      this.$emit('changeRange', range)
    },
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
      let range = (offsetWidth / (this.$refs.progressBar.clientWidth - this.$refs.progressBtn.clientWidth * 1.25) * this.rangeScope).toFixed(0)
      if (offsetWidth > this.$refs.progressBar.clientWidth - this.$refs.progressBtn.clientWidth * 1.25) this._offset(this.$refs.progressBar.clientWidth - this.$refs.progressBtn.clientWidth * 1.25)
      if (offsetWidth <= 0) this._offset(0)
      if (range <= 0) range = 0
      if (range >= this.rangeScope) range = this.rangeScope
      this.ranges = range
      this.changeRange(this.ranges)
    },
    progressTouchStart(e) {
      this.touch.startX = e.touches[0].clientX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(e) {
      const delta = e.touches[0].clientX - this.touch.startX
      const offsetWidth = this.touch.left + delta
      let range = (offsetWidth / (this.$refs.progressBar.clientWidth - this.$refs.progressBtn.clientWidth * 1.25) * this.rangeScope).toFixed(0)
      this._offset(offsetWidth)
      if (offsetWidth > this.$refs.progressBar.clientWidth - this.$refs.progressBtn.clientWidth * 1.25) this._offset(this.$refs.progressBar.clientWidth - this.$refs.progressBtn.clientWidth * 1.25)
      if (offsetWidth <= 0) this._offset(0)
      if (range <= 0) range = 0
      if (range >= this.rangeScope) range = this.rangeScope
      this.ranges = range
      this.changeRange(this.ranges)
    },
    _offset(width) {
      width = Math.floor(width)
      this.sliderStyle = width
      this.$refs.progress.style.width = `${width}px`
    },
    getRem() {
      const defaultRem = 50
      const winWidth = window.innerWidth
      const rem = winWidth / 375 * defaultRem
      return rem
    },
    clickArrow() {
      this.isChoose = !this.isChoose
      return 'checked'
    }
  }
}
</script>
