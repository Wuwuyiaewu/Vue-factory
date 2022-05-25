<template>
  <div class="supplementary-info headNav">
    <div class="navTitle" v-if="!isApp()">
      <div class="navItem">
        <img
          class="black"
          src="@/assets/images/nav/a_top_return.png"
          @click="back"
        />
        <span>补充资料</span>
      </div>
    </div>
    <div class="content">
      <div class="header-section">
        <!-- <p>补充资料</p> -->
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
              suppInfo.openAccountType = type.identifier;
            "
          >
            {{ type.name }}
          </div>
          <p v-if="selectedAccountType == index" :key="'p' + index">
            <img src="@/assets/images/register/question.png" alt="question" />{{
              type.benefit
            }}<span class="threshold"
              >(最低入金<strong>{{ type.minDeposit }}</strong
              >美元)</span
            >
          </p>
        </template>
      </div>
      <div class="form-container">
        <form @submit.prevent>
          <formInput
            :key="suppFormInput.name.id"
            :id="suppFormInput.name.id"
            :name="suppFormInput.name.name"
            :type="suppFormInput.name.type"
            :label="suppFormInput.name.label"
            :placeholder="suppFormInput.name.placeholder"
            :maxlength="suppFormInput.name.maxlength"
            v-model="suppInfo['name']"
            clearable
          />
          <formInput
            :key="suppFormInput.idCardNo.id"
            :id="suppFormInput.idCardNo.id"
            :name="suppFormInput.idCardNo.name"
            :type="suppFormInput.idCardNo.type"
            :label="suppFormInput.idCardNo.label"
            :placeholder="suppFormInput.idCardNo.placeholder"
            :maxlength="suppFormInput.idCardNo.maxlength"
            v-model="suppInfo['idCardNo']"
            :error="errors['idCardNo']"
            @input="handleValidateField(suppFormInput.idCardNo.validation)"
            clearable
          />
          <div class="submit-box">
            <button class="submit-btn" @click="submit" type="submit">
              {{ formSubmitting ? "正在提交资料" : "提交"
              }}<van-loading
                v-if="formSubmitting"
                color="#fff"
                type="spinner"
                size="20"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
require("@/assets/css/supplementaryInfo.css");
import formInput from "./component/formInput.vue";
import { isApp, appRegisterResult } from "@/utils/appHybrid";
import { debounce } from "@/utils/debounce";
import api from "@/plugins/api";
import { mapState } from "vuex";

export default {
  name: "SupplementaryInfo",
  components: { formInput },
  data() {
    return {
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
      suppFormInput: {
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
          validation: () => this.checkIdCardNo(this.suppInfo.idCardNo),
        },
      },
      suppInfo: {
        openAccountType: "MIN",
        name: "",
        idCardNo: "",
      },
      errors: {
        idCardNo: "",
      },
      isApp: isApp,
      idCardVerified: false,
      formSubmitting: false,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    checkIdCardNo(idCardNo) {
      // validation logic
      // 函数参数必须是字符串，因为二代身份证号码是十八位，而在javascript中，十八位的数值会超出计算范围，造成不精确的结果，导致最后两位和计算的值不一致，从而该函数出现错误。
      // 详情查看javascript的数值范围
      // 加权因子
      var weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      // 校验码
      var check_code = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];

      var code = idCardNo + "";
      var last = idCardNo[17]; //最后一位

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
      var format = idcard_patter.test(idCardNo);

      // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
      var result = last === last_no && format ? true : false;
      if (!result) {
        this.$toast("身份证号不正确");
        this.errors.idCardNo = "身份证号不正确";
      } else {
        // call api to check if id card no is already registered
        const params = "?idDocumentNumber=" + idCardNo;
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
    // 表单监听事件change/blur
    handleValidateField(name) {
      return this.debounceValidateField(name);
    },
    debounceValidateField: debounce(function (functionName) {
      return functionName();
    }, 1000),
    submit() {
      if (!this.formSubmitting) {
        // check validity of form data first
        if (this.suppInfo.openAccountType == "") {
          this.$toast("请选择账户类型");
        } else if (this.suppInfo.name == "") {
          this.$toast("请输入真实姓名");
        } else if (this.suppInfo.idCardNo == "") {
          this.$toast("请输入身份证号");
        } else if (this.errors.idCardNo != "" || !this.idCardVerified) {
          this.$toast(
            this.errors.idCardNo != ""
              ? this.errors.idCardNo
              : "请等待身份证号验证"
          );
        } else {
          this.formSubmitting = true;
          // proceed to submit form data
          const params =
            "?uuid=" +
            (this.$route.query.uuid ? this.$route.query.uuid : this.user.uuid) +
            "&idDocumentNumber=" +
            this.suppInfo.idCardNo +
            "&chineseName=" +
            this.suppInfo.name +
            "&accountLevel=" +
            this.suppInfo.openAccountType;
          api.openGTS2AccountWUuid(params).then((res) => {
            console.log(res);
            if (res.data.result == "0") {
              // success
              // cache returned GTS2 ID and password for later use
              const customerInfo = res.data.customerInfo;
              console.log(customerInfo);
              const customerNumber =
                customerInfo.customerNumber || customerInfo.GTS2; // both are ok, should be the same
              const password = customerInfo.password;
              sessionStorage.setItem(
                "registerResult",
                JSON.stringify({ customerNumber, password })
              );

              // Post register result to app for them to handle login
              if (isApp()) {
                const modifiedCustomerInfo = {
                  ...customerInfo,
                  idDocumentNumber: this.suppInfo.idCardNo,
                  uuid: this.$route.query.uuid,
                };
                console.log(modifiedCustomerInfo);
                appRegisterResult(modifiedCustomerInfo);
              }
              this.$router.push({
                path: "/RegisterSuccess",
                query: { type: "real" },
              });
            } else if (res.data.iResult_Error) {
              // fail with error
              this.$toast(res.data.iResult_Error.message);
              this.formSubmitting = false;
            } else {
              // fail with other error
              this.$toast(res.data.message);
              this.formSubmitting = false;
            }
          });
        }
      }
    },
  },
};
</script>

<style></style>
