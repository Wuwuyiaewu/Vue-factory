/*
 * 生成随机字符串
 *
 * */
import CryptoJS from 'crypto-js'
import dayjs from 'dayjs'
import pako from 'pako'

// import protobuf from 'protobufjs'
window['CryptoJS'] = CryptoJS

export function guid () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0
        const v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    }) + '-' + Date.now()
}
/* 创建9位随机数 */
export function msg_id () {
    return String(Date.now() / 1000000000).split('.')[1] * 1
}

export function randomTrack () {
    const _trackArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    let _track = ''
    for (let i = 0; i < 2; i++) {
        _track += _trackArr[Math.floor(Math.random() * (_trackArr.length - 1))]
    }
    _track += Date.now()
    return _track
}

// 更加公司的htmlKey区分localStorage
export function localSet (key, val) {
    if (typeof val === 'object') val = JSON.stringify(val)
    return localStorage.setItem(key, val)
}
export function localGet (key) {
    return localStorage.getItem(key)
}
export function localRemove (key) {
    return localStorage.removeItem(key)
}
export function debounce (fn, wait = 200) {
    let timer
    return function (...rest) {
        if (timer) {
            clearTimeout(timer)
            timer = null
        }
        timer = setTimeout(function () {
            fn.apply(this, rest)
        }, wait)
    }
}


/* 效验ix接口参数适配是否正确 */
export function checkAPIField (target, origin) {
    // target = target.split('\n').map(el => subVal(el))
    origin = origin.split('\n').map(el => subVal(el))

    const fieldError = []
    const fieldValError = []
    for (const field in target) {
        const item = origin.find(o => o[0] === field)
        if (!item) {
            fieldError.push({
                [field]: target[field]
            })
        }
        const itemVal = origin.find(o => o[0] === field && matchType(o[1], target[field]))
        if (!itemVal) {
            fieldValError.push({
                [field]: target[field]
            })
        }
    }
    // console.log(target, origin)
    // if (fieldValError.length) console.log(target, origin)
    return {
        fieldError,
        fieldValError
    }
    // console.log('fieldError', fieldError)
    // console.log('fieldValError', fieldValError)
}
window['checkAPIField'] = checkAPIField

function subVal (val) {
    const a = val.split(':')
    const newval = a[1].trim()
    a[0] = a[0].trim()
    if (newval === 'true' || newval === 'false') {
        a[1] = newval === 'true'
    } else {
        a[1] = newval.includes('"') ? newval.replace(/"/g, '').trim() : Number(newval)
    }

    return a
}

function matchType (a, b) {
    return Object.prototype.toString.call(a) === Object.prototype.toString.call(b)
}

// 生成从minNum到maxNum的随机整数
export function randomNum (minNum, maxNum) {
    switch (arguments.length) {
    case 1:
        return parseInt(Math.random() * minNum + 1, 10)
    case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
    default:
        return 0
    }
}
// 替换消息中自定义标签的内容
export function replaceMsgContent (str) {
    const reg = /<time>(.*?)<\/time>/g
    const newStr = str.replace(reg, function (res) {
        const result = reg.exec(res)
        if (result) {
            return dayjs(new Date(parseInt(result[1]))).format('YYYY-MM-DD HH:mm:ss')
        }
    })
    return newStr
}
// 获取字符长度 （英文占1个字符，中文汉字占2个字符）
export function getBLen (str) {
    // 把双字节的替换成两个单字节的然后再获得长度
    if (str == null) return 0
    if (typeof str !== 'string') {
        str += ''
    }
    return str.replace(/[^\x00-\xff]/g, '01').length
}

export function verifyBlen (str, max, min) {
    const strLen = getBLen(str)
    if (max && strLen > max) {
        return false
    }
    if (min && strLen < min) {
        return false
    }
    return true
}

export function timeZone () {
    return dayjs().utcOffset() / 60
}
export function ungzip (blod) {
    return new Promise((reslove, reject) => {
        const reader = new FileReader()
        // const startTime = Date.now()
        reader.onload = () => {
            const charData = reader.result.split('').map(x => x.charCodeAt(0))
            const data = pako.inflate(new Uint8Array(charData))
            let strData = ''
            /**
             * String.fromCharCode.apply(null, array) 显示 Maximum call stack size exceeded
             * 超过最大调用堆栈大小
             *
             */
            const chunk = 8 * 1024
            let i
            const uint16Arr = new Uint16Array(data)
            for (i = 0; i < uint16Arr.length / chunk; i++) {
                strData += String.fromCharCode.apply(null, uint16Arr.slice(i * chunk, (i + 1) * chunk))
            }
            strData += String.fromCharCode.apply(null, uint16Arr.slice(i * chunk))
            const result = JSON.parse(decodeURIComponent(strData))
            reslove(result)
        }
        reader.readAsBinaryString(blod)
        reader.onerror = () => reject()
    })

    // return Base64.decode(result)
}

export function encrypt (num) {
    const encodeStr = 'ABCDEFGOPQRSTabcdefg_uvwxyzHIJKLMNUVWXYZ0152384967hijklmnopqrst'
    const b = []
    let m
    while (num != 0) {
        m = num % 63
        num = parseInt(num / 63)
        b.unshift(encodeStr.charAt(m))
    }
    return b.join('')
}
// 设备类型
export function deviceType (num) {
    let openFrom = 'H5_APP' // h5
    if (window['isPC']) {
        openFrom = 'WEBSITE' // PCUI
    } else if (window.JsHook && window.JsHook.appGoDeposit) {
        openFrom = 'ANDROID' // 原生Android
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appGoDeposit) {
        openFrom = 'IOS' // 原生IOS
    } else if (window.JsHook && JsHook.appOpenBrower) {
        openFrom = 'WEBSITE_ANDROID' // 壳包Android
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appOpenBrower) {
        openFrom = 'WEBSITE_IOS' // 壳包IOS
    }
    return openFrom
}
// 获取连接参数
export function getQueryVariable (variable, search = location.search) {
    if (!search) {
        return undefined
    }
    var query = search.substring(1)
    var vars = query.split('&')
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=')
        if (pair[0] == variable) { return decodeURIComponent(pair[1]) }
    }
    return undefined
}
