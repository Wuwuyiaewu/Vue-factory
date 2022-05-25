<template>
  <div class="news headNav">
    <div class="navTitle">
      <div class="navItem">
        <img
          class="black"
          src="@/assets/images/nav/a_top_return.png"
          @click="back"
        />
        <span>资讯</span>
      </div>
    </div>
    <div class="conList">
      <div id="listNav" class="listNav">
        <ul>
          <li
            v-for="(item, index) in tabs"
            :class="{ checked: isTrue == index }"
            @click="tabClick(index, item)"
            :key="index"
          >
            <span>{{ item.name }}</span>
          </li>
        </ul>
      </div>
      <div class="calendar_container" v-show="isCalendar">
        <!-- <div
          class="calendar-button-prev nav-button"
          @click="filterGoBack"
        ></div>
        <div
          class="calendar-button-next nav-button"
          @click="filterGoNext"
        ></div> -->
        <div class="date_selection_box">
          <!-- <div
            class="date_box"
            v-for="(filter, index) in calendarFilter.filterArray"
            :key="index"
            :class="[
              filter.active || filter.date == calendarFilter.storedSelectedDate
                ? 'active'
                : '',
              filter.date == calendarFilter.today ? 'today' : '',
            ]"
            @click="filterClick(index)"
          >
            <p>{{ filter.day }}</p>
            <p>{{ filter.dayOfWeek }}</p>
          </div> -->
          <swiper
            ref="dateSwiper"
            :options="calendarFilterOptions"
            class="date-swiper"
          >
            <swiper-slide
              v-for="(filter, index) in calendarFilter.filterArray"
              :key="index"
            >
              <div
                class="date_box"
                @click="filterClick(index)"
                :class="[
                  filter.active ||
                  filter.date == calendarFilter.storedSelectedDate
                    ? 'active'
                    : '',
                  filter.date == calendarFilter.today ? 'today' : '',
                ]"
              >
                <p>{{ filter.day }}</p>
                <p>{{ filter.dayOfWeek }}</p>
                <span v-if="index == 7" class="month">{{
                  filter.date | extractLocaleMonth
                }}</span>
              </div>
            </swiper-slide>
          </swiper>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </div>
        <div
          class="advanced_filter_icon"
          :class="advancedFilterActive ? 'active' : ''"
          @click="showAdvancedFilter = !showAdvancedFilter"
        ></div>
      </div>
      <div
        class="category-bg"
        v-show="isTrue == 1 && featuredCategoryList.length > 0"
      >
        <div class="category-container">
          <swiper
            ref="categorySwiper"
            :options="categoryListOptions"
            class="category-swiper"
          >
            <swiper-slide v-for="id in featuredCategoryList" :key="id">
              <div
                @click="getFeaturedNewsList(id)"
                :class="categoryId == id ? 'active' : ''"
              >
                {{ featuredCategoryMap[id].name }}
              </div>
            </swiper-slide>
          </swiper>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </div>
      </div>

      <NoData
        v-if="noData"
        :class="isTrue == 1 || isTrue == 4 ? 'pad-top' : ''"
      />
      <!-- <div class="list" :class="isTrue == 3 ? 'narrow' : ''"> -->
      <div class="list" :class="listClass">
        <ul v-if="!isflash && !isCalendar && newsList[isTrue].list.length > 0">
          <li
            v-for="(news, index) in newsList[isTrue].list"
            @click="getDetail(news)"
            :key="index"
          >
            <div class="itemCon">
              <div class="leftCon">
                <div class="item-tag" v-if="isTrue == 0">
                  <span v-if="news.isHot == 'true'" class="hot">HOT</span
                  ><span v-if="news.isFeatured == 'true'" class="featured"
                    >精华</span
                  >
                </div>
                <div class="item1">
                  <span v-if="index === 0 && isTrue == 3" class="top"
                    >置顶</span
                  >
                  <p>{{ news.title }}</p>
                </div>
                <div v-if="news.resource || news.addtime" class="item2">
                  <span>{{ news.resource }}</span
                  ><span>{{ news.addtime | timeFromNow }}</span>
                </div>
                <div
                  class="item3"
                  v-if="
                    news.productId &&
                    (isTrue == 1 || isTrue == 3) &&
                    quote.codeTickMap[news.productId]
                  "
                >
                  <span>{{
                    quote.codeTickMap[news.productId]
                      ? quote.codeTickMap[news.productId].symbolName
                      : ""
                  }}</span
                  ><span :class="util.isNewP(quote.codeTickMap[news.productId])"
                    >{{
                      quote.codeTickMap[news.productId].rate.toFixed(2) | sign
                    }}%</span
                  >
                </div>
              </div>
              <div class="rightCon">
                <img :src="news.image" @error="replaceDeadImagesWithDefault" />
              </div>
            </div>
          </li>
        </ul>
        <ul class="flashList" v-if="isflash && flashList.list.length > 0">
          <li v-for="(news, index) in flashList.list" :key="index">
            <div
              class="date"
              v-if="index == 0 || showFlashDate(news.addtime, index)"
            >
              {{ Number(news.addtime) | date }}
            </div>
            <div v-if="news.addtime" class="item">
              <span /><time>{{ Number(news.addtime) | timeHour }}</time>
            </div>
            <div class="item1">
              <p class="test" v-html="news.content" />
              <div class="review" @click="isShowArrow(index)">
                <span
                  v-if="flashDivHeight[index] >= 1.15 * getRem() ? true : false"
                  >展开<i class="plus"
                /></span>
              </div>
            </div>
          </li>
        </ul>
        <ul v-if="isCalendar" class="calendar">
          <li v-for="(news, index) in filteredCalendarList" :key="index">
            <div class="row1">
              <span>{{ news.pub_time | timeHour2 }}</span
              ><span><img :src="news.country_icon" alt="country-icon" /></span
              ><span v-html="starConvert(news.star)"></span>
            </div>
            <div class="row2">
              <p>
                {{ news.country }}{{ news.time_period }}{{ news.name
                }}{{ news.unit | unitDisplay }}
              </p>
            </div>
            <div class="row3">
              <span>前值: {{ news.previous | nullDisplay }}</span>
              <span>预期: {{ news.consensus | nullDisplay }}</span>
              <span>公布: {{ news.actual | nullDisplay }}</span>
            </div>
          </li>
        </ul>

        <div class="bottom-guide" ref="guide" v-if="!noData">
          <p
            v-if="
              (!isflash && !isCalendar && newsList[isTrue].reachedEnd) ||
              (isflash && flashList.reachedEnd) ||
              (isCalendar && calendarList.length > 0)
            "
          >
            已显示全部消息
          </p>
          <p v-else>
            <span v-if="showGuide && isTrue != 4">{{ loadingText }}</span>
          </p>
        </div>
      </div>
    </div>
    <van-popup
      class="advanced_filter_container"
      v-model="showAdvancedFilter"
      position="top"
      :style="{ height: 'auto', overflowY: 'hidden' }"
    >
      <div class="advanced_filter_content">
        <div
          class="filter_section"
          v-for="(filter, key, index) in advancedFilter"
          :key="index"
        >
          <div class="header">
            <p>{{ filter.title }}</p>
          </div>
          <div class="body">
            <p
              v-for="(data, index2) in filter.data"
              :key="index2"
              @click="advFilterClick(key, data)"
              :class="selectedFilter[key].includes(data) ? 'active' : ''"
            >
              {{ data }}
            </p>
          </div>
        </div>
        <div class="footer">
          <div @click="advFilterReset">重置</div>
          <div @click="advFilterApply">确定</div>
        </div>
      </div>
      <img
        class="collapse-icon"
        src="@/assets/images/news/collapse.png"
        alt="collapse"
        @click.self="
          showAdvancedFilter = false;
          advFilterReset();
        "
      />
    </van-popup>
    <Tab />
  </div>
</template>

<script>
require("../../assets/css/news.css");
require("swiper/dist/css/swiper.css");
import { mapState } from "vuex";
import moment from "moment";
import NoData from "@/view/NoData.vue";
import Tab from "@/components/Tab.vue";
import NewsApi from "@/plugins/newsApi";
import { productMap } from "@/utils/map";
import Util from "@/utils/tradeDataUtil";

export default {
  name: "NewsList",
  components: { NoData, Tab },
  filters: {
    date(longTime) {
      return moment(new Date(longTime * 1000)).format("YYYY-MM-DD ddd");
    },
    time(longTime) {
      return moment(new Date(longTime * 1000)).format("YYYY-MM-DD HH:mm");
    },
    timeHour(longTime) {
      return moment(new Date(longTime * 1000)).format("HH:mm");
    },
    timeHour2(isoDate) {
      return moment(new Date(isoDate)).format("HH:mm");
    },
    timeFromNow(longTime) {
      return moment(new Date(longTime * 1000)).fromNow();
    },
    extractLocaleMonth(date) {
      // moment.locale("en");
      return moment(date).locale("en").format("MMM");
    },
    sign(num) {
      if (num >= 0) {
        return "+" + num;
      } else {
        return num;
      }
    },
    nullDisplay(data) {
      return data ? data + "%" : "---";
    },
    unitDisplay(data) {
      return data ? (data == "%" ? "" : "(" + data + ")") : "";
    },
  },
  data() {
    return {
      height: 0,
      showGuide: false,
      pullUpActive: false,
      isTrue: 0,
      tabChanged: false,
      //tabs: JSON.parse(process.env.VUE_APP_NEWLIST),
      tabs: [
        {
          name: "推荐",
        },
        {
          name: "要闻",
        },
        {
          name: "7x24",
        },
        {
          name: "策略",
        },
        {
          name: "日历",
        },
      ],
      newsList: {
        // 0 = 推荐, 1 = 要闻, 3 = 策略
        0: {
          list: [],
          curPage: 1,
          reachedEnd: false,
        },
        1: {
          list: [],
          curPage: 1,
          reachedEnd: false,
        },
        3: {
          list: [],
          curPage: 1,
          reachedEnd: false,
        },
      },
      newsListPages: {
        0: 1,
        1: 1,
        2: 1,
        3: 1,
        4: 1,
      },
      isflash: false, // 是否选择了快讯
      flashList: {
        list: [],
        reachedEnd: false,
      },
      isCalendar: false,
      calendarList: [],
      filteredCalendarList: [],
      calendarFilter: {
        today: null,
        startDate: null,
        selectedDate: null,
        storedSelectedDate: null,
        filterArray: [],
      },
      showAdvancedFilter: false,
      advancedFilter: {
        countries: {
          title: "地区",
          data: [
            "德国",
            "澳洲",
            "新西兰",
            "法国",
            "西班牙",
            "加拿大",
            "日本",
            "葡萄牙",
            "俄罗斯",
            "中国",
            "英国",
            "瑞士",
            "美国",
            "新加坡",
          ],
        },
        status: {
          title: "状态",
          data: ["已公布", "未公布"],
        },
        importance: {
          title: "重要性",
          data: ["低", "较低", "中等", "较高", "高"],
        },
      },
      selectedFilter: {
        countries: [],
        status: [],
        importance: [],
      },
      checkName: "推荐",
      featuredCategoryList: [],
      featuredCategoryMap: {
        8: { name: "外汇", order: 0 },
        35: { name: "数字货币", order: 1 },
        12: { name: "贵金属", order: 2 },
        16: { name: "原油", order: 3 },
        19: { name: "股市", order: 4 },
        23: { name: "港股", order: 5 },
        26: { name: "美股", order: 6 },
        28: { name: "期货", order: 7 },
        34: { name: "指数", order: 8 },
        32: { name: "农产品", order: 9 },
      },
      featuredNewsList: {},
      categoryListOptions: {
        slidesPerView: 6,
        initialSlide: 0,
        grabCursor: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
      calendarFilterOptions: {
        slidesPerView: 7,
        initialSlide: 7,
        // centeredSlides: true,
        grabCursor: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
      categoryId: null,
      flashDivHeight: [],
      flashIndex: -2,
      flashDivArticlesLineNo: [],
      flashDivArticlesRendered: [],
      loadingText: "向下滑动以显示更多",
      productMap: productMap,
      util: Util,
      noData: false,
    };
  },
  computed: {
    ...mapState(["quote", "appProperties", "loginType"]),
    checkTypeId: {
      get() {
        return this.checkTypeId;
      },
      set(val) {
        if (val == 2) {
          this.isflash = true;
          this.isCalendar = false;
        } else if (val == 4) {
          this.isCalendar = true;
          this.isflash = false;
        } else {
          this.isflash = false;
          this.isCalendar = false;
        }
        this.getNewsList(val);
      },
    },
    advancedFilterActive() {
      return !(
        this.selectedFilter.countries.length == 0 &&
        this.selectedFilter.status.length == 0 &&
        this.selectedFilter.importance.length == 0
      );
    },
    listClass() {
      let className = "";
      if (this.isTrue == 1 || this.isTrue == 4) {
        className = "pad-top";
      } else if (this.isTrue == 3) {
        className = "narrow";
      }
      return className;
    },
  },
  created() {
    document
      .querySelector("#main > div")
      .addEventListener("scroll", this.pullingUp);

    // Round relative time evaluation down for moment.js
    moment.relativeTimeRounding(Math.floor);

    // Set new time thresholds;
    // moment.relativeTimeThreshold("s", 60);
    // moment.relativeTimeThreshold("m", 60);
    // moment.relativeTimeThreshold("h", 24);
    // moment.relativeTimeThreshold("d", 7);
    // moment.relativeTimeThreshold("w", 4);
    // moment.relativeTimeThreshold("M", 12);
  },
  mounted() {
    // this.docHeight();
    moment.locale("zh-cn");
    this.removeFixed();
    // console.log(this.newsList);
    this.getNewsList(0, true);
    this.calendarFilter.startDate = moment().subtract(10, "days").format();
    this.initCalendarFilter();
    this.calendarFilter.filterArray[10].active = true;
    this.calendarFilter.today = moment().format("YYYYMMDD");
    this.calendarFilter.selectedDate = this.calendarFilter.filterArray[10].date;

    // Initialize Featured Category List from state
    this.featuredCategoryList = this.appProperties.news.featured_product_type
      .find((config) => config.login_type == this.loginType)
      .product_type.split(",");

    // Sort featured category list accordingly
    this.featuredCategoryList.sort((a, b) => {
      return (
        this.featuredCategoryMap[a].order - this.featuredCategoryMap[b].order
      );
    });
    // console.log(this.featuredCategoryList);

    this.categoryId = this.featuredCategoryList[0];
    // Initialize Featured News List Structure
    for (let i = 0; i < this.featuredCategoryList.length; i++) {
      this.featuredNewsList[this.featuredCategoryList[i]] = {
        list: [],
        curPage: 1,
        reachedEnd: false,
      };
    }
    //check category api
    // const time = new Date().getTime();
    // const data = {
    //   params: "?callback=json&timestamp=" + time,
    //   sign: "gmx" + time
    // }
    // NewsApi.getFeaturedNewsCategory(data).then(res=>console.log(res));
  },
  activated() {
    this.removeFixed();
    this.docHeight();
    document
      .querySelector("#main > div")
      .addEventListener("scroll", this.pullingUp);
  },
  deactivated() {
    window.removeEventListener("scroll", this.pullingUp);
  },
  methods: {
    // updateDateSwiper() {
    //   console.log("in update date swiper")
    //   this.$refs.dateSwiper.update();
    // },
    // updateCategorySwiper() {
    //   console.log("in update category swiper")
    //   this.$refs.categorySwiper.update();
    // },
    showFlashDate(date, index) {
      if (index > 0) {
        if (
          moment(new Date(date * 1000)).format("YYYY-MM-DD") !=
          moment(
            new Date(this.flashList.list[index - 1].addtime * 1000)
          ).format("YYYY-MM-DD")
        ) {
          return true;
        }
      }
      return false;
    },
    replaceDeadImagesWithDefault(e) {
      e.target.src = require("@/assets/images/news/image_placeholder.png");
    },
    initCalendarFilter() {
      // Reset the array
      this.calendarFilter.filterArray = [];
      for (let i = 0; i <= 20; i++) {
        this.calendarFilter.filterArray.push({
          date: moment(this.calendarFilter.startDate)
            .add(i, "days")
            .format("YYYYMMDD"),
          day: moment(this.calendarFilter.startDate).add(i, "days").format("D"),
          dayOfWeek: moment(this.calendarFilter.startDate)
            .add(i, "days")
            .format("ddd"),
          active: false,
        });
      }
    },
    filterClick(index) {
      let activeIndex = this.calendarFilter.filterArray.findIndex(
        (filter) => filter.active == true
      );
      if (activeIndex > -1) {
        this.calendarFilter.filterArray[activeIndex].active = false;
      }
      this.calendarFilter.filterArray[index].active = true;
      this.calendarFilter.selectedDate =
        this.calendarFilter.filterArray[index].date;
      this.calendarFilter.storedSelectedDate = this.calendarFilter.selectedDate;
      this.getNewsList(this.isTrue);
    },
    filterGoNext() {
      this.calendarFilter.startDate = moment(this.calendarFilter.startDate).add(
        7,
        "days"
      );
      this.initCalendarFilter();
    },
    filterGoBack() {
      this.calendarFilter.startDate = moment(
        this.calendarFilter.startDate
      ).subtract(7, "days");
      this.initCalendarFilter();
    },
    advFilterClick(key, value) {
      if (this.selectedFilter[key].findIndex((el) => el == value) > -1) {
        this.selectedFilter[key] = this.selectedFilter[key].filter(
          (el) => el != value
        );
      } else {
        this.selectedFilter[key].push(value);
      }
    },
    advFilterApply() {
      this.setFilteredCalendarList();
      this.showAdvancedFilter = false;
    },
    advFilterReset() {
      if (
        this.selectedFilter.countries.length == 0 &&
        this.selectedFilter.status.length == 0 &&
        this.selectedFilter.importance.length == 0
      ) {
        // Handle edge case for clicking collapse icon without clicking on confirm afterwards
        this.filteredCalendarList = this.calendarList;
      }
      this.selectedFilter.countries = [];
      this.selectedFilter.status = [];
      this.selectedFilter.importance = [];
    },
    isArticleExpandable(index) {
      return this.flashDivArticlesLineNo[index] > 3;
    },
    back() {
      window.removeEventListener("scroll", this.pullingUp);
      this.$router.go(-1);
    },
    removeFixed() {
      const mainH = document.getElementById("main");
      mainH.classList.remove("mainFixed");
    },
    getRem() {
      const defaultRem = 50;
      const winWidth = document.documentElement.clientWidth;
      const rem = (winWidth / 375) * defaultRem;
      return rem;
    },
    tabClick(index, item) {
      // reset no data
      this.noData = false;

      this.tabChanged = true;
      this.reachedEnd = false;
      window.scrollTo(0, 0);
      this.isTrue = index;
      this.checkTypeId = index;
      this.checkName = item.name;
      this.docHeight();
    },
    isOks: function (obj) {
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
    isShowArrow(index) {
      this.flashIndex = this.flashIndex == index ? -1 : index;
      const ps = document.querySelectorAll(".review");
      const test = document.querySelectorAll(".test");
      if (ps.length > 0) {
        if (ps[index].childNodes[0].textContent == "展开") {
          test[index].style.display = "block";
          ps[index].childNodes[0].innerHTML = "收起<i class='reduce'></i>";
        } else {
          test[index].style.display = "-webkit-box";
          ps[index].childNodes[0].innerHTML = "展开<i class='plus'></i>";
        }
      }
    },
    // 上拉事件
    pullingUp() {
      //   let secondTypeId;
      //   if (this.typeId == 9119) secondTypeId = "9139,9121,9151";
      //   else secondTypeId = this.typeId;
      // const innerHeight = document.querySelector("#main").clientHeight;
      // const outerHeight = document.documentElement.clientHeight;
      // const scrollTop = document.documentElement.scrollTop;
      const innerHeight = document.querySelector(".news").clientHeight;
      const outerHeight = document.querySelector("#main > div").clientHeight;
      const scrollTop = document.querySelector("#main > div").scrollTop;
      if (innerHeight <= outerHeight + scrollTop + 1 && !this.pullUpActive) {
        // console.log("innerHeight: " + innerHeight);
        // console.log("outerHeight + scrollTop: " + (outerHeight + scrollTop));
        // console.log("pullUpActive: " + this.pullUpActive);
        if (this.isflash && !this.flashList.reachedEnd) {
          this.pullUpActive = true;
          this.loadingText = "加载中";
          this.getNewsList(this.isTrue, true);
          // Set a delay before triggering another pullingUp event, mainly for fixing mobile scrolling bug
          setTimeout(() => {
            this.pullUpActive = false;
            this.loadingText = "向下滑动以显示更多";
          }, 1000);
        } else if (!this.isCalendar && !this.newsList[this.isTrue].reachedEnd) {
          this.pullUpActive = true;
          this.newsList[this.isTrue].curPage++;
          this.loadingText = "加载中";
          this.getNewsList(this.isTrue, true);
          // Set a delay before triggering another pullingUp event, mainly for fixing mobile scrolling bug
          setTimeout(() => {
            this.pullUpActive = false;
            this.loadingText = "向下滑动以显示更多";
          }, 1000);
        }
      }
    },
    getNewsList(index, fetchNew) {
      if (this.tabChanged) {
        this.page = 1;
        this.tabChanged = false;
      }
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      // console.log("date:" +　date);
      const time = new Date().getTime();
      const params = "?callback=json&";
      let data = {
        params: params,
        sign: "gmx" + time,
      };
      let transformedList;
      switch (index) {
        case 0:
          data.params += `&page=${this.newsList[0].curPage}&pageSize=10&timestamp=${time}`;
          // console.log(this.newsList[0]);
          if (
            this.newsList[0].list.length == 0 ||
            this.newsList[0].list.length < 13
          ) {
            NewsApi.getTopSuggestedNews().then((res) => {
              transformedList = res.data.list.map((news) => {
                return {
                  ...news,
                  desc: null,
                };
              });
              // console.log(transformedList);
              this.newsList[0].list = [...transformedList];
              this.noData = this.newsList[0].list.length == 0 ? true : false;
            });
          }
          if (fetchNew) {
            NewsApi.getSuggestedNews(data).then((res) => {
              if (this.newsList[0].curPage == res.data.data.total_page) {
                console.log("in reached end");
                this.newsList[0].reachedEnd = true;
              }
              this.newsList[0].list = [
                ...this.newsList[0].list,
                ...res.data.data.lists,
              ];
              this.noData = this.newsList[0].list.length == 0 ? true : false;
            });
          }
          break;
        case 1:
          if (
            this.featuredNewsList[this.categoryId].list.length == 0 ||
            fetchNew
          ) {
            this.getFeaturedNewsList(this.categoryId, true);
          } else {
            this.getFeaturedNewsList(this.categoryId);
          }
          break;
        case 2:
          let maxtime = "";
          if (this.flashList.list.length > 0) {
            maxtime =
              this.flashList.list[this.flashList.list.length - 1].addtime;
            data.sign = "gmx" + maxtime + time;
          }
          if (this.flashList.list.length == 0 || fetchNew) {
            data.params += "maxtime=" + maxtime + "&timestamp=" + time;
            NewsApi.getNewsFlash(data).then((res) => {
              if (res.data.data.lists.length > 0) {
                this.flashList.list = [
                  ...this.flashList.list,
                  ...res.data.data.lists,
                ];
              } else {
                this.flashList.reachedEnd = true;
              }
              this.noData = this.flashList.list.length == 0 ? true : false;
            });
          }
          break;
        case 3:
          NewsApi.getStrategicNews().then((res) => {
            transformedList = res.data.list.map((news) => {
              return {
                ...news,
              };
            });
            this.newsList[3].list = [...transformedList];
            this.noData = this.newsList[3].list.length == 0 ? true : false;
          });
          this.newsList[3].reachedEnd = true;
          break;
        case 4:
          this.getCalendarNewsList().then(() => {
            this.setFilteredCalendarList();
          });
          break;
      }
    },
    getFeaturedNewsList(catId, fetchNew = false) {
      if (this.categoryId != catId) {
        this.categoryId = catId;
        // Check if there is a existing list for the selected categoryId; If not, do the initial fetching by setting fetchNew = true;
        if (this.featuredNewsList[catId].list.length == 0) {
          fetchNew = true;
        }
      }
      // Only fetch new News data if fetchNew = true; Otherwise just return the cached News List
      if (fetchNew) {
        const time = new Date().getTime();
        const params =
          "?callback=json&type=" +
          catId +
          "&page=" +
          this.featuredNewsList[catId].curPage +
          "&pageSize=10&timestamp=" +
          time;
        let data = {
          params: params,
          sign: "gmx" + catId + time,
        };
        NewsApi.getFeaturedNews(data).then((res) => {
          const transformedList = res.data.data.lists.map((news) => {
            return {
              ...news,
              // Below is the old code for mapping CATS productId to GTS2 productId
              // productId: Object.keys(this.productMap).find(
              //   (key) => this.productMap[key] == news.productId
              // ),
            };
          });
          if (
            this.featuredNewsList[catId].curPage == res.data.data.total_page
          ) {
            // console.log("in reached end");
            this.featuredNewsList[catId].reachedEnd = true;
          }
          this.featuredNewsList[catId].list = [
            ...this.featuredNewsList[catId].list,
            ...transformedList,
          ];
          this.noData =
            this.featuredNewsList[catId].list.length == 0 ? true : false;
        });
      }
      this.newsList[1] = this.featuredNewsList[catId];
      this.noData =
        this.featuredNewsList[catId].list.length == 0 ? true : false;
      // console.log(this.featuredNewsList);
      this.docHeight();
    },
    getCalendarNewsList() {
      const time = new Date().getTime();
      const params =
        "?callback=json&date=" +
        this.calendarFilter.selectedDate +
        "&timestamp=" +
        time;
      let data = {
        params: params,
        sign: "gmx" + this.calendarFilter.selectedDate + time,
      };
      return NewsApi.getCalendar(data).then((res) => {
        this.calendarList = [...res.data.data.economics];
        this.noData = this.calendarList.length == 0 ? true : false;
      });
    },
    setFilteredCalendarList() {
      if (!this.advancedFilterActive) {
        this.filteredCalendarList = this.calendarList;
      } else {
        // handle the filter logic here
        if (
          this.selectedFilter.countries.length > 0 &&
          this.selectedFilter.countries.length <
            this.advancedFilter.countries.data.length
        ) {
          this.filteredCalendarList = this.calendarList.filter((el) => {
            return this.selectedFilter.countries.some(
              (filter) => el.country == filter
            );
          });
        }
        if (
          this.selectedFilter.status.length > 0 &&
          this.selectedFilter.status.length < 2
        ) {
          if (this.selectedFilter.status.includes("已公布")) {
            this.filteredCalendarList = this.calendarList.filter(
              (el) => el.actual != null
            );
          }
          if (this.selectedFilter.status.includes("未公布")) {
            this.filteredCalendarList = this.calendarList.filter(
              (el) => el.actual == null
            );
          }
        }
        if (
          this.selectedFilter.importance.length > 0 &&
          this.selectedFilter.importance.length < 5
        ) {
          const importanceMap = { 低: 1, 较低: 2, 中等: 3, 较高: 4, 高: 5 };
          let compareArray = [];
          this.selectedFilter.importance.forEach((filter) => {
            compareArray.push(importanceMap[filter]);
          });
          console.log(compareArray);
          this.filteredCalendarList = this.calendarList.filter((el) => {
            return compareArray.some((filter) => el.star == filter);
          });
        }
      }
    },
    getDetail(news) {
      window.removeEventListener("scroll", this.pullingUp);
      if (news.articleId) {
        this.$router.push({
          path: "/home/NewsDetail",
          query: {
            articleId: news.articleId,
            title: this.checkName,
            productId: news.productId ? news.productId : "",
          },
        });
      } else {
        this.$router.push({
          path: "/home/NewsDetail",
          query: {
            id: news.id,
            title: this.checkName,
            productId: news.productId ? news.productId : "",
          },
        });
      }
    },
    starConvert(num) {
      let divContent = "";
      for (let i = 0; i < num; i++) {
        divContent += `<i class="star_full"></i>`;
      }
      for (let i = 0; i < 5 - num; i++) {
        divContent += `<i class="star_empty"></i>`;
      }
      return divContent;
    },
    docHeight() {
      // Only handle this height if $route is active;
      if (this.$route.path == "/home/NewsList") {
        this.height =
          window.innerHeight || document.documentElement.clientHeight;

        // Reset the value for showGuide
        this.showGuide = false;
        // Set a delay to wait for the inner window to resize before calculating its height
        setTimeout(() => {
          const innerHeight = document.querySelector(".news").clientHeight;
          // console.log(innerHeight);
          if (innerHeight > 800) {
            this.showGuide = true;
          }
        }, 500);
      }
    },
  },
};
</script>
