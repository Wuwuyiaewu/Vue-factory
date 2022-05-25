<template>
  <div class="modifyPwd headNav">
    <div class="navTitle">
      <div class="navItem">
        <img
          class="black"
          src="@/assets/images/nav/a_top_return.png"
          @click="backHandler"
        />
        <span>修改密码</span>
      </div>
    </div>
    <div class="form-box">
      <div class="form-container">
        <formInput
          v-for="input in passwordFormInput"
          :key="input.id"
          :id="input.id"
          :name="input.name"
          :type="input.type"
          :label="input.label"
          :placeholder="input.placeholder"
          :maxlength="input.maxlength"
          v-model="password[input.id]"
          :error="errors[input.id]"
          @change="handleValidateField(input.validation)"
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
          <div class="reset-btn btn-disabled" @click="resetForm">重置</div>
          <div class="submit-btn btn-primary" @click="submit">
            {{ formSubmitting ? "正在提交资料" : "提交"
            }}<van-loading
              v-if="formSubmitting"
              color="#fff"
              type="spinner"
              size="20"
            />
          </div>
        </div>
        <div class="forget-or-no-pwd" @click="gotoForgetPwd">
          忘记或没有旧密码
        </div>
      </div>
    </div>
  </div>
</template>

<script>
require("@/assets/css/modifyPwd.css");
import { mapState } from "vuex";
import { debounce } from "@/utils/debounce";
import formInput from "@/view/register/component/formInput.vue";
import validation from "@/view/register/validation";
import api from "@/plugins/api";

export default {
  name: "ModifyPwd",
  components: { formInput },
  data() {
    return {
      password: {
        original: "",
        new: "",
        confirm: "",
      },
      passwordFormInput: {
        original: {
          id: "original",
          name: "original",
          type: "password",
          label: "原密码",
          placeholder: "请输入原密码",
          maxlength: 16,
          validation: this.checkOriginalPwd,
          showPassword: true,
        },
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
      errors: {
        original: "",
        new: "",
        confirm: "",
      },
      passwordStrength: "",
      passwordStrengthMap: {
        weak: "弱",
        moderate: "中等",
        strong: "强",
      },
      formSubmitting: false,
    };
  },
  computed: {
    ...mapState(["user"]),
    accountType() {
      return this.user.loginname &&
        String(this.user.loginname).startsWith("68") &&
        this.user.loginname.length == 8
        ? "real"
        : "demo";
    },
  },
  watch: {
    "password.new": function (newValue, oldValue) {
      this.passwordStrengthCalculation(newValue);
    },
  },
  methods: {
    backHandler() {
      this.$router.go(-1);
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
    checkOriginalPwd() {
      if (this.pwdVerify(this.password.original)) {
        this.errors.original = "";
      } else {
        this.errors.original = "密碼長度必须在6-16位之間";
      }
    },
    checkNewPwd() {
      if (this.pwdVerify(this.password.new)) {
        this.errors.new = "";
      } else {
        this.errors.new = "密碼長度必须在6-16位之間";
      }
    },
    checkConfirmPwd() {
      if (
        this.password.confirm != "" &&
        this.password.confirm == this.password.new
      ) {
        this.errors.confirm = "";
      } else {
        this.errors.confirm = "需与新密码一致";
      }
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
    resetForm() {
      this.password.original = "";
      this.password.new = "";
      this.password.confirm = "";
      // also clear the errors
      this.errors.original = "";
      this.errors.new = "";
      this.errors.confirm = "";
    },
    submit() {
      if (!this.formSubmitting) {
        if (this.password.original == "") {
          this.$toast("请输入原密码");
        } else if (this.password.new == "") {
          this.$toast("请输入新密码");
        } else if (this.password.confirm == "") {
          this.$toast("请输入确认密码");
        } else if (!this.pwdVerify(this.password.original)) {
          this.$toast("原密码不正确");
        } else if (!this.pwdVerify(this.password.new)) {
          this.$toast("新密码不正确");
        } else if (!this.pwdVerify(this.password.confirm)) {
          this.$toast("确认密码不正确");
        } else {
          //formSubmitting
          this.formSubmitting = true;
          //updatePassword?accountType=real&accountNo=68000124&orgPassword=abcd1234&newPassword=a123456
          const params =
            "?accountType=" +
            this.accountType +
            "&accountNo=" +
            this.user.loginname +
            "&orgPassword=" +
            this.password.original +
            "&newPassword=" +
            this.password.new;
          api
            .updatePassword(params)
            .then((res) => {
              console.log(res);
              if (res.data.result == "0") {
                // success
                this.$toast(res.data.message + ", 请使用新密码重新登录");
                // this.$router.push({ path: "/Settings" });
                // const updatedUser = {
                //   ...this.user,
                //   password: this.password.new,
                // };
                // this.$store.dispatch("setUser", updatedUser);
                sessionStorage.setItem("preventUserForceLogout", true);

                setTimeout(() => {
                  const user = {};
                  this.$store.dispatch("setUser", user);
                  sessionStorage.setItem("logoutReload", "/login");
                  this.$router.go(0); // 刷新页面，实现socket重连
                }, 2000);
              } else {
                this.$toast(
                  res.data.message +
                    ", 原因: " +
                    res.data.iResult.password.message
                );
                this.formSubmitting = false;
              }
            })
            .catch((err) => {
              console.log(err);
              this.formSubmitting = false;
              this.$toast(err);
            });
        }
      }
    },
  },
  created() {
    if (sessionStorage.getItem("logoutReload")) {
      this.$router.push({ path: "/Settings" });
    }
  },
};
</script>

<style></style>
