<template>
  <div class="sucOrdered">

    <div class="navTitle">
      <div class="navItem">
        <img
          class="back"
          src="@/assets/images/quotation/chars_back.png"
          @click="back"
        >
        <p>{{ quoteSymbol.aushGB }}</p>
        <p class="symbol">{{ util.getShowPrdCode($route.query.Symbol).replace("_GCP","").replace(" GCP","") }}</p>
      </div>
    </div>

    <div class="sucTit">
      <img src="@/assets/images/trade/trade_success.png">
      <span>{{ $route.query.Type == 1
          ? "市价开仓"
          : $route.query.MsgId == 1702
            ? "挂单修改"
            : "挂单"
      }}成功</span>
    </div>

    <div class="quote_banner">
      <img
        :src="ad_banner[0].pic"
        @click="bannerHrefHandler(ad_banner[0])"
      >
    </div>

    <div class="sucList">
      <ul>
        <li>
          <p>{{ $route.query.Type == 1 ? "持仓单号" : "挂单单号" }}</p><span>#{{ $route.query.ID }}</span>
        </li>
        <li>
          <p>
            {{ $route.query.Type == 1 ? "交易产品" : "挂单产品" }}
          </p>
          <span>{{ quoteSymbol.aushGB }} <label class="symbol">{{ util.getShowPrdCode($route.query.Symbol).replace("_GCP","").replace(" GCP","") }}</label></span>
        </li>
        <li v-if="$route.query.Type == 2 || $route.query.Type == 4">
          <p>挂单类型</p><span>{{ $route.query.Type == 2 ? "限价" : "停损" }}</span>
        </li>
        <li>
          <p>{{ $route.query.Type == 1 ? "开仓价格" : "挂单价格" }}</p><span>{{
            Number($route.query.RequestPrice).toFixed(
              marketInfo.symbolData.digits
            )
          }}</span>
        </li>
        <li>
          <p>{{ $route.query.Type == 1 ? "开仓数量" : "挂单数量" }}</p>
          <span><label class="direct" :class="{rise:$route.query.Direction == 1,fall:$route.query.Direction == 2}">{{ $route.query.Direction == 1 ? "买入" : "卖出" }}</label> {{ $route.query.RequestVolume }}</span>
        </li>
        <li v-if="$route.query.StopLoss != 0">
          <p>{{ $route.query.setStopLossTip ? "止损点数" : "止损价格" }}</p><span><span
            v-if="$route.query.setStopLossTip"
            class="inline"
          >{{ $route.query.setStopLossTip }}点<em>－</em></span>{{
            Number($route.query.StopLoss).toFixed(
              marketInfo.symbolData.digits
            )
          }}</span>
        </li>
        <li v-else> <p>止损价格</p><span>未设置</span> </li>
        <li v-if="$route.query.TakeProfit != 0">
          <p>{{ $route.query.setStopProfitTip ? "止盈点数" : "止盈价格" }}</p><span><span
            v-if="$route.query.setStopProfitTip"
            class="inline"
          >{{ $route.query.setStopProfitTip }}点<em>－</em></span>{{
            Number($route.query.TakeProfit).toFixed(
              marketInfo.symbolData.digits
            )
          }}</span>
        </li>
        <li v-else> <p>止盈价格</p><span>未设置</span> </li>
        <li v-if="$route.query.StopLoss != 0 || $route.query.TakeProfit != 0">
          <p>预计盈亏(美元)</p>
          <span>
          <label class="rise">{{ lossAndProfit.stopProfit > 0 && $route.query.TakeProfit ? "+" : ""}}{{ $route.query.TakeProfit ? lossAndProfit.stopProfit : '--' }}</label>
          <em>/</em>
          <label class="fall">{{ lossAndProfit.stopLoss > 0 && $route.query.StopLoss ? "+" : ""}}{{ $route.query.StopLoss ? lossAndProfit.stopLoss : '--' }}</label>
          </span>
        </li>
        <li v-if="$route.query.Type != 1">
          <p>有效期</p><span>{{ $route.query.ExpireType == 1 ? "当日" : "当周" }}</span>
        </li>
        <li v-if="$route.query.Type == 1">
          <p>开仓时间</p><span>{{ $route.query.OpenTime | time_His }}</span>
        </li>
        <li v-else>
          <p>挂单时间</p><span> {{ $route.query.CreateTime| time_His }}</span>
        </li>
        
      </ul>
    </div>
    <div class="sucBtn"><span @click="goQuotationView">继续下单</span>
    <span @click="goTrade">{{ $route.query.Type == 1 ? "查看持仓" : "查看挂单"}}</span></div>
  </div>
</template>
<script>
require('@/assets/css/sucOrdered.css')
import { mapState } from 'vuex'
import Util from '@/utils/tradeDataUtil'
import TradeUtil from '@/utils/tradeUtil'
import quoteUtil from '@/utils/quoteUtil'
export default {
  name: 'SucOrdered',
  data() {
    return {
      util: Util,
      quoteUtil: quoteUtil,
      tradeUtil: TradeUtil,
      source: this.$route.query.source
    }
  },
  filters: {
    time_His(longTime){
      if(longTime){
        return Util.formatDate(longTime, 'yyyy-MM-dd hh:mm:ss')
      }
    }
  },
  computed: {
    ...mapState(['quote', 'symbolInfo']),
    marketInfo: {
      get() {
        var symbolData = {}
        var tick = {}
        if (this.quote.symbolNotify && this.quoteSymbol) {
          const code = this.quoteSymbol.uiCodeID
          if (code && this.quote.notify[code]) {
            const source = this.quote.notify[code].uiSourceCode
            if (this.symbolInfo.codeMap[source]) { symbolData = this.symbolInfo.codeMap[source] }
          }
          if (code && this.quote.codeTickMap && this.quote.codeTickMap[code]) { tick = this.quote.codeTickMap[code] }
        }
        return {
          symbolData: symbolData,
          tick: tick
        }
      }
    },
    // 预期盈亏
    lossAndProfit: {
      get() {
        let loss = null
        let profit = null
        const { StopLoss, RequestVolume, Direction, Type, TakeProfit, RequestPrice } = this.$route.query
        const { symbolData, tick } = this.marketInfo
        if (
          tick &&
          (StopLoss != 0 ||
          TakeProfit != 0)
        ) {
          if (Direction == 1) {
            // 买
            if (Type == 1) {
              loss = TradeUtil.changeCurrency(
                Util.accSub(
                  StopLoss,
                  tick.bid
                ),
                tick.ask,
                tick.bid,
                RequestVolume,
                symbolData,
                this.quote.symbolTickMap,
                Direction
              )
              profit = TradeUtil.changeCurrency(
                Util.accSub(
                  TakeProfit,
                  tick.bid
                ),
                tick.ask,
                tick.bid,
                RequestVolume,
                symbolData,
                this.quote.symbolTickMap,
                Direction
              )
            } else if (
              Type == 2 ||
              Type == 4
            ) {
              loss = TradeUtil.changeCurrency(
                Util.accSub(
                  StopLoss,
                  RequestPrice
                ),
                tick.ask,
                tick.bid,
                RequestVolume,
                symbolData,
                this.quote.symbolTickMap,
                Direction
              )
              profit = TradeUtil.changeCurrency(
                Util.accSub(
                  TakeProfit,
                  RequestPrice
                ),
                tick.ask,
                tick.bid,
                RequestVolume,
                symbolData,
                this.quote.symbolTickMap,
                Direction
              )
            }
          } else {
            // 卖
            if (Type == 1) {
              loss = TradeUtil.changeCurrency(
                Util.accSub(
                  tick.ask,
                  StopLoss
                ),
                tick.ask,
                tick.bid,
                RequestVolume,
                symbolData,
                this.quote.symbolTickMap,
                Direction
              )
              profit = TradeUtil.changeCurrency(
                Util.accSub(
                  tick.ask,
                  TakeProfit
                ),
                tick.ask,
                tick.bid,
                RequestVolume,
                symbolData,
                this.quote.symbolTickMap,
                Direction
              )
            } else if (
              Type == 2 ||
              Type == 4
            ) {
              loss = TradeUtil.changeCurrency(
                Util.accSub(
                  RequestPrice,
                  StopLoss
                ),
                tick.ask,
                tick.bid,
                RequestVolume,
                symbolData,
                this.quote.symbolTickMap,
                Direction
              )
              profit = TradeUtil.changeCurrency(
                Util.accSub(
                  RequestPrice,
                  TakeProfit
                ),
                tick.ask,
                tick.bid,
                RequestVolume,
                symbolData,
                this.quote.symbolTickMap,
                Direction
              )
            }
          }
        }

        return {
          stopLoss: Number(loss).toFixed(2),
          stopProfit: Number(profit).toFixed(2)
        }
      }
    },
    quoteSymbol: function() {
      return this.quoteUtil.getSybmolBySourceCode(this.source)
    },
    ad_banner() {
      let resultBanners;
      if (this.$store.state.appProperties.trade) {
        let matchedBanners = this.$store.state.appProperties.trade.buy_banner.filter(
          (banner) => {
            const matchedConfig = banner.config.find((config) =>
              config.login_type.includes(this.loginType)
            )
            if (matchedConfig) {
              banner.href = matchedConfig.href;
              banner.other_href = matchedConfig.other_href;
            }
            return banner;
          }
        )
        if (matchedBanners) {
          matchedBanners = matchedBanners.filter(
            (banner) => banner.show == "true"
          );
          resultBanners = matchedBanners;
        }
      }
      return resultBanners;
    }
  },
  beforeCreate() {
    if (this.$cookie.get('orderSuc') == 'suc') {
      // 成功页的跳转
      this.$cookie.remove('orderSuc') // 删除cookie
    } else {
      // 非正常访问
      alert('页面已失效')
      this.$router.replace({ path: '/home' })
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
    goQuotationView() {
      this.$bus.$emit('loading', false)
      const productInfo = JSON.parse(localStorage.getItem("QuoteBuy"))
      this.$router.push({
        path: '/home/QuoteChart',
        query: { id: productInfo.code, view: 'view' , tabIndex: productInfo.tabIndex }
      })
    },
    goTrade() {
      this.$bus.$emit('loading', false)
      this.$router.replace({
        path: '/home/trade',
        query: { type: this.$route.query.Type == 1 ? 0 : 1 }
      })
    },
    bannerHrefHandler(banner) {
      console.log(banner)
      if (banner.other_href != "") {
        if (banner.href == "gotoOther") {
          let url_text = banner.other_href;
          let url = new URL(banner.other_href);
          let modifier = url.search != "" ? "&" : "?";
          if (!url.searchParams.get("utm_source")) url_text += modifier + "utm_source=" + sessionStorage.getItem("utm_source");
          if (!url.searchParams.get("utm_medium") && sessionStorage.getItem("utm_medium")) url_text += modifier + "utm_medium=" + sessionStorage.getItem("utm_medium");
          if (!url.searchParams.get("utm_campaign") && sessionStorage.getItem("utm_campaign")) url_text += modifier + "utm_campaign=" + sessionStorage.getItem("utm_campaign");
          if (!url.searchParams.get("utm_content") && sessionStorage.getItem("utm_content")) url_text += modifier + "utm_content=" + sessionStorage.getItem("utm_content");
          if (!url.searchParams.get("utm_term") && sessionStorage.getItem("utm_term")) url_text += modifier + "utm_term=" + sessionStorage.getItem("utm_term");
          this.$router.push({
            path: "/home/BannerUrl",
            query: {
              title: banner.title,
              url: url_text,
            },
          });
        } else if (banner.href == "gotoProduct") {
          this.goQuoteChart(
            banner.other_href,
            this.quote.notify[banner.other_href].aushGB
          );
        } else if (banner.href == "gotoArticle") {
          this.$router.push({
            path: "/home/NewsDetail",
            query: {
              title: banner.title,
              articleId: banner.other_href,
            },
          });
        } else {
          console.log("in gotoArticle");
        }
      } else {
        console.log(hrefDict,banner.href)
        this.$router.push({
          path: hrefDict[banner.href],
        });
      }
    }
  }
}
</script>
