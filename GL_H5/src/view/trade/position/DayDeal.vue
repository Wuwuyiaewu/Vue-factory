<template>
  <div class="position dayDeal">
    <NoData v-if="dayDeal.length<=0" :is-trade="isTrade" />
    <ul v-if="dayDeal.length>0">
      <li v-for="(item,index) in dayDeal" :key="index">

        <div class="itemTit">
          <div class="leftCon">
            <span>{{ item.SName.aushGB }} <label class="shortname">{{item.SName.szShortName}}</label></span>
            <p><em :class="{rise:item.Direction == 1,fall:item.Direction == 2}">{{item.Direction == 1 ? "买入" : "卖出"}}</em>{{ item.ExecuteVolume }}手</p>
          </div>
          <div class="rightCon">#{{ item.ID }}</div>
        </div>

        <div class="itemCon">
          <div class="leftCon">
            <div class="itemList">
              <div class="item" v-if="item.DirectionStr.startsWith('平仓')"><span>开仓价:</span><p>{{item.SrcPrice}}</p></div>
              <div class="item" v-else><span>类型:</span><p>{{ tradeUtil.DealReason[item.Reason] }}</p></div>
              <div class="item"><span>利&nbsp;&nbsp;&nbsp;息:</span><p>{{ Number(item.Swap).toFixed(2) }}</p></div>
            </div>
            <div class="itemList">
              <div class="item"><span>成交价:</span><p>{{ item.ExecutePrice }}</p></div>
              <div class="item"><span>手续费:</span><p>{{ Number(item.Commission).toFixed(2) }}</p></div>
            </div>
          </div>

          <div class="rightCon">
            <!-- <div class="item" v-if="item.DirectionStr.startsWith('平仓')"><span :class="util.accAdd(item.Profit,item.Swap)>=0?'rise':'fall'">{{ Number(util.accAdd(item.Profit,item.Swap)).toFixed(2)}}</span></div> -->
            <time>{{ item.ExecuteTime|time }}</time>
          </div>

        </div>

      </li>
    </ul>
  </div>
</template>
<script>
import moment from 'moment'
import { mapState } from 'vuex'
import Util from '@/utils/tradeDataUtil'
import TradeUtil from '@/utils/tradeUtil'
import NoData from '@/view/NoData.vue'
export default {
  name: 'DayDeal',
  filters: {
    time(longTime) {
      return moment(new Date(longTime * 1000)).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  components: { NoData },
  computed: {
    ...mapState(['tradeData', 'quote']),
    dayDeal: {
      get() {
        return this.tradeData.dayDeal
      }
    }
  },
  mounted() {
    console.log(this.tradeData)
  },
  data() {
    return {
      util: Util,
      tradeUtil: TradeUtil,
      isTrade: true
    }
  },
  methods: {
    cutover: function(obj) {
      var val
      if (obj == '开仓买入') {
        val = 'rise'
      } else if (obj == '开仓卖出') {
        val = 'sell'
      } else if (obj == '平仓买入') {
        val = 'sell'
      } else if (obj == '平仓卖出') {
        val = 'buy'
      }
      return val
    }
  }
}
</script>
