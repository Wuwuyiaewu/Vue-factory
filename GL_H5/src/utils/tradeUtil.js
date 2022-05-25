import Util from './tradeDataUtil'
import Constant from './Constant'
import Store from '@/store'
import StorageUtil from '@/utils/storageUtil'
import dayjs from 'dayjs'

export default {
  copy: function(obj) {
    return JSON.parse(JSON.stringify(obj))
  },

  OrderDirection: {
    1: '买入',
    2: '卖出'
  },

  DealReason: {
    1: '市价成交',
    2: '限价成交',
    4: '停损成交',
    8: '市价成交',
    16: '止损平仓',
    32: '止盈平仓',
    64: '系统平仓',
    128: '市价成交',
    0xa0: '系统平仓',
    0xa1: '组平仓成交'
  },

  // 产品列表处理
  initSymbolList: function(para, data, symbolMap) {
    const symbolNotify = Store.state.quote.symbolNotify
    const sourceNotify = Store.state.quote.sourceNotify
    for (var i = 0; i < para.Count; i++) {
      var item = data[i]
      if (item.Status == 1) {
        // 排除已删除
        continue
      }
      if (symbolMap[Util.getShowPrdCode(item.Name)]) {
        // 排除重复
        continue
      }
      var symbolData = {}
      this.mergeSymbolData(item, symbolData, symbolNotify, sourceNotify)
      symbolMap[symbolData.name] = symbolData
    }
  },

  mergeSymbolData: function(data, symbolData, symbolNotify, sourceNotify) {
    symbolData.id = data.ID // 产品ID
    symbolData.source = data.Source // Source
    symbolData.name = Util.getShowPrdCode(data.Name) // 产品名称---"XAGUSD"
    symbolData.nameOriginal = data.Name // 原始产品名称---"NZ/USD/GTS/MM/STD/0/A/XAGUSD"
    symbolData.status = data.Status // 服务器状态0：正常 1：删除
    symbolData.enable = data.Enable // 可用状态：0-未激活；1-可用；2-不可用；3-到期；
    symbolData.tradable = data.Tradable // 交易状态：0-不可交易；1-可交易；2-参考行情（不可交易）；3-仅平仓；
    symbolData.digits = data.Digits // 报价小数位数
    symbolData.pipsRatio = data.PipsRatio // 大点比率{1,10,100,1000,...}（Node中间层已处理PipsRatio = LargePipsRatio > 0 ? LargePipsRatio : PipsRatio）

    symbolData.diff = Math.log10(symbolData.pipsRatio || 10) // 点差保留小数位
    symbolData.pipv = Util.accMul(
      symbolData.pipsRatio,
      Math.pow(10, -symbolData.digits)
    ) // 每点价值（1 pip = pipsRatio * 1 point）
    symbolData.digitsPips = Util.getDecimalLen(symbolData.pipv) // 点数---PIPS小数位

    symbolData.spread = data.Spread // 叠加点差（产品规格中）
    symbolData.spreadBalance = data.SpreadBalance // 点差偏差
    symbolData.marginInitial = data.MarginInitial // 初始保证金
    symbolData.holidayMarginInitial = data.HolidayMarginInitial // 假期初始保证金
    symbolData.marginStopout = data.MarginStopout // 强平保证金
    symbolData.marginHedged = data.MarginHedged // 锁仓保证金
    symbolData.threeDaysSwap = data.ThreeDaysSwap // 三天利息日
    symbolData.longSwap = data.LongSwap // 买利息
    symbolData.shortSwap = data.ShortSwap // 卖利息
    // symbolData.positionVolumesMax = data.PositionVolumesMax; // 持仓手数上限
    symbolData.volumesStep =
      data.VolumesStep && data.VolumesStep != 0 ? data.VolumesStep : 0.01 // 手数步长(防止)
    const fix =
      String(symbolData.volumesStep).indexOf('.') >= 0
        ? String(symbolData.volumesStep).split('.')[1].length
        : 0 // 手数步长小数位
    symbolData.maxVolumes = Number(data.VolumesMax).toFixed(fix) // 最大手数
    symbolData.minVolumes = Number(data.VolumesMin).toFixed(fix) // 最小手数
    symbolData.contractSize = data.ContractSize // 合约大小
    symbolData.baseCurrency = data.BaseCurrency // 基础货币
    symbolData.profitCurrency = data.ProfitCurrency // 盈亏货币
    symbolData.marginCurrency = data.MarginCurrency // 保证金货币（货币单位）
    symbolData.forceCloseTime = data.ForceCloseTime // 平仓执行时间(秒数)
    symbolData.expiryTime = data.ExpiryTime // 期油到期时间(秒数)

    symbolData.rangeScope = data.RangeInitial // UI最大偏移=RangeInitial(Admin中Normal Acc)
    // if (data.Name.match(/BTCUSDT/)) {
    //   console.log(data)
    //   symbolData.stopLevel = Util.accDiv(100000, symbolData.pipsRatio) // StopLevel:限价/止损订单间隔点（距市最小点数）
    //   symbolData.maxStopLevel = Util.accDiv(500000, symbolData.pipsRatio) // MaxStopLevel:限价/止损订单最高间隔点（距市最大点数）
    // } else {
    //   symbolData.stopLevel = Util.accDiv(data.StopLevel, symbolData.pipsRatio) // StopLevel:限价/止损订单间隔点（距市最小点数）
    //   symbolData.maxStopLevel = Util.accDiv(data.MaxStopLevel, symbolData.pipsRatio) // MaxStopLevel:限价/止损订单最高间隔点（距市最大点数）
    // }
    symbolData.stopLevel = Util.accDiv(data.StopLevel, symbolData.pipsRatio) // StopLevel:限价/止损订单间隔点（距市最小点数）
    symbolData.maxStopLevel = Util.accDiv(
      data.MaxStopLevel,
      symbolData.pipsRatio
    ) // MaxStopLevel:限价/止损订单最高间隔点（距市最大点数）

    symbolData.volumesList = [] // 手数列表
    var volume_list = data.VolumesList
    if (Util.isNotEmpty(volume_list)) {
      symbolData.volumesList = volume_list.split(';')
    }

    symbolData.type = data.Type // tradesvr产品类型： 0-外汇；1-贵金属；2-到期CFD；
    this.setStockType(symbolData, symbolNotify, sourceNotify)
    return symbolData
  },

  /**
   * 外汇类的货币转换
   * @param symbolData
   * @param symbolNotify
   */
  setStockType: function(symbolData, symbolNotify, sourceNotify) {
    // 港股 //console.log("searchflag")
    if (
      sourceNotify[symbolData.source] &&
      sourceNotify[symbolData.source].searchflag == 71
    ) {
      symbolData.stockType = Constant.StockType.HkDirect
      return
    }
    // 非外汇
    if (
      sourceNotify[symbolData.source] &&
      sourceNotify[symbolData.source].uchZone != 2
    ) {
      symbolData.stockType = Constant.StockType.Direct
      return
    }
    var first = symbolData.baseCurrency
    var second = symbolData.profitCurrency
    if (second == 'USD') {
      symbolData.stockType = Constant.StockType.Direct
    } else if (first == 'USD') {
      symbolData.stockType = Constant.StockType.InDirect
    } else {
      // 目标货币与美元为直接货币
      symbolData.stockType = Constant.StockType.CrossDirect
      var tmpSymbol = second + 'USD'
      var tmpData = symbolNotify[tmpSymbol]
      if (!tmpData) {
        // 目标货币与美元为间接货币
        symbolData.stockType = Constant.StockType.CrossInDirect;
        (tmpSymbol = 'USD' + second), (tmpData = symbolNotify[tmpSymbol])
        if (!tmpData) {
          console.log(
            'setStockType未找中间货币,' + symbolData.name + '-》' + tmpSymbol
          )
        }
      }
      symbolData.relateSymbol = tmpSymbol
      if (tmpData) {
        symbolData.relateQuotaId = tmpData.uiCodeID
      }
    }
  },

  initDayDeal: function(para, data, dayDeal) {
    const symbolMap = Store.state.symbolInfo.symbolMap
    const sourceNotify = Store.state.quote.sourceNotify
    for (var i = 0; i < para.Count; i++) {
      var item = data[i]
      var symbolData = symbolMap[Util.getShowPrdCode(item.Symbol)]
      if (!symbolData) {
        continue
      }
      item.symbolData = symbolData
      item.SymbolName = symbolData.name
      item.SName = sourceNotify[symbolData.source]
      item.ExecuteVolume = Util.fixToStr(item.ExecuteVolume, 2)
      item.Profit = Util.fixToStr(item.Profit, 2)
      item.Swap = Util.fixToStr(item.Swap, 2)
      item.Commission = Util.fixToStr(item.Commission, 2)

      item.SrcPrice = Util.fixToStr(item.SrcPrice, symbolData.digits) // 开仓价
      item.ExecutePrice = Util.fixToStr(item.ExecutePrice, symbolData.digits) // 成交价 || 平仓价

      if (
        item.Reason == Constant.DealReason.OPEN ||
        item.Reason == Constant.DealReason.LIMIT ||
        item.Reason == Constant.DealReason.STOP
      ) {
        // 开仓
        if (item.Direction == 1) item.DirectionStr = '开仓买入'
        else item.DirectionStr = '开仓卖出'
      } else {
        // 平仓仓
        if (item.Direction == 2) item.DirectionStr = '平仓买入'
        else item.DirectionStr = '平仓卖出'
      }
      this.pushDayDeal(item, dayDeal)
    }
    dayDeal.sort((obj1, obj2) => {
      if (obj2.ExecuteTime != obj1.ExecuteTime) { return obj2.ExecuteTime - obj1.ExecuteTime } else return obj2.ID - obj1.ID
    })
  },

  pushDayDeal: function(item, dayDeal) {
    let isHas = false
    for (const i in dayDeal) {
      if (dayDeal[i].ID == item.ID) {
        dayDeal[i] = item
        isHas = true
      }
    }
    if (!isHas) dayDeal.push(item)
  },

  initPending: function(para, data, pending) {
    const symbolMap = Store.state.symbolInfo.symbolMap
    const sourceNotify = Store.state.quote.sourceNotify
    for (var i = 0; i < para.Count; i++) {
      var item = data[i]
      if (
        item.Status != Constant.OrderStatus.PLACED ||
        (item.Type != Constant.OrderType.LIMIT &&
          item.Type != Constant.OrderType.STOP)
      ) {
        // 非挂单
        continue
      }
      var symbolData = symbolMap[Util.getShowPrdCode(item.Symbol)]
      if (!symbolData) {
        continue
      }
      item.symbolData = symbolData
      item.SymbolName = symbolData.name
      item.SName = sourceNotify[symbolData.source]
      item.RequestVolume = Util.fixToStr(item.RequestVolume, 2)
      item.RequestPrice = Util.fixToStr(item.RequestPrice, symbolData.digits)
      item.StopLoss = Util.fixToStr(item.StopLoss, symbolData.digits)
      item.TakeProfit = Util.fixToStr(item.TakeProfit, symbolData.digits)
      // 相差点数(PIP)=（实时报价-挂单价）/1点价值
      // item.Point = symbolData.formatPips(symbolData.priceInPointsToPips(Util.accSub(item.NowPrice, item.RequestPrice)));
      this.pushPend(item, pending)
    }
    pending.sort((obj1, obj2) => obj2.RequestTime - obj1.RequestTime)
  },

  pushPend: function(item, pending) {
    let isHas = false
    for (const i in pending) {
      if (pending[i].ID == item.ID) {
        pending[i] = item
        isHas = true
      }
    }
    if (!isHas) pending.push(item)
  },

  initPosition: function(para, data, position) {
    const symbolMap = Store.state.symbolInfo.symbolMap
    const sourceNotify = Store.state.quote.sourceNotify
    for (var i = 0; i < para.Count; i++) {
      var item = data[i]
      var symbolData = symbolMap[Util.getShowPrdCode(item.Symbol)]
      if (!symbolData) {
        continue
      }
      item.symbolData = symbolData
      item.SymbolName = symbolData.name
      item.SName = sourceNotify[symbolData.source]
      item.Volume = Util.fixToStr(item.Volume, 2)
      item.Swap = Util.fixToStr(item.Swap, 2)
      item.Commission = Util.fixToStr(item.Commission, 2)
      item.OpenPrice = Util.fixToStr(item.OpenPrice, symbolData.digits)
      item.StopLoss = Util.fixToStr(item.StopLoss, symbolData.digits)
      item.TakeProfit = Util.fixToStr(item.TakeProfit, symbolData.digits)
      this.pushPosition(item, position)
    }
    position.sort((obj1, obj2) => obj2.OpenTime - obj1.OpenTime)
  },

  updatePosition: function(item, data, symbolMap, sourceNotify, position) {
    var symbolData = symbolMap[Util.getShowPrdCode(item.Symbol)]
    if (!symbolData) {
      return
    }
    item.symbolData = symbolData
    item.SymbolName = symbolData.name
    item.SName = sourceNotify[symbolData.source]
    item.Volume = Util.fixToStr(item.Volume, 2)
    item.Swap = Util.fixToStr(item.Swap, 2)
    item.Commission = Util.fixToStr(item.Commission, 2)
    item.OpenPrice = Util.fixToStr(item.OpenPrice, symbolData.digits)
    item.StopLoss = Util.fixToStr(item.StopLoss, symbolData.digits)
    item.TakeProfit = Util.fixToStr(item.TakeProfit, symbolData.digits)
    this.pushPosition(item, position)
  },

  pushPosition: function(item, position) {
    let isHas = false
    for (const i in position) {
      if (position[i].ID == item.ID) {
        // 覆盖
        position[i] == item
        isHas = true
      }
    }
    if (!isHas) position.push(item)
  },

  initTradeTimeList: function(para, data, symbolTime) {
    const temp = {}
    for (const i in symbolTime) {
      temp[symbolTime[i].ID] = symbolTime[i]
    }
    for (let i = 0; i < para.Count; i++) {
      const item = data[i]
      if (!temp[item.ID]) {
        item.StartHM = Util.formatMinutes(item.StartTime)
        item.EndHM = Util.formatMinutes(item.EndTime)
        symbolTime.push(item)
        temp[item.ID] = item
      }
    }
  },

  getTradeReq: function(Account, symbolInfo) {
    return {
      MsgId: 1701,
      AccountID: Account.accountID,
      Token: Account.token,
      GroupID: Account.groupId,
      Direction: 1, // 买卖方向 - 1. Buy2. Sell
      Type: null, // 订单类型- 0x01.市价建仓；0x02.Limit 建仓；0x04.Stop 建仓；0x08.市价平仓；
      Status: 1, // order status - 1. Placed2. Filled3. Partial filled(not support)4. Cancelled5. Rejected6. Deleted
      ClientType: Constant.ClientType.WEBUI,
      Symbol: symbolInfo.nameOriginal,
      RequestVolume: 0, // 请求手数
      RequestPrice: 0, // 请求价格
      UsePips: 0, // 止盈止损使用點數
      StopLoss: 0, // 止损
      TakeProfit: 0, // 止盈
      StopLossPips: 0, // 止损點數
      TakeProfitPips: 0, // 止盈點數
      RequestTime: 0, // 创建时间
      CreateUserID: 0, // 建倉用戶--UI填0，否则会被当成manager order
      CreateTime: 0, // 创建时间(毫秒)
      Range: symbolInfo.rangeScope, // 服务器最大偏移=用户输入偏移值
      ExpireType: Constant.ExpireType.WEEK, // 過期類型1. 當日有效2. 當週有效3. 指定時間
      ExpireTime: 0, // 過期時間
      TickSeq: 0, // 報價序號
      Comment: '', // 注释
      RefPrice: 0,
      FloatStopLoss: 0 // 移動止損
    }
  },

  getPositionProfitLossReq: function(Account, symbolInfo, positionItem) {
    return {
      MsgId: 1704,
      AccountID: Account.accountID,
      Token: Account.token,
      ID: positionItem.ID,
      GroupID: Account.groupId,
      Direction: positionItem.Direction,
      Status: 1,
      Symbol: symbolInfo.nameOriginal,
      Volume: positionItem.Volume,
      InitVolume: positionItem.InitVolume,
      OpenPrice: positionItem.OpenPrice,
      OpenTime: positionItem.OpenTime,
      OpenSeq: 0,
      ClosePrice: positionItem.ClosePrice,
      CloseTime: 0.0,
      CloseSeq: 0,
      TakeProfit: 0.0,
      StopLoss: 0.0,
      Profit: positionItem.ProfitLoss,
      Swap: positionItem.Swap,
      Commission: positionItem.Commission,
      LastDealID: 0,
      GetLastAccountID: positionItem.AccountID,
      Comment: ''
    }
  },

  getCannelReq: function(Account, pending) {
    return {
      MsgId: '',
      AccountID: Account.accountID,
      Token: Account.token, // 会话会话ID或会话检验码。
      GroupID: Account.groupId,
      ID: pending.ID,
      PositionID: pending.PositionID,
      Status: Constant.OrderStatus.REJECTED,
      Comment: ''
    }
  },

  getModifyReq: function(Account, pending, symbolInfo) {
    return {
      MsgId: 1702,
      AccountID: Account.accountID,
      Token: Account.token,
      ID: pending.ID,
      GroupID: Account.groupId,
      Direction: pending.Direction, // 买卖方向 - 1. Buy2. Sell
      Type: pending.Type, // 订单类型- 0x01.市价建仓0x02.Limit 建仓0x04.Stop 建仓0x08.市价平仓
      Status: 1, // order status - 1. Placed2. Filled3. Partial filled(not support)4. Cancelled5. Rejected6. Deleted
      ClientType: Constant.ClientType.WEBUI,
      Symbol: symbolInfo.nameOriginal,
      RequestVolume: pending.RequestVolume, // 请求手数
      RequestPrice: pending.RequestPrice, // 请求价格
      UsePips: 0, // 止盈止损使用點數
      StopLoss: 0, // 止损
      TakeProfit: 0, // 止盈
      StopLossPips: 0, // 止损點數
      TakeProfitPips: 0, // 止盈點數
      RequestTime: 0, // 创建时间
      CreateUserID: 0, // 建倉用戶--UI填0
      CreateTime: 0, // 创建时间(毫秒)
      Range: pending.Range, // 服务器最大偏移=用户输入偏移值
      ExpireType: pending.ExpireType, // 過期類型1. 當日有效2. 當週有效3. 指定時間
      ExpireTime: 0, // 過期時間
      TickSeq: 0, // 報價序號
      Comment: '', // 注释
      RefPrice: 0,
      FloatStopLoss: 0 // 移動止損
    }
  },
  /**
   * @param value 点数或价格
   * @param ask 卖出价
   * @param bid 买入价
   * @param value 点数或价格
   * @param pip 点值（1 pip值）
   * @param direct 买卖方向（1：买 2：卖）
   * @param type 转换方向（1：点数转价格 2：价格转点数）
   * @param stopType 转换方向（1：止损 2：止盈）
   */
  changePipValue: function(
    value,
    ask,
    bid,
    symbolData,
    direct,
    type,
    stopType
  ) {
    let result = ''
    const pip = symbolData.pipv
    if (type == 1) {
      // 点数转价格
      if (direct == 1) {
        // 买
        if (stopType == 1) {
          // 止损
          result = Util.accSub(
            Number(bid),
            Util.accMul(Number(pip), Number(value))
          )
        } else {
          // 止盈
          result = Util.accAdd(
            Number(bid),
            Util.accMul(Number(pip), Number(value))
          )
        }
      } else {
        // 卖
        if (stopType == 1) {
          // 止损
          result = Util.accAdd(
            Number(ask),
            Util.accMul(Number(pip), Number(value))
          )
        } else {
          // 止盈
          result = Util.accSub(
            Number(ask),
            Util.accMul(Number(pip), Number(value))
          )
        }
      }
    } else {
      // 价格转点数
      if (direct == 1) {
        // 买
        if (stopType == 1) {
          // 止损
          result = Util.accDiv(
            Util.accSub(Number(bid), Number(value)),
            Number(pip)
          )
        } else {
          // 止盈
          result = Util.accDiv(
            Util.accSub(Number(value), Number(bid)),
            Number(pip)
          )
        }
      } else {
        // 卖
        if (stopType == 1) {
          // 止损
          result = Util.accDiv(
            Util.accSub(Number(value), Number(ask)),
            Number(pip)
          )
        } else {
          // 止盈
          result = Util.accDiv(
            Util.accSub(Number(ask), Number(value)),
            Number(pip)
          )
        }
      }
    }
    return Number(result).toFixed(type == 2 ? 1 : symbolData.digits)
  },
  /**
   * 货币转换
   * @param value   买卖价格差
   * @param ask     卖价
   * @param bid     买价
   * @param volume   手数
   * @param symbolData  产品信息
   * @param symbolTickMap  行情数据信息
   * @param direct  买卖方向（1：买，2：卖）
   */
  changeCurrency: function(
    value,
    ask,
    bid,
    volume,
    symbolData,
    symbolTickMap,
    direct
  ) {
    if (symbolData.stockType == 0) {
      // 直接货币：(卖出价-买入价)*合约单位*手数
      return Util.accMul(Util.accMul(value, symbolData.contractSize), volume)
    } else if (symbolData.stockType == 1) {
      // 间接货币：(卖出价-买入价)*合约单位*手数/美元相对货币卖出即时汇率
      return Util.accDiv(
        Util.accMul(value, Util.accMul(symbolData.contractSize, volume)),
        direct == 1 ? ask : bid
      )
    } else if (symbolData.stockType == 2) {
      // 交叉货币直接货币:(卖出价-买入价)*合约单位*手数*该相对货币对兑美元卖出方向的即时汇率
      return Util.accMul(
        Util.accMul(value, symbolData.contractSize),
        Util.accMul(
          volume,
          symbolTickMap[symbolData.relateSymbol][direct == 1 ? 'ask' : 'bid']
        )
      )
    } else if (symbolData.stockType == 3) {
      // 交叉货币间接货币:(卖出价-买入价)*合约单位*手数/该相对货币对兑美元卖出方向的即时汇率
      //console.log("3333",value,ask,bid,volume,symbolData,symbolTickMap,direct)
      return Util.accDiv(
        Util.accMul(value, Util.accMul(symbolData.contractSize, volume)),
        symbolTickMap[symbolData.relateSymbol]?symbolTickMap[symbolData.relateSymbol][direct == 1 ? 'ask' : 'bid']:''
      )
    }else if (symbolData.stockType == 71){
      // 港币货币：(卖出价-买入价)*合约单位*手数/美元港币卖出即时汇率
      return Util.accDiv(
        Util.accMul(value, Util.accMul(symbolData.contractSize, volume)),
        symbolTickMap["USDHKD"]?symbolTickMap["USDHKD"][direct == 1 ? 'ask' : 'bid']:''
      )
    }
  },

  /**
   * 初始化层级保证金
   * @param para
   * @param data
   */
  initMarginList: function(para, data, marginList) {
    for (let i = 0; i < para.Count; i++) {
      this.pushMargin(this.convertMargin(data[i]), marginList)
    }
  },

  pushMargin: function(item, marginList) {
    let isHas = false
    for (const i in marginList) {
      if (marginList[i].ID == item.ID) {
        marginList[i] == item
        isHas = true
      }
    }
    if (!isHas) marginList.push(item)
  },

  /**
   * 保证金转换
   * @param item
   */
  convertMargin: function(item) {
    const o = {
      ID: null,
      SymbolID: null,
      Status: null,
      MarginInitial: null, // 初始保证金
      HolidayMarginInitial: null, // 假期初始保证金
      MarginHedged: null, // 锁仓百分比
      RangeMin: null, // 手数下线
      RangeMax: null // 手数上线
    }
    for (const i in o) {
      o[i] = item[i]
    }
    return o
  },

  /**
   * 层级保证金计算
   * @constructor
   */
  getMargin: function(volume, symbolData, direction, positionList) {
    var refMargin = 0.0 // 参考保证金
    var volumeInput = isNaN(Number(volume)) ? 0.0 : Number(volume) // 手数
    if (Store.state.group.marginType == 1) {
      // 1表示设置了层级保证金
      // 1.根据产品编号取出本用户持该产品的同方向的总手数 oldVolume（如果页面单选为卖，则取出持仓中总共卖出该产品的总手数）
      var oldVolume = 0.0 // 原来持仓同方向改产品的总手数
      var symbol = symbolData.name
      var positionMarginRate = 0 // 持仓总汇率权值 = 所持仓手数*汇率的和
      for (var i = 0; i < positionList.length; i++) {
        if (
          symbol == positionList[i].SymbolName &&
          direction == positionList[i].Direction
        ) {
          oldVolume += Number(positionList[i].Volume)
          positionMarginRate +=
            Number(positionList[i].Volume) *
            Number(positionList[i].OpenMarginRate)
        }
      }
      // 2.取出该产品的层级保证金规则
      var marginLevel = this.getMarginLevel(symbolData.id)
      var totalRate =
        volumeInput + oldVolume == 0
          ? 0
          : (volumeInput * this.getUsdAccMidPrice() + positionMarginRate) /
            (volumeInput + oldVolume) // 总手数加权汇率平均值
      var positionRate = oldVolume == 0 ? 0 : positionMarginRate / oldVolume // 持仓加权汇率平均值
      // 3.计算该产品参考保证金=保证金1（产品开仓手数+持仓中该产品同方向的手数根据层级算出保证金）-保证金2（持仓中该产品同开仓方向的手数根据层级算出保证金）
      refMargin = (
        this.computeMarginByVolume(marginLevel, oldVolume + volumeInput) *
          totalRate -
        this.computeMarginByVolume(marginLevel, oldVolume) * positionRate
      ).toFixed(2)
    } else {
      refMargin = (
        Util.accMul(symbolData.marginInitial, this.getUsdAccMidPrice()) *
        volumeInput
      ).toFixed(2) // 没有设置层级保证金就用手数*初始保证金
    }
    return refMargin
  },

  getMarginLevel: function(symbolId) {
    const result = []
    const marginList = Store.state.symbolInfo.marginList
    for (const i in marginList) {
      const item = marginList[i]
      if (symbolId == item.SymbolID) {
        result.push(item)
      }
    }
    return result.sort((x, y) => (x.RangeMin < y.RangeMin ? -1 : 1))
  },

  getUsdAccMidPrice: function() {
    if (Store.state.group.midSymbol) {
      var quoteData =
        Store.state.quote.symbolTickMap[Store.state.group.midSymbol]
      if (!quoteData) return 0
      return quoteData.newP
    }
    return 1
  },

  computeMarginByVolume: function(marginLevel, volume) {
    var marginNum = 0
    for (var i = 0; i < marginLevel.length; i++) {
      // 如果手数volume比设置的最后一层的最大手数还要大时，后面的保证金同最后一层的算法一致
      var tempVolume =
        volume <= marginLevel[i].RangeMax ||
        (i == marginLevel.length - 1 && volume > marginLevel[i].RangeMax)
          ? volume - marginLevel[i].RangeMin
          : marginLevel[i].RangeMax - marginLevel[i].RangeMin
      marginNum += marginLevel[i].MarginInitial * tempVolume
      if (volume <= marginLevel[i].RangeMax) {
        break
      }
    }
    return marginNum
  },

  /**
   * k线图转换
   * type 1:5分钟转15分钟  2:5分钟转30分钟
   */
  transKcharts: function(type, historyTick) {
    const tempArr = this.copy(historyTick)
    const arr = []
    let temp = []
    // 去头
    let start = 0
    let end = tempArr.length

    for (let i = 0; i < tempArr.length; i++) {
      const time = tempArr[i].tm * 1000
      const min = new Date(time).getMinutes()
      if (min % (type == 1 ? 15 : 30) == 0) {
        start = i
        break
      }
    }

    for (let i = tempArr.length - 1; i >= 0; i--) {
      const time = tempArr[i].tm * 1000
      const min = new Date(time).getMinutes()
      if (min % (type == 1 ? 15 : 30) == 0) {
        end = i
        break
      }
    }

    const arrData = tempArr.splice(start + 1, end + 1)

    for (let i = 0; i < arrData.length; i++) {
      temp.push(arrData[i])
      const data = {}
      const time = arrData[i].tm * 1000
      const min = new Date(time).getMinutes()
      if (min % (type == 1 ? 15 : 30) == 0) {
        data.tm = temp[temp.length - 1].tm
        data.begin = temp[0].begin
        data.end = temp[temp.length - 1].end
        data.highest = temp.sort((x, y) => Number(y.highest) - Number(x.highest))[0].highest
        data.lowest = temp.sort((x, y) => Number(x.lowest) - Number(y.lowest))[0].lowest
        temp = []
        arr.push(data)
      }
    }

    return arr
  },
  transKcharts2: function(type, historyTick) {
    var fullLength = historyTick.length

    const tempArr = this.copy(historyTick)
    const arr = []
    let temp = []
    let lasttemp=[]

    // 去头
    let start = 0
    let end = tempArr.length

    for (let i = 0; i < tempArr.length; i++) {
      const time = tempArr[i].tm * 1000
      const min = new Date(time).getMinutes()
      if ((type == 1 ? (min-5) : min) % (type == 1 ? 15 : 30) == 0) {
        start = i
        break
      }
    }
    const arrData = tempArr.splice(start, end + 1)

    for (let i = 0; i < arrData.length; i++) {
      temp.push(arrData[i])
      const data = {}
      const time = arrData[i].tm * 1000
      const min = new Date(time).getMinutes()
      if (min % (type == 1 ? 15 : 30) == 0) {
        //console.log(min,temp)
        data.tm = temp[temp.length - 1].tm
        data.begin = temp[0].begin
        data.end = temp[temp.length - 1].end
        data.highest = temp.sort((x, y) => Number(y.highest) - Number(x.highest))[0].highest
        data.lowest = temp.sort((x, y) => Number(x.lowest) - Number(y.lowest))[0].lowest
        temp = []
        arr.push(data)
      }
    }

    var remain_num = arr.length*3 + start  //未使用数组下标

    if(type==1){

      for (let i = fullLength-1 ; i >= remain_num; i--) {
        lasttemp.push(historyTick[i])
      }
      if(lasttemp.length==1){
        const data = {}
        data.tm = lasttemp[0].tm + 600
        data.begin = lasttemp[0].begin
        data.end = lasttemp[0].end
        data.highest = lasttemp[0].highest
        data.lowest = lasttemp[0].lowest
        arr.push(data)
        //console.log("1追加新数组",data)
      }else if(lasttemp.length==2){
        const data = {}
        data.tm = lasttemp[1].tm + 600
        data.begin = lasttemp[1].begin
        data.end = lasttemp[0].end
        data.highest = lasttemp.sort((x, y) => Number(y.highest) - Number(x.highest))[0].highest
        data.lowest = lasttemp.sort((x, y) => Number(x.lowest) - Number(y.lowest))[0].lowest
        arr.push(data)
        //console.log("2追加新数组",data)
      }
      return arr
    }else{
      return arr
    }    
  },
  getFailMsg: function(errcode, symbolInfo, group) {
    var errmsg = null
    if (errcode == 73) {
      errmsg = Util.getWebUIError(errcode, false, [
        symbolInfo.stopLevel,
        symbolInfo.maxStopLevel
      ])
    } else if (errcode == 74) {
      errmsg = Util.getWebUIError(
        errcode,
        false,
        Util.fixToStr(group.volumesMax, 2)
      )
    } else if (errcode == 83) {
      errmsg = Util.getWebUIError(errcode, false, group.orderMax)
    } else if (errcode == 89) {
      errmsg = Util.getWebUIError(errcode, false, symbolInfo.volumesStep)
    } else {
      errmsg = Util.getWebUIError(errcode)
    }
    return errmsg
  },
  saveRange: function(source, range) {
    const rangeObj = StorageUtil.readRange()
    rangeObj[source] = range
    StorageUtil.saveRange(rangeObj)
  },
  readRange: function() {
    return StorageUtil.readRange()
  },
  readRangeBySource: function(source) {
    const range = StorageUtil.readRange()
    return range[source]
  },
  kLineDataGroup : function(list,TimeType) {
    if (!Array.isArray(list)) return console.error('list must be Array!')
    let data = list.slice(0)
    this.handleLatelyData(data,TimeType) // 补充数据
    data = this.groupByDay(data,TimeType)
    const result = []
    data.forEach(el => {
        result.push(...this.splitBy4Hour(el,TimeType))
    })
    // 最后一组数据可能不完全4小时的数据，删除掉，下次重新拉取
    //result.splice(result.length - 1, 1)
    //console.log('最终的4小时newData', result)
    return result
  },
  handleLatelyData : function (list,TimeType) {
    if (list.length === 0) return list
    const lately = list[0]
    const time = lately.tm
    //console.log("handleLatelyData最初数据",time)
    const hour = parseInt(dayjs(time*1000).hour())
    const m = hour % TimeType
    if (m === 0) return list
    for (let i = 1; i <= TimeType - m; i++) {
        const fillItem = Object.assign({}, lately)
        fillItem.tm = dayjs(time * 1000).add(i,'hour').unix()
        //fillItem.time = dayjs(time * 1000).add(i, 'hour').format('YYYY-MM-DD HH:mm:ss')
        list.unshift(fillItem)
    }
    return list
  },
  groupByDay : function (list,TimeType) {
    const result = []
    let prevItemTime = ''
    let prevArr = []
    list.forEach((el, i) => {

      const itemDay = dayjs(el.tm * 1000).subtract(1,'hour').format('YYYY-MM-DD')

      //console.log("itemDayitemDay",el)
      if (i === 0) {
        prevArr.push(el)
        result.push(prevArr)
        //console.log("groupByDay1",el)
      } else {
        const prevDay = dayjs(prevItemTime * 1000).subtract(1,'hour').format('YYYY-MM-DD')
        if (itemDay === prevDay && dayjs(el.tm * 1000).subtract(1,'hour').format('HH:mm:ss') !== '00:00:00') {
            prevArr.push(el)
            //console.log("groupByDay2")
        } else if (dayjs(el.tm * 1000).subtract(1,'hour').format('HH:mm:ss') === '00:00:00') {
            prevArr = [el] // 新的一天的数据
            result.push(prevArr)
            //console.log("groupByDay3")
        } else if (dayjs(prevItemTime).subtract(1,'hour').format('YYYY-MM-DD') === itemDay) {
            prevArr.push(el)
            //console.log("groupByDay4")
        } else {
            prevArr = [el] // 新的一天的数据
            result.push(prevArr)
            //console.log("groupByDay5")
        }
      }
      prevItemTime = el.tm
    })
    //console.log("分组后的时间",result)
    return result
  },
  splitBy4Hour : function (list,TimeType) {
    const hours = []
    let item = []
    //console.log('最初splitBy4Hour', list)

    list.forEach((el, i) => {
        const time = el.tm

        const m = (dayjs(time * 1000).hour()-1) % TimeType

        if (i === 0 || m === 0 || dayjs(item[0]*1000).unix() - dayjs(time*1000).unix() >= TimeType * 60 * 60) {
            item = [el]
            hours.push(item)
        } else {
            item.push(el)
        }

    })


    //console.log("---------------4个小时分组的结果",hours)


    // console.log('hours', hours[0][0]['time'], hours)
    // 最后一组数据可能不完全4小时的数据，删除掉，下次重新拉取
    // const lastHourArr = hours[hours.length - 1]
    // hours.splice(hours.length - 1, 1)
    const result = []
    hours.forEach(el => {
        result.push(this.mergerBy4Hour(el,TimeType))
    })
    //console.log("最终splitBy4Hour",result)
    return result
  },
  mergerBy4Hour : function (list,TimeType) {
    //console.log("合并前mergerBy4Hour",list)
    const len = list.length
    const result = Object.assign({}, list[len - 1])
    const time = list[0].tm

    // 先计算这组数据属于哪个时间点
    if (dayjs(time * 1000).format('HH:mm:ss') === '00:00:00') {
      //console.log("875",dayjs(time * 1000).format('HH:mm:ss'))
      result.tm = time
    } else {
      const day = dayjs(time * 1000).format('YYYY-MM-DD')
      let hour = parseInt(dayjs(time * 1000).hour())
      hour = Math.ceil(hour / TimeType) * TimeType
      result.tm = dayjs(day).hour(hour).unix()
    }

    list.forEach((el, i) => {
      if (result.highest < el.highest) {
        result.highest = el.highest
      }
      if (result.lowest > el.lowest) {
        result.lowest = el.lowest
      }
      if(i == 0){
        result.begin = el.begin
      }
    })    
    //console.log("最终mergerBy4Hour",result)
    return result
  }


}
