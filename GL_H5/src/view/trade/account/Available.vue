<template>
  <!--可用资金-->
  <em>{{ available }}</em>
</template>

<script>
import { mapState } from 'vuex'
import Util from '@/utils/tradeDataUtil'
import TradeUtil from '@/utils/tradeUtil'
export default {
  name: 'Available',
  computed: {
    ...mapState(['account', 'tradeData', 'quote']),
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
    // 可用资金
    available: {
      get() {
        //return this.account.balance
        return this.account.balance ? Number(Util.accSub(Util.accAdd(this.account.balance, this.profitTotal), this.account.take)).toFixed(2) : '--'
      }
    }
  }
}
</script>
