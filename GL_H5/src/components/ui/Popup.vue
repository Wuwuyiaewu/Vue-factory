<template>
  <div class="popup-container" v-if="visible">
    <div class="popup-content">
      <!-- <img src="@/assets/images/register/quit_icon.png" alt="quit_icon" /> -->
      <p class="title">{{ title }}</p>
      <p v-html="content"></p>
      <div class="btns-box">
        <span class="quit" @click="cancelHandler">{{ cancelText }}</span>
        <span class="continue" @click="continueHandler">{{ continueText }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: "Popup",
    props: ['visible', 'title', 'content', 'cancelText', 'continueText', 'cancelHandler', 'continueHandler'],
};
</script>

<style>
.popup-container {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999999;
  display: grid;
  place-items: center;
}

.popup-container .popup-content {
  width: 6.4rem;
  height: 4rem;
  background-color: #fff;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.popup-container .popup-content .title {
    font-size: 0.53rem;
    font-family: NotoSansCJKsc-Black;
    color: #0288FB;
    font-weight: bold;
}
.popup-container .popup-content img {
  width: 1.53rem;
  height: 1.53rem;
}
.popup-container .popup-content p {
  font-size: 0.28rem;
  line-height: 0.44rem;
  font-family: PingFang SC Medium;
  color: #B0B0B0;
  text-align: center;
}

.popup-container .popup-content .btns-box {
  display: flex;
  align-items: center;
}
.popup-container .popup-content .btns-box span {
  display: inline-block;
  width: 2.68rem;
  height: 0.79rem;
  line-height: 0.79rem;
  text-align: center;
  border-radius: 0.62rem;
  color: #fff;
  font-size: 0.31rem;
  font-family: PingFang SC Medium;
}
.popup-container .popup-content .btns-box .quit {
  background-color: #bfbfbf;
  margin-right: 0.26rem;
}
.popup-container .popup-content .btns-box .continue {
  background-color: #ff6a1a;
}
</style>
