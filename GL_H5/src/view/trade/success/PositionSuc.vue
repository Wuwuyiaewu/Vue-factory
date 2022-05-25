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

    <div class="sucImg"><img src="@/assets/images/trade/trade_success.png"><span>平仓成功！</span></div>

    <div class="quote_banner">
      <img
        :src="ad_banner[0].pic"
        @click="bannerHrefHandler(ad_banner[0])"
      >
    </div>
    <div class="sucList">
      <ul>
        <li>
          <p>持仓单号</p><span>#{{ $route.query.PositionID }}</span>
        </li>
        <li>
          <p>交易产品</p>
          <span>{{ quoteSymbol.aushGB }}<label class="symbol">{{ util.getShowPrdCode($route.query.Symbol).replace("_GCP","").replace(" GCP","") }}</label></span>
        </li>
        <li>
          <p>开仓价格</p><span>{{ $route.query.SrcPrice }}</span>
        </li>
        <li>
          <p>平仓价格</p><span>{{ $route.query.ExecutePrice }}</span>
        </li>
        <li>
          <p>平仓数量</p><span><label :class="{fall:$route.query.Direction == 1,rise:$route.query.Direction == 2}">{{ $route.query.Direction == 1 ? '卖出':'买入' }}</label> {{ $route.query.ExecuteVolume }}</span>
        </li>
        <li>
          <p>平仓盈亏</p><span>{{ Number($route.query.Profit).toFixed(2) }}</span>
        </li>
        <li>
          <p>隔夜利息</p><span>{{ Number($route.query.Swap).toFixed(2) }}</span>
        </li>
        <li>
          <p>手续费</p><span>{{ Number($route.query.Commission).toFixed(2) }}</span>
        </li>
        <li>
          <p>平仓净盈亏</p><span :class="util.accAdd($route.query.Profit,$route.query.Swap) >= 0 ? 'rise':'fall'">{{ Number(util.accAdd($route.query.Profit,$route.query.Swap)).toFixed(2) }}</span>
        </li>
        <li>
          <p>平仓时间</p><span>{{$route.query.ExecuteTime | time_His}}</span>
        </li>
      </ul>
    </div>
    <div class="sucBtn">
      <span @click="closeSuc(0)">查看持仓</span>
      <span @click="closeSuc(3)">查看盈亏</span>
    </div>
  </div>
</template>

<script>
require('@/assets/css/sucOrdered.css')
import { mapState } from 'vuex'
import Util from '@/utils/tradeDataUtil'
import quoteUtil from '@/utils/quoteUtil'
export default {
  name: 'PositionSuc',
  data() {
    return {
      util: Util,
      quoteUtil,
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
      code: {
        get() {
          if (this.quoteSymbol) return this.quoteSymbol.uiCodeID
          return ''
        }
      },
      get() {
        var symbolData = {}
        var tick = {}
        if (this.quote.symbolNotify && this.quoteSymbol) {
          const code = this.quoteSymbol.uiCodeID
          if (code && this.quote.notify[code]) {
            const source = this.quote.notify[code].uiSourceCode
            if (this.symbolInfo.codeMap[source]) symbolData = this.symbolInfo.codeMap[source]
          }
          if (code && this.quote.codeTickMap && this.quote.codeTickMap[code]) tick = this.quote.codeTickMap[code]
        }
        return {
          symbolData: symbolData,
          tick: tick
        }
      }
    },
    quoteSymbol: function() {
      return this.quoteUtil.getSybmolBySourceCode(this.source)
    },
    ad_banner() {
      let resultBanners;
      if (this.$store.state.appProperties.trade) {
        let matchedBanners = this.$store.state.appProperties.trade.sell_banner.filter(
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
    closeSuc(type) {
      this.toggleFixed()
      this.$bus.$emit('loading', false)
      this.$router.replace({ path: '/home/Trade', query: { type: type }})
    },
    removeFixed() {
      const mainH = document.getElementById('main')
      mainH.classList.remove('mainFixed')
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
