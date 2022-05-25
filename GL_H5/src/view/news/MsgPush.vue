<template>
  <div class="news headNav">

    <div class="navTitle">
      <div class="navItem">
        <img
          class="black"
          src="@/assets/images/nav/a_top_return.png"
          @click="back"
        />
        <span>行情推送</span>
      </div>
    </div>

    <div class="conList">
      <div id="listNav" class="listNav">
        <ul>
          <li :class="{ checked: isTrue == 725 }" @click="tabClick(725)">行情提醒</li>
          <li :class="{ checked: isTrue == 726 }" @click="tabClick(726)">精选策略</li>
          <li :class="{ checked: isTrue == 727 }" @click="tabClick(727)">交易机会</li>
        </ul>
      </div>
      

      <NoData
        v-if="newsList.length == 0"
        :is-trade="isTrade"
      />

      <div class="pushList">
        <ul>
          <li
            v-for="(news, index) in newsList"
            @click="getDetail(news)"
            :key="index"
            :class="{picBox:isTrue == 726}"
          >
            <div class="contentBox">
              <div class="leftBox">
                <div class="title">{{ news.title }}</div>
                <div class="desc">{{ filtHtml(news.content,isTrue) }}</div>
              </div>
              <div class="imgbox" v-if="isTrue==726"><img :src="news.image" @error="replaceDeadImagesWithDefault"></div>
            </div>

            <div class="price_time">

              <div class="productPrice" v-if="isTrue != 726 && news.productId && quote.codeTickMap[news.productId]">
                <span>{{quote.codeTickMap[news.productId] ? quote.codeTickMap[news.productId].symbolName: ""}}</span>
                <span :class="util.isNewP(quote.codeTickMap[news.productId])">{{quote.codeTickMap[news.productId].rate.toFixed(2) | sign}}%</span>
              </div>
              <div v-else>金隆环球</div>

              <span>{{ news.addtime | time }}</span>
            </div>
          </li>
        </ul>


        <div class="bottom-guide" ref="guide">
          <p v-if="reachedEnd">已显示全部消息</p>
          <p v-else><span v-if="showGuide">向下滑动以显示更多</span></p>
        </div>
      </div>
    </div>

    <Tab />
  </div>
</template>

<script>
require("../../assets/css/msgPush.css");
import { mapState } from "vuex";
import NoData from "@/view/NoData.vue";
import Tab from "@/components/Tab.vue";
import NewsApi from "@/plugins/newsApi";
import { productMap } from "@/utils/map";
import Util from "@/utils/tradeDataUtil";

export default {
  name: "NewsList",
  components: { NoData, Tab },
  filters: {
    time(longTime) {
      if(longTime){
        return Util.formatDate(longTime, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    sign(num) {
      if (num > 0) {
        return "+" + num;
      } else {
        return num;
      }
    }
  },
  data() {
    return {
      height: 0,
      showGuide: false,
      pullUpActive: false,
      isTrue: 725,
      curPage: 1,
      newsList: [],
      reachedEnd: false,
      isTrade: false,
      productMap: productMap,
      util: Util,
    };
  },
  computed: {
    ...mapState(["quote", "appProperties"]),
    login_type() {
      return "A";
    },
  },
  created() {
    window.addEventListener("scroll", this.pullingUp);
  },
  mounted() {
    this.docHeight();
    this.$bus.$emit("loading", true);
    this.removeFixed();
    this.getNewsList(this.isTrue)
  },
  activated() {
    this.$bus.$emit("loading", true);
    this.removeFixed();
    this.docHeight();
    window.addEventListener("scroll", this.pullingUp);
  },
  deactivated() {
    window.removeEventListener("scroll", this.pullingUp);
  },
  methods: {
    back() {
      window.removeEventListener("scroll", this.pullingUp);
      this.$router.go(-1);
    },
    filtHtml(str,isTrue) {
      return str.replace(/<[^>]+>/g,'')
    },
    removeFixed() {
      const mainH = document.getElementById("main");
      mainH.classList.remove("mainFixed");
    },
    tabClick(index) {
      this.reachedEnd = false;
      window.scrollTo(0, 0);
      this.isTrue = index;
      this.docHeight();
      this.getNewsList(index)
    },
    isOks: function(obj) {
      var val;
      if (obj > 0) {
        val = "rise";
      } else if (obj == 0) {
        val = "level";
      } else {
        val = "fall";
      }
      return val;
    },
    // 上拉事件
    pullingUp() {
      const innerHeight = document.querySelector("#main").clientHeight;
      const outerHeight = document.documentElement.clientHeight;
      const scrollTop = document.documentElement.scrollTop;
      if (innerHeight < outerHeight + scrollTop + 1 && !this.pullUpActive) {
        this.pullUpActive = true;
        if (!this.reachedEnd) {
          this.curPage++;
          this.getNewsList(this.isTrue);
          setTimeout(() => {
            this.pullUpActive = false;
          }, 1000);
        }
      }
    },
    getNewsList(id) {
      this.newsList = []
      let params = `?categoryId=${id}&count=10&pageIndex=${this.curPage}`;
      NewsApi.getMsgPush(params).then((res) => {
        this.newsList = res.data.list
        if(this.curPage,res.data.totalPage){
          this.reachedEnd = true
        }
      })
    },
    getDetail(news) {
      if(this.isTrue == 726){
        window.removeEventListener('scroll', this.pullingUp)
        this.$router.push({path: '/home/NewsDetail',query: {articleId: news.articleId,title: "精选策略",productId: news.productId}})
      }else{
        let productId = news.productId
        this.$router.push({ path: '/home/QuoteChart', query: { id: productId, view: 'view'}})
      }      
    },
    docHeight() {
      console.log("in docHeight");
      this.height = window.innerHeight || document.documentElement.clientHeight;
      // Reset the value for showGuide
      this.showGuide = false;
      // Set a delay to wait for the inner window to resize before calculating its height
      setTimeout(() => {
        const innerHeight = document.querySelector("#main").clientHeight;
        console.log(innerHeight);
        if (innerHeight > 800) {
          this.showGuide = true;
        }
      }, 500);
    },
    replaceDeadImagesWithDefault(e) {
      e.target.src = require("@/assets/images/news/image_placeholder.png");
    }
  },
};
</script>
