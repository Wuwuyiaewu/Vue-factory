import Vue from "vue";
import "./plugins/axios";
import "./plugins/vueClick";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueAwesomeSwiper from "vue-awesome-swiper";
import Qs from "qs";
import Cookies from "js-cookie";
import VueWechatTitle from "vue-wechat-title";
// import { thisFire } from './plugins/firebase'
import { Toast, Icon, Switch, Checkbox, CheckboxGroup, Progress, Popup, Loading } from "vant";

import "vant/lib/index.css";
import api from "./plugins/api";
import StorageUtil from "./utils/storageUtil";

import {i18n} from '@/lang'

import VantBase from '@/utils/vantBase'
VantBase(Vue)

Vue.use(VueWechatTitle);
Vue.config.productionTip = false;
Vue.prototype.$qs = Qs;
Vue.prototype.$cookie = Cookies;
Vue.prototype.$bus = new Vue();
Vue.use(VueAwesomeSwiper);
Vue.config.productionTip = false;
// Vue.prototype.$fireBase = thisFire
Vue.use(Toast);
Vue.use(Icon);
Vue.use(Switch);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Progress);
Vue.use(Popup);
Vue.use(Loading);
Toast.setDefaultOptions({ duration: 1000 });

new Vue({
  router,
  i18n,
  store,
  render: (h) => h(App),
  async created() {
    const res = await api.getAppProperties();
    // console.log(res);
    this.$store.dispatch("setAppProperties", res.data);
    sessionStorage.setItem("getAppProperties", JSON.stringify(res.data));

    if (this.$store.state.user.loginType) {
      this.$store.dispatch("setLoginType", this.$store.state.user.loginType);
    } else {
      const lastLogin = StorageUtil.readLastLogin();
      if (lastLogin) {
        this.$store.dispatch("setLoginType", "R");
      } else {
        this.$store.dispatch("setLoginType", "G");
      }
    }

    // Read utm related data; If null, only set utm_source=direct, and leave others as null
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;
    sessionStorage.setItem("utm_source", searchParams.get("utm_source") ? searchParams.get("utm_source") : "direct");
    if (searchParams.get("utm_medium")) sessionStorage.setItem("utm_medium", searchParams.get("utm_medium"));
    if (searchParams.get("utm_campaign")) sessionStorage.setItem("utm_campaign", searchParams.get("utm_campaign"));
    if (searchParams.get("utm_content")) sessionStorage.setItem("utm_content", searchParams.get("utm_content"));
    if (searchParams.get("utm_term")) sessionStorage.setItem("utm_term", searchParams.get("utm_term"));

    // Initalize price color type
    const priceColorType = this.$store.state.priceColorType;
    const rootEl = document.querySelector(":root");
    const rootElStyle = getComputedStyle(rootEl);
    rootEl.style.setProperty(
      "--rise-color",
      rootElStyle.getPropertyValue(`--rise-color-${priceColorType}`)
    );
    rootEl.style.setProperty(
      "--fall-color",
      rootElStyle.getPropertyValue(`--fall-color-${priceColorType}`)
    );
    rootEl.style.setProperty(
      "--rise-arrow",
      rootElStyle.getPropertyValue(`--rise-arrow-${priceColorType}`)
    );
    rootEl.style.setProperty(
      "--fall-arrow",
      rootElStyle.getPropertyValue(`--fall-arrow-${priceColorType}`)
    );
    rootEl.style.setProperty(
      "--rise-arrowbold",
      rootElStyle.getPropertyValue(`--rise-arrowbold-${priceColorType}`)
    );
    rootEl.style.setProperty(
      "--fall-arrowbold",
      rootElStyle.getPropertyValue(`--fall-arrowbold-${priceColorType}`)
    );
  },
}).$mount("#main");
