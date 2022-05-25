<template>
  <div class="products-summary">
    <div
      v-for="id in featuredProductIds"
      :key="'home-page-' + id"
      @click="goQuoteChart(id, quote.codeTickMap[id].symbolName)"
      class="prod"
    >
      <p class="prod-title">{{ quote.notify[id].aushGB }}</p>
      <div class="prod-cur-price" v-if="quote.codeTickMap[id]">
        <p :class="util.isNewP(quote.codeTickMap[id])">{{ quote.codeTickMap[id].newP }}</p>
        <i :class="util.isNewP(quote.codeTickMap[id])"></i>
        <!-- up or down arrow -->
      </div>
      <div class="prod-price-change" v-if="quote.codeTickMap[id]">
        <p
          v-if="util.isOks(quote.codeTickMap[id].rate)"
          :class="util.isOks(util.accSub(quote.codeTickMap[id].newP, quote.codeTickMap[id].preclose))"
        >
          <span class="change">{{ util.accSub(quote.codeTickMap[id].newP, quote.codeTickMap[id].preclose) | sign }}</span
          ><span class="pchange">{{ quote.codeTickMap[id].rate.toFixed(2) | sign }}%</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Util from "@/utils/tradeDataUtil";
export default {
  props: ["featuredProductIds", "goQuoteChart"],
  data() {
    return {
      util: Util,
      sign: process.env.VUE_APP_GA_SIGN
    };
  },
  filters: {
    sign: function(value) {
      return value >= 0 ? "+" + value : value;
    },
  },
  computed: {
    ...mapState(["quote", "user"]),
  },
  methods: {},
};
</script>

<style></style>
