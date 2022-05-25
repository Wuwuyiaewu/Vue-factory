<template>
  <div>
    <!--被下线-->
    <!-- <div v-if="offlinePop" class="popFixed">
      <div class="masking" />
      <div class="tcCon">
        <div class="item">
          <span>提示</span>
          <p>对不起，账户已在其他设备登入!</p>
        </div>
        <div class="btnCon only">
          <span @click="goLogin">重新登录</span>
        </div>
      </div>
    </div> -->
    <Popup
      :visible="offlinePop"
      :title="'提示'"
      :content="'对不起，账户已在其他设备登入!'"
      :cancelText="'取消'"
      :continueText="'立即登录'"
      :cancelHandler="closePopup"
      :continueHandler="goLogin"
    />

    <!--服务器断开连接-->
    <!-- <div
      v-if="
        ((initTrade &&
          user.loginname &&
          socket.tradeSocket &&
          !socket.tradeSocket.connected) ||
          (initQuote && socket.quoteSocket && !socket.quoteSocket.connected)) &&
          !$route.meta.serverLink
      "
      class="popFixed"
    >
      <div class="masking" />
      <div class="tcCon">
        <div class="item">
          <span>提示</span>
          <p>网络消化不良，请刷新您的网络</p>
        </div>
        <div class="btnCon only">
          <span @click="Refresh">重新加载</span>
        </div>
      </div>
    </div> -->
    <!--登录失败-->
    <!-- <div v-if="loginFailed" class="popFixed">
      <div class="masking" />
      <div class="tcCon">
        <div class="item">
          <span>提示</span>
          <p>{{ errMessage }}</p>
        </div>
        <div class="btnCon only">
          <span @click="loginFailed = false">关闭</span>
          <span @click="goLogin">重新登录</span>
        </div>
      </div>
    </div> -->
    <Popup
      :visible="loginFailed"
      :title="'提示'"
      :content="errMessage"
      :cancelText="'关闭'"
      :continueText="'重新登录'"
      :cancelHandler="closePopup"
      :continueHandler="goLogin"
    />
  </div>
</template>

<script>
import Popup from "@/components/ui/Popup.vue";

export default {
  name: "AlertPopup",
  components: {
    Popup,
  },
  data() {
    return {
      offlinePop: false,
      loginFailed: false,
      errMessage: "",
    };
  },
  methods: {
    goLogin() {
      this.offlinePop = false;
      this.loginFailed = false;
      this.removeFixed();
      sessionStorage.setItem("logoutReload", "/login");
      this.$router.go(0); // 刷新页面，实现socket重连
    },
    removeFixed() {
      const mainH = document.getElementById("main");
      mainH.classList.remove("mainFixed");
    },
    closePopup() {
      if (this.offlinePop) {
        this.offlinePop = false;
        // refresh the page to disconnect from the websocket
        this.$router.go(0);
      } else {
        this.loginFailed = false;
      }
    },
  },
  created() {
    this.$bus.$on("offlinePop", (data) => {
      if (sessionStorage.getItem("preventUserForceLogout")) {
        sessionStorage.removeItem("preventUserForceLogout")
        return;
      }
      this.offlinePop = !data;
    });
    this.$bus.$on("loginFailed", (data, errMessage) => {
      this.loginFailed = !data;
      // this.errMessage = errMessage;
      this.errMessage = "服务器断线";
    });

    // detect if user have logged out and push to home if true
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
  beforeDestroy() {
    this.$bus.$off("offlinePop", (data) => {
      this.offlinePop = data;
    });
    this.$bus.$off("loginFailed", (data, errMessage) => {
      this.loginFailed = data;
      this.errMessage = "";
    });
  },
};
</script>

<style></style>
