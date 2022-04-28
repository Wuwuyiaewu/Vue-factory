<template>
  <div class="teaching_content1">
    <div class="teaching_pic_list">
      <div class="left_menu list1 wow fadeInLeft">
        <h2>新手入门</h2>
        <p>
          <a style="cursor: pointer;"
            @click="this.$router.push({path:`/learningcentre/beginner/detail/${i.id}.html`})"
            v-for="i of listLink"
            :key="i.id"
            >{{ i.title }}</a
          >
        </p>
        <router-link
          :to="{ path: `/learningcentre/beginner.html` }"
          class="more"
          >更多&gt;</router-link
        >
      </div>
      <div class="right_pic wow fadeIn">
        <div class="big_pic">
          <a href="#"></a>
          <span
            ><img src="@/assets/images/information/teaching_list1_pic1.jpg"
          /></span>
          <p>告别混乱生活：人生十二法则</p>
        </div>
        <div class="s_pic_group">
          <div class="s_pic">
            <a href="#"></a>
            <span
              ><img src="@/assets/images/information/teaching_list1_pic2.jpg"
            /></span>
            <p>如何在手机上拍摄专</p>
          </div>
          <div class="s_pic">
            <a href="#"></a>
            <span
              ><img src="@/assets/images/information/teaching_list1_pic3.jpg"
            /></span>
            <p>入门级甜点制作教程</p>
          </div>
          <div class="s_pic">
            <a href="#"></a>
            <span
              ><img src="@/assets/images/information/teaching_list1_pic4.jpg"
            /></span>
            <p>超J吉他:吉他入门教程</p>
          </div>
          <div class="s_pic">
            <a href="#"></a>
            <span
              ><img src="@/assets/images/information/teaching_list1_pic5.jpg"
            /></span>
            <p>看完后改变人生的纪录片</p>
          </div>
        </div>
        <div class="swiper s_pic_group_m" id="m_list1">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <div class="s_pic_group page1">
                <div class="s_pic">
                  <a href="#"></a>
                  <span
                    ><img
                      src="@/assets/images/information/teaching_list1_pic2.jpg"
                  /></span>
                  <p>如何在手机上拍摄专</p>
                </div>
                <div class="s_pic">
                  <a href="#"></a>
                  <span
                    ><img
                      src="@/assets/images/information/teaching_list1_pic4.jpg"
                  /></span>
                  <p>超J吉他:吉他入门教程</p>
                </div>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="s_pic_group">
                <div class="s_pic">
                  <a href="#"></a>
                  <span
                    ><img
                      src="@/assets/images/information/teaching_list1_pic3.jpg"
                  /></span>
                  <p>入门级甜点制作教程</p>
                </div>
                <div class="s_pic">
                  <a href="#"></a>
                  <span
                    ><img
                      src="@/assets/images/information/teaching_list1_pic5.jpg"
                  /></span>
                  <p>看完后改变人生的纪录片</p>
                </div>
              </div>
            </div>
          </div>
          <div class="swiper-pagination1"></div>
        </div>
      </div>
    </div>
  </div>
  <!-- teaching_content1-->
</template>

<script>
export default {
  name: "Newbie",
  data() {
    return {
      scripts: [
        {
          src: `https://cerexx.com/fApi/freeDirection?categoryId=741&callback=gotNewbie&nocache=${new Date().getTime()}`,
        },
      ],
      // 物件
      newbie_list: [],
      // 總表單長度
      newbie_length: 0,
      // 拿取 json
    };
  },
  computed: {
    listLink() {
      return this.newbie_list.slice(0, 5);
    },
  },
  methods: {
    getJSON() {
      const vm = this;
      window.gotNewbie = function (data) {
        data.list.forEach((element, i) => {
          element.index = i;
          vm.newbie_list.push(element);
          vm.newbie_length = vm.newbie_list.length;
        });
      };
      this.scripts.forEach((script) => {
        let tag = document.createElement("script");
        tag.setAttribute("src", script.src);
        document.body.appendChild(tag);
      });
    },
    goPath() {
      console.log(this.$router);
      this.$router.push({ name: "Beginner" });
    },
    swiper() {
      var swiper = new Swiper("#m_list1", {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination1",
          clickable: true,
        },
      });
    },
  },
  async created() {
    await this.getJSON();
  },
  async mounted() {
    this.swiper();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
