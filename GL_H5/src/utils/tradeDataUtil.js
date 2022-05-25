import Constant from './Constant'

String.format = function(format) {
  if (!format || arguments.length == 0) return ''
  var args = Array.prototype.slice.call(arguments, 1)
  return format.replace(/\{(\d+)\}/g, function(m, i) {
    return args[i]
  })
}
// eslint-disable-next-line no-extend-native
Date.prototype.format = function(format) {
  /* eg:format="YYYY-MM-dd hh:mm:ss"; */
  var o = {
    'M+': this.getMonth() + 1, // month
    'd+': this.getDate(), // day
    'h+': this.getHours(), // hour
    'm+': this.getMinutes(), // minute
    's+': this.getSeconds(), // second
    'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
    S: this.getMilliseconds()
    // millisecond
  }

  var week = ['日', '一', '二', '三', '四', '五', '六']

  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  if (/(E+)/.test(format)) {
    format = format.replace(
      RegExp.$1, week[this.getDay() + '']
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return format
}
export default {
  // 两个浮点数求和
  accAdd: function(num1, num2) {
    var r1 = 0
    var r2 = 0
    var m
    try {
      var n1 = num1.toString()
      if (n1.indexOf('.') != -1) {
        r1 = n1.split('.')[1].length
      }
    } catch (e) {
      r1 = 0
    }
    try {
      var n2 = num2.toString()
      if (n2.indexOf('.') != -1) {
        r2 = n2.split('.')[1].length
      }
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    // return (num1*m+num2*m)/m;
    return Math.round(num1 * m + num2 * m) / m
  },

  // 两个浮点数相减
  accSub: function(num1, num2) {
    var r1 = 0
    var r2 = 0
    var m, n

    try {
      var n1 = num1.toString()
      if (n1.indexOf('.') != -1) {
        r1 = n1.split('.')[1].length
      }
    } catch (e) {
      r1 = 0
    }
    try {
      var n2 = num2.toString()
      if (n2.indexOf('.') != -1) {
        r2 = n2.split('.')[1].length
      }
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    n = r1 >= r2 ? r1 : r2
    return (Math.round(num1 * m - num2 * m) / m).toFixed(n)
  },
  // 两数相除
  accDiv: function(num1, num2) {
    var t1, t2, r1, r2
    try {
      if (num1.toString().indexOf('.') != -1) {
        t1 = num1.toString().split('.')[1].length
      } else {
        t1 = 0
      }
    } catch (e) {
      t1 = 0
    }
    try {
      if (num2.toString().indexOf('.') != -1) {
        t2 = num2.toString().split('.')[1].length
      } else {
        t2 = 0
      }
    } catch (e) {
      t2 = 0
    }
    r1 = Number(num1.toString().replace('.', ''))
    r2 = Number(num2.toString().replace('.', ''))
    return (r1 / r2) * Math.pow(10, t2 - t1)
  },

  // 两数乘法
  accMul: function(num1, num2) {
    var m = 0
    var s1 = num1.toString()
    var s2 = num2.toString()
    try {
      if (s1.indexOf('.') != -1) {
        m += s1.split('.')[1].length
      }
    } catch (e) {
      console.warn(e)
    }
    try {
      if (s2.indexOf('.') != -1) {
        m += s2.split('.')[1].length
      }
    } catch (e) {
      console.warn(e)
    }
    return (
      (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
      Math.pow(10, m)
    )
  },

  isEqual: function(o1, o2) {
    for (var name in o1) {
      if (o1[name] != o2[name]) {
        return false
      }
    }
    return true
  },

  /**
   * 字符串空值判断
   * @param str
   * @returns {Boolean}
   */
  isEmpty: function(str) {
    return typeof str == 'undefined' || str === '' || str == null
  },

  /**
   * 字符串非空判断
   * @param str
   * @returns {Boolean}
   */
  isNotEmpty: function(str) {
    return !this.isEmpty(str)
  },

  /**
   * 字符串空值或者空白判断
   * @param str
   * @returns {Boolean}
   */
  isBlank: function(str) {
    return (
      this.isEmpty(str) ||
      str == 'null' ||
      //str.toString().replaceAll('\\s', '') == ''
      str.toString().replace(/\\s/g, '') == ''
    )
  },

  /**
   * 字符串不为空值并且不为空白判断
   * @param str
   * @returns {Boolean}
   */
  isNotBlank: function(str) {
    return !this.isBlank(str)
  },

  mod: function(x, y) {
    var r1 = 0
    var r2 = 0
    var m, scale
    try {
      var n1 = x.toString()
      if (n1.indexOf('.') != -1) {
        r1 = n1.split('.')[1].length
      }
    } catch (e) {
      r1 = 0
    }
    try {
      var n2 = y.toString()
      if (n2.indexOf('.') != -1) {
        r2 = n2.split('.')[1].length
      }
    } catch (e) {
      r2 = 0
    }

    scale = Math.max(r1, r2)
    m = Math.pow(10, scale)
    return (
      (this.accMul(Number(x), Number(m)) % this.accMul(Number(y), Number(m))) *
      Math.pow(10, -scale)
    )
  },

  /**
   * x四舍五入保留digits位小数返回字符串，默认保留两位
   * @param x 源数值
   * @param digits 默认为2
   * @param minDigits 最小显示位数，有值时去掉 digits到minDigits 后面的0
   */
  fixToStr: function(x, digits, minDigits) {
    digits = digits || digits == 0 ? Number(digits) : 2
    var f = parseFloat(x)
    if (isNaN(f)) {
      return ''
    }
    var result = f.toFixed(digits)
    if (minDigits && minDigits >= 0) {
      var regExp = new RegExp('0{1,' + (digits - minDigits) + '}$')
      result = result.replace(regExp, '')
    }
    return result + ''
  },

  // x四舍五入保留digits位小数返回数字
  fixToNum: function(x, digits) {
    return parseFloat(this.fixToStr(x, digits))
  },

  getSysHourOffset: function() {
    // WebUI系统时区
    return 8 // 小时差
  },

  /**
   * 根据 秒数or毫秒数 返回目标时区Date对象
   * @param times 必传，秒数or毫秒数
   * @param orgOffset 源时区，非必传（取自本地客户端），小时差（0/8/-8/-2.5）
   * @param destOffset 目标时区，非必传（默认WebUI当前所选时区），小时差（0/8/-8/-2.5）
   * @returns {Date}
   */
  getDate: function(times, orgOffset, destOffset) {
    var _milltimes = ('' + times).length == 13 ? times : times * 1000
    var localOffset = -new Date().getTimezoneOffset() / 60
    orgOffset = this.isEmpty(orgOffset) ? localOffset : orgOffset
    destOffset = this.isEmpty(destOffset)
      ? this.getSysHourOffset()
      : destOffset

    _milltimes += (destOffset - orgOffset) * 3600000

    return new Date(_milltimes)
  },
  /**
   * 根据 秒数or毫秒数和目标格式 返回目标时区的格式化后时间字符串
   * @param times 必传，秒数or毫秒数
   * @param format 目标格式（yyyy-MM-dd hh:mm:ss）
   * @param orgOffset 源时区，非必传（取自本地客户端），小时差（0/8/-8/-2.5）
   * @param destOffset 目标时区，非必传（默认WebUI当前所选时区），小时差（0/8/-8/-2.5）
   * @returns {String}
   */
  formatDate: function(times, format, orgOffset, destOffset) {
    if (!times) return ''
    var utcDate = this.getDate(times, orgOffset, destOffset)
    return this.isEmpty(format) ? utcDate : utcDate.format(format)
  },
  /**
   * 如：
   * 	（北京时间GMT8）转成(GMT0):
   * 		this.formatDateStr('2016-06-17 11:21:41', 'yyyy-MM-dd hh:mm:ss', 8, 0)-->2016-06-17 03:21:41
   */
  formatDateStr: function(datestr, format, orgOffset, destOffset) {
    if (this.isEmpty(datestr)) return ''
    return this.formatDate(
      datestr.toDate().getTime(),
      format,
      orgOffset,
      destOffset
    )
  },
  parseDateStr: function(datestr, orgOffset, destOffset) {
    if (this.isEmpty(datestr)) return ''
    return this.getDate(datestr.toDate().getTime(), orgOffset, destOffset)
  },

  /**
   * 秒数or毫秒数转换为HH:MM:SS
   * @param times secs or millsecs
   * @param timezone 返回的时区
   */
  formatToHHMMSS: function(times, timezone) {
    timezone = timezone || 0
    // var _milltimes = Number(String(times).padRight(13, '0'))
    var tmpDate = new Date(times + timezone * 3600000)
    var hour = (tmpDate.getUTCHours() < 10 ? '0' : '') + tmpDate.getUTCHours()
    var minutes =
      (tmpDate.getUTCMinutes() < 10 ? '0' : '') + tmpDate.getUTCMinutes()
    var seconds =
      (tmpDate.getUTCSeconds() < 10 ? '0' : '') + tmpDate.getUTCSeconds()
    return hour + ':' + minutes + ':' + seconds
  },

  /**
   * 分钟数转换为HH:MM
   * @param mins
   * @param timezone 返回的时区
   */
  formatMinutes: function(mins, timezone) {
    timezone = timezone || 0
    var tmpDate = new Date(mins * 60000 + timezone * 3600000)
    var hour = (tmpDate.getUTCHours() < 10 ? '0' : '') + tmpDate.getUTCHours()
    var minutes =
      (tmpDate.getUTCMinutes() < 10 ? '0' : '') + tmpDate.getUTCMinutes()
    return hour + ':' + minutes
  },

  // 返回随机请求序列
  getRandomSeq: function() {
    return Math.round(Math.random() * (999999999 - 100000000)) + 100000000
  },

  /**
   * 获取显示的产品代码
   * @example this.getShowPrdCode("GT1/PM/LLG")->LLG
   */
  getShowPrdCode: function(v) {
    return v
      ? v.substring(v.lastIndexOf('/') + 1).substring(v.lastIndexOf('\\') + 1)
      : ''
  },
  /**
   * 功能:向上舍入(类似于excel中的roundUp)
   */
  roundUp: function(n, f) {
    if (this.getDecimalLen(n) <= f) {
      return n
    }
    var flag = false
    if (n < 0) {
      n = -n
      flag = true
    }
    n = n * Math.pow(10, f)
    n = Math.ceil(n) / Math.pow(10, f)
    return flag ? -n : n
  },
  /**
   * 功能：向下舍入(类似于excel中的roundDown)
   */
  roundDown: function(n, f) {
    if (this.getDecimalLen(n) <= f) {
      return n
    }
    var flag = false
    if (n < 0) {
      n = -n
      flag = true
    }
    n = n * Math.pow(10, f)
    n = Math.floor(n) / Math.pow(10, f)
    return flag ? -n : n
  },
  /**
   * 功能：input只能输入数字
   */
  allowNumKeyPress: function(event) {
    var keyCode = event.which
    if (navigator.userAgent.indexOf('Firefox') >= 0 && keyCode == 0) {
      // 火狐下 delete键盘 、左右方向键盘 keycode都是0,特殊处理
      return true
    }
    if (keyCode == 46 || keyCode == 8 || (keyCode >= 48 && keyCode <= 57)) {
      return true
    } else {
      return false
    }
  },
  filterNum: function(curObj, allowNeg) {
    var curValue = curObj.value
    if (isNaN(curValue) || curValue == ' ') {
      // 空格用js的isNaN会判断为数字
      if (allowNeg && curValue == '-') {
        return true
      }
      var neg = ''
      if (allowNeg && curValue.indexOf('-') === 0) {
        neg = '-'
      }
      curValue = curValue
        .replace(/[^\d.]/g, '')
        .replace(/^\./g, '')
        .replace(/\.{2,}/g, '.')
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
      if (curValue.indexOf('.') === 0) {
        curValue = '0' + curValue
      }
      curObj.value = curValue != '' ? neg + curValue : ''
    }
  },
  /**
   * 功能：获取小数位的长度
   */
  getDecimalLen: function(n) {
    var arr = n.toString().split('.')
    if (arr.length == 1) {
      return 0
    } else {
      return arr[1].length
    }
  },
  getWebUIError: function(errcode, isCus, args) {
    if (errcode == 0) return ''
    var errmsg = null
    if (args) {
      errmsg = String.format.apply(
        this,
        [Constant.WebUIError[errcode]].concat(args)
      )
    } else {
      errmsg = Constant.WebUIError[errcode]
    }
    if (!errmsg) {
      errmsg = '（' + errcode + '）'
    } else {
      if (!isCus) {
        errmsg += '（' + errcode + '）'
      }
    }
    return errmsg
  },
  getThisTime() {
    var _this = this
    const yy = new Date().getFullYear()
    const mm = new Date().getMonth() + 1
    const dd = new Date().getDate()
    const hh = new Date().getHours()
    const mf =
      new Date().getMinutes() < 10
        ? '0' + new Date().getMinutes()
        : new Date().getMinutes()
    const ss =
      new Date().getSeconds() < 10
        ? '0' + new Date().getSeconds()
        : new Date().getSeconds()
    _this.gettime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
    return _this.gettime
  },
  isNewP: function(obj) {
    var val;
    if (obj.preData) {
      if (Number(obj.newP) > Number(obj.preData.newP)) {
        val = "rise";
      } else if (Number(obj.newP) <= Number(obj.preData.newP)) {
        val = "fall";
      }
    } else {
      if (Number(obj.newP) > Number(obj.preclose)) {
        val = "rise";
      } else if (Number(obj.newP) <= Number(obj.preclose)) {
        val = "fall";
      }
    }
    return val;
  },
  isOks: function(obj) {
    var val;
    if (obj > 0) {
      val = "rise";
    } else if (obj === 0) {
      val = "level";
    } else {
      val = "fall";
    }
    return val;
  }
}
