import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhCN from '@/lang/zh-CN.json'
import zhCNFunds from '@/lang/funds/zh-CN.json'
// import { getLanageContent } from '@/api/login'
import { localSet, localGet, localRemove } from '@/utils/index'
import { Locale } from 'vant'

Vue.use(VueI18n)
let loadServerLang = 0 // 0未加载过，1，加载中，2加载失败，3加载成功
const loadedLanguages = 'zh-CN' // 默认使用中文
export const i18n = new VueI18n({
    locale: loadedLanguages, // 设置语言
    messages: {
        'zh-CN': zhCN,
    } // 设置语言包
})
// document.title = zhCN.router.position
Object.assign(zhCN, zhCNFunds)
const vantMessages = {
    'zh-CN': zhCN.compLang,
}
Locale.add(vantMessages)

sessionStorage.removeItem('authorization__') // 删除旧的token

function setI18nLanguage (data) {
    if (data) {
        
        i18n.locale = 'server'
        i18n.setLocaleMessage('server', data)
        Locale.add({ 'zh-CN': data.compLang })
        // document.title = data.router.position
        // i18n.locale = lang
    }
    return 'server'
}