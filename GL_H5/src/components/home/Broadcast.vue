<template>
  <div class="getPrice">
    <img src="../../assets/images/index/speaker.png" alt="speaker" />
    <p v-if="msg_array.length > 0">
      <span
        v-for="(msg, index) in msg_array"
        :key="index"
        :class="msg.class"
        @click="clickHandler(msg.pid)"
      >
        {{ msg.text }}
      </span>
    </p>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: ["rankedIds", "goQuoteChart", "broadcastText"],
  data() {
    return {
      msg_data: [],
      msg_array: [],
      msg_index: 0,
    };
  },
  computed: {
    ...mapState(["quote", "user", "loginType"]),
    accountPrefix() {
      return this.loginType === "D" ? "98" : "68";
    },
  },
  methods: {
    init_msg() {
      this.msg_array = [];
      this.msg_data = [];
      for (let i = 0; i < 3; i++) {
        this.msg_data.push({
          pid: this.rankedIds[i],
          name: this.quote.tickList.find(
            (el) => el.uiCodeID == this.rankedIds[i]
          ).symbolName,
          current: this.quote.tickList.find(
            (el) => el.uiCodeID == this.rankedIds[i]
          ).newP,
        });
      }
      for (let i = 0; i < 4; i++) {
        let random_data = this.randomize_trade_data();
        this.msg_array.push({
          class: "",
          text: random_data.data,
          pid: random_data.pid,
        });
      }
      let randomIndex = Math.floor(Math.random() * this.broadcastText.length);
      let broadcastText = this.broadcastText[randomIndex].text;
      this.msg_array.push({
        class: "",
        text: broadcastText,
        pid: "",
      });

      setTimeout(this.msg_slider, 100);
    },
    randomize_trade_data() {
      let vm = this;
      let random_boolean = Math.random() >= 0.5;
      let buyOrsell;
      if (random_boolean) {
        buyOrsell = "买入";
      } else {
        buyOrsell = "卖出";
      }
      let randomCal = Math.floor(Math.random() * vm.msg_data.length);
      let account = {
        data: `${this.accountPrefix}****${
          Math.floor(Math.random() * 90) + 10
        }以 ${vm.msg_data[`${randomCal}`].current} ${buyOrsell} ${(
          Math.floor(Math.random() * 37) * 0.05 +
          0.5
        ).toFixed(2)}手 ${vm.msg_data[`${randomCal}`].name}`,
        id: `random`,
        pid: vm.msg_data[randomCal].pid,
      };
      return account;
    },
    msg_slider() {
      this.msg_array.forEach((msg) => {
        msg.class = msg.class == "hide" ? "" : msg.class;
      });
      if (this.msg_index > 0) {
        this.msg_array[this.msg_index - 1].class = "hide";
      }
      if (this.msg_index == this.msg_array.length) {
        this.msg_index = 0;
        this.init_msg();
      } else {
        this.msg_array[this.msg_index].class = "show";
        this.msg_index++;
      }
    },
    clickHandler(id) {
      if (id != "") {
        this.goQuoteChart(id, this.msg_data.find((ele) => (ele.pid = id)).name);
      } else {
        console.log("custom handler");
      }
    },
  },
  mounted() {
    //console.log(this.quote);
    // Wait for data fetching from API to be completed
    setTimeout(() => {
      this.init_msg();
      setInterval(this.msg_slider, 3000);
    }, 1000);
  },
};
</script>

<style scoped>
p {
  font-size: 0.18rem;
}
.notice-swipe {
  height: 40px;
  line-height: 40px;
}
</style>
