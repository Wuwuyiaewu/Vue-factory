<template>
  <div>
    <div v-if="isFunds" class="popFixed">
      <div class="masking" @click="fundsPop" />
      <div class="tcCon">
        <div class="item">
          <p>您好！账户余额不足</p>
          <p>请切换为真实账号，方可充值交易</p>
        </div>
        <div class="btnCon">
          <span @click="fundsPop">取消</span>
          <span @click="cutOver">切换真实账号</span>
        </div>
      </div>
    </div>
    <!--真实模拟切换是否成功-->
    <CutOver ref="isCut" :err-message="errMessage" />
  </div>
</template>

<script>
import CutOver from '@/components/CutOver.vue'
import api from '@/plugins/api'

export default {
  name: 'DFundsPop',
  components: { CutOver },
  props: ['user'],
  data() {
    return {
      isFunds: false,
      errMessage: ''
    }
  },
  methods: {
    toggleFixed() {
      let body
      if (document.documentElement) {
        body = document.documentElement
      } else if (document.body) {
        body = document.body
      }
      const mainH = document.getElementById('main')
      mainH.classList.toggle('mainFixed')
      if (body.clientWidth > 750) mainH.style.left = (body.clientWidth - 750) / 2 + 'px'
    },
    fundsPop() {
      this.isFunds = !this.isFunds
      this.toggleFixed()
    },
    cutOver() {
      this.$bus.$emit('loading', false)
      const customer = {
        customerNumber: this.user.loginname,
        password: this.user.pwd,
        mobilePhone: this.user.mobilePhone
      }
      api.transCustomerNumberForH5(this.$qs.stringify(customer)).then(res => {
        if (res.data.code == 200) {
          const user = {
            loginname: res.data.data.customerNumber,
            pwd: res.data.data.pwd,
            companyId: res.data.data.companyId,
            uuid: res.data.data.uuid,
            mobilePhone: res.data.data.mobilePhone
          }
          this.$store.dispatch('setUser', user)
          window.location.reload(true)
        } else if (res.data.code == 501) {
          this.$router.push({
            path: '/registerNext',
            query: { Uuid: res.data.data }
          })
        } else {
          this.$bus.$emit('loading', true)
          this.isFunds = !this.isFunds
          this.errMessage = res.data.code_desc
          this.$refs.isCut.closePop()
        }
      })
    }
  }
}
</script>
