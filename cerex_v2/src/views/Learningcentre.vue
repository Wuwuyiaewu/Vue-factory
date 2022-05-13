<template>
  <div class="main_content">
    <Header />
    <!-- <Banner /> -->
    <div class="mobile_bg"></div>
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header";
// import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import { WOW } from "wowjs";

export default {
  name: "Teaching_center",
  data() {
    return {};
  },
  computed: {},
  components: {
    Header,
    Footer,
  },
  mounted() {
    var wow = new WOW({
      live: false,
      boxClass: "wow",
      animateClass: "animated",
      offset: 0,
      mobile: true,
    });
    wow.init();
  },
};
</script>
