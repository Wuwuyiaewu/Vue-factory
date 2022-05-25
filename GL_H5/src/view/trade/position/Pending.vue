<template>
  <div class="position pending">
    <NoData v-if="pending.length<=0" :is-trade="isTrade" />
    <ul v-if="pending.length>0">
      <li v-for="(item,index) in pending" :key="index" @click="changeOperateId(index)" :class="{checked: showOperateId==index}">

        <div class="itemTit">
          <div class="leftCon">
            <span v-if="item.SName">{{ item.SName.aushGB }} <label class="shortname">{{item.SName.szShortName}}</label></span>
            <p><em :class="cutover(tradeUtil.OrderDirection[item.Direction])">{{ tradeUtil.OrderDirection[item.Direction] }}</em>{{ item.RequestVolume }}手</p>
          </div>
          <div class="rightCon">#{{ item.ID }}</div>
        </div>

        <div class="itemCon">
          <div class="leftCon">
            <div class="itemList">
              <div class="item"><span>挂单:</span><p>{{ item.RequestPrice }}</p></div>
              <div class="item width"><span>当前:</span><p :class="isRise(quote.symbolTickMap[item.SName.szShortName],item.Direction)">{{ quote.symbolTickMap[item.SName.szShortName][item.Direction == 1 ? 'bid':'ask'] }} <i :class="isRise(quote.symbolTickMap[item.SName.szShortName],item.Direction)"></i></p></div>
            </div>
            <div class="itemList">
              <div class="item"><span>止损:</span><p>{{item.StopLoss == 0 ? "未设置" : item.StopLoss}}</p></div>
              <div class="item width"><span>止盈:</span><p>{{item.TakeProfit == 0 ? "未设置" : item.TakeProfit}}</p></div>
            </div>
          </div>
          <div class="rightCon">
            <div class="item"><span>{{ item.ExpireType == 1?'当日有效':'当周有效' }}</span></div>
            <time>{{ item.RequestTime|time }}</time>
          </div>
        </div>

        <div class="operate" v-if="showOperateId==index">
          <span @click="goPendingChart(item.SName.uiCodeID,item.ID,1,item)">图表</span>
          <span @click="goPendingChart(item.SName.uiCodeID,item.ID,2,item)">改单</span>
          <span @click="goPendingChart(item.SName.uiCodeID,item.ID,3,item)">撤单</span>
        </div>
      </li>
    </ul>
    <WithdrawalPop v-if="isWithdrawalPop" ref="child1" :pending="chosePending" />
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import TradeUtil from '@/utils/tradeUtil'
import NoData from '@/view/NoData.vue'
import WithdrawalPop from '@/view/trade/tradePop/WithdrawalPop'

export default {
  filters: {
    time(longTime) {
      return moment(new Date(longTime * 1000)).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  components: { NoData,WithdrawalPop },
  computed: {
    ...mapState(['tradeData', 'quote']),
    pending: {
      get() {
        return this.tradeData.pending
      }
    }
  },
  mounted() {
  },
  data() {
    return {
      tradeUtil: TradeUtil,
      isTrade: true,
      showOperateId: 0,
      isWithdrawalPop: false,
      chosePending: ""
    }
  },
  methods: {
    goPendingChart(codeId, id, operateId, item) {

      if(operateId == 1){
        //图表
        this.$bus.$emit('loading', false)
        this.$router.push({ path: '/home/QuoteChart', query: { id: codeId, view: 'view' }})
        //this.$router.push({ path: '/home/PendingChart', query: { codeId: codeId, pendId: id }})
      }else if(operateId == 2){
        //改单操作
        this.$bus.$emit('loading', false)
        this.$router.push({ path: '/home/PendingModify', query: { codeId: codeId, pendId: id }})
      }else if(operateId == 3){
        //撤单操作
        this.chosePending = item
        this.isWithdrawalPop = true
        this.$nextTick(() => {
          this.$refs.child1.clickWithdrawal()
        })
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
    changeOperateId(index){
      this.showOperateId = index
    },
    isRise: function(obj, directType) {
      let val
      if (obj.preData) {
        if (Number(directType == 1 ? obj.bid : obj.ask) > Number(directType == 1 ? obj.preData.bid : obj.preData.ask)) {
          val = 'rise'
        } else if (Number(directType == 1 ? obj.bid : obj.ask) < Number(directType == 1 ? obj.preData.bid : obj.preData.ask)) {
          val = 'fall'
        } else {
          val = 'level'
        }
      } else {
        if (Number(directType == 1 ? obj.bid : obj.ask) > Number(obj.open)) {
          val = 'rise'
        } else if (Number(directType == 1 ? obj.bid : obj.ask) < Number(obj.open)) {
          val = 'fall'
        } else {
          val ='level'
        }
      }
      return val
    }
  }
}
</script>
