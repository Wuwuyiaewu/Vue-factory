import axios from 'axios'
import { jsonp } from 'vue-jsonp'
import md5 from 'md5';

export default {
    md5Sign(data) {
        const headers = {
            sign: md5(data)
        }
        return headers;
    },
    getSuggestedNews(data) {
        return axios.get(process.env.VUE_APP_INFO_NEW + "/newsListByRec" + data.params, {
            headers: this.md5Sign(data.sign)
        })
    },
    getTopSuggestedNews() {
        //return axios.get(process.env.VUE_APP_CMS + "/news/recommended.json")
        return axios.get(process.env.VUE_APP_CMS + "/fApi/newsList?categoryId=696&pageIndex=1&count=10")
        //return axios.get("https://localhost" + "/fApi/newsList?categoryId=696&pageIndex=1&count=10");
    },
    getMsgPush(params) {
        return axios.get(process.env.VUE_APP_CMS + "/fApi/msgPush" + params)
    },
    getCMSNewsDetail(id){
        //return axios.get(process.env.VUE_APP_CMS + "/news/" + type + "/" + id + ".json")
        return axios.get(process.env.VUE_APP_CMS + "/fApi/newsDetail?id=" + id);
    },
    getFeaturedNews(data) {
        return axios.get(process.env.VUE_APP_INFO_NEW + "/newsListByType" + data.params, {
            headers: this.md5Sign(data.sign)
        })
    },
    getFeaturedNewsCategory(data) {
        return axios.get(process.env.VUE_APP_INFO_NEW + "/newsTypeList" + data.params, {
            headers: this.md5Sign(data.sign)
        })
    },
    getNewsFlash(data) {
        return axios.get(process.env.VUE_APP_INFO_NEW + "/getNewsFlash" + data.params, {
            headers: this.md5Sign(data.sign)
        })
    },
    getStrategicNews() {
        //return axios.get(process.env.VUE_APP_CMS + "/news/strategy.json")
        return axios.get(process.env.VUE_APP_CMS + "/fApi/newsList?categoryId=697&pageIndex=1&count=10")
        //return axios.get("https://localhost" + "/fApi/newsList?categoryId=697&pageIndex=1&count=10");
    },
    getCalendar(data) {
        return axios.get(process.env.VUE_APP_INFO_NEW + "/getCalendar" + data.params, {
            headers: this.md5Sign(data.sign)
        })
    },
    getNewsDetail(data) {
        return axios.get(process.env.VUE_APP_INFO_NEW + "/newsDetail" + data.params, {
            headers: this.md5Sign(data.sign)
        })
    },
    getNewsByProducId(data) {
        return axios.get(process.env.VUE_APP_INFO_NEW + "/newsListByPid" + data.params, {
            headers: this.md5Sign(data.sign)
        })
    }
}