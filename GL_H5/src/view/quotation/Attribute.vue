<template>
  <div class="sucOrdered attribute">
    <div class="navTitle">
      <div class="navItem">
        <img class="back" src="@/assets/images/nav/a_top_close.png" @click="back">
        <span>合约属性</span>
      </div>
    </div>
    <div class="sucList">
      <div class="item"><span>{{ quote.notify[$route.query.id].aushGB }}</span></div>
      <ul>
        <li><p>合约单位</p><span>{{ attribute.contractSize }}</span></li>
        <li><p>基准货币</p><span>{{ attribute.baseCurrency }}</span></li>
        <li><p>收益货币</p><span>{{ attribute.profitCurrency }}</span></li>
        <li><p>报价小数位</p><span>{{ attribute.digits }}</span></li>
        <li><p>点差</p><span>浮动</span></li>
        <li><p>单笔交易手数</p><span>{{ attribute.minVolumes }}手-{{ attribute.maxVolumes }}手</span></li>
        <li><p>最小挂单距离</p><span>{{ attribute.stopLevel }}</span></li>
        <li><p>手数差值</p><span>{{ attribute.volumesStep }}</span></li>
        <li v-if="!group.marginType || group.marginType == 0"><p>初始保证金</p>
          <span>{{ attribute.marginInitial }}美元/手</span></li>
        <li v-else-if="marginList.length == 0"><p>初始保证金</p><span>0.00美元/手</span></li>
        <li v-else-if="marginList.length > 0" class="margin">
          <div class="item" @click="margin"><p>初始保证金</p><span>最低{{ marginList[0].MarginInitial }}美元/手<em
            :class="{'checked':marginShow}"
          /></span></div>
          <div v-if="marginShow" class="item flex">
            <div class="itemWidth">
              <div class="widthCon"><p>手数范围</p>
                <p>保证金要求</p></div>
              <div v-for="item in marginList" class="widthCon"><p>
                                                                 {{ item.RangeMin }}手数≤{{ item.RangeMax }}</p>
                <p>{{ item.MarginInitial }} </p></div>
            </div>
          </div>
        </li>
        <li v-if="!group.marginType || group.marginType == 0"><p>假期保证金</p><span>{{ attribute.holidayMarginInitial }}美元/手</span>
        </li>
        <li v-else-if="marginList.length == 0"><p>假期保证金</p><span>0.00美元/手</span></li>
        <li v-else-if="marginList.length > 0" class="margin">
          <div class="item" @click="margins"><p>假期保证金</p><span>最低{{ marginList[0].HolidayMarginInitial }}美元/手<em
            :class="{'checked':marginShows}"
          /></span></div>
          <div v-if="marginShows" class="item flex">
            <div class="itemWidth">
              <div class="widthCon"><p>手数范围</p>
              <p>保证金要求</p></div>
              <div v-for="item in marginList" class="widthCon">
                <p>{{ item.RangeMin }}手数≤{{ item.RangeMax }}</p>
                <p>{{ item.HolidayMarginInitial }}</p>
              </div>
            </div>
          </div>
        </li>
        <li v-if="!group.marginType || group.marginType == 0"><p>锁仓保证金</p><span>锁仓订单保证金总和的{{ attribute.marginHedged }}%</span>
        </li>
        <li v-else-if="marginList.length == 0"><p>锁仓保证金</p><span>锁仓订单保证金总和的0%</span></li>
        <li v-else-if="marginList.length > 0"><p>锁仓保证金</p><span>锁仓订单保证金总和的{{ marginList[0].MarginHedged }}%</span>
        </li>
        <li><p>隔夜利息(买/卖)</p><span>{{ attribute.longSwap }}%/{{ attribute.shortSwap }}%</span></li>
        <li><p>三天利息</p><span>{{ DayOfWeek[attribute.threeDaysSwap] }}</span></li>
        <li class="time">
          <p>交易时间</p>
          <div class="item"><p v-for="(value,key) in symbolTime">{{ DayOfWeek[key] }}：<span
            v-for="item in value"
          >{{ item.StartHM }}-{{ item.EndHM }}&nbsp;</span></p></div>
        </li>
        <li v-if="serverInfo.EndOfDay"><p>结算时间</p><span>{{ util.formatMinutes(util.accAdd(serverInfo.EndOfDay,480)) }}(每天)</span></li>
        <li v-if="attribute.expiryTime"><p>合约到期时间</p><span>{{ attribute.expiryTime|time }}</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
require('@/assets/css/sucOrdered.css')
import { mapState } from 'vuex'
import Util from '@/utils/tradeDataUtil'
import TradeUtil from '@/utils/tradeUtil'

export default {
  name: 'Attribute',
  filters: {
    time(longTime) {
      return Util.formatDate(longTime * 1000, 'yyyy-MM-dd hh:mm:ss')
    }
  },
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
    },
    // 交易时间
    symbolTime: {
      get() {
        var arr = {}
        const arrData = []
        if (this.quote.notify[this.$route.query.id]) {
          const sourceCode = this.quote.notify[this.$route.query.id].uiSourceCode
          if (this.symbolInfo.codeMap[sourceCode]) {
            const id = this.symbolInfo.codeMap[sourceCode].id
            if (id && this.symbolInfo.symbolTime.length > 0) {
              for (const i in this.symbolInfo.symbolTime) {
                if (this.symbolInfo.symbolTime[i].SymbolID == id && this.symbolInfo.symbolTime[i].Enable == 1 && this.symbolInfo.symbolTime[i].Status == 0 && this.symbolInfo.symbolTime[i].NonTradable == 0) {
                  const data = TradeUtil.copy(this.symbolInfo.symbolTime[i])
                  arrData.push(TradeUtil.copy(data))
                  // 时间转换
                  if (Util.accAdd(data.StartTime, 480) >= 1440) {
                    // 开始结束时间都跨天
                    if (data.DayOfWeek < 6) data.DayOfWeek = Util.accAdd(data.DayOfWeek, 1)
                    else data.DayOfWeek = 0
                    data.StartTime = Util.accAdd(data.StartTime, 480) - 1440
                    data.EndTime = Util.accAdd(data.EndTime, 480) - 1440
                    data.StartHM = Util.formatMinutes(data.StartTime)
                    data.EndHM = Util.formatMinutes(data.EndTime)
                    if (!arr[data.DayOfWeek]) arr[data.DayOfWeek] = []
                    arr[data.DayOfWeek].push(data)
                  } else if (Util.accAdd(data.EndTime, 480) > 1440) {
                    // 结束时间都跨天
                    const startData = TradeUtil.copy(data)
                    const endData = TradeUtil.copy(data)

                    startData.StartTime = Util.accAdd(startData.StartTime, 480)
                    startData.StartHM = Util.formatMinutes(startData.StartTime)
                    startData.EndTime = 1440
                    startData.EndHM = Util.formatMinutes(startData.EndTime) == '00:00' ? '24:00' : Util.formatMinutes(startData.EndTime)
                    if (!arr[startData.DayOfWeek]) arr[startData.DayOfWeek] = []
                    arr[startData.DayOfWeek].push(startData)

                    if (endData.DayOfWeek < 6) endData.DayOfWeek = Util.accAdd(endData.DayOfWeek, 1)
                    else endData.DayOfWeek = 0
                    endData.StartTime = 0
                    endData.EndTime = Util.accAdd(endData.EndTime, 480) - 1440
                    endData.EndHM = Util.formatMinutes(endData.EndTime)
                    if (!arr[endData.DayOfWeek]) arr[endData.DayOfWeek] = []
                    arr[endData.DayOfWeek].push(endData)
                  } else {
                    // 时间不跨天
                    data.StartTime = Util.accAdd(data.StartTime, 480)
                    data.StartHM = Util.formatMinutes(data.StartTime)
                    data.EndTime = Util.accAdd(data.EndTime, 480)
                    data.EndHM = Util.formatMinutes(data.EndTime)
                    if (!arr[data.DayOfWeek]) arr[data.DayOfWeek] = []
                    arr[data.DayOfWeek].push(data)
                  }
                }
              }
            }
          }
        }
        // console.log(arrData);
        return arr
      }
    }
  },
  data() {
    return {
      util: Util,
      tradeUtil: TradeUtil,
      DayOfWeek: { 0: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六' },
      marginShow: false,
      marginShows: false
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
    back() {
      this.$router.go(-1)
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
