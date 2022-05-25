<template>
  <div>
    <div class="positionFixed">
      <div class="tcCon">
        <div class="fixedItem">

          <!-- <div class="char_price">
            <ul>
              <li :class="isRise(marketInfo.tick,2,2)" @click="changeDirect(2)">卖出 <em>{{marketInfo.tick.ask}}</em><i></i></li>
              <label>{{ marketInfo.tick.symbolData ? Math.abs((marketInfo.tick.bid - marketInfo.tick.ask) / marketInfo.tick.symbolData.pipv).toFixed(marketInfo.tick.symbolData.diff):""}}</label>
              <li :class="isRise(marketInfo.tick,1,2)" @click="changeDirect(1)"><em>{{marketInfo.tick.bid}}</em><i></i>买入</li>
            </ul>
          </div> -->

          <div class="itemCon">
            <div
              v-if="errContent.length > 0"
              class="errInfo"
            >{{ errContent[0] }}</div>
            <div class="item1">
              <p>持仓编号</p>
              <span>#{{ position.ID }}</span>
            </div>
            <div class="item1">
              <p>开仓方向</p>
              <span :class="{rise:position.Direction==1,fall:position.Direction==2}">{{ position.Direction==1?'买入':'卖出' }}</span>
            </div>
            <div class="item1">
              <p>开仓价</p>
              <span>{{ position.OpenPrice }}</span>
            </div>
            <div class="item1">
              <p>当前价</p>
              <span>{{ closePrice }}</span>
            </div>

            <div class="item1">
              <p>平仓手数
              <span
                v-if="position.symbolData" :class="errClass.volumeClass"
              >
              ({{ Number(position.symbolData.minVolumes) >= Number(position.Volume) ? position.Volume : position.symbolData.minVolumes }}手-{{ position.Volume }}手)
              </span>
              </p>

              <div class="itemsetbox volumebox">
                <div class="setbox">
                  <div
                    :class="close.volume!='' && Number(close.volume) <= Number(position.symbolData.minVolumes)?'pic cut stop':'pic cut'"
                    @click="changeVolume(1)"
                  />
                  <input
                    type="number"
                    v-if="position.symbolData.minVolumes < position.Volume"
                    v-model="close.volume"
                  >
                  <input
                    v-if="position.symbolData.minVolumes >= position.Volume"
                    v-model="close.volume"
                    readonly
                  >
                  <div
                    :class="close.volume !='' && Number(close.volume) >= Number(position.Volume)?'pic add stop':'pic add'"
                    @click="changeVolume(2)"
                  />
                </div>
              </div>
            </div>

            <div class="item1">
              <p>浮动盈亏</p>
              <span><em>{{ profit }}</em></span>
            </div>

            <RangeScope
              :range-scope="position.symbolData.rangeScope"
              :range="close.range"
              @changeRange="changeRange"
            />

            <div class="item2">
              <ul v-if="position.symbolData">
                <li>
                  <p>可用资金 $<Available />
                  </p>
                </li>
                <li>
                  <p>浮动盈亏 {{ profit > 0?'+':'-' }}<em>${{ Math.abs(profit) }}</em></p>
                </li>
              </ul>
              <span
                :class="errContent.length>0 || submitText=='提交中'?'err':''"
                @click="submit()"
              >
                <img
                  v-if="submitText=='提交中'"
                  src="@/assets/images/nav/loading1.gif"
                >{{ submitText }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--提交失败提示-->
    <div
      v-if="isError"
      class="popFixed"
    >
      <div
        class="masking"
        @click="errPop"
      />
      <div class="tcCon">
        <div class="item">
          <p>{{ errMessage }}</p>
        </div>
        <div class="btnCon only">
          <span @click="errPop">确定</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import TradeUtil from '@/utils/tradeUtil'
import Util from '@/utils/tradeDataUtil'
import Constant from '@/utils/Constant'
import Available from '@/view/trade/account/Available.vue'
import RangeScope from '@/view/trade/RangeScope.vue'

export default {
  name: 'PositionPop',
  components: {
    Available, RangeScope
  },
  props: ['position', 'code'],
  computed: {
    ...mapState(['tradeData', 'symbolInfo', 'quote', 'account', 'socket', 'orderAddRet', 'positionUpdateRet', 'simpleResponse', 'group', 'dealAddRet']),
    /* 平仓价格*/
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
          // if (!this.close.volume || this.close.volume == "") this.close.volume = Number(this.position.symbolData.minVolumes);
          const ask = this.quote.symbolTickMap[this.position.SName.szShortName].ask
          const bid = this.quote.symbolTickMap[this.position.SName.szShortName].bid
          let sub = Util.accSub(this.closePrice, this.position.OpenPrice)
          if (this.position.Direction == 2) sub = Util.accSub(this.position.OpenPrice, this.closePrice)
          const profit = Util.accAdd(TradeUtil.changeCurrency(sub, ask, bid, this.close.volume || this.position.Volume, this.position.symbolData, this.quote.symbolTickMap, this.position.Direction), this.position.Swap)
          return Number(profit).toFixed(2)
        }
        return ''
      }
    },
    errClass: {
      get() {
        if (!this.position.symbolData) return { volumeClass: '' }
        let volumeClass = ''
        if (this.position.symbolData.minVolumes < this.position.Volume) {
          volumeClass = this.close.volume != '' && (Number(this.close.volume) > Number(this.position.Volume) || Number(this.close.volume) < Number(this.position.symbolData.minVolumes)) ? 'err' : ''
        }
        return {
          volumeClass: volumeClass
        }
      }
    },
    errContent: {
      get() {
        var arr = []
        if (!this.position.symbolData) return []
        if (this.position.symbolData.minVolumes < this.position.Volume) {
          if ((!this.close.volume || this.close.volume == '') || ((Number(this.close.volume) > Number(this.position.Volume) || Number(this.close.volume) < Number(this.position.symbolData.minVolumes)))) arr.push('您输入的手数不在范围内，请重新输入')
        }
        return arr
      }
    }
  },
  data() {
    return {
      sign: process.env.VUE_APP_GA_SIGN,
      tradeUtil: TradeUtil,
      submitText: '确认平仓',
      isPosition: false,
      close: { volume: '', range: '' },
      oldClose: {},
      err: '',
      errMessage: '',
      isError: false
    }
  },
  watch: {
    close: {
      // 监听数据格式长度等
      deep: true,
      handler(newValue) {
        // 止损价控制
        // const fix = String(this.position.symbolData.volumesStep).split(".")[1].length || 2;
        if (newValue.volume && newValue.volume != '') {
          if (isNaN(newValue.volume) || String(newValue.volume).indexOf('e') >= 0 || String(newValue.volume).indexOf('-') >= 0) {
            this.close.volume = this.oldClose.volume
          } else if (String(newValue.volume).indexOf('.') > 0 && this.position.symbolData) {
            const fix = String(this.position.symbolData.volumesStep).indexOf('.') >= 0 ? String(this.position.symbolData.volumesStep).split('.')[1].length : 0
            if (String(newValue.volume).split('.')[1].length > fix) {
              this.close.volume = this.oldClose.volume
            }
          }
        }
        this.oldClose = TradeUtil.copy(this.close)
      }
    },
    simpleResponse: {
      // 提交失败提示
      deep: true,
      handler(newValue, oldValue) {
        if(newValue.Code != 0){
          this.submitText = '提交'
          this.errMessage = this.tradeUtil.getFailMsg(newValue.Code, this.position.symbolData, this.group)
          this.isError = !this.isError
          this.toggleFixed()
        }
      }
    },
    dealAddRet: {
      deep: true,
      handler(newValue, oldValue) {
        if (newValue.ID && this.position && newValue.PositionID == this.position.ID) {
          if (this.orderAddRet.Type == Constant.OrderType.CLOSE) {
            // 平仓成功
            // 缓存this.marketInfo.symbolData.source     this.orderAddRet.Range
            console.log("平仓成功",newValue)
            TradeUtil.saveRange(this.position.symbolData.source, Number(this.orderAddRet.Range).toFixed(0))
            const data = TradeUtil.copy(newValue)
            this.submitText = '确认平仓'
            this.$router.replace({ path: '/home/PositionSuc', query: { ...data, source: this.position.symbolData.source }})
          }
        }
      }
    }
  },
  methods: {
    changeRange(range) {
      this.close.range = range
    },
    removeFixed() {
      document.querySelector('html').removeAttribute("class","isOpenNav")
    },
    toggleFixed() {
      document.querySelector('html').className="isOpenNav"
      //document.querySelector('html').classList.toggle("isOpenNav")
    },
    goOrderHelp() {
      this.toggleFixed()
      this.$bus.$emit('loading', false)
      this.$router.push({ path: '/home/OrderHelp', query: { id: this.code }})
    },
    errPop() {
      this.isError = !this.isError
      this.removeFixed()
    },
    clickPosPop() {
      this.close.range = TradeUtil.readRangeBySource(this.position.symbolData.source) || this.position.symbolData.rangeScope
      const fix = String(this.position.symbolData.volumesStep).indexOf('.') >= 0 ? String(this.position.symbolData.volumesStep).split('.')[1].length : 0
      this.close.volume = Number(this.position.Volume).toFixed(fix)
    },
    changeVolume(type) {
      const fix = String(this.position.symbolData.volumesStep).indexOf('.') >= 0 ? String(this.position.symbolData.volumesStep).split('.')[1].length : 0
      if (this.close.volume == '') this.close.volume = this.position.symbolData.minVolumes
      if (type == 1) { // 减
        const result = Number(Util.accSub(Number(this.close.volume), Number(this.position.symbolData.volumesStep))).toFixed(fix)
        if (result >= this.position.symbolData.minVolumes) this.close.volume = Number(result).toFixed(fix)
      } else {
        const result = Number(Util.accAdd(Number(this.close.volume), Number(this.position.symbolData.volumesStep))).toFixed(fix)
        if (result <= this.position.Volume) this.close.volume = Number(result).toFixed(fix)
      }
    },
    submit() {
      if (this.errContent.length > 0 || this.submitText == '提交中') return
      this.submitText = '提交中'
      const req = TradeUtil.getTradeReq(this.account, this.position.symbolData)// 初始化请求对象
      req.MsgId = 1703
      req.Range = this.close.range
      req.ExpireType = Constant.ExpireType.DAY
      req.PositionID = this.position.ID
      req.Type = Constant.OrderType.CLOSE
      req.Direction = this.position.Direction == 1 ? 2 : 1
      req.RequestVolume = this.close.volume
      req.RequestPrice = this.closePrice
      this.socket.tradeSocket.emit('request', Number(Constant.Req.openOrder), req)
    }
  }
}
</script>
