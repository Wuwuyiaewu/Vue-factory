<template>
  <div class="modifyPwd headNav">
    <div class="navTitle" v-if="!isApp()">
      <div class="navItem">
        <img
          class="black"
          src="@/assets/images/nav/a_top_return.png"
          @click="backHandler"
        />
        <span>忘记密码</span>
      </div>
    </div>
    <div class="form-box">
      <div class="form-container step1" v-if="step == 1">
        <formInput
          v-for="input in forgetFormInput.step1"
          :key="input.id"
          :id="input.id"
          :name="input.name"
          :type="input.type"
          :label="input.label"
          :placeholder="input.placeholder"
          :maxlength="input.maxlength"
          v-model="forget[input.id]"
          :error="errors[input.id]"
          @input="handleValidateField(input.validation)"
          clearable
          :showPassword="input.showPassword ? input.showPassword : false"
        >
          <template :slot="'getCode'" v-if="input.id == 'verifyCode'">
            <Gtva ref="gt" @verifySuc="getVerifyCode" />
            <span
              class="get-code"
              @click="geetestValidate"
              :class="!phoneVerified ? 'disabled' : ''"
              >{{ verifyCodeBtnText }}</span
            >
          </template>
        </formInput>
        <div class="form-btns flex-h">
          <div class="next-btn btn-primary" @click="submit">下一步</div>
        </div>
      </div>
      <div class="form-container step2" v-if="step == 2">
        <formInput
          v-for="input in forgetFormInput.step2"
          :key="input.id"
          :id="input.id"
          :name="input.name"
          :type="input.type"
          :label="input.label"
          :placeholder="input.placeholder"
          :maxlength="input.maxlength"
          v-model="forget[input.id]"
          :error="errors[input.id]"
          @input="handleValidateField(input.validation)"
          clearable
          :showPassword="input.showPassword ? input.showPassword : false"
        >
          <template :slot="'indicator'" v-if="input.id == 'new'">
            <div class="strength-indicator-container" :class="passwordStrength">
              <div class="strength-indicator">
                <div></div>
                <div></div>
                <div></div>
              </div>
              <span>{{ passwordStrengthMap[passwordStrength] }}</span>
            </div>
          </template>
        </formInput>
        <div class="form-btns flex-h">
          <div class="next-btn btn-disabled" @click="resetForm">重置</div>
          <div class="next-btn btn-primary" @click="submit">
            {{ formSubmitting ? "正在提交资料" : "提交"
            }}<van-loading
              v-if="formSubmitting"
              color="#fff"
              type="spinner"
              size="20"
            />
          </div>
        </div>
        <!-- <div class="forget-or-no-pwd">忘记或没有旧密码</div> -->
      </div>
    </div>
  </div>
</template>

<script>
require("@/assets/css/modifyPwd.css");
import api from "@/plugins/api";
import { debounce } from "@/utils/debounce";
import formInput from "@/view/register/component/formInput.vue";
import validation from "@/view/register/validation";
import Gtva from "@/components/Gtva.vue";
import { isApp, appPasswordResult } from "@/utils/appHybrid";

export default {
  name: "ModifyPwd",
  components: { formInput, Gtva },
  data() {
    return {
      step: 1,
      formSubmitting: false,
      customerNumber: "",
      forget: {
        phone: "",
        verifyCode: "",
        new: "",
        confirm: "",
      },
      forgetFormInput: {
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
          new: {
            id: "new",
            name: "new",
            type: "password",
            label: "新密码",
            placeholder: "请输入新密码",
            maxlength: 16,
            validation: this.checkNewPwd,
            showPassword: true,
          },
          confirm: {
            id: "confirm",
            name: "confirm",
            type: "password",
            label: "确认密码",
            placeholder: "请再次输入新密码",
            maxlength: 16,
            validation: this.checkConfirmPwd,
            showPassword: true,
          },
        },
      },
      errors: {
        phone: "",
        verifyCode: "",
        new: "",
        confirm: "",
      },
      verifyCodeSending: false,
      verifyCodeBtnText: "获取验证码",
      phoneVerified: false,
      verifyCodeVerified: false,
      newPasswordVerified: false,
      confirmPasswordVerified: false,
      passwordStrength: "",
      passwordStrengthMap: {
        weak: "弱",
        moderate: "中等",
        strong: "强",
      },
      isApp: isApp,
    };
  },
  watch: {
    "forget.new": function (newValue, oldValue) {
      this.passwordStrengthCalculation(newValue);
    },
  },
  methods: {
    resetForm() {
      this.forget.new = "";
      this.forget.confirm = "";
    },
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
        mobilePhone: this.forget.phone,
        mobilePhonePrefix: "86",
        isDemo: this.codeType,
      };
      if (!this.phoneVerify(this.forget.phone)) {
        this.errors.phone = "请输入正确的手机号码";
        this.phoneVerified = false;
      } else {
        this.errors.phone = "";
        this.phoneVerified = true;
        // call api to check if related account with the provided mobilePhone exist
        const params = "?mobilePhone=" + this.forget.phone;
        api
          .getCustomerByMobile(params)
          .then((res) => {
            if (res.data.result == "0") {
              this.errors.phone = "";
              this.customerNumber = res.data.iResult.customerNumber;
              this.phoneVerified = true;
            } else {
              // res.data.result == "11" means related account with the provided mobilePhone does not exist
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
      // Extra check for verifyCode if it is previously filled
      if (this.forget.verifyCode != "") {
        this.validateVerifyCode();
      }
    },
    backHandler() {
      if (this.step == 1) {
        this.$router.go(-1);
      } else {
        this.step = 1;
      }
    },
    // 验证密码
    pwdVerify(password) {
      if (password.length < 6) {
        //this.errors.password = "密码的长度必须至少6位数";
        this.passwordStrength = "";
        return false;
      }
      this.passwordStrengthCalculation(password);
      if (this.passwordStrength != "") {
        return true;
      } else {
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
    checkNewPwd() {
      if (this.pwdVerify(this.forget.new)) {
        this.errors.new = "";
        this.newPasswordVerified = true;
      } else {
        this.errors.new = "密碼長度必须在6-16位之間";
        this.newPasswordVerified = false;
      }
    },
    checkConfirmPwd() {
      if (this.forget.confirm != "" && this.forget.confirm == this.forget.new) {
        this.errors.confirm = "";
        this.confirmPasswordVerified = true;
      } else {
        this.errors.confirm = "需与新密码一致";
        this.confirmPasswordVerified = false;
      }
    },
    geetestValidate() {
      if (this.verifyCodeSending) {
        this.$toast("验证码已发出，请稍后再试");
      } else if (this.phoneVerified) {
        this.$refs.gt[0].verify();
      }
    },
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
    getVerifyCode(geetestres) {
      console.log(geetestres);
      const params =
        "?channel=SMS&lang=zh_CN&type=RESET_CUSTOMER_PWD" +
        "&customerNumber=" +
        this.customerNumber +
        "&mobilePhone=" +
        this.forget.phone +
        "&visitorId=" +
        geetestres.visitor_id;
      api.sendResetCustomerPwdVerifyCode(params).then((res) => {
        console.log(res);
        this.$toast(res.data.message);
        if (res.data.result == "0") {
          this.countDown();
        }
      });
    },
    validateVerifyCode() {
      if (this.phoneVerified) {
        const params =
          "?channel=S" +
          "&mobilePhone=" +
          this.forget.phone +
          "&code=" +
          this.forget.verifyCode;
        api.validateVerifyCode(params).then((res) => {
          console.log(res);
          this.$toast(res.data.message);
          if (res.data.result == "0") {
            this.errors.verifyCode = "";
            this.verifyCodeVerified = true;
            return true;
          } else {
            this.errors.verifyCode = res.data.message;
            this.verifyCodeVerified = false;
            return false;
          }
        });
      } else {
        return false;
      }
    },
    async submit() {
      if (!this.formSubmitting) {
        if (this.step == 1) {
          // do some checking here first
          if (this.forget.phone == "") {
            this.$toast("请输入手机号");
          } else if (this.forget.verifyCode == "") {
            this.$toast("请输入验证码");
          } else if (this.errors.phone != "") {
            this.$toast(this.errors.phone);
          } else if (this.errors.verifyCode != "" || !this.verifyCodeVerified) {
            this.$toast(
              this.errors.verifyCode == ""
                ? "验证码未完成验证!"
                : this.errors.verifyCode
            );
          } else {
            // proceed to step 2
            this.step = 2;
          }
        } else {
          // do some checking here
          if (this.forget.new == "") {
            this.$toast("请输入新密码");
          } else if (this.forget.confirm == "") {
            this.$toast("请输入确认密码");
          } else if (this.errors.new != "") {
            this.$toast(this.errors.new);
          } else if (!this.newPasswordVerified) { 
            // user click too fast before the validation is completed => do nothing;
            return;
          } else if (this.errors.confirm != "") {
            this.$toast(this.errors.confirm);
          } else if (!this.confirmPasswordVerified) {
            // user click too fast before the validation is completed => do nothing;
            return;
          } else {
            this.formSubmitting = true;
            // proceed to send the request to api to update password
            const params =
              "?mobilePhone=" +
              this.forget.phone +
              "&newPassword=" +
              this.forget.new;
            api
              .updatePassword(params)
              .then((res) => {
                console.log(res);
                if (res.data.result == "0") {
                  // success
                  this.$toast(res.data.message);

                  if (isApp()) {
                    appPasswordResult(true);
                  } else {
                    this.$router.push({ path: "/Login" });
                  }
                } else {
                  if (res.data.iResult) {
                    this.$toast(
                      res.data.message +
                        ", 原因: " +
                        res.data.iResult.password.message
                    );
                  } else {
                    this.$toast(res.data.message);
                  }

                  this.formSubmitting = false;
                }
              })
              .catch((err) => {
                console.log(err);
                appPasswordResult(false);
                this.formSubmitting = false;
                this.$toast(err.message);
              });
          }
        }
      }
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

<style></style>
