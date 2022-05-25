<template>
  <!--买入卖出弹窗-->
  <div>
    <div
      v-if="Show"
      class="fixedCon"
    >
      <div
        class="masking"
        @click="clickPop"
      />
      <div class="tcCon">
        <div class="fixedItem">
          <div class="tcTit">
            <img
              v-ga="{'eventCategory':'H5_Detail','eventAction':'CloseOrder','eventLabel':sign}"
              src="@/assets/images/quotation/a_chart_close.png"
              @click="clickPop"
            >
            <div class="titCon">
              <ul>
                <li
                  v-for="(item,index) in tabs"
                  v-ga="{'eventCategory':'H5_Detail','eventAction':item.tabAction,'eventLabel':sign}"
                  :class="{checked:isTrue==index}"
                  @click="tabclick(index,item)"
                ><span>{{ item.name }}</span>
                  <p />
                </li>
              </ul>
            </div>
            <img
              v-ga="{'eventCategory':'H5_Detail','eventAction':'OrderHelp','eventLabel':sign}"
              src="@/assets/images/quotation/a_chart_help.png"
              @click="goOrderHelp"
            >
          </div>
          <div
            v-if="errContent.length > 0"
            class="errInfo"
            v-html="errContent[0]"
          />
          <div class="itemCon">
            <div class="item">
              <ul>
                <li
                  :class="isRise(marketInfo.tick,2,1)"
                  @click="changeDirect(2)"
                >
                  <p>卖出</p><span>{{ marketInfo.tick.ask }}</span><em :class="isRise(marketInfo.tick,2,2)" />
                </li>
                <li
                  :class="isRise(marketInfo.tick,1,1)"
                  @click="changeDirect(1)"
                >
                  <p>买入</p><span>{{ marketInfo.tick.bid }}</span><em :class="isRise(marketInfo.tick,1,2)" />
                </li>
              </ul>
            </div>
            <!--挂单-->
            <div
              v-if="isTrue==1"
              class="item3 border"
            >
              <p>类型</p>
              <ul>
                <li>
                  <input
                    id="radio"
                    v-model="marketType.pendType"
                    v-ga="{'eventCategory':'H5_Detail','eventAction':'PriceLimit','eventLabel':sign}"
                    type="radio"
                    value="1"
                    checked="checked"
                    class="radio"
                    @change="changePendType()"
                  >
                  <label for="radio"><span /></label>
                  <p>限价</p>
                </li>
                <li>
                  <input
                    id="radio1"
                    v-model="marketType.pendType"
                    v-ga="{'eventCategory':'H5_Detail','eventAction':'StopLoss','eventLabel':sign}"
                    type="radio"
                    value="2"
                    class="radio"
                    @change="changePendType()"
                  >
                  <label for="radio1"><span /></label>
                  <p>停损</p>
                </li>
              </ul>
            </div>
            <div
              v-if="isTrue==1"
              class="item3 margin"
            >
              <div class="inputCon">
                <span :class="errClass.setPriceClass">({{ pendPrice.min }}-{{ pendPrice.max }})</span>
                <div
                  :class="market.setPrice!=''&&Number(market.setPrice)<=Number(pendPrice.min)?'pic cut stop':'pic cut'"
                  @click="changeSetPrice(1)"
                />
                <input
                  v-model="market.setPrice"
                  placeholder="未设置"
                >
                <div
                  :class="market.setPrice!=''&&Number(market.setPrice)>=Number(pendPrice.max)?'pic add stop':'pic add'"
                  @click="changeSetPrice(2)"
                />
              </div>
            </div>
            <!--市价-->
            <div class="item1">
              <p>手数<span :class="errClass.volumeClass">({{ marketInfo.symbolData.minVolumes }}-{{ marketInfo.symbolData.maxVolumes }})</span>
              </p>
              <div
                :class="market.volume != ''&& Number(market.volume)<= Number(marketInfo.symbolData.minVolumes)?'pic cut stop':'pic cut'"
                @click="changeVolume(1)"
              />
              <input
                v-model="market.volume"
                placeholder="未设置"
              >
              <div
                :class="market.volume != ''&& Number(market.volume)>= Number(marketInfo.symbolData.maxVolumes)?'pic add stop':'pic add'"
                class="pic add"
                @click="changeVolume(2)"
              />
            </div>
            <div class="isShow">
              <div class="titShow">
                <p>止损止盈</p>
                <div class="arrow">
                  <ul v-if="isShow">
                    <li
                      v-for="(item,index) in tabsName"
                      :class="{checked:isIndex==index}"
                      @click="tabName(index,item)"
                    >{{ item.name }}</li>
                  </ul>
                  <span
                    v-ga="{'eventCategory':'H5_Detail','eventAction':'ProfitLoss','eventLabel':sign}"
                    :class="{'checked':isShow}"
                    @click="clickArrow"
                  />
                </div>
              </div>
              <div
                v-if="isShow"
                class="conHide"
              >
                <div>
                  <div class="item1">
                    <!--买入价-最大间隔点*pip/大点比率  买入价-间隔点*pip/大点比率-->
                    <p v-if="marketType.profit == 1">止损<span :class="errClass.stopLossClass">({{ stopLoss.min }}-{{ stopLoss.max }})</span></p>
                    <p v-else>止损<span :class="errClass.stopLossClass">({{ stopLoss.min }}-{{ stopLoss.max }})</span></p>
                    <div
                      :class="market.stopLoss!='' && Number(market.stopLoss) <= Number(stopLoss.min)?'pic cut stop':'pic cut'"
                      @click="changeStopLoss(1)"
                    />
                    <input
                      v-model="market.stopLoss"
                      placeholder="未设置"
                    >
                    <div
                      :class="market.stopLoss!='' && Number(market.stopLoss) >= Number(stopLoss.max)?'pic add stop':'pic add'"
                      @click="changeStopLoss(2)"
                    />
                  </div>
                  <div class="item1">
                    <!--买入价+间隔点*pip/大点比率   买入价+最大间隔点*pip/大点比-->
                    <p v-if="marketType.profit == 1">止盈<span :class="errClass.stopProfitClass">({{ stopProfit.min }}-{{ stopProfit.max }})</span>
                    </p><p v-else>止盈<span :class="errClass.stopProfitClass">({{ stopProfit.min }}-{{ stopProfit.max }})</span></p>
                    <div
                      :class="market.stopProfit!='' && Number(market.stopProfit) <= Number(stopProfit.min)?'pic cut stop':'pic cut'"
                      @click="changeStopProfit(1)"
                    />
                    <input
                      v-model="market.stopProfit"
                      placeholder="未设置"
                    >
                    <div
                      :class="market.stopProfit!='' && Number(market.stopProfit) >= Number(stopProfit.max)?'pic add stop':'pic add'"
                      @click="changeStopProfit(2)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <RangeScope
              v-if="isTrue==0"
              :range-scope="marketInfo.symbolData.rangeScope"
              :range="market.range"
              @changeRange="changeRange"
            />
            <!--挂单-->
            <div
              v-if="isTrue==1"
              class="item3 border"
            >
              <p>有效期</p>
              <ul>
                <li>
                  <input
                    id="radio2"
                    v-model="market.expireType"
                    v-ga="{'eventCategory':'H5_Detail','eventAction':'ValidityWeek','eventLabel':sign}"
                    type="radio"
                    value="2"
                    class="radio"
                  >
                  <label for="radio2"><span /></label>
                  <p>当周</p>
                </li>
                <li>
                  <input
                    id="radio3"
                    v-model="market.expireType"
                    v-ga="{'eventCategory':'H5_Detail','eventAction':'ValidityDay','eventLabel':sign}"
                    type="radio"
                    value="1"
                    class="radio"
                  >
                  <label for="radio3"><span /></label>
                  <p>当日</p>
                </li>
              </ul>
            </div>
            <!--市价-->
            <div class="item2">
              <ul>
                <li v-if="market.volume && market.volume != '' && marketInfo.symbolData">
                  <p>参考保证金 ${{ tradeUtil.getMargin(market.volume,marketInfo.symbolData,marketType.direct,tradeData.position) }}</p>
                </li>
                <li>
                  <div>
                    <p>可用资金 $<Available ref="availableChild" />
                    </p>
                  </div>
                </li>
                <li v-if="lossAndProfit.stopProfit || lossAndProfit.stopLoss">
                  <p>
                    预计盈亏
                    <em
                      v-if="lossAndProfit.stopProfit"
                      :class="lossAndProfit.stopProfit>0?'rise':'fall'"
                    >{{ lossAndProfit.stopProfit>=0?'+':'-' }}${{ Math.abs(lossAndProfit.stopProfit) }}</em>
                    <em v-if="lossAndProfit.stopProfit && lossAndProfit.stopLoss">/</em>
                    <em
                      v-if="lossAndProfit.stopLoss"
                      :class="lossAndProfit.stopLoss>0?'rise':'fall'"
                    >{{ lossAndProfit.stopLoss>=0?'+':'-' }}${{ Math.abs(lossAndProfit.stopLoss) }}</em>
                  </p>
                </li>
              </ul>
              <span
                v-ga="{'eventCategory':'H5_Detail','eventAction':'SubmitOrders','eventLabel':sign}"
                :class="errContent.length>0 || submitText=='提交中'?'err':''"
                @click="submit"
              ><img
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
import Util from '@/utils/tradeDataUtil'
import TradeUtil from '@/utils/tradeUtil'
import Constant from '@/utils/Constant'
import Available from '@/view/trade/account/Available.vue'
import RangeScope from '@/view/trade/RangeScope.vue'

export default {
  name: 'MarketNorm',
  components: {
    Available, RangeScope
  },
  props: ['code'],
  computed: {
    ...mapState(['quote', 'symbolInfo', 'socket', 'account', 'orderAddRet', 'positionAddRet', 'tradeData', 'simpleResponse', 'group']),
    marketInfo: {
      get() {
        var symbolData = {}
        var tick = {}
        if (this.quote.notify[this.code]) {
          const source = this.quote.notify[this.code].uiSourceCode
          if (this.symbolInfo.codeMap[source]) symbolData = this.symbolInfo.codeMap[source]
        }
        if (this.quote.codeTickMap && this.quote.codeTickMap[this.code]) tick = this.quote.codeTickMap[this.code]
        // if (symbolData && this.market.volume == "") this.market.volume = symbolData.minVolumes;
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
        if (this.marketType.type == 2 && this.marketInfo) {
          if (this.marketType.pendType == 1) { // 限价
            if (this.marketType.direct == 1) { // 买
              min = this.util.accSub(this.marketInfo.tick.bid, this.marketInfo.symbolData.maxStopLevel * this.marketInfo.symbolData.pipv)
              max = this.util.accSub(this.marketInfo.tick.bid, this.marketInfo.symbolData.stopLevel * this.marketInfo.symbolData.pipv)
            } else { // 卖
              min = this.util.accAdd(this.marketInfo.tick.ask, this.marketInfo.symbolData.stopLevel * this.marketInfo.symbolData.pipv)
              max = this.util.accAdd(this.marketInfo.tick.ask, this.marketInfo.symbolData.maxStopLevel * this.marketInfo.symbolData.pipv)
            }
          } else { // 停损
            if (this.marketType.direct == 1) { // 买
              min = this.util.accAdd(this.marketInfo.tick.bid, this.marketInfo.symbolData.stopLevel * this.marketInfo.symbolData.pipv)
              max = this.util.accAdd(this.marketInfo.tick.bid, this.marketInfo.symbolData.maxStopLevel * this.marketInfo.symbolData.pipv)
            } else { // 卖
              min = this.util.accSub(this.marketInfo.tick.ask, this.marketInfo.symbolData.maxStopLevel * this.marketInfo.symbolData.pipv)
              max = this.util.accSub(this.marketInfo.tick.ask, this.marketInfo.symbolData.stopLevel * this.marketInfo.symbolData.pipv)
            }
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
          // 对比信息
          }
        }
        const fix = this.marketInfo.symbolData.digits// 价格报价小数位
        if (this.marketType.direct == 1) { // 买,价格
          if (this.marketType.type == 1) { // 市价买
            min = this.util.accSub(this.marketInfo.tick.bid, this.marketInfo.symbolData.maxStopLevel * this.marketInfo.symbolData.pipv)
            max = this.util.accSub(this.marketInfo.tick.bid, this.marketInfo.symbolData.stopLevel * this.marketInfo.symbolData.pipv)
          } else if (this.marketType.type == 2) { // 挂单
            min = this.util.accSub(this.market.setPrice, this.marketInfo.symbolData.maxStopLevel * this.marketInfo.symbolData.pipv)
            max = this.util.accSub(this.market.setPrice, this.marketInfo.symbolData.stopLevel * this.marketInfo.symbolData.pipv)
          }
          return {
            min: Number(min).toFixed(fix),
            max: Number(max).toFixed(fix)

          }
        } else if (this.marketType.direct == 2) { // 卖,价格
          if (this.marketType.type == 1) { // 市价
            min = this.util.accAdd(this.marketInfo.tick.ask, this.marketInfo.symbolData.stopLevel * this.marketInfo.symbolData.pipv)
            max = this.util.accAdd(this.marketInfo.tick.ask, this.marketInfo.symbolData.maxStopLevel * this.marketInfo.symbolData.pipv)
          } else if (this.marketType.type == 2) { // 挂单
            min = this.util.accAdd(this.market.setPrice, this.marketInfo.symbolData.stopLevel * this.marketInfo.symbolData.pipv)
            max = this.util.accAdd(this.market.setPrice, this.marketInfo.symbolData.maxStopLevel * this.marketInfo.symbolData.pipv)
          }
          return {
            min: Number(min).toFixed(fix),
            max: Number(max).toFixed(fix)

          }
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
        if (this.marketType.direct == 1) { // 买,价格
          if (this.marketType.type == 1) { // 挂单
            min = this.util.accAdd(this.marketInfo.tick.bid, this.marketInfo.symbolData.stopLevel * this.marketInfo.symbolData.pipv)
            max = this.util.accAdd(this.marketInfo.tick.bid, this.marketInfo.symbolData.maxStopLevel * this.marketInfo.symbolData.pipv)
          } else if (this.marketType.type == 2) { // 挂单
            min = this.util.accAdd(this.market.setPrice, this.marketInfo.symbolData.stopLevel * this.marketInfo.symbolData.pipv)
            max = this.util.accAdd(this.market.setPrice, this.marketInfo.symbolData.maxStopLevel * this.marketInfo.symbolData.pipv)
          }
          return {
            min: Number(min).toFixed(fix),
            max: Number(max).toFixed(fix)
          }
        } else if (this.marketType.direct == 2) { // 卖,价格
          if (this.marketType.type == 1) { // 市价
            min = this.util.accSub(this.marketInfo.tick.ask, this.marketInfo.symbolData.maxStopLevel * this.marketInfo.symbolData.pipv)
            max = this.util.accSub(this.marketInfo.tick.ask, this.marketInfo.symbolData.stopLevel * this.marketInfo.symbolData.pipv)
          } else if (this.marketType.type == 2) { // 挂单
            min = this.util.accSub(this.market.setPrice, this.marketInfo.symbolData.maxStopLevel * this.marketInfo.symbolData.pipv)
            max = this.util.accSub(this.market.setPrice, this.marketInfo.symbolData.stopLevel * this.marketInfo.symbolData.pipv)
          }
          return {
            min: Number(min).toFixed(fix),
            max: Number(max).toFixed(fix)
          }
        }
      }
    },
    // 预期盈亏
    lossAndProfit: {
      get() {
        let loss = null; let profit = null; let sub = null// sub买卖差价
        if (this.marketType.direct == 1) { // 买
          if (this.market.stopLoss && this.market.stopLoss != '') { // 亏
            if (this.marketType.profit == 2) sub = -Util.accMul(this.market.stopLoss, this.marketInfo.symbolData.pipv)// 点差
            else { // 价格
              if (this.marketType.type == 1) sub = Util.accSub(this.market.stopLoss, this.marketInfo.tick.bid)// 市价
              else sub = Util.accSub(this.market.stopLoss, this.market.setPrice)// 挂单
            }
            // 间接货币特殊处理
            if (this.marketInfo.symbolData.stockType == 1) {
              let stopLoss = this.market.stopLoss
              if (this.marketType.profit == 2) stopLoss = this.pipToChange(1)
              loss = TradeUtil.changeCurrency(sub, stopLoss, stopLoss, this.market.volume, this.marketInfo.symbolData, this.quote.symbolTickMap, this.marketType.direct)
            } else loss = TradeUtil.changeCurrency(sub, this.marketInfo.tick.ask, this.marketInfo.tick.bid, this.market.volume, this.marketInfo.symbolData, this.quote.symbolTickMap, this.marketType.direct)
          }
          if (this.market.stopProfit && this.market.stopProfit != '') { // 盈
            if (this.marketType.profit == 2) sub = Util.accMul(this.market.stopProfit, this.marketInfo.symbolData.pipv)// 点差
            else { // 价格
              if (this.marketType.type == 1) sub = Util.accSub(this.market.stopProfit, this.marketInfo.tick.bid)// 市价
              else sub = Util.accSub(this.market.stopProfit, this.market.setPrice)// 挂单
            }
            // 间接货币特殊处理
            if (this.marketInfo.symbolData.stockType == 1) {
              let stopProfit = this.market.stopProfit
              if (this.marketType.profit == 2) stopProfit = this.pipToChange(2)
              profit = TradeUtil.changeCurrency(sub, stopProfit, stopProfit, this.market.volume, this.marketInfo.symbolData, this.quote.symbolTickMap, this.marketType.direct)
            } else profit = TradeUtil.changeCurrency(sub, this.marketInfo.tick.ask, this.marketInfo.tick.bid, this.market.volume, this.marketInfo.symbolData, this.quote.symbolTickMap, this.marketType.direct)
          }
        } else { // 卖
          if (this.market.stopLoss && this.market.stopLoss != '') { // 亏
            if (this.marketType.profit == 2) sub = -Util.accMul(this.market.stopLoss, this.marketInfo.symbolData.pipv)// 点差
            else { // 价格
              if (this.marketType.type == 1) sub = Util.accSub(this.marketInfo.tick.ask, this.market.stopLoss)// 市价
              else sub = Util.accSub(this.market.setPrice, this.market.stopLoss)// 挂单
            }
            // 间接货币特殊处理
            if (this.marketInfo.symbolData.stockType == 1) {
              let stopLoss = this.market.stopLoss
              if (this.marketType.profit == 2) stopLoss = this.pipToChange(1)
              loss = TradeUtil.changeCurrency(sub, stopLoss, stopLoss, this.market.volume, this.marketInfo.symbolData, this.quote.symbolTickMap, this.marketType.direct)
            } else loss = TradeUtil.changeCurrency(sub, this.marketInfo.tick.ask, this.marketInfo.tick.bid, this.market.volume, this.marketInfo.symbolData, this.quote.symbolTickMap, this.marketType.direct)
          }
          if (this.market.stopProfit && this.market.stopProfit != '') { // 盈
            if (this.marketType.profit == 2) sub = Util.accMul(this.market.stopProfit, this.marketInfo.symbolData.pipv)// 点差
            else { // 价格
              if (this.marketType.type == 1) sub = Util.accSub(this.marketInfo.tick.ask, this.market.stopProfit)// 市价
              else sub = Util.accSub(this.market.setPrice, this.market.stopProfit)// 挂单
            }
            // 间接货币特殊处理
            if (this.marketInfo.symbolData.stockType == 1) {
              let stopProfit = this.market.stopProfit
              if (this.marketType.profit == 2) stopProfit = this.pipToChange(2)
              profit = TradeUtil.changeCurrency(sub, stopProfit, stopProfit, this.market.volume, this.marketInfo.symbolData, this.quote.symbolTickMap, this.marketType.direct)
            } else profit = TradeUtil.changeCurrency(sub, this.marketInfo.tick.ask, this.marketInfo.tick.bid, this.market.volume, this.marketInfo.symbolData, this.quote.symbolTickMap, this.marketType.direct)
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
        const volumeClass = this.market.volume != '' && (Number(this.market.volume) > Number(this.marketInfo.symbolData.maxVolumes) || Number(this.market.volume) < Number(this.marketInfo.symbolData.minVolumes)) ? 'err' : ''
        const stopLossClass = this.market.stopLoss != '' && (Number(this.market.stopLoss) > Number(this.stopLoss.max) || Number(this.market.stopLoss) < Number(this.stopLoss.min)) ? 'err' : ''
        const stopProfitClass = this.market.stopProfit != '' && (Number(this.market.stopProfit) > Number(this.stopProfit.max) || Number(this.market.stopProfit) < Number(this.stopProfit.min)) ? 'err' : ''
        const setPriceClass = this.market.setPrice != '' && (Number(this.market.setPrice) > Number(this.pendPrice.max) || Number(this.market.setPrice) < Number(this.pendPrice.min)) ? 'err' : ''
        return {
          volumeClass: volumeClass,
          stopLossClass: stopLossClass,
          stopProfitClass: stopProfitClass,
          setPriceClass: setPriceClass
        }
      }
    },
    errContent: {
      get() {
        const arr = []
        // 手数
        if (this.market.volume == '' || Number(this.market.volume) > Number(this.marketInfo.symbolData.maxVolumes) || Number(this.market.volume) < Number(this.marketInfo.symbolData.minVolumes)) arr.push('您输入的手数不在范围内，请重新输入')
        // 挂单价
        if (this.marketType.type == 2 && (this.market.setPrice == '' || Number(this.market.setPrice) > Number(this.pendPrice.max) || Number(this.market.setPrice) < Number(this.pendPrice.min))) arr.push('您输入的价格不在范围内，请重新输入')
        // 止损
        if (this.market.stopLoss != '' && (Number(this.market.stopLoss) > Number(this.stopLoss.max) || Number(this.market.stopLoss) < Number(this.stopLoss.min))) arr.push('您输入的止损不在范围内，请重新输入')
        // 止盈
        if (this.market.stopProfit != '' && (Number(this.market.stopProfit) > Number(this.stopProfit.max) || Number(this.market.stopProfit) < Number(this.stopProfit.min))) arr.push('您输入的止盈不在范围内，请重新输入')
        // 可用资金不足
        if (this.$refs.availableChild && Number(this.$refs.availableChild.available) <= 0) arr.push('您的可用资金不足，请先充值')
        return arr
      }
    }
  },
  data() {
    return {
      submitText: '提交',
      util: Util,
      tradeUtil: TradeUtil,
      market: { stopLoss: '', stopProfit: '', volume: '', setPrice: '', expireType: 2, range: '' },
      oldMarket: {}, // 监听market旧数据使用
      marketType: {
        type: 1, // 市价:1,挂单:2
        direct: 1, // 买:1,卖:2
        profit: 1, // 价格:1,点数:2
        pendType: 1// 挂单类型：1:限价，2:停损
      },
      isTrue: 0,
      isIndex: 0,
      tabs: [
        { name: '市价', type: 1, tabAction: 'MarketPrice' },
        { name: '挂单', type: 2, tabAction: 'PendingOrder' }
      ],
      tabsName: [
        { name: '价格', type: 1, normAction: 'PriceNorm' },
        { name: '点数', type: 2, normAction: 'PipsNorm' }
      ],
      Show: false,
      isShow: false,
      errMessage: '',
      isError: false,
      itemName: '市价',
      tabNames: '价格',
      sign: process.env.VUE_APP_GA_SIGN
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
        // 手数控制
        if (newValue.volume && newValue.volume != '') {
          if (isNaN(newValue.volume) || String(newValue.volume).indexOf('e') >= 0 || String(newValue.volume).indexOf('-') >= 0) {
            this.market.volume = this.oldMarket.volume
          } else if (String(newValue.volume).indexOf('.') > 0 && this.marketInfo.symbolData) {
            const fix = String(this.marketInfo.symbolData.volumesStep).indexOf('.') >= 0 ? String(this.marketInfo.symbolData.volumesStep).split('.')[1].length : 0
            if (String(newValue.volume).split('.')[1].length > fix) {
              this.market.volume = this.oldMarket.volume
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
    orderAddRet: {
      deep: true,
      handler(newValue, oldValue) {
        if (newValue.Type) {
          if (newValue.Type == Constant.OrderType.LIMIT || newValue.Type == Constant.OrderType.STOP) {
            // 挂单成功
            const data = TradeUtil.copy(newValue)
            if (this.marketType.profit == 2) {
              // 点数下单
              data.setStopLossTip = this.market.stopLoss
              data.setStopProfitTip = this.market.stopProfit
            }
            this.$cookie.set('orderSuc', 'suc', { expires: 7, path: '/' })
            this.$router.push({ path: 'SucOrdered', query: { ...data, source: this.marketInfo.symbolData.source }})
          }
        }
      }
    },
    positionAddRet: {
      deep: true,
      handler(newValue, oldValue) {
        if (newValue.ID) {
          if (this.orderAddRet.Type == Constant.OrderType.OPEN) {
            // 市价下单成功
            // 缓存this.marketInfo.symbolData.source     this.orderAddRet.Range
            TradeUtil.saveRange(this.marketInfo.symbolData.source, Number(this.orderAddRet.Range).toFixed(0))

            const data = TradeUtil.copy(newValue)
            data.RequestPrice = data.OpenPrice// 字段转换
            data.RequestVolume = data.Volume// 字段转换
            data.Type = 1// 标识市价下单
            if (this.marketType.profit == 2) {
              // 点数下单
              data.setStopLossTip = this.market.stopLoss
              data.setStopProfitTip = this.market.stopProfit
            }
            this.$cookie.set('orderSuc', 'suc', { expires: 7, path: '/' })
            this.$router.push({ path: 'SucOrdered', query: { ...data, source: this.marketInfo.symbolData.source }})
          }
        }
      }
    }
  },
  mounted() {
    // if (!this.code) this.code = this.GetUrlParam(id)
    this.market.volume = this.marketInfo.symbolData.minVolumes || ''
    // console.log(this.marketInfo)
  },
  methods: {
    back() {
      this.$router.go(-1)
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
      if (body.clientWidth > 750) {
        mainH.style.left = (body.clientWidth - 750) / 2 + 'px'
      }
    },
    tabclick: function(index, item) {
      this.isTrue = index
      this.market.stopLoss = ''
      this.market.stopProfit = ''
      this.marketType.type = item.type
      this.itemName = item.name
      /* if (item.type == 2) {//挂单
           if (this.marketType.pendType == 1) this.market.setPrice = this.pendPrice.min;
           else if (this.marketType.pendType == 1) this.market.setPrice = this.pendPrice.max;
       }*/
      this.changeDirect(this.marketType.direct)
    },
    tabName: function(index, item) {
      this.isIndex = index
      this.marketType.profit = item.type
      this.tabNames = item.name
      if (this.market.stopLoss && this.market.stopLoss != '') {
        if (this.marketType.type == 1) this.market.stopLoss = TradeUtil.changePipValue(this.market.stopLoss, this.marketInfo.tick.ask, this.marketInfo.tick.bid, this.marketInfo.symbolData, this.marketType.direct, this.marketType.profit, 1)
        else if (this.marketType.type == 2) this.market.stopLoss = TradeUtil.changePipValue(this.market.stopLoss, this.market.setPrice, this.market.setPrice, this.marketInfo.symbolData, this.marketType.direct, this.marketType.profit, 1)
      }
      if (this.market.stopProfit && this.market.stopProfit != '') {
        if (this.marketType.type == 1) this.market.stopProfit = TradeUtil.changePipValue(this.market.stopProfit, this.marketInfo.tick.ask, this.marketInfo.tick.bid, this.marketInfo.symbolData, this.marketType.direct, this.marketType.profit, 2)
        else if (this.marketType.type == 2) this.market.stopProfit = TradeUtil.changePipValue(this.market.stopProfit, this.market.setPrice, this.market.setPrice, this.marketInfo.symbolData, this.marketType.direct, this.marketType.profit, 2)
      }
    },
    changeRange(range) {
      this.market.range = range
    },
    goOrderHelp() {
      this.toggleFixed()
      this.$bus.$emit('loading', false)
      this.$router.push({ path: '/home/OrderHelp', query: { id: this.code }})
    },
    // 涨跌样式 directType:{1:买，2:卖} type:{1:背景颜色，2:涨跌符号}
    isRise: function(obj, directType, type) {
      let val
      const direct = directType == 1 ? 'bid' : 'ask'
      if (obj.preData) {
        if (Number(obj[direct]) > Number(obj.preData[direct])) {
          val = type == 1 ? this.marketType.direct == directType ? 'buy' : '' : this.marketType.direct == directType ? 'checkRise' : 'rise'
        } else if (Number(obj[direct]) < Number(obj.preData[direct])) {
          val = type == 1 ? this.marketType.direct == directType ? 'sell' : '' : this.marketType.direct == directType ? 'checkFall' : 'fall'
        } else {
          val = type == 1 ? this.marketType.direct == directType ? 'level' : '' : ''
        }
      } else {
        if (Number(obj[direct]) > Number(obj.preClose)) {
          val = type == 1 ? 'buy' : this.marketType.direct == directType ? 'checkRise' : 'rise'
        } else if (Number(obj[direct]) < Number(obj.preClose)) {
          val = type == 1 ? 'sell' : this.marketType.direct == directType ? 'checkFall' : 'fall'
        } else {
          val = type == 1 ? this.marketType.direct == directType ? 'level' : '' : ''
        }
      }
      return val
    },
    /* 切换买卖方向*/
    changeDirect(type) {
      this.marketType.direct = type
      this.market.stopLoss = ''
      this.market.stopProfit = ''
      this.market.volume = this.marketInfo.symbolData.minVolumes
      if (this.marketType.type == 2) { // 挂单
        if (this.marketType.pendType == 1) { // 限价
          if (this.marketType.direct == 1) this.market.setPrice = this.pendPrice.max// 买
          else if (this.marketType.direct == 2) this.market.setPrice = this.pendPrice.min// 卖
        } else { // 停损
          if (this.marketType.direct == 1) this.market.setPrice = this.pendPrice.min// 买
          else if (this.marketType.direct == 2) this.market.setPrice = this.pendPrice.max// 卖
        }
      }
    },
    /* 切换限价，停损*/
    changePendType() {
      this.market.stopLoss = ''
      this.market.stopProfit = ''
      if (this.marketType.pendType == 1) { // 限价
        if (this.marketType.direct == 1) this.market.setPrice = this.pendPrice.max// 买
        else if (this.marketType.direct == 2) this.market.setPrice = this.pendPrice.min// 卖
      } else { // 停损
        if (this.marketType.direct == 1) this.market.setPrice = this.pendPrice.min// 买
        else if (this.marketType.direct == 2) this.market.setPrice = this.pendPrice.max// 卖
      }
    },
    // 点数转价格
    pipToChange(lossOrProfit) {
      if (lossOrProfit == 1) {
        // 止损
        if (this.market.stopLoss && this.market.stopLoss != '') {
          if (this.marketType.type == 1) return TradeUtil.changePipValue(this.market.stopLoss, this.marketInfo.tick.ask, this.marketInfo.tick.bid, this.marketInfo.symbolData, this.marketType.direct, 1, 1)
          else if (this.marketType.type == 2) return TradeUtil.changePipValue(this.market.stopLoss, this.market.setPrice, this.market.setPrice, this.marketInfo.symbolData, this.marketType.direct, 1, 1)
        }
        return ''
      } else {
        // 止盈
        if (this.market.stopProfit && this.market.stopProfit != '') {
          if (this.marketType.type == 1) return TradeUtil.changePipValue(this.market.stopProfit, this.marketInfo.tick.ask, this.marketInfo.tick.bid, this.marketInfo.symbolData, this.marketType.direct, 1, 2)
          else if (this.marketType.type == 2) return TradeUtil.changePipValue(this.market.stopProfit, this.market.setPrice, this.market.setPrice, this.marketInfo.symbolData, this.marketType.direct, 1, 2)
        }
        return ''
      }
    },
    clickPop(type) {
      this.toggleFixed()
      this.Show = !this.Show
      this.isShow = false
      this.isTrue = 0
      this.market.range = TradeUtil.readRangeBySource(this.marketInfo.symbolData.source) || this.marketInfo.symbolData.rangeScope
      if (this.Show) this.changeDirect(type)
    },
    errPop() {
      this.isError = !this.isError
    },
    clickArrow() {
      this.isShow = !this.isShow
      return 'checked'
    },
    /* 手数加减*/
    changeVolume(type) {
      const fix = String(this.marketInfo.symbolData.volumesStep).indexOf('.') >= 0 ? String(this.marketInfo.symbolData.volumesStep).split('.')[1].length : 0
      if (type == 1) {
        // 减
        if (!this.market.volume || this.market.volume == '') this.market.volume = Number(this.marketInfo.symbolData.minVolumes).toFixed(fix)
        else this.market.volume = Number(Util.accSub(this.market.volume, this.marketInfo.symbolData.volumesStep)).toFixed(fix)
        if (Number(this.market.volume) <= Number(this.marketInfo.symbolData.minVolumes).toFixed(fix)) {
          this.market.volume = Number(this.marketInfo.symbolData.minVolumes).toFixed(fix)
        }
        // 超出范围弹出提示
      } else {
        // 加
        if (!this.market.volume || this.market.volume == '') this.market.volume = Number(this.marketInfo.symbolData.minVolumes).toFixed(fix)
        else this.market.volume = Number(Util.accAdd(this.market.volume, this.marketInfo.symbolData.volumesStep)).toFixed(fix)
        if (Number(this.market.volume) >= Number(this.marketInfo.symbolData.maxVolumes).toFixed(fix)) {
          this.market.volume = Number(this.marketInfo.symbolData.maxVolumes).toFixed(fix)
        }
        // 超出范围弹出提示
      }
    },
    /* 挂单价加减*/
    changeSetPrice(type) {
      if (!this.market.setPrice || this.market.setPrice == '') {
        this.market.setPrice = this.pendPrice.min
      }
      const fix = this.marketInfo.symbolData.digits
      if (type == 1) {
        this.market.setPrice = Number(Util.accSub(this.market.setPrice, this.marketInfo.symbolData.pipv)).toFixed(fix)
        if (Number(this.market.setPrice) <= Number(this.pendPrice.min)) {
          this.market.setPrice = Number(this.pendPrice.min).toFixed(fix)
        }
      } else {
        this.market.setPrice = Number(Util.accAdd(this.market.setPrice, this.marketInfo.symbolData.pipv)).toFixed(fix)
        if (Number(this.market.setPrice) >= Number(this.pendPrice.max)) {
          this.market.setPrice = Number(this.pendPrice.max).toFixed(fix)
        }
      }
    },
    /* 止损加减*/
    changeStopLoss(type) {
      if (!this.market.stopLoss || this.market.stopLoss == '') {
        if (this.marketType.profit == 2) this.market.stopLoss = this.stopLoss.min
        else this.market.stopLoss = this.marketType.direct == 1 ? this.stopLoss.max : this.stopLoss.min
        return
      }
      const fix = this.marketInfo.symbolData.digits
      if (type == 1) {
        // 减
        if (this.marketType.profit == 1) {
          // 价格
          this.market.stopLoss = Number(Util.accSub(this.market.stopLoss, this.marketInfo.symbolData.pipv)).toFixed(fix)
        } else {
          // 点数
          this.market.stopLoss = Number(Util.accSub(this.market.stopLoss, 1.0)).toFixed(1)
        }
        if (Number(this.market.stopLoss) <= Number(this.stopLoss.min)) {
          this.market.stopLoss = Number(this.stopLoss.min).toFixed(this.marketType.profit == 1 ? fix : 1)
        }
      } else {
        // 加
        if (this.marketType.profit == 1) {
          // 价格
          this.market.stopLoss = Number(Util.accAdd(this.market.stopLoss, this.marketInfo.symbolData.pipv)).toFixed(fix)
        } else {
          this.market.stopLoss = Number(Util.accAdd(this.market.stopLoss, 1.0)).toFixed(1)
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
        else this.market.stopProfit = this.marketType.direct == 1 ? this.stopProfit.min : this.stopProfit.max
        return
      }
      const fix = this.marketInfo.symbolData.digits
      if (type == 1) {
        // 减
        if (this.marketType.profit == 1) {
          // 价格
          this.market.stopProfit = Number(Util.accSub(this.market.stopProfit, this.marketInfo.symbolData.pipv)).toFixed(fix)
        } else {
          // 点数
          this.market.stopProfit = Number(Util.accSub(this.market.stopProfit, 1.00)).toFixed(1)
        }
        if (Number(this.market.stopProfit) <= Number(this.stopProfit.min)) {
          this.market.stopProfit = Number(this.stopProfit.min).toFixed(this.marketType.profit == 1 ? fix : 1)
        }
      } else {
        // 加
        if (this.marketType.profit == 1) {
          // 价格
          this.market.stopProfit = Util.accAdd(this.market.stopProfit, this.marketInfo.symbolData.pipv).toFixed(fix)
        } else {
          // 点数
          this.market.stopProfit = Number(Util.accAdd(this.market.stopProfit, 1.00)).toFixed(1)
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
      const req = TradeUtil.getTradeReq(this.account, this.marketInfo.symbolData)// 初始化请求对象
      req.Direction = this.marketType.direct// 买卖方向
      // 订单类型- 0x01.市价建仓；0x02.Limit 建仓；0x04.Stop 建仓；0x08.市价平仓；
      req.Type = this.marketType.type// 订单类型(平仓，开仓)
      if (this.marketType.type == 1) {
        req.Type = Constant.OrderType.OPEN
      } else if (this.marketType.type == 2) {
        req.ExpireType = this.market.expireType
        if (this.marketType.pendType == 1) {
          req.Type = Constant.OrderType.LIMIT
        } else {
          req.Type = Constant.OrderType.STOP
        }
      }

      // 请求价格
      if (this.marketType.type == 1) req.RequestPrice = (this.marketType.direct == 1 ? this.marketInfo.tick.bid : this.marketInfo.tick.ask)
      else if (this.marketType.type == 2) req.RequestPrice = this.market.setPrice

      // 手数
      req.RequestVolume = this.market.volume != null && this.market.volume != '' ? this.market.volume : this.marketInfo.symbolData.minVolumes
      let lossPro = ''
      //
      if (this.market.stopLoss && this.market.stopLoss != '') {
        if (this.marketType.profit == 1) req.StopLoss = this.market.stopLoss
        else if (this.marketType.profit == 2) {
          // req.StopLossPips = this.market.stopLoss;
          if (this.marketType.type == 2) req.StopLoss = TradeUtil.changePipValue(this.market.stopLoss, this.market.setPrice, this.market.setPrice, this.marketInfo.symbolData, this.marketType.direct, 1, 1)
          else if (this.marketType.type == 1) req.StopLoss = TradeUtil.changePipValue(this.market.stopLoss, this.marketInfo.tick.ask, this.marketInfo.tick.bid, this.marketInfo.symbolData, this.marketType.direct, 1, 1)
        }
        lossPro = '止损'
      }
      if (this.market.stopProfit && this.market.stopProfit != '') {
        if (this.marketType.profit == 1) req.TakeProfit = this.market.stopProfit
        if (this.marketType.profit == 2) {
          // req.TakeProfitPips = this.market.stopProfit;
          if (this.marketType.type == 2) req.TakeProfit = TradeUtil.changePipValue(this.market.stopProfit, this.market.setPrice, this.market.setPrice, this.marketInfo.symbolData, this.marketType.direct, 1, 2)
          else if (this.marketType.type == 1) req.TakeProfit = TradeUtil.changePipValue(this.market.stopProfit, this.marketInfo.tick.ask, this.marketInfo.tick.bid, this.marketInfo.symbolData, this.marketType.direct, 1, 2)
        }
        lossPro = '止盈'
      }
      if (this.market.stopLoss && this.market.stopLoss != '' && this.market.stopProfit && this.market.stopProfit != '') {
        lossPro = '止损止盈'
      }
      localStorage.setItem('lossPro', lossPro)
      req.Range = this.market.range// 偏差
      this.$fireBase.logEvent('requery_order', {
        'platform_type': 'cfdwell',
        'account_type': localStorage.getItem('zsmn'),
        'trade_target': this.marketType.direct == '1' ? '买入' : '卖出',
        'product_name': this.quote.notify[this.code].aushGB,
        'time': Util.getThisTime(),
        'url': window.location.href,
        'trade_type': '标准',
        'trade_direction': this.marketType.direct == '1' ? '买入' : '卖出',
        'symbol_price': this.market.setPrice,
        'order_type': this.itemName,
        'delegate_type': this.itemName == '挂单' ? (this.marketType.pendType == 1 ? '限价' : '停损') : '',
        'open_order_lots': this.market.volume,
        'set_profit_loss': lossPro,
        'profit_loss_type': this.tabNames,
        'delegate_effective_date': this.itemName == '挂单' ? this.market.expireType : '',
        'order_margin': TradeUtil.getMargin(this.market.volume, this.marketInfo.symbolData, this.marketType.direct, this.tradeData.position)
      })

      // trade_type	交易模式	标准，简单

      this.socket.tradeSocket.emit('request', Number(Constant.Req.openOrder), req)
    }
  }
}
</script>
