<template>
  <div class="quoteChart">

    <div class="tabsPopBox" :class="{moveout: popShow}">
      <div class="tab_title">切换品种</div>
      <div class="tabpop_left">
        <ul class="tabs">
          <li
            v-for="(item, index) in tabs"
            :id="item.id"
            :key="item.id"
            :class="{ checked: isTrue == index }"
            @click="tabclick(index)"
          >
          <span>{{ item.name }}</span>
          </li>
        </ul>
      </div>

      <div class="tabpop_right">
        <ul
        v-for="(item, index) in isTrueTabList"
        :key="'quotation-tab-' + index"
        class="tabs"
        >
          <li
            v-for="data in filteredTickList(item.id)"
            :key="'tabs-tick-2-' + data.uiCodeID"
            :class="{ checked: data.uiCodeID==code }"
            @click="changeCode(data.uiCodeID)"
          >
          {{ data.symbolName }}<label>{{data.symbol}}</label>
          </li>
        </ul>
      </div>
    </div>
    <div v-show="popShow" class="tabsPopBox_bg" @click="popHide"></div>

    <div class="navTitle">
      <div class="navItem">
        <img
          class="back"
          src="@/assets/images/quotation/chars_back.png"
          @click="back"
        >

        <div class="product">
          <p
            v-if="quote.notify[code]"
          >{{ quote.notify[code].aushGB
          }}<img
           src="@/assets/images/quotation/chars_change.png"
           @click="showCodePop"
          ></p>
          <p>{{ quote.notify[code].szShortName }} &nbsp;&nbsp; {{ quote.codeTickMap[code]|time_His }}</p>
        </div>
        <img class="treaty" src="@/assets/images/quotation/chars_attr.png" @click="goAttribute">
      </div>
    </div>

    <!-- <Charts
      :code="code"
      :view="view"
      :is-slider="isSlider"
      ref="chars"
    /> -->
    <TVChart
        :height='chartHeight'
        :isfull-screen.sync='isfullScreen'
        :product-id='code'
    />
    <!--相关资讯-->
    <about-news :code="code" />

    <!--底部栏-->
    <div class="char_botFixed">
      <ul>
        <li :class="isSell(data)" class="bgcolor" @click="clickPop(2)">卖出 <em>{{data.ask}}</em><i></i></li>
        <label>{{ quote.notify[data.uiCodeID] ? Math.abs((data.bid - data.ask) / quote.notify[data.uiCodeID].pipv).toFixed(quote.notify[data.uiCodeID].diff) : ''}}</label>
        <li :class="isBuy(data)" class="bgcolor" @click="clickPop(1)"><i></i><em>{{data.bid}}</em>买入</li>
      </ul>
    </div>

    <!--参考行情是否可交易-->
    <div v-if="isReference" class="popFixed">
      <div class="masking" @click="clickPop" />
      <div class="tcCon">
        <div class="item">
          <p>{{ errMessage }}</p>
        </div>
        <div class="btnCon only">
          <span @click="clickPop">确定</span>
        </div>
      </div>
    </div>

    <!--买入卖出弹窗-->
    <market-norm ref="child" :code="code" />

    <!--游客-->
    <div v-if="isGuest" class="popFixed">
      <div class="masking" @click="guestPop" />
      <div class="tcCon">
        <div class="item">
          <span>提示</span>
          <p>您好！游客不能进行交易，如需更多服务</p>
          <p>请注册或登录后使用，谢谢</p>
        </div>
        <div class="btnCon">
          <span @click="goAccount">立即开户</span>
          <span @click="goLogin">登录</span>
        </div>
      </div>
    </div>
    <!--真实账号资金是否充足-->
    <RFundsPop ref="rFunds" :user="user" />
    <!--模拟账号资金是否充足-->
    <DFundsPop ref="dFunds" :user="user" />
  </div>
</template>
<script>
require('@/assets/css/quoteChart.css')
import { mapState } from 'vuex'
import Util from '@/utils/tradeDataUtil'
import Charts from './Charts.vue'
import TVChart from './tradingview/tv.vue'
import AboutNews from '@/view/news/AboutNews.vue'
import MarketNorm from '@/view/trade/MarketNorm.vue'
import Tab from '@/components/Tab.vue'
import RFundsPop from '@/view/trade/tradePop/RFundsPop.vue'
import DFundsPop from '@/view/trade/tradePop/DFundsPop.vue'

export default {
  name: 'QuoteChart',
  filters: {
    time_His(longTime){
      if(longTime){
        return Util.formatDate(longTime.dtime, 'hh:mm:ss')
      }
    }
  },
  components: {
    Charts,
    TVChart,
    AboutNews,
    MarketNorm,
    RFundsPop,
    DFundsPop,
    Tab
  },
  data() {
    return {
      // view: this.$route.query.view,
      // code: this.$route.query.id || "",
      isTrue: Number(this.$route.query.tabIndex),
      tabs: JSON.parse(process.env.VUE_APP_TICKLIST),
      popShow: false,
      isSlider: true,
      isReference: false,
      errMessage: '',
      isGuest: false,
      acUrl: process.env.VUE_APP_AC,
      sign: process.env.VUE_APP_GA_SIGN,
      isfullScreen: false,
      chartHeight: 460
    }
  },
  computed: {
    ...mapState(['user', 'quote', 'symbolInfo', 'account']),
    attribute: {
      get() {
        if (this.quote.notify[this.$route.query.id]) {
          const sourceCode = this.quote.notify[this.$route.query.id].uiSourceCode
          return this.symbolInfo.codeMap[sourceCode] || {}
        }
        return {}
      }
    },
    view: {
      get() {
        return this.$route.query.view
      }
    },
    code: {
      get() {
        return Number(this.$route.query.id) || 3552563
      },
      set() {}
    },
    data: {
      get() {
        return this.quote.codeTickMap[this.code] || {}
      }
    },
    isTrueTabList: function() {
      return this.tabs.filter((ele, index) => this.isTrue === index)
    },
    filteredTickList: function() {
      return (id) => {
        return this.quote.tickList.filter(tick=>this.quote.notify[tick.uiCodeID].searchflag === id)
      }
    }
  },
  mounted() {
    this.$bus.$emit('loading', true)
    this.removeFixed()
    if(this.$route.query.quickSale && [1,2].includes(this.$route.query.quickSale)){
      this.clickPop(this.$route.query.quickSale)
    }
  },
  activated() {
    this.$bus.$emit('loading', true)
    this.removeFixed()
  },
  methods: {
    back() {
      this.$router.push({path: localStorage.getItem('qcBack') || '/home/Quotation',query: { tabIndex: Number(this.$route.query.tabIndex) }})
    },
    tabclick: function(index) {
      this.isTrue = index
    },
    showCodePop(){
      this.popShow = true
      document.querySelector('html').className="isOpenNav"
    },
    popHide(){
      this.popShow = false
      document.querySelector('html').removeAttribute("class","isOpenNav")
    },
    removeFixed() {
      document.querySelector('html').removeAttribute("class","isOpenNav")
      document.getElementById('main').classList.remove('mainFixed')
    },
    toggleFixed() {
      document.querySelector('html').className="isOpenNav"
    },
    changeCode(code) {
      this.code = code
      this.popHide()
      this.$router.push({path: '/home/QuoteChart',query: { id: code, view: this.view, tabIndex: this.isTrue }})
    },
    GetUrlParam(paraName) {
      var url = document.location.toString()
      var arrObj = url.split('?')
      if (arrObj.length > 1) {
        var arrPara = arrObj[1].split('&')
        var arr
        for (var i = 0; i < arrPara.length; i++) {
          arr = arrPara[i].split('=')
          if (arr != null && arr[0] === paraName) {
            return arr[1]
          }
        }
        return ''
      } else {
        return ''
      }
    },
    clickPop(direct) {
      if (this.quote.notify[this.code].uchZone === 3) {
        this.isReference = !this.isReference
        this.errMessage = '参考行情，不提供交易服务'
      } else {
        if (this.attribute.enable === 3) {
          this.isReference = !this.isReference
          this.errMessage = '产品已过期，不可交易'
        } else if (this.attribute.enable === 0) {
          this.isReference = !this.isReference
          this.errMessage = '产品未激活，不可交易'
        } else if (this.attribute.enable === 2) {
          this.isReference = !this.isReference
          this.errMessage = '产品暂不可交易'
        } else {
          const tabIndex = Number(this.$route.query.tabIndex)
          if (this.user.loginname) {
            if (this.account.balance <= 0) {
              if (String(this.user.loginname).startsWith('68')) { this.$refs.rFunds.fundsPop() } else { this.$refs.dFunds.fundsPop() }
            } else {
              this.$router.push({path: '/home/QuoteBuy',query: { id: this.code,direct: direct,tabIndex}})
            }
          } else {
            this.isGuest = !this.isGuest
            this.toggleFixed()
          }
        }
      }
      return this.errMessage
    },
    getThisTimes() {
      var _this = this
      const yy = new Date().getFullYear()
      const mm = new Date().getMonth() + 1
      const dd = new Date().getDate()
      const hh = new Date().getHours()
      const mf =
        new Date().getMinutes() < 10
          ? '0' + new Date().getMinutes()
          : new Date().getMinutes()
      const ss =
        new Date().getSeconds() < 10
          ? '0' + new Date().getSeconds()
          : new Date().getSeconds()
      _this.gettime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
      return _this.gettime
    },
    goLogin() {
      this.$bus.$emit('loading', false)
      this.$router.push({ path: '/login' })
      this.removeFixed()
    },
    goAccount() {
      this.$bus.$emit('loading', false)
      this.$router.push({ path: '/register' })
    },
    guestPop() {
      this.isGuest = false
      this.removeFixed()
    },
    isSell: function(obj) {
      var val
      if (obj.preData) {
        if (Number(obj.ask) > Number(obj.preData.ask)) {
          val = 'rise'
        } else if (Number(obj.ask) < Number(obj.preData.ask)) {
          val = 'fall'
        } else {
          val = 'level'
        }
      } else {
        if (Number(obj.ask) > Number(obj.open)) {
          val = 'rise'
        } else if (Number(obj.ask) < Number(obj.open)) {
          val = 'fall'
        } else {
          val = 'level'
        }
      }
      return val
    },
    isBuy: function(obj) {
      var val
      if (obj.preData) {
        if (Number(obj.bid) > Number(obj.preData.bid)) {
          val = 'rise'
        } else if (Number(obj.bid) < Number(obj.preData.bid)) {
          val = 'fall'
        } else {
          val = 'level'
        }
      } else {
        if (Number(obj.bid) > Number(obj.open)) {
          val = 'rise'
        } else if (Number(obj.bid) < Number(obj.open)) {
          val = 'fall'
        } else {
          val = 'level'
        }
      }
      return val
    },
    goAttribute() {
      this.$bus.$emit('loading', false)
      if (!this.user.loginname) this.$router.push({ path: '/Login' })
      else {
        this.$router.push({
          path: '/home/Attribute',
          query: { id: this.code }
        })
      }
    }
  }
}
</script>
