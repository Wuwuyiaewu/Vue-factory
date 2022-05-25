<template>
  <div class="mine">
    <!-- Top Section i.e. My Assets -->
    <MyAssets />
    <div class="top-menu flex-h">
      <div
        v-for="(item, index) in top_menu"
        :key="index"
        class="menu-card flex-c"
        @click="menuClickHandler(item)"
      >
        <img :src="item.pic" :alt="'top-menu-icon' + index" />
        <p>{{ item.btn_text }}</p>
      </div>
    </div>
    <div class="bot-menu flex-c">
      <div
        v-for="(item, index) in bot_menu"
        :key="index"
        class="menu-list-item flex-h"
        @click="menuClickHandler(item)"
      >
        <img :src="item.pic" :alt="'bot-menu-icon' + index" />
        <p>{{ item.btn_text }}</p>
        <van-icon name="arrow" color="#BFBFBF" />
      </div>
    </div>
    <Popup
      :visible="popupVisible"
      :title="'请先登录'"
      :content="'您好，登录后可接收</br>您好，登录后可接收 突发行情通知哦~'"
      :cancelText="'取消'"
      :continueText="'立即登录'"
      :cancelHandler="closePopup"
      :continueHandler="gotoLogin"
    />
    <Tab />
  </div>
</template>

<script>
require("@/assets/css/mine.css");
import { mapState } from "vuex";
import hrefDict from "@/utils/apiHrefMap";
import Tab from "@/components/Tab.vue";
import MyAssets from "./MyAssets.vue";
import Popup from "@/components/ui/Popup.vue";
import api from "@/plugins/api";
const u = navigator.userAgent;

export default {
  name: "Mine",
  components: {
    Tab,
    MyAssets,
    Popup,
  },
  data() {
    return {
      popupVisible: false,
      frontoffice: process.env.VUE_APP_FRONTOFFICE,
      u: navigator.userAgent,
      isAndroid: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1,
      isIOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    };
  },
  computed: {
    ...mapState(["user", "appProperties", "loginType"]),
    top_menu() {
      let menu = [];
      if (this.appProperties.mine_page) {
        menu = this.appProperties.mine_page.top_menu.filter((el) => {
          return el.login_type.includes(this.loginType);
        });
      }
      return menu;
    },
    bot_menu() {
      let menu = [];
      if (this.appProperties.mine_page) {
        menu = this.appProperties.mine_page.bot_menu.filter((el) => {
          return el.login_type.includes(this.loginType);
        });
      }
      return menu;
    },
  },
  methods: {
    menuClickHandler(item) {
      console.log(item);
      if (item.new_window == "true") {
        window.open(item.other_href);
      } else {
        if (item.other_href != "") {
          if (item.href == "gotoOther" || item.href == "gotoCS") {
            let url_text = item.other_href;
            let url = new URL(item.other_href);
            let modifier = url.search != "" ? "&" : "?";
            if (!url.searchParams.get("utm_source")) url_text += modifier + "utm_source=" + sessionStorage.getItem("utm_source");
            if (!url.searchParams.get("utm_medium") && sessionStorage.getItem("utm_medium")) url_text += modifier + "utm_medium=" + sessionStorage.getItem("utm_medium");
            if (!url.searchParams.get("utm_campaign") && sessionStorage.getItem("utm_campaign")) url_text += modifier + "utm_campaign=" + sessionStorage.getItem("utm_campaign");
            if (!url.searchParams.get("utm_content") && sessionStorage.getItem("utm_content")) url_text += modifier + "utm_content=" + sessionStorage.getItem("utm_content");
            if (!url.searchParams.get("utm_term") && sessionStorage.getItem("utm_term")) url_text += modifier + "utm_term=" + sessionStorage.getItem("utm_term");
            this.$router.push({
              path: "/home/BannerUrl",
              query: {
                title: item.btn_text,
                url: url_text,
              },
            });
          } else if (item.href == "gotoProduct") {
            this.goQuoteChart(
              item.other_href,
              this.$store.state.quote.notify[matchedConfig.other_href].aushGB
            );
          } else if (item.href == "gotoArticle") {
            this.$router.push({
              path: "/home/NewsDetail",
              query: {
                title: item.btn_text,
                articleId: item.other_href,
              },
            });
          } else {
            // any other cases like gotoArticle
          }
        } else {
          if (item.href == "gotoMsgPush") {
            this.goToMsgBox();
          } else if (item.href == "gotoPersonalInfo") {
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
                const url =
                  this.frontoffice +
                  "/rgsLogin.rgs?platform=GTS2&testPlatform=mb&lang=zh_CN&token=" +
                  res.data.token +
                  "&service=" +
                  encodeURIComponent(this.frontoffice) +
                  "%2FpersonalInfo%2Edo";
                // console.log(res.data.token+"///"+url);
                // this.$toast.loading({
                //   message: "即将在新窗口打开.."
                // });
                setTimeout(() => {
                  window.open(url,"_blank");
                }, 200);
              });
            } else {
              this.$router.push({
                path: "/home/UserCenter",
                query: { action: "personalInfo", title: item.btn_text },
              });
            }
          } else if (item.href == "gotoDeposit") {
            this.gotoDeposit();
          } else if (item.href == "gotoWithdrawal") {
            this.gotoWithdrawal();
          } else {
            this.$router.push({
              path: hrefDict[item.href],
            });
          }
        }
      }
    },
    gotoDeposit() {
      this.$bus.$emit("loading", false);

      if (this.isIOS) {
        const data = {
          params: {
            weblinkId: 'PCUI_DEPOSIT',
            platTypeKey: 'webui',
            customerNumber: this.user.loginname,
            password: this.user.pwd
          }
        }
        api.getUserCenterToken(data).then(res => {
          if (res.data.code == 'success') {
            const url = this.frontoffice + '/rgsLogin.rgs?platform=GTS2&testPlatform=mb&lang=zh_CN&token='+res.data.token+'&service=' + encodeURIComponent(this.frontoffice) + '%2FfundDepositOnline%2Edo%3FfundType%3Dnew%26version%3D191%26terminal%3Dios'
            setTimeout(() => {
              this.$bus.$emit("loading", true);
              window.open(url,"_blank")
            }, 500);
          }
        })
      }else{
        this.$router.push({
        path: "/home/UserCenter",
        query: { action: "fund", num: 2, title: "入金"}
      });
      }
    },
    gotoWithdrawal() {
      this.$bus.$emit("loading", false);
      if (this.isIOS) {
        const data = {
          params: {
            weblinkId: 'PCUI_DEPOSIT',
            platTypeKey: 'webui',
            customerNumber: this.user.loginname,
            password: this.user.pwd
          }
        }
        api.getUserCenterToken(data).then(res => {
          if (res.data.code == 'success') {
            const url = this.frontoffice + '/rgsLogin.rgs?platform=GTS2&testPlatform=mb&lang=zh_CN&token='+res.data.token+'&service=' + encodeURIComponent(this.frontoffice) + '%2FfundDrawings%2Edo%3FfundType%3Dnew%26version%3D191%26terminal%3Dios'
            setTimeout(() => {
              this.$bus.$emit("loading", true);
              window.open(url,"_blank")
            }, 500);
          }
        })
      }else{
        this.$router.push({
          path: "/home/UserCenter",
          query: { action: "fund", num: 1, title: "出金"}
        });
      }
    },
    goToMsgBox() {
      console.log(this.loginType);
      if (this.user.loginname) {
        this.$router.push({
          path: "/home/MsgPush",
        });
      } else {
        this.popupVisible = true;
      }
    },
    closePopup() {
      this.popupVisible = false;
    },
    gotoLogin() {
      this.$router.push({
        path: "/login",
      });
    },
  },
  mounted() {},
};
</script>

<style></style>
