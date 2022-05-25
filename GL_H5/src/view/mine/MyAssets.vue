<template>
  <div class="my-assets" @click.stop="accountTypeSwticherActive = false">
    <div class="overview flex-h">
      <img
        src="@/assets/images/mine/mine_icon.png"
        alt="mine_icon"
        class="mine-icon"
      />
      <div class="assets-summary flex-c">
        <p class="title">我的资产</p>
        <div
          v-if="user.loginType"
          class="account-switch flex-h"
          :class="accountTypeSwticherActive ? 'active' : ''"
          @click.stop="accountTypeSwticherActive = !accountTypeSwticherActive"
        >
          <p
            v-if="
              account.accountNo ||
                (user.loginname && user.loginname.toString().startsWith('98'))
            "
          >
            {{ accountType == "demo" ? "模拟账户" : "真实账户" }}
          </p>
          <p v-else>---</p>
          <van-icon name="arrow-down" color="#FE6A1A" size="12" />
          <div class="account-type-switcher" @click="handleSwitchAccount">
            <p>{{ accountTypeSwitcherText }}</p>
          </div>
        </div>
        <div class="assets-amount flex-h">
          <p class="dollar-sign">$</p>
          <p>{{ account.equity ? account.equity : "--" }}</p>
        </div>
        <div class="supp-info">
          <!-- <p class="account-no" v-if="account.accountNo">
            {{ account.accountNo }}
          </p> -->
          <p class="account-no" v-if="user.loginname">
            {{ user.loginname }}
          </p>
          <p v-else>您好，请先登录</p>
        </div>
      </div>
    </div>
    <div class="assets-overview-container" v-if="user.loginname">
      <div class="assets-overview-link flex-h" @click="openAssetOverlay">
        <p>账户总览($)</p>

        <van-icon name="arrow" color="#fff" size="12" />
      </div>
      <div class="balance-credit flex-h">
        <div class="balance flex-c">
          <p class="balance-amount">
            {{ account.balance ? account.balance : "---" }}
          </p>
          <p>账户余额($)</p>
        </div>
        <div class="credit flex-c">
          <p class="credit-amount">
            {{ account.available ? account.available : "---" }}
          </p>
          <p>可用保证金($)</p>
        </div>
      </div>
    </div>
    <div class="btns-group flex-h">
      <template v-if="user.loginType == 'A' || user.loginType == 'N'">
        <div class="btn btn-left" @click="gotoWithdrawal">出金</div>
        <div class="btn btn-right" @click="gotoDeposit">入金</div>
      </template>
      <template v-else-if="user.loginType == 'D'">
        <div class="to-real-switch" @click="handleSwitchAccount">
          切换到真实账户
        </div>
      </template>
      <template v-else>
        <div class="btn btn-left" @click="gotoRegister">开户</div>
        <div class="btn btn-right" @click="gotoLogin">登录</div>
      </template>
    </div>
    <Popup
      :visible="popupVisible"
      :title="'提示'"
      :content="'你好！</br>真实账户才能操作, 请先补充资料'"
      :cancelText="'关闭'"
      :continueText="'补充资料'"
      :cancelHandler="closePopup"
      :continueHandler="gotoSuppInfo"
    />
    <van-popup
      v-model="showAssetOverlay"
      class="assets-overlay-container"
      position="top"
      :style="{ height: 'auto', overflowY: 'hidden' }"
      round
    >
      <div
        class="assets-overlay"
        @click.stop="overlayAccountTypeSwticherActive = false"
      >
        <section class="heading">
          <p>我的资产</p>
          <div
            v-if="user.loginType"
            class="account-switch flex-h"
            :class="overlayAccountTypeSwticherActive ? 'active' : ''"
            @click.stop="
              overlayAccountTypeSwticherActive = !overlayAccountTypeSwticherActive
            "
          >
            <p
              v-if="
                account.accountNo ||
                  (user.loginname && user.loginname.toString().startsWith('98'))
              "
            >
              {{ accountType == "demo" ? "模拟账户" : "真实账户" }}
            </p>
            <p v-else>---</p>
            <van-icon name="arrow-down" color="#007AFF" size="12" />
            <div
              class="account-type-switcher"
              @click.stop="overlayAccountSwitch"
            >
              <p>{{ accountTypeSwitcherText }}</p>
            </div>
          </div>
        </section>
        <section class="margin-level">
          <div class="head flex-h">
            <p>保证金水平</p>
            <p class="margin-percent">{{ marginPercent }}%</p>
          </div>
          <van-progress
            :percentage="marginPercent"
            stroke-width="8"
            v-if="showAssetOverlay"
            :show-pivot="false"
            :color="'#1ab46a'"
          />
        </section>
        <section class="capital-content">
          <p>资金成分 <span>(单位:美元)</span></p>
          <div class="doughnut-chart equity">
            <div id="equity-chart"></div>
            <div class="chart-text">
              <p class="title">净值</p>
              <p class="equity-amount">
                {{ netBalance }}
              </p>
            </div>
          </div>
        </section>
        <section class="capital-summary flex-h">
          <div class="net flex-c">
            <p class="description"><span class="legend-color"></span>盈亏</p>
            <p class="amount">{{ profitTotal === 0 ? '0.00' : profitTotal }}</p>
          </div>
          <div class="available-margin flex-c">
            <p class="description">
              <span class="legend-color"></span>可用保证金
            </p>
            <p class="amount">
              {{ account.available ? account.available : "---" }}
            </p>
          </div>
          <div class="dedicated-margin flex-c">
            <p class="description">
              <span class="legend-color"></span>占用保证金
            </p>
            <p class="amount">{{ account.margin ? account.margin : "---" }}</p>
          </div>
        </section>
        <div class="deposit-btn" @click="gotoDeposit">入金</div>
      </div>
      <img
        class="collapse-icon"
        src="@/assets/images/news/collapse.png"
        alt="collapse"
        @click.self="showAssetOverlay = false"
      />
    </van-popup>
  </div>
</template>

<script>
require("@/assets/css/assetsOverlay.css");
import { mapState } from "vuex";
import api from "@/plugins/api";
import Popup from "@/components/ui/Popup.vue";
import * as echarts from "echarts";
import Util from "@/utils/tradeDataUtil";
import TradeUtil from "@/utils/tradeUtil";
const u = navigator.userAgent
export default {
  name: "MyAssets",
  components: { Popup },
  data() {
    return {
      frontoffice: process.env.VUE_APP_FRONTOFFICE,
      accountTypeSwticherActive: false,
      overlayAccountTypeSwticherActive: false,
      popupVisible: false,
      showAssetOverlay: false,
      equityChart: null,
      u: navigator.userAgent,
      isAndroid: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
      isIOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    };
  },
  computed: {
    ...mapState(["account", "user", "tradeData", "quote"]),
    accountType() {
      let returnType = "---";
      if (
        (this.account.accountNo && this.user.loginType) ||
        (this.user.loginname && this.user.loginname.toString().startsWith("98"))
      ) {
        returnType = this.user.loginType == "D" ? "demo" : "real";
      }
      return returnType;
    },
    accountTypeSwitcherText() {
      return this.user.loginType == "D" ? "真实账户" : "模拟账户";
    },
    /* 盈亏*/
    profitTotal: {
      get() {
        if (this.tradeData.position.length <= 0) return 0;
        const data = this.tradeData.position;
        let total = 0.0;
        for (const i in data) {
          if (!this.quote.symbolTickMap[data[i].SName.szShortName]) return null;
          let sub = 0;
          if (data[i].Direction == 1) {
            // 买
            sub = Util.accSub(
              this.quote.symbolTickMap[data[i].SName.szShortName].ask,
              data[i].OpenPrice
            );
          } else {
            sub = Util.accSub(
              data[i].OpenPrice,
              this.quote.symbolTickMap[data[i].SName.szShortName].bid
            );
          }
          const profit = TradeUtil.changeCurrency(
            sub,
            this.quote.symbolTickMap[data[i].SName.szShortName].ask,
            this.quote.symbolTickMap[data[i].SName.szShortName].bid,
            data[i].Volume,
            data[i].symbolData,
            this.quote.symbolTickMap,
            data[i].Direction
          );
          total = Util.accAdd(total, profit);
          total = Util.accAdd(total, data[i].Swap);
        }
        return Number(total).toFixed(2);
      },
    },
    netBalance: {
      get() {
        //return this.account.balance
        return this.account.balance
          ? Number(Util.accAdd(this.account.balance, this.profitTotal)).toFixed(
              2
            )
          : "--";
      },
    },
    marginPercent() {
      return this.account.available &&
        this.account.available != 0 &&
        this.account.margin
        ? (
            (Number(this.account.available) /
              Number(
                Util.accAdd(this.account.available, this.account.margin)
              )) *
            100
          ).toFixed(2)
        : 0;
    },
  },
  methods: {
    overlayAccountSwitch() {
      this.overlayAccountTypeSwticherActive = false;
      this.showAssetOverlay = false;
      this.handleSwitchAccount();
    },
    openAssetOverlay() {
      this.showAssetOverlay = true;
      // Add nextTick to ensure DOM is ready for initiating the chart
      this.$nextTick(() => {
        this.drawChart();
      });
    },
    drawChart() {
      const chartDom = document.getElementById("equity-chart");
      const equityChart = echarts.init(chartDom);
      const chartOptions = {
        color: ["#f72c4d", "#fe6a1a", "#007aff"],
        tooltip: {
          show: false,
          trigger: "item",
        },
        legend: {
          show: false,
          top: "5%",
          left: "center",
        },
        animation: true,
        series: [
          {
            name: "Equity Chart",
            type: "pie",
            radius: ["70%", "80%"],
            avoidLabelOverlap: true,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: false,
                fontSize: "40",
                fontWeight: "bold",
              },
            },
            silent: true,
            labelLine: {
              show: false,
            },
            data: [
              { value: this.profitTotal, name: "盈亏" },
              { value: this.account.available, name: "可用保证金" },
              { value: this.account.margin, name: "占用保证金" },
            ],
          },
        ],
      };
      chartOptions && equityChart.setOption(chartOptions);
    },
    handleSwitchAccount() {
      console.log("in handle switch account");
      //?mobilePhone=18000002996&password=abcd1234&userType=real
      const params =
        "?mobilePhone=" +
        this.user.mobilePhone +
        "&password=" +
        this.user.pwd +
        "&userType=" +
        this.accountType;
      api
        .switchAccount(params)
        .then((res) => {
          console.log(res);
          if (res.data.result == "0") {
            // 0 = have related account and can directly switch
            // success, reload page with new user
            let loginType = "";
            if (res.data.type == "real_to_demo") {
              loginType = "D";
            } else {
              loginType = res.data.accountStatusCode;
            }
            const user = {
              loginname: res.data.customerNumber,
              pwd: this.user.pwd,
              companyId: res.data.companyId,
              uuid: res.data.uuid,
              mobilePhone: this.user.mobilePhone,
              loginType: loginType,
            };
            sessionStorage.setItem("userInfo", JSON.stringify(user));
            this.$toast("账户切换成功, 页面即将刷新");

            setTimeout(() => {
              this.$store.dispatch("setUser", user);
              this.$router.go(0); // 刷新页面，实现socket重连
            }, 2000);
          } else if (res.data.result == "11") {
            // 11 = no related demo account, created one and switch
            const user = {
              loginname: res.data.customerInfo.customerNumber,
              pwd: this.user.pwd,
              companyId: this.user.companyId,
              uuid: this.user.uuid,
              mobilePhone: this.user.mobilePhone,
              loginType: "D",
            };
            sessionStorage.setItem("userInfo", JSON.stringify(user));
            this.$toast("成功注册模拟账户, 页面即将刷新");

            setTimeout(() => {
              this.$store.dispatch("setUser", user);
              this.$router.go(0); // 刷新页面，实现socket重连
            }, 2000);
          } else if (res.data.result == "21") {
            // demo to real but no related real account
            this.popupVisible = true;
          } else {
            // failed
            this.$toast(res.data.message);
          }
        })
        .catch((err) => {
          this.$toast(res.data.message);
        });
    },
    gotoWithdrawal() {
      this.$bus.$emit("loading", false);
      if (this.isIOS) {
        const data = {
          params: {
            weblinkId: 'PCUI_DEPOSIT',
            platTypeKey: 'webui',
            customerNumber: this.user.loginname,
            password: this.user.pwd
          }
        }
        api.getUserCenterToken(data).then(res => {
          if (res.data.code == 'success') {
            const url = this.frontoffice + '/rgsLogin.rgs?platform=GTS2&testPlatform=mb&lang=zh_CN&token='+res.data.token+'&service=' + encodeURIComponent(this.frontoffice) + '%2FfundDrawings%2Edo%3FfundType%3Dnew%26version%3D191%26terminal%3Dios'
            setTimeout(() => {
              this.$bus.$emit("loading", true);
              window.open(url,"_blank")
            }, 500);
          }
        })
      }else{
        this.$router.push({
          path: "/home/UserCenter",
          query: { action: "fund", num: 1, title: "出金"}
        });
      }
    },
    gotoDeposit() {
      this.$bus.$emit("loading", false);

      if (this.isIOS) {
        const data = {
          params: {
            weblinkId: 'PCUI_DEPOSIT',
            platTypeKey: 'webui',
            customerNumber: this.user.loginname,
            password: this.user.pwd
          }
        }
        api.getUserCenterToken(data).then(res => {
          if (res.data.code == 'success') {
            const url = this.frontoffice + '/rgsLogin.rgs?platform=GTS2&testPlatform=mb&lang=zh_CN&token='+res.data.token+'&service=' + encodeURIComponent(this.frontoffice) + '%2FfundDepositOnline%2Edo%3FfundType%3Dnew%26version%3D191%26terminal%3Dios'
            setTimeout(() => {
              this.$bus.$emit("loading", true);
              window.open(url,"_blank")
            }, 500);
          }
        })
      }else{
        this.$router.push({
        path: "/home/UserCenter",
        query: { action: "fund", num: 2, title: "入金"}
      });
      }
    },
    gotoRegister() {
      this.$router.push({
        path: "/register",
      });
    },
    gotoLogin() {
      this.$router.push({
        path: "/login",
      });
    },
    closePopup() {
      this.popupVisible = false;
    },
    gotoSuppInfo() {
      this.$router.push({
        path: "/SupplementaryInfo",
      });
    },
  },
};
</script>

<style>
.account-switch i.van-icon-arrow-down {
  margin-left: 0.05rem;
  transition: all 0.4s ease-in-out;
}
.account-switch.active i.van-icon-arrow-down {
  transform: rotateZ(180deg);
}
.account-switch {
  width: 1.7rem;
  height: 0.48rem;
  border-radius: 0.3rem;
  text-align: center;
  line-height: 0.48rem;
  font-size: 0.28rem;
  font-family: PingFang SC Medium;
  background-color: #fff;
  position: absolute;
  top: 0;
  right: 0;
}
.my-assets .overview .assets-summary .account-switch p {
  color: #fe6a1a;
}
.account-type-switcher {
  position: absolute;
  width: 1.7rem;
  height: 0.48rem;
  line-height: 0.48rem;
  background-color: #fff;
  border-radius: 0.1rem;
  top: 0.8rem;
  visibility: hidden;
  opacity: 0;
  transition: all 0.4s ease-in-out;
}
.account-switch.active .account-type-switcher {
  opacity: 1;
  visibility: visible;
}
.account-type-switcher:after {
  content: "";
  position: absolute;
  top: -0.13333rem;
  right: 47%;
  margin-left: -0.06667rem;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0.13333rem 0.13333rem 0.13333rem;
  border-color: transparent transparent #fff transparent;
  -webkit-transform: translateX(0.06667rem);
  transform: translateX(0.06667rem);
}
.assets-summary .supp-info {
  border-radius: 0.25rem;
  background-color: rgba(255, 255, 255, 0.1);
  width: 1.98rem;
  height: 0.37rem;
  line-height: 0.37rem;
  text-align: center;
}
.assets-overview-container {
  color: #fff;
  width: 100%;
}
.assets-overview-link {
  font-size: 0.28rem;
  font-family: PingFang SC Heavy;
  margin: 0 0.5rem;
}
.assets-overview-link p {
  flex: 1;
}
.balance-credit {
  justify-content: space-evenly;
  margin: 0.36rem auto 0.56rem;
}
.balance-credit .balance-amount,
.balance-credit .credit-amount {
  font-size: 0.4rem;
  font-family: SFProText;
  font-weight: bold;
}
.balance-credit .balance p,
.balance-credit .credit p {
  font-size: 0.28rem;
  font-family: PingFang SC Heavy;
}

.to-real-switch {
  width: 6.24rem;
  height: 0.7rem;
  line-height: 0.7rem;
  text-align: center;
  border-radius: 0.55rem;
  background-color: #ffc53a;
  color: #fff;
  font-size: 0.31rem;
  font-family: PingFang SC Heavy;
  font-weight: bold;
}
</style>
