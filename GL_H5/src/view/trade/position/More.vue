<template>
  <div class="more">
    <ul>
      <li @click="goTradeRecord(0,'历史成交')"><a>查询历史成交</a><img src="@/assets/images/trade/right_next_step.png"></li>
      <li @click="goTradeRecord(1,'历史委托')"><a>查询历史委托</a><img src="@/assets/images/trade/right_next_step.png"></li>
      <li @click="goTradeRecord(2,'历史盈亏')"><a>查询历史盈亏</a><img src="@/assets/images/trade/right_next_step.png"></li>
      <li @click="goTradeRecord(3,'历史资金流水')"><a>查询历史资金流水</a><img src="@/assets/images/trade/right_next_step.png"></li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import api from '@/plugins/api'
const u = navigator.userAgent
export default {
  name: 'More',
  data() {
    return {
      frontoffice: process.env.VUE_APP_FRONTOFFICE,
      u: navigator.userAgent,
      isAndroid: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
      isIOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    goTradeRecord(category,title) {
      this.$bus.$emit('loading', false)
      //this.$toast.loading({forbidClick: true});
      if (this.isIOS) {
        const data = {
          params: {
            weblinkId: 'PCUI_DEPOSIT',
            platTypeKey: 'webui',
            customerNumber: this.user.loginname,
            password: this.user.pwd
          }
        }
        api.getUserCenterToken(data).then(res => {
          if (res.data.code == 'success') {
            const url = this.frontoffice + '/rgsLogin.rgs?platform=GTS2&testPlatform=mb&lang=zh_CN&token='+res.data.token+'&service=' + encodeURIComponent(this.frontoffice) + '%2FtradeRecord.do%3Fpattern%3DgreenRed%26timeZones%3DGMT%2B8%26category%3DtradeRecord%26deviceId%3D%26version%3D191%26terminal%3Dios%26page%3D'+category
            this.$bus.$emit('loading', true)
            //window.location.href = url
            setTimeout(() => {
              this.$bus.$emit("loading", true);
              window.open(url,"_blank")
            }, 500);
          }
        })
      }else{
        this.$bus.$emit('loading', true)
        this.$router.push({
          path: '/home/UserCenter',
          query: { action:'tradeRecord',num: category, title}
        })
      }
    }
  }
}
</script>
