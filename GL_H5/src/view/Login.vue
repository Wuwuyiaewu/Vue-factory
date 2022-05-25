<template>
  <div class="login">
    <div id="head">
      <div class="headItem">
        <img
          class="close"
          src="../assets/images/nav/a_top_close.png"
          @click="back"
        />
        <p class="register"><span @click="gotoRegister">开户</span></p>
      </div>
    </div>
    <div class="form-box">
      <h3 class="form-title">登录</h3>
      <div class="form-container">
        <form @submit.prevent>
          <formInput
            :key="loginFormInput.account.id"
            :id="loginFormInput.account.id"
            :name="loginFormInput.account.name"
            :type="loginFormInput.account.type"
            :label="loginFormInput.account.label"
            :placeholder="loginFormInput.account.placeholder"
            :maxlength="loginFormInput.account.maxlength"
            v-model="loginForm['account']"
            :error="errors['account']"
            @input="handleValidateField(loginFormInput.account.validation)"
            clearable
          />
          <formInput
            :key="loginFormInput.password.id"
            :id="loginFormInput.password.id"
            :name="loginFormInput.password.name"
            :type="loginFormInput.password.type"
            :label="loginFormInput.password.label"
            :placeholder="loginFormInput.password.placeholder"
            :maxlength="loginFormInput.password.maxlength"
            v-model="loginForm['password']"
            :error="errors['password']"
            @input="handleValidateField(loginFormInput.password.validation)"
            clearable
            :showPassword="
              loginFormInput.password.showPassword
                ? loginFormInput.password.showPassword
                : false
            "
          />
          <!-- <formInput
          v-if="loginMethod == 'code'"
          :key="loginFormInput.verifyCode.id"
          :id="loginFormInput.verifyCode.id"
          :name="loginFormInput.verifyCode.name"
          :type="loginFormInput.verifyCode.type"
          :label="loginFormInput.verifyCode.label"
          :placeholder="loginFormInput.verifyCode.placeholder"
          :maxlength="loginFormInput.verifyCode.maxlength"
          v-model="loginForm['verifyCode']"
          :error="errors['verifyCode']"
          @change="handleValidateField(loginFormInput.verifyCode.validation)"
          clearable
        >
          <template :slot="'getCode'">
            <span
              class="get-code"
              @click="getVerifyCode"
              :class="!phoneVerified ? 'disabled' : ''"
              >{{ verifyCodeBtnText }}</span
            >
          </template>
        </formInput> -->
          <div class="submit-box">
            <button class="login-btn" @click="login" type="submit">
              {{ formSubmitting ? "正在登录" : "登录"
              }}<van-loading
                v-if="formSubmitting"
                color="#fff"
                type="spinner"
                size="20"
              />
            </button>
          </div>
        </form>
        <div class="alternatives">
          <div>
            <span @click="gotoForgetPwd">忘记密码</span>
            <!-- <span @click="switchLoginMethod" v-if="loginMethod == 'password'"
              >验证码登录</span
            >
            <span @click="switchLoginMethod" v-if="loginMethod == 'code'"
              >密码登录</span
            > -->
          </div>
        </div>
      </div>
    </div>
    <div class="footer-cs" v-if="im_config.show == 'true'">
      <p>如需协助，请联系<span class="link">在线客服</span></p>
    </div>
  </div>
</template>
<script>
require("@/assets/css/loginnew.css");
import api from "@/plugins/api";
import formInput from "@/view/register/component/formInput.vue";
import { mapState } from "vuex";
import Util from "@/utils/tradeDataUtil";
import loginUtil from "@/utils/loginUtil";
import { debounce } from "@/utils/debounce";
import StorageUtil from "@/utils/storageUtil";

export default {
  name: "Login",
  components: { formInput },
  data() {
    const u = navigator.userAgent;
    return {
      // loginMethod: "password", //else code
      loginForm: {
        // localStorage.setItem('user', JSON.stringify({loginname:81017244,pwd:'chj123',companyId:8}))
        /* customerNumber: "81017510",
        password: "a1234567"*/
        account: "",
        password: "",
        verifyCode: "",
      },
      loginFormInput: {
        account: {
          id: "account",
          name: "acount",
          type: "number",
          label: "手机号码 / 账号",
          placeholder: "请输入手机号码 / 账号",
          maxlength: 11,
          validation: this.checkAccount,
        },
        password: {
          id: "password",
          name: "password",
          type: "password",
          label: "密码",
          placeholder: "请输入6-16位密码, 英文字母+数字",
          maxlength: 16,
          validation: this.checkPwd,
          showPassword: true,
        },
        verifyCode: {
          id: "verifyCode",
          name: "verifyCode",
          type: "number",
          label: "验证码",
          placeholder: "请输入验证码",
          maxlength: 6,
          validation: this.validateVerifyCode,
        },
      },
      accountVerified: false,
      errors: {
        account: "",
        password: "",
        verifyCode: "",
      },
      formSubmitting: false,
      verifyCodeBtnText: "获取验证码",
      accountVerified: "",
      acUrl: process.env.VUE_APP_AC,
      frontoffice: process.env.VUE_APP_FRONTOFFICE,
      sign: process.env.VUE_APP_GA_SIGN,
      showPwd: false,
      promptMsg: "",
      showClose: false,
      isAndroid: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1,
      isIOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    };
  },
  computed: {
    ...mapState(["socket", "user"]),
    im_config() {
      return this.$store.state.appProperties.login_page
        ? this.$store.state.appProperties.login_page.im_config
        : "";
    },
    loginIdentifier() {
      let identifier = "";
      if (this.loginForm.account.toString().length <= 9) {
        identifier = "customerNumber";
      } else {
        identifier = "mobilePhone";
      }
      return identifier;
    },
  },
  mounted() {
    this.$bus.$emit("loading", true);
    this.removeFixed();
    // 关闭socket
    if (this.socket.quoteSocket != null) {
      this.socket.quoteSocket.close();
    }
    if (this.socket.tradeSocket != null) {
      this.socket.tradeSocket.close();
    }
  },
  activated() {
    this.$bus.$emit("loading", true);
    this.removeFixed();
    // 关闭socket
    if (this.socket.quoteSocket != null) {
      this.socket.quoteSocket.close();
    }
    if (this.socket.tradeSocket != null) {
      this.socket.tradeSocket.close();
    }
  },
  methods: {
    back() {
      console.log("in back");
      this.$router.go(-1);
    },
    removeFixed() {
      let body;
      if (document.documentElement) {
        body = document.documentElement;
      } else if (document.body) {
        body = document.body;
      }
      const mainH = document.getElementById("main");
      mainH.classList.remove("mainFixed");
      if (body.clientWidth > 750) {
        mainH.style.width = "auto";
        mainH.style.left = 0;
      }
    },
    phoneVerify(phone) {
      var reg = /^(1+\d{10})$/;
      // /^1[3456789]\d{9}$/
      if (reg.test(phone)) {
        return !0;
      } else {
        return !1;
      }
    },
    checkAccount() {
      // console.log("in check account")
      if (this.loginForm.account.toString().length <= 9) {
        // console.log("in check customerNumber");
        this.checkCustomerNumber();
      } else {
        // console.log("in check mobilePhone");
        this.checkPhone();
      }
    },
    checkCustomerNumber() {
      if (
        (this.loginForm.account.startsWith("68") &&
          this.loginForm.account.toString().length == 8) ||
        (this.loginForm.account.startsWith("98") &&
          this.loginForm.account.toString().length == 9)
      ) {
        this.errors.account = "";
        this.accountVerified = true;
      } else {
        console.log(this.loginForm.account.startsWith("98"));
        console.log();
        this.errors.account = "请输入正确的账号";
        this.$toast("账号格式不正确");
        this.accountVerified = false;
      }
    },
    checkPhone() {
      if (!this.phoneVerify(this.loginForm.account)) {
        this.errors.account = "请输入正确的手机号码";
        this.$toast("手机号码格式不正确");
        this.accountVerified = false;
      } else {
        this.errors.account = "";
        this.accountVerified = true;
      }
    },
    // 验证密码
    pwdVerify(password) {
      if (password.length < 6) {
        this.errors.password = "密碼長度必须在6-16位之間";
        this.$toast("密码格式不正确");
        this.passwordStrength = "";
        return false;
      }
      return true;
    },
    checkPwd() {
      if (this.pwdVerify(this.loginForm.password)) {
        this.errors.password = "";
      } else {
        this.errors.password = "密码格式不正确";
      }
    },
    // switchLoginMethod() {
    //   if (this.loginMethod == "password") {
    //     this.loginMethod = "code";
    //   } else {
    //     this.loginMethod = "password";
    //   }
    // },
    async login() {
      console.log("in login");
      if (!this.formSubmitting) {
        this.formSubmitting = true;
        if (this.loginForm.account == "" && document.querySelector("#account").value != "") {
          this.loginForm.account = document.querySelector("#account").value
        }
        if (this.loginForm.password == "" && document.querySelector("#password").value != "") {
          this.loginForm.password = document.querySelector("#password").value
        }
        const params =
          `?${this.loginIdentifier}=` +
          this.loginForm.account +
          "&password=" +
          this.loginForm.password;
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
            pwd: this.loginForm.password,
            companyId: res.data.companyId,
            uuid: res.data.uuid,
            mobilePhone: res.data.mobilePhone,
            loginType: loginType,
          };
          sessionStorage.setItem("userInfo", JSON.stringify(user));
          this.$toast("登入成功, 页面即将刷新");
          this.$store.dispatch("setUser", user);
          this.$store.dispatch("setLoginType", loginType);
          StorageUtil.saveLastLogin();
          setTimeout(() => {
            this.$router.go(0); // 刷新页面，实现socket重连
          }, 2000);
        } else {
          this.$toast(res.data.message);
          this.formSubmitting = false;
        }
      }
    },
    gotoRegister() {
      this.$router.push({ path: "/register" });
    },
    gotoForgetPwd() {
      this.$router.push({ path: "/ForgetPwd" });
    },
    // 表单监听事件change/blur
    handleValidateField(name) {
      return this.debounceValidateField(name);
    },
    debounceValidateField: debounce(function (functionName, ...args) {
      return functionName(...args);
    }, 1000),
  },
};
</script>
