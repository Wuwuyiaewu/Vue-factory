import StorageUtil from '@/utils/storageUtil'
export default {
  setQuoteTickList({ commit, dispatch }, tickList) {
    // 提交一个comutation请求
    commit('SETQUOTETICKLIST', { tickList }) // 传递给mutation的是一个包含数据的对象
    const codeTickMap = {}
    const symbolTickMap = {}
    for (const i in tickList) {
      symbolTickMap[tickList[i].symbol] = tickList[i]
      codeTickMap[tickList[i].uiCodeID] = tickList[i]
    }
    dispatch('setSymbolTickMap', symbolTickMap)
    dispatch('setCodeTickMap', codeTickMap)
  },
  setSymbolTickMap({ commit }, symbolTickMap) {
    // 提交一个comutation请求
    commit('SETSYMBOLTICKMAP', { symbolTickMap }) // 传递给mutation的是一个包含数据的对象
  },
  setCodeTickMap({ commit }, codeTickMap) {
    // 提交一个comutation请求
    commit('SETCODETICKMAP', { codeTickMap }) // 传递给mutation的是一个包含数据的对象
  },
  setQuoteNotify({ commit, dispatch }, notify) {
    // 提交一个comutation请求
    commit('SETQUOTENOTIFY', { notify }) // 传递给mutation的是一个包含数据的对象
    const sourceNotify = {}
    const symbolNotify = {}
    for (var i in notify) {
      sourceNotify[notify[i].uiSourceCode] = notify[i]
      symbolNotify[notify[i].szShortName] = notify[i]
    }
    dispatch('setQuoteSourceNotify', sourceNotify)
    dispatch('setQuoteSymbolNotify', symbolNotify)
  },
  setQuoteSourceNotify({ commit }, sourceNotify) {
    // 提交一个comutation请求
    commit('SETQUOTESOURCENOTIFY', { sourceNotify }) // 传递给mutation的是一个包含数据的对象
  },
  setQuoteSymbolNotify({ commit }, symbolNotify) {
    // 提交一个comutation请求
    commit('SETQUOTESYMBOLNOTIFY', { symbolNotify }) // 传递给mutation的是一个包含数据的对象
  },
  setHistoryTick({ commit }, historyTick) {
    // 提交一个comutation请求
    commit('SETHISTORYTICK', { historyTick }) // 传递给mutation的是一个包含数据的对象
  },
  setTradeSocket({ commit }, tradeSocket) {
    // 提交一个comutation请求
    commit('SETTRADESOCKET', { tradeSocket }) // 传递给mutation的是一个包含数据的对象
  },
  setQuoteSocket({ commit }, quoteSocket) {
    // 提交一个comutation请求
    commit('SETQUOTESOCKET', { quoteSocket }) // 传递给mutation的是一个包含数据的对象
  },
  setAccount({ commit }, account) {
    // 提交一个comutation请求
    commit('SETACCOUNT', { account }) // 传递给mutation的是一个包含数据的对象
  },
  setGroup({ commit }, group) {
    // 提交一个comutation请求
    commit('SETGROUP', { group }) // 传递给mutation的是一个包含数据的对象
  },
  setServerInfo({ commit }, serverInfo) {
    // 提交一个comutation请求
    commit('SETSERVERINFO', { serverInfo }) // 传递给mutation的是一个包含数据的对象
  },
  setSymbolMap({ commit, dispatch }, symbolMap) {
    // 提交一个comutation请求
    commit('SETSYMBOLMAP', { symbolMap }) // 传递给mutation的是一个包含数据的对象
    const codeMap = {}
    for (const i in symbolMap) {
      codeMap[symbolMap[i].source] = symbolMap[i]
    }
    dispatch('setCodeMap', codeMap)
  },
  setCodeMap({ commit }, codeMap) {
    // 提交一个comutation请求
    commit('SETCODEMAP', { codeMap }) // 传递给mutation的是一个包含数据的对象
  },
  setSymbolTime({ commit }, symbolTime) {
    // 提交一个comutation请求
    commit('SETSYMBOLTIME', { symbolTime }) // 传递给mutation的是一个包含数据的对象
  },
  setMarginList({ commit }, marginList) {
    // 提交一个comutation请求
    commit('SETMARGINLIST', { marginList }) // 传递给mutation的是一个包含数据的对象
  },
  setDayDeal({ commit }, dayDeal) {
    // 提交一个comutation请求
    commit('SETDAYDEAL', { dayDeal }) // 传递给mutation的是一个包含数据的对象
  },
  setPending({ commit }, pending) {
    // 提交一个comutation请求
    commit('SETPENDING', { pending }) // 传递给mutation的是一个包含数据的对象
  },
  setPosition({ commit }, position) {
    // 提交一个comutation请求
    commit('SETPOSITION', { position }) // 传递给mutation的是一个包含数据的对象
  },
  setOrderAddRet({ commit }, orderAddRet) {
    // 提交一个comutation请求
    commit('SETORDERADDRET', { orderAddRet }) // 传递给mutation的是一个包含数据的对象
  },
  setDealAddRet({ commit }, dealAddRet) {
    // 提交一个comutation请求
    commit('SETDEALADDRET', { dealAddRet }) // 传递给mutation的是一个包含数据的对象
  },
  setOrderUpdateRet({ commit }, orderUpdateRet) {
    // 提交一个comutation请求
    commit('SETORDERUPDATERET', { orderUpdateRet }) // 传递给mutation的是一个包含数据的对象
  },
  setPositionAddRet({ commit }, positionAddRet) {
    // 提交一个comutation请求
    commit('SETPOSITIONADDRET', { positionAddRet }) // 传递给mutation的是一个包含数据的对象
  },
  setPositionUpdateRet({ commit }, positionUpdateRet) {
    // 提交一个comutation请求
    commit('SETPOSITIONUPDATERET', { positionUpdateRet }) // 传递给mutation的是一个包含数据的对象
  },
  setOrderCancelRet({ commit }, orderCancelRet) {
    // 提交一个comutation请求
    commit('SETORDERCANCELRET', { orderCancelRet }) // 传递给mutation的是一个包含数据的对象
  },
  setSimpleResponse({ commit }, simpleResponse) {
    // 提交一个comutation请求
    commit('SETSIMPLERESPONSE', { simpleResponse }) // 传递给mutation的是一个包含数据的对象
  },
  setUser({ commit }, user) {
    // 提交一个comutation请求
    StorageUtil.saveUser(user)
    commit('SETUSER', { user }) // 传递给mutation的是一个包含数据的对象
  },
  setLoginType({ commit }, loginType) {
    // 提交一个comutation请求
    commit('SETLOGINTYPE', loginType)
    // caceh login type in sessionStorage
    StorageUtil.cacheLoginType(loginType);
  },
  setRegisterInfo({ commit }, registerInfo) {
    // 提交一个comutation请求
    StorageUtil.saveRegisterInfo(registerInfo)
    commit('SETREGISTERINFO', { registerInfo }) // 传递给mutation的是一个包含数据的对象
  },
  setUrlQuery({ commit }, urlQuery) {
    // 提交一个comutation请求
    commit('SETURLQUERY', { urlQuery }) // 传递给mutation的是一个包含数据的对象
  },
  setThirdQuery({ commit }, thirdQuery) {
    // 提交一个comutation请求
    commit('SETTHIRDQUERY', { thirdQuery }) // 传递给mutation的是一个包含数据的对象
  },
  setAppProperties({ commit }, appProperties) {
    commit('SETAPPPROPERTIES', { appProperties })
  },
  setPriceColorType({ commit }, priceColorType) {
    // 提交一个comutation请求
    commit('SETPRICECOLORTYPE', priceColorType)
    StorageUtil.cachePriceColorType(priceColorType);
  },
}
