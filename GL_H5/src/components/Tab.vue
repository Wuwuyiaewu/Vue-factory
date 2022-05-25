<template>
  <div id="tab">
    <ul>
      <li :class="{ check: isHome }" @click="goHome">
        <span class="sp_home" />
        <p>首页</p>
      </li>
      <li :class="{ check: isQuote }" @click="goQuote">
        <span class="sp_market" />
        <p>行情</p>
      </li>
      <!-- <li @click="goQuote" :class="{ check: isTrade }">
        <span class="sp_market"></span>
        <p>交易</p>
      </li> -->
      <li @click="goRegister" v-if="loginType === 'G'">
        <span class="sp_register"></span>
      </li>
      <li :class="{ check: isSort }" @click="goRankList" v-else>
        <span class="sp_trade" />
        <p>交易</p>
      </li>
      <li :class="{ check: isNews }" @click="goNews">
        <span class="sp_info" />
        <p>资讯</p>
      </li>
      <li :class="{ check: isMine }" @click="goMine">
        <span class="sp_mine" />
        <p>我的</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: 'Tab',
  data() {
    return {
      isHome: false,
      isNews: false,
      isSort: false,
      isMine: false,
      isQuote: false,
      currentUrl: ''
    }
  },
  computed: {
    ...mapState(["loginType"]),
  },
  mounted() {
    if (this.$route.path == '/home') {
      this.isHome = true
    } else if (this.$route.path == '/home/QuoteChart'||this.$route.path == '/home/Quotation'||this.$route.path == '/home/QuotationView'||this.$route.path == '/home/QuotationHot') {
      this.isQuote = true
    } else if (this.$route.path == '/home/Trade' || this.$route.path == '/home/TradePage') {
      this.isSort = true
    } else if (
      this.$route.path == '/Mine'
    ) {
      this.isMine = true
    } else if (this.$route.path == '/home/NewsList') this.isNews = true
  },
  methods: {
    goHome() {
      this.currentUrl = this.$route.path
      if (this.currentUrl != '/home') {
        this.$router.replace({ path: '/home',turn: 1 })
      }
    },
    getThisTimes() {
      var _this = this
      const yy = new Date().getFullYear()
      const mm = new Date().getMonth() + 1
      const dd = new Date().getDate()
      const hh = new Date().getHours()
      const mf =
        new Date().getMinutes() < 10
          ? '0' + new Date().getMinutes()
          : new Date().getMinutes()
      const ss =
        new Date().getSeconds() < 10
          ? '0' + new Date().getSeconds()
          : new Date().getSeconds()
      _this.gettime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
      return _this.gettime
    },
    goRegister() {
      this.currentUrl = this.$route.path
      if (this.currentUrl != '/Register') {
        this.$router.push({ path: '/Register' })
      }
    },
    goTrade() {
      this.currentUrl = this.$route.path
      if (this.currentUrl != '/home/QuoteChart') {
        this.$router.push({
          path: '/home/QuoteChart',
          query: { id: '3552563', view: 'index' }
        })
      }
    },
    goRankList() {
      this.currentUrl = this.$route.path
      if (this.currentUrl != '/home/Trade' && this.currentUrl != '/home/TradePage') {
        this.$router.push({ path: '/home/Trade' })
      }
    },
    goMine() {
      this.currentUrl = this.$route.path
      if (this.currentUrl != '/Mine') {
        this.$router.push({ path: '/Mine' })
      }
    },
    goQuote() {
      this.currentUrl = this.$route.path
      if (this.currentUrl !== '/home/Quotation') {
        this.$router.push({ path: '/home/Quotation' })
      }
    },
    goNews() {
      this.currentUrl = this.$route.path
      if (this.currentUrl !== '/home/NewsList') {
        this.$router.push({ path: '/home/NewsList' })
      }
    }
  }
}
</script>
