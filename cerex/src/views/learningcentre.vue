<template>
  <div class="home">
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
  </div>
</template>

<script>
// @ is an alias to /src
import Newcome from "@/components/newcome";
import Learningcentre from "@/components/learningcentre.vue";
import Learningcentre from "@/components/learningcentre.vue";
export default {
  name: "HomeView",
  components: {
    Newcome,
  },
};
</script>
