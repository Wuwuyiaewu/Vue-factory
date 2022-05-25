<template>
  <div class="tradeModify">

    <div class="navTitle">
      <div class="navItem">
        <img
          class="back"
          :src="require('@/assets/images/nav/a_top_return_w.png')"
          @click="back"
        >
        <p>{{ position.SName ? position.SName.aushGB:"" }}</p>
        <p class="symbol">{{ position.SName ? position.SName.szShortName:"" }}</p>
      </div>
    </div>

    <!-- <Charts
      :code="Number(code)"
      :is-slider="isSlider"
      @changeCode="changeCode"
    /> -->

    <!-- <div class="orderCon">
      <ul>
        <li>
          <p>持仓编号</p><span>{{ position.ID }}</span>
        </li>
        <li>
          <p>手数</p><span>{{ position.Volume }}</span>
        </li>
        <li>
          <p>开仓日期</p><span>{{ position.OpenTime|time }}</span>
        </li>
        <li>
          <p>佣金</p><span>{{ position.Commission }}</span>
        </li>
        <li v-if="position.StopLoss != 0">
          <p>止损价格</p><span>{{ position.StopLoss }}</span>
        </li>
        <li v-else>
          <p>止损价格</p><span>未设置</span>
        </li>
      </ul>

      <ul>
        <li>
          <p>产品方向</p><span>{{ position.Direction==1?'买入':'卖出' }}</span>
        </li>
        <li>
          <p>开仓价格</p><span>{{ position.OpenPrice }}</span>
        </li>
        <li>
          <p>浮动盈亏</p><span>{{ profit > 0?'+':'-' }}<em>${{ Math.abs(profit) }}</em></span>
        </li>
        <li>
          <p>利息</p><span>{{ position.Swap }}</span>
        </li>
        <li v-if="position.TakeProfit != 0">
          <p>止盈价格</p><span>{{ position.TakeProfit }}</span>
        </li>
        <li v-else>
          <p>止盈价格</p><span>未设置</span>
        </li>
      </ul>
    </div> -->
    
    <!-- <div class="btn">
      <span
        :class="position.ID?'':'err'"
        @click="clickPosPop"
      >平仓</span>

      <span
        :class="position.ID?'':'err'"
        @click="clickModifyPop"
      >修改止损止盈</span>
    </div> -->

    <!-- <navFloat /> -->
    <PositionPop
      v-if="isPositionPop"
      ref="child"
      :position="position"
      :code="code"
    />
    <ModifyStopLoss
      v-if="isModifyPop"
      ref="child1"
      :position="position"
      :code="code"
    />
  </div>
</template>
<script>
require('@/assets/css/tradeModify.css')
import navFloat from '@/components/navFloat'
import Charts from '@/view/quotation/Charts'
import PositionPop from '@/view/trade/tradePop/PositionPop'
import ModifyStopLoss from '@/view/trade/tradePop/ModifyStopLoss'
import { mapState } from 'vuex'
import Util from '@/utils/tradeDataUtil'
import TradeUtil from '@/utils/tradeUtil'
export default {
  name: 'PositionChart',
  components: {
    Charts, PositionPop, ModifyStopLoss, navFloat
  },
  filters: {
    time(longTime) {
      return Util.formatDate(longTime, 'MM/dd hh:mm:ss')
    }
  },
  data() {
    return {
      code: this.$route.query.id || '',
      id: this.$route.query.positionId || '',
      isPosition: false,
      isModify: false,
      isSlider: false,
      isModifyPop: false,
      isPositionPop: false,
      operateId: Number(this.$route.query.operateId) || 0,
    }
  },
  computed: {
    ...mapState(['tradeData', 'quote']),
    position: {
      get() {
        if (this.tradeData.position && this.tradeData.position.length > 0) {
          for (const i in this.tradeData.position) {
            if (Number(this.tradeData.position[i].ID) === Number(this.id)) {
              return { ...this.tradeData.position[i] }
            }
          }
        }
        return {}
      }
    },
    closePrice: {
      get() {
        if (!this.position.SName || !this.quote.symbolTickMap[this.position.SName.szShortName]) return ''
        return this.position.Direction == 1 ? this.quote.symbolTickMap[this.position.SName.szShortName].ask : this.quote.symbolTickMap[this.position.SName.szShortName].bid
      }
    },
    /* 盈亏*/
    profit: {
      get() {
        if (this.position.symbolData) {
          const ask = this.quote.symbolTickMap[this.position.SName.szShortName].ask
          const bid = this.quote.symbolTickMap[this.position.SName.szShortName].bid
          let sub = Util.accSub(this.closePrice, this.position.OpenPrice)
          if (this.position.Direction == 2) sub = Util.accSub(this.position.OpenPrice, this.closePrice)
          const profit = Util.accAdd(TradeUtil.changeCurrency(sub, ask, bid, this.position.Volume, this.position.symbolData, this.quote.symbolTickMap, this.position.Direction), this.position.Swap)
          return Number(profit).toFixed(2)
        }
        return ''
      }
    }
  },
  mounted() {
    this.$bus.$emit('loading', true)
    this.removeFixed()
  },
  watch: {
    position: {
      handler(newValue, oldValue) {
        if(newValue){
          if(this.operateId == 2){
            this.clickPosPop()
          }else if(this.operateId == 3){
            this.clickModifyPop()
          }
          
        }
      },
      immediate: true
    }
  },
  methods: {
    removeFixed() {
      const mainH = document.getElementById('main')
      mainH.classList.remove('mainFixed')
    },
    changeCode(code) {
      this.code = code
      this.$router.replace({ path: '/home/PositionChart', query: { id: code }})
    },
    GetUrlParam(paraName) {
      var url = document.location.toString()
      var arrObj = url.split('?')

      if (arrObj.length > 1) {
        var arrPara = arrObj[1].split('&')
        var arr

        for (var i = 0; i < arrPara.length; i++) {
          arr = arrPara[i].split('=')

          if (arr != null && arr[0] == paraName) {
            return arr[1]
          }
        }
        return ''
      } else {
        return ''
      }
    },
    back() {
      this.$router.go(-1)
    },
    clickPosPop() {
      if (!this.position.ID) return
      this.isPositionPop = true
      this.$nextTick(() => {
        this.$refs.child.clickPosPop()
      })
    },
    clickModifyPop() {
      if (!this.position.ID) return
      this.isModifyPop = true
      this.$nextTick(() => {
        this.$refs.child1.clickModifyPop()
      })
    }
  }

}
</script>
