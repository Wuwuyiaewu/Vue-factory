<template>
  <div class="tradePage">
    <div class="logo">
      <img :src="require('@/assets/images/trade/logo.png')" />
    </div>
    <div class="content">
      <ul>
        <li v-for="(icon, index) in icons" :key="index">
          <div class="imgbox"><img :src="icon.pic" /></div>
          <p class="title">{{ icon.top_text }}</p>
          <p>{{ icon.bot_text }}</p>
        </li>
      </ul>
    </div>
    <div class="btn" @click="gotoRegister">开户体验 <span>顶级平台</span></div>
    <div class="login">已有账户? <span @click="gotoLogin">马上登录</span></div>
    <Tab />
  </div>
</template>
<script>
require("@/assets/css/trade.css");
import Tab from "@/components/Tab.vue";
import { mapState } from "vuex";
import Util from "@/utils/tradeDataUtil";
export default {
  name: "Trade",
  components: {
    Tab,
  },
  data() {
    return {
      height: "",
      sign: process.env.VUE_APP_GA_SIGN,
      util: Util,
    };
  },
  computed: {
    ...mapState(["account", "quote", "user", "appProperties"]),
    icons() {
      return this.appProperties.trade_page
        ? this.appProperties.trade_page.introicons
        : [];
    },
  },
  mounted() {
    this.removeFixed();
    this.docHeight();
    window.scrollTo(0, 0);
  },
  activated() {
    this.removeFixed();
    this.docHeight();
    window.scrollTo(0, 0);
  },
  methods: {
    back() {
      this.$router.push({ path: "/home" });
    },
    removeFixed() {
      const mainH = document.getElementById("main");
      mainH.classList.remove("mainFixed");
    },
    goQuotation() {
      this.$router.push({ path: "/home/Quotation" });
    },
    docHeight() {
      this.height = window.innerHeight || document.documentElement.clientHeight;
    },
    gotoRegister() {
      this.$router.push({ path: "/register" });
    },
    gotoLogin() {
      this.$router.push({ path: "/login" });
    },
  },
};
</script>
