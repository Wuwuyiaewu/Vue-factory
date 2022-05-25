<template>
  <div class="turn">
    <!-- <img src="../assets/images/nav/loading.gif">
    <span>数据正在加载中...</span> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Turn",
  computed: {
    ...mapState([
      "quote",
      "socket",
      "account",
      "group",
      "symbolInfo",
      "tradeData",
      "user",
    ]),
  },
  watch: {
    quote: {
      deep: true,
      handler(newData, oldData) {
        if (newData.tickList.length > 0)
          this.$router.replace({
            path: this.$route.query.url,
            query: { turn: 1 },
          });
      },
    },
  },
  created() {
    this.$toast.loading({
      forbidClick: true,
    });
  },
};
</script>
