<template>
  <div class="teaching_pic_list">
    <div class="left_menu list2 wow fadeInLeft">
      <h2>进阶教学</h2>
      <p>
        <router-link :to="{ path: '/learningcentre/advanced/detail/123.html' }"
          >K线入门</router-link
        >
        <router-link :to="{ path: '/learningcentre/advanced/detail/123.html' }"
          >基本面因素</router-link
        >
        <router-link :to="{ path: '/learningcentre/advanced/detail/123.html' }"
          >技术分析</router-link
        >
        <router-link :to="{ path: '/learningcentre/advanced/detail/123.html' }"
          >交易系统构建</router-link
        >
      </p>
      <router-link :to="{ path: `/learningcentre/advanced.html` }" class="more"
        >更多&gt;</router-link
      >
    </div>
    <div class="right_pic wow fadeIn">
      <div class="big_pic">
        <router-link
          :to="{ path: '/learningcentre/beginner.html' }"
        ></router-link>
        <span
          ><img src="@/assets/images/information/teaching_list2_pic1.jpg"
        /></span>
        <p>日常对话，疯狂跟读10遍，口语原地起飞！</p>
      </div>
      <div class="s_pic_group">
        <div class="s_pic">
          <a href="#"></a>
          <span
            ><img src="@/assets/images/information/teaching_list2_pic2.jpg"
          /></span>
          <p>英语谚语：Once bitten</p>
        </div>
        <div class="s_pic">
          <a href="#"></a>
          <span
            ><img src="@/assets/images/information/teaching_list2_pic3.jpg"
          /></span>
          <p>英语语法入门</p>
        </div>
        <div class="s_pic">
          <a href="#"></a>
          <span
            ><img src="@/assets/images/information/teaching_list2_pic4.jpg"
          /></span>
          <p>乔治亚理工学院：专业英语</p>
        </div>
        <div class="s_pic">
          <a href="#"></a>
          <span
            ><img src="@/assets/images/information/teaching_list2_pic5.jpg"
          /></span>
          <p>萌版生活爆炸尔顿首登场</p>
        </div>
      </div>
      <div class="swiper s_pic_group_m" id="m_list2">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <div class="s_pic_group page1">
              <div class="s_pic">
                <a href="#"></a>
                <span
                  ><img
                    src="@/assets/images/information/teaching_list2_pic2.jpg"
                /></span>
                <p>英语谚语：Once bitten</p>
              </div>
              <div class="s_pic">
                <a href="#"></a>
                <span
                  ><img
                    src="@/assets/images/information/teaching_list2_pic4.jpg"
                /></span>
                <p>乔治亚理工学院：专业英语</p>
              </div>
            </div>
          </div>
          <div class="swiper-slide">
            <div class="s_pic_group">
              <div class="s_pic">
                <a href="#"></a>
                <span
                  ><img
                    src="@/assets/images/information/teaching_list2_pic3.jpg"
                /></span>
                <p>英语语法入门</p>
              </div>
              <div class="s_pic">
                <a href="#"></a>
                <span
                  ><img
                    src="@/assets/images/information/teaching_list2_pic5.jpg"
                /></span>
                <p>萌版生活爆炸尔顿首登场</p>
              </div>
            </div>
          </div>
        </div>
        <div class="swiper-pagination2"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdvGrid",
  data() {
    return {
      scripts: [
        {
          src: `https://cerexx.com/fApi/freeDirection?categoryId=742&callback=gotAdv&nocache=${new Date().getTime()}`,
        },
      ],
      // 物件
      adv_list: [],
      // 總表單長度
      adv_length: 0,
      // 拿取 json
      getJSON() {
        const vm = this;
        window.gotAdv = function (data) {
          data.list.forEach((element, i) => {
            element.index = i;
            vm.adv_list.push(element);
            vm.adv_length = vm.adv_list.length;
          });
        };
        this.scripts.forEach((script) => {
          let tag = document.createElement("script");
          tag.setAttribute("src", script.src);
          document.body.appendChild(tag);
        });
      },
    };
  },
  computed: {
    listLink() {
      return this.adv_list;
    },
  },
  methods: {
    goPath() {
      console.log(this.$router);
      this.$router.push({ name: "Beginner" });
    },
    swiper(){
      var swiper = new Swiper("#m_list2", {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination2",
        clickable: true,
      },
    });
    }
  },
  created() {
    this.getJSON();
  },
  mounted(){
    this.swiper()
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
