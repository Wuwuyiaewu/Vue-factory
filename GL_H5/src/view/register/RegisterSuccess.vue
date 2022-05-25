<template>
  <div class="register headNav" :style="{ 'min-height': height + 'px' }">
    <div class="navTitle" v-if="!isApp">
      <div class="navItem">
        <img
          class="black"
          src="@/assets/images/nav/a_top_return.png"
          @click="back"
        />
        <span>开户成功</span>
      </div>
    </div>
    <div class="content">
      <div class="header-section">
        <img
          src="@/assets/images/register/register_success.png"
          alt="success-icon"
        />
        <p>以下是你的登入账户信息</p>
        <div class="account-info">
          <p>
            <i class="acc-icon"></i>{{ registerTypeText }}登录账号:
            <span>{{ customerNumber }}</span>
          </p>
          <p>
            <i class="pw-icon"></i>{{ registerTypeText }}登录密码:
            <span>{{ password }}</span>
          </p>
        </div>
        <div class="reminder" v-if="approval_state">
          <img src="@/assets/images/register/bell.png" alt="bell-icon" />
          <p>稍后会有00852开头的客服来电</p>
        </div>
        <div class="spacer" v-else></div>
      </div>
      <div class="banner-section">
        <img
          :src="top_banner.pic"
          alt="top-banner"
          @click="bannerHrefHandler(top_banner)"
        />
        <img
          :src="bottom_banner.pic"
          alt="bottom-banner"
          @click="bannerHrefHandler(bottom_banner)"
        />
      </div>
      <div class="footer-section">
        <div class="web-content" v-if="!isApp">
          <img
            src="@/assets/images/register/web-bg.png"
            alt="web-bg"
            class="web-bg"
          />
          <div class="app-download">
            <img :src="app_download.pic" alt="app-dl-icon" />
            <p v-html="app_download.content"></p>
            <div class="dl-btn" @click="dlBtnHandler(app_download.dl_url)">
              立即下载APP
            </div>
          </div>
        </div>
        <div class="app-content" v-else>
          <div class="footer-header">
            <div class="line"></div>
            <p>三步开启致富大门</p>
            <div class="line"></div>
          </div>
          <div class="steps">
            <div class="step step1">
              <img src="@/assets/images/register/step1.png" alt="step1_image" />
              <p>打开APP</p>
            </div>
            <div class="arrow-next">
              <img
                src="@/assets/images/register/arrow-next.png"
                alt="arrow_next"
              />
            </div>
            <div class="step step2">
              <img src="@/assets/images/register/step2.png" alt="step2_image" />
              <p>体验交易</p>
            </div>
            <div class="arrow-next">
              <img
                src="@/assets/images/register/arrow-next.png"
                alt="arrow_next"
              />
            </div>
            <div class="step step3">
              <img src="@/assets/images/register/step3.png" alt="step3_image" />
              <p v-if="approval_state">入金激活</p>
              <p v-else>创造财富</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Popup
      :visible="demoToRealPopupVisible"
      :title="'提示'"
      :content="'你好！</br>真实账户才能操作, 请先补充资料'"
      :cancelText="'关闭'"
      :continueText="'补充资料'"
      :cancelHandler="closePopup"
      :continueHandler="gotoSuppInfo"
    />
  </div>
</template>

<script>
require("@/assets/css/registerNew.css");
import { isApp, appAccountLogin } from "@/utils/appHybrid";
import hrefDict from "@/utils/apiHrefMap";
import { mapState } from "vuex";
import api from "@/plugins/api";
import Popup from "@/components/ui/Popup.vue";
const u = navigator.userAgent;

export default {
  components: {
    Popup,
  },
  name: "RegisterSuccess",
  data() {
    return {
      approval_state: true,
      height: "",
      registerTypeText: "",
      customerNumber: "",
      password: "",
      u: navigator.userAgent,
      isAndroid: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1,
      isIOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      demoToRealPopupVisible: false,
    };
  },
  computed: {
    ...mapState(["user", "quote"]),
    top_banner() {
      return this.$store.state.appProperties.register
        ? this.$route.query.type == "demo"
          ? this.approval_state
            ? {
                title: "开立真实账户",
                href: "gotoRealAccount",
                other_href: "",
                pic: require("@/assets/images/register/banner_register.png"),
                show: this.$store.state.appProperties.register.success_page
                  .success_banner_first[0].show,
              }
            : {
                title: "体验交易",
                href: "gotoTrade",
                other_href: "",
                pic: require("@/assets/images/register/gm01_banner1.png"),
                show: this.$store.state.appProperties.register.success_page
                  .success_banner_first[0].show,
              }
          : this.$store.state.appProperties.register.success_page
              .success_banner_first[0]
        : "";
    },
    bottom_banner() {
      return this.$store.state.appProperties.register
        ? this.$route.query.type == "demo"
          ? this.approval_state
            ? {
                title: "交易产品即刻体验",
                href: "gotoTrade",
                other_href: "",
                pic: require("@/assets/images/register/banner_gototrade.png"),
                show: this.$store.state.appProperties.register.success_page
                  .success_banner_second[0].show,
              }
            : {
                title: "体验交易",
                href: "gotoTrade",
                other_href: "",
                pic: require("@/assets/images/register/gm01_banner2.png"),
                show: this.$store.state.appProperties.register.success_page
                  .success_banner_second[0].show,
              }
          : this.$store.state.appProperties.register.success_page
              .success_banner_second[0]
        : "";
    },
    isApp() {
      console.log(isApp());
      return isApp();
    },
    app_download() {
      return this.$store.state.appProperties.register
        ? this.$store.state.appProperties.register.success_page
            .success_app_download[0]
        : "";
    },
  },
  methods: {
    back() {
      this.$router.push({ path: "/home" });
    },
    docHeight() {
      this.height = window.innerHeight || document.documentElement.clientHeight;
    },
    bannerHrefHandler(banner) {
      console.log(banner);
      if (this.isApp) {
        const customerInfo = {
          customerNumber: this.customerNumber,
          password: this.password,
          href: banner.href,
          other_href: banner.other_href,
        };
        appAccountLogin(customerInfo);
      } else {
        if (banner.other_href != "") {
          if (banner.href == "gotoOther") {
            let url_text = banner.other_href;
          let url = new URL(banner.other_href);
          let modifier = url.search != "" ? "&" : "?";
          if (!url.searchParams.get("utm_source")) url_text += modifier + "utm_source=" + sessionStorage.getItem("utm_source");
          if (!url.searchParams.get("utm_medium") && sessionStorage.getItem("utm_medium")) url_text += modifier + "utm_medium=" + sessionStorage.getItem("utm_medium");
          if (!url.searchParams.get("utm_campaign") && sessionStorage.getItem("utm_campaign")) url_text += modifier + "utm_campaign=" + sessionStorage.getItem("utm_campaign");
          if (!url.searchParams.get("utm_content") && sessionStorage.getItem("utm_content")) url_text += modifier + "utm_content=" + sessionStorage.getItem("utm_content");
          if (!url.searchParams.get("utm_term") && sessionStorage.getItem("utm_term")) url_text += modifier + "utm_term=" + sessionStorage.getItem("utm_term");
          this.$router.push({
            path: "/home/BannerUrl",
            query: {
              title: banner.title,
              url: url_text,
            },
          });
          } else if (banner.href == "gotoProduct") {
            // console.log(this.quote);
            this.goQuoteChart(
              banner.other_href,
              this.quote.notify[banner.other_href].aushGB
            );
          } else if (banner.href == "gotoArticle") {
            this.$router.push({
              path: "/home/NewsDetail",
              query: {
                title: banner.title,
                articleId: banner.other_href,
              },
            });
          } else {
            // other cases like gotoArticle
            console.log("in gotoArticle");
          }
        } else {
          if (banner.href == "gotoDeposit") {
            this.gotoDeposit();
          } else if (banner.href == "gotoRealAccount") {
            this.handleSwitchAccount();
          } else {
            this.$router.push({
              path: hrefDict[banner.href],
            });
          }
        }
      }
    },
    goQuoteChart(id, name) {
      // this.$firebase.logEvent("click_product", {
      //   platform_type: "cfdwell",
      //   account_type: localStorage.getItem("zsmn"),
      //   source: "首页热门产品",
      //   product_name: name,
      //   time: Util.getThisTime(),
      //   url: window.location.href,
      // });

      this.$bus.$emit("loading", false);
      this.$router.push({
        path: "/home/QuoteChart",
        query: { id: id, view: "index" },
      });
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
    dlBtnHandler(url) {
      window.open(url);
    },
    async login(loginReloadPath) {
      const params =
        "?customerNumber=" + this.customerNumber + "&password=" + this.password;
      const res = await api.loginMIS(params);
      console.log(res);
      if (res.data.result == "0") {
        // Need to do some further processing on the loginType
        let loginType = "";
        if (res.data.accountStatusCode != "") {
          loginType = res.data.accountStatusCode;
        } else {
          if (res.data.customerNumber.startsWith("98")) {
            loginType = "D";
          }
        }
        sessionStorage.setItem("loginType", loginType);
        const user = {
          loginname: res.data.customerNumber,
          pwd: this.password,
          companyId: res.data.companyId,
          uuid: res.data.uuid,
          mobilePhone: res.data.mobilePhone,
          loginType: loginType,
        };
        sessionStorage.setItem("userInfo", JSON.stringify(user));
        // sessionStorage.setItem("loginReload", loginReloadPath);
        // this.$toast("登入成功, 页面即将刷新");
        this.$store.dispatch("setUser", user);
        setTimeout(() => {
          this.$router.go(0); // 刷新页面，实现socket重连
        }, 0);
      } else {
        this.$toast(res.data.message);
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
            this.demoToRealPopupVisible = true;
          } else {
            // failed
            this.$toast(res.data.message);
          }
        })
        .catch((err) => {
          this.$toast(res.data.message);
        });
    },
    closePopup() {
      this.demoToRealPopupVisible = false;
    },
    gotoSuppInfo() {
      this.demoToRealPopupVisible = false;
      this.$router.push({
        path: "/SupplementaryInfo",
      });
    },
  },
  mounted() {
    this.docHeight();

    // Add pre-approved show / hide logic
    if (this.$route.query.app && this.$route.query.app == "gm01") {
      console.log("in gm01 block");
      this.approval_state = false;
    }

    const registerType = this.$route.query.type;
    if (registerType == "demo") {
      this.registerTypeText = "模拟";
    } else {
      this.registerTypeText = "真实";
    }
    this.customerNumber = JSON.parse(
      sessionStorage.getItem("registerResult")
    ).customerNumber;
    this.password = JSON.parse(
      sessionStorage.getItem("registerResult")
    ).password;

    // handle loginReload
    if (!this.isApp && !this.user.loginname) {
      this.login();
    }
  },
};
</script>

<style></style>
