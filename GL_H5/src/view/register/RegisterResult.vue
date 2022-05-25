<template>
  <div
    class="register headNav"
    :style="{'min-height':height+'px'}"
  >
    <div class="navTitle">
      <div class="navItem">
        <img
          class="black"
          src="@/assets/images/nav/a_top_return_w.png"
          @click="back"
        >
      </div>
    </div>
    <div class="content">
      <div
        class="form-box"
        :style="{'min-height':(height/50-5.7)+'rem'}"
      >
        <div
          v-if="thirdQuery.result=='SUCCESS'"
          class="accCon"
        >
          <img
            src="@/assets/images/register/succ.png"
            alt=""
          >
          <span>恭喜您，开户成功！</span>
          <p>平台登录账号：{{ thirdQuery.account }}</p>
        </div>
        <div
          v-else-if="thirdQuery.result=='PROCESSING'"
          class="accCon"
        >
          <img src="@/assets/images/register/progress.png">
          <p>您好！感谢您的申请资料已提交审核 <br> 我们会尽快处理并反馈结果。</p>
        </div>
        <div
          v-else-if="thirdQuery.result=='FAIL'"
          class="accCon"
        >
          <img src="@/assets/images/register/fail.png">
          <p>抱歉！您的申请未能通过审核<br> 请复核提交的资料。</p>
        </div>
        <div class="explain">
          <p>当天激活，马上领取 <em>赠金+微信红包</em></p>
        </div>
        <div
          v-if="thirdQuery.result=='SUCCESS'"
          class="btn"
        >
          <a
            class="first"
            @click="goHome"
          >体验交易</a>
          <a
            class="last"
            @click="goUserCenter"
          >去存款</a>
        </div>
        <div
          v-else
          class="btn"
        >
          <a
            class="only"
            @click="openLive800"
          >联系客服</a>
        </div>
      </div>
    </div>
    <Tab />
    <div
      v-if="isShow"
      class="popFixed"
    >
      <div
        class="masking"
        @click="closePop"
      />
      <div class="tcCon">
        <div class="item">
          <span>提示</span>
          <p>{{ promptMsg }}</p>
        </div>
        <div class="btnCon only">
          <span @click="goRetry">重试</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
require('@/assets/css/register.css')
import Tab from '@/components/Tab.vue'
import api from '@/plugins/api'
import { mapState } from 'vuex'
import Util from '@/utils/tradeDataUtil'

export default {
  name: 'RegisterResult',
  components: { Tab },
  computed: {
    ...mapState(['user', 'registerInfo', 'thirdQuery'])
  },
  data() {
    return {
      height: '',
      isShow: false,
      promptMsg: '',
      isLogin: false
    }
  },
  mounted() {
    this.$bus.$emit('loading', true)
    this.removeFixed()
    this.docHeight()
  },
  activated() {
    this.$bus.$emit('loading', true)
    this.removeFixed()
    this.docHeight()
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    docHeight() {
      this.height = window.innerHeight || document.documentElement.clientHeight
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
    openLive800() {
      var url = 'https://www.cf-service.com/k800/chatClient/chatbox.jsp?companyID=475&configID=56&jid='
      var left = (screen.width / 2) - (600 / 2)
      var top = (screen.height / 2) - (400 / 2)
      window.open(url,
        'DescriptiveWindowName',
        'resizable,scrollbars=yes,status=1,width=800, height=550, top=' + top + ', left=' + left)
    },
    closePop() {
      this.removeFixed()
      this.isShow = false
    },
    goHome() {
      this.isLogin = true
      const data = {
        mobilePhonePrefix: '86',
        customerNumber: this.thirdQuery.account,
        password: this.thirdQuery.type == 1 ? this.user.pwd : (this.thirdQuery.type == 2 || this.thirdQuery.type == 3) ? this.thirdQuery.password : this.registerInfo.password
      }
      this.$bus.$emit('loading', false)
      api.login(this.$qs.stringify(data)).then(res => {
        if (res.status) {
          if (res.data.code == 200) {
            const user = {
              loginname: res.data.data.customerNumber,
              pwd: res.data.data.pwd,
              companyId: res.data.data.companyId,
              uuid: res.data.data.uuid,
              mobilePhone: res.data.data.mobilePhone
            }
            this.promptMsg = ''
            this.$store.dispatch('setUser', user)
            this.$router.push({ path: '/home' })
          } else {
            this.$bus.$emit('loading', true)
            this.isShow = true
            this.toggleFixed()
            if (res.data.code_desc == '帳戶被鎖定') this.promptMsg = '您的账户被锁定，请联系客服或重置密码'
            else this.promptMsg = res.data.code_desc
          }
        } else {
          this.$bus.$emit('loading', true)
          this.isShow = true
          this.toggleFixed()
          this.promptMsg = '网络错误！'
        }
      })
    },
    goUserCenter() {
      this.isLogin = false
      const data = {
        mobilePhone: this.thirdQuery.type == 1 ? this.user.mobilePhone : (this.thirdQuery.type == 2 || this.thirdQuery.type == 3) ? this.thirdQuery.mobilePhone : this.registerInfo.mobilePhone,
        isMobile: true,
        password: this.thirdQuery.type == 1 ? this.user.pwd : (this.thirdQuery.type == 2 || this.thirdQuery.type == 3) ? this.thirdQuery.password : this.registerInfo.password
      }
      this.$bus.$emit('loading', false)
      api.getLoginToken(this.$qs.stringify(data)).then(res => {
        if (res.data.code == 0) {
          this.$bus.$emit('loading', true)
          this.promptMsg = ''
          // window.location.href = res.data.result
          this.$router.push({ path: '/home' })
        } else {
          this.$bus.$emit('loading', true)
          this.isShow = true
          this.toggleFixed()
          this.promptMsg = res.data.message
        }
      })
    },
    goRetry() {
      if (this.isLogin) this.goHome()
      else this.goUserCenter()
    }
  }
}
</script>
