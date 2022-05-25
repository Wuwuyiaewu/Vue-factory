<template>
  <div>
    <Gtva
      ref="gt"
      @verifySuc="verifySuc"
    />
    <div
      class="verifyCode"
      :class="codes!=''?'border':''"
    >
      <div class="itemVerify">
        <input
          v-model="codes"
          type="text"
          placeholder="请输入验证码"
          minlength="1"
          maxlength="4"
          @blur="checkCode"
        >
      </div>
      <a
        v-if="isCode"
        :class="(phone && phone.length == 11)?'':'gray'"
        @click="getCode"
      >获取验证码</a>
      <a
        v-else
        class="gray"
      >{{ count }}S</a>
    </div>
    <div class="errMessage">{{ errMessage }}</div>
  </div>
</template>

<script>
import Gtva from '@/components/Gtva.vue'
import api from '@/plugins/api'
import Util from '@/utils/tradeDataUtil'

export default {
  name: 'VerifyCode',
  components: { Gtva },
  props: ['code', 'phone', 'codeType'],
  data() {
    return {
      isCode: true,
      count: '',
      timer: null,
      errMessage: '',
      codes: this.code
    }
  },
  watch: {
    codes: {
      deep: true,
      handler(newValue, oldValue) {
        this.changeCode(newValue)
      }
    }
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    changeCode(code) {
      this.$emit('changeCode', code)
    },
    checkCode() {
      if (Util.isNotEmpty(this.codes) && this.codes.length > 0 && this.codes.length < 7) {
        this.errMessage = ''
      } else {
        this.errMessage = '请输入4位手机验证码'
      }
    },
    // 调用极验
    getCode() {
      if ((this.phone && this.phone.length == 11)) {
        // this.$firebase.logEvent('phone_code', {
        //   'platform_type': 'cfdwell',
        //   'source': '开户',
        //   'code_type': '短信',
        //   'time': Util.getThisTime(),
        //   'url': window.location.href
        // })
        this.checkPhone()
      }
    },
    // 验证手机号码是否注册
    checkPhone() {
      var data = {
        mobilePhone: this.phone,
        mobilePhonePrefix: '86',
        isDemo: this.codeType
      }
      /*api.checkContainPhone(this.$qs.stringify(data)).then(res => {
        if (res.data.code == 0) {
          this.$refs.gt.verify()// 调用极验组件的极验弹框
        } else {
          this.errMessage = res.data.message
        }
      })*/
      console.log(this.$refs)
      this.$refs.gt.verify()
      //console.log(this.$refs.gt)
    },
    verifySuc(vaParam) {
      const time = 60
      if (!this.timer) {
        this.count = time
        this.isCode = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= time) {
            this.count--
          } else {
            this.isCode = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
      const customer = {
        mobilePhonePrefix: '86',
        mobilePhone: this.phone
      }
      const reaData = this.$qs.stringify(Object.assign(customer, vaParam))
      const header = {
        'visitorId': this.$refs.gt.visitorId,
        'isAjax': true,
        'businessType': 'default',
        'lang': 'cn'
      }
      this.$bus.$emit('loading', false)
      api.sendWithVa(reaData, header).then(res => {
        this.$bus.$emit('loading', true)
        if (res.data.code == 0) {
          this.errMessage = ''
        } else {
          this.errMessage = res.data.message
          this.isCode = true
          clearInterval(this.timer)
          this.timer = null
        }
      })
    }
  }
}
</script>
