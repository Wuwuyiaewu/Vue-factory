<template>
  <div class="sucOrdered">

    <div class="navTitle">
      <div class="navItem">
        <img
          class="back"
          src="@/assets/images/quotation/chars_back.png"
          @click="back"
        >
        <p>{{ quoteSymbol.aushGB }}</p>
        <p class="symbol">{{ util.getShowPrdCode($route.query.Symbol).replace("_GCP","").replace(" GCP","") }}</p>
      </div>
    </div>

    <div class="sucImg"><img :src="require('@/assets/images/trade/trade_success.png')"><span>止损止盈修改成功！</span></div>
    <div class="sucList">
      <ul>
        <li><p>持仓编号</p><span>{{ $route.query.ID }}</span></li>
        <li><p>持仓产品</p>
          <span>
            {{ quoteSymbol.aushGB }}
          </span>
        </li>
        <li v-if="$route.query.StopLoss != 0"><p>{{ $route.query.setStopLossTip?'止损点数':'止损价格' }}</p><span><span v-if="$route.query.setStopLossTip" class="inline">{{ $route.query.setStopLossTip }}点<em>－</em></span>{{ Number($route.query.StopLoss).toFixed(marketInfo.symbolData.digits) }}</span></li>
        <li v-else><p>止损价格</p><span>未设置</span></li>
        <li v-if="$route.query.TakeProfit != 0"><p>{{ $route.query.setStopProfitTip?'止盈点数':'止盈价格' }}</p><span><span v-if="$route.query.setStopProfitTip" class="inline">{{ $route.query.setStopProfitTip }}点<em>－</em></span>{{ Number($route.query.TakeProfit).toFixed(marketInfo.symbolData.digits) }}</span></li>
        <li v-else><p>止盈价格</p><span>未设置</span></li>
        <li><p>更新时间</p><span>{{$route.query.CloseTime | time_His}}</span></li>
      </ul>
    </div>
    <div class="sucBtn only">
      <span @click="closeSuc(0)">查看持仓</span>
    </div>
  </div>
</template>

<script>
require('@/assets/css/sucOrdered.css')
import { mapState } from 'vuex'
import Util from '@/utils/tradeDataUtil'
import quoteUtil from '@/utils/quoteUtil'
export default {
  data() {
    return {
      util: Util,
      quoteUtil,
      source: this.$route.query.source
    }
  },
  filters: {
    time_His(longTime){
      if(longTime){
        return Util.formatDate(longTime, 'yyyy-MM-dd hh:mm:ss')
      }
    }
  },
  computed: {
    ...mapState(['quote', 'symbolInfo']),
    marketInfo: {
      code: {
        get() {
          if (this.quoteSymbol) return this.quoteSymbol.uiCodeID
          return ''
        }
      },
      get() {
        var symbolData = {}
        var tick = {}
        if (this.quote.symbolNotify && this.quoteSymbol) {
          const code = this.quoteSymbol.uiCodeID
          if (code && this.quote.notify[code]) {
            const source = this.quote.notify[code].uiSourceCode
            if (this.symbolInfo.codeMap[source]) symbolData = this.symbolInfo.codeMap[source]
          }
          if (code && this.quote.codeTickMap && this.quote.codeTickMap[code]) tick = this.quote.codeTickMap[code]
        }
        return {
          symbolData: symbolData,
          tick: tick
        }
      }
    },
    quoteSymbol: function() {
      return this.quoteUtil.getSybmolBySourceCode(this.source)
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
      //this.$bus.$emit('loading', false)
      //this.$router.push({ path: '/home/PositionChart', query: { id: this.code, positionId: this.id }})
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
    closeSuc(type) {
      this.toggleFixed()
      this.$bus.$emit('loading', false)
      this.$router.replace({ path: '/home/Trade', query: { type: type }})
    }
  }
}
</script>
