<template>
  <div class="suggest-analysis-group">
    <div class="suggested-news section">
      <div class="section-header">
        <p style="font-family: PingFang SC; color: #252525">行情推荐</p>
      </div>
      <div class="conList2">
        <div class="ctitlebox">
          <span
            >产品类别:
            {{
              approval_state
                ? checknames != ""
                  ? checknames.join("/")
                  : "外汇/商品/指数/数字货币/美股/港股/参考"
                : "外汇/商品/指数/美股/港股/参考"
            }}</span
          >
          <i @click="showsuggest()" :class="[rotate ? 'go' : 'goback']"></i>
        </div>

        <div class="suggest_popup_group" v-show="sugshow">
          <ul>
            <li
              v-for="item in tabs"
              :key="'quote-nav-' + item.id"
              @click="updatecheck(item.id, item.name)"
            >
              <input
                type="checkbox"
                :value="item.id"
                :class="checkids.indexOf(item.id) != -1 ? 'checked' : ''"
              />
              <label>{{ item.name }}</label>
            </li>
          </ul>
        </div>

        <div class="item">
          <p>产品名称</p>
          <p>现价</p>
          <p>投入$500可盈利</p>
        </div>

        <ul
          v-for="item in isTrueTabList"
          :key="'tabs-' + item.id"
          class="plist"
        >
          <li
            v-for="(data, index) in filteredTickList.slice(0, 5)"
            :key="'tabs-tick-' + data.uiCodeID"
            @click="goQuoteHandler(data.uiCodeID, data.symbolName)"
          >
            <span
              ><img
                :src="
                  require('@/assets/images/rankList/ranking_icon' +
                    (index + 1) +
                    '.png')
                "
                class="icon"
              />
              {{ quote.notify[data.uiCodeID].aushGB }}</span
            >
            <span :class="util.isNewP(data)">{{ data.newP }}</span>
            <span>{{ data.profit.toFixed(2) }}</span>
            <span>看行情</span>
          </li>
        </ul>
      </div>

      <div
        class="suggest_popup_bg"
        v-show="sugshow"
        @click="showsuggest()"
      ></div>
    </div>

    <!-- Technical Analysis Begin -->
    <div class="technical_analysis_content section">
      <div class="section-header">
        <p style="font-family: PingFang SC; color: #222222">技术分析</p>
      </div>
      <div
        class="tech_analysis_group"
        v-if="rankedIds.length > 0 && isShowTechnicalAnalysisHtml"
      >
        <ul class="tech_analysis_menu" id="tech_analysis_menu">
          <li
            v-for="(id, index) in rankedIds"
            :key="index"
            :class="{ selected: techAnalyIndex === index }"
            @click="setTechAnalyIndex(index)"
            :page="index + 1"
          >
            <span v-if="id === '573014'">美国<br />TECH100</span>
            <span v-else>{{ product[productMap[id]].name }}</span>
          </li>
        </ul>

        <ul class="tech_analysis_data" id="tech_analysis_data">
          <li class="selected">
            <p class="more_btn" @click="showMore" v-html="more_btn_text">
              了解更多
            </p>
            <h1 v-if="product[productMap[rankedIds[techAnalyIndex]]]">
              {{ product[productMap[rankedIds[techAnalyIndex]]].name }}
            </h1>
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
                <!--<button @click.stop="isShowTimeMenu=!isShowTimeMenu;" @blur="isShowTimeMenu=!isShowTimeMenu;"><i></i></button>-->
                <div class="other_menu_container">
                  <template v-for="(e, index) in techDetailTimingMenu">
                    <span :key="index" @click="switchTiming(index)">{{
                      e.timeString
                    }}</span>
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
          </li>
        </ul>
        <p class="source_text"><span>來源:investing.com</span></p>
      </div>
      <!-- End of Tech Analysis main content -->
      <transition name="fade">
        <div
          class="tech_analysis_popup"
          id="tech_analysis_popup"
          v-if="isShowTechDetailMenu"
        >
          <div class="tech_analysis_popup_content">
            <div class="tech_analysis_time_menu" id="tech_analysis_time_menu">
              <template v-for="(e, index) in techDetailTimingSort">
                <span
                  :key="index"
                  v-bind:class="{ selected: index === techDetailTimingIndex }"
                  @click="setTechDetailTimingIndex(index)"
                  >{{ e.timeString }}</span
                >
              </template>
              <div
                :class="{ show: isShowInnerTimeMenu }"
                class="other_menu"
                id="tech_analysis_other_menu"
              >
                <i @click="isShowInnerTimeMenu = !isShowInnerTimeMenu"></i>
                <p>
                  <template v-for="(e, index) in techDetailTimingMenu">
                    <span :key="index" @click="switchTiming(index)">{{
                      e.timeString
                    }}</span>
                  </template>
                </p>
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
                    :class="techAnalyInfo.conclusionBg"
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
                            setTechConclusionBgColor(
                              techAnalyInfo.moveMA100HTML
                            )
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
                            setTechConclusionBgColor(
                              techAnalyInfo.moveMA200HTML
                            )
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
                            }}<br />&nbsp;</span
                          >
                        </p>
                      </td>
                    </tr>
                  </table>
                </li>
              </ul>
            </div>
            <p
              class="tech_analysis_popup_close"
              @click="
                isShowTechDetailMenu = false;
                isShowInnerTimeMenu = false;
                removeFixed();
              "
            ></p>
          </div>
          <!-- /tech_analysis_popup_content-->
        </div>
      </transition>
      <!-- /tech_analysis_popup-->
    </div>
  </div>
</template>

<script>
require("@/assets/css/SuggestedNews.css");
require("@/assets/css/technicalAnalysis.css");
import { mapState } from "vuex";
import Util from "@/utils/tradeDataUtil";
import productCode from "@/utils/productCode";
import { productMap, product } from "@/utils/map";
import {
  isApp,
  appQuoteIndexMore,
  appGetQuoteCode,
  appGoToOrder,
  appIframeHeight,
} from "@/utils/appHybrid";

export default {
  name: "SuggestTechnical",
  data() {
    return {
      approval_state: true,
      checkids: [],
      checknames: [],
      suggestIDs: JSON.parse(process.env.VUE_APP_SUGGEST),
      tabs: JSON.parse(process.env.VUE_APP_TICKLIST),
      isTrue: Number(this.$route.query.tabIndex) || 0,
      rotate: false,
      sugshow: false,
      util: Util,
      rankedIds: [],
      // technical analysis data
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
        { timeString: "1分钟", peid: "60", identifier: "1Min" },
        { timeString: "30分钟", peid: "1800", identifier: "30Mins" },
        { timeString: "5小时", peid: "18000", identifier: "5Hours" },
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
    };
  },
  computed: {
    ...mapState(["quote", "user"]),
    isTrueTabList() {
      //console.log(this.tabs.filter((ele, index) => this.isTrue === index))
      return this.tabs.filter((ele, index) => this.isTrue === index);
    },
    filteredTickList() {
      var filt2arr = [];

      if (this.checkids.length) {
        filt2arr = this.quote.tickList.filter((ele) => {
          return (
            this.Product(ele) &&
            this.checkids.includes(
              this.quote.notify[ele.uiCodeID].searchflag
            ) &&
            productMap[ele.uiCodeID] in product
          );
        });
        // console.log(filt2arr)
      } else {
        //var tk = this.quote.tickList.filter(tick => this.uiCodeIDs.includes(tick.uiCodeID))
        filt2arr = this.quote.tickList.filter((tick) =>
          this.suggestIDs.includes(tick.uiCodeID)
        );
      }

      // Filter out crypto products
      if (!this.approval_state) {
        filt2arr = filt2arr.filter(
          (el) => this.quote.notify[el.uiCodeID].searchflag != 6
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
      if (resultArr.length > 0) {
        const rankedIds = [];
        const lengthRestriction = Math.min(resultArr.length, 5);
        for (let i = 0; i < lengthRestriction; i++) {
          rankedIds.push(resultArr[i].uiCodeID);
        }

        this.rankedIds = rankedIds;
        // console.log(rankedIds);

        if (!this.initial) {
          this.initial = true;
          this.getTechnicalAnalysisInfo();
        }
      }
      return resultArr;
    },
  },
  methods: {
    removeFixed() {
      let body;
      if (document.documentElement) {
        body = document.documentElement;
      } else if (document.body) {
        body = document.body;
      }
      body.classList.remove("mainFixed");
    },
    toggleFixed() {
      let body;
      if (document.documentElement) {
        body = document.documentElement;
      } else if (document.body) {
        body = document.body;
      }
      body.classList.toggle("mainFixed");
      if (body.clientWidth > 750) {
        body.style.left = (body.clientWidth - 750) / 2 + "px";
      }
    },
    showMore() {
      if (isApp()) {
        appQuoteIndexMore(
          this.techDetailTiming[this.techDetailTimingIndex].peid,
          this.product[this.productMap[this.rankedIds[this.techAnalyIndex]]]
            .pid,
          this.rankedIds[this.techAnalyIndex]
        );
      } else {
        // this.toggleFixed();
        this.isShowTimeMenu = false;
        this.isShowTechDetailMenu = true;
      }
    },
    showsuggest() {
      this.rotate = !this.rotate;
      this.sugshow = !this.sugshow;
    },
    updatecheck(id, name) {
      if (this.checkids.includes(id)) {
        //var idsnum = this.checkids.length
        this.checkids = this.checkids.filter((t) => t != id);
        this.checknames = this.checknames.filter((tn) => tn != name);
      } else {
        this.checkids.push(id);
        this.checknames.push(name);
      }
    },
    goQuoteHandler(id, name) {
      console.log(name);
      if (isApp()) {
        appGetQuoteCode(id);
      } else {
        this.goQuoteChart(id, name);
      }
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
    sortByRate(i) {
      return function (a, b) {
        //return Math.abs(((b.newP - b.preclose) / b.preclose) * 100) - Math.abs(((a.newP - a.preclose) / a.preclose) * 100)
        return b[i] - a[i];
      };
    },
    Product(obj) {
      if (obj.uiCodeID in this.quote.notify) {
        if ((this.user.loginname && obj.symbolData) || !this.user.loginname) {
          return true;
        }
      }
      return false;
    },
    // tech analysis methods
    getTechnicalAnalysisInfo(index) {
      if (!this.isShowTechnicalAnalysisHtml) {
        return;
      }
      if (this.rankedIds.length <= 0) {
        return;
      }
      this.techAnalyInfo = this.defaultTechAnalyInfo;
      let _this = this;
      this.searchTechLock = true;

      if (index === undefined) {
        // //console.log('未傳入 index')
        setTimeout(function () {
          let peid = _this.techDetailTiming[_this.techDetailTimingIndex].peid;
          let pid =
            _this.product[
              _this.productMap[_this.rankedIds[_this.techAnalyIndex]]
            ].pid;
          _this.ajaxTech_Url(peid, pid);
        }, 0);
      } else {
        // //console.log('有傳入 index 為' + index)
        setTimeout(function () {
          let peid = _this.techDetailTimingMenu[index].peid;
          let pid =
            _this.product[
              _this.productMap[_this.rankedIds[_this.techAnalyIndex]]
            ].pid;
          _this.ajaxTech_Url(peid, pid);
        }, 300);
      }
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
          newTechAnalyInfo.conclusionMATextColor =
            _this.setTechConclusionTextColor(newTechAnalyInfo.conclusionMAText);
          newTechAnalyInfo.conclusionMABuyText = htmlObject[0].querySelector(
            "div:nth-child(2) span:nth-child(3)"
          ).innerHTML;
          newTechAnalyInfo.conclusionMABuyTextColor =
            _this.setTechConclusionTextColor(
              newTechAnalyInfo.conclusionMABuyText
            );
          newTechAnalyInfo.conclusionMASellText = htmlObject[0].querySelector(
            "div:nth-child(2) span:nth-child(4)"
          ).innerHTML;
          newTechAnalyInfo.conclusionMASellTextColor =
            _this.setTechConclusionTextColor(
              newTechAnalyInfo.conclusionMASellText
            );
          newTechAnalyInfo.conclusionTechIndiText = htmlObject[0].querySelector(
            "div:nth-child(3) span:nth-child(2)"
          ).innerHTML;
          newTechAnalyInfo.conclusionTechIndiTextColor =
            _this.setTechConclusionTextColor(
              newTechAnalyInfo.conclusionTechIndiText
            );
          newTechAnalyInfo.conclusionTechIndiBuyText =
            htmlObject[0].querySelector(
              "div:nth-child(3) span:nth-child(3)"
            ).innerHTML;
          newTechAnalyInfo.conclusionTechIndiBuyTextColor =
            _this.setTechConclusionTextColor(
              newTechAnalyInfo.conclusionTechIndiBuyText
            );
          newTechAnalyInfo.conclusionTechIndiSellText =
            htmlObject[0].querySelector(
              "div:nth-child(3) span:nth-child(4)"
            ).innerHTML;
          newTechAnalyInfo.conclusionTechIndiSellTextColor =
            _this.setTechConclusionTextColor(
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
        this.getTechnicalAnalysisInfo();
      }
    },
    setTechDetailTimingIndex(index) {
      if (!this.searchTechLock) {
        this.techDetailTimingIndex = index;
        this.getTechnicalAnalysisInfo();
      }
    },
    switchTiming(index) {
      if (!this.searchTechLock) {
        let tempTechDedeil = {
          timeString: this.techDetailTimingMenu[index].timeString,
          peid: this.techDetailTimingMenu[index].peid,
        };

        this.techDetailTimingSort[3] = tempTechDedeil;
        this.techDetailTimingIndex = 3;
        this.isShowTimeMenu = false;
        this.isShowInnerTimeMenu = false;
        this.getTechnicalAnalysisInfo(index);
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
      if (isApp()) {
        appGoToOrder(direction, id);
      } else {
        this.conclusionHandler(direction, id);
      }
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
    },
    docHeightHandler() {
      setTimeout(() => {
        const innerHeight = document.querySelector(
          ".suggest-analysis-group"
        ).clientHeight;
        console.log(innerHeight);
        const elements = document.querySelectorAll("html, body, #main");
        [...elements].forEach((ele) => {
          ele.style.height = "auto";
        });
        if (isApp()) {
          appIframeHeight(innerHeight);
        }
      }, 1000);
    },
  },
  mounted() {
    // Set html, body and #main's height back to auto if this route is loading independently;
    if (this.$route.path == "/home/SuggestTechnical") {
      console.log("send height to app");
      this.docHeightHandler();
    }

    // Add pre-approved show / hide logic
    if (this.$route.query.app && this.$route.query.app == "gm01") {
      // Filter out crypto products
      this.tabs = this.tabs.filter((tab) => tab.id != 6);
      console.log(this.tabs);
      this.approval_state = false;
    }
  },
};
</script>

<style></style>
