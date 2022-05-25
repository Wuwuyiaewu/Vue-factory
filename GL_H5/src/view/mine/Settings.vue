<template>
  <div class="settings headNav">
    <div class="navTitle">
      <div class="navItem">
        <img
          class="black"
          src="@/assets/images/nav/a_top_return.png"
          @click="backHandler"
        />
        <span>设置</span>
      </div>
    </div>
    <div class="settings-menu-list flex-c">
      <div
        class="menu-list-item flex-h"
        v-for="(item, index) in menuItems"
        :key="index"
        @click="clickHandler(item.href)"
      >
        <p>{{ item.text }}</p>
        <van-switch
          v-if="item.withToggle"
          v-model="item.checked"
          slot="right-icon"
          size="24"
          inactive-color="#888888"
          active-color="#FE6A1A"
        />
        <van-icon v-else name="arrow" color="#BFBFBF" />
      </div>
    </div>
    <div
      class="logout-btn"
      @click="popupVisible = true"
      v-if="loginType !== 'G' && loginType !== 'R'"
    >
      退出登录
    </div>
    <Popup
      :visible="popupVisible"
      :title="'温馨提示'"
      :content="'确定要退出登录?'"
      :cancelText="'取消'"
      :continueText="'退出登录'"
      :cancelHandler="closePopup"
      :continueHandler="logout"
    />
  </div>
</template>

<script>
require("@/assets/css/settings.css");
import { mapState } from "vuex";
import menuItems from "./SettingsMenu";
import Popup from "@/components/ui/Popup.vue";

export default {
  name: "Settings",
  components: { Popup },
  data() {
    return {
      menuItems: menuItems,
      popupVisible: false,
    };
  },
  computed: {
    ...mapState(["loginType"]),
  },
  methods: {
    backHandler() {
      this.$router.push({ path: "/mine" });
    },
    closePopup() {
      this.popupVisible = false;
    },
    logout() {
      console.log("logout");
      const user = {};
      this.popupVisible = false;
      sessionStorage.setItem("userInfo", JSON.stringify(user));
      this.$toast("登出成功, 页面即将刷新");

      // clear user data
      this.$store.dispatch("setUser", user);

      // set a cache in sessionStorage to signal a router push back to home
      sessionStorage.setItem("logoutReload", true);
      setTimeout(() => {
        this.$router.go(0); // 刷新页面，实现socket重连
      }, 2000);
    },
    clickHandler(href) {
      console.log(href);
      if (href !== "") {
        this.$router.push({
          path: href,
        });
      }
    },
  },
  created() {
    // detech if user have logged out and push to home if true
    const logoutReload = sessionStorage.getItem("logoutReload");
    if (logoutReload) {
      sessionStorage.removeItem("logoutReload");
      // reload to a specific path
      if (logoutReload.startsWith("/")) {
        this.$router.push({ path: logoutReload });
      } else {
        this.$router.push({ path: "/home" });
      }
    }
  },
};
</script>

<style></style>
