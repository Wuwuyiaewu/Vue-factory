<template>
  <div>
    <Header />
    <Banner />
    <div class="mobile_bg"></div>

    <div class="main_content">
      <Newcome />
      <div class="teaching_content2">
        <Adv />
        <Skill />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Newcome from "@/components/Newcome";
import Adv from "@/components/Adv";
import Skill from "@/components/Skill";
import Footer from "@/components/Footer";
import { WOW } from "wowjs";

export default {
  name: "Teaching_center",
  components: {
    Header,
    Banner,
    Newcome,
    Adv,
    Skill,
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
