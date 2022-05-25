<template>
  <div class="login container">
    <div id="head">
      <div class="headItem">
        <img
          class="close"
          src="../assets/images/login/a_top_closel.png"
          @click="back"
        >
        <img
          class="chat"
          src="../assets/images/login/bottom_live800.png"
          @click="openLive800"
        >
      </div>
    </div>
    <div class="form-box">
      <div class="circle">
        <img src="../assets/images/login/login_logo.png">
      </div>
      <form>
        <div class="input-box">
          <input
            v-model="login.customerNumber"
            class="input-item"
            placeholder="请输入账号"
            type="number"
            oninput="if(value.length>11)value=value.slice(0,11);value=value.replace(/[^\d]/g,'')"
          >
          <img
            :class="login.customerNumber == '' ? 'icon hide' : 'icon'"
            src="../assets/images/login/close.png"
            alt=""
            @click="resetAccount()"
          >
        </div>
        <div class="input-box">
          <input
            v-model="login.password"
            class="input-item"
            :type="[showPwd ? 'text' : 'password']"
            minlength="5"
            maxlength="16"
            placeholder="请输入交易密码"
          >
          <img
            v-if="showPwd"
            class="icon"
            src="../assets/images/login/open-code.png"
            alt=""
            @click="togglePwd()"
          >
          <img
            v-else
            class="icon"
            src="../assets/images/login/close-code.png"
            alt=""
            @click="togglePwd()"
          >
        </div>
        <div
          class="login-box"
          @click="toLogin()"
        >
          <span class="login-btn" type="primary">登录</span>
        </div>
      </form>
      <div class="prompt">{{ promptMsg }}</div>
    </div>
    <div class="opt-box">
      <span
        @click="goAccount"
      >还没有账户？</span>
      <span
        @click="goPassword"
      >忘记密码</span>
    </div>
  </div>
</template>
<script>
require('@/assets/css/login.css')
import api from '@/plugins/api'
import { mapState } from 'vuex'
import Util from '@/utils/tradeDataUtil'
import loginUtil from '@/utils/loginUtil'
export default {
  data() {
    const u = navigator.userAgent
    return {
      login: {
        // localStorage.setItem('user', JSON.stringify({loginname:81017244,pwd:'chj123',companyId:8}))
        /* customerNumber: "81017510",
        password: "a1234567"*/
        customerNumber: '',
        password: ''
      },
      acUrl: process.env.VUE_APP_AC,
      frontoffice: process.env.VUE_APP_FRONTOFFICE,
      sign: process.env.VUE_APP_GA_SIGN,
      showPwd: false,
      promptMsg: '',
      showClose: false,
      isAndroid: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
      isIOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    }
  },
  computed: {
    ...mapState(['socket', 'user']),
    loginParam: {
      get() {
        if (this.login.customerNumber.trim().length <= 8) {
          return {
            customerNumber: this.login.customerNumber,
            password: this.login.password
          }
        }
        return {
          mobilePhonePrefix: '86',
          mobilePhone: this.login.customerNumber,
          password: this.login.password
        }
      }
    }
  },
  mounted() {
    this.$bus.$emit('loading', true)
    this.removeFixed()
    // 关闭socket
    if (this.socket.quoteSocket != null) {
      this.socket.quoteSocket.close()
    }
    if (this.socket.tradeSocket != null) {
      this.socket.tradeSocket.close()
    }
  },
  activated() {
    this.$bus.$emit('loading', true)
    this.removeFixed()
    // 关闭socket
    if (this.socket.quoteSocket != null) {
      this.socket.quoteSocket.close()
    }
    if (this.socket.tradeSocket != null) {
      this.socket.tradeSocket.close()
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    removeFixed() {
      let body
      if (document.documentElement) {
        body = document.documentElement
      } else if (document.body) {
        body = document.body
      }
      const mainH = document.getElementById('main')
      mainH.classList.remove('mainFixed')
      if (body.clientWidth > 750) {
        mainH.style.width = 'auto'
        mainH.style.left = 0
      }
    },
    toLogin() {
      // 提交前验证
      if (this.login.customerNumber === '') {
        this.promptMsg = '您的用户账号为空'
        return
      }
      if (this.login.password === '') {
        this.promptMsg = '您的密码为空'
        return
      }
      // if (
      //   process.env.NODE_ENV !== "production" &&
      //   !(
      //     loginUtil.isValidRealAccount(this.login.customerNumber) ||
      //     loginUtil.isValidDemoAccount(this.login.customerNumber)
      //   )
      // ) {
      //   this.$bus.$emit("loading", true);
      //   this.promptMsg = "用户名或密码错误!";
      //   return;
      // }
      // 提交赎金
      const readyData = this.$qs.stringify(this.loginParam)
      this.$bus.$emit('loading', false, '登录中')
      api.login(readyData).then((res) => {
        this.$bus.$emit('loading', true)
        if (res.status) {
          if (res.data.code === 200) {
            if (
              !(
                loginUtil.isValidRealAccount(res.data.data.customerNumber) ||
                loginUtil.isValidDemoAccount(res.data.data.customerNumber)
              )
            ) {
              this.promptMsg = '用户名或密码错误!'
              return
            }
            localStorage.setItem(
              'zsmn',
              String(res.data.data.loginname).startsWith('68')
                ? '真实'
                : '模拟'
            )
            // this.$firebase.logEvent('login', {
            //   platform_type: 'cfdwell',
            //   account_type: localStorage.getItem('zsmn'),
            //   time: Util.getThisTime(),
            //   url: window.location.href
            // })
            const user = {
              loginname: res.data.data.customerNumber,
              pwd: res.data.data.pwd,
              companyId: res.data.data.companyId,
              uuid: res.data.data.uuid,
              mobilePhone: res.data.data.mobilePhone
            }
            this.$store.dispatch('setUser', user)
            this.$router.go(0) // 刷新页面，实现socket重连
          } else {
            if (res.data.code_desc === '帳戶被鎖定') { this.promptMsg = '您的账户被锁定，请联系客服或重置密码' } else this.promptMsg = res.data.code_desc
          }
        } else {
          this.promptMsg = '网络错误！'
        }
      })
    },
    resetAccount() {
      this.login.customerNumber = ''
    },
    togglePwd() {
      this.showPwd = !this.showPwd
    },
    goAccount() {
      this.$bus.$emit('loading', false)
      // this.$firebase.logEvent('account_reg', {
      //   platform_type: 'cfdwell',
      //   source: '登录页',
      //   time: Util.getThisTime(),
      //   url: window.location.href
      // })
      this.$router.push({ path: '/register' })
    },
    goPassword() {
      this.$bus.$emit('loading', false)
      const url = this.frontoffice + '/forgetPwd'
      window.location.href = url
      this.$bus.$emit('loading', true)
    },
    openLive800() {
      var url =
        'https://www.cf-service.com/k800/chatClient/chatbox.jsp?companyID=475&configID=56&jid='
      var left = screen.width / 2 - 600 / 2
      var top = screen.height / 2 - 400 / 2
      window.open(
        url,
        'DescriptiveWindowName',
        'resizable,scrollbars=yes,status=1,width=800, height=550, top=' +
          top +
          ', left=' +
          left
      )
    }
  }
}
</script>
