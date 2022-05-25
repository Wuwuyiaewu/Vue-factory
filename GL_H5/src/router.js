import Vue from "vue";
import Router from "vue-router";
import store from "./store";

Vue.use(Router);
var router = new Router({
  mode: "history",
  // base:process.env.VUE_APP_TITLE == 'uat'?'/cf-trade': '/',
  base: process.env.VUE_APP_NODE_PATH,
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/Login",
      component: () => import("@/view/Login.vue"),
    },
    {
      path: "/ModifyPwd",
      component: () => import("@/view/password/ModifyPwd.vue"),
    },
    {
      path: "/ForgetPwd",
      component: () => import("@/view/password/ForgetPwd.vue"),
    },
    {
      path: "/PwdModifySuccess",
      component: () => import("@/view/password/PwdModifySuccess.vue"),
    },
    {
      path: "/token",
      component: () => import("@/components/Token.vue"),
    },
    {
      path: "/Settings",
      component: () => import("@/view/mine/Settings.vue"),
    },
    {
      path: "/PriceColorType",
      component: () => import("@/view/mine/PriceColorType.vue"),
    },
    {
      path: "/home",
      component: () => import("@/view/InitData.vue"),
      meta: {
        keepAlive: true,
        userAuth: true,
      },
      children: [
        {
          path: "",
          component: () => import("@/view/Homepage.vue"),
          meta: {
            keepAlive: true,
          },
        },
        {
          path: "Turn",
          component: () => import("@/view/Turn.vue"),
        },
        {
          path: "OrderHelp",
          component: () => import("@/view/OrderHelp.vue"),
        },
        {
          path: "Quotation",
          component: () => import("@/view/quotation/Quotation.vue"),
        },
        {
          path: "QuotationWOptional",
          component: () => import("@/view/quotation/QuotationWOptional.vue"),
        },
        {
          path: "QuotationHot",
          component: () => import("@/view/quotation/QuotationHot.vue"),
        },
        {
          path: "QuotationView",
          component: () => import("@/view/quotation/QuotationView.vue"),
        },
        {
          path: "Optional",
          component: () => import("@/view/quotation/Optional.vue"),
        },
        {
          path: "QuoteChart",
          component: () => import("@/view/quotation/QuoteChart.vue"),
        },
        {
          path: "QuoteBuy",
          component: () => import("@/view/quotation/QuoteBuy.vue"),
          meta: {
            userAuth: true,
          },
        },
        {
          path: "Attribute",
          component: () => import("@/view/quotation/Attribute.vue"),
        },
        {
          path: "Trade",
          component: () => import("@/view/trade/Trade.vue"),
          meta: {
            userAuth: true,
          },
        },
        {
          path: "TradePage",
          component: () => import("@/view/trade/TradePage.vue"),
        },
        {
          path: "PositionChart",
          component: () => import("@/view/trade/PositionChart.vue"),
          meta: {
            userAuth: true,
          },
        },
        {
          path: "PendingChart",
          component: () => import("@/view/trade/PendingChart.vue"),
          meta: {
            userAuth: true,
          },
        },
        {
          path: "PendingModify",
          component: () => import("@/view/trade/PendingModify.vue"),
          meta: {
            userAuth: true,
          },
        },
        {
          path: "SucOrdered",
          component: () => import("@/view/trade/success/SucOrdered.vue"),
          meta: {
            userAuth: true,
          },
        },
        {
          path: "PositionSuc",
          component: () => import("@/view/trade/success/PositionSuc.vue"),
          meta: {
            userAuth: true,
          },
        },
        {
          path: "ModifySuc",
          component: () => import("@/view/trade/success/ModifySuc.vue"),
          meta: {
            userAuth: true,
          },
        },
        {
          path: "TradeError",
          component: () => import("@/view/trade/tradePop/TradeError.vue"),
          meta: {
            userAuth: true,
          },
        },
        {
          path: "BannerUrl",
          component: () => import("@/view/H5/BannerUrl.vue"),
          meta: {
            serverLink: true,
          },
        },
        {
          path: "UserCenter",
          component: () => import("@/view/H5/UserCenter.vue"),
          meta: {
            userAuth: true,
            serverLink: true,
          },
        },
        {
          path: "LoginUrl",
          component: () => import("@/view/H5/LoginUrl.vue"),
          meta: {
            userAuth: true,
            serverLink: true,
          },
        },
        {
          path: "RankList",
          component: () => import("@/view/rankList/RankList.vue"),
        },
        {
          path: "SuggestTechnical",
          component: () => import("@/view/SuggestTechnical.vue"),
        },
        {
          path: "TradeRank",
          component: () => import("@/view/trade/TradeRank.vue"),
        },
        {
          path: "NewsList",
          component: () => import("@/view/news/NewsList.vue"),
          meta: {
            keepAlive: true,
          },
        },
        {
          path: "MsgPush",
          component: () => import("@/view/news/MsgPush.vue"),
          meta: {
            userAuth: true,
            keepAlive: true,
          },
        },
        {
          path: "NewsDetail",
          component: () => import("@/view/news/NewsDetail.vue"),
        },
        {
          path: "/Mine",
          component: () => import("@/view/mine/Index.vue"),
        },
        {
          path: "/Register",
          component: () => import("@/view/register/Register.vue"),
        },
        {
          path: "/RegisterSuccess",
          component: () => import("@/view/register/RegisterSuccess.vue"),
        },
        {
          path: "/RegisterFail",
          component: () => import("@/view/register/RegisterFail.vue"),
        },
        {
          path: "/SupplementaryInfo",
          component: () => import("@/view/register/SupplementaryInfo.vue"),
        },
      ],
    },
    // Redirecting all other non-existing routes to home
    {
      path: "*",
      redirect: (to) => {
        return { path: "/" };
      },
    },
  ],
});
router.beforeEach((to, from, next) => {
  // 访问交易页面但未登录
  if (
    to.path == "/home/Trade" &&
    to.meta.userAuth &&
    !store.state.user.loginname
  )
    next({ path: "/home/TradePage" });
  // 访问其它页面但未登录
  else if (to.meta.userAuth && !store.state.user.loginname)
    next({ path: "/login" });
  // 访问登录页但已登录过
  else if (
    (to.fullPath.startsWith("/Login") || to.fullPath.startsWith("/login")) &&
    store.state.user.loginname
  ) {
    next({ path: "/home" });
  } else if (
    to.fullPath.startsWith("/home") &&
    to.fullPath.indexOf("Turn") < 0 &&
    store.state.quote.tickList.length == 0
  ) {
    next({ path: "/home/Turn", query: { url: to.fullPath }, replace: true });
  }
  next();
});

router.afterEach((to, from) => {
  // ga('set', 'page', to.path)
  // ga('send', 'pageview')
  // cache from path
  if (from) {
    // Cache the fromPath for configuring back functions in pages
    router.fromPath = from.fullPath;
  }
});
export default router;
