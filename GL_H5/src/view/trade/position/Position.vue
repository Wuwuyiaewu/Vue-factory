<template>
  <div class="position">
    <NoData v-if="position.length<=0" :is-trade="isTrade" />
    <ul v-if="position.length>0">

      <li v-for="(item,index) in position" :key="index" @click="changeOperateId(index)" :class="{checked: showOperateId==index}">

        <div class="itemTit">
          <div class="leftCon">
            <span>{{ item.SName.aushGB }} <label class="shortname">{{item.SName.szShortName}}</label></span>
            <p><em :class="cutover(tradeUtil.OrderDirection[item.Direction])">{{ tradeUtil.OrderDirection[item.Direction] }}</em>{{ item.Volume }}手</p>
          </div>
          <div class="rightCon">#{{ item.ID }}</div>
        </div>

        <div class="itemCon">
          <div class="leftCon">
            <div class="itemList">
              <div class="item"><span>开仓:</span><p>{{ item.OpenPrice }}</p></div>
              <div class="item width"><span>当前:</span>
              <p
              :class="isRise(quote.symbolTickMap[item.SName.szShortName],item.Direction)"
              >{{ item.Direction==1?quote.symbolTickMap[item.SName.szShortName]?quote.symbolTickMap[item.SName.szShortName].ask:'':quote.symbolTickMap[item.SName.szShortName]?quote.symbolTickMap[item.SName.szShortName].bid:''}}
              <i :class="isRise(quote.symbolTickMap[item.SName.szShortName],item.Direction)"></i>
              </p>
              </div>
            </div>
            <div class="itemList">
              <div class="item"><span>止损:</span><p>{{ item.StopLoss == 0 ? "未设置" : item.StopLoss }}</p></div>
              <div class="item width"><span>止盈:</span><p>{{ item.TakeProfit == 0 ? "未设置" : item.TakeProfit }}</p></div>
            </div>
          </div>
          
          <div class="rightCon">
            <!--买-->
            <div v-if="item.Direction == 1" class="item">
              <!--直接货币：(卖出价-买入价)*合约单位*手数-->
              <span v-if="item.symbolData.stockType == 0" :class="buyGainP(item,0,0)">{{buyGainP(item,0,1)}}</span>
              <!--间接货币：(卖出价-买入价)*合约单位*手数/美元相对货币卖出即时汇率-->
              <span v-if="item.symbolData.stockType == 1" :class="buyGainP(item,1,0)">{{buyGainP(item,1,1)}}</span>
              <!--交叉货币直接货币:(卖出价-买入价)*合约单位*手数*该相对货币对兑美元卖出方向的即时汇率-->
              <span v-if="item.symbolData.stockType == 2" :class="buyGainP(item,2,0)">{{buyGainP(item,2,1)}}</span>
              <!--交叉货币间接货币:(卖出价-买入价)*合约单位*手数/该相对货币对兑美元卖出方向的即时汇率-->
              <span v-if="item.symbolData.stockType == 3" :class="buyGainP(item,3,0)">{{buyGainP(item,3,1)}}</span>
              <!--港股货币：(卖出价-买入价)*合约单位*手数/美元港元汇率-->
              <span v-if="item.symbolData.stockType == 71" :class="buyGainP(item,71,0)">{{buyGainP(item,71,1)}}</span>
            </div>
            <!--卖-->
            <div v-else-if="item.Direction == 2" class="item">
              <!--直接货币：(卖出价-买入价)*合约单位*手数-->
              <span v-if="item.symbolData.stockType == 0" :class="sellGainP(item,0,0)">{{sellGainP(item,0,1)}}</span>
              <!--间接货币：(卖出价-买入价)*合约单位*手数/美元相对货币卖出即时汇率-->
              <span v-if="item.symbolData.stockType == 1" :class="sellGainP(item,1,0)">{{sellGainP(item,1,1)}}</span>
              <!--交叉货币直接货币:(卖出价-买入价)*合约单位*手数*该相对货币对兑美元卖出方向的即时汇率-->
              <span v-if="item.symbolData.stockType == 2" :class="sellGainP(item,2,0)">{{sellGainP(item,2,1)}}</span>
              <!--交叉货币间接货币:(卖出价-买入价)*合约单位*手数/该相对货币对兑美元卖出方向的即时汇率-->
              <span v-if="item.symbolData.stockType == 3" :class="sellGainP(item,3,0)">{{sellGainP(item,3,1)}}</span>
              <!--港币货币：(卖出价-买入价)*合约单位*手数/美元港元卖出即时汇率-->
              <span v-if="item.symbolData.stockType == 71" :class="sellGainP(item,71,0)">{{sellGainP(item,71,1)}}</span>
            </div>
            <time>{{ item.OpenTime|time }}</time>
          </div>
        </div>

        <div class="operate" v-if="showOperateId==index">
          <span @click="goPositionChart(item.SName.uiCodeID,item.ID,1)">图表</span>
          <span @click="goPositionChart(item.SName.uiCodeID,item.ID,2)">平仓</span>
          <span @click="goPositionChart(item.SName.uiCodeID,item.ID,3)">设置止盈止损</span>
        </div>

      </li>
    </ul>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import NoData from '@/view/NoData.vue'
import TradeUtil from '@/utils/tradeUtil'
import Util from '@/utils/tradeDataUtil'
export default {
  filters: {
    time(longTime) {
      return Util.formatDate(longTime, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  components: { NoData },
  computed: {
    ...mapState(['tradeData', 'quote']),
    position: {
      get() {
        // 深度拷贝并复制持仓列表数据
        return this.tradeData.position
      }
    }
  },
  data() {
    return {
      util: Util,
      tradeUtil: TradeUtil,
      isShow: false,
      isTrade: true,
      showOperateId: 0
    }
  },
  methods: {
    goPositionChart(codeId, id, operateId) {
      this.$bus.$emit('loading', false)
      if(operateId == 1){
        //图表
        this.$bus.$emit('loading', false)
        this.$router.push({ path: '/home/QuoteChart', query: { id: codeId, view: 'view' }})
        //this.$router.push({ path: '/home/PositionChart', query: { id: codeId, positionId: id, operateId }})
      }else if(operateId == 2){
        //平仓
        this.$bus.$emit('loading', false)
        this.$router.push({ path: '/home/PositionChart', query: { id: codeId, positionId: id, operateId }})
      }else if(operateId == 3){
        //设置止盈止损
        this.$bus.$emit('loading', false)
        this.$router.push({ path: '/home/PositionChart', query: { id: codeId, positionId: id, operateId }})
      }
    },
    cutover: function(obj) {
      var val
      if (obj == '买入') {
        val = 'rise'
      } else if (obj == '卖出') {
        val = 'fall'
      }
      return val
    },
    buyGain: function(obj) {
      var val
      if (obj > 0) {
        val = 'rise'
      } else if (obj == 0) {
        val = 'level'
      } else {
        val = 'fall'
      }
      return val
    },
    buyGainP: function(item,type,num){
      var res = 0
      if(item && this.quote.symbolTickMap[item.SName.szShortName]){
        if(type == 0){
          res = this.util.accAdd(((this.quote.symbolTickMap[item.SName.szShortName].ask - item.OpenPrice)*item.symbolData.contractSize*item.Volume),item.Swap)
        }else if(type == 1){
          res = this.util.accAdd(((this.quote.symbolTickMap[item.SName.szShortName].ask - item.OpenPrice)*item.symbolData.contractSize*item.Volume/this.quote.symbolTickMap[item.SName.szShortName].ask),item.Swap)
        }else if(type == 2){
          res = this.util.accAdd(((this.quote.symbolTickMap[item.SName.szShortName].ask - item.OpenPrice)*item.symbolData.contractSize*item.Volume*this.quote.symbolTickMap[item.symbolData.relateSymbol].ask),item.Swap)
        }else if(type == 3){
          res = this.util.accAdd(((this.quote.symbolTickMap[item.SName.szShortName].ask - item.OpenPrice)*item.symbolData.contractSize*item.Volume/this.quote.symbolTickMap[item.symbolData.relateSymbol].ask),item.Swap)
        }else if(type == 71){
          res = this.util.accAdd(((this.quote.symbolTickMap[item.SName.szShortName].ask - item.OpenPrice)*item.symbolData.contractSize*item.Volume/this.quote.symbolTickMap["USDHKD"].ask),item.Swap)
        }
      }

      if(num == 1){
        return res.toFixed(2)
      }

      var val
      if (res > 0) {
        val = 'rise'
      } else if (res == 0) {
        val = 'level'
      } else {
        val = 'fall'
      }
      return val
    },
    sellGain: function(obj) {
      var val
      if (obj > 0) {
        val = 'rise'
      } else if (obj == 0) {
        val = 'level'
      } else {
        val = 'fall'
      }
      return val
    },
    sellGainP: function(item,type,num) {
      var res = 0
      if(item && this.quote.symbolTickMap[item.SName.szShortName]){
        if(type == 0){
          res = this.util.accAdd(((item.OpenPrice - this.quote.symbolTickMap[item.SName.szShortName].bid)*item.symbolData.contractSize*item.Volume),item.Swap)
        }else if(type == 1){
          res = this.util.accAdd(((item.OpenPrice - this.quote.symbolTickMap[item.SName.szShortName].bid)*item.symbolData.contractSize*item.Volume/this.quote.symbolTickMap[item.SName.szShortName].bid),item.Swap)
        }else if(type == 2){
          res = this.util.accAdd(((item.OpenPrice - this.quote.symbolTickMap[item.SName.szShortName].bid)*item.symbolData.contractSize*item.Volume*this.quote.symbolTickMap[item.symbolData.relateSymbol].bid),item.Swap)
        }else if(type == 3){
          res = this.util.accAdd(((item.OpenPrice - this.quote.symbolTickMap[item.SName.szShortName].bid)*item.symbolData.contractSize*item.Volume/this.quote.symbolTickMap[item.symbolData.relateSymbol].bid),item.Swap)
        }else if(type == 71){
          res = this.util.accAdd(((item.OpenPrice - this.quote.symbolTickMap[item.SName.szShortName].bid)*item.symbolData.contractSize*item.Volume/this.quote.symbolTickMap["USDHKD"].bid),item.Swap)
        }
      }

      if(num == 1){
        return res.toFixed(2)
      }

      var val
      if (res > 0) {
        val = 'rise'
      } else if (res == 0) {
        val = 'level'
      } else {
        val = 'fall'
      }
      return val
    },
    changeOperateId(index){
      this.showOperateId = index
    },
    isRise: function(obj, directType) {
      let val
      const direct = directType == 1 ? 'bid' : 'ask'
      if (obj.preData) {
        if (Number(obj[direct]) > Number(obj.preData[direct])) {
          val = 'rise'
        } else if (Number(obj[direct]) < Number(obj.preData[direct])) {
          val = 'fall'
        } else {
          val = 'level'
        }
      } else {
        if (Number(obj[direct]) > Number(obj.open)) {
          val = 'rise'
        } else if (Number(obj[direct]) < Number(obj.open)) {
          val = 'fall'
        } else {
          val = 'level'
        }
      }
      return val
    }
  }
}
</script>
