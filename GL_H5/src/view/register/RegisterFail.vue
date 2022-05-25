<template>
  <div class="register headNav" :style="{ 'min-height': height + 'px' }">
    <div class="navTitle" v-if="!isApp()">
      <div class="navItem">
        <img
          class="black"
          src="@/assets/images/nav/a_top_return.png"
          @click="back"
        />
        <span>开户失败</span>
      </div>
    </div>
    <div class="content">
      <div class="header-section">
        <img
          src="@/assets/images/register/register_fail.png"
          alt="success-icon"
        />
        <p class="heading-text">糟糕, 系统开小差</p>
        <p class="supp-text">请稍后再试试或马上联系客服</p>
        <div class="cs-btn">联系客服</div>
      </div>
    </div>
  </div>
</template>

<script>
require("@/assets/css/registerNew.css");
import { isApp } from "@/utils/appHybrid";
export default {
  name: "RegisterFail",
  data() {
    return {
      height: "",
      isApp: isApp
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    docHeight() {
      this.height = window.innerHeight || document.documentElement.clientHeight;
    },
  },
  mounted() {
    this.docHeight();
  }
};
</script>

<style></style>
