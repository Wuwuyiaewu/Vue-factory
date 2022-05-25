<template>
  <div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
import SocketIO from "socket.io-client";
import { mapState } from "vuex";
import Store from "@/store";
import AccountUtil from "@/utils/accountUtil";
import TradeUtil from "@/utils/tradeUtil";
import Constant from "@/utils/Constant";
import QuoteUtil from "@/utils/quoteUtil";
import api from "@/plugins/api";

export default {
  // vue项目中建议用(param)=>{} 替代 function(param){},这样this不会指向function本身;
  name: "InitData",
  data() {
    return {
      offlinePop: false,
      quoteState: true, // 是否允许行情服务器去登录
      quoteConnectThread: 0, // 行情服务器尝试连接数
      tradeState: true, // 是否允许交易服务器去登录
      tradeConnectThread: 0, // 交易服务器尝试连接数
      initQuote: false, // 行情服务器连接成功
      initTrade: false, // 交易服务器连接成功
      loginFailed: false,
      errMessage: "",
    };
  },
  computed: {
    ...mapState([
      "quote",
      "socket",
      "account",
      "group",
      "symbolInfo",
      "tradeData",
      "user",
      "loginType",
      "priceColorType",
    ]),
  },
  beforeCreate() {
    /* //交易socket,socket不存在或断开时
            if ((Store.state.user.loginname && !Store.state.socket.tradeSocket) || (Store.state.socket.tradeSocket && !Store.state.socket.tradeSocket.connected)) {
                //新建socket
                if (String(Store.state.user.loginname).startsWith("8")) Store.dispatch("setTradeSocket", SocketIO(process.env.VUE_APP_TRADE_REAL));//真实
                else Store.dispatch("setTradeSocket", SocketIO(process.env.VUE_APP_TRADE_DEMO));//模拟
            }*/
    // 行情服务器
    if (
      !Store.state.socket.quoteSocket ||
      (Store.state.socket.quoteSocket &&
        !Store.state.socket.quoteSocket.connected)
    ) {
      if (
        !Store.state.user.loginname ||
        String(Store.state.user.loginname).startsWith("68")
      ) {
        console.log("real", Store.state.user.loginname);
        Store.dispatch(
          "setQuoteSocket",
          SocketIO(process.env.VUE_APP_QUOTE_REAL, {
            path: "",
            transports: ["websocket", "polling"],
          })
        );
      } else {
        console.log("demo", Store.state.user.loginname);
        Store.dispatch(
          "setQuoteSocket",
          SocketIO(process.env.VUE_APP_QUOTE_DEMO, {
            path: "",
            transports: ["websocket", "polling"],
          })
        );
      }
    } // 外网
  },
  created() {
    // 初始化行情数据
    this.quoteSocketInit();
  },
  mounted() {
    /* //行情字典处理完成，接收交易数据
    if (this.socket.tradeSocket) this.tradeSocketInit();*/
    // 定时刷新用户状态
    // this.flushUuid()
    // setInterval(() => {
    //   this.flushUuid()
    // }, 10 * 60 * 1000)
  },
  methods: {
    removeFixed() {
      const mainH = document.getElementById("main");
      mainH.classList.remove("mainFixed");
    },
    toggleFixed() {
      let body;
      if (document.documentElement) {
        body = document.documentElement;
      } else if (document.body) {
        body = document.body;
      }
      const mainH = document.getElementById("main");
      mainH.classList.toggle("mainFixed");
      if (body.clientWidth > 750) {
        mainH.style.left = (body.clientWidth - 750) / 2 + "px";
      }
    },
    createQuoteSocket() {
      /* //交易socket,socket不存在或断开时
            if ((Store.state.user.loginname && !Store.state.socket.tradeSocket) || (Store.state.socket.tradeSocket && !Store.state.socket.tradeSocket.connected)) {
                //新建socket
                if (String(Store.state.user.loginname).startsWith("8")) Store.dispatch("setTradeSocket", SocketIO(process.env.VUE_APP_TRADE_REAL));//真实
                else Store.dispatch("setTradeSocket", SocketIO(process.env.VUE_APP_TRADE_DEMO));//模拟
            }*/
      // 行情服务器
      if (
        !Store.state.socket.quoteSocket ||
        (Store.state.socket.quoteSocket &&
          !Store.state.socket.quoteSocket.connected)
      ) {
        if (
          !Store.state.user.loginname ||
          String(Store.state.user.loginname).startsWith("68")
        ) {
          console.log("real", Store.state.user.loginname);
          Store.dispatch(
            "setQuoteSocket",
            SocketIO(process.env.VUE_APP_QUOTE_REAL, {
              path: "",
              transports: ["websocket", "polling"],
            })
          );
        } else {
          console.log("demo", Store.state.user.loginname);
          Store.dispatch(
            "setQuoteSocket",
            SocketIO(process.env.VUE_APP_QUOTE_DEMO, {
              path: "",
              transports: ["websocket", "polling"],
            })
          );
        }
      } // 外网

      // Also resign in user
      this.socket.quoteSocket.emit(
        "addme",
        this.user.loginname || "Guest",
        this.user.pwd || "Guest",
        // this.user.companyId || 128
        128
      );
    },
    quoteSocketInit() {
      console.log("in quote socket init");
      this.socket.quoteSocket.on("connect", (param, data) => {
        console.log("in quote socket init on connect");
        const thread = ++this.quoteConnectThread;
        console.log(thread);
        if (this.quoteState) {
          this.quoteState = false;
        }
        // 登录行情服务器
        setTimeout(() => {
          if (thread > 1) {
            // return
            // socket disconnected, refresh the page to reconnect
            console.log("in thread > 1 block");
            this.$router.go(0);
          }
          console.log(
            new Date().getTime() + ":行情socket连接成功(" + thread + ")"
          );
          this.socket.quoteSocket.emit(
            "addme",
            this.user.loginname || "Guest",
            this.user.pwd || "Guest",
            // this.user.companyId || 128
            128
          );
          console.log(this.user);
        }, 10);
        this.initQuote = true;
      });
      this.socket.quoteSocket.on("HeartBeat", (param, data) => {
        this.socket.quoteSocket.emit("Pong", { beat: 1 });
      });
      this.socket.quoteSocket.on("tick", (param, data) => {
        // 此处有坑，请注意（判断报价时间，过滤掉上一口报价的重复推送）
        QuoteUtil.updateTickList(param, data, this.quote.tickList);
        Store.dispatch("setQuoteTickList", this.quote.tickList);
      });
      // 数据字典
      this.socket.quoteSocket.on("init_prd_notify", (param, data) => {
        if (param.Code != 0) return;
        const notifyData = QuoteUtil.initNotify(param, data);
        Store.dispatch("setQuoteNotify", notifyData);
        // 字典数据初始化完成，加载交易数据
        this.initTradeData();
        // 订阅数据字典有的数据
        // console.log("in init prd notify")
        // console.log(this.account.userId);
        // console.log(this.account.groupId);
        this.socket.quoteSocket.emit("request", Number(Constant.Req.subsTick), {
          UserID: this.account.userId,
          GroupID: this.account.groupId,
          // uiCodeIDList: JSON.parse(process.env.VUE_APP_PRODUCTS)
          uiCodeIDList: Object.keys(notifyData).map((key) => Number(key)),
        });
        // // 分页请求数据字典中数据的最后一口报价(个人猜测:一次请求产品不能超过15个,否则请求失效)
        // // const symbolCodes = obj.symbolCodes
        var page = 0;
        var lastTick = [];
        Object.keys(notifyData).forEach((codeId) => {
          lastTick[page++] = codeId;
          if (page >= 15) {
            this.socket.quoteSocket.emit(
              "request",
              Number(Constant.Req.lastTick),
              lastTick
            );
            page = 0;
            lastTick = [];
          }
        });
        if (page > 0) {
          this.socket.quoteSocket.emit(
            "request",
            Number(Constant.Req.lastTick),
            lastTick
          );
        }
      });
      // K图行情历史数据
      // this.socket.quoteSocket.on("quote_query", (param, data) => {
      //   const seq = param.seq;
      //   if (String(param.seq).length != 10) {
      //     let history = [];
      //     for (const i in data) {
      //       history.push(data[i]);
      //     }
      //     history.reverse();
      //     if (String(param.seq).endsWith("2")) {
      //       history = TradeUtil.transKcharts(1, history);
      //     } else if (String(param.seq).endsWith("3")) {
      //       history = TradeUtil.transKcharts(2, history);
      //     } else if (
      //       String(param.seq).endsWith("9") &&
      //       String(param.seq).length == 8
      //     ) {
      //       history = TradeUtil.kLineDataGroup(history, 1);
      //     } else if (
      //       String(param.seq).endsWith("99") &&
      //       String(param.seq).length == 9
      //     ) {
      //       history = TradeUtil.kLineDataGroup(history, 2);
      //     }
      //     this.quote.historyTick[seq] = history;
      //     Store.dispatch("setHistoryTick", this.quote.historyTick);
      //   }
      // });

      // 分时行情历史数据
      // this.socket.quoteSocket.on("uptrend_query", (param, data) => {
      //   const seq = param.seq;
      //   const history = [];
      //   for (const i in data) {
      //     history.push(data[i]);
      //   }
      //   this.quote.historyTick[seq] = history;
      //   Store.dispatch("setHistoryTick", this.quote.historyTick);
      // });

      // 逻辑未知
      this.socket.quoteSocket.on("tick_WebUI", (param, data) => {});
      // 逻辑未知
      this.socket.quoteSocket.on("LoginComplete_WebUI", (param, data) => {});
      // disconnect
      this.socket.quoteSocket.on("disconnect", (param, data) => {
        this.quoteState = false;
        console.log("quote socket disconnected");
        // this.socket.quoteSocket.close();
      });
    },
    initTradeData() {
      console.log("in init trade data");
      // 交易socket,socket不存在或断开时
      if (
        (Store.state.user.loginname && !Store.state.socket.tradeSocket) ||
        (Store.state.socket.tradeSocket &&
          !Store.state.socket.tradeSocket.connected)
      ) {
        // 新建socket
        if (String(Store.state.user.loginname).startsWith("68")) {
          console.log("in set trade socket real");
          Store.dispatch(
            "setTradeSocket",
            SocketIO(process.env.VUE_APP_TRADE_REAL, {
              path: "",
              transports: ["websocket", "polling"],
            })
          );
        }
        // 真实
        else {
          console.log("in set trade socket demo");
          Store.dispatch(
            "setTradeSocket",
            SocketIO(process.env.VUE_APP_TRADE_DEMO, {
              path: "",
              transports: ["websocket", "polling"],
            })
          );
        } // 模拟
      }
      // 行情字典处理完成，接收交易数据
      if (this.socket.tradeSocket) this.tradeSocketInit();
    },
    tradeSocketInit() {
      console.log("trade socket init");
      this.socket.tradeSocket.on("connect", (param, data) => {
        console.log("trade socket connect");
        console.log(param);
        console.log(data);
        const thread = ++this.tradeConnectThread;
        if (this.tradeState) {
          this.tradeState = false;
          setTimeout(() => {
            if (thread > 1) return; // 防止重复登录
            console.log(
              new Date().getTime() + ":交易socket连接成功(" + thread + ")"
            );
            this.socket.tradeSocket.emit(
              "addme",
              this.user.loginname,
              this.user.pwd,
              this.user.companyId
            );
            console.log(this.user);
          }, 10);
        }
        this.initTrade = true;
        // this.toggleFixed()
      });
      this.socket.tradeSocket.on("HeartBeat", (param, data) => {
        this.socket.tradeSocket.emit("Pong", { beat: 1 });
      });
      this.socket.tradeSocket.on("ServerGetTime", (param, data) => {
        // 获取系统时间
        var initSystemTime = param.ServerTime * 1000;
      });
      this.socket.tradeSocket.on("UserLoginInfo", (param, data) => {
        console.log("user login info");
        if (param.Code != 0) return;
        AccountUtil.initData(param, this.account);
        Store.dispatch("setAccount", this.account);
      });
      // 交易时间
      this.socket.tradeSocket.on("GroupTradeTimeList", (param, data) => {
        if (param.Code != 0) return;
        if (param.Offset == param.Count) this.symbolInfo.symbolTime = []; // 重新拉取时，清空数据
        TradeUtil.initTradeTimeList(param, data, this.symbolInfo.symbolTime);
        // 如果没有查询完，分页查询下一页数据
        Store.dispatch("setSymbolTime", this.symbolInfo.symbolTime);
        if (param.Offset < param.Total) {
          this.socket.tradeSocket.emit(
            "request",
            Number(Constant.Req.tradeTimes),
            {
              ID: this.account.groupId,
              Token: this.account.token,
              Offset: param.Offset,
            }
          );
        }
      });
      // 交易时间
      this.socket.tradeSocket.on("TradeTimeUpdate", (param, data) => {
        // 如果没有查询完，分页查询下一页数据
        this.socket.tradeSocket.emit(
          "request",
          Number(Constant.Req.tradeTimes),
          {
            ID: this.account.groupId,
            Token: this.account.token,
            Offset: 0,
          }
        );
      });
      // 交易时间
      this.socket.tradeSocket.on("TradeTimeAdd", (param, data) => {
        // 如果没有查询完，分页查询下一页数据
        this.socket.tradeSocket.emit(
          "request",
          Number(Constant.Req.tradeTimes),
          {
            ID: this.account.groupId,
            Token: this.account.token,
            Offset: 0,
          }
        );
      });
      // 交易时间
      this.socket.tradeSocket.on("TradeTimeDelete", (param, data) => {
        // 如果没有查询完，分页查询下一页数据
        this.socket.tradeSocket.emit(
          "request",
          Number(Constant.Req.tradeTimes),
          {
            ID: this.account.groupId,
            Token: this.account.token,
            Offset: 0,
          }
        );
      });
      this.socket.tradeSocket.on("AccountUpdate", (param, data) => {
        if (param.Code != 0) return;
        AccountUtil.initData(param, this.account);
        Store.dispatch("setAccount", this.account);
      });
      this.socket.tradeSocket.on("AccountGet", (param, data) => {
        if (param.Code != 0) return;
        AccountUtil.initData(param, this.account);
        Store.dispatch("setAccount", this.account);
      });
      this.socket.tradeSocket.on("GroupGet", (param, data) => {
        if (param.Code != 0) return;
        AccountUtil.initGroup(param, this.group);
        Store.dispatch("setGroup", this.group);
        // 交易服务器信息
        this.socket.tradeSocket.emit(
          "request",
          Number(Constant.Req.serverGet),
          {
            AccountID: this.account.accountID,
            Token: this.account.token,
            ServerID: this.group.serverId,
          }
        );
      });
      this.socket.tradeSocket.on("GroupUpdate", (param, data) => {
        if (param.Code != 0) return;
        AccountUtil.updateGroup(param, this.group);
        Store.dispatch("setGroup", this.group);
      });
      // 服务器信息
      this.socket.tradeSocket.on("ServerGet", (param, data) => {
        if (param.Code != 0) return;
        Store.dispatch("setServerInfo", param);
      });
      this.socket.tradeSocket.on("GroupSymbolList", (param, data) => {
        // console.log("in group sumbol list");
        if (param.Code != 0) return;
        if (param.Offset == param.Count) this.symbolInfo.symbolMap = {}; // 重新拉取时，清空数据
        TradeUtil.initSymbolList(param, data, this.symbolInfo.symbolMap);
        Store.dispatch("setSymbolMap", this.symbolInfo.symbolMap);
        // 如果没有查询完，分页查询下一页数据
        if (param.Offset < param.Total) {
          this.socket.tradeSocket.emit(
            "request",
            Number(Constant.Req.symbols),
            {
              ID: this.account.groupId,
              Token: this.account.token,
              Offset: param.Offset,
            }
          );
        }
        if (param.Offset == param.Total) {
          // 交易数据列表处理完成再拉取用户交易数据列表
          // 请求当日成交记录
          this.socket.tradeSocket.emit("request", Number(Constant.Req.deals), {
            AccountID: this.account.accountID,
            Token: this.account.token,
            Offset: 0,
          });
          // 请求挂单记录
          this.socket.tradeSocket.emit(
            "request",
            Number(Constant.Req.pendings),
            {
              AccountID: this.account.accountID,
              Token: this.account.token,
              Offset: 0,
            }
          );
          // 持仓记录
          this.socket.tradeSocket.emit(
            "request",
            Number(Constant.Req.positions),
            {
              AccountID: this.account.accountID,
              Token: this.account.token,
              Offset: 0,
            }
          );
        }
      });
      this.socket.tradeSocket.on("SymbolUpdate", (param, data) => {
        // 数据改变，重新拉取数据
        if (param.Offset < param.Total) {
          this.socket.tradeSocket.emit(
            "request",
            Number(Constant.Req.symbols),
            {
              ID: this.account.groupId,
              Token: this.account.token,
              Offset: 0,
            }
          );
        }
      });
      this.socket.tradeSocket.on("SymbolAdd", (param, data) => {
        // 数据改变，重新拉取数据
        if (param.Offset < param.Total) {
          this.socket.tradeSocket.emit(
            "request",
            Number(Constant.Req.symbols),
            {
              ID: this.account.groupId,
              Token: this.account.token,
              Offset: 0,
            }
          );
        }
      });
      this.socket.tradeSocket.on("SymbolDelete", (param, data) => {
        // 数据改变，重新拉取数据
        if (param.Offset < param.Total) {
          this.socket.tradeSocket.emit(
            "request",
            Number(Constant.Req.symbols),
            {
              ID: this.account.groupId,
              Token: this.account.token,
              Offset: 0,
            }
          );
        }
      });
      // 当日成交记录，(当日盈亏:过滤掉开仓数据，留下平仓数据即可)
      this.socket.tradeSocket.on("DealTodayListRet", (param, data) => {
        if (param.Code != 0) return;
        if (param.Offset == param.Count) this.tradeData.dayDeal = []; // 重新拉取时，清空数据
        TradeUtil.initDayDeal(param, data, this.tradeData.dayDeal);
        Store.dispatch("setDayDeal", this.tradeData.dayDeal);
        if (param.Offset < param.Total) {
          this.socket.tradeSocket.emit("request", Number(Constant.Req.deals), {
            AccountID: this.account.accountID,
            Token: this.account.token,
            Offset: param.Offset,
          });
        }
      });
      this.socket.tradeSocket.on("DealAddRet", (param, data) => {
        // （开仓、平仓）
        Store.dispatch("setDealAddRet", param);
        // 请求当日成交记录
        this.socket.tradeSocket.emit("request", Number(Constant.Req.deals), {
          AccountID: this.account.accountID,
          Token: this.account.token,
          Offset: 0,
        });
      });
      // 挂单记录
      this.socket.tradeSocket.on("OrderListRet", (param, data) => {
        if (param.Code != 0) return;
        if (param.Offset == param.Count) this.tradeData.pending = []; // 重新拉取时，清空数据
        TradeUtil.initPending(param, data, this.tradeData.pending);
        Store.dispatch("setPending", this.tradeData.pending);
        if (param.Offset < param.Total) {
          this.socket.tradeSocket.emit(
            "request",
            Number(Constant.Req.pendings),
            {
              AccountID: this.account.accountID,
              Token: this.account.token,
              Offset: param.Offset,
            }
          );
        }
      });
      this.socket.tradeSocket.on("OrderAddRet", (param, data) => {
        // (挂单下单[等待的委托单])
        // 暂时用此作为下单结果的判定（正确性待定）
        this.$store.dispatch("setOrderAddRet", param);
        // 请求挂单记录
        this.socket.tradeSocket.emit("request", Number(Constant.Req.pendings), {
          AccountID: this.account.accountID,
          Token: this.account.token,
          Offset: 0,
        });
      });
      this.socket.tradeSocket.on("OrderUpdateRet", (param, data) => {
        // (改单[委托单]、挂单到价系统成交)
        Store.dispatch("setOrderUpdateRet", param);
        // 请求挂单记录
        this.socket.tradeSocket.emit("request", Number(Constant.Req.pendings), {
          AccountID: this.account.accountID,
          Token: this.account.token,
          Offset: 0,
        });
      });
      this.socket.tradeSocket.on("OrderCancelRet", (param, data) => {
        // (撤单)
        Store.dispatch("setOrderCancelRet", param);
        // 请求挂单记录
        this.socket.tradeSocket.emit("request", Number(Constant.Req.pendings), {
          AccountID: this.account.accountID,
          Token: this.account.token,
          Offset: 0,
        });
      });
      // 持仓记录
      this.socket.tradeSocket.on("PositionListRet", (param, data) => {
        if (param.Code != 0) return;
        if (param.Offset == param.Count) this.tradeData.position = []; // 重新拉取时，情况数据
        TradeUtil.initPosition(param, data, this.tradeData.position);
        Store.dispatch("setPosition", this.tradeData.position);
        if (param.Offset < param.Total) {
          this.socket.tradeSocket.emit(
            "request",
            Number(Constant.Req.positions),
            {
              AccountID: this.account.accountID,
              Token: this.account.token,
              Offset: param.Offset,
            }
          );
        }
      });
      this.socket.tradeSocket.on("PositionAddRet", (param, data) => {
        // (市价下单)
        Store.dispatch("setPositionAddRet", param);
        // 持仓记录
        this.socket.tradeSocket.emit(
          "request",
          Number(Constant.Req.positions),
          {
            AccountID: this.account.accountID,
            Token: this.account.token,
            Offset: 0,
          }
        );
      });
      this.socket.tradeSocket.on("PositionUpdateRet", (param, data) => {
        this.$store.dispatch("setPositionUpdateRet", param);
        // 持仓记录
        this.socket.tradeSocket.emit(
          "request",
          Number(Constant.Req.positions),
          {
            AccountID: this.account.accountID,
            Token: this.account.token,
            Offset: 0,
          }
        );
      });
      this.socket.tradeSocket.on("PositionUpdate", (param, data) => {});
      // 层级保证金
      this.socket.tradeSocket.on("GroupMarginList", (param, data) => {
        if (param.Code != 0) return;
        if (param.Offset == param.Count) this.symbolInfo.marginList = []; // 重新拉取时，情况数据
        TradeUtil.initMarginList(param, data, this.symbolInfo.marginList);
        this.$store.dispatch("setMarginList", this.symbolInfo.marginList);
        if (param.Offset < param.Total) {
          this.socket.tradeSocket.emit(
            "request",
            Number(Constant.Req.marginLevels),
            {
              ID: this.account.groupId,
              Token: this.account.token,
              Offset: param.Offset,
            }
          );
        }
      });
      // 层级保证金更新
      this.socket.tradeSocket.on(
        "SymbolMarginLevelBatchUpdate",
        (param, data) => {
          if (param.Code != 0) return;
          this.socket.tradeSocket.emit(
            "request",
            Number(Constant.Req.marginLevels),
            {
              ID: this.account.groupId,
              Token: this.account.token,
              Offset: 0,
            }
          );
        }
      );
      // 此账户在其他地方登陆，强制用户退出
      this.socket.tradeSocket.on("UserForceLogout", (param, data) => {
        // 被下线
        // console.log("being logged out");
        this.offlinePop = !this.offlinePop;
        this.$bus.$emit("offlinePop", false);
        this.toggleFixed();
        this.$store.dispatch("setUser", {});
      });
      // 不可知道收到的是什么数据
      this.socket.tradeSocket.on("SymbolUpdate_WebUI", (param, data) => {});
      this.socket.tradeSocket.on("SimpleResponse", (param, data) => {
        this.$store.dispatch("setSimpleResponse", param);
      });
      this.socket.tradeSocket.on("loginR", (param, data) => {
        console.log("login failed");
        // 登录失败
        // this.errMessage = JSON.stringify(param);
        // this.loginFailed = !this.loginFailed;
        this.$bus.$emit("loginFailed", false, JSON.stringify(param));
        this.toggleFixed();
      });
      // disconnect
      this.socket.tradeSocket.on("disconnect", (param, data) => {
        this.tradeState = false;
        this.socket.tradeSocket.close();
      });
    },

    Refresh() {
      window.location.reload(true);
    },
    flushUuid() {
      // 刷新用户状态
      if (this.user.loginname) {
        api
          .acstatus(this.$qs.stringify({ token: this.user.uuid }))
          .then((res) => {
            if (
              res.status == 200 &&
              !(res.data.code == 0 || res.data.message === "成功")
            ) {
              const readyData = {
                customerNumber: this.user.loginname,
                password: this.user.pwd,
              };
              api.login(this.$qs.stringify(readyData)).then((res) => {
                if (res.status) {
                  if (res.data.code == 0 || res.data.message === "成功") {
                    const user = {
                      loginname: res.data.result.customerNumber,
                      pwd: this.user.pwd,
                      companyId: res.data.result.companyId,
                      uuid: res.data.result.token,
                      mobilePhone: res.data.result.mobilePhone,
                    };
                    this.$store.dispatch("setUser", user);
                  }
                }
              });
            }
          });
      }
    },
  },
};
</script>
