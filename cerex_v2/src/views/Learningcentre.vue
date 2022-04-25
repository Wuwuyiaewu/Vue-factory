<template>
  <div>
    <Header />
    <Banner />
    <div class="mobile_bg"></div>
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import { WOW } from "wowjs";

export default {
  name: "Teaching_center",
  components: {
    Header,
    Banner,
    Footer,
  },
  mounted() {
    var wow = new WOW({
      boxClass: "wow",
      animateClass: "animated",
      offset: 0,
      mobile: true,
    });
    wow.init();
  },
};
</script>
