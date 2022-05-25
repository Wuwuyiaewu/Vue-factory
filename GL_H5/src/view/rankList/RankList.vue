<template>
  <div class="rankList headNav" :style="{'min-height':height+'px'}">
    <div class="navTitle">
      <div class="navItem">
        <img class="black" src="@/assets/images/nav/a_top_return.png" @click="back">
        <span>喜报</span>
      </div>
    </div>
    <div class="content">
      <div class="dv_list" :class="user.loginname?'':'noLogin'">
        <ul>
          <li v-for="item in rankData" v-if="item">
            <div class="dv_title">
              <span><img src="@/assets/images/rankList/icon-1.png">用户{{ item.customer }}</span>
              <time>{{ new Date(item.time).format("yyyy-MM-dd hh:mm:ss") }}</time>
            </div>
            <div class="dv_Con">
              <div class="item">
                <span><em :class="item.open_direction.toUpperCase()=='BUY'?'buy':'sell'">{{ item.open_direction.toUpperCase()=='BUY'?'买入':'卖出' }} </em>{{ item.name }}</span>
                <span>{{ item.profit>=0?"盈利":'亏损' }} <em :class="item.profit>=0?'profit':'deficit'">{{ item.profit }}美元</em></span></div>
              <div class="item"><p><em>{{ item.open_margin }}美元</em><em>成交价:{{ item.open_price }}</em></p><p>平仓价:{{ item.close_price }}</p></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <Bottom :content="contentTxt" />
    <Tab />
  </div>
</template>

<script>
require('@/assets/css/rankList.css')
import Tab from '@/components/Tab.vue'
import Bottom from '@/components/Bottom.vue'
import api from '@/plugins/api'
import '@/utils/tradeDataUtil'
import { mapState } from 'vuex'
export default {
  name: 'RankList',
  components: { Tab, Bottom },
  computed: {
    ...mapState(['user'])
  },
  data() {
    return {
      sign: process.env.VUE_APP_GA_SIGN,
      height: '',
      rankData: [],
      contentTxt: '盈利喜报，期待您的上榜战绩'
    }
  },
  mounted() {
    this.$bus.$emit('loading', true)
    this.removeFixed()
    this.docHeight()
    this.initRankData()
  },
  activated() {
    this.$bus.$emit('loading', true)
    this.removeFixed()
    this.docHeight()
  },
  methods: {
    docHeight() {
      this.height = window.innerHeight || document.documentElement.clientHeight
    },
    back() {
      this.$router.go(-1)
    },
    removeFixed() {
      let body
      if (document.documentElement) {
        body = document.documentElement
      } else if (document.body) {
        body = document.body
      }
      const mainH = document.getElementById('main')
      mainH.classList.remove('mainFixed')
      if (body.clientWidth > 750) {
        mainH.style.width = 'auto'
        mainH.style.left = 0
      }
    },
    login() {
      this.$bus.$emit('loading', false)
      this.$router.push({ path: '/Login' })
    },
    initRankData() {
      api.getLastTradeDataForH5().then(res => {
        if (res.data.code == 200) {
          if (res.data.data && res.data.data.length > 0) {
            this.rankData = res.data.data
          } else {
            this.rankData = []
          }
        }
      })
    }
  }
}
</script>
