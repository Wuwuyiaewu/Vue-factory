<template>
  <div id="main">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" v-wechat-title="title" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" v-wechat-title="title" />
    <loading />
    <AlertPopup />
    <div id="login-type" style="display: none">{{ loginType }}</div>
  </div>
</template>
<script>
require("./assets/css/template.css");
import loading from "@/view/Loading";
import AlertPopup from "@/view/AlertPopup";
export default {
  components: { loading, AlertPopup },
  data() {
    return {
      title: process.env.VUE_APP_TITLE_TEXT,
      offlinePop: false,
    };
  },
  computed: {
    loginType() {
      return this.$store.state.loginType ? this.$store.state.loginType : "";
    },
  },
};

window.onload = function () {
  document.addEventListener("touchstart", function (event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  });
  document.addEventListener("gesturestart", function (event) {
    event.preventDefault();
  });
};
</script>
