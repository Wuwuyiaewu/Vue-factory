<template>
  <div class="aboutNews">
    <div class="newsNav">
      <ul>
        <li :class="{checked:relateIndex==1}" @click="changeRelated(1)">相关资讯</li>
        <li :class="{checked:relateIndex==2}" @click="changeRelated(2)">分析</li>
        <li :class="{checked:relateIndex==3}" @click="changeRelated(3)">数据中心</li>
        <li :class="{checked:relateIndex==4}" @click="changeRelated(4)">日历</li>
      </ul>
    </div>
    <div class="newsCon">

      <div class="list2" v-show="relateIndex==1">
        <NoData v-if="nodata" />
        <ul>
          <li v-for="(news,index) in newsArr" @click="geDetail(news)" :key="index">
            <span>{{ news.title }}</span>
            <time v-if="news.addtime">{{ Number(news.addtime)|time }}</time>
          </li>
        </ul>
      </div>

      <div class="list1" v-show="relateIndex==2">
        <NoData v-if="nodata" />
        <div class="tech_analysis_time_menu" id="tech_analysis_time_menu">
          <template v-for="(e, index) in techDetailTimingSort">
            <span
              :class="{ selected: index === techDetailTimingIndex }"
              :key="index"
              @click="setTechDetailTimingIndex(index)"
              >{{ e.timeString }}</span
            >
          </template>
          <div
            :class="{ show: isShowTimeMenu }"
            class="other_menu"
            id="tech_analysis_other_menu"
          >
            <i @click.stop="isShowTimeMenu = !isShowTimeMenu"></i>
            <div class="other_menu_container">
              <template v-for="(e, index) in techDetailTimingMenu">
                <span :key="index" @click="switchTiming(index)">{{ e.timeString }}</span>
              </template>
            </div>
          </div>
        </div>

        <table class="tech_analysis_table">
              <tr>
                <td><p>移动平均指数</p></td>
                <td>
                  <p :class="techAnalyInfo.conclusionMATextColor">
                    {{ techAnalyInfo.conclusionMAText }}
                  </p>
                </td>
                <td>
                  <p
                    :class="techAnalyInfo.conclusionMABuyTextColor"
                    v-html="techAnalyInfo.conclusionMABuyText"
                  ></p>
                </td>
                <td>
                  <p
                    :class="techAnalyInfo.conclusionMASellTextColor"
                    v-html="techAnalyInfo.conclusionMASellText"
                  ></p>
                </td>
              </tr>
              <tr>
                <td><p>技术指标</p></td>
                <td>
                  <p :class="techAnalyInfo.conclusionTechIndiTextColor">
                    {{ techAnalyInfo.conclusionTechIndiText }}
                  </p>
                </td>
                <td>
                  <p
                    :class="techAnalyInfo.conclusionTechIndiBuyTextColor"
                    v-html="techAnalyInfo.conclusionTechIndiBuyText"
                  ></p>
                </td>
                <td>
                  <p
                    :class="techAnalyInfo.conclusionTechIndiSellTextColor"
                    v-html="techAnalyInfo.conclusionTechIndiSellText"
                  ></p>
                </td>
              </tr>
              <tr>
                <th>总结</th>
              </tr>
              <tr>
                <th colspan="4">
                  <p
                    :class="[techAnalyInfo.conclusionBg]"
                    class="animated-btn"
                    @click="
                      techButtonHandler($event, rankedIds[techAnalyIndex])
                    "
                  >
                    <span class="shake">{{ techAnalyInfo.conclusion }}</span>
                  </p>
                </th>
              </tr>
        </table>

        <div class="tech_analysis_popup" id="tech_analysis_popup">
          <div class="tech_analysis_popup_content">

            <div class="tech_analysis_over">
              <ul class="tech_analysis_table_group">
                <li>
                  <!--<p class="date_text">2020年9月17日 04:03 GMT</p>-->
                  <h4>移动平均指数</h4>
                  <table class="tech_analysis_table_top">
                    <tr>
                      <td>名称</td>
                      <td>标准</td>
                      <td>移动</td>
                    </tr>
                  </table>

                  <table class="tech_analysis_table table2">
                    <tr>
                      <td>
                        <p>MA5</p>
                      </td>
                      <td>
                        <p
                          :class="
                            setTechConclusionBgColor(
                              techAnalyInfo.standardMA5HTML
                            )
                          "
                        >
                          <span v-html="techAnalyInfo.standardMA5HTML"></span>
                        </p>
                      </td>
                      <td>
                        <p
                          :class="
                            setTechConclusionBgColor(techAnalyInfo.moveMA5HTML)
                          "
                        >
                          <span v-html="techAnalyInfo.moveMA5HTML"></span>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>MA10</p>
                      </td>
                      <td>
                        <p
                          :class="
                            setTechConclusionBgColor(
                              techAnalyInfo.standardMA10HTML
                            )
                          "
                        >
                          <span v-html="techAnalyInfo.standardMA10HTML"></span>
                        </p>
                      </td>
                      <td>
                        <p
                          :class="
                            setTechConclusionBgColor(techAnalyInfo.moveMA10HTML)
                          "
                        >
                          <span v-html="techAnalyInfo.moveMA10HTML"></span>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>MA20</p>
                      </td>
                      <td>
                        <p
                          :class="
                            setTechConclusionBgColor(
                              techAnalyInfo.standardMA20HTML
                            )
                          "
                        >
                          <span v-html="techAnalyInfo.standardMA20HTML"></span>
                        </p>
                      </td>
                      <td>
                        <p
                          :class="
                            setTechConclusionBgColor(techAnalyInfo.moveMA20HTML)
                          "
                        >
                          <span v-html="techAnalyInfo.moveMA20HTML"></span>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>MA50</p>
                      </td>
                      <td>
                        <p
                          :class="
                            setTechConclusionBgColor(
                              techAnalyInfo.standardMA50HTML
                            )
                          "
                        >
                          <span v-html="techAnalyInfo.standardMA50HTML"></span>
                        </p>
                      </td>
                      <td>
                        <p
                          :class="
                            setTechConclusionBgColor(techAnalyInfo.moveMA50HTML)
                          "
                        >
                          <span v-html="techAnalyInfo.moveMA50HTML"></span>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>MA100</p>
                      </td>
                      <td>
                        <p
                          :class="
                            setTechConclusionBgColor(
                              techAnalyInfo.standardMA100HTML
                            )
                          "
                        >
                          <span v-html="techAnalyInfo.standardMA100HTML"></span>
                        </p>
                      </td>
                      <td>
                        <p
                          :class="
                            setTechConclusionBgColor(techAnalyInfo.moveMA100HTML)
                          "
                        >
                          <span v-html="techAnalyInfo.moveMA100HTML"></span>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>MA200</p>
                      </td>
                      <td>
                        <p
                          :class="
                            setTechConclusionBgColor(
                              techAnalyInfo.standardMA200HTML
                            )
                          "
                        >
                          <span v-html="techAnalyInfo.standardMA200HTML"></span>
                        </p>
                      </td>
                      <td>
                        <p
                          :class="
                            setTechConclusionBgColor(techAnalyInfo.moveMA200HTML)
                          "
                        >
                          <span v-html="techAnalyInfo.moveMA200HTML"></span>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p><b>总结</b></p>
                      </td>
                      <td>
                        <p>
                          <span v-html="techAnalyInfo.maConcludeText"></span>
                        </p>
                      </td>
                      <td>
                        <p
                          :class="
                            setTechConclusionBgColor(techAnalyInfo.maConclude)
                          "
                        >
                          <span v-html="techAnalyInfo.maConclude">买入</span>
                        </p>
                      </td>
                    </tr>
                  </table>
                </li>
                <li>
                  <!--<p class="date_text">2020年9月17日 04:03 GMT</p>-->
                  <h4>技术指标</h4>
                  <table class="tech_analysis_table_top">
                    <tr>
                      <td>代码</td>
                      <td>价值</td>
                      <td>操作</td>
                    </tr>
                  </table>

                  <table class="tech_analysis_table table2 table3">
                    <template v-for="item in techAnalyInfo.ti">
                      <tr :key="item.name">
                        <td>{{ item.name }}</td>
                        <td>
                          <p>
                            <span>{{ item.info }}</span>
                          </p>
                        </td>
                        <td>
                          <p :class="setTechConclusionBgColor(item.conclude)">
                            <span>{{ item.conclude }}</span>
                          </p>
                        </td>
                      </tr>
                    </template>

                    <tr>
                      <td>
                        <p><b>总结</b></p>
                      </td>
                      <td>
                        <p v-html="techAnalyInfo.tiConcludeInfo"></p>
                      </td>
                      <td>
                        <p
                          :class="
                            setTechConclusionBgColor(techAnalyInfo.tiConclude)
                          "
                        >
                          <span
                            >&nbsp;<br />{{ techAnalyInfo.tiConclude
                            }}<br />&nbsp;</span>
                        </p>
                      </td>
                    </tr>
                  </table>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="list3" v-show="relateIndex==3">
        <NoData v-if="nodata" />
        <div class="title"><span>客户持仓</span><span>最近五天</span></div>
        <ul>
          <li v-for="(dc,index) in DCArr" :key="index">
            <div class="column">
              <div class="buy" :style="{ height: buy(dc.buy,dc.sell) + '%'}"><label>多</label><span>{{buy(dc.buy,dc.sell)}}%</span></div>
              <div class="sell" :style="{ height: sell(dc.buy,dc.sell) + '%'}">空<span>{{sell(dc.buy,dc.sell)}}%</span></div>
            </div>
            <span class="time">{{ dc.time }}</span>
          </li>
        </ul>
      </div>

      <div class="list4" v-show="relateIndex==4">
        <NoData v-if="nodata" />
        <ul>
          <li v-for="(data,index) in calendarList" :key="index">

            <div class="row1">
              <span>{{ data.pub_time | timeHour }}</span>
              <span><img :src="data.country_icon"/></span>
              <span v-html="starConvert(data.star)"></span>
            </div>

            <div class="row2">
              <p>
                {{ data.country }}{{ data.time_period }}{{ data.name }}{{ data.unit | unitDisplay }}
              </p>
            </div>

            <div class="row3">
              <span>前值: {{ data.previous | nullDisplay }}</span>
              <span>预期: {{ data.consensus | nullDisplay }}</span>
              <span>公布: {{ data.actual | nullDisplay }}</span>
            </div>

          </li>
        </ul>
      </div>


    </div>
  </div>
</template>

<script>
require("@/assets/css/technicalAnalysis.css");

import { mapState } from 'vuex'
import Util from '@/utils/tradeDataUtil'
import { productMap, product } from "../../utils/map";
import NewsApi from "@/plugins/newsApi";
import NoData from "@/view/NoData.vue";
import moment from "moment";

export default {
  name: 'AboutNews',
  components: { NoData },
  filters: {
    time(longTime) {
      return Util.formatDate(longTime, 'yyyy-MM-dd hh:mm:ss')
    },
    timeHour(isoDate) {
      return moment(new Date(isoDate)).format("HH:mm");
    },
    nullDisplay(data) {
      return data ? data + "%" : "---";
    },
    unitDisplay(data) {
      return data ? (data == "%" ? "" : "(" + data + ")") : "";
    }
  },
  props: ["code", "goQuoteChart"],
  computed: {
    ...mapState(['quote'])
  },
  data() {
    return {
      checkids: [],
      checknames: [],
      rotate: false,
      sugshow: false,
      util: Util,
      rankedIds: [3552053],
      isShowTimeMenu: false,
      isShowInnerTimeMenu: false,
      isShowTechDetailMenu: false,
      searchTechLock: false,
      isShowTechnicalAnalysisHtml: true,
      more_btn_text: "了解更多",
      defaultTechAnalyInfo: {
        conclusion: "---",
        conclusionBg: "bg_normal", //bg_green,bg_red,bg_normal
        conclusionMAText: "---",
        conclusionMATextColor: "text_normal", //text_green,text_red,text_normal
        conclusionMABuyText: "---",
        conclusionMABuyTextColor: "text_normal",
        conclusionMASellText: "---",
        conclusionMASellTextColor: "text_normal",
        conclusionTechIndiText: "---",
        conclusionTechIndiTextColor: "text_normal", //text_green,text_red,text_normal
        conclusionTechIndiBuyText: "---",
        conclusionTechIndiBuyTextColor: "text_normal",
        conclusionTechIndiSellText: "---",
        conclusionTechIndiSellTextColor: "text_normal",
      },
      techAnalyInfo: {},
      techAnalyIndex: 0,
      techDetailTimingIndex: 2,
      techDetailTiming: [
        { timeString: "5分钟", peid: "300", identifier: "5Mins" },
        { timeString: "15分钟", peid: "900", identifier: "15Mins" },
        { timeString: "每小时", peid: "3600", identifier: "Hour" },
        { timeString: "每日", peid: "86400", identifier: "Day" },
        { timeString: "每周", peid: "week", identifier: "Week" },
        { timeString: "每月", peid: "month", identifier: "Month" },
        { timeString: "5小时", peid: "18000", identifier: "5Hours" },
        { timeString: "30分钟", peid: "1800", identifier: "30Mins" },
        { timeString: "1分钟", peid: "60", identifier: "1Min" },
      ],
      techDetailTimingSort: [
        { timeString: "5分钟", peid: "300", identifier: "5Mins" },
        { timeString: "15分钟", peid: "900", identifier: "15Mins" },
        { timeString: "每小时", peid: "3600", identifier: "Hour" },
        { timeString: "每日", peid: "86400", identifier: "Day" },
        { timeString: "每周", peid: "week", identifier: "Week" },
      ],
      techDetailTimingMenu: [
        { timeString: "每月", peid: "month", identifier: "Month" },
        { timeString: "5小时", peid: "18000", identifier: "5Hours" },
        { timeString: "30分钟", peid: "1800", identifier: "30Mins" },
        { timeString: "1分钟", peid: "60", identifier: "1Min" },
      ],
      isShowTimeMenu: false,
      productMap: productMap,
      product: product,
      initial: false,
      nodata: false,
      relateIndex: 1,
      newsArr: [],
      DCArr:[],
      calendarList:[]
    }
  },
  mounted() {
    moment.locale("zh-cn");
    this.getNews(this.code)
  },
  watch: {
    code() {
      this.relateIndex = 1
      this.nodata = false
      this.getNews(this.code)
    }
  },
  methods: {
    changeRelated(index) {
      this.nodata = false
      this.relateIndex = index

      if(index==1){
        this.getNews(this.code)
      }else if(index==2){
        this.getTechnicalAnalysisInfo(this.code)
      }else if(index==3){
        this.getPosition(this.code)
      }else if(index==4){
        this.getCalendar()
      }
      
    },
    getNews(symbol) {
      this.axios.get(process.env.VUE_APP_INFO_NEW + '/newsListByPid?callback=json&productId='+symbol+'&page=1&pageSize=7&timestamp=1643083792000').then(res => {
        if (res.data.code == 200) {
          this.newsArr = res.data.data.lists
          if (res.data.data.lists.length==0){
            this.nodata = true
          }
        }
      })
    },
    getPosition(symbol) {
      let szShortName = this.quote.notify[symbol].szShortName
      this.axios.get('https://crs.cjduse.com/public/api/getPosition?symbol='+szShortName).then(res => {
        if (res.data.code == 200) {
          this.DCArr = res.data.ch_msg
          if (res.data.ch_msg.length==0){
            this.nodata = true
          }
        }
      })
    },
    getCalendar() {
      let timestamp = new Date().getTime()
      let date = Util.formatDate(timestamp, 'yyyyMMdd')

      const params ="?callback=json&date=" + date + "&timestamp=" + timestamp;
      let data = {
        params: params,
        sign: "gmx" + date + timestamp,
      };
      NewsApi.getCalendar(data).then((res) => {
        this.calendarList = res.data.data.economics
        if (res.data.data.economics.length==0){
            this.nodata = true
        }
      });
    },
    buy(buy,sell) {
      let buypercent = Math.floor(((buy/(buy+sell)).toFixed(2))*100)

      if(buypercent ==100){
          buypercent = 75;
      }else if(buypercent>=90){
          buypercent = buypercent - 30;
      }else if(buypercent>=70){
          buypercent = buypercent - 16;
      }else if(buypercent>=60){
          buypercent = buypercent - 8;
      }else if(buypercent>=40 && buypercent<50){
          buypercent = buypercent + 8;
      }else if(buypercent>=30 && buypercent<40){
          buypercent = buypercent + 7;
      }else if(buypercent>=10 && buypercent<20){
          buypercent = buypercent + 16;
      }else if(buypercent>=0 && buypercent<10){
          buypercent = buypercent + 30;
      }
      return buypercent
    },
    sell(buy,sell) {
      let sellpercent = this.buy(buy,sell)
      return 100-Number(sellpercent)
    },
    geDetail(news) {
      this.$bus.$emit('loading', false)
      this.$router.push({
        path: '/home/NewsDetail',
        query: {
          id: news.id,
          title: ''
        }
      })
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
    getTechnicalAnalysisInfo(index) {
      if (!this.isShowTechnicalAnalysisHtml) {
        return;
      }
      this.techAnalyInfo = this.defaultTechAnalyInfo;
      let _this = this;
      this.searchTechLock = true;

      console.log('有傳入 index 為' + index,_this.techDetailTimingIndex)
      setTimeout(function() {
        let peid = _this.techDetailTiming[_this.techDetailTimingIndex].peid;
        let pid = _this.productMap[_this.code]?_this.product[_this.productMap[_this.code]].pid:1;
        _this.ajaxTech_Url(peid, pid);
      }, 300);

    },
    // 傳入產品技術分析所需 peid、pid
    ajaxTech_Url(peid, pid) {
      let _this = this;
      let data = `pid=${pid}&peid=${peid}`;
      axios
        .post("https://api.zxintgp.com/inv/currencies", data, {
          headers: { "content-type": "application/x-www-form-urlencoded" },
        })
        .then((res) => {
          let msg = res.data;
          let htmlObject = _this.parseHTML(msg);
          let htmlObject2 = _this.parseHTML(
            msg.substring(msg.indexOf("<h3"), msg.length)
          );
          _this.htmlObjectPop = htmlObject2[2];
          let newTechAnalyInfo = {};
          //conclusion
          newTechAnalyInfo.conclusion = htmlObject[0].querySelector(
            "div:nth-child(1) span"
          ).innerHTML;
          newTechAnalyInfo.conclusionBg = _this.setTechConclusionBgColor(
            newTechAnalyInfo.conclusion
          );
          newTechAnalyInfo.conclusionMAText = htmlObject[0].querySelector(
            "div:nth-child(2) span:nth-child(2)"
          ).innerHTML;
          newTechAnalyInfo.conclusionMATextColor = _this.setTechConclusionTextColor(
            newTechAnalyInfo.conclusionMAText
          );
          newTechAnalyInfo.conclusionMABuyText = htmlObject[0].querySelector(
            "div:nth-child(2) span:nth-child(3)"
          ).innerHTML;
          newTechAnalyInfo.conclusionMABuyTextColor = _this.setTechConclusionTextColor(
            newTechAnalyInfo.conclusionMABuyText
          );
          newTechAnalyInfo.conclusionMASellText = htmlObject[0].querySelector(
            "div:nth-child(2) span:nth-child(4)"
          ).innerHTML;
          newTechAnalyInfo.conclusionMASellTextColor = _this.setTechConclusionTextColor(
            newTechAnalyInfo.conclusionMASellText
          );
          newTechAnalyInfo.conclusionTechIndiText = htmlObject[0].querySelector(
            "div:nth-child(3) span:nth-child(2)"
          ).innerHTML;
          newTechAnalyInfo.conclusionTechIndiTextColor = _this.setTechConclusionTextColor(
            newTechAnalyInfo.conclusionTechIndiText
          );
          newTechAnalyInfo.conclusionTechIndiBuyText = htmlObject[0].querySelector(
            "div:nth-child(3) span:nth-child(3)"
          ).innerHTML;
          newTechAnalyInfo.conclusionTechIndiBuyTextColor = _this.setTechConclusionTextColor(
            newTechAnalyInfo.conclusionTechIndiBuyText
          );
          newTechAnalyInfo.conclusionTechIndiSellText = htmlObject[0].querySelector(
            "div:nth-child(3) span:nth-child(4)"
          ).innerHTML;
          newTechAnalyInfo.conclusionTechIndiSellTextColor = _this.setTechConclusionTextColor(
            newTechAnalyInfo.conclusionTechIndiSellText
          );
          //MA
          newTechAnalyInfo.standardMA5HTML = htmlObject2[4].querySelector(
            "tbody tr:nth-child(1) td:nth-child(2)"
          ).innerHTML;
          newTechAnalyInfo.moveMA5HTML = htmlObject2[4].querySelector(
            "tbody tr:nth-child(1) td:nth-child(3)"
          ).innerHTML;
          newTechAnalyInfo.standardMA10HTML = htmlObject2[4].querySelector(
            "tbody tr:nth-child(2) td:nth-child(2)"
          ).innerHTML;
          newTechAnalyInfo.moveMA10HTML = htmlObject2[4].querySelector(
            "tbody tr:nth-child(2) td:nth-child(3)"
          ).innerHTML;
          newTechAnalyInfo.standardMA20HTML = htmlObject2[4].querySelector(
            "tbody tr:nth-child(3) td:nth-child(2)"
          ).innerHTML;
          newTechAnalyInfo.moveMA20HTML = htmlObject2[4].querySelector(
            "tbody tr:nth-child(3) td:nth-child(3)"
          ).innerHTML;
          newTechAnalyInfo.standardMA50HTML = htmlObject2[4].querySelector(
            "tbody tr:nth-child(4) td:nth-child(2)"
          ).innerHTML;
          newTechAnalyInfo.moveMA50HTML = htmlObject2[4].querySelector(
            "tbody tr:nth-child(4) td:nth-child(3)"
          ).innerHTML;
          newTechAnalyInfo.standardMA100HTML = htmlObject2[4].querySelector(
            "tbody tr:nth-child(5) td:nth-child(2)"
          ).innerHTML;
          newTechAnalyInfo.moveMA100HTML = htmlObject2[4].querySelector(
            "tbody tr:nth-child(5) td:nth-child(3)"
          ).innerHTML;
          newTechAnalyInfo.standardMA200HTML = htmlObject2[4].querySelector(
            "tbody tr:nth-child(6) td:nth-child(2)"
          ).innerHTML;
          newTechAnalyInfo.moveMA200HTML = htmlObject2[4].querySelector(
            "tbody tr:nth-child(6) td:nth-child(3)"
          ).innerHTML;
          newTechAnalyInfo.maConcludeText =
            "&nbsp;" +
            htmlObject2[4].querySelector(
              "tbody tr:nth-child(7) p:nth-child(1) span:nth-child(1)"
            ).innerHTML +
            htmlObject2[4].querySelector(
              "tbody tr:nth-child(7) p:nth-child(1) span:nth-child(2)"
            ).innerHTML +
            "<br>" +
            "&nbsp;" +
            htmlObject2[4].querySelector(
              "tbody tr:nth-child(7) p:nth-child(2) span:nth-child(1)"
            ).innerHTML +
            htmlObject2[4].querySelector(
              "tbody tr:nth-child(7) p:nth-child(2) span:nth-child(2)"
            ).innerHTML;
          newTechAnalyInfo.maConclude = htmlObject2[4].querySelector(
            "tbody tr:nth-child(7) td p:nth-child(4) span"
          ).innerHTML;
          //Technical Indicators
          let ti = [];
          for (let i = 1; i < 13; i++) {
            let name = htmlObject2[3].querySelector(
              "tbody tr:nth-child(" + i + ") td:nth-child(1)"
            ).innerHTML;
            let info = htmlObject2[3].querySelector(
              "tbody tr:nth-child(" + i + ") td:nth-child(2)"
            ).innerHTML;
            let conclude = htmlObject2[3].querySelector(
              "tbody tr:nth-child(" + i + ") td:nth-child(3) span"
            ).innerHTML;
            ti.push({ name: name, info: info, conclude: conclude });
          }
          newTechAnalyInfo.ti = ti;
          newTechAnalyInfo.tiConcludeInfo =
            "<span>" +
            htmlObject2[3].querySelector(
              "tbody tr:nth-child(13) p:nth-child(1) span:nth-child(1)"
            ).innerHTML +
            htmlObject2[3].querySelector(
              "tbody tr:nth-child(13) p:nth-child(1) span:nth-child(2)"
            ).innerHTML +
            "<br>" +
            htmlObject2[3].querySelector(
              "tbody tr:nth-child(13) p:nth-child(2) span:nth-child(1)"
            ).innerHTML +
            htmlObject2[3].querySelector(
              "tbody tr:nth-child(13) p:nth-child(2) span:nth-child(2)"
            ).innerHTML +
            "<br>" +
            htmlObject2[3].querySelector(
              "tbody tr:nth-child(13) p:nth-child(3) span:nth-child(1)"
            ).innerHTML +
            htmlObject2[3].querySelector(
              "tbody tr:nth-child(13) p:nth-child(3) span:nth-child(2)"
            ).innerHTML +
            "</span>";
          newTechAnalyInfo.tiConclude = htmlObject2[3].querySelector(
            "tbody tr:nth-child(13) p:nth-child(5) span"
          ).innerHTML;
          _this.techAnalyInfo = newTechAnalyInfo;
          _this.searchTechLock = false;
        })
        .catch((err) => {
          console.log(err);
          _this.searchTechLock = false;
        });
    },
    parseHTML(str) {
      let tmp = document.implementation.createHTMLDocument();
      tmp.body.innerHTML = str;
      return tmp.body.children;
    },
    getTraceId() {
      return "h5_" + new Date().getTime();
    },
    setTechConclusionBgColor(str) {
      if (str == null) {
        return "bg_normal";
      }
      if (str.indexOf("卖") >= 0) {
        return "bg_red";
      } else if (str.indexOf("买") >= 0) {
        return "bg_green";
      } else {
        return "bg_normal";
      }
    },
    setTechConclusionTextColor(str) {
      if (str == null) {
        return "text_normal";
      }
      if (str.indexOf("卖") >= 0) {
        return "text_red";
      } else if (str.indexOf("买") >= 0) {
        return "text_green";
      } else {
        return "text_normal";
      }
    },
    setTechAnalyIndex(index) {
      if (!this.searchTechLock) {
        this.techAnalyIndex = index;
        this.getTechnicalAnalysisInfo(this.code);
      }
    },
    setTechDetailTimingIndex(index) {
      if (!this.searchTechLock) {
        this.techDetailTimingIndex = index;
        this.getTechnicalAnalysisInfo(this.code);
      }
    },
    switchTiming(index) {
      if (!this.searchTechLock) {
        let tempTechDedeil = {
          timeString: this.techDetailTimingMenu[index].timeString,
          peid: this.techDetailTimingMenu[index].peid,
        };

        this.techDetailTimingSort[3] = tempTechDedeil;
        this.techDetailTimingIndex = index+5;
        this.isShowTimeMenu = false;
        this.isShowInnerTimeMenu = false;
        this.getTechnicalAnalysisInfo(this.code);
      }
    },
    techButtonHandler(event, id) {
      let direction;
      if (event.target.innerHTML.includes("买入")) {
        direction = "buy";
      } else if (event.target.innerHTML.includes("卖出")) {
        direction = "sell";
      } else {
        direction = "neutral";
      }
      this.conclusionHandler(direction, id);
    },
    conclusionHandler(direction, id) {
      switch (direction) {
        case "buy":
          console.log("buy handler");
          this.$router.push({
            path: "/home/QuoteBuy",
            query: { id: id, direct: "1" },
          });
          break;
        case "sell":
          console.log("sell handler");
          this.$router.push({
            path: "/home/QuoteBuy",
            query: { id: id, direct: "2" },
          });
          break;
        case "neutral":
          this.goQuoteChart(id, this.product[this.productMap[id]].name);
          break;
      }
    }
  }
}
</script>