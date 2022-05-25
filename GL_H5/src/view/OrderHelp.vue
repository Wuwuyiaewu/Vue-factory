<template>
  <div class="orderHelp headNav">
    <div class="navTitle">
      <div class="navItem">
        <img src="@/assets/images/nav/a_top_close.png" @click="back">
        <span>下单帮助</span>
      </div>
    </div>
    <div class="content">
      <div class="conList">
        <span>手数</span>
        <ul>
          <li><p>交易的每笔数量</p></li>
          <li>
            <div class="item"><p>合约单位</p><p>{{ quote.notify[$route.query.id].aushGB }}</p></div>
            <div class="item"><p>基准货币</p><p>{{ attribute.baseCurrency }}</p></div>
            <div class="item"><p>收益货币</p><p>{{ attribute.profitCurrency }}</p></div>
            <div class="item"><p>每笔交易手数</p><p>{{ attribute.minVolumes }}手-{{ attribute.maxVolumes }}手</p></div>
          </li>
        </ul>
      </div>
      <div class="conList">
        <span>止损止盈</span>
        <ul>
          <li><p>表示自动平仓的价格或者点数（点数设置后按“开仓价格+-点数”换算为价格），当订单到达设定的止损止盈价位时，系统将自动平仓。</p></li>
        </ul>
      </div>
      <div class="conList">
        <span>保证金</span>
        <ul>
          <li><p>是指在市价下单时，成交价与当前报价的最大差价，成交价需要在该差价范围内才可成交</p></li>
          <li>
            <div class="item"><p>产品名</p><p>{{ quote.notify[$route.query.id].aushGB }}</p></div>
            <div v-if="!group.marginType || group.marginType == 0" class="item"><p>初始保证金</p><p>{{ attribute.marginInitial }}美元/手</p></div>
            <div v-else-if="marginList.length == 0" class="item"><p>初始保证金</p><p>0.00美元/手</p></div>
            <div v-else-if="marginList.length > 0" class="item">
              <div class="itemCon" @click="margin"><p>初始保证金</p><p>最低{{ marginList[0].MarginInitial }}美元/手<em :class="{'checked':marginShow}" /></p></div>
              <div v-if="marginShow" class="itemCon flex">
                <div class="itemWidth">
                  <div class="widthCon"><p>手数范围</p><p>保证金要求</p></div>
                  <div v-for="item in marginList" class="widthCon"><p>{{ item.RangeMin }}手数≤{{ item.RangeMax }}</p><p>{{ item.MarginInitial }} </p></div>
                </div>
              </div>
            </div>
            <div v-if="!group.marginType || group.mainType == 0" class="item"><p>假期保证金</p><p>{{ attribute.holidayMarginInitial }}美元/手</p></div>
            <div v-else-if="marginList.length == 0" class="item"><p>假期保证金</p><p>0.00美元/手</p></div>
            <div v-else-if="marginList.length > 0" class="item">
              <div class="itemCon" @click="margins"><p>假期保证金</p><p>最低{{ marginList[0].HolidayMarginInitial }}美元/手<em :class="{'checked':marginShows}" /></p></div>
              <div v-if="marginShows" class="itemCon flex">
                <div class="itemWidth">
                  <div class="widthCon"><p>手数范围</p><p>保证金要求</p></div>
                  <div v-for="item in marginList" class="widthCon"><p>{{ item.RangeMin }}手数≤{{ item.RangeMax }}</p><p>{{ item.HolidayMarginInitial }}</p></div>
                </div>
              </div>
            </div>
            <div v-if="!group.marginType || group.mainType == 0" class="item"><p>锁仓保证金</p><p>锁仓订单保证金总和的{{ attribute.marginHedged }}%</p></div>
            <div v-else-if="marginList.length == 0" class="item"><p>锁仓保证金</p><p>锁仓订单保证金总和的0%</p></div>
            <div v-else-if="marginList.length > 0" class="item"><p>锁仓保证金</p><p>锁仓订单保证金总和的{{ marginList[0].MarginHedged }}%</p></div>
          </li>
        </ul>
      </div>
      <div class="conList">
        <span>最大偏差</span>
        <ul>
          <li><p>是指在市价下单时，成交价与当前报价的最大差价，成交价需要在该差价范围内才可成交</p></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Util from '@/utils/tradeDataUtil'
import TradeUtil from '@/utils/tradeUtil'

export default {
  name: 'OrderHelp',
  computed: {
    ...mapState(['quote', 'symbolInfo', 'serverInfo', 'group']),
    // 基础信息
    attribute: {
      get() {
        if (this.quote.notify[this.$route.query.id]) {
          const sourceCode = this.quote.notify[this.$route.query.id].uiSourceCode
          return this.symbolInfo.codeMap[sourceCode] || {}
        }
        return {}
      }
    },
    // 保证金
    marginList: {
      get() {
        let arr = []
        if (this.attribute.id) {
          arr = TradeUtil.getMarginLevel(this.attribute.id)
        }
        return arr
      }
    }
  },
  data() {
    return {
      tradeUtil: TradeUtil,
      marginShow: false,
      marginShows: false
    }
  },
  mounted() {
    this.removeFixed()
    this.$bus.$emit('loading', true)
  },
  activated() {
    this.removeFixed()
    this.$bus.$emit('loading', true)
  },
  methods: {
    back() {
      if (this.$route.query.type == 0) {
        this.$bus.$emit('loading', false)
        this.$router.replace({ path: '/home/Trade' })
      } else {
        this.$router.go(-1)
      }
    },
    removeFixed() {
      const mainH = document.getElementById('main')
      mainH.classList.remove('mainFixed')
    },
    margin() {
      this.marginShow = !this.marginShow
    },
    margins() {
      this.marginShows = !this.marginShows
    }
  }
}
</script>
