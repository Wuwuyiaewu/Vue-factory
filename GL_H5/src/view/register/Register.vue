<template>
  <div class="register headNav" :style="{ 'min-height': height + 'px' }">
    <div class="navTitle" v-if="!isApp()">
      <div class="navItem">
        <img
          class="black"
          src="@/assets/images/nav/a_top_return.png"
          @click="registerBackHandler"
        />
        <div
          class="login-toggle"
          :class="loginToggleActive ? 'active' : ''"
          @click="loginToggleActive = !loginToggleActive"
        >
          <h3 v-if="registerType == 'real'">真实开户</h3>
          <h3 v-else-if="registerType == 'demo'">模拟开户</h3>
          <!-- <i></i> -->
        </div>
        <p class="login" @click="clickLogin">登录</p>
      </div>
    </div>
    <!-- <transition name="fade">
      <div
        class="login-toggle-menu"
        v-show="loginToggleActive"
        :class="loginToggleActive ? 'active' : ''"
      >
        <h4
          @click="
            registerType = 'demo';
            loginToggleActive = !loginToggleActive;
          "
        >
          模拟开户
        </h4>
        <h4
          @click="
            registerType = 'real';
            loginToggleActive = !loginToggleActive;
          "
        >
          真实开户
        </h4>
      </div>
    </transition> -->
    <div class="content" :class="!isApp() ? '' : 'no-pad'">
      <form @submit.prevent>
        <div class="form-box" v-show="step == 1">
          <div class="banner">
            <img
              v-if="banner && approval_state"
              :src="banner.pic"
              alt="register_banner"
            />
          </div>
          <div class="form-container">
            <formInput
              v-for="input in registerFormInput.step1"
              :key="input.id"
              :id="input.id"
              :name="input.name"
              :type="input.type"
              :label="input.label"
              :placeholder="input.placeholder"
              :maxlength="input.maxlength"
              v-model="register[input.id]"
              :error="errors[input.id]"
              @input="handleValidateField(input.validation)"
              clearable
              :showPassword="input.showPassword ? input.showPassword : false"
            >
              <template :slot="'indicator'" v-if="input.type == 'password'">
                <div
                  class="strength-indicator-container"
                  :class="passwordStrength"
                >
                  <div class="strength-indicator">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <span>{{ passwordStrengthMap[passwordStrength] }}</span>
                </div>
              </template>
              <template :slot="'getCode'" v-else-if="input.id == 'verifyCode'">
                <Gtva ref="gt" @verifySuc="getVerifyCode" />
                <span
                  class="get-code"
                  @click="geetestValidate"
                  :class="
                    !phoneVerified || !passwordVerified || !emailVerified
                      ? 'disabled'
                      : ''
                  "
                  >{{ verifyCodeBtnText }}</span
                >
              </template>
            </formInput>
            <div class="submit-box">
              <button type="submit" class="submit-btn" @click="submit">
                {{
                  registerType == "real" && step == 1
                    ? "下一步"
                    : formSubmitting
                    ? "正在提交资料"
                    : "注册"
                }}<van-loading
                  v-if="formSubmitting"
                  color="#fff"
                  type="spinner"
                  size="20"
                />
              </button>
            </div>
            <div class="agreement">
              <p class="checkbox-text">
                <i
                  :class="register.agreement ? 'checked' : ''"
                  @click="register.agreement = !register.agreement"
                ></i
                >我已满十八岁且已阅读并同意
              </p>
              <p class="agreement-links">
                《客户隐私保护政策、投资风险披露及免责声明》
              </p>
            </div>
            <div class="contact-cs">
              <p>如需协助，请联系<a>在线客服</a></p>
            </div>
          </div>
        </div>
        <div class="supplementary-info" v-show="step == 2">
          <div class="header-section">
            <p>补充资料</p>
            <p class="remind-msg">
              *为保障你的资金安全, 真实交易前必须完善以下资料
            </p>
          </div>
          <div class="account-type-switch">
            <template v-for="(type, index) in accountTypes">
              <div
                class="switch"
                :class="selectedAccountType == index ? 'active' : ''"
                :key="index"
                @click="
                  selectedAccountType = index;
                  register.openAccountType = type.identifier;
                "
              >
                {{ type.name }}
              </div>
              <p v-if="selectedAccountType == index" :key="'p' + index">
                <img
                  src="@/assets/images/register/question.png"
                  alt="question"
                />{{ type.benefit
                }}<span class="threshold"
                  >(最低入金<strong>{{ type.minDeposit }}</strong
                  >美元)</span
                >
              </p>
            </template>
          </div>
          <div class="form-container">
            <formInput
              :key="registerFormInput.step2.name.id"
              :id="registerFormInput.step2.name.id"
              :name="registerFormInput.step2.name.name"
              :type="registerFormInput.step2.name.type"
              :label="registerFormInput.step2.name.label"
              :placeholder="registerFormInput.step2.name.placeholder"
              :maxlength="registerFormInput.step2.name.maxlength"
              v-model="register['name']"
              clearable
            />
            <formInput
              :key="registerFormInput.step2.idCardNo.id"
              :id="registerFormInput.step2.idCardNo.id"
              :name="registerFormInput.step2.idCardNo.name"
              :type="registerFormInput.step2.idCardNo.type"
              :label="registerFormInput.step2.idCardNo.label"
              :placeholder="registerFormInput.step2.idCardNo.placeholder"
              :maxlength="registerFormInput.step2.idCardNo.maxlength"
              v-model="register['idCardNo']"
              :error="errors['idCardNo']"
              @input="
                handleValidateField(registerFormInput.step2.idCardNo.validation)
              "
              clearable
            />
            <div class="submit-box">
              <button class="submit-btn" @click="submit">
                {{ formSubmitting ? "正在提交资料" : "完成开户"
                }}<van-loading
                  v-if="formSubmitting"
                  color="#fff"
                  type="spinner"
                  size="20"
                />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="quit-popup-container" v-if="showQuitPopup">
      <div class="quit-popup-content">
        <img src="@/assets/images/register/quit_icon.png" alt="quit_icon" />
        <p v-html="quit_content"></p>
        <div class="btns-box">
          <span class="quit" @click="back">放弃</span>
          <span class="continue" @click="showQuitPopup = false">继续开户</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

require("@/assets/css/registerNew.css");
require("@/assets/css/supplementaryInfo.css");
import formInput from "./component/formInput.vue";
import VerifyCode from "@/components/VerifyCode.vue";
import Tab from "@/components/Tab.vue";
import api from "@/plugins/api";
import Util from "@/utils/tradeDataUtil";
import validation from "./validation";
import { debounce } from "@/utils/debounce";
import { isApp, appRegisterStatus } from "@/utils/appHybrid";
import Gtva from "@/components/Gtva.vue";

export default {
  name: "Register",
  components: { Tab, formInput, Gtva },
  computed: {
    ...mapState(["urlQuery"]),
  },
  data() {
    return {
      approval_state: true,
      query_app: "",
      step: 1,
      loginToggleActive: false,
      showQuitPopup: false,
      registerType: "real",
      utils: Util,
      height: "",
      showPwd: false,
      isPicClose: false,
      codeType: false,
      phoneVerified: false,
      passwordVerified: false,
      emailVerified: false,
      idCardVerified: false,
      verifyCodeSending: false,
      verifyCodeBtnText: "获取验证码",
      timer: null,
      register: {
        phone: "",
        password: "",
        email: "",
        verifyCode: "",
        agreement: false,
        openAccountType: "MIN",
        name: "",
        idCardNo: "",
      },
      registerFormInput: {
        step1: {
          phone: {
            id: "phone",
            name: "phone",
            type: "number",
            label: "手机号码",
            placeholder: "请输入手机号码",
            maxlength: 11,
            validation: this.checkPhone,
          },
          password: {
            id: "password",
            name: "password",
            type: "password",
            label: "密码",
            placeholder: "请设置6-16位密码, 英文字母+数字",
            maxlength: 16,
            validation: this.checkPwd,
            showPassword: true,
          },
          email: {
            id: "email",
            name: "email",
            type: "email",
            label: "电子邮箱",
            placeholder: "请输入电子邮箱",
            maxlength: 99,
            validation: this.checkEmail,
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
        step2: {
          name: {
            id: "name",
            name: "name",
            type: "text",
            label: "真实姓名",
            placeholder: "请输入您的真实姓名",
            maxlength: 10,
          },
          idCardNo: {
            id: "idCardNo",
            name: "idCardNo",
            type: "text",
            label: "身份证号",
            placeholder: "因监管要求，请输入您的真实身份证号",
            maxlength: 18,
            validation: this.checkIdCardNo,
          },
        },
      },
      errors: {
        phone: "",
        password: "",
        email: "",
        verifyCode: "",
        idCardNo: "",
      },
      phoneTxt: "",
      pwdTxt: "",
      passwordStrength: "",
      passwordStrengthMap: {
        weak: "弱",
        moderate: "中等",
        strong: "强",
      },
      accountTypes: [
        {
          name: "标准",
          identifier: "MIN",
          benefit: "入金门栏最低, 85%用户首选",
          minDeposit: 200,
        },
        {
          name: "进阶",
          identifier: "STD",
          benefit: "点差直降38%, 尊享更多优惠活动",
          minDeposit: 1000,
        },
        {
          name: "专业",
          identifier: "VIP",
          benefit: "点差直降46%, 尊享最低成本",
          minDeposit: 5000,
        },
      ],
      selectedAccountType: 0,
      privacyUrl: process.env.VUE_APP_PRIVACY_URL,
      isApp: isApp,
      formSubmitting: false,
    };
  },
  watch: {
    "register.password": function (newValue, oldValue) {
      this.passwordStrengthCalculation(newValue);
    },
  },
  computed: {
    banner() {
      return this.$store.state.appProperties.register
        ? this.$store.state.appProperties.register.banner[0]
        : "";
    },
    quit_content() {
      return this.$store.state.appProperties.register
        ? this.$store.state.appProperties.register.quit_register_context[0]
            .content
        : "";
    },
  },
  mounted() {
    if (this.$route.query.type) {
      this.registerType = this.$route.query.type;
    }
    if (this.$route.query.app && this.$route.query.app == "gm01") {
      this.approval_state = false;
      this.query_app = "gm01";
    }
    if (localStorage.getItem("demoRegisterData")) {
      const demoRegisterData = JSON.parse(
        localStorage.getItem("demoRegisterData")
      );
      this.register.phone = demoRegisterData.phone;
      this.register.password = demoRegisterData.password;
      this.register.email = demoRegisterData.email;

      // Manually set these values to true to enable the SendVerifyCode Button
      this.phoneVerified = true;
      this.passwordVerified = true;
      this.emailVerified = true;

      // Remove the data after it is used
      localStorage.removeItem("demoRegisterData");
    }

    console.log(this.$route.query);

    // clear saved phone and password from login form
    // setTimeout(() => {
    //   console.log(
    //     document.querySelectorAll("input").forEach((el) => console.dir(el))
    //   );
    // }, 2000);

    this.removeFixed();
    this.docHeight();
  },
  activated() {
    this.removeFixed();
    this.docHeight();
  },
  methods: {
    getVerifyCode(geetestres) {
      console.log(geetestres);
      const params =
        "?openAccType=" +
        this.registerType +
        "&channel=S" +
        "&chineseName=" +
        this.register.name +
        "&email=" +
        this.register.email +
        "&mobilePhone=" +
        this.register.phone +
        "&visitorId=" +
        geetestres.visitor_id;
      api.getVerifyCode(params).then((res) => {
        console.log(res);
        this.$toast(res.data.message);
        if (res.data.result == "0") {
          this.countDown();
        }
      });
    },
    back() {
      this.$router.go(-1);
    },
    docHeight() {
      this.height = window.innerHeight || document.documentElement.clientHeight;
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
    togglePwd() {
      this.showPwd = !this.showPwd;
    },
    resetAccount() {
      this.register.phone = "";
    },
    onMouseOver() {
      this.isPicClose = true;
    },
    onMouseOut() {
      this.isPicClose = false;
    },
    changeCode(code) {
      this.register.code = code;
    },
    validationSwitch(value) {},
    // 验证手机号码
    phoneVerify(phone) {
      var reg = /^(1+\d{10})$/;
      // /^1[3456789]\d{9}$/
      if (reg.test(phone)) {
        return !0;
      } else {
        return !1;
      }
    },
    checkPhone() {
      const data = {
        mobilePhone: this.register.phone,
        mobilePhonePrefix: "86",
        isDemo: this.codeType,
      };
      if (!this.phoneVerify(this.register.phone)) {
        this.errors.phone = "请输入正确的手机号码";
        this.phoneVerified = false;
      } else {
        // call api to check if phone is already registered
        const params = "?mobilePhone=" + this.register.phone;
        if (this.registerType == "demo") {
          api
            .checkDemoContainActivateMobile(params)
            .then((res) => {
              if (res.data.result == "0") {
                this.errors.phone = "";
                this.phoneVerified = true;
              } else {
                // res.data.result == "11" means the phone has already been registered
                this.$toast(res.data.message);
                this.errors.phone = res.data.message;
                this.phoneVerified = false;
              }
            })
            .catch((err) => {
              console.log(err);
              this.$toast(err);
            });
        } else {
          api
            .checkContainActivateMobile(params)
            .then((res) => {
              if (res.data.result == "0") {
                this.errors.phone = "";
                this.phoneVerified = true;
              } else {
                // res.data.result == "11" means the phone has already been registered
                this.$toast(res.data.message);
                this.errors.phone = res.data.message;
                this.phoneVerified = false;
              }
            })
            .catch((err) => {
              console.log(err);
              this.$toast(err);
            });
        }
      }
      // Extra check for verifyCode if it is previously filled
      if (this.register.verifyCode != "") {
        this.validateVerifyCode();
      }
    },
    // 验证密码
    pwdVerify(password) {
      if (password.length < 6) {
        this.errors.password = "密码的长度必须至少6位数";
        this.passwordStrength = "";
        this.passwordVerified = false;
        return false;
      }
      this.passwordStrengthCalculation(password);
      if (this.passwordStrength != "") {
        this.passwordVerified = true;
        return true;
      } else {
        this.passwordVerified = false;
        return false;
      }
    },
    passwordStrengthCalculation(password) {
      if (password.length >= 6) {
        if (
          validation.containsUpperCase(password) &&
          validation.containsLowerCase(password) &&
          validation.containsNumber(password)
        ) {
          this.passwordStrength = "strong";
        } else {
          let matchedValidation = 0;
          if (validation.containsUpperCase(password)) {
            matchedValidation++;
          }
          if (validation.containsLowerCase(password)) {
            matchedValidation++;
          }
          if (validation.containsNumber(password)) {
            matchedValidation++;
          }
          if (matchedValidation == 0) {
            this.passwordStrength = "";
          } else if (matchedValidation == 1) {
            this.passwordStrength = "weak";
          } else {
            this.passwordStrength = "moderate";
          }
        }
      } else {
        this.passwordStrength = "";
      }
      return this.passwordStrength;
    },
    checkPwd() {
      if (this.pwdVerify(this.register.password)) {
        this.errors.password = "";
      } else {
        this.errors.password = "密碼長度必须在6-16位之間";
      }
    },
    checkEmail() {
      if (validation.isEmailAddress(this.register.email)) {
        // call api to check if email is already registerd
        const params = "?email=" + this.register.email;
        api
          .checkContainActivateEmail(params)
          .then((res) => {
            if (res.data.result == "0") {
              this.errors.email = "";
              this.emailVerified = true;
            } else {
              // res.data.result == "11" i.e. email has already been registered;
              this.$toast(res.data.message);
              this.errors.email = res.data.message;
              this.emailVerified = false;
            }
          })
          .catch((err) => {
            console.log(err);
            this.emailVerified = false;
            this.$toast(err);
          });
      } else {
        this.emailVerified = false;
        this.errors.email = "电子邮箱格式不正确";
      }
    },
    checkIdCardNo() {
      // validation logic
      // 函数参数必须是字符串，因为二代身份证号码是十八位，而在javascript中，十八位的数值会超出计算范围，造成不精确的结果，导致最后两位和计算的值不一致，从而该函数出现错误。
      // 详情查看javascript的数值范围
      // 加权因子
      var weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      // 校验码
      var check_code = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];

      var code = this.register.idCardNo + "";
      var last = this.register.idCardNo[17]; //最后一位

      var seventeen = code.substring(0, 17);

      // ISO 7064:1983.MOD 11-2
      // 判断最后一位校验码是否正确
      var arr = seventeen.split("");
      var len = arr.length;
      var num = 0;
      for (var i = 0; i < len; i++) {
        num = num + arr[i] * weight_factor[i];
      }

      // 获取余数
      var resisue = num % 11;
      var last_no = check_code[resisue];

      // 格式的正则
      // 正则思路
      /*
        第一位不可能是0
        第二位到第六位可以是0-9
        第七位到第十位是年份，所以七八位为19或者20
        十一位和十二位是月份，这两位是01-12之间的数值
        十三位和十四位是日期，是从01-31之间的数值
        十五，十六，十七都是数字0-9
        十八位可能是数字0-9，也可能是X
        */
      var idcard_patter =
        /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;

      // 判断格式是否正确
      var format = idcard_patter.test(this.register.idCardNo);

      // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
      var result = last === last_no && format ? true : false;
      if (!result) {
        this.$toast("身份证号不正确");
        this.errors.idCardNo = "身份证号不正确";
      } else {
        // call api to check if id card no is already registered
        const params = "?idDocumentNumber=" + this.register.idCardNo;
        api
          .checkContainActivateID(params)
          .then((res) => {
            if (res.data.result == "0") {
              this.errors.idCardNo = "";
              this.idCardVerified = true;
            } else {
              // res.data.result == "11" i.e. ID has already been registered
              this.$toast(res.data.message);
              this.errors.idCardNo = res.data.message;
              this.idCardVerified = false;
            }
          })
          .catch((err) => {
            console.log(err);
            this.$toast(err);
          });
      }
      return result;
    },
    clickLogin() {
      this.$router.push({ path: "/Login" });
    },
    // 表单监听事件change/blur
    handleValidateField(name) {
      return this.debounceValidateField(name);
    },
    debounceValidateField: debounce(function (functionName, ...args) {
      return functionName(...args);
    }, 1000),
    countDown() {
      if (!this.verifyCodeSending) {
        this.verifyCodeSending = true;
        let time = 60;
        let vm = this;
        vm.timer = setInterval(() => {
          if (time == 0) {
            clearInterval(vm.timer);
            vm.verifyCodeSending = false;
            vm.verifyCodeBtnText = "获取验证码";
          } else {
            vm.verifyCodeBtnText = `(${time}S) 重新发送`;
            time--;
          }
        }, 1000);
      }
    },
    geetestValidate() {
      if (this.verifyCodeSending) {
        this.$toast("验证码已发出，请稍后再试");
      } else if (
        this.phoneVerified &&
        this.passwordVerified &&
        this.emailVerified
      ) {
        this.$refs.gt[0].verify();
      }
    },
    validateVerifyCode() {
      if (this.phoneVerified && this.passwordVerified && this.emailVerified) {
        const params =
          "?mobilePhone=" +
          this.register.phone +
          "&code=" +
          this.register.verifyCode;
        api.validateVerifyCode(params).then((res) => {
          console.log(res);
          this.$toast(res.data.message);
          if (res.data.result == "0") {
            this.errors.verifyCode = "";
            return true;
          } else {
            this.errors.verifyCode = res.data.message;
            return false;
          }
        });
      } else {
        return false;
      }
    },
    submit() {
      if (!this.formSubmitting) {
        if (this.step == 1) {
          // check form, if ok then proceed to step 2
          if (this.register.phone == "") {
            this.$toast("请输入手机号");
          } else if (this.register.password == "") {
            this.$toast("请输入密码");
          } else if (this.register.email == "") {
            this.$toast("请输入电子邮箱");
          } else if (this.register.verifyCode == "") {
            this.$toast("请输入验证码");
          } else if (!this.register.agreement) {
            this.$toast("请同意条款");
          } else if (this.errors.phone != "") {
            this.$toast(this.errors.phone);
          } else if (
            !this.pwdVerify(this.register.password) ||
            !this.passwordVerified
          ) {
            this.$toast("密码不正确");
          } else if (this.errors.email != "") {
            this.$toast(this.errors.email || !this.emailVerified);
          } else if (this.errors.verifyCode != "") {
            this.$toast(this.errors.verifyCode);
          } else {
            // Register Type = Demo
            if (this.registerType == "demo") {
              this.formSubmitting = true;
              const params =
                "?mobilePhone=" +
                this.register.phone +
                "&password=" +
                this.register.password +
                "&email=" +
                this.register.email +
                "&utm_source=" +
                (this.$route.query.utm_source
                  ? this.$route.query.utm_source
                  : sessionStorage.getItem("utm_source")) +
                "&utm_medium=" +
                (this.$route.query.utm_medium
                  ? this.$route.query.utm_medium
                  : sessionStorage.getItem("utm_medium")
                  ? sessionStorage.getItem("utm_medium")
                  : "") +
                "&utm_campaign=" +
                (this.$route.query.utm_campaign
                  ? this.$route.query.utm_campaign
                  : sessionStorage.getItem("utm_campaign")
                  ? sessionStorage.getItem("utm_campaign")
                  : "") +
                "&utm_content=" +
                (this.$route.query.utm_content
                  ? this.$route.query.utm_content
                  : sessionStorage.getItem("utm_content")
                  ? sessionStorage.getItem("utm_content")
                  : "") +
                "&utm_term=" +
                (this.$route.query.utm_term
                  ? this.$route.query.utm_term
                  : sessionStorage.getItem("utm_term")
                  ? sessionStorage.getItem("utm_term")
                  : "");
              api
                .openDemoGTS2Account(params)
                .then((res) => {
                  console.log(res);
                  if (res.data.value.result == "0") {
                    // cache returned GTS2 ID and password for later use
                    const result = res.data.value.iResult;
                    console.log(result);
                    const customerNumber = result.customerNumber;
                    const password = result.password;
                    sessionStorage.setItem(
                      "registerResult",
                      JSON.stringify({
                        customerNumber,
                        password,
                        mobilePhone: this.register.phone,
                      })
                    );

                    // Cache the Customer Data for the first banner in success page which would direct users back here
                    // to register real account
                    const demoRegisterData = {
                      phone: this.register.phone,
                      password: this.register.password,
                      email: this.register.email,
                    };
                    localStorage.setItem(
                      "demoRegisterData",
                      JSON.stringify(demoRegisterData)
                    );
                    // send register status to ios app for further handling, only required for ios at the moment
                    if (isApp()) {
                      appRegisterStatus({ openacc: true });
                    }

                    if (this.approval_state) {
                      this.$router.push({
                        path: "/RegisterSuccess",
                        query: { type: this.registerType },
                      });
                    } else {
                      this.$router.push({
                        path: "/RegisterSuccess",
                        query: { type: this.registerType, app: this.query_app },
                      });
                    }
                  } else {
                    this.$toast(res.data.value.iResult.message);
                    this.formSubmitting = false;
                  }
                })
                .catch((err) => {
                  console.log(err);

                  // send register status to ios app for further handling, only required for ios at the moment
                  if (isApp()) {
                    appRegisterStatus({ openacc: false });
                  }

                  this.$router.push({
                    path: "/RegisterFail",
                  });
                });
            } else {
              this.step = 2;
            }
          }
        } else if (this.step == 2) {
          // check step 2 data, then call register api
          if (this.register.name == "") {
            this.$toast("请输入真实姓名");
          } else if (this.register.idCardNo == "") {
            this.$toast("请输入身份证号");
          } else if (this.errors.idCardNo != "" || !this.idCardVerified) {
            this.$toast(
              this.errors.idCardNo != ""
                ? this.errors.idCardNo
                : "请等待身份证号验证"
            );
          } else {
            this.formSubmitting = true;
            const params =
              "?mobilePhone=" +
              this.register.phone +
              "&password=" +
              this.register.password +
              "&idDocumentNumber=" +
              this.register.idCardNo +
              "&email=" +
              this.register.email +
              "&accountLevel=" +
              this.register.openAccountType +
              "&chineseName=" +
              this.register.name +
              "&code=" +
              this.register.verifyCode +
              "&utm_source=" +
              (this.$route.query.utm_source
                ? this.$route.query.utm_source
                : sessionStorage.getItem("utm_source")) +
              "&utm_medium=" +
              (this.$route.query.utm_medium
                ? this.$route.query.utm_medium
                : sessionStorage.getItem("utm_medium")
                ? sessionStorage.getItem("utm_medium")
                : "") +
              "&utm_campaign=" +
              (this.$route.query.utm_campaign
                ? this.$route.query.utm_campaign
                : sessionStorage.getItem("utm_campaign")
                ? sessionStorage.getItem("utm_campaign")
                : "") +
              "&utm_content=" +
              (this.$route.query.utm_content
                ? this.$route.query.utm_content
                : sessionStorage.getItem("utm_content")
                ? sessionStorage.getItem("utm_content")
                : "") +
              "&utm_term=" +
              (this.$route.query.utm_term
                ? this.$route.query.utm_term
                : sessionStorage.getItem("utm_term")
                ? sessionStorage.getItem("utm_term")
                : "");
            api
              .openGTS2Account(params)
              .then((res) => {
                console.log(res);

                if (res.data.result == "0") {
                  // cache returned GTS2 ID and password for later use
                  const result = JSON.parse(res.data.iResult);
                  console.log(result);
                  const customerNumber = result.customerNumber || result.GTS2;
                  const password = result.password;
                  sessionStorage.setItem(
                    "registerResult",
                    JSON.stringify({
                      customerNumber,
                      password,
                      mobilePhone: this.register.phone,
                    })
                  );

                  // send register status to ios app for further handling, only required for ios at the moment
                  if (isApp()) {
                    appRegisterStatus({ openacc: true });
                  }

                  if (this.approval_state) {
                    this.$router.push({
                      path: "/RegisterSuccess",
                      query: { type: this.registerType },
                    });
                  } else {
                    this.$router.push({
                      path: "/RegisterSuccess",
                      query: { type: this.registerType, app: this.query_app },
                    });
                  }
                } else {
                  this.$toast(res.data.message);
                  this.formSubmitting = false;
                }
              })
              .catch((err) => {
                console.log(err);

                // send register status to ios app for further handling, only required for ios at the moment
                if (isApp()) {
                  appRegisterStatus({ openacc: false });
                }

                this.$router.push({
                  path: "/RegisterFail",
                });
              });
          }
        }
      }
    },
    registerBackHandler() {
      if (this.step == 1) {
        this.showQuitPopup = true;
      } else {
        this.step = 1;
      }
    },
  },
};
</script>
