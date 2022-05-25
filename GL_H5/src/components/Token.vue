<template>
  <div id="token">
    <div v-if="loginFailed" class="popFixed">
      <div class="masking" />
      <div class="tcCon">
        <div class="item">
          <span>提示</span>
          <p>{{ errMessage }}</p>
        </div>
        <div class="btnCon only">
          <span @click="goLogin">重新登录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/plugins/api'
import { mapState } from 'vuex'

export default {
  name: 'Token',
  computed: {
    ...mapState(['user']),
    tokens: {
      get() {
        if (this.$route.query.token) {
          return {
            token: this.$route.query.token
          }
        }
      }
    }
  },
  data() {
    return {
      loginFailed: false,
      errMessage: ''

    }
  },
  mounted() {
    if (this.$route.query.token) this.autoLogin()
    else this.$router.push({ path: '/home' })
  },
  methods: {
    goLogin() {
      console.log("in token go login")
      this.$router.push({ path: '/login' })
    },
    // 通过token自动登录，再跳转行情列表
    autoLogin() {
      api.getUserInfoByToken(this.$qs.stringify(this.tokens)).then(res => {
        if (res.status) {
          if (res.data.code == 200) {
            const user = {
              loginname: res.data.data.customerNumber,
              pwd: res.data.data.pwd,
              companyId: res.data.data.companyId,
              uuid: res.data.data.uuid,
              mobilePhone: res.data.data.mobilePhone
            }
            this.$store.dispatch('setUser', user)
            this.$router.replace('/home')// 刷新页面，实现socket重连
          } else {
            if (res.data.code_desc == '帳戶被鎖定') {
              this.loginFailed = !this.loginFailed
              this.errMessage = '您的账户被锁定，请联系客服或重置密码'
            } else {
              this.loginFailed = !this.loginFailed
              this.errMessage = res.data.code_desc
            }
          }
        } else {
          console.log("in token login failed")
          this.loginFailed = !this.loginFailed
          this.errMessage = '网络错误！'
        }
      }, res => {
        this.$router.push({ path: '/home' })
      })
    }
  }
}
</script>
