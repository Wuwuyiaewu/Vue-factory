<template>
  <div class="trade">
    <div class="navTitle">
      <div class="navItem">
        <img
          class="back"
          src="@/assets/images/nav/a_top_return_w.png"
          @click="back"
        >
        <span class="changeAccount">{{ String(user.loginname).startsWith('68')?'真实':'模拟' }}账户</span>
        <p class="fund" @click="goQuotation()">新订单</p>
      </div>
    </div>

    <div class="proParam">
      <div class="paramList">
        <div class="item">
          <ul>
            <li>
              <span>{{account.loginName}}</span>
              <p>账户($)</p>
            </li>
            <li :class="{'checked':isAsterisk}">
              <span :class="profitClass(profitTotal)"><em>+</em>{{ isAsterisk?"*******":profitTotal?Number(profitTotal || 0.00).toFixed(2):'--' }}</span>
              <p>盈亏</p>
            </li>
            <li>
              <span>{{ isAsterisk?"*******":account.balance?Number(util.accSub(util.accAdd(account.balance,profitTotal || 0),account.take || 0)).toFixed(2):'--' }}</span>
              <p>可用</p>
            </li>
            <li>
              <span>{{ isAsterisk?"*******":account.balance?account.balance:'--' }}</span>
              <p>余额</p>
            </li>
          </ul>
          <ul v-if="isShow">
            <li>
              <span>{{ isAsterisk?"*******":account.balance?Number(util.accAdd(account.balance,profitTotal || 0.00)).toFixed(2):'--' }}</span>
              <p>净值</p>
            </li>
            <li>
              <span>{{ isAsterisk?"*******":account.take?account.take:'--' }}</span>
              <p>占用</p>
            </li>
            <li v-if="account.balance && account.take != 0">
              <span>{{ isAsterisk?"*******":((Number(util.accAdd(account.balance,profitTotal || 0))/(account.take)*100)).toFixed(2)+'%' }}</span>
              <p>按金水平</p>
            </li>
            <li v-else>
              <span>{{ isAsterisk?"*******":"--" }}</span>
              <p>按金水平</p>
            </li>
            <li>
              <span>{{ isAsterisk?"*******":account.marginStopout?(account.marginStopout == 0?'--':account.marginStopout):'--' }}</span>
              <p>强制平仓点</p>
            </li>
            
          </ul>
        </div>
        <span
          class="itemArrow"
          @click="clickArrows"
          :class="{'checked':isShow}"
        />
      </div>
    </div>

    <div class="tradeBlank"></div>

    <div class="tradeCon">
      <div
        class="tradeNav"
        :class="{paddingTop:isTrue==4}"
      >
        <ul>
          <li
            v-for="(item,index) in tabs"
            :class="{checked:isTrue == index}"
            @click="tabclick(index)"
            :key="index"
          >{{ item }}
          </li>
        </ul>
      </div>
      <div
        v-if="isTrue==0"
        class="tradeList"
      >
        <Position />
      </div>
      <div
        v-if="isTrue==1"
        class="tradeList"
      >
        <Pending />
      </div>
      <div
        v-if="isTrue==2"
        class="tradeList"
      >
        <DayDeal />
      </div>
      <div
        v-if="isTrue==3"
        class="tradeList"
      >
        <DayProfit />
      </div>
      <div
        v-if="isTrue==4"
        class="tradeList"
      >
        <More />
      </div>
      <Tab />
    </div>
  </div>
</template>
<script>
require('@/assets/css/trade.css')
import Position from './position/Position.vue'
import Pending from './position/Pending.vue'
import DayDeal from './position/DayDeal.vue'
import DayProfit from './position/DayProfit.vue'
import More from './position/More.vue'
import Tab from '@/components/Tab.vue'
import { mapState } from 'vuex'
import Util from '@/utils/tradeDataUtil'
import TradeUtil from '@/utils/tradeUtil'
export default {
  name: 'Trade',
  components: {
    Position, Pending, DayDeal, DayProfit, More, Tab
  },
  data() {
    return {
      sign: process.env.VUE_APP_GA_SIGN,
      util: Util,
      isShow: false,
      isChoose: true,
      isTrue: 0,
      isAsterisk: false
    }
  },
  computed: {
    ...mapState(['account', 'tradeData', 'quote', 'user']),
    /* 盈亏*/
    profitTotal: {
      get() {
        if (this.tradeData.position.length <= 0) return 0
        const data = this.tradeData.position
        let total = 0.00
        for (const i in data) {
          if (!this.quote.symbolTickMap[data[i].SName.szShortName]) return null
          let sub = 0
          if (data[i].Direction == 1) { // 买
            sub = Util.accSub(this.quote.symbolTickMap[data[i].SName.szShortName].ask, data[i].OpenPrice)
          } else {
            sub = Util.accSub(data[i].OpenPrice, this.quote.symbolTickMap[data[i].SName.szShortName].bid)
          }
          const profit = TradeUtil.changeCurrency(sub, this.quote.symbolTickMap[data[i].SName.szShortName].ask, this.quote.symbolTickMap[data[i].SName.szShortName].bid, data[i].Volume, data[i].symbolData, this.quote.symbolTickMap, data[i].Direction)
          total = Util.accAdd(total, profit)
          total = Util.accAdd(total, data[i].Swap)
        }
        return Number(total).toFixed(2)
      }
    },
    tabs: function() {
      if(String(this.user.loginname).startsWith("68")){
        return ['持仓','挂单','当日成交','当日盈亏','更多']
      }else{
        return ['持仓','挂单','当日成交','当日盈亏']
      }
    }
  },
  mounted() {
    this.$bus.$emit('loading', true)
    this.removeFixed()
    window.scrollTo(0, 0)
    if (this.$route.query.type) this.isTrue = this.$route.query.type
  },
  activated() {
    this.$bus.$emit('loading', true)
    this.removeFixed()
    window.scrollTo(0, 0)
    if (this.$route.query.type) this.isTrue = this.$route.query.type
  },
  methods: {
    back() {
      this.$router.push({ path: '/home' })
    },
    removeFixed() {
      const mainH = document.getElementById('main')
      mainH.classList.remove('mainFixed')
    },
    goQuotation() {
      this.$bus.$emit('loading', false)
      this.$router.push({ path: '/home/Quotation' })
    },
    clickArrows() {
      this.isShow = !this.isShow
      var val = 'checked'
      return val
    },
    tabclick: function(index) {
      this.$router.push({ path: '/home/Trade', query: { type: index }})
      this.isTrue = index
      if (this.isTrue == 4) {
        this.isChoose = !this.isChoose
      } else {
        this.isChoose = true
      }
      return this.isChoose
    },
    profitClass: function(obj) {
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
    asterisk() {
      this.isAsterisk = !this.isAsterisk
    }
  }
}
</script>
