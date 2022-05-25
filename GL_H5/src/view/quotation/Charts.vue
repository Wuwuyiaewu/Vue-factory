<template>
  <div class="chart">
    <div class="content">

      <div class="price_box">

        <div class="price_left">
          <span :class="isNewP(data)">{{ data.newP }}<em class="arrowbold"></em></span>
          <p
            v-if="isOks(data.rate)"
            :class="isOks(util.accSub(data.newP, data.preclose))"
          >
            <i>+</i>{{ util.accSub(data.newP, data.preclose)
            }}<label v-if="data.rate">{{ data.rate.toFixed(2) }}%</label>
          </p>
        </div>
        <div class="price_right">
          <ul>
            <li>今开&nbsp;<span :class="isOpen(data)">{{ data.open }}</span></li>
            <li>最高&nbsp;<span :class="isHigh(data)">{{ data.high }}</span></li>
            <li>昨收&nbsp;<span :class="isPreclose(data)">{{ data.preclose }}</span></li>
            <li>最低&nbsp;<span :class="isLow(data)">{{ data.low }}</span></li>
          </ul>
        </div>

      </div>
      

      <div class="chartNav">
        <ul>
          <li
            v-for="(item, index) in kType"
            :key="'ketyp-' + index"
            :class="{ checked: typeIndex == index }"
            @click="changeType(index)"
          >{{ item.name }}
          </li>
        </ul>
      </div>

      <div v-if="chartType == 0" class="clchart">
        <div id="myChart1" class="myChart" />
      </div>
      <div v-if="chartType != 0" class="clchart">
        <div id="myChart" class="myChart" />
      </div>
      <div hidden="hidden">{{ chartData }}</div>
    </div>
  </div>
</template>

<script>
require('@/assets/css/charts.css')
import { mapState } from 'vuex'
import Constant from '@/utils/Constant'
import Util from '@/utils/tradeDataUtil'

const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/candlestick')
// 引入提示框和标题组件
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')
// require('echarts/lib/component/title');
require('echarts/lib/component/dataZoom')
export default {
  name: 'Charts',
  components: {},
  filters: {
    time(longTime) {
      return Util.formatDate(longTime, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  props: {
    code: {
      type: Number,
      default: () => 3552563
    },
    isSlider: {
      type: Boolean,
      default: () => true
    },
    view: {
      type: String,
      default: () => 'index'
    }
  },
  data() {
    return {
      myChart: null,
      chartType: 0,
      util: Util,
      typeIndex: 0,
      kType: [
        { name: '分时', param: { time: 0, timehis: 0 }},
        {
          name: '5分',
          param: { time: 0, num: 500, period_num: 5, period_type: 1, flag: 0 }
        },
        {
          name: '15分',
          param: { time: 0, num: 500, period_num: 5, period_type: 1, flag: 0 }
        },
        {
          name: '30分',
          param: { time: 0, num: 500, period_num: 5, period_type: 1, flag: 0 }
        },
        {
          name: '1小时',
          param: { time: 0, num: 500, period_num: 1, period_type: 2, flag: 0 }
        },
        {
          name: '日线',
          param: { time: 0, num: 500, period_num: 0, period_type: 3, flag: 0 }
        }
      ],
      chartLog: {
        code: 0,
        typeIndex: 0
      },
      isShow: false,
      loadFinsh: false,
      sign: process.env.VUE_APP_GA_SIGN,
      uiCodeIDs: JSON.parse(process.env.VUE_APP_PRODUCTS)
    }
  },
  computed: {
    ...mapState(['quote', 'socket', 'symbolInfo', 'user']),
    codes: {
      get() {
        let index = 0
        let codeArr
        const { tickList, notify } = this.quote
        const me = notify[this.code]
        if (me.uchZone !== 7) {
          codeArr = tickList.reduce((arr, ele) => {
            return notify[ele.uiCodeID].uchZone === me.uchZone ? [...arr, ele.uiCodeID] : arr
          }, [])
        } else {
          const genre = Number(this.$route.query.genre || sessionStorage.getItem('quotationView/genre') || '2')
          const openTime = (genre === 71 ? notify[3158324] : notify[3486516]).open
          codeArr = tickList.reduce((arr, ele) => {
            return notify[ele.uiCodeID].uchZone === 7 && notify[ele.uiCodeID].open === openTime ? [...arr, ele.uiCodeID] : arr
          }, [])
        }
        for (const i in codeArr) {
          if (this.code === codeArr[i]) index = parseInt(i)
        }
        return {
          codeArr: codeArr,
          index: index
        }
      }
    },
    data: {
      get() {
        return this.quote.codeTickMap[this.code] || {}
      }
    },
    chartData: {
      get() {
        const arr = []
        if (!this.quote.notify[this.code]) return arr
        if (this.chartLog.code !== this.code || this.chartLog.typeIndex !== this.typeIndex) {
          this.requestData(this.code, this.typeIndex)
          this.chartLog.code = this.code
          this.chartLog.typeIndex = this.typeIndex
          return arr
        }
        const historyList = this.quote.historyTick[
          String(this.code) + String(this.typeIndex)
        ]
        let digits = this.quote.notify[this.code].uiDigit


        if (this.typeIndex === 0) {

          for (const i in historyList) {
            const arrData = []
            const data = historyList[i]
            arrData[0] = Util.formatDate(data.T * 1000, 'hh:mm')
            arrData[1] = Number(data.U).toFixed(digits)
            arr.push(arrData)
          }

          const mychart = document.getElementById('myChart1')
          if (mychart && arr.length > 0 && this.loadFinsh) {
            this.$nextTick(() => {
              this.drawUptrend(arr)
            })
            this.loadFinsh = false
          }


        } else {
          // 交易列表有数据，则去交易类表的报价小数位（行情的报价小数位是针对游客的）
          if (
            this.symbolInfo.codeMap[this.quote.notify[this.code].uiSourceCode]
          ) {
            digits = this.symbolInfo.codeMap[
              this.quote.notify[this.code].uiSourceCode
            ].digits
          }
          for (const i in historyList) {
            const arrData = []
            const data = historyList[i]
            if (this.typeIndex !== 5) { arrData[0] = Util.formatDate(data.tm * 1000, 'MM/dd hh:mm') } else arrData[0] = Util.formatDate(data.tm * 1000, 'yyyy/MM/dd')
            arrData[1] = Number(data.begin).toFixed(digits)
            arrData[2] = Number(data.end).toFixed(digits)
            arrData[3] = Number(data.lowest).toFixed(digits)
            arrData[4] = Number(data.highest).toFixed(digits)
            arr.push(arrData)
          }
          const mychart = document.getElementById('myChart')
          if (mychart && arr.length > 0 && this.loadFinsh) {
            this.$nextTick(() => {
              this.draw(arr)
            })
            this.loadFinsh = false
          }
          return arr
        }
      },
      set(val) {}
    }
  },
  watch: {
    code: function(newValue) {
      this.typeIndex = 0
      this.chartType = 0
      this.loading()
    }
  },
  mounted() {
    this.loading()
  },
  methods: {
    console(data){
      console.log(data)
    },
    calculateMA(dayCount, data) {
      var result = []
      for (var i = 0, len = data.length; i < len; i++) {
        if (i < dayCount) {
          result.push('-')
          continue
        }
        var sum = 0
        for (var j = 0; j < dayCount; j++) {
          sum += data[i - j][1]
        }
        result.push(sum / dayCount)
      }
      return result
    },
    // 分时图
    drawUptrend(rawData) {
      if (this.myChart) this.myChart.hideLoading()
      const myChart = this.myChart || echarts.init(document.getElementById('myChart1'))
      const xdatas = rawData.map(function(item) {
        return item[0]
      })
      const data = rawData.map(function(item) {
        return item[1]
      })
      let digits = this.quote.notify[this.code].uiDigit
      if (this.symbolInfo.codeMap[this.quote.notify[this.code].uiSourceCode]) {
        digits = this.symbolInfo.codeMap[
          this.quote.notify[this.code].uiSourceCode
        ].digits
      }
      // const data1 = JSON.parse(JSON.stringify(data)).sort((a, b) => a - b)
      // const splitValue = Number(
      //   (data1[data1.length - 1] - data1[0]) / 5
      // ).toFixed(digits)
      myChart.setOption(
        {
          dataZoom: [
            {
              // 这个dataZoom组件，默认控制x轴。
              type: 'inside', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
              start: 90,
              end: 100,
              preventDefaultMouseMove: false
            }
          ],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: false,
              type: 'cross',
              lineStyle: {
                type: 'dashed',
                color: '#65B3EF',
                width: 1,
                opacity: 1
              }
            },
            formatter(param) {
              param = param[0]
              return Number(param.data).toFixed(digits)
            }
          },
          grid: {
            containLabel: true,
            left: '0%',
            right: '2%',
            bottom: '4%',
            top: '4%',
            tooltip: {
              axisPointer: {
                label: {
                  backgroundColor: '#65B3EF',
                  precision: digits
                },
                crossStyle: {
                  color: '#65B3EF',
                  type: 'dashed'
                }
              }
            }
          },
          xAxis: {
            type: 'category',
            data: xdatas,
            boundaryGap: false,
            axisTick: { show: false },
            axisLabel: {
              color: '#999'
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                // 使用深浅的间隔色
                color: '#ddd',
                width: 0.5
              }
            }
          },
          yAxis: {
            type: 'value',
            scale: true,
            position: 'right',
            boundaryGap: true,
            min: 'dataMin',
            max: 'dataMax',
            axisTick: { show: false },
            axisLabel: {
              formatter: function(value) {
                return value.toFixed(digits)
              },
              color: '#999'
            },
            // 十字光标标签样式
            axisPointer: {
              label: {
                formatter(param) {
                  return Number(param.value).toFixed(digits)
                }
              }
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                // 使用深浅的间隔色
                color: '#ddd',
                width: 0.5
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'solid',
                width: '0.5',
                // 使用深浅的间隔色
                color: '#ddd'
              }
            },
          },
          animation: false,
          series: [
            {
              type: 'line',
              data: data,
              symbol: 'none',
              lineStyle: {
                color: '#65B3EF',
                width: '0.5'
              },
              areaStyle: {
                color: 'rgba(10,149,255,.3)'
              }
            }
          ]
        },
        true
      )
    },
    // k线图
    draw(rawData) {
      const dates = rawData.map(function(item) {
        return item[0]
      })
      const data = rawData.map(function(item) {
        return [+item[1], +item[2], +item[3], +item[4]]
      })
      if (this.myChart) this.myChart.hideLoading()
      const myChart =
        this.myChart || echarts.init(document.getElementById('myChart'))
      let digits = this.quote.notify[this.code].uiDigit
      if (this.symbolInfo.codeMap[this.quote.notify[this.code].uiSourceCode]) {
        digits = this.symbolInfo.codeMap[
          this.quote.notify[this.code].uiSourceCode
        ].digits
      }
      const start = 100 - Number((40 / rawData.length) * 100).toFixed(0)
      myChart.setOption(
        {
          toolbox: {
            show: false
          },
          grid: {
            left: '0%',
            right: '2%%',
            bottom: '2%',
            top: '-2%',
            containLabel: true,
            tooltip: {
              axisPointer: {
                label: {
                  backgroundColor: '#65B3EF',
                  precision: digits
                },
                crossStyle: {
                  color: '#65B3EF',
                  type: 'dashed'
                }
              }
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: false,
              type: 'cross',
              lineStyle: {
                type: 'dashed',
                color: '#65B3EF',
                width: 1,
                opacity: 1
              }
            },
            formatter(param) {
              param = param[0]
              return [
                '时间: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                '开: ' + param.data[1].toFixed(digits) + '<br/>',
                '高: ' + param.data[4].toFixed(digits) + '<br/>',
                '低: ' + param.data[3].toFixed(digits) + '<br/>',
                '收: ' + param.data[2].toFixed(digits) + '<br/>'
              ].join('')
            }
          },
          xAxis: {
            type: 'category',
            data: dates,
            boundaryGap: true,
            axisLine: {
              lineStyle: {
                show: true,
                type: 'solid',
                // 使用深浅的间隔色
                color: '#ddd',
                width: 0.5
              }
            },
            axisLabel: {
              interval: 15,
              color: '#999',
              formatter: function(value) {
                value = '         ' + value
                return value
              }
            },
            axisTick: { show: false }
          },
          yAxis: {
            type: 'value',
            scale: true,
            axisLine: {
              lineStyle: {
                type: 'solid',
                // 使用深浅的间隔色
                color: '#ddd',
                width: 0.5
              }
            },
            // 十字光标标签样式
            axisPointer: {
              label: {
                formatter(param) {
                  return Number(param.value).toFixed(digits)
                }
              }
            },
            axisLabel: {
              formatter: function(value, index) {
                return value.toFixed(digits)
              },
              color: '#999'
            },
            position: 'right',
            splitLine: {
              show: true,
              lineStyle: {
                type: 'solid',
                width: '0.5',
                // 使用深浅的间隔色
                color: '#ddd'
              }
            },
            axisTick: { show: false }
          },
          dataZoom: [
            {
              // 这个dataZoom组件，默认控制x轴。
              type: 'inside', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
              start: start,
              end: 100,
              preventDefaultMouseMove: false
            }
          ],
          animation: false,
          series: [
            {
              type: 'candlestick',
              name: '日K',
              data: data,
              itemStyle: {
                normal: {
                  color: '#56c563',
                  color0: '#fb605a',
                  borderColor: '#56c563',
                  borderColor0: '#fb605a'
                }
              },
              barWidth: '75%'
            }
          ]
        },
        true
      )
    },
    back() {
      if (this.isSlider === true) {
        const tabIndex = this.$route.query.tabIndex ? Number(this.$route.query.tabIndex) : 0
        const viewType = Number(sessionStorage.getItem('quotationView/viewType') || '0')
        const path = viewType === 0 ? '/home/QuotationView' : '/home/Quotation'
        if (this.view === 'view') {
          this.$router.push({ path: path, query: { tabIndex }})
        } else if (this.view === 'index') {
          this.$router.push({ path: '/home' })
        } else {
          this.$router.push({ path: path, query: { tabIndex }})
        }
      } else {
        this.$router.go(-1)
      }
    },
    clickLeft: function() {
      this.typeIndex = 0
      if (this.codes.index === 0) this.codes.index = this.codes.codeArr.length
      this.chartType = 0
      this.changeCode(this.codes.codeArr[--this.codes.index])
    },
    clickRight: function() {
      this.typeIndex = 0
      if (this.codes.index === this.codes.codeArr.length - 1) { this.codes.index = -1 }
      this.chartType = 0
      this.changeCode(this.codes.codeArr[++this.codes.index])
    },
    requestData(code, index) {
      if (this.socket.quoteSocket && this.socket.quoteSocket.connected) {
        if (index === 0) {
          this.socket.quoteSocket.emit(
            'request',
            Number(Constant.Req.quoteMin),
            Object.assign(this.kType[index].param, {
              code: code,
              seq: parseInt('' + code + index)
            })
          )
        } else {
          this.socket.quoteSocket.emit(
            'request',
            Number(Constant.Req.quoteQuery),
            Object.assign(this.kType[index].param, {
              code: code,
              seq: parseInt('' + code + index)
            })
          )
        }
      } else {
        //console.log(this.socket.quoteSocket)
      }
    },
    changeType(index) {
      this.typeIndex = index
      this.chartType = index === 0 ? 0 : 1
      this.loading()
    },
    // 切换k线图的切换效果
    loading() {
      this.$nextTick(() => {
        this.myChart = echarts.init(
          document.getElementById(this.chartType === 0 ? 'myChart1' : 'myChart')
        )
        // 加载动画效果
        this.myChart.showLoading({
          text: '',
          color: '#999',
          textColor: '#333',
          maskColor: 'rgba(255, 255, 255, 1)'
        })
        this.loadFinsh = true // 加载完毕
      })
    },
    isOks: function(obj) {
      var val
      if (obj > 0) {
        val = 'rise'
      } else if (obj === 0) {
        val = 'level'
      } else {
        val = 'fall'
      }
      return val
    },
    isHigh: function(obj) {
      var val
      if (obj.preData) {
        if (Number(obj.high) > Number(obj.preData.high)) {
          val = 'rise'
        } else if (Number(obj.high) < Number(obj.preData.high)) {
          val = 'fall'
        } else {
          val = 'level'
        }
      } else {
        val = 'level'
      }
      return val
    },
    isPreclose: function(obj) {
      var val
      if (obj.preData) {
        if (Number(obj.preclose) > Number(obj.preData.preclose)) {
          val = 'rise'
        } else if (Number(obj.preclose) < Number(obj.preData.preclose)) {
          val = 'fall'
        } else {
          val = 'level'
        }
      } else {
        val = 'level'
      }
      return val
    },
    isLow: function(obj) {
      var val
      if (obj.preData) {
        if (Number(obj.low) > Number(obj.preData.low)) {
          val = 'rise'
        } else if (Number(obj.low) < Number(obj.preData.low)) {
          val = 'fall'
        } else {
          val = 'level'
        }
      } else {
        val = 'level'
      }
      return val
    },
    isOpen: function(obj) {
      var val
      if (obj.preData) {
        if (Number(obj.open) > Number(obj.preData.open)) {
          val = 'rise'
        } else if (Number(obj.open) < Number(obj.preData.open)) {
          val = 'fall'
        } else {
          val = 'level'
        }
      } else {
        val = 'level'
      }
      return val
    },
    isNewP: function(obj) {
      var val
      if (obj.preData) {
        if (Number(obj.newP) > Number(obj.preData.newP)) {
          val = 'rise'
        } else if (Number(obj.newP) <= Number(obj.preData.newP)) {
          val = 'fall'
        }
      } else {
        if (Number(obj.newP) > Number(obj.preclose)) {
          val = 'rise'
        } else if (Number(obj.newP) <= Number(obj.preclose)) {
          val = 'fall'
        }
      }
      return val
    }
  }
}
</script>
