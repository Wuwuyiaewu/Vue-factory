import StorageUtil from '@/utils/storageUtil'
export default {
  quote: {
    /* 及时数据*/
    tickList: [],
    /* 及时数据:symbol为作为key*/
    symbolTickMap: {},
    /* 及时数据:uiCodeID作为key*/
    codeTickMap: {},
    /* 行情字典*/
    notify: {},
    /* 行情字典*/
    sourceNotify: {},
    /* 行情字典*/
    symbolNotify: {},
    /* 历史行情*/
    historyTick: {}

  },
  socket: {
    tradeSocket: null,
    quoteSocket: null
  },
  /* 用户登录返回信息*/
  account: {},
  /* 用户组信息*/
  group: {},
  /* 服务器信息*/
  serverInfo: {},
  /* 交易产品类表*/
  symbolInfo: {
    symbolMap: {}, // code
    codeMap: {}, // sourceCode
    symbolTime: [], // 产品交易时间
    marginList: []// 层级保证金
  },
  tradeData: {
    /* 当日成交*/
    dayDeal: [],
    /* 挂单*/
    pending: [],
    /* 持仓*/
    position: []
  },
  /* 开仓，平仓，挂单结果*/
  orderAddRet: {},
  /* 开仓，平仓，挂单结果*/
  dealAddRet: {},
  /* 开仓，平仓，挂单结果*/
  orderUpdateRet: {},
  /* 开仓，平仓，挂单结果*/
  positionAddRet: {},
  /* 修改止损止盈*/
  positionUpdateRet: {},
  /* 撤单*/
  orderCancelRet: {},
  // 发送事件结果
  simpleResponse: {},
  /* 用户信息*/
  user: StorageUtil.readUser(),
  /* 第一步注册信息*/
  registerInfo: StorageUtil.readRegisterInfo(),
  /* CMS API DATA */
  appProperties: {},
  /* 用户状态 */
  loginType: "",
  /* 涨跌颜色 */
  priceColorType: StorageUtil.readPriceColorType(),
}
