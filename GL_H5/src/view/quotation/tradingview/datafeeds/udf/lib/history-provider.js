import Constant from '@/utils/Constant'
import TradeUtil from "@/utils/tradeUtil"
import dayjs from 'dayjs'

const timeZone = dayjs().utcOffset() * 60 * 1000 // 时区，单位为分钟

let leftTime = null // 最左侧K线时间

var HistoryProvider = /** @class */ (function () {
    function HistoryProvider (datafeedUrl, requester, vm) {
        this._datafeedUrl = datafeedUrl
        this._requester = requester
        this.vm = vm
        this.dataList = []
    }
    HistoryProvider.prototype.getBars = function (symbolInfo, resolution, from, to, first) {
        //console.log("getBarsgetBars",symbolInfo,resolution,first,dayjs(from*1000).format('YYYY/MM/DD HH:mm:ss'),dayjs(to*1000).format('YYYY/MM/DD HH:mm:ss'))
        var _this = this
        if (!first) {
            to = leftTime - 1
        }
        this.vm.loading = true
        var meta = { noData: false }
        // 历史K线
        let getFunc = null
        if (_this.vm.activeTab === 'timeSharing') {
            // 请求分时数据，但不用于trandingview图表，所以仅执行却不返回给gatBars
            //console.log("请求分时数据，但不用于trandingview图表，所以仅执行却不返回给gatBars")
            getTimeSharing(symbolInfo.ticker, resolution, _this.vm, from * 1000, to * 1000, first)
            getFunc = () => Promise.reject()
        } else {
            // 用于请求trandingview图表所需数据
            //console.log("用于请求trandingview图表所需数据")
            getFunc = () => getKlineData(symbolInfo.ticker, resolution, _this.vm, from * 1000, to * 1000, first)
        }

        return getFunc().then(list => {
                this.vm.loading = false
                list[0] && (leftTime = list[0].timeStr)
                if (list.length < 400) {
                    meta.noData = true
                }
                if (first) {
                    _this.vm.tvWidget
                        .activeChart()
                        .onDataLoaded()
                        .subscribe(
                            null,
                            () => {
                                _this.vm.resetZoom(list)
                            },
                            true
                        )
                }

                return {
                    bars: list,
                    meta
                }
            })
            .catch(error => {
                console.log("error61",error)
                this.vm.loading = false
                var meta = { noData: true }
                return {
                    bars: [],
                    meta
                }
            })
    }
    return HistoryProvider
})()
export { HistoryProvider }

/** 根据接口获取K线数据
 * @params {Number} code_id 产品id
 * @params {Object} vm vue实例
 * @params {Number} from 开始时间的时间戳
 * @params {Number} to 结束时间的时间戳
 * @return {Array} K线数据列表
 */
function getKlineData (code_id, ktype, vm, from, to, first) {

    return new Promise((resolve, reject) => {

        let startTime = first ? 0 : dayjs(to).unix()
        //console.log("加载socket的startTime",first?0:dayjs(startTime*1000).format("YYYY-M-D HH:mm:ss"))
        
        const params = {
            "5" : { "param" : { time: startTime, num: 500, period_num: 5, period_type: 1, flag: 0 }, "index" : 1 },
            "15" : { "param" : { time: startTime, num: 500, period_num: 5, period_type: 1, flag: 0 }, "index" : 2 },
            "30" : { "param" : { time: startTime, num: 500, period_num: 5, period_type: 1, flag: 0 }, "index" : 3 },
            "60": { "param" : { time: startTime, num: 500, period_num: 1, period_type: 2, flag: 0 }, "index" : 4 },
            "1D": { "param" : { time: startTime, num: 500, period_num: 0, period_type: 3, flag: 0 }, "index" : 5 },
            "1" : { "param" : { time: startTime, num: 500, period_num: 1, period_type: 1, flag: 0 }, "index" : 6 },
            "120": { "param" : { time: startTime, num: 500, period_num: 1, period_type: 2, flag: 0 }, "index" : 99 },
            "240": { "param" : { time: startTime, num: 500, period_num: 1, period_type: 2, flag: 0 }, "index" : 9 },
            "1W": { "param" : { time: startTime, num: 500, period_num: 1, period_type: 4, flag: 0 }, "index" : 7 },
            "1M": { "param" : { time: startTime, num: 500, period_num: 0, period_type: 5, flag: 0 }, "index" : 8 },
        }

        //const seq = parseInt('' + code_id + params[ktype].index)
        const msgTimeStr = String(new Date().getTime()).slice(5)
        //console.log("请求K图socket",ktype,msgTimeStr)
        //const toast1 = vm.$toast.loading({duration: 0});

        vm.socket.quoteSocket.emit('request',
            Number(Constant.Req.quoteQuery),
            Object.assign(params[ktype].param, {
                code: Number(code_id),
                seq: msgTimeStr
            })
        )

        vm.socket.quoteSocket.on('quote_query', (param, list) => {
            const seq = param.seq
            if (msgTimeStr == seq){

                let history = []
                for (const i in list) {
                    history.push(list[i])
                }
                history.reverse()
                if(ktype=="15"){
                    history = TradeUtil.transKcharts(1, history)
                }else if(ktype=="30"){
                    history = TradeUtil.transKcharts(2, history)
                }else if(ktype=="120"){
                    history = TradeUtil.kLineDataGroup(history,2)
                }else if(ktype=="240"){
                    history = TradeUtil.kLineDataGroup(history,1)
                }
                
                let arr2 =[]
                for (const i in history) {
                    const arrData = {}
                    const data = history[i]
                    arrData["time"] = data.tm * 1000
                    arrData["timeStr"] = data.tm
                    arrData["high"] = data.highest
                    arrData["low"] = data.lowest            
                    arrData["open"] = data.begin
                    arrData["close"] = data.end
                    arr2.push(arrData)
                }
                //arr2.sort((a, b) => a.time - b.time)
                //toast1.clear()
                //console.log("arr2arr2",arr2)
                resolve(arr2)
            }
        })

        // setTimeout(() => {
        //     const arr2 =[]
        //     const list = vm.quote.historyTick[seq]
        //     for (const i in list) {
        //         const arrData = {}
        //         const data = list[i]
        //         arrData["time"] = data.tm * 1000
        //         arrData["timeStr"] = data.tm
        //         arrData["high"] = data.highest
        //         arrData["low"] = data.lowest            
        //         arrData["open"] = data.begin
        //         arrData["close"] = data.end
        //         arr2.push(arrData)
        //     }
        //     arr2.sort((a, b) => a.time - b.time)
        //     console.log("arr2arr2",arr2)
        //     resolve(arr2)
        // }, 500);
        
    })
}

/** 根据接口获取分时数据
 * @params {Number} code_id 产品id
 * @params {Object} vm vue实例
 * @params {Number} from 开始时间的时间戳
 * @params {Number} to 结束时间的时间戳
 * @return {Array} K线数据列表
 */
function getTimeSharing (code_id, ktype, vm, from, to, first) {
    return requestTimeSharingData(code_id, ktype, vm, from, to, first).then(list => {
        //console.log({ list })
        const newList = list.map(el => {
            return {
                time: el.time * 1000,
                close: el.close
            }
        })
        if (newList.length > 0) {
            newList.sort((a, b) => a.time - b.time)
        }
        return newList
    })
}

// 请求分时数据
function requestTimeSharingData (code_id, ktype, vm, from, to, first, result = []) {
    return new Promise((resolve, reject) => {
        const param =  {
            time: 0,
            timehis: 0
        }
        console.log("请求分时socket")
        const seq = parseInt('' + code_id + 0)
        vm.socket.quoteSocket.emit('request',
            Number(Constant.Req.quoteMin),
            Object.assign(param, {
                code: Number(code_id),
                seq: seq
            })
        )

        vm.socket.quoteSocket.on('uptrend_query', (param, list) => {
            //console.log("uptrend_querydata",list)
            const arr = []
            for (const i in list) {
                const arrData = {}
                const data = list[i]
                arrData["time"] = data.T
                arrData["price_close"] = data.U
                arr.push(arrData)
            }
            let chartData = []
            chartData = arr.map(item => {
                const result = {
                    time: item.time,
                    close: item.price_close
                };
                ['price_close'].forEach(key => {
                    delete item[key]
                })
                return {
                    ...item,
                    ...result
                }
            })
            //console.log("chartDatachartData",chartData)
            let start_time = arr[0].time
            let schedule_day = [{
                "schedule_time":[{
                    "start_time": start_time,
                    "end_time": start_time + 86400
                }]
            }]
            vm && typeof vm.updateTSData === 'function' && vm.updateTSData({schedule_day: schedule_day,chartData})
            resolve(chartData)

        })
    })
}