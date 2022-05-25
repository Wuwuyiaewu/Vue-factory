<template>
  <div class="position DayProfit">
    <NoData v-if="dayProfit.length<=0" :is-trade="isTrade" />
    <ul v-if="dayProfit.length>0">
      <li
      v-for="(item,index) in dayProfit"
      v-if="item.Reason != constant.DealReason.OPEN && item.Reason != constant.DealReason.LIMIT && item.Reason != constant.DealReason.STOP"
      :key="index"
      >
        <div class="itemTit">
          <div class="leftCon">
            <span>{{ item.SName.aushGB }} <label class="shortname">{{item.SName.szShortName}}</label></span>
            <p><em :class="cutover(tradeUtil.OrderDirection[item.Direction])">{{ tradeUtil.OrderDirection[item.Direction] }}</em>{{ item.ExecuteVolume }}手</p>
          </div>
          <div class="rightCon">
            #{{ item.ID }}
          </div>
        </div>

        <div class="itemCon">
          <div class="leftCon">
            <div class="itemList">
              <div class="item"><span>开仓:</span><p>{{ item.SrcPrice }}</p></div>
              <div class="item"><span>利&nbsp;&nbsp;&nbsp;息:</span><p>{{ Number(item.Swap).toFixed(2) }}</p></div>
            </div>
            <div class="itemList">
              <div class="item"><span>平仓:</span><p>{{ item.ExecutePrice }}</p></div>
              <div class="item"><span>手续费:</span><p>{{ Number(item.Commission).toFixed(2) }}</p></div>
            </div>
          </div>
          <div class="rightCon">
            <div class="item"><span :class="Gain(item.Profit)">{{ item.Profit }}</span></div>
            <time>{{ item.ExecuteTime|time }}</time>
          </div>
        </div>

      </li>
    </ul>
  </div>
</template>

<script>
import Util from '@/utils/tradeDataUtil'
import { mapState } from 'vuex'
import TradeUtil from '@/utils/tradeUtil'
import Constant from '@/utils/Constant'
import NoData from '@/view/NoData.vue'
export default {
  name: 'DayProfit',
  filters: {
    time(longTime) {
      return Util.formatDate(longTime, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  components: { NoData },
  computed: {
    ...mapState(['tradeData', 'quote']),
    dayProfit: {
      get() {
        return TradeUtil.copy(this.tradeData.dayDeal).filter(item => (item.Reason != Constant.DealReason.OPEN && item.Reason != Constant.DealReason.LIMIT && item.Reason != Constant.DealReason.STOP))
      }
    }
  },
  mounted() {
    console.log(this.tradeData)
  },
  data() {
    return {
      tradeUtil: TradeUtil,
      constant: Constant,
      isTrade: true
    }
  },
  methods: {
    cutover: function(obj) {
      var val
      if (obj == '买入') {
        val = 'rise'
      } else if (obj == '卖出') {
        val = 'fall'
      }
      return val
    },
    Gain: function(obj) {
      var val
      if (obj > 0) {
        val = 'rise'
      } else if (obj == 0) {
        val = 'level'
      } else {
        val = 'fall'
      }
      return val
    }
  }
}
</script>

<style scoped>

</style>
