<template>
  <div class="splash-float-container">
    <div class="splash-container" v-if="splashVisible">
      <div class="masking" @click="closeSplashScreen" />
      <transition name="custom-leave">
        <div class="popFixed">
          <div class="tc_layout">
            <div class="tcConImage" v-if="popup && popup.pic">
              <img
                class="splash_image"
                :src="popup.pic"
                alt="popupImage"
                @click="clickHandler"
              />
              <p class="popup_close" @click="closeSplashScreen"></p>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div v-if="floatVisible" class="popFloat" :class="showFloat ? 'show' : ''">
      <div class="drawer" @click="showFloat = !showFloat"></div>
      <div class="float_container" v-if="popup && popup.sm_pic">
        <img
          class="float_image"
          :src="popup.sm_pic"
          alt="floatImage"
          @click="clickHandler"
        />
        <p class="popup_close" @click="toggleFloat"></p>
      </div>
    </div>
  </div>
</template>

<script>
import hrefDict from "@/utils/apiHrefMap";
import AboutNews from "../../view/news/AboutNews.vue";
export default {
  components: { AboutNews },
  props: ["popup","goQuoteChart"],
  data() {
    return {
      splashVisible: false,
      floatVisible: false,
      showFloat: false
    };
  },
  methods: {
    toPage(item) {
      this.$emit("show-float");
      this.visible = false;
    },
    toggleFixed() {
      let body;
      if (document.documentElement) {
        body = document.documentElement;
      } else if (document.body) {
        body = document.body;
      }
      const mainH = document.getElementById("main");
      mainH.classList.toggle("mainFixed");
      if (body.clientWidth > 750) {
        mainH.style.left = (body.clientWidth - 750) / 2 + "px";
      }
    },
    removeFixed() {
      const mainH = document.getElementById("main");
      mainH.classList.remove("mainFixed");
    },
    closeSplashScreen() {
      this.removeFixed();
      this.splashVisible = false;
      this.floatVisible = true;
    },
    toggleFloat() {
      this.showFloat = false;
    },
    clickHandler() {
      console.log(this.popup);
      this.splashVisible = false;
      this.floatVisible = true;
      if (this.popup.other_href != "") {
        if (this.popup.href == "gotoOther") {
          let url_text = this.popup.other_href;
          let url = new URL(this.popup.other_href);
          let modifier = url.search != "" ? "&" : "?";
          if (!url.searchParams.get("utm_source")) url_text += modifier + "utm_source=" + sessionStorage.getItem("utm_source");
          if (!url.searchParams.get("utm_medium") && sessionStorage.getItem("utm_medium")) url_text += modifier + "utm_medium=" + sessionStorage.getItem("utm_medium");
          if (!url.searchParams.get("utm_campaign") && sessionStorage.getItem("utm_campaign")) url_text += modifier + "utm_campaign=" + sessionStorage.getItem("utm_campaign");
          if (!url.searchParams.get("utm_content") && sessionStorage.getItem("utm_content")) url_text += modifier + "utm_content=" + sessionStorage.getItem("utm_content");
          if (!url.searchParams.get("utm_term") && sessionStorage.getItem("utm_term")) url_text += modifier + "utm_term=" + sessionStorage.getItem("utm_term");
          this.$router.push({
            path: "/home/BannerUrl",
            query: {
              title: this.popup.title,
              url: url_text,
            },
          });
        } else if (this.popup.href == "gotoProduct") {
          this.goQuoteChart(
            this.popup.other_href,
            this.$store.state.quote.notify[matchedConfig.other_href].aushGB
          );
        } else if (this.popup.href == "gotoArticle") {
          this.$router.push({
            path: "/home/NewsDetail",
            query: {
              title: "详情",
              articleId: this.popup.other_href,
            },
          });
        } else {
          // any other cases
          console.log("in splash screen click handler any other cases");
        }
      } else {
        this.$router.push({
          path: hrefDict[this.popup.href],
        });
      }
    }
  },
  mounted() {
    this.splashVisible = this.popup.show === 'true' ? true : false;
  }
};
</script>

<style scoped>
/* .splash-float-container {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
} */
.splash-container {
  max-width: 750px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: fixed;
  /* top: 60%; */
  top: 0;
  z-index: 999999999;
  overflow-x: hidden;
}
.masking {
  overflow: hidden;
  position: fixed;
  height: 100%;
  width: 100%;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
}
.popFixed .tcConImage {
  position: relative;
  width: 5.02rem;
  height: auto;
  margin: 0 auto;
  z-index: 99999999999;
}
.popFixed .tcConImage img {
  display: block;
  width: 100%;
  max-width: 100%;
}
.popup_close {
  position: absolute;
  right: 0;
  top: -10%;
  width: 0.5rem;
  height: 0.5rem;
  margin: -0.25rem;
  border: 0.02rem solid #fff;
  border-radius: 100%;
  cursor: pointer;
}
.popup_close:after,
.popup_close:before {
  content: "";
  position: absolute;
  height: 60%;
  width: 0.025rem;
  background: #fff;
  margin: -28% -0.02rem;
  left: 50%;
  top: 50%;
  border-radius: 10px;
  transform: rotate(45deg);
}
.popup_close:before {
  transform: rotate(-45deg);
}

/* Pop Float */
.popFloat {
  position: fixed;
  z-index: 99;
  top: 60vh;
  /* right: -1.23rem; */
  /* transform: translateX(7.23rem); */
  margin-left: 7.25rem;
  /* margin-left: min(.63rem, calc(100% - 0.88rem)); */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 0.25rem;
  height: 1.5rem;
  transition: all 0.2s ease;
}
.popFloat.show {
  width: 1.5rem;
  margin-left: 6rem;
}
.popFloat .drawer {
  border-radius: 0.07rem 0 0 0.07rem;
  width: 0.25rem;
  height: 65%;
  line-height: 1.5rem;
  text-align: center;
  font-size: 0.2rem;
  font-weight: bolder;
  background-image: url("../../assets/images/nav/a_top_return_w.png");
  background-size: 100% 30%;
  background-repeat: no-repeat;
  background-position: 0.04rem center;
  background-color: #fe6a1a;
  color: #fff;
}
.popFloat.show .drawer {
  width: 0;
}
.popFloat .float_container {
  /* width: 1.2rem; */
  width: 0;
  height: 0;
  transition: all 0.3s ease;
}
.popFloat.show .float_container {
  width: 1.2rem;
  height: 100%;
}
.popFloat img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.popFloat:not(.show) .popup_close {
  display: none;
}
.popFloat.show .popup_close {
  width: 0.24rem;
  height: 0.24rem;
  top: 0.2rem;
  right: 0.3rem;
  background: #afafaf;
}
.popFloat.show .popup_close:after,
.popFloat.show .popup_close:before {
  content: "";
  position: absolute;
  height: 60%;
  width: 0.015rem;
  background: #fff;
  margin: -28% -0.01rem;
  left: 50%;
  top: 50%;
  border-radius: 10px;
}

.custom-leave-leave-active {
  transition: transform 0.5s, opacity 0.5s;
}
.custom-leave-leave-to {
  opacity: 0;
  transform: translate(4rem, 2.5rem) scale(0.3);
}
</style>
