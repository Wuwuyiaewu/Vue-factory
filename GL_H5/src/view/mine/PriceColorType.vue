<template>
  <div class="price-color-type headNav">
    <div class="navTitle">
      <div class="navItem">
        <img
          class="black"
          src="@/assets/images/nav/a_top_return.png"
          @click="backHandler"
        />
        <span>涨跌颜色</span>
      </div>
    </div>
    <div class="price-color-list flex-c">
      <van-checkbox-group v-model="selectedPriceColorType" ref="checkboxGroup">
        <div
          class="menu-list-item flex-h"
          v-for="(item, index) in menuItems"
          :key="index"
          @click="setPriceColorType(item.value)"
        >
          <van-checkbox
            :name="item.value"
            checked-color="#FE6A1A"
            label-position="left"
            >{{ item.text }}</van-checkbox
          >
        </div>
      </van-checkbox-group>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "PriceColorType",
  data() {
    return {
      menuItems: [
        {
          text: "红涨绿跌",
          value: 1,
        },
        {
          text: "绿涨红跌",
          value: 2,
        },
      ],
      selectedPriceColorType: [],
    };
  },
  computed: {
    ...mapState(["priceColorType"]),
  },
  methods: {
    setPriceColorType(value) {
      if (this.selectedPriceColorType.includes(value)) {
        // Disable toggle if it is already checked
        this.$refs.checkboxGroup.value.push(value);
        return;
      } else {
        // Proceed to change the price color type
        const rootEl = document.querySelector(":root");
        const rootElStyle = getComputedStyle(rootEl);
        rootEl.style.setProperty(
          "--rise-color",
          rootElStyle.getPropertyValue(`--rise-color-${value}`)
        );
        rootEl.style.setProperty(
          "--fall-color",
          rootElStyle.getPropertyValue(`--fall-color-${value}`)
        );
        rootEl.style.setProperty(
          "--rise-arrow",
          rootElStyle.getPropertyValue(`--rise-arrow-${value}`)
        );
        rootEl.style.setProperty(
          "--fall-arrow",
          rootElStyle.getPropertyValue(`--fall-arrow-${value}`)
        );
        this.$refs.checkboxGroup.toggleAll();
        this.$store.dispatch("setPriceColorType", value);
        this.$toast("涨跌颜色已更新");
        this.$router.go(-1);
      }
    },
    backHandler() {
      this.$router.go(-1);
    },
  },
  mounted() {
    this.selectedPriceColorType.push(this.priceColorType);
  },
};
</script>

<style>
.price-color-type {
  margin-top: 1rem;
  font-family: PingFang SC Medium;
}
.price-color-type .price-color-list {
  font-size: 0.32rem;
}
.price-color-type .price-color-list .van-checkbox-group {
  width: 100%;
}
.price-color-type .price-color-list .menu-list-item {
  cursor: pointer;
  justify-content: initial;
  width: 100%;
  height: 0.93rem;
  border-bottom: 1px solid rgba(141, 144, 155, 0.12);
}
.price-color-type .price-color-list .van-checkbox {
  height: 100%;
  width: 100%;
}
.price-color-type .price-color-list .van-checkbox span {
  flex: 1;
  text-align: left;
  margin-left: 0.4rem;
}
.price-color-type .price-color-list .van-checkbox {
  margin-right: 0.4rem;
}
</style>
