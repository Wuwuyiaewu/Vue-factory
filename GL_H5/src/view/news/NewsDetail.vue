<template>
  <div
    class="newsDetail headNav"
    :class="largeFont ? 'lg-font' : ''"
  >
    <div class="navTitle">
      <div class="navItem">
        <img
          class="black nav-left"
          src="@/assets/images/nav/a_top_return.png"
          @click="back"
        />
        <span v-if="detail.title">{{ detail.title | limit10 }}</span>
        <img
          class="fontsize-switcher help"
          src="@/assets/images/news/fontsize_switcher.png"
          @click="largeFont = !largeFont"
        />
      </div>
    </div>
    <template v-if="detail.productId && quote.codeTickMap[detail.productId] || detail.productId == 0">
      <div class="newsCon">
        <h1>{{ detail.title }}</h1>
        <time v-if="detail.addtime">{{ detail.addtime | time }}</time>
        <div class="product-info" v-if="quote.codeTickMap && detail.productId != '0' && detail.productId != ''">
          <span class="product-name">{{
            quote.codeTickMap[detail.productId].symbolName
          }}</span
          ><span
            class="product-price"
            :class="util.isNewP(quote.codeTickMap[detail.productId])"
            >{{
              parseFloat(quote.codeTickMap[detail.productId].newP).toFixed(3)
            }}</span
          ><i :class="util.isNewP(quote.codeTickMap[detail.productId])"></i>
        </div>
        <div class="newsItem" v-html="detail.content" />
      </div>
      <div class="float-footer" v-if="quote.codeTickMap && detail.productId != '0' && detail.productId != ''">
        <div class="product-data">
          <span>{{ quote.codeTickMap[detail.productId].symbolName }}</span>
          <span :class="util.isNewP(quote.codeTickMap[detail.productId])">{{
            parseFloat(quote.codeTickMap[detail.productId].newP).toFixed(3)
          }}</span
          ><i :class="util.isNewP(quote.codeTickMap[detail.productId])"></i>
          <span :class="util.isNewP(quote.codeTickMap[detail.productId])"
            >{{ quote.codeTickMap[detail.productId].rate.toFixed(2) | sign }}%</span
          >
        </div>
        <div class="quote-btn" @click="goQuoteChart(detail.productId)">看行情</div>
      </div>
    </template>
  </div>
</template>
<script>
require("@/assets/css/newsDetail.css");
import { mapState } from "vuex";
import moment from "moment";
import NewsApi from "@/plugins/newsApi";
import Util from "@/utils/tradeDataUtil";
export default {
  name: "NewsDetail",
  filters: {
    sign(num) {
      if (num >= 0) {
        return "+" + num;
      } else {
        return num;
      }
    },
    time(longTime) {
      return moment(new Date(longTime * 1000)).format("YYYY-MM-DD HH:mm:ss");
    },
    limit10(string) {
      return string.length > 10 ? string.substring(0, 10) + "..." : string;
    },
  },
  data() {
    return {
      detail: {},
      util: Util,
      largeFont: false,
    };
  },
  computed: {
    ...mapState(["quote"]),
    // newsContent() {
    //   if ()
    // }
  },
  watch: {
    // This watcher is for handling image on error
    "detail.content"(newValue, oldValue) {
      if (newValue && newValue != "") {
        this.$nextTick(() => {
          let images = document.querySelectorAll("img");
          [...images].forEach((image) => {
            image.onerror = () => {
              image.remove();
            };
          });
        });
      }
    },
  },
  mounted() {
    this.removeFixed();
    if (this.$route.query.articleId) {
      this.getNewDetail(this.$route.query.articleId, true);
    } else {
      this.getNewDetail(this.$route.query.id);
    }
    // Add a image onerror handler received from api
    // window.nofind = (e) => {
    //   console.log("in no find")
    //   // e.src = require("@/assets/images/news/image_placeholder.png");
    //   e.remove();
    // }
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    removeFixed() {
      const mainH = document.getElementById("main");
      mainH.classList.remove("mainFixed");
    },
    replaceDeadImagesWithDefault(e) {
      e.src = require("@/assets/images/news/image_placeholder.png");
    },
    getNewDetail(id, cms) {
      if (cms) {
        NewsApi.getCMSNewsDetail(id)
          .then((res) => {
            console.log(res.data);
            this.detail = res.data;
          })
          .catch((err) => console.log(err));
      } else {
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const time = new Date().getTime();
        const params = "?callback=json&id=" + id + "&timestamp=" + time;
        let data = {
          params: params,
          sign: "gmx" + id + time,
        };
        NewsApi.getNewsDetail(data)
          .then((res) => {
            this.detail = res.data.data[0];
          })
          .catch((err) => console.log(err));
      }
    },
    goQuoteChart(id) {
      this.$router.push({
        path: "/home/QuoteChart",
        query: { id: id, view: "view", tabIndex: this.isTrue },
      });
    },
  },
};
</script>
