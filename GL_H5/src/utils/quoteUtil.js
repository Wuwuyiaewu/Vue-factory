import Util from './tradeDataUtil'
import Store from '@/store'

export default {
  // 初始化行情字典数据
  initNotify: function(param, notity) {
    const notifyData = {}
    // var symbolCodes = {}
    // const symbolCodeList = []
    for (const i in notity) {
      // Math.pow(10, uiDigit - ushPips))  —游客大点比率计算公式
      notity[i].pipsRatio = Math.pow(
        10,
        notity[i].uiDigit - notity[i].ushPips
      ).toFixed(0) // 大点比率
      // 每点价值 1 pip = Util.accMul(Math.pow(10,uiDigit-ushPips)), Math.pow(10,-uiDigit))
      notity[i].pipv = Util.accMul(
        Math.pow(10, notity[i].uiDigit - notity[i].ushPips),
        Math.pow(10, -notity[i].uiDigit)
      )
      notity[i].diff = Math.log10(notity[i].pipsRatio || 10) // 点差保留小数位
      notifyData[notity[i].uiCodeID] = notity[i]
      if(notity[i].uchZone != 7){
        notity[i].searchflag = notity[i].uchZone
      }
      // symbolCodes[parseInt(i)] = notity[i].uiCodeID
      // symbolCodeList.push(notity[i].uiCodeID)
    }
    for (const i in notifyData) {
      //根据时间设置港股或美股标识
      if (notifyData[i].uchZone == 7){
        notifyData[i].searchflag = 71
      }else if (notifyData[i].uchZone == 9){
        notifyData[i].searchflag = 72
      }
    }
    return notifyData
    // return {
    //   notify: notifyData,
    //   symbolCodes: symbolCodes,
    //   symbolCodeList: symbolCodeList
    // }
  },
  // 处理及时行情数据
  updateTickList: function(param, data, tickList) {
    const notify = { ...Store.state.quote.notify }
    const codeMap = { ...Store.state.symbolInfo.codeMap }
    if (!notify[data[0].uiCodeID]) return // 过滤行情字典中不存在的
    this.packTick(data)
    let isContent = false // 是否包含此数据
    for (var i = 0; i < tickList.length; i++) {
      if (
        !tickList[i].symbolData &&
        codeMap[notify[tickList[i].uiCodeID].uiSourceCode]
      ) {
        // 处理没有计算点差的行情数据(防止用户组产品信息更新)
        const temp = {}
        temp[0] = JSON.parse(JSON.stringify(tickList[i]))
        this.packTick(temp)
        tickList[i] = temp[0]
      }
      // 此处有坑，请注意（判断时间，确定不是上一口报价的重复推送）
      if (tickList[i].uiCodeID == data[0].uiCodeID) {
        if (data[0].dtime <= tickList[i].dtime) return // 时间重复
        if (tickList[i].preData) tickList[i].preData = null
        data[0].preData = tickList[i]
        tickList[i] = data[0]
        isContent = true
      }
    }
    if (!isContent) tickList.push(data[0])
  },

  // 封装处理行情数据
  packTick: function(data) {
    const notify = Store.state.quote.notify
    const codeMap = Store.state.symbolInfo.codeMap
    let digits = notify[data[0].uiCodeID].uiDigit // 行情服务器的报价小数位
    // 交易列表有数据，则取交易类表的报价小数位（行情服务器的报价小数位是针对游客的）
    if (codeMap[notify[data[0].uiCodeID].uiSourceCode]) { digits = codeMap[notify[data[0].uiCodeID].uiSourceCode].digits }
    data[0].ask = Util.fixToStr(data[0].ask, digits)
    data[0].bid = Util.fixToStr(data[0].bid, digits)
    // const ask = data[0].bid
    // const bid = data[0].ask
    // data[0].ask = Util.fixToStr(ask, digits)
    // data[0].bid = Util.fixToStr(bid, digits)
    if (codeMap[notify[data[0].uiCodeID].uiSourceCode]) {
      const symbolData = codeMap[notify[data[0].uiCodeID].uiSourceCode]
      // 登录用户计算用户点差:显示买价= 原始买价 + (产品点差spread-产品偏差点差spreadbalance)/pow
      // 显示卖价= 原始卖价 - 产品偏差点差spreadbalance/pow
      const pow = Math.pow(10, symbolData.digits)
      data[0].bid = Util.fixToStr(
        Util.accAdd(
          data[0].bid,
          Util.accDiv(
            Util.accSub(symbolData.spread, symbolData.spreadBalance),
            pow
          )
        ),
        digits
      )
      data[0].ask = Util.fixToStr(
        Util.accSub(data[0].ask, Util.accDiv(symbolData.spreadBalance, pow)),
        digits
      )
      data[0].symbolData = symbolData
    }
    data[0].newP = Util.fixToStr(data[0].newP, digits)
    data[0].high = Util.fixToStr(data[0].high, digits)
    data[0].preclose = Util.fixToStr(data[0].preclose, digits)
    data[0].low = Util.fixToStr(data[0].low, digits)
    data[0].open = Util.fixToStr(data[0].open, digits)
    data[0].symbol = notify[data[0].uiCodeID].szShortName
    data[0].symbolName = notify[data[0].uiCodeID].aushGB
    data[0].rate = Number(
      ((data[0].newP - data[0].preclose) / data[0].preclose) * 100
    ) // 涨跌幅
  },
  /** @param {string} code */
  getSybmolBySourceCode: function(code) {
    const symbolInfo = Store.state.quote.symbolNotify
    let result
    for (const key in symbolInfo) {
      if (symbolInfo[key].uiSourceCode === code) {
        result = symbolInfo[key]
        break
      }
    }
    return result
  }
}
