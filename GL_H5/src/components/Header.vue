<template>
  <div id="header">
    <div class="header">
      <!-- <img class="logo" @click="goHome" :src="logUrl" /> -->
      <span style="font-size: 0.4rem; color: rgba(0, 0, 0, 1); font-weight: bold">
        金隆环球
      </span>
      <img
        src="../assets/images/nav/home_nav.png"
        @click="showCont"
      >
    </div>
    <div v-if="show" class="nav">
      <div class="masking" @click="closeCont" />
      <div class="navCon">
        <div class="cutOver" :class="isLogin(user.loginname)">
          <i
            @click="cutOver"
          >切换为{{
            String(user.loginname).startsWith("8") ? "模拟" : "真实"
          }}</i>
        </div>
        <div
          v-if="isLogin(user.loginname)"

          class="login"
          @click="goLogin"
        >
          <span><img src="../assets/images/nav/login_head_p.png"></span>
          <p>登录/注册</p>
        </div>
        <div class="login loginSuc" :class="isLogin(user.loginname)">
          <span><img src="../assets/images/nav/login_head_portrait.png"></span>
          <p>
            {{ user.mobilePhone }}(<em>{{
              String(user.loginname).startsWith("8") ? "真实" : "模拟"
            }}</em>)
          </p>
        </div>
        <div class="hideSuc" :class="isLogin(user.loginname)">
          <div class="money">
            <p>我的余额(美元)</p>
            <span>{{ account.balance ? account.balance : "--" }}</span>
          </div>
          <div class="hideList">
            <ul>
              <li>
                <img src="../assets/images/nav/login_icon1.png">
                <p>可用资金(美元) ：</p>
                <p>
                  {{
                    account.balance
                      ? Number(
                        util.accSub(
                          util.accAdd(account.balance, profitTotal || 0.0),
                          account.take || 0.0
                        )
                      ).toFixed(2)
                      : "--"
                  }}
                </p>
              </li>
              <li>
                <img src="../assets/images/nav/login_icon2.png">
                <p>总收益(美元) ：</p>
                <p :class="isOks(profitTotal)">
                  <em>+</em>{{
                    profitTotal ? Number(profitTotal || 0.0).toFixed(2) : "--"
                  }}
                </p>
              </li>
            </ul>
          </div>
          <div class="btnList">
            <a
              @click="deposit"
            >存款</a>
            <a
              @click="withdrawal"
            >取款</a>
          </div>
        </div>
        <div class="navList">
          <ul>
            <li
              :class="isLogin(user.loginname)"
              @click="goTrade"
            >
              <a>交易记录</a>
            </li>
            <!--<li><a>消息中心</a></li>-->
            <li>
              <a
                @click="goAbout"
              >关于我们</a>
            </li>
            <li
              :class="isLogin(user.loginname)"
              @click="userPop"
            >
              <a>退出登录</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--模拟账户-->
    <demoPop ref="isDemo" :user="user" />
    <!--真实模拟切换是否成功-->
    <CutOver ref="isCut" :err-message="errMessage" />
    <!--退出登录-->
    <div v-if="isDeleteUser" class="popFixed">
      <div class="masking" @click="userPop" />
      <div class="tcCon">
        <div class="item">
          <span>亲爱的投资达人</span>
          <p>下载APP可体验更多交易功能</p>
          <p>获取更多福利哦</p>
        </div>
        <div class="btnCon">
          <span
            @click="deleteUser"
          >暂时不用</span>
          <span
            @click="appDown"
          >去下载</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Util from '@/utils/tradeDataUtil'
import TradeUtil from '@/utils/tradeUtil'
import DemoPop from '@/components/DemoPop.vue'
import CutOver from '@/components/CutOver.vue'
import api from '@/plugins/api'

export default {
  name: 'Header',
  components: { DemoPop, CutOver },
  data() {
    return {
      show: false,
      util: Util,
      loginShow: false,
      logUrl: process.env.VUE_APP_TITLE_LOGO,
      frontoffice: process.env.VUE_APP_FRONTOFFICE,
      sign: process.env.VUE_APP_GA_SIGN,
      u: navigator.userAgent,
      isAndroid: '',
      isIOS: '',
      isDeleteUser: false,
      errMessage: '',
      isCutOver: false,
      Switch: ''
    }
  },
  computed: {
    ...mapState(['account', 'tradeData', 'user', 'quote']),
    /* 盈亏*/
    profitTotal: {
      get() {
        if (this.tradeData.position.length <= 0) return 0
        const data = this.tradeData.position
        let total = 0.0
        for (const i in data) {
          if (!this.quote.symbolTickMap[data[i].SName.szShortName]) return null
          let sub = 0
          if (data[i].Direction == 1) {
            // 买
            sub = Util.accSub(
              this.quote.symbolTickMap[data[i].SName.szShortName].ask,
              data[i].OpenPrice
            )
          } else {
            sub = Util.accSub(
              data[i].OpenPrice,
              this.quote.symbolTickMap[data[i].SName.szShortName].bid
            )
          }
          const profit = TradeUtil.changeCurrency(
            sub,
            this.quote.symbolTickMap[data[i].SName.szShortName].ask,
            this.quote.symbolTickMap[data[i].SName.szShortName].bid,
            data[i].Volume,
            data[i].symbolData,
            this.quote.symbolTickMap,
            data[i].Direction
          )
          total = Util.accAdd(total, profit)
          total = Util.accAdd(total, data[i].Swap)
        }
        return Number(total).toFixed(2)
      }
    }
  },
  mounted() {
    this.isAndroid =
      this.u.indexOf('Android') > -1 || this.u.indexOf('Linux') > -1
    this.isIOS = !!this.u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    localStorage.setItem(
      'zsmn',
      String(this.user.loginname).startsWith('68') ? '真实' : '模拟'
    )
    if (String(this.user.loginname).startsWith('68')) {
      this.Switch = 'SwitchDemo'
    } else this.Switch = 'SwitchReal'
  },
  methods: {
    removeFixed() {
      const mainH = document.getElementById('main')
      mainH.classList.remove('mainFixed')
    },
    toggleFixed() {
      let body
      if (document.documentElement) {
        body = document.documentElement
      } else if (document.body) {
        body = document.body
      }
      const mainH = document.getElementById('main')
      mainH.classList.toggle('mainFixed')
      if (body.clientWidth > 750) { mainH.style.left = (body.clientWidth - 750) / 2 + 'px' }
    },
    showCont() {
      this.show = !this.show
      this.toggleFixed()
    },
    closeCont() {
      this.show = !this.show
      this.removeFixed()
    },
    goLogin() {
      // this.$firebase.logEvent('click_login', {
      //   platform_type: 'cfdwell',
      //   source: '侧边栏',
      //   time: Util.getThisTime(),
      //   url: window.location.href
      // })
      this.toggleFixed()
      this.$bus.$emit('loading', false)
      this.$router.push({ path: '/login' })
    },
    goHome() {
      this.$router.push({ path: '/home' })
    },
    goTrade() {
      this.toggleFixed()
      this.$bus.$emit('loading', false)
      this.$router.push({ path: '/home/Trade' })
    },
    deposit() {
      this.toggleFixed()
      if (String(this.user.loginname).startsWith('68')) {
        const data = {
          mobilePhonePrefix: 86,
          customerNumber: this.user.loginname,
          password: this.user.pwd
        }
        this.$bus.$emit('loading', false)
        api.getUserCenterToken(this.$qs.stringify(data)).then((res) => {
          if (res.data.code == 200) {
            // this.$firebase.logEvent('click_deposit', {
            //   platform_type: 'cfdwell',
            //   source: '侧边栏',
            //   time: Util.getThisTime(),
            //   url: window.location.href
            // })
            const url =
              this.frontoffice + '/home/recharge?token=' + res.data.data.token
            window.location.href = url
            this.$bus.$emit('loading', true)
          }
        })
      } else {
        this.$refs.isDemo.showPop()
        this.show = !this.show
      }
    },
    withdrawal() {
      this.toggleFixed()
      if (String(this.user.loginname).startsWith('68')) {
        const data = {
          mobilePhonePrefix: 86,
          customerNumber: this.user.loginname,
          password: this.user.pwd
        }
        this.$bus.$emit('loading', false)
        api.getUserCenterToken(this.$qs.stringify(data)).then((res) => {
          if (res.data.code == 200) {
            const url =
              this.frontoffice +
              '/home/withdrawal?token=' +
              res.data.data.token
            window.location.href = url
            this.$bus.$emit('loading', true)
          }
        })
      } else {
        this.$refs.isDemo.showPop()
        this.show = !this.show
      }
    },
    cutOver() {
      this.$bus.$emit('loading', false)
      const customer = {
        customerNumber: this.user.loginname,
        password: this.user.pwd,
        mobilePhone: this.user.mobilePhone
      }
      api.transCustomerNumberForH5(this.$qs.stringify(customer)).then((res) => {
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
          this.errMessage = res.data.code_desc
          this.$refs.isCut.closePop()
        }
      })
    },
    isOks: function(obj) {
      var val = ''
      if (obj > 0) {
        val = 'rise'
      } else if (obj == 0) {
        val = 'level'
      } else {
        val = 'fall'
      }
      return val
    },
    goAbout() {
      this.toggleFixed()
      this.$router.push({
        path: '/home/AboutUs'
      })
    },
    userPop() {
      this.isDeleteUser = !this.isDeleteUser
    },
    deleteUser() {
      this.$store.dispatch('setUser', {})
      this.$router.go(0)
      this.show = false
    },
    appDown() {
      // this.$firebase.logEvent('download_app', {
      //   platform_type: 'cfdwell',
      //   account_type: localStorage.getItem('zsmn'),
      //   time: Util.getThisTime(),
      //   url: window.location.href,
      //   source: '顶部悬浮层'
      // })
      if (this.isIOS) {
        window.location.href =
          'https://itunes.apple.com/us/app/chuang-fucfd/id1153506842?mt=8'
      }
      if (this.isAndroid) {
        window.location.href =
          'https://img.getfc.com.cn/source/material/CFD_APP.apk'
      }
    },
    isLogin(obj) {
      var val = ''
      if (obj == null || obj == '' || typeof obj == 'undefined') {
        this.loginShow = true
        val = 'loginHide'
      } else this.loginShow = false
      return val
    }
  }
}
</script>
