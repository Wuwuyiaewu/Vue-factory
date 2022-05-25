<template>
  <div class="iframe headNav">
    <div class="navTitle" id="navTitle">
      <div class="navItem">
        <img
          class="black"
          src="@/assets/images/nav/a_top_return.png"
          @click="back"
        />
        <span>{{ $route.query.title }}</span>
      </div>
    </div>
    <div id="iframeCon">
      <iframe id="iframe" scrolling="auto" frameborder="0" :src="url" />
    </div>
  </div>
</template>
<style>
.iframe {
  height: 100vh;
}
#iframeCon {
  box-sizing: border-box;
  height: 100vh;
}
</style>

<script>
import { mapState } from "vuex";
import api from "@/plugins/api";
const u = navigator.userAgent;
export default {
  name: "UserCenter",
  data() {
    return {
      frontoffice: process.env.VUE_APP_FRONTOFFICE,
      url: "",
      action: this.$route.query.action,
      num: this.$route.query.num,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  mounted() {
    this.$bus.$emit("loading", false);
    const data = {
      params: {
        weblinkId: "PCUI_DEPOSIT",
        platTypeKey: "webui",
        customerNumber: this.user.loginname,
        password: this.user.pwd,
      },
    };
    api.getUserCenterToken(data).then((res) => {
      if (res.data.code == "success") {
        this.$bus.$emit("loading", true);
        if (this.action == "tradeRecord") {
          const url =
            this.frontoffice +
            "/rgsLogin.rgs?platform=GTS2&testPlatform=mb&lang=zh_CN&token=" +
            res.data.token +
            "&service=" +
            encodeURIComponent(this.frontoffice) +
            "%2FtradeRecord.do%3Fpattern%3DgreenRed%26timeZones%3DGMT%2B8%26category%3DtradeRecord%26deviceId%3D%26version%3D191%26terminal%3Dios%26page%3D" +
            this.num;
          this.url = url;
          this.backUrl = "/home/Trade?type=4";
        } else if (this.action == "fund") {
          if (this.num == 1) {
            const url =
              this.frontoffice +
              "/rgsLogin.rgs?platform=GTS2&testPlatform=mb&lang=zh_CN&token=" +
              res.data.token +
              "&service=" +
              encodeURIComponent(this.frontoffice) +
              "%2FfundDrawings%2Edo%3FfundType%3Dnew%26version%3D191%26terminal%3Dios";
            this.url = url;
          } else if (this.num == 2) {
            const url =
              this.frontoffice +
              "/rgsLogin.rgs?platform=GTS2&testPlatform=mb&lang=zh_CN&token=" +
              res.data.token +
              "&service=" +
              encodeURIComponent(this.frontoffice) +
              "%2FfundDepositOnline%2Edo%3FfundType%3Dnew%26version%3D191%26terminal%3Dios";
            this.url = url;
          }
          this.backUrl = "/mine";
        } else if (this.action == "personalInfo") {
          const url =
            this.frontoffice +
            "/rgsLogin.rgs?platform=GTS2&testPlatform=mb&lang=zh_CN&token=" +
            res.data.token +
            "&service=" +
            encodeURIComponent(this.frontoffice) +
            "%2FpersonalInfo%2Edo";
          // console.log(res.data.token+"///"+url);
          this.url = url;
          this.backUrl = "/mine";
        }
      }
    });
    window.scrollTo(0, 0);
    this.removeFixed();
    this.$nextTick(() => {
      var iframe = document.getElementById("iframe");
      var navTitleH = document.getElementById("navTitle").clientHeight;
      const iframeConH = document.documentElement.clientHeight;
      const iframeConw = document.documentElement.clientWidth;
      iframe.setAttribute("height", iframeConH - navTitleH);
      iframe.setAttribute("width", iframeConw);
    });
  },
  activated() {
    window.scrollTo(0, 0);
    this.removeFixed();
  },
  methods: {
    back() {
      this.$router.push({ path: this.backUrl, query: {} });
    },
    removeFixed() {
      const mainH = document.getElementById("main");
      mainH.classList.remove("mainFixed");
    },
  },
};
</script>
