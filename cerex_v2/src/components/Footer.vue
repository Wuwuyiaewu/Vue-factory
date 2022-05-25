<template>
  <div class="footer" v-show="headfoot !== 'none'">
    <div>
      <p class="text1">
        <img src="@/assets/images/footer_icon.png" />
        风险警告：保证金交易具高风险，投资者考虑投资金额时需视乎自身的能力。投资有盈有亏，您可能因此损失全部本金。保证金交易不一定适合所有投资者，交易前请确认您已完全了解相关风险。
      </p>
      <p class="text2">
        <span>Copyright &copy; XXXXXXXXXXXXX 版权所有 不得转载</span>
        <a :href="`/privacystatement.html?utm_source=${linkDefault.utm_source}&utm_medium=${linkDefault.utm_medium}`">私隐条款</a>
        <a :href="`/disclaimer.html?utm_source=${linkDefault.utm_source}&utm_medium=${linkDefault.utm_medium}`">免责声明</a>
      </p>
      <p class="text3">
        <a href="#">24小时在线客服</a>
        <a href="#">852 - 12345678</a>
        <a href="mailto:sales@cerex.com">sales@cerex.com</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
   data() {
    return {
      query: this.$route.query,
    };
  },
  computed: {
    headfoot() {
      return this.query.headfoot;
    },
    linkDefault() {
      let text = location.href;
      let patternM = /www\./gi;
      let patternWWW = /m\./gi;
      let patternLocalhost = /localhost\:/gi;
      let result1 = patternM.test(text);
      let result2 = patternWWW.test(text);
      let result3 = patternLocalhost.test(text);
      let obj = {
        utm_source: this.query.utm_source || "o7",
        utm_medium: result3?"local":""|result1?"m-guanwang":""|result2?"pc-guanwang":"",
      };
      // if(this.query.utm_source)
      return obj;
    },
  },
};
</script>

<style>
</style>