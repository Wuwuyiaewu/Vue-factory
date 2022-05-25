<template>
  <div>
    <div class="positionFixed">
      <div class="tcCon">
        <div class="fixedItem">
          <!-- <div class="tcTit">
            <img src="@/assets/images/quotation/a_chart_close.png" @click="clickPending">
            <span>修改挂单</span>
            <img src="@/assets/images/quotation/a_chart_help.png" @click="goOrderHelp">
          </div> -->

          <div class="itemCon">
            <div v-if="errContent.length > 0" class="errInfo">{{ errContent[0] }}</div>

            <div class="char_price">
              <ul>
                <li :class="isRise(marketInfo.tick,2,2)" @click="changeDirect(2)">卖出 <em>{{marketInfo.tick.ask}}</em><i></i></li>
                <label>{{ marketInfo.tick.symbolData ? Math.abs((marketInfo.tick.bid - marketInfo.tick.ask) / marketInfo.tick.symbolData.pipv).toFixed(marketInfo.tick.symbolData.diff):""}}</label>
                <li :class="isRise(marketInfo.tick,1,2)" @click="changeDirect(1)"><em>{{marketInfo.tick.bid}}</em><i></i>买入</li>
              </ul>
            </div>

            <div class="item1">
              <p>挂单号码</p>
              <span>#{{ pending.ID }}</span>
            </div>

            <div class="item1">
              <p>挂单类型</p>
              <span>{{ pending.Type == 2?'限价':'停损' }}</span>
            </div>

            <div class="item1">
              <p>交易手数</p>
              <span>{{ pending.RequestVolume }}</span>
            </div>

            <div class="item1">
              <p>价格<span :class="errClass.setPriceClass">({{ pendPrice.min }}-{{ pendPrice.max }})</span></p>

              <div class="itemsetbox volumebox">
                <div class="setbox">
                  <div
                    :class="market.setPrice!=''&&Number(market.setPrice)<=Number(pendPrice.min)?'pic cut stop':'pic cut'"
                    @click="changeSetPrice(1)"
                  />
                  <input v-model="market.setPrice">
                  <div
                    :class="market.setPrice!=''&&Number(market.setPrice)>=Number(pendPrice.max)?'pic add stop':'pic add'"
                    @click="changeSetPrice(2)"
                  />
                </div>
              </div>

            </div>

            <div class="item1">
              <p>有效期</p>
              <span>{{ pending.ExpireType==1?'当日有效':'当周有效' }}</span>
            </div>

            <div class="item1 titShow">
              <p>止损止盈</p>
              <div class="arrow">
                <ul>
                  <li
                    v-for="(item,index) in tabsName"
                    :class="{checked:isIndex==index}"
                    @click="tabName(index,item)"
                    :key="index"
                  >{{ item.name }}
                  </li>
                </ul>
                <span
                  :class="{'checked':isShow}"
                  @click="clickArrow"
                />
              </div>

              <div class="lpitem">
                <p>止损<span :class="errClass.stopLossClass">({{ stopLoss.min }}-{{ stopLoss.max }})</span></p>
                <div class="itemsetbox volumebox">
                  <div class="setbox">
                    <div
                      :class="market.stopLoss!='' && Number(market.stopLoss) <= Number(stopLoss.min)?'pic cut stop':'pic cut'"
                      @click="changeStopLoss(1)"
                    />
                    <input v-model="market.stopLoss" placeholder="未设置">
                    <div
                      :class="market.stopLoss!='' && Number(market.stopLoss) >= Number(stopLoss.max)?'pic add stop':'pic add'"
                      @click="changeStopLoss(2)"
                    />
                  </div>
                  <div class="reset" @click="resetLoss"><img src="@/assets/images/quotation/profit_del.png"></div>
                </div>
              </div>

              <div class="lpitem">
                <p>止盈<span :class="errClass.stopProfitClass">({{ stopProfit.min }}-{{ stopProfit.max }})</span></p>
                
                <div class="itemsetbox volumebox">
                  <div class="setbox">
                    <div
                      :class="market.stopProfit!='' && Number(market.stopProfit) <= Number(stopProfit.min)?'pic cut stop':'pic cut'"
                      @click="changeStopProfit(1)"
                    />
                    <input v-model="market.stopProfit" placeholder="未设置">
                    <div
                      :class="market.stopProfit!='' && Number(market.stopProfit) >= Number(stopProfit.max)?'pic add stop':'pic add'"
                      @click="changeStopProfit(2)"
                    />
                  </div>
                  <div class="reset" @click="resetProfit"><img src="@/assets/images/quotation/profit_del.png"></div>
                </div>
              </div>

            </div>

            


            <div class="item2">
              <ul>
                <li>
                  <p>参考保证金${{ pending && pending.RequestVolume && pending.Direction ? tradeUtil.getMargin(pending.RequestVolume,marketInfo.symbolData,pending.Direction,tradeData.position):0 }}</p>
                </li>
                <li><p>可用资金 $<Available /></p></li>
                <li v-if="lossAndProfit.stopProfit || lossAndProfit.stopLoss">
                  <p>预计盈亏
                    <em v-if="lossAndProfit.stopProfit" :class="lossAndProfit.stopProfit>0?'rise':'fall'">{{ lossAndProfit.stopProfit>=0?'+':'-' }}${{ Math.abs(lossAndProfit.stopProfit) }}</em>
                    <em v-if="lossAndProfit.stopProfit && lossAndProfit.stopLoss">/</em>
                    <em v-if="lossAndProfit.stopLoss" :class="lossAndProfit.stopLoss>0?'rise':'fall'">{{ lossAndProfit.stopLoss>=0?'+':'-' }}${{ Math.abs(lossAndProfit.stopLoss) }}</em>
                  </p></li>
              </ul>
              <span :class="errContent.length>0 || submitText == '提交中'?'err':''" @click="submit()"><img v-if="submitText=='提交中'" src="@/assets/images/nav/loading1.gif">{{ submitText }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--提交失败提示-->
    <div v-if="isError" class="popFixed">
      <div class="masking" @click="errPop" />
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
import Util from '@/utils/tradeDataUtil'
import TradeUtil from '@/utils/tradeUtil'
import Constant from '@/utils/Constant'
import Available from '@/view/trade/account/Available.vue'
export default {
  name: 'PendingPop',
  components: {
    Available
  },
  props: ['pending', 'code'],
  data() {
    return {
      submitText: '确定修改',
      tradeUtil: TradeUtil,
      util: Util,
      isPending: false,
      tabsName: [
        { name: '价格', type: 1 },
        { name: '点数', type: 2 }
      ],
      isIndex: 0,
      isShow: false,
      marketType: {
        profit: 1// 价格:1,点数:2
      },
      market: { stopLoss: '', stopProfit: '', setPrice: '' },
      oldMarket: {}, // 监听market旧数据使用
      errMessage: '',
      isError: false
    }
  },
  computed: {
    ...mapState(['quote', 'symbolInfo', 'socket', 'account', 'orderUpdateRet', 'tradeData', 'simpleResponse', 'group']),
    marketInfo: {
      get() {
        var symbolData = {}
        var tick = {}
        if (this.quote.notify[this.code]) {
          const source = this.quote.notify[this.code].uiSourceCode
          if (this.symbolInfo.codeMap[source]) symbolData = this.symbolInfo.codeMap[source]
        }
        if (this.quote.codeTickMap && this.quote.codeTickMap[this.code]) tick = this.quote.codeTickMap[this.code]
        return {
          symbolData: symbolData,
          tick: tick
        }
      }
    },
    /* 挂单价格范围*/
    pendPrice: {
      get() {
        let min = ''; let max = ''
        if (this.pending.Type == 2) { // 限价
          if (this.pending.Direction == 1) { // 买
            min = this.util.accSub(this.marketInfo.tick.bid, this.marketInfo.symbolData.maxStopLevel * this.marketInfo.symbolData.pipv)
            max = this.util.accSub(this.marketInfo.tick.bid, this.marketInfo.symbolData.stopLevel * this.marketInfo.symbolData.pipv)
          } else { // 卖
            min = this.util.accAdd(this.marketInfo.tick.ask, this.marketInfo.symbolData.stopLevel * this.marketInfo.symbolData.pipv)
            max = this.util.accAdd(this.marketInfo.tick.ask, this.marketInfo.symbolData.maxStopLevel * this.marketInfo.symbolData.pipv)
          }
        } else { // 停损
          if (this.pending.Direction == 1) { // 买
            min = this.util.accAdd(this.marketInfo.tick.bid, this.marketInfo.symbolData.stopLevel * this.marketInfo.symbolData.pipv)
            max = this.util.accAdd(this.marketInfo.tick.bid, this.marketInfo.symbolData.maxStopLevel * this.marketInfo.symbolData.pipv)
          } else { // 卖
            min = this.util.accSub(this.marketInfo.tick.ask, this.marketInfo.symbolData.maxStopLevel * this.marketInfo.symbolData.pipv)
            max = this.util.accSub(this.marketInfo.tick.ask, this.marketInfo.symbolData.stopLevel * this.marketInfo.symbolData.pipv)
          }
        }
        const fix = this.marketInfo.symbolData.digits// 价格报价小数位
        return {
          min: Number(min).toFixed(fix),
          max: Number(max).toFixed(fix)
        }
      }
    },
    /* 止损信息*/
    stopLoss: {
      get() {
        let min, max
        // 点数直接返回
        if (this.marketType.profit == 2) {
          return {
            min: Number(this.marketInfo.symbolData.stopLevel).toFixed(1),
            max: Number(this.marketInfo.symbolData.maxStopLevel).toFixed(1)
          }
        }
        const fix = this.marketInfo.symbolData.digits// 价格报价小数位
        if (this.pending.Direction == 1) { // 买,价格
          min = this.util.accSub(this.market.setPrice, this.marketInfo.symbolData.maxStopLevel * this.marketInfo.symbolData.pipv)
          max = this.util.accSub(this.market.setPrice, this.marketInfo.symbolData.stopLevel * this.marketInfo.symbolData.pipv)
        } else if (this.pending.Direction == 2) { // 卖,价格
          min = this.util.accAdd(this.market.setPrice, this.marketInfo.symbolData.stopLevel * this.marketInfo.symbolData.pipv)
          max = this.util.accAdd(this.market.setPrice, this.marketInfo.symbolData.maxStopLevel * this.marketInfo.symbolData.pipv)
        }
        return {
          min: Number(min).toFixed(fix),
          max: Number(max).toFixed(fix)
        }
      }
    },
    /* 止盈信息*/
    stopProfit: {
      get() {
        let min, max
        if (this.marketType.profit == 2) {
          return {
            min: Number(this.marketInfo.symbolData.stopLevel).toFixed(1),
            max: Number(this.marketInfo.symbolData.maxStopLevel).toFixed(1)
          // 对比信息
          }
        }
        const fix = this.marketInfo.symbolData.digits// 价格报价小数位
        if (this.pending.Direction == 1) { // 买,价格
          min = this.util.accAdd(this.market.setPrice, this.marketInfo.symbolData.stopLevel * this.marketInfo.symbolData.pipv)
          max = this.util.accAdd(this.market.setPrice, this.marketInfo.symbolData.maxStopLevel * this.marketInfo.symbolData.pipv)
        } else if (this.pending.Direction == 2) { // 卖,价格
          min = this.util.accSub(this.market.setPrice, this.marketInfo.symbolData.maxStopLevel * this.marketInfo.symbolData.pipv)
          max = this.util.accSub(this.market.setPrice, this.marketInfo.symbolData.stopLevel * this.marketInfo.symbolData.pipv)
        }
        return {
          min: Number(min).toFixed(fix),
          max: Number(max).toFixed(fix)
        }
      }
    },
    // 预期盈亏
    lossAndProfit: {
      get() {
        let loss = null; let profit = null; let sub = null// sub买卖差价
        if (this.market.setPrice != '' && this.marketInfo.symbolData.pipv) {
          if (this.pending.Direction == 1) { // 买
            if (this.market.stopLoss && this.market.stopLoss != '') { // 亏
              if (this.marketType.profit == 2) sub = -Util.accMul(Number(this.market.stopLoss), Number(this.marketInfo.symbolData.pipv))// 点差
              else { // 价格
                sub = Util.accSub(this.market.stopLoss, this.market.setPrice)// 挂单
              }
              if (this.marketInfo.symbolData.stockType == 1) {
                let stopLoss = this.market.stopLoss
                if (this.marketType.profit == 2) stopLoss = this.pipToChange(1)
                loss = TradeUtil.changeCurrency(sub, stopLoss, stopLoss, this.pending.RequestVolume, this.marketInfo.symbolData, this.quote.symbolTickMap, this.pending.Direction)
              } else loss = TradeUtil.changeCurrency(sub, this.marketInfo.tick.ask, this.marketInfo.tick.bid, this.pending.RequestVolume, this.marketInfo.symbolData, this.quote.symbolTickMap, this.pending.Direction)
            }
            if (this.market.stopProfit && this.market.stopProfit != '') { // 盈
              if (this.marketType.profit == 2) sub = Util.accMul(Number(this.market.stopProfit), Number(this.marketInfo.symbolData.pipv))// 点差
              else { // 价格
                sub = Util.accSub(this.market.stopProfit, this.market.setPrice)// 挂单
              }
              if (this.marketInfo.symbolData.stockType == 1) {
                let stopProfit = this.market.stopProfit
                if (this.marketType.profit == 2) stopProfit = this.pipToChange(2)
                profit = TradeUtil.changeCurrency(sub, stopProfit, stopProfit, this.pending.RequestVolume, this.marketInfo.symbolData, this.quote.symbolTickMap, this.pending.Direction)
              } else profit = TradeUtil.changeCurrency(sub, this.marketInfo.tick.ask, this.marketInfo.tick.bid, this.pending.RequestVolume, this.marketInfo.symbolData, this.quote.symbolTickMap, this.pending.Direction)
            }
          } else { // 卖
            if (this.market.stopLoss && this.market.stopLoss != '') { // 亏
              if (this.marketType.profit == 2) sub = -Util.accMul(this.market.stopLoss, this.marketInfo.symbolData.pipv)// 点差
              else { // 价格
                sub = Util.accSub(this.market.setPrice, this.market.stopLoss)// 挂单
              }
              if (this.marketInfo.symbolData.stockType == 1) {
                let stopLoss = this.market.stopLoss
                if (this.marketType.profit == 2) stopLoss = this.pipToChange(1)
                loss = TradeUtil.changeCurrency(sub, stopLoss, stopLoss, this.pending.RequestVolume, this.marketInfo.symbolData, this.quote.symbolTickMap, this.pending.Direction)
              } else loss = TradeUtil.changeCurrency(sub, this.marketInfo.tick.ask, this.marketInfo.tick.bid, this.pending.RequestVolume, this.marketInfo.symbolData, this.quote.symbolTickMap, this.pending.Direction)
            }
            if (this.market.stopProfit && this.market.stopProfit != '') { // 盈
              if (this.marketType.profit == 2) sub = Util.accMul(this.market.stopProfit, this.marketInfo.symbolData.pipv)// 点差
              else { // 价格
                sub = Util.accSub(this.market.setPrice, this.market.stopProfit)// 挂单
              }
              if (this.marketInfo.symbolData.stockType == 1) {
                let stopProfit = this.market.stopProfit
                if (this.marketType.profit == 2) stopProfit = this.pipToChange(2)
                profit = TradeUtil.changeCurrency(sub, stopProfit, stopProfit, this.pending.RequestVolume, this.marketInfo.symbolData, this.quote.symbolTickMap, this.pending.Direction)
              } else profit = TradeUtil.changeCurrency(sub, this.marketInfo.tick.ask, this.marketInfo.tick.bid, this.pending.RequestVolume, this.marketInfo.symbolData, this.quote.symbolTickMap, this.pending.Direction)
            }
          }
        }
        return {
          stopLoss: loss ? Number(loss).toFixed(2) : null,
          stopProfit: profit ? Number(profit).toFixed(2) : null
        }
      }
    },
    errClass: {
      get() {
        const stopLossClass = this.market.stopLoss != '' && (Number(this.market.stopLoss) > Number(this.stopLoss.max) || Number(this.market.stopLoss) < Number(this.stopLoss.min)) ? 'err' : ''
        const stopProfitClass = this.market.stopProfit != '' && (Number(this.market.stopProfit) > Number(this.stopProfit.max) || Number(this.market.stopProfit) < Number(this.stopProfit.min)) ? 'err' : ''
        const setPriceClass = this.market.setPrice != '' && (Number(this.market.setPrice) > Number(this.pendPrice.max) || Number(this.market.setPrice) < Number(this.pendPrice.min)) ? 'err' : ''
        return {
          stopLossClass: stopLossClass,
          stopProfitClass: stopProfitClass,
          setPriceClass: setPriceClass
        }
      }
    },
    errContent: {
      get() {
        const arr = []
        if (this.market.stopLoss != '' && (Number(this.market.stopLoss) > Number(this.stopLoss.max) || Number(this.market.stopLoss) < Number(this.stopLoss.min))) arr.push('您输入的止损不在范围内，请重新输入')
        if (this.market.stopProfit != '' && (Number(this.market.stopProfit) > Number(this.stopProfit.max) || Number(this.market.stopProfit) < Number(this.stopProfit.min))) arr.push('您输入的止盈不在范围内，请重新输入')
        if (this.market.setPrice != '' && (Number(this.market.setPrice) > Number(this.pendPrice.max) || Number(this.market.setPrice) < Number(this.pendPrice.min))) arr.push('您输入的价格不在范围内，请重新输入')
        
        // 判断是否有参数修改
        const stopLoss = this.market.stopLoss == '' ? 0 : this.marketType.profit == 1 ? this.market.stopLoss : TradeUtil.changePipValue(this.market.stopLoss, this.market.setPrice, this.market.setPrice, this.marketInfo.symbolData, this.pending.Direction, 1, 1)
        const stopProfit = this.market.stopProfit == '' ? 0 : this.marketType.profit == 1 ? this.market.stopProfit : TradeUtil.changePipValue(this.market.stopProfit, this.market.setPrice, this.market.setPrice, this.marketInfo.symbolData, this.pending.Direction, 1, 2)
        
        if (stopLoss == this.pending?this.pending.StopLoss:0 && stopProfit == this.pending.TakeProfit && this.market.setPrice == this.pending.RequestPrice) {
          arr.push('无任何参数修改,请您修改后再提交')
        }
        return arr
      },
      set(val) {

      }
    }
  },
  watch: {
    market: {
      // 监听数据格式长度等
      deep: true,
      handler(newValue, oldValue) {
        // 止损价控制
        if (newValue.stopLoss && newValue.stopLoss != '') {
          if (isNaN(newValue.stopLoss) || String(newValue.stopLoss).indexOf('e') >= 0 || String(newValue.stopLoss).indexOf('-') >= 0) {
            this.market.stopLoss = this.oldMarket.stopLoss
          } else if (String(newValue.stopLoss).indexOf('.') > 0 && this.marketInfo.symbolData) {
            if (this.marketType.profit == 1 && String(newValue.stopLoss).split('.')[1].length > this.marketInfo.symbolData.digits) { //
              this.market.stopLoss = this.oldMarket.stopLoss
            } else if (this.marketType.profit == 2 && String(newValue.stopLoss).split('.')[1].length > 1) {
              this.market.stopLoss = this.oldMarket.stopLoss
            }
          }
        }
        // 止盈价控制
        if (newValue.stopProfit && newValue.stopProfit != '') {
          if (isNaN(newValue.stopProfit) || String(newValue.stopProfit).indexOf('e') >= 0 || String(newValue.stopProfit).indexOf('-') >= 0) {
            this.market.stopProfit = this.oldMarket.stopProfit
          } else if (String(newValue.stopProfit).indexOf('.') > 0 && this.marketInfo.symbolData) {
            if (this.marketType.profit == 1 && String(newValue.stopProfit).split('.')[1].length > this.marketInfo.symbolData.digits) { //
              this.market.stopProfit = this.oldMarket.stopProfit
            } else if (this.marketType.profit == 2 && String(newValue.stopProfit).split('.')[1].length > 1) {
              this.market.stopProfit = this.oldMarket.stopProfit
            }
          }
        }
        // 价格控制
        if (newValue.setPrice && newValue.setPrice != '') {
          if (isNaN(newValue.setPrice) || String(newValue.setPrice).indexOf('e') >= 0 || String(newValue.setPrice).indexOf('-') >= 0) {
            this.market.setPrice = this.oldMarket.setPrice
          } else if (String(newValue.setPrice).indexOf('.') > 0 && this.marketInfo.symbolData) {
            if (String(newValue.setPrice).split('.')[1].length > this.marketInfo.symbolData.digits) { //
              this.market.setPrice = this.oldMarket.setPrice
            }
          }
        }
        this.oldMarket = TradeUtil.copy(this.market)
      }
    },
    simpleResponse: {
      // 提交失败提示
      deep: true,
      handler(newValue, oldValue) {
        if(newValue.Code != 0){
          this.submitText = '提交'
          this.errMessage = this.tradeUtil.getFailMsg(newValue.Code, this.marketInfo.symbolData, this.group)
          this.isError = !this.isError
          this.toggleFixed()
        }
      }
    },
    orderUpdateRet: {
      deep: true,
      handler(newValue, oldValue) {
        if (newValue.ID && this.pending && this.pending.ID && newValue.ID == this.pending.ID && newValue.MsgId == 1702) {
          // 修改挂单成功
          const data = TradeUtil.copy(newValue)
          if (this.marketType.profit == 2) {
            // 点数下单
            data.setStopLossTip = this.market.stopLoss
            data.setStopProfitTip = this.market.stopProfit
          }
          const source = this.quote.notify[this.code].uiSourceCode
          this.$cookie.set('orderSuc', 'suc', { expires: 7, path: '/' })
          this.$router.replace({ path: 'SucOrdered', query: { ...data, source: source }})
        }
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
    resetLoss(){
      this.market.stopLoss = ''
    },
    resetProfit(){
      this.market.stopProfit = ''
    },
    errPop() {
      this.isError = !this.isError
    },
    removeFixed() {
      const mainH = document.getElementById('main')
      mainH.classList.remove('mainFixed')
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
    goOrderHelp() {
      this.toggleFixed()
      this.$bus.$emit('loading', false)
      this.$router.push({ path: '/home/OrderHelp', query: { id: this.code }})
    },
    clickPending() {
      // 点击展示
      this.marketType.profit = 1// 止损止盈类型 1：价格 2：点数
      this.market.setPrice = this.pending.RequestPrice
      if (this.pending.StopLoss != 0) this.market.stopLoss = this.pending.StopLoss
      if (this.pending.TakeProfit != 0) this.market.stopProfit = this.pending.TakeProfit
    },
    clickArrow() {
      this.isShow = !this.isShow
      return 'checked'
    },
    tabName: function(index, item) {
      this.isIndex = index
      this.marketType.profit = item.type
      if (this.market.stopLoss && this.market.stopLoss != '') {
        this.market.stopLoss = TradeUtil.changePipValue(this.market.stopLoss, this.market.setPrice, this.market.setPrice, this.marketInfo.symbolData, this.pending.Direction, this.marketType.profit, 1)
      }
      if (this.market.stopProfit && this.market.stopProfit != '') {
        this.market.stopProfit = TradeUtil.changePipValue(this.market.stopProfit, this.market.setPrice, this.market.setPrice, this.marketInfo.symbolData, this.pending.Direction, this.marketType.profit, 2)
      }
    },
    // 点数转价格
    pipToChange(lossOrProfit) {
      if (lossOrProfit == 1) {
        // 止损
        if (this.market.stopLoss && this.market.stopLoss != '') {
          return TradeUtil.changePipValue(this.market.stopLoss, this.market.setPrice, this.market.setPrice, this.marketInfo.symbolData, this.pending.Direction, 1, 1)
        }
        return ''
      } else {
        // 止盈
        if (this.market.stopProfit && this.market.stopProfit != '') {
          return TradeUtil.changePipValue(this.market.stopProfit, this.market.setPrice, this.market.setPrice, this.marketInfo.symbolData, this.pending.Direction, 1, 2)
        }
        return ''
      }
    },
    /* 挂单价加减*/
    changeSetPrice(type) {
      if (!this.market.setPrice || this.market.setPrice == '') {
        this.market.setPrice = this.pendPrice.min
        return
      }
      const fix = this.marketInfo.symbolData.digits
      if (type == 1) {
        this.market.setPrice = Number(Util.accSub(Number(this.market.setPrice), Number(this.marketInfo.symbolData.pipv))).toFixed(fix)
        if (Number(this.market.setPrice) <= Number(this.pendPrice.min)) {
          this.market.setPrice = Number(this.pendPrice.min).toFixed(fix)
        }
      } else {
        this.market.setPrice = Number(Util.accAdd(Number(this.market.setPrice), Number(this.marketInfo.symbolData.pipv))).toFixed(fix)
        if (Number(this.market.setPrice) >= Number(this.pendPrice.max)) {
          this.market.setPrice = Number(this.pendPrice.max).toFixed(fix)
        }
      }
    },
    /* 止损加减*/
    changeStopLoss(type) {
      if (!this.market.stopLoss || this.market.stopLoss == '') {
        if (this.marketType.profit == 2) this.market.stopLoss = this.stopLoss.min
        else this.market.stopLoss = this.pending.Direction == 1 ? this.stopLoss.max : this.stopLoss.min
        return
      }
      const fix = this.marketInfo.symbolData.digits
      if (type == 1) {
        // 减
        if (this.marketType.profit == 1) {
          // 价格
          this.market.stopLoss = Number(Util.accSub(Number(this.market.stopLoss), Number(this.marketInfo.symbolData.pipv))).toFixed(fix)
          // 超出范围弹出提示
        } else {
          // 点数
          this.market.stopLoss = Number(Util.accSub(Number(this.market.stopLoss), Number(1))).toFixed(1)
        }
        if (Number(this.market.stopLoss) <= Number(this.stopLoss.min)) {
          this.market.stopLoss = Number(this.stopLoss.min).toFixed(this.marketType.profit == 1 ? fix : 1)
        }
      } else {
        // 加
        if (this.marketType.profit == 1) {
          // 价格
          this.market.stopLoss = Number(Util.accAdd(Number(this.market.stopLoss), Number(this.marketInfo.symbolData.pipv))).toFixed(fix)
        } else {
          this.market.stopLoss = Number(Util.accAdd(Number(this.market.stopLoss), Number(1))).toFixed(1)
        }
        if (Number(this.market.stopLoss) >= Number(this.stopLoss.max)) {
          this.market.stopLoss = Number(this.stopLoss.max).toFixed(this.marketType.profit == 1 ? fix : 1)
        }
      }
    },
    /* 止盈加减*/
    changeStopProfit(type) {
      if (!this.market.stopProfit || this.market.stopProfit == '') {
        if (this.marketType.profit == 2) this.market.stopProfit = this.stopProfit.min
        else this.market.stopProfit = this.pending.Direction == 1 ? this.stopProfit.min : this.stopProfit.max
        return
      }
      const fix = this.marketInfo.symbolData.digits
      if (type == 1) {
        // 减
        if (this.marketType.profit == 1) {
          // 价格
          this.market.stopProfit = Number(Util.accSub(Number(this.market.stopProfit), Number(this.marketInfo.symbolData.pipv))).toFixed(fix)
        } else {
          // 点数
          this.market.stopProfit = Number(Util.accSub(Number(this.market.stopProfit), Number(1))).toFixed(1)
        }
        if (Number(this.market.stopProfit) <= Number(this.stopProfit.min)) {
          this.market.stopProfit = Number(this.stopProfit.min).toFixed(this.marketType.profit == 1 ? fix : 1)
        }
      } else {
        // 加
        if (this.marketType.profit == 1) {
          // 价格
          this.market.stopProfit = Number(Util.accAdd(Number(this.market.stopProfit), Number(this.marketInfo.symbolData.pipv))).toFixed(fix)
        } else {
          // 点数
          this.market.stopProfit = Number(Util.accAdd(Number(this.market.stopProfit), Number(1))).toFixed(1)
        }
        if (Number(this.market.stopProfit) >= Number(this.stopProfit.max)) {
          this.market.stopProfit = Number(this.stopProfit.max).toFixed(this.marketType.profit == 1 ? fix : 1)
        }
      }
    },
    submit() {
      this.toggleFixed()
      if (this.errContent.length > 0 || this.submitText == '提交中') return
      this.submitText = '提交中'
      const req = TradeUtil.getModifyReq(this.account, this.pending, this.marketInfo.symbolData)
      req.RequestPrice = this.market.setPrice
      // 止损止盈
      if (this.market.stopLoss && this.market.stopLoss != '') {
        if (this.marketType.profit == 1) req.StopLoss = this.market.stopLoss
        else if (this.marketType.profit == 2) {
          req.StopLoss = TradeUtil.changePipValue(this.market.stopLoss, this.market.setPrice, this.market.setPrice, this.marketInfo.symbolData, this.pending.Direction, 1, 1)
        }
      }
      if (this.market.stopProfit && this.market.stopProfit != '') {
        if (this.marketType.profit == 1) req.TakeProfit = this.market.stopProfit
        if (this.marketType.profit == 2) {
          req.TakeProfit = TradeUtil.changePipValue(this.market.stopProfit, this.market.setPrice, this.market.setPrice, this.marketInfo.symbolData, this.pending.Direction, 1, 2)
        }
      }
      this.socket.tradeSocket.emit('request', Number(Constant.Req.modifyOrder), req)
    },
    isRise: function(obj, directType, type) {
      let val
      const direct = directType == 1 ? 'bid' : 'ask'
      if (obj.preData) {
        if (Number(obj[direct]) > Number(obj.preData[direct])) {
          val = type == 1 ? this.pending.Direction == directType ? 'buy' : '' : this.pending.Direction == directType ? 'rise check' : 'rise'
        } else if (Number(obj[direct]) < Number(obj.preData[direct])) {
          val = type == 1 ? this.pending.Direction == directType ? 'sell' : '' : this.pending.Direction == directType ? 'fall check' : 'fall'
        } else {
          val = type == 1 ? this.pending.Direction == directType ? 'level' : '' : this.pending.Direction == directType ? 'level check' : 'level'
        }
      } else {
        if (Number(obj[direct]) > Number(obj.preClose)) {
          val = type == 1 ? 'buy' : this.pending.Direction == directType ? 'rise check' : 'rise'
        } else if (Number(obj[direct]) < Number(obj.preClose)) {
          val = type == 1 ? 'sell' : this.pending.Direction == directType ? 'fall check' : 'fall'
        } else {
          val = type == 1 ? this.pending.Direction == directType ? 'level' : 'level check' : 'level'
        }
      }
      return val
    }
  }
}
</script>
