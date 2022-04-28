<template>
    <div class="teaching_pic_list">
      <div class="left_menu list3 wow fadeInLeft">
        <h2>技术指标</h2>
        <p>
          <a href="#">均线及均线组</a>
          <a href="#">MACD指标</a>
          <a href="#">布林带</a>
          <a href="#">KD指标</a>
          <a href="#">黄金分割线</a>
        </p>
        <a href="teaching_center_list.html" class="more">更多&gt;</a>
      </div>
      <div class="right_pic wow fadeIn">
        <div class="big_pic">
          <a href="#"></a>
          <span><img src="@/assets/images/information/teaching_list3_pic1.jpg" /></span>
          <p>上海交通大学公开课：高等数学</p>
        </div>
        <div class="s_pic_group">
          <div class="s_pic">
            <a href="#"></a>
            <span
              ><img src="@/assets/images/information/teaching_list3_pic2.jpg"
            /></span>
            <p>渤海大学：公关与沟通</p>
          </div>
          <div class="s_pic">
            <a href="#"></a>
            <span
              ><img src="@/assets/images/information/teaching_list3_pic3.jpg"
            /></span>
            <p>麻省理工：计算机科学导论</p>
          </div>
          <div class="s_pic">
            <a href="#"></a>
            <span
              ><img src="@/assets/images/information/teaching_list3_pic4.jpg"
            /></span>
            <p>武汉理工大学：心理学</p>
          </div>
          <div class="s_pic">
            <a href="#"></a>
            <span
              ><img src="@/assets/images/information/teaching_list3_pic5.jpg"
            /></span>
            <p>复旦大学：感染病学总论</p>
          </div>
        </div>

        <div class="swiper s_pic_group_m" id="m_list3">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <div class="s_pic_group page1">
                <div class="s_pic">
                  <a href="#"></a>
                  <span
                    ><img src="@/assets/images/information/teaching_list3_pic2.jpg"
                  /></span>
                  <p>渤海大学：公关与沟通</p>
                </div>
                <div class="s_pic">
                  <a href="#"></a>
                  <span
                    ><img src="@/assets/images/information/teaching_list3_pic4.jpg"
                  /></span>
                  <p>武汉理工大学：心理学</p>
                </div>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="s_pic_group">
                <div class="s_pic">
                  <a href="#"></a>
                  <span
                    ><img src="@/assets/images/information/teaching_list3_pic3.jpg"
                  /></span>
                  <p>麻省理工：计算机科学导论</p>
                </div>
                <div class="s_pic">
                  <a href="#"></a>
                  <span
                    ><img src="@/assets/images/information/teaching_list3_pic5.jpg"
                  /></span>
                  <p>复旦大学：感染病学总论</p>
                </div>
              </div>
            </div>
          </div>
          <div class="swiper-pagination3"></div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: "Skill",
  data() {
    return {
      scripts: [
        {
          src: `https://cerexx.com/fApi/freeDirection?categoryId=743&callback=gotSkill&nocache=${new Date().getTime()}`,
        },
      ],
      // 物件
      skill_list: [],
      // 總表單長度
      skill_length: 0,
      // 拿取 json
      getJSON() {
        const vm = this;
        window.gotSkill = function (data) {
          data.list.forEach((element, i) => {
            element.index = i;
            vm.skill_list.push(element);
            vm.skill_length = vm.skill_list.length;
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
      return this.skill_list;
    },
  },
  methods: {
    goPath() {
      console.log(this.$router);
      this.$router.push({ name: "Beginner" });
    },
    swiper() {
      var swiper = new Swiper("#m_list3", {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination3",
          clickable: true,
        },
      });
    },
  },
  created() {
    this.getJSON();
  },
  mounted() {
    this.swiper();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
