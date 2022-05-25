<template>
  <div>
    <div class="positionFixed">
      <div class="tcCon">
        <div class="fixedItem">

          <!-- <div class="tcTit">
            <img src="@/assets/images/quotation/a_chart_close.png" @click="clickModifyPop">
            <span>修改止损止盈</span>
            <img src="@/assets/images/quotation/a_chart_help.png" @click="goOrderHelp">
          </div> -->

          <div class="itemCon">
            <div v-if="errContent.length > 0" class="errInfo">{{ errContent[0] }}</div>

            <div class="item1">
              <p>订单号码</p>
              <span>#{{position.ID}}</span>
            </div>

            <div class="item1">
              <p>开仓价格</p>
              <span>{{position.OpenPrice}}</span>
            </div>

            <div class="item3">
              <p>类型</p>
              <ul>
                <li @click="changeProfit(1)" :class="{checked: marketType.profit == 1}">价格</li>
                <li @click="changeProfit(2)" :class="{checked: marketType.profit == 2}">点数</li>
              </ul>
            </div>

            <div class="item1">
              <p>止损<span :class="errClass.stopLossClass">({{ stopLoss.min }}-{{ stopLoss.max }})</span></p>
              <div class="itemsetbox volumebox">
                <div class="setbox">
                  <div :class="market.stopLoss!='' && Number(market.stopLoss) <= Number(stopLoss.min)?'pic cut stop':'pic cut'" @click="changeStopLoss(1)" />
                  <input v-model="market.stopLoss" placeholder="未设置">
                  <div :class="market.stopLoss!='' && Number(market.stopLoss) >= Number(stopLoss.max)?'pic add stop':'pic add'" @click="changeStopLoss(2)" />
                </div>
              </div>
            </div>

            <div class="item1">
              <p>止盈<span :class="errClass.stopProfitClass">({{ stopProfit.min }}-{{ stopProfit.max }})</span></p>
              <div class="itemsetbox volumebox">
                <div class="setbox">
                  <div :class="market.stopProfit!='' && Number(market.stopProfit) <= Number(stopProfit.min)?'pic cut stop':'pic cut'" @click="changeStopProfit(1)" />
                  <input v-model="market.stopProfit" placeholder="未设置">
                  <div :class="market.stopProfit!='' && Number(market.stopProfit) >= Number(stopProfit.max)?'pic add stop':'pic add'" @click="changeStopProfit(2)" />
                </div>
              </div> 
            </div>

            <div class="item2">
              <ul>
                <li><p>可用资金 $<Available /></p></li>
                <li v-if="lossAndProfit.stopProfit || lossAndProfit.stopLoss">
                  <p>预计盈亏
                    <em v-if="lossAndProfit.stopProfit" :class="isOks(lossAndProfit.stopProfit)">{{ lossAndProfit.stopProfit>=0?'+':'-' }}${{ Math.abs(lossAndProfit.stopProfit) }}</em>
                    <em v-if="lossAndProfit.stopProfit && lossAndProfit.stopLoss">/</em>
                    <em v-if="lossAndProfit.stopLoss" :class="isOks(lossAndProfit.stopLoss)">{{ lossAndProfit.stopLoss>=0?'+':'-' }}${{ Math.abs(lossAndProfit.stopLoss) }}</em>
                  </p>
                </li>
              </ul>
              <span :class="errContent.length>0 || submitText=='提交中'?'err':''" @click="submit()"><img v-if="submitText=='提交中'" src="@/assets/images/nav/loading1.gif">{{ submitText }}</span>
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
  name: 'ModifyStopLoss',
  components: {
    Available
  },
  props: ['position', 'code'],
  data() {
    return {
      submitText: '确认修改',
      tradeUtil: TradeUtil,
      util: Util,
      isModify: false,
      marketType: {
        profit: 1// 价格:1,点数:2
      },
      market: { stopLoss: '', stopProfit: '' },
      oldMarket: {},
      errMessage: '',
      isError: false
    }
  },
  computed: {
    ...mapState(['quote', 'symbolInfo', 'socket', 'account', 'positionUpdateRet', 'simpleResponse', 'group']),
    errMsg: {
      get() {
        return ''
      }
    },
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
    /* 止损信息*/
    stopLoss: {
      get() {
        let min; let max; let result = { min: min, max: max }
        if (!this.position.ID) return result
        const fix = this.marketInfo.symbolData.digits// 价格报价小数位
        if (this.position.Direction == 1) { // 买
          // 仓位买入（平仓卖出）： *止损价左边界值=平仓价-（最大间隔点/大点比率）*PIP
          min = this.util.accSub(this.marketInfo.tick.ask, this.util.accMul(this.marketInfo.symbolData.maxStopLevel, this.marketInfo.symbolData.pipv))
          max = this.util.accSub(this.marketInfo.tick.ask, this.util.accMul(this.marketInfo.symbolData.stopLevel, this.marketInfo.symbolData.pipv))
          if (this.marketType.profit == 1) { // 价格
            result = {
              min: Number(min).toFixed(fix),
              max: Number(max).toFixed(fix)
            }
          } else { // 点数
            result = {
              min: Number(this.util.accDiv(this.util.accSub(this.position.OpenPrice, max), this.marketInfo.symbolData.pipv)).toFixed(1),
              max: Number(this.util.accDiv(this.util.accSub(this.position.OpenPrice, min), this.marketInfo.symbolData.pipv)).toFixed(0)
            }
          }
        } else if (this.position.Direction == 2) { // 卖
          // 仓位卖出（平仓买入）：*止损价左边界值=平仓价+（间隔点/大点比率）*PIP
          min = this.util.accAdd(this.marketInfo.tick.bid, this.util.accMul(this.marketInfo.symbolData.stopLevel, this.marketInfo.symbolData.pipv))
          max = this.util.accAdd(this.marketInfo.tick.bid, this.util.accMul(this.marketInfo.symbolData.maxStopLevel, this.marketInfo.symbolData.pipv))
          if (this.marketType.profit == 1) { // 价格
            result = {
              min: Number(min).toFixed(fix),
              max: Number(max).toFixed(fix)
            }
          } else { // 点数
            result = {
              min: Number(this.util.accDiv(this.util.accSub(min, this.position.OpenPrice), this.marketInfo.symbolData.pipv)).toFixed(1),
              max: Number(this.util.accDiv(this.util.accSub(max, this.position.OpenPrice), this.marketInfo.symbolData.pipv)).toFixed(0)
            }
          }
        }
        // 数据校验
        return result
      }
    },
    /* 止盈信息*/
    stopProfit: {
      get() {
        if (!this.position.ID) return { min: min, max: max }
        let min, max
        const fix = Number(this.marketInfo.symbolData.digits)// 价格报价小数位
        if (this.position.Direction == 1) { // 买
          min = this.util.accAdd(this.marketInfo.tick.ask, this.util.accMul(this.marketInfo.symbolData.stopLevel, this.marketInfo.symbolData.pipv))
          max = this.util.accAdd(this.marketInfo.tick.ask, this.util.accMul(this.marketInfo.symbolData.maxStopLevel, this.marketInfo.symbolData.pipv))
          if (this.marketType.profit == 1) { // 价格
            return {
              min: Number(min).toFixed(fix),
              max: Number(max).toFixed(fix)
            }
          } else { // 点数
            return {
              min: Number(this.util.accDiv(this.util.accSub(min, this.position.OpenPrice), this.marketInfo.symbolData.pipv)).toFixed(1),
              max: Number(this.util.accDiv(this.util.accSub(max, this.position.OpenPrice), this.marketInfo.symbolData.pipv)).toFixed(0)
            }
          }
        } else if (this.position.Direction == 2) { // 卖,价格
          min = this.util.accSub(this.marketInfo.tick.bid, this.util.accMul(this.marketInfo.symbolData.maxStopLevel, this.marketInfo.symbolData.pipv))
          max = this.util.accSub(this.marketInfo.tick.bid, this.util.accMul(this.marketInfo.symbolData.stopLevel, this.marketInfo.symbolData.pipv))
          if (this.marketType.profit == 1) {
            return {
              min: Number(min).toFixed(fix),
              max: Number(max).toFixed(fix)
            }
          } else { // 点数
            return {
              min: Number(this.util.accDiv(this.util.accSub(this.position.OpenPrice, max), this.marketInfo.symbolData.pipv)).toFixed(1),
              max: Number(this.util.accDiv(this.util.accSub(this.position.OpenPrice, min), this.marketInfo.symbolData.pipv)).toFixed(0)
            }
          }
        }
      }
    },
    // 预期盈亏
    lossAndProfit: {
      get() {
        if (!this.position.ID) return { stopLoss: loss, stopProfit: profit }
        let loss = null; let profit = null; let sub = null// sub买卖差价
        if (this.position.Direction == 1) { // 买
          if (this.market.stopLoss && this.market.stopLoss != '') { // 亏
            if (this.marketType.profit == 2) sub = -Util.accMul(Number(this.market.stopLoss), Number(this.marketInfo.symbolData.pipv))// 点差
            else { // 价格
              sub = Util.accSub(this.market.stopLoss, this.position.OpenPrice)// 市价
            }
            if (this.marketInfo.symbolData.stockType == 1) {
              let stopLoss = this.market.stopLoss
              if (this.marketType.profit == 2) stopLoss = this.pipToChange(1)
              loss = TradeUtil.changeCurrency(sub, stopLoss, stopLoss, this.position.Volume, this.marketInfo.symbolData, this.quote.symbolTickMap, this.position.Direction)
            } else loss = TradeUtil.changeCurrency(sub, this.marketInfo.tick.ask, this.marketInfo.tick.bid, this.position.Volume, this.marketInfo.symbolData, this.quote.symbolTickMap, this.position.Direction)
          }
          if (this.market.stopProfit && this.market.stopProfit != '') { // 盈
            if (this.marketType.profit == 2) sub = Util.accMul(Number(this.market.stopProfit), Number(this.marketInfo.symbolData.pipv))// 点差
            else { // 价格
              sub = Util.accSub(this.market.stopProfit, this.position.OpenPrice)// 市价
            }
            if (this.marketInfo.symbolData.stockType == 1) {
              let stopProfit = this.market.stopProfit
              if (this.marketType.profit == 2) stopProfit = this.pipToChange(2)
              profit = TradeUtil.changeCurrency(sub, stopProfit, stopProfit, this.position.Volume, this.marketInfo.symbolData, this.quote.symbolTickMap, this.position.Direction)
            } else profit = TradeUtil.changeCurrency(sub, this.marketInfo.tick.ask, this.marketInfo.tick.bid, this.position.Volume, this.marketInfo.symbolData, this.quote.symbolTickMap, this.position.Direction)
          }
        } else { // 卖
          if (this.market.stopLoss && this.market.stopLoss != '') { // 亏
            if (this.marketType.profit == 2) sub = -Util.accMul(Number(this.market.stopLoss), Number(this.marketInfo.symbolData.pipv))// 点差
            else { // 价格
              sub = Util.accSub(this.position.OpenPrice, this.market.stopLoss)// 市价
            }
            if (this.marketInfo.symbolData.stockType == 1) {
              let stopLoss = this.market.stopLoss
              if (this.marketType.profit == 2) stopLoss = this.pipToChange(1)
              loss = TradeUtil.changeCurrency(sub, stopLoss, stopLoss, this.position.Volume, this.marketInfo.symbolData, this.quote.symbolTickMap, this.position.Direction)
            } else loss = TradeUtil.changeCurrency(sub, this.marketInfo.tick.ask, this.marketInfo.tick.bid, this.position.Volume, this.marketInfo.symbolData, this.quote.symbolTickMap, this.position.Direction)
          }
          if (this.market.stopProfit && this.market.stopProfit != '') { // 盈
            if (this.marketType.profit == 2) sub = Util.accMul(Number(this.market.stopProfit), Number(this.marketInfo.symbolData.pipv))// 点差
            else { // 价格
              sub = Util.accSub(this.position.OpenPrice, this.market.stopProfit)// 市价
            }
            if (this.marketInfo.symbolData.stockType == 1) {
              let stopProfit = this.market.stopProfit
              if (this.marketType.profit == 2) stopProfit = this.pipToChange(2)
              profit = TradeUtil.changeCurrency(sub, stopProfit, stopProfit, this.position.Volume, this.marketInfo.symbolData, this.quote.symbolTickMap, this.position.Direction)
            } else profit = TradeUtil.changeCurrency(sub, this.marketInfo.tick.ask, this.marketInfo.tick.bid, this.position.Volume, this.marketInfo.symbolData, this.quote.symbolTickMap, this.position.Direction)
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
        let stopLossClass = this.market.stopLoss != '' && (Number(this.market.stopLoss) > Number(this.stopLoss.max) || Number(this.market.stopLoss) < Number(this.stopLoss.min)) ? 'err' : ''
        let stopProfitClass = this.market.stopProfit != '' && (Number(this.market.stopProfit) > Number(this.stopProfit.max) || Number(this.market.stopProfit) < Number(this.stopProfit.min)) ? 'err' : ''
        if (String(this.market.stopLoss).trim() == '-') stopLossClass = 'err'
        if (String(this.market.stopProfit).trim() == '-') stopProfitClass = 'err'
        return {
          stopLossClass: stopLossClass,
          stopProfitClass: stopProfitClass
        }
      }
    },
    errContent: {
      get() {
        const arr = []
        if (this.market.stopLoss != '' && (Number(this.market.stopLoss) > Number(this.stopLoss.max) || Number(this.market.stopLoss) < Number(this.stopLoss.min))) arr.push('您输入的止损不在范围内，请重新输入')
        if (this.market.stopProfit != '' && (Number(this.market.stopProfit) > Number(this.stopProfit.max) || Number(this.market.stopProfit) < Number(this.stopProfit.min))) arr.push('您输入的止盈不在范围内，请重新输入')
        const stopLoss = this.market.stopLoss == '' ? 0 : this.marketType.profit == 1 ? this.market.stopLoss : TradeUtil.changePipValue(this.market.stopLoss, this.position.OpenPrice, this.position.OpenPrice, this.marketInfo.symbolData, this.position.Direction, 1, 1)
        const stopProfit = this.market.stopProfit == '' ? 0 : this.marketType.profit == 1 ? this.market.stopProfit : TradeUtil.changePipValue(this.market.stopProfit, this.position.OpenPrice, this.position.OpenPrice, this.marketInfo.symbolData, this.position.Direction, 1, 2)
        if (stopLoss == this.position.StopLoss && stopProfit == this.position.TakeProfit) {
          // 无任何修改时提示
          arr.push('无任何参数修改,请您修改后再提交')
        }
        if (String(this.market.stopLoss).trim() == '-') arr.push('您输入的止损不在范围内，请重新输入')
        if (String(this.market.stopProfit).trim() == '-') arr.push('您输入的止盈不在范围内，请重新输入')
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
          if (isNaN(newValue.stopLoss) || String(newValue.stopLoss).indexOf('e') >= 0) {
            if (String(newValue.stopLoss).trim() != '-' || this.marketType.profit == 1) this.market.stopLoss = this.oldMarket.stopLoss
          } else {
            if (String(newValue.stopLoss).indexOf('-') >= 0 && this.marketType.profit == 1) this.market.stopLoss = this.oldMarket.stopLoss
            if (String(newValue.stopLoss).indexOf('.') > 0 && this.marketInfo.symbolData) {
              if (this.marketType.profit == 1 && String(newValue.stopLoss).split('.')[1].length > this.marketInfo.symbolData.digits) { //
                this.market.stopLoss = this.oldMarket.stopLoss
              } else if (this.marketType.profit == 2 && String(newValue.stopLoss).split('.')[1].length > 1) {
                this.market.stopLoss = this.oldMarket.stopLoss
              }
            }
          }
        }
        // 止盈价控制
        if (newValue.stopProfit && newValue.stopProfit != '') {
          if (isNaN(newValue.stopProfit) || String(newValue.stopProfit).indexOf('e') >= 0) {
            if (String(newValue.stopProfit).trim() != '-' || this.marketType.profit == 1) this.market.stopProfit = this.oldMarket.stopProfit
          } else {
            if (String(newValue.stopProfit).indexOf('-') >= 0 && this.marketType.profit == 1) this.market.stopProfit = this.oldMarket.stopProfit
            if (String(newValue.stopProfit).indexOf('.') > 0 && this.marketInfo.symbolData) {
              if (this.marketType.profit == 1 && String(newValue.stopProfit).split('.')[1].length > this.marketInfo.symbolData.digits) { //
                this.market.stopProfit = this.oldMarket.stopProfit
              } else if (this.marketType.profit == 2 && String(newValue.stopProfit).split('.')[1].length > 1) {
                this.market.stopProfit = this.oldMarket.stopProfit
              }
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
    positionUpdateRet: {
      deep: true,
      handler(newValue, oldValue) {
        if (newValue.ID && this.position && this.position.ID && newValue.MsgId == 1704) {
          if (newValue.ID == this.position.ID) {
            // 修改成功
            const data = TradeUtil.copy(newValue)
            if (this.marketType.profit == 2) {
              data.setStopLossTip = this.market.stopLoss
              data.setStopProfitTip = this.market.stopProfit
            }
            this.isModify = false
            this.submitText = '确认修改'
            const source = this.quote.notify[this.code].uiSourceCode
            this.$router.replace({ path: '/home/ModifySuc', query: { ...data, source: source }})
          }
        }
      }
    }
  },
  methods: {
    errPop() {
      this.isError = !this.isError
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
    clickModifyPop() {
      this.toggleFixed()
      this.isModify = !this.isModify
      /* 初始化止损止盈价格*/
      if (this.position.StopLoss && Number(this.position.StopLoss) != 0) this.market.stopLoss = this.position.StopLoss
      if (this.position.TakeProfit && Number(this.position.TakeProfit) != 0) this.market.stopProfit = this.position.TakeProfit
    },
    /* 止损止盈价格点数切换*/
    changeProfit(type) {
      this.marketType.profit = type
      if (this.market.stopLoss && this.market.stopLoss != '') {
        this.market.stopLoss = TradeUtil.changePipValue(this.market.stopLoss, this.position.OpenPrice, this.position.OpenPrice, this.marketInfo.symbolData, this.position.Direction, this.marketType.profit, 1)
      }
      if (this.market.stopProfit && this.market.stopProfit != '') {
        this.market.stopProfit = TradeUtil.changePipValue(this.market.stopProfit, this.position.OpenPrice, this.position.OpenPrice, this.marketInfo.symbolData, this.position.Direction, this.marketType.profit, 2)
      }
    },
    // 点数转价格
    pipToChange(lossOrProfit) {
      if (lossOrProfit == 1) {
        // 止损
        if (this.market.stopLoss && this.market.stopLoss != '') {
          return TradeUtil.changePipValue(this.market.stopLoss, this.position.OpenPrice, this.position.OpenPrice, this.marketInfo.symbolData, this.position.Direction, 1, 1)
        }
        return ''
      } else {
        // 止盈
        if (this.market.stopProfit && this.market.stopProfit != '') {
          return TradeUtil.changePipValue(this.market.stopProfit, this.position.OpenPrice, this.position.OpenPrice, this.marketInfo.symbolData, this.position.Direction, 1, 2)
        }
        return ''
      }
    },
    changeStopLoss(type) {
      if (!this.market.stopLoss || this.market.stopLoss == '') {
        if (this.marketType.profit == 2) this.market.stopLoss = this.stopLoss.min
        else this.market.stopLoss = this.position.Direction == 1 ? this.stopLoss.max : this.stopLoss.min
        return
      }
      const fix = this.marketInfo.symbolData.digits
      if (type == 1) {
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
    changeStopProfit(type) {
      if (!this.market.stopProfit || this.market.stopProfit == '') {
        if (this.marketType.profit == 2) this.market.stopProfit = this.stopProfit.min
        else this.market.stopProfit = this.position.Direction == 1 ? this.stopProfit.min : this.stopProfit.max
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
      const req = TradeUtil.getPositionProfitLossReq(this.account, this.marketInfo.symbolData, this.position)
      const fix = this.marketInfo.symbolData.digits
      // 止损止盈
      if (this.market.stopLoss && this.market.stopLoss != '') {
        if (this.marketType.profit == 1) req.StopLoss = Number(this.market.stopLoss).toFixed(fix)
        else if (this.marketType.profit == 2) {
          req.StopLoss = TradeUtil.changePipValue(this.market.stopLoss, this.position.OpenPrice, this.position.OpenPrice, this.marketInfo.symbolData, this.position.Direction, 1, 1)
        }
      }
      if (this.market.stopProfit && this.market.stopProfit != '') {
        if (this.marketType.profit == 1) req.TakeProfit = Number(this.market.stopProfit).toFixed(fix)
        if (this.marketType.profit == 2) {
          req.TakeProfit = TradeUtil.changePipValue(this.market.stopProfit, this.position.OpenPrice, this.position.OpenPrice, this.marketInfo.symbolData, this.position.Direction, 1, 2)
        }
      }
      this.socket.tradeSocket.emit('request', Number(Constant.Req.profitloss), req)
    },
    isOks: function(obj) {
      var val = ''
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
