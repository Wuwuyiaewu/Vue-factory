<template>
  <div
    id="home"
    :class="loginType === 'G' || loginType === 'R' ? '' : 'normal'"
  >
    <AppDlHeader :config="app_dl_header_config" />
    <div class="section">
      <div class="header">
        <a
          ><img
            src="../assets/images/index/msgbox.png"
            alt="msgbox"
            @click="goToMsgBox"
        /></a>
        <!-- <p class="title">金隆环球</p> -->
        <a v-if="cs_config.show == 'true'"
          ><img src="../assets/images/index/cs.png" alt="cs" @click="goToCS"
        /></a>
      </div>
      <swiper ref="mySwiper" :options="Banner" class="banner-swiper">
        <swiper-slide v-for="(banner, index) in banners" :key="index">
          <img
            :src="banner.pic"
            :alt="`banner${index + 1}`"
            @click="bannerHrefHandler(banner)"
          />
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <div class="card">
        <Broadcast
          :broadcastText="broadcastText"
          :rankedIds="FeaturedProductIds"
          :goQuoteChart="goQuoteChart"
        />
        <FeaturedProducts
          :featuredProductIds="FeaturedProductIds"
          :goQuoteChart="goQuoteChart"
        />
        <LargeButtons
          :btns="largeButtons"
          @showPopup="demoToRealPopupVisible = true"
        />
      </div>
      <SmallButtons :btns="smallButtons" />
    </div>
    <div class="section">
      <TradeRanking :goQuoteChart="goQuoteChart" />
    </div>
    <div class="section">
      <div class="hot-topics">
        <div class="section-header">
          <img src="../assets/images/index/hottopics.png" alt="hottopics" />
          <p style="color: #252525">热门话题</p>
        </div>
        <swiper ref="mySwiper2" :options="HotTopics">
          <swiper-slide v-for="(banner, index) in hotTopicBanners" :key="index">
            <img
              :src="banner.pic"
              :alt="`banner${index + 1}`"
              @click="bannerHrefHandler(banner)"
            />
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
    </div>
    <SuggestTechnical />
    <TabWLoginBar />
    <SplashScreen :goQuoteChart="goQuoteChart" :popup="popup" />

    <Popup
      :visible="popupVisible"
      :title="'请先登录'"
      :content="'您好，登录后可接收</br>您好，登录后可接收 突发行情通知哦~'"
      :cancelText="'取消'"
      :continueText="'立即登录'"
      :cancelHandler="closePopup"
      :continueHandler="gotoLogin"
    />
    <Popup
      :visible="demoToRealPopupVisible"
      :title="'提示'"
      :content="'你好！</br>真实账户才能操作, 请先补充资料'"
      :cancelText="'关闭'"
      :continueText="'补充资料'"
      :cancelHandler="closePopup"
      :continueHandler="gotoSuppInfo"
    />
  </div>
</template>

<script>
require("swiper/dist/css/swiper.css");
require("@/assets/css/homepagenew.css");
import { mapState } from "vuex";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import FeaturedProducts from "@/components/home/FeaturedProducts.vue";
import LargeButtons from "@/components/home/LargeButtons.vue";
import SmallButtons from "@/components/home/SmallButtons.vue";
import Broadcast from "@/components/home/Broadcast.vue";
import SuggestTechnical from "./SuggestTechnical.vue";
import TechnicalAnalysis from "@/components/home/TechnicalAnalysis.vue";
// import LoginBar from "@/components/home/LoginBar.vue";
// import Tab from "@/components/Tab.vue";
import TabWLoginBar from "@/components/TabWLoginBar.vue";
import SplashScreen from "@/components/home/SplashScreen.vue";
import TradeRanking from "@/components/home/TradeRanking.vue";
import SuggestedNews from "@/components/home/SuggestedNews.vue";
import AppDlHeader from "@/components/home/AppDlHeader.vue";

import Util from "@/utils/tradeDataUtil";
import hrefDict from "@/utils/apiHrefMap";
import productCode from "@/utils/productCode";

import Popup from "@/components/ui/Popup.vue";

export default {
  name: "HomeNew",
  components: {
    swiper,
    swiperSlide,
    FeaturedProducts,
    LargeButtons,
    SmallButtons,
    Broadcast,
    TechnicalAnalysis,
    TabWLoginBar,
    SplashScreen,
    TradeRanking,
    SuggestedNews,
    SuggestTechnical,
    AppDlHeader,
    Popup,
  },
  data() {
    return {
      util: Util,
      Banner: {
        notNextTick: true,
        slidesPerView: "auto",
        centeredSlides: true,
        loop: true,
        initialSlide: 0,
        autoplay: {
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: true,
        },
        speed: 800,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          type: "bullets",
        },
      },
      HotTopics: {
        slidesPerView: "auto",
        spaceBetween: 10,
        loop: true,
        autoplay: {
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: true,
        },
      },
      techAnalysisHTML: "",
      suggestIDs: JSON.parse(process.env.VUE_APP_SUGGEST),
      checkids: [],
      checknames: [],
      isWeekend: false,
      popupVisible: false,
      demoToRealPopupVisible: false,
    };
  },
  computed: {
    ...mapState(["quote", "user", "appProperties", "loginType"]),
    app_dl_header_config() {
      return this.appProperties.home
        ? this.appProperties.home.app_dl_header
        : {};
    },
    banners() {
      // return this.appProperties.home
      //   ? this.appProperties.home.banner
      //   : [];
      let resultBanners;
      if (this.appProperties.home) {
        let matchedBanners = this.appProperties.home.banner.filter((banner) => {
          const matchedConfig = banner.config.find((config) =>
            config.login_type.includes(this.loginType)
          );
          if (matchedConfig) {
            banner.href = matchedConfig.href;
            banner.other_href = matchedConfig.other_href;
          }
          return banner;
        });
        if (matchedBanners) {
          matchedBanners = matchedBanners.filter(
            (banner) => banner.show == "true"
          );
          resultBanners = matchedBanners;
        }
      }
      return resultBanners;
    },
    hotTopicBanners() {
      // return this.appProperties.home
      //   ? this.appProperties.home.hot_topics
      //   : [];
      let resultBanners;
      if (this.appProperties.home) {
        let matchedBanners = this.appProperties.home.hot_topics.filter(
          (banner) => {
            const matchedConfig = banner.config.find((config) =>
              config.login_type.includes(this.loginType)
            );
            if (matchedConfig) {
              banner.href = matchedConfig.href;
              banner.other_href = matchedConfig.other_href;
            }
            return banner;
          }
        );
        if (matchedBanners) {
          matchedBanners = matchedBanners.filter(
            (banner) => banner.show == "true"
          );
          resultBanners = matchedBanners;
        }
      }
      return resultBanners;
    },
    bannerSwiper() {
      return this.$refs.bannerSwiper.$swiper;
    },
    hotTopicsSwiper() {
      return this.$refs.hotTopicsSwiper.$swiper;
    },
    tickList() {
      // Filter out products that have preclose data such that their profits can be calcuated
      var tickList = this.quote.tickList.filter(
        (number) => number.preclose > 0
      );
      return tickList.sort(this.sortByRate("rate"));
    },
    FeaturedProductIds() {
      // Old logic to find the top 3 products from ticklist
      // if (this.tickList.length >= 3) {
      //   const topThreeProducts = [];
      //   for (let i = 0; i < 3; i++) {
      //     topThreeProducts.push(this.tickList[i].uiCodeID);
      //   }
      //   return topThreeProducts;
      // }
      return this.appProperties.home
        ? [
            this.appProperties.home.recommended_products[0].productId_1,
            this.appProperties.home.recommended_products[0].productId_2,
            this.appProperties.home.recommended_products[0].productId_3,
          ]
        : [];
    },
    filteredTickList() {
      return () => {
        var filt2arr = [];

        if (this.checkids.length) {
          filt2arr = this.quote.tickList.filter(
            (ele) =>
              this.Product(ele) &&
              this.checkids.includes(this.quote.notify[ele.uiCodeID].searchflag)
          );
          console.log("不为空" + this.checkids.length);
        } else {
          //var tk = this.quote.tickList.filter(tick => this.uiCodeIDs.includes(tick.uiCodeID))
          filt2arr = this.quote.tickList.filter((tick) =>
            this.suggestIDs.includes(tick.uiCodeID)
          );
        }

        //filt2arr = this.tickList2.filter((ele) =>this.Product(ele) && this.quote.notify[ele.uiCodeID].uchZone === id);
        //console.log(filt2arr)

        for (var i = 0; i < filt2arr.length; i++) {
          var FormulaCode = filt2arr[i].uiCodeID;

          if (productCode[FormulaCode]) {
            if (productCode[FormulaCode].marketPrice) {
              var mprice = this.quote.codeTickMap[FormulaCode]
                ? this.quote.codeTickMap[FormulaCode].newP
                : 1000000;
              //console.log("mulpiple:"+productCode[FormulaCode].mulpiple+mprice)
              var sum = eval(productCode[FormulaCode].mulpiple + mprice)
                ? eval(productCode[FormulaCode].mulpiple + mprice)
                : 0;
              filt2arr[i].profit = (filt2arr[i].high - filt2arr[i].low) * sum;
            } else {
              var sum = eval(productCode[FormulaCode].mulpiple)
                ? eval(productCode[FormulaCode].mulpiple)
                : 0;
              //console.log(productCode[FormulaCode].name+",固定计算:" + productCode[FormulaCode].mulpiple +",最高:"+ filt2arr[i].high+"-"+filt2arr[i].low + "结果:" + (filt2arr[i].high-filt2arr[i].low));
              filt2arr[i].profit = (filt2arr[i].high - filt2arr[i].low) * sum;
            }
          } else {
            //console.log("未配置产品:"+FormulaCode+"-"+filt2arr[i].symbolName+"--"+productCode[FormulaCode])
            filt2arr[i].profit = -1;
          }
        }

        const resultArr = filt2arr.sort(this.sortByRate("profit"));
        // if (resultArr.length >= 5) {
        //   const rankedIds = [];
        //   for (i = 0; i < 5; i++) {
        //     rankedIds.push(resultArr[i].uiCodeID);
        //   }
        //   if (this.rankedIds != rankedIds) {
        //     this.rankedIds = rankedIds;
        //   }
        // }
        return resultArr;
      };
    },
    rankedIds() {
      return this.filteredTickList().length >= 5
        ? this.filteredTickList()
            .slice(0, 5)
            .map((ele) => ele.uiCodeID)
        : [];
    },
    cs_config() {
      return this.appProperties.home ? this.appProperties.home.im_config : {};
    },
    largeButtons() {
      let resultButtons;
      if (this.appProperties.home) {
        resultButtons = this.appProperties.home.top_btn.find((btn) => {
          return btn.login_type.includes(this.loginType);
        });
      }
      console.log(resultButtons);
      return resultButtons;
    },
    smallButtons() {
      let resultButtons;
      if (this.appProperties.home) {
        resultButtons = this.appProperties.home.bot_btn.filter((btn) => {
          return btn.login_type.includes(this.loginType);
        });
      }
      return resultButtons;
    },
    broadcastText() {
      let resultTextArr;
      if (this.appProperties.home) {
        let matchedTextArr = this.appProperties.home.broadcast.filter(
          (broadcast) => {
            const matchedConfig = broadcast.config.find((config) =>
              config.login_type.includes(this.loginType)
            );
            if (matchedConfig) {
              broadcast.href = matchedConfig.href;
              broadcast.other_href = matchedConfig.other_href;
            }
            return broadcast;
          }
        );
        if (matchedTextArr) {
          matchedTextArr = matchedTextArr.filter(
            (broadcast) => broadcast.show == "true"
          );
          resultTextArr = matchedTextArr;
        }
      }
      return resultTextArr;
    },
    popup() {
      let resultPopup;
      // {
      //   show: false,
      //   pic: "",
      //   href: "",
      //   other_href: "",
      // };
      if (this.appProperties.home) {
        const matchedPopup = this.appProperties.home.popup_float.find(
          (popup) => {
            const matchedConfig = popup.config.find((config) =>
              config.login_type.includes(this.loginType)
            );
            if (matchedConfig) {
              popup.href = matchedConfig.href;
              popup.other_href = matchedConfig.other_href;
            }
            return popup;
          }
        );
        if (matchedPopup) {
          resultPopup = matchedPopup;
        }
      }
      return resultPopup;
    },
  },
  methods: {
    sortByRate(i) {
      return function (a, b) {
        //return Math.abs(((b.newP - b.preclose) / b.preclose) * 100) - Math.abs(((a.newP - a.preclose) / a.preclose) * 100)
        return b[i] - a[i];
      };
    },
    Product(obj) {
      const quotes = this.quote.notify;
      for (var i in quotes) {
        //console.log(i+"///"+obj.uiCodeID)
        if (i == obj.uiCodeID) {
          if ((this.user.loginname && obj.symbolData) || !this.user.loginname) {
            return true;
          }
        }
      }
      return false;
    },
    goQuoteChart(id, name) {
      // this.$firebase.logEvent("click_product", {
      //   platform_type: "cfdwell",
      //   account_type: localStorage.getItem("zsmn"),
      //   source: "首页热门产品",
      //   product_name: name,
      //   time: Util.getThisTime(),
      //   url: window.location.href,
      // });

      this.$router.push({
        path: "/home/QuoteChart",
        query: { id: id, view: "index" },
      });
    },
    bannerHrefHandler(banner) {
      console.log(banner);
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
    },
    closePopup() {
      this.popupVisible = false;
      this.demoToRealPopupVisible = false;
    },
    gotoLogin() {
      this.$router.push({
        path: "/login",
      });
    },
    goToMsgBox() {
      console.log(this.loginType);
      if (this.user.loginname) {
        this.$router.push({
          path: "/home/MsgPush",
        });
      } else {
        this.popupVisible = true;
      }
    },
    goToCS() {
      let url_text = this.cs_config.CS_url;
      let url = new URL(this.cs_config.CS_url);
      let modifier = url.search != "" ? "&" : "?";
      if (!url.searchParams.get("utm_source")) url_text += modifier + "utm_source=" + sessionStorage.getItem("utm_source");
      if (!url.searchParams.get("utm_medium") && sessionStorage.getItem("utm_medium")) url_text += modifier + "utm_medium=" + sessionStorage.getItem("utm_medium");
      if (!url.searchParams.get("utm_campaign") && sessionStorage.getItem("utm_campaign")) url_text += modifier + "utm_campaign=" + sessionStorage.getItem("utm_campaign");
      if (!url.searchParams.get("utm_content") && sessionStorage.getItem("utm_content")) url_text += modifier + "utm_content=" + sessionStorage.getItem("utm_content");
      if (!url.searchParams.get("utm_term") && sessionStorage.getItem("utm_term")) url_text += modifier + "utm_term=" + sessionStorage.getItem("utm_term");
      this.$router.push({
        path: "/home/BannerUrl",
        query: {
          title: "线上客服",
          url: url_text,
        },
      });
    },
    gotoSuppInfo() {
      this.demoToRealPopupVisible = false;
      this.$router.push({
        path: "/SupplementaryInfo",
      });
    },
  },
  mounted() {
    //console.log("in home new");
    setTimeout(() => {
      sessionStorage.setItem("productMapNew", JSON.stringify(this.quote));
      let productsid_map = {};
      this.quote.tickList.map((item) => {
        productsid_map[item.uiCodeID] = item.symbolName;
      });
      sessionStorage.setItem("products", JSON.stringify(productsid_map));
    }, 1000);

    this.$bus.$on("updatecheck", (data) => {
      this.checkids = data.id;
      this.checknames = data.name;
    });
  },
  activated() {},
  created() {
    let d = new Date();
    if (
      (d.getDay() == 6 &&
        ((d.getHours() == 5 && d.getMinutes() >= 45) || d.getHours() > 5)) ||
      d.getDay() == 0 ||
      (d.getDay() == 1 && d.getHours() < 7)
    ) {
      // Show only crypto products during weekends
      this.isWeekend = true;
      this.checkids = [6];
      this.checknames = ["数字货币"];
    } else {
      // Keep normal logic
    }
  },
};
</script>
