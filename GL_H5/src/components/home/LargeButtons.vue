<template>
  <div class="home-large-btns">
    <div class="btn-left">
      <img :src="btns.pic_l" alt="btn-left-icon" />
      <div @click="clickHandler(btns.href_l)">
        <p class="lg-text">{{ btns.lgText_l }}</p>
        <p class="sm-text" v-if="btns.smText_l != ''">{{ btns.smText_l }}</p>
      </div>
    </div>
    <div class="btn-right">
      <img :src="btns.pic_r" alt="btn-right-icon" />
      <div @click="clickHandler(btns.href_r)">
        <p class="lg-text">{{ btns.lgText_r }}</p>
        <p class="sm-text" v-if="btns.smText_r != ''">{{ btns.smText_r }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import hrefDict from "@/utils/apiHrefMap";
import api from "@/plugins/api";
const u = navigator.userAgent;

export default {
  props: ["btns"],
  data() {
    return {
      frontoffice: process.env.VUE_APP_FRONTOFFICE,
      u: navigator.userAgent,
      isAndroid: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1,
      isIOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    clickHandler(href) {
      if (href == "gotoDeposit") {
        this.gotoDeposit();
      } else if (href == "gotoRealAccount") {
        this.handleSwitchAccount();
      } else {
        this.$router.push({
          path: hrefDict[href],
        });
      }
    },
    gotoDeposit() {
      this.$bus.$emit("loading", false);
      if (this.isIOS) {
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
            const url =
              this.frontoffice +
              "/rgsLogin.rgs?platform=GTS2&testPlatform=mb&lang=zh_CN&token=" +
              res.data.token +
              "&service=" +
              encodeURIComponent(this.frontoffice) +
              "%2FfundDepositOnline%2Edo%3FfundType%3Dnew%26version%3D191%26terminal%3Dios";
            setTimeout(() => {
              this.$bus.$emit("loading", true);
              window.open(url, "_blank");
            }, 500);
          }
        });
      } else {
        this.$router.push({
          path: "/home/UserCenter",
          query: { action: "fund", num: 2, title: "入金" },
        });
      }
    },
    handleSwitchAccount() {
      console.log("in handle switch account");
      //?mobilePhone=18000002996&password=abcd1234&userType=real
      const params =
        "?mobilePhone=" +
        this.user.mobilePhone +
        "&password=" +
        this.user.pwd +
        "&userType=" +
        this.accountType;
      api
        .switchAccount(params)
        .then((res) => {
          console.log(res);
          if (res.data.result == "0") {
            // 0 = have related account and can directly switch
            // success, reload page with new user
            let loginType = "";
            if (res.data.type == "real_to_demo") {
              loginType = "D";
            } else {
              loginType = res.data.accountStatusCode;
            }
            const user = {
              loginname: res.data.customerNumber,
              pwd: this.user.pwd,
              companyId: res.data.companyId,
              uuid: res.data.uuid,
              mobilePhone: this.user.mobilePhone,
              loginType: loginType,
            };
            sessionStorage.setItem("userInfo", JSON.stringify(user));
            this.$toast("账户切换成功, 页面即将刷新");

            setTimeout(() => {
              this.$store.dispatch("setUser", user);
              this.$router.go(0); // 刷新页面，实现socket重连
            }, 2000);
          } else if (res.data.result == "11") {
            // 11 = no related demo account, created one and switch
            const user = {
              loginname: res.data.customerInfo.customerNumber,
              pwd: this.user.pwd,
              companyId: this.user.companyId,
              uuid: this.user.uuid,
              mobilePhone: this.user.mobilePhone,
              loginType: "D",
            };
            sessionStorage.setItem("userInfo", JSON.stringify(user));
            this.$toast("成功注册模拟账户, 页面即将刷新");

            setTimeout(() => {
              this.$store.dispatch("setUser", user);
              this.$router.go(0); // 刷新页面，实现socket重连
            }, 2000);
          } else if (res.data.result == "21") {
            // demo to real but no related real account
            this.$emit("showPopup");
          } else {
            // failed
            this.$toast(res.data.message);
          }
        })
        .catch((err) => {
          this.$toast(res.data.message);
        });
    },
  },
};
</script>

<style></style>
