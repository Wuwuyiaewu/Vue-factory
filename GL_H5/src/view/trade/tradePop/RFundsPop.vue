<template>
  <div>
    <div
      v-if="isFunds"
      class="popFixed"
    >
      <div
        class="masking"
        @click="fundsPop"
      />
      <div class="tcCon">
        <div class="item">
          <p>保证金不足，为保证不影响您的交易，请及时补充资金（39）</p>
        </div>
        <div class="btnCon">
          <!-- <span @click="cutOver">体验模拟</span> -->
          <span @click="goDeposit">充值</span>
        </div>
      </div>
    </div>
    <!--真实模拟切换是否成功-->
    <CutOver
      ref="isCut"
      :err-message="errMessage"
    />
  </div>
</template>

<script>
import CutOver from '@/components/CutOver.vue'
import api from '@/plugins/api'
import Util from '@/utils/tradeDataUtil'
export default {
  name: 'RFundsPop',
  components: { CutOver },
  props: ['user'],
  data() {
    return {
      isFunds: false,
      frontoffice: process.env.VUE_APP_FRONTOFFICE,
      errMessage: ''
    }
  },
  methods: {
    fundsPop() {
      this.isFunds = !this.isFunds
      if(this.isFunds){
        document.querySelector('html').className="isOpenNav"
      }else{
        document.querySelector('html').removeAttribute("class","isOpenNav")
      }
    },
    goDeposit() {
      this.$bus.$emit('loading', false)
      this.$router.push({
        path: '/home/UserCenter',
        query: { action:'fund',num:2 }
      })
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
          document.querySelector('html').removeAttribute("class","isOpenNav")
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
