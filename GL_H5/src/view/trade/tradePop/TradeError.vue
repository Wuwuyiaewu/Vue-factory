<template>
  <div class="template">
    <div class="navTitle">
      <div class="navItem">
        <img
          class="back"
          :src="require('@/assets/images/nav/a_top_return_w.png')"
          @click="back"
        >
        <p>{{ symbolInfo.aushGB }}</p>
        <p class="symbol">{{ symbolInfo.szShortName }}</p>
      </div>
    </div>

    <div class="TradeErrorBox">
      <div class="tcCon">
        <img :src="require('@/assets/images/trade/trade_error.png')">
        <div class="item">
          <p class="title">操作失败</p>
          <p>余额不足，为保证不影响您的交易，请及时补充资金</p>
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
import { mapState } from 'vuex'
import CutOver from '@/components/CutOver.vue'
import api from '@/plugins/api'
export default {
  name: 'RFundsPop',
  components: { CutOver },
  data() {
    return {
      isFunds: false,
      frontoffice: process.env.VUE_APP_FRONTOFFICE,
      errMessage: ''
    }
  },
  computed: {
    ...mapState(['user', 'quote', 'account']),
    symbolInfo: {
      get() {
        return this.quote.notify[this.$route.query.id] || {}
      }
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    fundsPop() {
      this.isFunds = !this.isFunds
      if(this.isFunds){
        document.querySelector('html').className="isOpenNav"
      }else{
        document.querySelector('html').removeAttribute("class","isOpenNav")
      }
    },
    goDeposit() {
      const data = {
        mobilePhonePrefix: 86,
        customerNumber: this.user.loginname,
        password: this.user.pwd
      }
      this.$bus.$emit('loading', false)
      api.getUserCenterToken(this.$qs.stringify(data)).then(res => {
        if (res.data.code == 200) {
          const url = this.frontoffice + '/home/recharge?token=' + res.data.data.token
          window.location.href = url
          this.$bus.$emit('loading', true)
        }
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
