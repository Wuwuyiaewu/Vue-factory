<template>
  <div class="tradeChart">
    <Charts :code="Number(code)" :is-slider="isSlider" @changeCode="changeCode" />
    <div v-if="pending.ID" class="orderCon">
      <ul>
        <li><p>订单编号</p><span>{{ pending.ID }}</span></li>
        <li><p>手数</p><span>{{ pending.RequestVolume }}</span></li>
        <li><p>挂单日期</p><span>{{ pending.RequestTime|time }}</span></li>
        <li v-if="pending.TakeProfit != 0"><p>止盈价格</p><span>{{ pending.TakeProfit }}</span></li>
        <li v-else><p>止盈价格</p><span>未设置</span></li>
      </ul>
      <ul>
        <li><p>产品方向</p><span>{{ pending.Direction==1?'买入':'卖出' }}</span></li>
        <li><p>挂单价格</p><span>{{ pending.RequestPrice }}</span></li>
        <li v-if="pending.StopLoss != 0"><p>止损价格</p><span>{{ pending.StopLoss }}</span></li>
        <li v-else><p>止损价格</p><span>未设置</span></li>
        <li><p>有效期</p><span>{{ pending.ExpireType==1?'当日':'当周' }}</span></li>
      </ul>
    </div>
    <div class="btn">
      <span :class="pending.ID?'':'err'" @click="clickWithdrawal">撤单</span>
      <span :class="pending.ID?'':'err'" @click="clickPending">修改挂单</span>
    </div>
    <!-- <navFloat /> -->
    <PendingPop v-if="isPendingPop" ref="child" :pending="pending" :code="code" />
    <WithdrawalPop v-if="isWithdrawalPop" ref="child1" :pending="pending" />
  </div>
</template>
<script>
require('@/assets/css/tradeChart.css')
import VeCandle from 'v-charts/lib/candle.common'
import Charts from '@/view/quotation/Charts'
import navFloat from '@/components/navFloat'
import PendingPop from '@/view/trade/tradePop/PendingPop'
import WithdrawalPop from '@/view/trade/tradePop/WithdrawalPop'
import { mapState } from 'vuex'
import TradeUtil from '@/utils/tradeUtil'
import Util from '@/utils/tradeDataUtil'

export default {
  name: 'PendingChart',
  components: {
    VeCandle, Charts, PendingPop, WithdrawalPop, navFloat
  },
  filters: {
    time(longTime) {
      if (!longTime || longTime == '') return ''
      return Util.formatDate(longTime, 'MM/dd hh:mm:ss')
    }
  },
  data() {
    return {
      code: this.$route.query.codeId || '',
      id: this.$route.query.pendId || '',
      isShow: false,
      isSlider: false,
      isPending: false,
      isPendingPop: false,
      isWithdrawalPop: false
    }
  },
  computed: {
    ...mapState(['tradeData', 'quote']),
    pending: {
      get() {
        if (this.tradeData.pending && this.tradeData.pending.length > 0) {
          for (const i in this.tradeData.pending) {
            if (this.tradeData.pending[i].ID == this.id) {
              return TradeUtil.copy(this.tradeData.pending[i])
            }
          }
        }
        return {}
      }
    }

  },
  mounted() {
    this.$bus.$emit('loading', true)
    this.removeFixed()
  },
  activated() {
    this.$bus.$emit('loading', true)
    this.removeFixed()
  },
  methods: {
    removeFixed() {
      const mainH = document.getElementById('main')
      mainH.classList.remove('mainFixed')
    },
    changeCode(code) {
      this.code = code
      this.$router.replace({ path: '/home/PendingChart', query: { id: code }})
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
    clickPending() {
      if (!this.pending.ID) return
      this.isPendingPop = true
      this.$nextTick(() => {
        this.$refs.child.clickPending()
      })
    },
    clickWithdrawal() {
      if (!this.pending.ID) return
      this.isWithdrawalPop = true
      this.$nextTick(() => {
        this.$refs.child1.clickWithdrawal()
      })
    }
  }
}
</script>
