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
        <div class="title">
          <span>补充资料</span>
          <p><em>*</em>为保障您的资金安全，请补充完善以下资料</p>
        </div>
        <div class="tabList">
          <ul>
            <li
              v-for="(item,index) in tabData"
              :key="'tab-data-'+index"
              :class="{checked:tabIndex==index}"
              @click="tabClick(item,index)"
            ><span>{{ item.name }}</span></li>
          </ul>
          <p>点差直降30% <em>(最低入金{{ money }}美元)</em></p>
        </div>
        <form>
          <div
            class="item"
            :class="register.name!=''?'border':''"
          >
            <div class="input-box">
              <input
                v-model="register.name"
                type="text"
                placeholder="请输入您的真实姓名"
                @blur="checkName"
              >
            </div>
          </div>
          <div class="errMessage">{{ nameTxt }}</div>
          <div
            class="item"
            :class="register.IDCard!=''?'border':''"
          >
            <div class="input-box">
              <input
                v-model="register.IDCard"
                placeholder="因监管要求，请输入您的真实身份证号码"
                type="text"
                oninput="if(value.length>18)value=value.slice(0,18);"
                @blur="checkIDCard"
                @mouseenter="onMouseOver"
                @mouseleave="onMouseOut"
              >
              <img
                v-if="isPicClose"
                class="icon"
                :class="register.IDCard!=''?'':'hide'"
                src="@/assets/images/login/close.png"
                alt=""
                @mouseenter="onMouseOver"
                @click="resetAccount()"
              >
            </div>
          </div>
          <div class="errMessage">{{ IDCardTxt }}</div>
          <div
            class="item"
            :class="register.email!=''?'border':''"
          >
            <div class="input-box">
              <input
                v-model="register.email"
                type="email"
                class="email"
                placeholder="账户的重要信息将发送到您的邮箱"
                @blur="checkEmail"
              >
            </div>
            <div class="emailCon">
              <ul>
                <li
                  v-for="(mail,index) in emails"
                  :key="'mail-'+index"
                  class="email"
                  :class="{'checked':mailIndex==index}"
                  @click="setInputEmail(mail)"
                >{{ mail }}</li>
              </ul>
            </div>
          </div>
          <div class="errMessage">{{ emailTxt }}</div>
          <div
            class="errPrompt"
            v-html="promptMsg"
          />
          <div class="register-box">
            <a
              class="register-btn"
              :class="(IDCardVerify(register.IDCard)&&calculateAge(register.IDCard)&&nameVerify(register.name)&&emailVerify(register.email))&&utils.isEmpty(emailTxt)?'suc':''"
              @click="secondStep"
            >完成开户</a>
            <p>当天激活，马上领取 <em class="color">赠金+微信红包</em></p>
          </div>
        </form>
      </div>
    </div>
    <Tab />
  </div>
</template>

<script>
require('@/assets/css/register.css')
import Tab from '@/components/Tab.vue'
import api from '@/plugins/api'
import Util from '@/utils/tradeDataUtil'
import { mapState } from 'vuex'

export default {
  name: 'RegisterNext',
  components: { Tab },
  computed: {
    ...mapState(['user', 'registerInfo']),
    emails() {
      // 如果inputEmail中没有任何东西，则不处理
      if (!this.register.email) return []
      // 考虑到用户自己要输@符号，如果@符号首次出现的位置大于等于第零个位置时，则不处理
      if (this.register.email.indexOf('@') > -1) return []
      if (this.isMail) return []
      return [
        this.register.email + '@163.com',
        this.register.email + '@126.com',
        this.register.email + '@0355.net',
        this.register.email + '@263.net',
        this.register.email + '@3721.net',
        this.register.email + '@qq.com',
        this.register.email + '@yahoo.com',
        this.register.email + '@gmail.com',
        this.register.email + '@msn.com',
        this.register.email + '@hotmail.com',
        this.register.email + '@aol.com',
        this.register.email + '@ask.com',
        this.register.email + '@live.com',
        this.register.email + '@yeah.net'
      ]
    }
  },
  data() {
    return {
      utils: Util,
      height: '',
      showPwd: false,
      isPicClose: false,
      tabData: [
        { name: '迷你', id: 'MIN', val: '70' },
        { name: '标准', id: 'STD', val: '200' },
        { name: '铂金', id: 'PLA', val: '5000' },
        { name: '巴菲特', id: 'ZER', val: '2000' }
      ],
      tabDataName: '标准',
      tabIndex: 1,
      money: '200',
      accountLevel: 'STD',
      promptMsg: '',
      register: {
        name: '',
        IDCard: '',
        email: '',
        phone: ''
      },
      IDCardTxt: '',
      nameTxt: '',
      emailTxt: '',
      isDemo: this.$route.query.Uuid || '',
      mailIndex: 0,
      isMail: false,
      registerType: 1,
      mobilePhone: this.$route.query.mobilePhone || '',
      password: this.$route.query.password || '',
      from: this.$route.query.from || '',
      code: this.$route.query.code || '',
      href: this.$route.query.href, // 开户来源 url
      referrer: this.$route.query.referrer// 开户页面 referrer
    }
  },
  mounted() {
    this.$bus.$emit('loading', true)
    this.removeFixed()
    this.docHeight()
    this.globalClick()
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
    // 全局关闭
    globalClick() {
      document.onclick = e => {
        if (e.target.className != 'email') {
          this.isMail = true
        } else this.isMail = false
      }
    },
    resetAccount() {
      this.register.IDCard = ''
    },
    onMouseOver() {
      this.isPicClose = true
    },
    onMouseOut() {
      this.isPicClose = false
    },
    tabClick(obj, index) {
      this.money = obj.val
      this.tabIndex = index
      this.tabDataName = obj.name
      this.accountLevel = obj.id
    },
    // 验证姓名
    nameVerify(name) {
      var reg = /^[A-Z, a-z,·, \u0391-\uFFE5]+$/
      if (reg.test(name)) {
        return !0
      } else {
        return !1
      }
    },
    checkName() {
      if (this.nameVerify(this.register.name)) {
        this.nameTxt = ''
        if (this.IDCardVerify(this.register.IDCard)) this.validate()
      } else {
        this.nameTxt = '请输入您的真实姓名'
      }
    },
    // 验证身份证号码
    IDCardVerify(IDCard) {
      var e = { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江 ', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北 ', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏 ', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外 ' }
      if (!IDCard || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(IDCard)) return !1
      if (!e[IDCard.substr(0, 2)]) return !1
      // 18位身份证需要验证最后一位校验位
      if (IDCard.length == 18) {
        for (var r, o = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2], d = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2], n = 0, i = 0; i < IDCard.length - 1; i++)
        // 对前17位数字与权值乘积求和
        { n += parseInt(IDCard.substr(i, 1), 10) * o[i] }
        // 检验第18为是否与校验码相等
        // 计算模（固定算法）
        r = n % 11
        return d[r] == IDCard.substr(17, 1).toUpperCase()
      }
      return !0
    },
    calculateAge(idCard) {
      // 获取年龄
      var myDate = new Date()
      var month = myDate.getMonth() + 1
      var day = myDate.getDate()
      var age = myDate.getFullYear() - idCard.substring(6, 10) - 1
      if (idCard.substring(10, 12) < month || idCard.substring(10, 12) == month && idCard.substring(12, 14) <= day) {
        age++
      }
      if (age < 18) return !1
      else return !0
    },
    checkIDCard() {
      if (!this.IDCardVerify(this.register.IDCard)) {
        this.IDCardTxt = '请正确填写您的身份证号码'
      } else if (!this.calculateAge(this.register.IDCard)) {
        this.IDCardTxt = '您没到18岁'
      } else {
        this.IDCardTxt = ''
        this.validate()
      }
    },
    // 验证邮箱
    emailVerify(email) {
      var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (reg.test(email)) {
        return !0
      } else {
        return !1
      }
    },
    checkEmail() {
      if (this.emailVerify(this.register.email)) {
        const data = { email: this.register.email }
        api.checkContainEmail(this.$qs.stringify(data)).then(res => {
          if (res.data.code == 0 && res.data.result == false) {
            this.emailTxt = ''
          } else {
            this.emailTxt = '邮箱已注册过'
          }
        })
      } else {
        this.emailTxt = '邮箱格式不正确'
      }
    },
    setInputEmail(mail) {
      this.register.email = mail
      this.checkEmail()
    },
    /* 验证身份证二元素*/
    validate(type) {
      let mobilePhone
      if (Util.isNotEmpty(this.from) && this.from.toLowerCase() == 'lp') {
        mobilePhone = this.mobilePhone
        this.registerType = 1
      } else if (Util.isNotEmpty(this.isDemo)) {
        if (Util.isNotEmpty(this.mobilePhone)) mobilePhone = this.mobilePhone
        else {
          mobilePhone = this.user.mobilePhone
          this.mobilePhone = mobilePhone
        }
        this.registerType = 1
      } else {
        mobilePhone = this.registerInfo.mobilePhone
        this.registerType = 0
      }
      const data = {
        mobilePhone: mobilePhone,
        chineseName: this.register.name,
        idNumber: this.register.IDCard,
        registerType: this.registerType// 开户类型(0:真实，1：模拟转真实)
      }
      api.validateIdCard(this.$qs.stringify(data)).then(res => {
        if (res.data.code == 0) {
          this.promptMsg = ''
          if (type == 0) this.createAccounts()
        } else {
          this.$bus.$emit('loading', true)
          this.promptMsg = res.data.message
        }
      })
    },
    /* 创建账户*/
    createAccounts() {
      let newData, thirdQuery
      const data = {
        chineseName: this.register.name,
        idDocumentNumber: this.register.IDCard,
        email: this.register.email,
        relateCustomerUuid: this.isDemo,
        registerType: this.registerType,
        platform: 'trade',
        accountLevel: this.accountLevel,
        channel: 1,
        from: this.from
      }
      const formData = {
        mobilePhone: this.mobilePhone,
        password: this.password,
        code: this.code,
        href: this.href,
        referrer: this.referrer,
        dataType: 1,
        directPhone: ''
      }
      if (Util.isNotEmpty(this.from) && this.from.toLowerCase() == 'lp') {
        newData = { ...data, ...formData }
      } else {
        if (Util.isNotEmpty(this.mobilePhone) && Util.isNotEmpty(this.isDemo)) {
          newData = {
            chineseName: this.register.name,
            idDocumentNumber: this.register.IDCard,
            email: this.register.email,
            relateCustomerUuid: this.isDemo,
            mobilePhone: this.mobilePhone,
            registerType: this.registerType,
            platform: 'trade',
            accountLevel: this.accountLevel,
            channel: 1,
            dataType: 1
          }
        } else newData = { ...data, ...this.registerInfo }
      }
      api.createAccount(this.$qs.stringify(newData)).then(res => {
        if (res.data.code == 0) {
          localStorage.setItem('zsmn', String(res.data.result).startsWith('68') ? '真实' : '模拟')
          if (Util.isNotEmpty(this.isDemo)) {
            if (Util.isNotEmpty(this.mobilePhone)) {
              thirdQuery = {
                type: 3,
                result: 'SUCCESS',
                account: res.data.result.customerNo,
                mobilePhone: this.mobilePhone,
                password: res.data.result.password
              }
              this.$store.dispatch('setThirdQuery', thirdQuery)
            } else {
              thirdQuery = {
                type: 1,
                result: 'SUCCESS',
                account: res.data.result.customerNo
              }
              this.$store.dispatch('setThirdQuery', thirdQuery)
            }
          } else if (Util.isNotEmpty(this.from) && this.from.toLowerCase() == 'lp') {
            thirdQuery = {
              type: 2,
              result: 'SUCCESS',
              account: res.data.result.customerNo,
              mobilePhone: this.mobilePhone,
              password: res.data.result.password
            }
            this.$store.dispatch('setThirdQuery', thirdQuery)
          } else {
            thirdQuery = {
              type: 0,
              result: 'SUCCESS',
              account: res.data.result.customerNo
            }
            this.$store.dispatch('setThirdQuery', thirdQuery)
          }
          this.$router.push({ path: '/registerResult' })
        } else if (res.data.code == 501) {
          thirdQuery = { result: 'PROCESSING' }
          this.$store.dispatch('setThirdQuery', thirdQuery)
          this.$router.push({ path: '/registerResult' })
        } else if (res.data.code == 502) {
          thirdQuery = { result: 'FAIL' }
          this.$store.dispatch('setThirdQuery', thirdQuery)
          this.$router.push({ path: '/registerResult' })
        } else {
          this.$bus.$emit('loading', true)
          this.promptMsg = res.data.message
        }
      })
    },
    secondStep() {
      if (this.IDCardVerify(this.register.IDCard) && this.calculateAge(this.register.IDCard) && this.nameVerify(this.register.name) && this.emailVerify(this.register.email) && Util.isEmpty(this.emailTxt)) {
        // this.$firebase.logEvent('person_details', {
        //   'platform_type': 'cfwell',
        //   'account_type': localStorage.getItem('zsmn'),
        //   'source': '登录页',
        //   'time': Util.getThisTime(),
        //   'account_grade': this.tabDataName,
        //   'url': window.location.href
        // })
        this.$bus.$emit('loading', false)
        this.validate(0)
      }
    }
  }
}
</script>
