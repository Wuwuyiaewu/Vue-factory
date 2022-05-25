<template>
  <div class="app-dl-header" v-if="visible">
    <div class="close-btn" @click="visible=false"></div>
    <img :src="config.pic" alt="app-icon" />
    <div class="promo-text" v-html="config.content_text">
    </div>
    <div class="dl-btn">
      {{ config.button_text }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['config'],
  name: "AppDlHeader",
  data() {
      return {
          visible: true
      }
  }
};
</script>

<style>
.app-dl-header {
  height: 1.17rem;
  width: 100%;
  max-width: 750px;
  background-color: rgba(34, 34, 34, 0.8);
  position: fixed;
  top: 0;
  z-index: 999;
  display: flex;
  justify-items: center;
  align-items: center;
}
.app-dl-header .close-btn {
    width: 0.3rem;
    height: 0.3rem;
    /* border: 0.02rem solid #fff; */
    /* background: #E3E3E3; */
    border-radius: 100%;
    cursor: pointer;
    position: absolute;
    top: 0.2rem;
    left: 0.2rem;
}
.app-dl-header .close-btn:after, .app-dl-header .close-btn:before {
    content: "";
    position: absolute;
    height: 60%;
    width: 0.015rem;
    margin: -28% -0.01rem;
    background: #fff;
    left: 50%;
    top: 50%;
    border-radius: 10px;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
}
.app-dl-header .close-btn:before {
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
}
.app-dl-header img {
    width: 0.87rem;
    height: 0.87rem;
    margin: 0 0.3rem 0 0.7rem;
}
.app-dl-header .promo-text {
    color: #fff;
    font-size: 0.26rem;
    flex: 1;
    font-family: PingFang SC Medium;
}
.app-dl-header .dl-btn {
    background-color: #3490FF;
    color: #fff;
    font-size: 0.26rem;
    border-radius: 0.08rem;
    width: 1.39rem;
    height: 0.48rem;
    line-height: 0.48rem;
    text-align: center;
    margin-right: 0.3rem;
}
</style>
