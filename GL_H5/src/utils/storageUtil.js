/*
向local中存储数据的工具模块
1. 向外暴露一个函数(功能)
   只有一个功能需要暴露
2. 向外暴露一个对象(包含多个功能)
   有多个功能需要暴露
 */
import Cookie from 'js-cookie'
import Encrypt from '@/plugins/encryAes'

const PRICECOLORCONFIG = 'priceColorType'
const TODOS_KEY = 'user'
const REGISTERINFO = 'registerInfo'
const RANGELIST = 'rangeList'
export default {
  readUser() {
    return JSON.parse(Cookie.get(TODOS_KEY) || '{}')
  },
  saveUser(user) {
    const expiresTime = 60 * 1000 * 60 * 1// 过期时间
    const millisecond = new Date().getTime()
    const date = new Date(millisecond + expiresTime)
    Cookie.set(TODOS_KEY, JSON.stringify(user), { expires: date, path: '/' })
  },
  cacheLoginType(loginType){
    sessionStorage.setItem("loginType", loginType);
  },
  cachePriceColorType(priceColorType){
    localStorage.setItem("priceColorType", priceColorType);
  },
  readPriceColorType() {
    // console.log("readPriceColorType: " + localStorage.getItem(PRICECOLORCONFIG) || 1)
    return +localStorage.getItem(PRICECOLORCONFIG) || 1;
  },
  saveLastLogin() {
    const date = new Date();
    localStorage.setItem("lastLogin", date);
  },
  readLastLogin() {
    return localStorage.getItem("lastLogin")
  },
  readRegisterInfo() {
    return JSON.parse(Encrypt.decrypt(localStorage.getItem(REGISTERINFO)))
  },
  saveRegisterInfo(registerInfo) {
    localStorage.setItem(REGISTERINFO, Encrypt.encrypt(JSON.stringify(registerInfo)))
  },
  readRange() {
    return JSON.parse(localStorage.getItem(RANGELIST) || '{}')
  },
  saveRange(range) {
    localStorage.setItem(RANGELIST, JSON.stringify(range))
  }
}

