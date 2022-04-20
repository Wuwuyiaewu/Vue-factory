<template>
  <div class="home">
    <Header/>
    <div class="hierarchy_menu">
      <p>首页 &gt; 资讯中心 &gt; <b>教学中心</b></p>
    </div>

    <div class="content_page_banner">
      <p class="bg">
        <img src="@/assets/images/information/teaching_banner.jpg" />
      </p>
      <div>
        <p>
          <b class="wow fadeInDown">教学中心</b>
          <span class="wow fadeInUp">交易知识系统学习<i></i>运筹帷幄</span>
        </p>
      </div>
    </div>
    <Newcome/>
    <Skill/>
    <Adv/>
    <Footer/>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/layer/header";
import Footer from "@/layer/footer";
import Newcome from "@/components/newcome";
import Skill from "@/components/skill";
import Adv from "@/components/adv";
import Learningcentre from "@/components/learningcentre.vue";
export default {
  name: "HomeView",
  components: {
    Header,Newcome,Skill,Adv,Footer
  },
};
</script>
