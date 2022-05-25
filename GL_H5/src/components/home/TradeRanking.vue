<template>
  <div class="layout">
    <div class="section-header">
      <img src="../../assets/images/index/trade_ranking.png" alt="trade_ranking" />
      <p style="color: #222222">交易之最</p>
      <span class="header-link" @click="goTradeRank">查看排行榜</span>
    </div>

    <div class="tradeRankbox">
      <ul>
        <li v-for="item in tradeRanking.slice(0, 3)" :key="item.title" @click="goQuoteChart(item.productId)">
          <div class="con">
            <div class="percent-circle percent-circle-right">
              <div
                class="right-content"
                :style="{
                  transform: `rotate(${getrvulue(item.bullishRate)}deg)`,
                }"
              ></div>
            </div>
            <div class="percent-circle percent-circle-left">
              <div
                class="left-content"
                :style="{
                  transform: `rotate(${getlvulue(item.bullishRate)}deg)`,
                }"
              ></div>
            </div>
            <div class="text-circle">
              <span>多: {{ item.bullishRate }}%</span
              ><span>空: {{ 100 - item.bullishRate }}%</span>
            </div>
          </div>
          <div class="text-title">{{ item.productName }}</div>
          <div class="text-desc">{{ item.productCode }}</div>
        </li>
      </ul>
      <div class="update-time">
        <p><span>最后更新:</span> {{ updateTime }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import api from "@/plugins/api";
export default {
  props: ["goQuoteChart"],
  data() {
    return {
      tradeRanking: [],
      updateTime: ""
    };
  },
  computed: {
    ...mapState(["quote"]),
  },
  methods: {
    getrvulue(i) {
      if (3.6 * i < 180) {
        return 3.6 * i;
      } else {
        return 180;
      }
    },
    getlvulue(i) {
      if (3.6 * i < 180) {
        return 0;
      } else {
        return 3.6 * i - 180;
      }
    },
    sortByRank(i) {
      return function(a, b) {
        return a[i] - b[i];
      };
    },
    goTradeRank() {
      this.$router.push({
        path: "/home/TradeRank"
      });
    }
  },
  created() {
    // console.log(this.quote)
    api.getTradeRanking().then((res) => {
      var rankdata = res.data.sort(this.sortByRank("rank"));
      var temp = rankdata[0];
      this.$set(rankdata, 0, rankdata[1]);
      this.$set(rankdata, 1, temp);
      this.tradeRanking = rankdata;
      this.updateTime = rankdata[0].publishDate;
    });
  },
};
</script>

<style></style>
