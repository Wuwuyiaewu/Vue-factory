<template>
  <div class="pwd-modify-success headNav">
    <div class="navTitle">
      <div class="navItem">
        <img
          class="black"
          src="@/assets/images/nav/a_top_close.png"
          @click="backHandler"
        />
        <span>修改密码</span>
      </div>
    </div>
    <div class="content flex-c">
        <div class="flex-c icon-container">
            <img src="@/assets/images/password/password-changed.png" alt="password-changed-icon" class="password-changed-icon">
            <p>密码修改成功</p>
        </div>
        <div class="login-btn btn-primary" @click="gotoLogin">立即登录</div>
    </div>
  </div>
</template>

<script>
export default {
    name: "PwdModifySuccess",
    methods: {
        backHandler() {
            this.$router.push({ path: "/home" })
        },
        gotoLogin() {
            this.$router.push({ path: "/login" })
        }
    }
};
</script>

<style>
.pwd-modify-success .icon-container {
    margin-top: 2.1rem;
    margin-bottom: 2.1rem;
    font-size: 0.28rem;
    color: #222222;
}
.pwd-modify-success .password-changed-icon {
    width: 1.74rem;
    height: 2.26rem;
    margin-bottom: 0.26rem;
}
</style>
