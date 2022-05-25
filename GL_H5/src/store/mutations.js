export default {
  SETQUOTETICKLIST(state, { tickList }) {
    state.quote.tickList = []// 使dom监听到数据的变化
    state.quote.tickList = [...tickList]
  },
  SETSYMBOLTICKMAP(state, { symbolTickMap }) {
    // state.quote.symbolTickMap = {};//使dom监听到数据的变化
    state.quote.symbolTickMap = {}
    state.quote.symbolTickMap = { ...symbolTickMap }
  },
  SETCODETICKMAP(state, { codeTickMap }) {
    // state.quote.symbolTickMap = {};//使dom监听到数据的变化
    state.quote.codeTickMap = {}
    state.quote.codeTickMap = { ...codeTickMap }
  },
  SETQUOTENOTIFY(state, { notify }) {
    state.quote.notify = {}
    state.quote.notify = { ...notify }
  },
  SETQUOTESOURCENOTIFY(state, { sourceNotify }) {
    state.quote.sourceNotify = {}
    state.quote.sourceNotify = { ...sourceNotify }
  },
  SETQUOTESYMBOLNOTIFY(state, { symbolNotify }) {
    state.quote.symbolNotify = {}
    state.quote.symbolNotify = { ...symbolNotify }
  },
  SETHISTORYTICK(state, { historyTick }) {
    state.quote.historyTick = {}
    state.quote.historyTick = { ...historyTick }
  },
  SETTRADESOCKET(state, { tradeSocket }) {
    state.socket.tradeSocket = null
    state.socket.tradeSocket = tradeSocket
  },
  SETQUOTESOCKET(state, { quoteSocket }) {
    state.socket.quoteSocket = null
    state.socket.quoteSocket = quoteSocket
  },
  SETACCOUNT(state, { account }) {
    state.account = {}
    state.account = account
  },
  SETGROUP(state, { group }) {
    state.group = {}
    state.group = group
  },
  SETSERVERINFO(state, { serverInfo }) {
    state.serverInfo = {}
    state.serverInfo = serverInfo
  },
  SETSYMBOLMAP(state, { symbolMap }) {
    state.symbolInfo.symbolMap = {}
    state.symbolInfo.symbolMap = symbolMap
  },
  SETCODEMAP(state, { codeMap }) {
    state.symbolInfo.codeMap = {}
    state.symbolInfo.codeMap = codeMap
  },
  SETSYMBOLTIME(state, { symbolTime }) {
    state.symbolInfo.symbolTime = []
    state.symbolInfo.symbolTime = symbolTime
  },
  SETMARGINLIST(state, { marginList }) {
    state.symbolInfo.marginList = []
    state.symbolInfo.marginList = marginList
  },
  SETDAYDEAL(state, { dayDeal }) {
    state.tradeData.dayDeal = []
    state.tradeData.dayDeal = dayDeal
  },
  SETPENDING(state, { pending }) {
    state.tradeData.pending = []
    state.tradeData.pending = pending
  },
  SETPOSITION(state, { position }) {
    state.tradeData.position = []
    state.tradeData.position = position
  },
  SETORDERADDRET(state, { orderAddRet }) {
    state.orderAddRet = {}
    state.orderAddRet = orderAddRet
  },
  SETDEALADDRET(state, { dealAddRet }) {
    state.dealAddRet = {}
    state.dealAddRet = dealAddRet
  },
  SETORDERUPDATERET(state, { orderUpdateRet }) {
    state.orderUpdateRet = {}
    state.orderUpdateRet = orderUpdateRet
  },
  SETPOSITIONADDRET(state, { positionAddRet }) {
    state.positionAddRet = {}
    state.positionAddRet = positionAddRet
  },
  SETPOSITIONUPDATERET(state, { positionUpdateRet }) {
    state.positionUpdateRet = {}
    state.positionUpdateRet = positionUpdateRet
  },
  SETORDERCANCELRET(state, { orderCancelRet }) {
    state.orderCancelRet = {}
    state.orderCancelRet = orderCancelRet
  },
  SETSIMPLERESPONSE(state, { simpleResponse }) {
    state.simpleResponse = {}
    state.simpleResponse = simpleResponse
  },
  SETUSER(state, { user }) {
    state.user = {}
    state.user = user
  },
  SETLOGINTYPE(state, loginType) {
    state.loginType = ""
    state.loginType = loginType
  },
  SETREGISTERINFO(state, { registerInfo }) {
    state.registerInfo = {}
    state.registerInfo = registerInfo
  },
  SETURLQUERY(state, { urlQuery }) {
    state.urlQuery = ''
    state.urlQuery = urlQuery
  },
  SETTHIRDQUERY(state, { thirdQuery }) {
    state.thirdQuery = {}
    state.thirdQuery = thirdQuery
  },
  SETAPPPROPERTIES(state, { appProperties }) {
    state.appProperties = {}
    state.appProperties = appProperties;
  },
  SETPRICECOLORTYPE(state, priceColorType) {
    state.priceColorType = null;
    state.priceColorType = priceColorType;
  }
}
