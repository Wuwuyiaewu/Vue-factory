<template>
  <div v-if="isWithdrawa" class="popFixed">
    <div class="masking" @click="clickWithdrawal" />
    <div class="tcCon">
      <div class="item">
        <span>撤单</span>
        <p>您确定要取消以下订单？<br>#{{pending.ID}}</p>
      </div>
      <div class="btnCon">
        <span @click="clickWithdrawal">取消</span>
        <span @click="cancel()">确定</span>
      </div>
    </div>
  </div>
</template>

<script>
import TradeUtil from '@/utils/tradeUtil'
import Constant from '@/utils/Constant'
import { mapState } from 'vuex'

export default {
  name: 'WithdrawalPop',
  props: ['pending'],
  data() {
    return {
      isWithdrawa: false
    }
  },
  computed: {
    ...mapState(['account', 'socket', 'orderCancelRet'])
  },
  watch: {
    orderCancelRet: {
      deep: true,
      handler(newValue, oldValue) {
        if (this.pending && this.pending.ID && newValue.ID && this.pending.ID == newValue.ID) {
          // 撤单成功
          this.isWithdrawa = false
          alert('撤单成功')
          this.$router.replace({ path: '/home/trade', query: { type: 1 }})
        }
      }
    }
  },
  methods: {
    toggleFixed() {
      let body
      if (document.documentElement) {
        body = document.documentElement
      } else if (document.body) {
        body = document.body
      }
      const mainH = document.getElementById('main')
      mainH.classList.toggle('mainFixed')
      if (body.clientWidth > 750) mainH.style.left = (body.clientWidth - 750) / 2 + 'px'
    },
    clickWithdrawal() {
      this.toggleFixed()
      this.isWithdrawa = !this.isWithdrawa
    },
    /* 撤单*/
    cancel() {
      this.toggleFixed()
      const req = TradeUtil.getCannelReq(this.account, this.pending)// 初始化请求对象
      this.socket.tradeSocket.emit('request', Number(Constant.Req.cancelOrder), req)
    }
  }
}
</script>
