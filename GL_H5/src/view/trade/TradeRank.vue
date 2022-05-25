<template>
  <div class="tradeRank">

    <div class="navTitle">
      <div class="navItem">
        <img class="black" src="../../assets/images/nav/tradeRank_top_return.png" @click="back">
      </div>

      <div class="mark">持仓数据最后更新时间：{{lastUpdateTime}}</div>
    </div>

    <div class="conList">
      <ul>
        
				<li v-for="(news,index) in newsList" :key="'tabs-tick-' + news.productId" @click="goQuoteChart(news.productId)">
					<span class="num"><img v-if="index<3" :src="require('../../assets/images/rankList/ranking_icon'+(index+1)+'.png')"><label v-else>{{index}}</label></span>
					<p class="cat_title"><b>{{news.productName}}</b>{{getRankDetail(news.productId,5)}}</p>
					<div class="details_bar"> 
						<span class="left">多</span>
            <div class="barbox">
              <p class="bar_text bar_text_up"><span :class="getRankDetail(news.productId,4)"><i>+</i>{{Number(getRankDetail(news.productId,2)).toFixed(2)}}</span><span>{{Number(getRankDetail(news.productId,1)).toFixed(2)}}</span><span>{{getRankDetail(news.productId,3)}}</span></p>
              <p class="bar"><span :style="{width: news.bullishRate+'%'}"><i v-if="news.bullishRate < 98"></i></span></p>
              <p class="bar_text bar_text_down"><span>{{Number(news.bullishRate).toFixed(2)}}%</span><span>{{(100-news.bullishRate).toFixed(2)}}%</span></p>
            </div>
            <span class="right">空</span>
					</div>
				</li>

			</ul>
    </div>

    <div class="statement">声明表示：以上信息仅供参考。</div>
    <div class="btn" @click="showPop">立即订阅</div>


    <div class="popbox" v-show="popShow">
      <div class="imgbox"><img src="@/assets/images/trade/traderank_ico.png"></div>
      <p class="title">订阅交易之最</p>
      <p>感谢您的订阅<br>我们将会每日发送您的订阅至邮箱。</p>
      <div class="inputbox">
        <div class="box"><input class="input" type="text" placeholder="请输入您的交易账号" v-model="user.userAccount"><img @click="clearUserAccount" class="close" src="@/assets/images/trade/close.png"></div>
        <div class="box"><input class="input" type="text" placeholder="请输入您的邮箱" v-model="user.userEmail"><img @click="clearUserEmail" class="close" src="@/assets/images/trade/close.png"></div>
        <div class="btn" @click="submit">立即订阅</div>
      </div>
      <img class="big_close" src="@/assets/images/trade/close.png" @click="closePop">
    </div>

    <div class="popokbox" v-show="bookSuccess">
      <div class="imgbox"><img src="@/assets/images/trade/traderank_ico.png"></div>
      <p class="title">已订阅</p>
      <p>感谢您的订阅</p>
      <img class="big_close" src="@/assets/images/trade/close.png" @click="closeSuccess">
    </div>

    <div class="popbox_bg" v-show="popShow||bookSuccess" @click="closeAll"></div>

  </div>
</template>

<script>
require('../../assets/css/tradeRank.css')
import { mapState } from 'vuex'
import moment from 'moment'
import Util from "@/utils/tradeDataUtil";

export default {
  name: 'tradeRank',
  filters: {
    time(longTime) {
      return moment(new Date(longTime)).format('YYYY-MM-DD HH:mm')
    }
  },
  data() {
    return {
      util: Util,
      newsList: [],
      lastUpdateTime : "",
      user:{
        userAccount: "",
        userEmail: ""
      },
      popShow: false,
      bookSuccess: false
    }
  },
  computed: {
    ...mapState(['quote'])
  },
  created() {
  },
  mounted() {
    this.$bus.$emit('loading', true)
    this.removeFixed()
    this.TradeRanking()
  },
  activated() {
    this.$bus.$emit('loading', true)
    this.removeFixed()
    window.addEventListener('scroll', this.pullingUp)
  },
  methods: {
    clearUserAccount(){
      this.user.userAccount = ''
    },
    clearUserEmail(){
      this.user.userEmail = ''
    },
    showPop(){
      this.popShow = true
    },
    closePop(){
      this.popShow = false
      this.clearUserAccount()
      this.clearUserEmail()
    },
    closeSuccess(){
      this.bookSuccess = false
    },
    closeAll(){
      this.closePop()
      this.closeSuccess()
    },
    submit(){
      //this.$bus.$emit("loading", false)
      axios.get("https://misapi.zxintt.com/h5Api/updateBookingInfo.do?callback=&account="+this.user.userAccount+"&email="+this.user.userEmail+"&bookingStatus=1&isNewInfo=1").then((res) => {
        let result = res.data.replace("({","{")
        result = result.replace("})","}")
        result = JSON.parse(result)
        if(result.result == 0){
          this.closePop()
          this.bookSuccess = true
        }else{
          this.$toast(result.message)
        }
        this.$bus.$emit("loading", true)
      })
      .catch((err) => console.log(err));
    },
    getRankDetail(productId,val){
      let dataArr = this.quote.codeTickMap[productId]

      if(val==1){
        //返回最新价
        return dataArr?dataArr.newP:0
      }else if(val==2){
        //返回涨跌值
        if(dataArr){
          return this.util.accSub(dataArr.newP, dataArr.preclose)
        }
      }else if(val==3){
        //返回涨幅
        if(dataArr){
          if(dataArr.rate != "Infinity"){
            return Number(dataArr.rate.toFixed(2)) + "%"
          }else{
            return '0'
          }
        }
      }else if(val==4){
        //返回class
        if(dataArr){
          let obj = this.util.accSub(dataArr.newP, dataArr.preclose)
          let updown = ""
          if (obj > 0) {
            updown = 'rise'
          } else if (obj === 0) {
            updown = 'level'
          } else {
            updown = 'fall'
          }
          return updown
        }
      }else if(val==5){
        if(dataArr){
          return dataArr.symbol
        }
      }
    },
    goQuoteChart(id, name) {
      this.$bus.$emit("loading", false);
      this.$router.push({
        path: "/home/QuoteChart",
        query: { id: id, view: "index" },
      });
    },
    sortByRank(i) {
      return function(a, b) {
        return a[i] - b[i];
      };
    },
    back() {
      window.removeEventListener('scroll', this.pullingUp)
      this.$router.go(-1)
    },
    removeFixed() {
      const mainH = document.getElementById('main')
      mainH.classList.remove('mainFixed')
    },
    getRem() {
      const defaultRem = 50
      const winWidth = document.documentElement.clientWidth
      const rem = (winWidth / 375) * defaultRem
      return rem
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
    TradeRanking() {
      this.axios
        .get(
          process.env.VUE_APP_CMS + "/gm_platform/tradeRanking.json"
        )
        .then((res) => {
          if (res.status == 200) {
            let rankdata = res.data.sort(this.sortByRank('rank'))
            this.lastUpdateTime = res.data[0].publishDate
            this.newsList = rankdata
          }
        })
    }
  }
}
</script>
