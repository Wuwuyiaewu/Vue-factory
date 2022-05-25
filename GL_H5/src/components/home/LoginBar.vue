<template>
  <div class="login_bar" v-if="loginType == 'G' || loginType =='R'">
    <span>游客</span>
    <span @click="login">点击登录</span>
    <span @click="register">开户</span>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["loginType"]),
  },
  methods: {
    login() {
      this.$router.push({ path: "/Login" });
    },
    register() {
      this.$router.push({ path: "/Register" });
    }
  },
};
</script>

<style>
/* Login Bar */
.login_bar {
  position: fixed;
  z-index: 4;
  bottom: 0.97rem;
  background-color: #fff;
  font-size: 0.32rem;
  height: 0.68rem;
  width: 100%;
  max-width: 750px;
}
.login_bar span {
  font-family: PingFang SC Medium;
  height: 100%;
  line-height: 0.68rem;
  text-align: center;
  display: inline-block;
}
.login_bar span:nth-child(1) {
  color: #fff;
  background-color: #3490ff;
  width: 20%;
}
.login_bar span:nth-child(2) {
  width: 60%;
}
.login_bar span:nth-child(3) {
  width: 20%;
  color: #fff;
  background-color: #fe6a1a;
}
</style>
