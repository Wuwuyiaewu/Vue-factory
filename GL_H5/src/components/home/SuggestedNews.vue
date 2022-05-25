<template>
  <div class="layout">
    <div class="section-header">
      <p style="font-family: PingFang SC; color: #252525">行情推荐</p>
    </div>
    <div class="conList2">
      <div class="ctitlebox">
        <span
          >产品类别:
          {{
            checknames != ""
              ? checknames.join("/")
              : "外汇/商品/指数/数字货币/美股/港股/参考"
          }}</span
        >
        <i @click="showsuggest()" :class="[rotate ? 'go' : 'goback']"></i>
      </div>

      <div class="suggest_popup_group" v-show="sugshow">
        <ul>
          <li
            v-for="item in tabs"
            :key="'quote-nav-' + item.id"
            @click="updatecheck(item.id, item.name)"
          >
            <input
              type="checkbox"
              :value="item.id"
              :class="checkids.indexOf(item.id) != -1 ? 'checked' : ''"
            />
            <label>{{ item.name }}</label>
          </li>
        </ul>
      </div>

      <div class="item">
        <p>产品名称</p>
        <p>现价</p>
        <p>投入$500可盈利</p>
        <p></p>
      </div>

      <ul v-for="item in isTrueTabList" :key="'tabs-' + item.id" class="plist">
        <li
          v-for="(data, index) in filteredTickList(item.id).slice(0, 5)"
          :key="'tabs-tick-' + data.uiCodeID"
          @click="goQuoteChart(data.uiCodeID)"
        >
          <span
            ><img
              :src="
                require('../../assets/images/rankList/ranking_icon' +
                  (index + 1) +
                  '.png')
              "
              class="icon"
            />
            {{ quote.notify[data.uiCodeID].aushGB }}</span
          >
          <span :class="util.isNewP(data)">{{ data.newP }}</span>
          <span>{{ data.profit.toFixed(2) }}</span>
          <span>看行情</span>
        </li>
      </ul>
    </div>

    <div class="suggest_popup_bg" v-show="sugshow" @click="showsuggest()"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Util from "@/utils/tradeDataUtil";

export default {
  props: ["checkids", "checknames", "filteredTickList", "goQuoteChart"],
  data() {
    return {
      tabs: JSON.parse(process.env.VUE_APP_TICKLIST),
      isTrue: Number(this.$route.query.tabIndex) || 0,
      rotate: false,
      sugshow: false,
      util: Util,
    };
  },
  computed: {
    ...mapState(["quote", "user"]),
    isTrueTabList() {
      //console.log(this.tabs.filter((ele, index) => this.isTrue === index))
      return this.tabs.filter((ele, index) => this.isTrue === index);
    },
  },
  methods: {
    showsuggest() {
      this.rotate = !this.rotate;
      this.sugshow = !this.sugshow;
    },
    updatecheck(id, name) {
      let updatedid = [...this.checkids];
      let updatednames = [...this.checknames];
      if (this.checkids.includes(id)) {
        //var idsnum = this.checkids.length
        updatedid = this.checkids.filter((t) => t != id);
        updatednames = this.checknames.filter((tn) => tn != name);
      } else {
        updatedid.push(id);
        updatednames.push(name);
      }
      this.$bus.$emit("updatecheck", {id: updatedid, name: updatednames});
    }
  }
};
</script>

<style></style>
