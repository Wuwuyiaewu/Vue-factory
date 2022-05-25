<template>
  <div class="quote Hot">

    <div class="navTitle">
      <div class="navItem">
        <span>
          <label @click="clickQuotation()">行情</label>
          <label class="current">热门</label>
        </span>
      </div>
    </div>

    <div class="hotContent">
      <div class="quote_banner">
        <img
        :src="ad_banner[0].pic"
        @click="bannerHrefHandler(ad_banner[0])"
        >
      </div>
      <div id="conList" class="hotList">
        <div class="item" :class="{ checked: item1}" @click="changeContent(1)">
          <p>涨幅榜</p>
          <span></span>
        </div>
        <ul v-show="item1">
          <li
            v-for="(data,lindex) in filteredTickList.slice(0,3)"
            :key="'tabs-tick-2-' + data.uiCodeID"
            @click="goQuoteChart(data.uiCodeID)"
          >
            <span>{{ quote.notify[data.uiCodeID].aushGB }}
              <em>{{ quote.notify[data.uiCodeID].szShortName }}
                <i
                  v-if="!data.symbolData"
                >({{Math.abs((data.bid - data.ask) / quote.notify[data.uiCodeID].pipv).toFixed(quote.notify[data.uiCodeID].diff)}})</i>
                <i
                  v-else
                >({{Math.abs((data.bid - data.ask) / data.symbolData.pipv).toFixed(data.symbolData.diff)}})</i>
              </em>
            </span>
            <span :class="isNewP(data)">{{ data.newP }} <em>{{data.dtime | formatDate}}</em></span>
            <span v-if="isOks(data.rate)" :class="isOks(data.rate)">
              <label class="bgcolor"><i v-if="data.rate > 0">+</i>{{ Number(data.rate).toFixed(2) }}%</label>
              <label class="bgcolor"><i v-if="data.rate > 0">+</i>{{ util.accSub(data.newP, data.preclose)}}</label>
            </span>
            <div class="more" @click.stop="showpop($event,lindex)"><img :src="require('@/assets/images/quotation/quot_more.png')"></div>
            <div class="pop_box" :class="{'pop_top':showtop}" v-show="lindex == showindex" @click.stop="hidepop()">
              <dl>
                <dd @click.stop="quickSale(data.uiCodeID,1)"><img :src="require('@/assets/images/quotation/quote_buy.png')">快速买入</dd>
                <dd @click.stop="quickSale(data.uiCodeID,2)"><img :src="require('@/assets/images/quotation/quote_sell.png')">快速卖出</dd>
                <dd @click.stop="goAttribute(data.uiCodeID)"><img :src="require('@/assets/images/quotation/quote_attribute.png')">合约属性</dd>
              </dl>
            </div>
          </li>
        </ul>


        <div class="item" :class="{ checked: item2}" @click="changeContent(2)">
          <p>跌幅榜</p>
          <span></span>
        </div>
        <ul v-show="item2">
          <li
            v-for="(data,lindex) in filteredTickList2.slice(0,3)"
            :key="'tabs-tick-2-' + data.uiCodeID"
            @click="goQuoteChart(data.uiCodeID)"
          >
            <span>{{ quote.notify[data.uiCodeID].aushGB }}
              <em>{{ quote.notify[data.uiCodeID].szShortName }}
                <i
                  v-if="!data.symbolData"
                >({{
                  Math.abs(
                    (data.bid - data.ask) /
                      quote.notify[data.uiCodeID].pipv
                  ).toFixed(quote.notify[data.uiCodeID].diff)
                }})</i>
                <i
                  v-else
                >({{Math.abs((data.bid - data.ask) / data.symbolData.pipv).toFixed(data.symbolData.diff)}})</i>
              </em>
            </span>
            <span :class="isNewP(data)">{{ data.newP }} <em>{{data.dtime | formatDate}}</em></span>
            <span v-if="isOks(data.rate)" :class="isOks(data.rate)">
              <label class="bgcolor"><i v-if="data.rate > 0">+</i>{{ Number(data.rate).toFixed(2) }}%</label>
              <label class="bgcolor"><i v-if="data.rate > 0">+</i>{{ util.accSub(data.newP, data.preclose)}}</label>
            </span>
            <div class="more" @click.stop="showpop($event,(10+lindex))"><img :src="require('@/assets/images/quotation/quot_more.png')"></div>
            <div class="pop_box" :class="{'pop_top':showtop}" v-show="(lindex+10) == showindex" @click.stop="hidepop()">
              <dl>
                <dd @click.stop="quickSale(data.uiCodeID,1)"><img :src="require('@/assets/images/quotation/quote_buy.png')">快速买入</dd>
                <dd @click.stop="quickSale(data.uiCodeID,2)"><img :src="require('@/assets/images/quotation/quote_sell.png')">快速卖出</dd>
                <dd @click.stop="goAttribute(data.uiCodeID)"><img :src="require('@/assets/images/quotation/quote_attribute.png')">合约属性</dd>
              </dl>
            </div>
          </li>
        </ul>

        <div class="item" :class="{ checked: item3 }" @click="changeContent(3)">
          <p>涨速榜</p>
          <span></span>
        </div>
        <ul v-show="item3">
          <li
            v-for="(data,lindex) in filteredTickList3.slice(0,3)"
            :key="'tabs-tick-2-' + data.uiCodeID"
            @click="goQuoteChart(data.uiCodeID)"
          >
            <span>{{ quote.notify[data.uiCodeID].aushGB }}
              <em>{{ quote.notify[data.uiCodeID].szShortName }}
                <i
                  v-if="!data.symbolData"
                >({{Math.abs((data.bid - data.ask) / quote.notify[data.uiCodeID].pipv).toFixed(quote.notify[data.uiCodeID].diff)}})</i>
                <i
                  v-else
                >({{Math.abs((data.bid - data.ask) / data.symbolData.pipv).toFixed(data.symbolData.diff)}})</i>
              </em>
            </span>
            <span :class="isNewP(data)">{{ data.newP }} <em>{{data.dtime | formatDate}}</em></span>
            <span v-if="isOks(data.rate)" :class="isOks(data.rate)">
              <label class="bgcolor"><i v-if="data.rate > 0">+</i>{{ Number(data.rate).toFixed(2) }}%</label>
              <label class="bgcolor"><i v-if="data.rate > 0">+</i>{{ util.accSub(data.newP, data.preclose)}}</label>
            </span>
            <div class="more" @click.stop="showpop($event,(lindex+20))"><img :src="require('@/assets/images/quotation/quot_more.png')"></div>
            <div class="pop_box" :class="{'pop_top':showtop}" v-show="(lindex+20) == showindex" @click.stop="hidepop()">
              <dl>
                <dd @click.stop="quickSale(data.uiCodeID,1)"><img :src="require('@/assets/images/quotation/quote_buy.png')">快速买入</dd>
                <dd @click.stop="quickSale(data.uiCodeID,2)"><img :src="require('@/assets/images/quotation/quote_sell.png')">快速卖出</dd>
                <dd @click.stop="goAttribute(data.uiCodeID)"><img :src="require('@/assets/images/quotation/quote_attribute.png')">合约属性</dd>
              </dl>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="pop_bg" v-show="showindex > -1" @click.stop="hidepop()"></div>
    <Login-bar />
    <Tab />
  </div>
</template>
<script>

require('@/assets/css/quotation.css')
import { mapState } from 'vuex'
import Util from '@/utils/tradeDataUtil'
import NoData from '@/view/NoData.vue'
import TradeUtil from '@/utils/tradeUtil'
import Tab from "@/components/Tab.vue"
import LoginBar from "@/components/home/LoginBar.vue";
import hrefDict from "@/utils/apiHrefMap";

export default {
  name: 'QuotationHot',
  components: {
    LoginBar,
    NoData,
    Tab
  },
  data() {
    return {
      util: Util,
      item1: true,
      item2: true,
      item3: true,
      isTrue: Number(this.$route.query.tabIndex) || 0,
      sign: process.env.VUE_APP_GA_SIGN,
      showindex : -1,
      showtop : 0
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time*1000)
      //console.log(time)
      let h = date.getHours();//时
      h = h < 10 ? ('0' + h) : h;
      let m = date.getMinutes();//分
      m = m < 10 ? ('0' + m) : m;
      let s = date.getSeconds();//秒
      s = s < 10 ? ('0' + s) : s;
      return h+":"+m+":"+s
    }
  },
  computed: {
    ...mapState(['quote', 'symbolInfo', 'user', 'loginType']),
    filteredTickList: function() {
      return TradeUtil.copy(this.quote.tickList).sort((a, b) => {return Number(b.rate) - Number(a.rate)})
    },
    filteredTickList2: function() {
      return TradeUtil.copy(this.quote.tickList).sort((a, b) => {return Number(a.rate) - Number(b.rate)})
    },
    filteredTickList3: function() {
      return TradeUtil.copy(this.quote.tickList).sort((a, b) => {return Math.abs(Number(b.rate)) - Math.abs(Number(a.rate))})
    },
    ad_banner() {
      let resultBanners;
      if (this.$store.state.appProperties.trade) {
        let matchedBanners = this.$store.state.appProperties.trade.optional_banner.filter(
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
    sessionStorage.setItem('quotationView/viewType', 1)
  },
  activated() {
    this.$bus.$emit('loading', true)
    this.removeFixed()
  },
  methods: {
    sortByRate(i,flag) {
      return function(a, b) {
        if(flag == 1){
          return b[i] - a[i];
        }else if(flag == 2){
          return a[i] - b[i];
        }else{
          return a[i] - b[i];
        }
      };
    },
    back() {
      this.$router.push({ path: '/home' })
    },
    removeFixed() {
      const mainH = document.getElementById('main')
      mainH.classList.remove('mainFixed')
      // mainH.style.width = '750px'
    },
    clickQuotation() {
      localStorage.setItem('qcBack','/home/Quotation')
      this.$bus.$emit('loading', false)
      this.$router.push({ path: '/home/Quotation'})
    },
    showpop(e,lindex){
      this.showtop = 0
      let bottomsize = window.innerHeight - e.target.getBoundingClientRect().y -e.target.getBoundingClientRect().height
      let popHight = this.isTrue == 6 ? 94 : 242 // 弹框的高度
      var width = document.documentElement.clientWidth
      if (width <= 750) {
        popHight = popHight*(width/750)
      }      
      if(bottomsize<popHight){
        this.showtop = 1
      }
      if(this.showindex == lindex){
        this.showindex = -1
      }else{
        this.showindex = lindex
      }
      document.querySelector('html').className="isOpenNav"
    },
    hidepop(){
      this.showindex = -1
      document.querySelector('html').removeAttribute("class","isOpenNav")
    },
    quickSale(id,stype) {
      this.hidepop()
      this.$bus.$emit('loading', false)
      this.$router.push({ path: '/home/QuoteBuy', query: { id: id, direct: stype, tabIndex: this.isTrue }})
    },
    goQuoteChart(id) {
      this.$bus.$emit('loading', false)
      this.$router.push({ path: '/home/QuoteChart', query: { id: id, view: 'view', tabIndex: this.isTrue }})
    },
    Optional() {
      this.$bus.$emit('loading', false)
      this.$router.push({ path: '/home/Optional' })
    },
    Product: function(obj) {
      const quotes = this.quote.notify
      for (var i in quotes) {
        if (i == obj.uiCodeID) {
          if ((this.user.loginname && obj.symbolData) || !this.user.loginname) { return true }
        }
      }
      return false
    },
    isOks: function(obj) {
      var val
      if (obj > 0) {
        val = 'rise'
      } else if (obj == 0) {
        val = 'level'
      } else {
        val = 'fall'
      }
      return val
    },
    changeContent(i) {
      if(i==1){
        this.item1 = ! this.item1
      }else if(i==2){
        this.item2 = ! this.item2
      }else{
        this.item3 = ! this.item3
      }
      
    },
    isNewP: function(obj) {
      var val
      if (obj.preData) {
        if (Number(obj.newP) > Number(obj.preData.newP)) {
          val = 'rise'
        } else if (Number(obj.newP) < Number(obj.preData.newP)) {
          val = 'fall'
        } else {
          val = ''
        }
      } else {
        if (Number(obj.newP) > Number(obj.open)) {
          val = 'rise'
        } else if (Number(obj.newP) < Number(obj.open)) {
          val = 'fall'
        } else {
          val = ''
        }
      }
      return val
    },
    goAttribute(code) {
      this.$bus.$emit('loading', false)
      if (!this.user.loginname) this.$router.push({ path: '/Login' })
      else {
        this.$router.push({
          path: '/home/Attribute',
          query: { id: code }
        })
      }
    },
    bannerHrefHandler(banner) {
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
          // other cases like gotoArticle
          console.log("in gotoArticle");
        }
      } else {
        this.$router.push({
          path: hrefDict[banner.href],
        });
      }
    }
  }
}
</script>
