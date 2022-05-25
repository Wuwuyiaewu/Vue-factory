<template>
  <div>
    <div v-if="popShow" class="popFixed">
      <div class="masking" @click="showPop" />
      <div class="tcCon">
        <div class="item">
          <span>提示</span>
          <p>您好！真实账号才能操作</p>
        </div>
        <div class="btnCon">
          <span @click="showPop">取消</span>
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
  name: 'DemoPop',
  components: { CutOver },
  props: ['user'],
  data() {
    return {
      popShow: false,
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
    showPop: function() {
      this.popShow = !this.popShow
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
          this.popShow = !this.popShow
          this.errMessage = res.data.code_desc
          this.$refs.isCut.closePop()
        }
      })
    }
  }
}
</script>
