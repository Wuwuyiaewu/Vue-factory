<template>
  <div class="teaching_content1">
    <div class="teaching_pic_list">
      <div class="left_menu list1 wow fadeInLeft">
        <h2>新手入门</h2>
        <p v-if="sideLink.length">
          <router-link
            v-for="i of sideLink"
            :key="i.id"
            :to="{ path: `/learningcentre/beginner/detail/${i.id}.html` }"
            >{{ i.title }}</router-link
          >
        </p>
        <router-link
          :to="{ path: `/learningcentre/beginner.html` }"
          class="more"
          >更多&gt;</router-link
        >
      </div>
      <div class="right_pic wow fadeIn">
        <div class="big_pic" v-if="listLinkFirst.length">
          <router-link
            :to="{
              path: `/learningcentre/beginner/detail/${listLinkFirst[0].id}.html`,
            }"
          ></router-link>
          <span
            ><img :src="`https://cerexx.com/${listLinkFirst[0].img}`"
          /></span>
          <p>{{ listLinkFirst[0].title }}</p>
        </div>
        <div class="s_pic_group" v-if="listLinkFour.length">
          <div class="s_pic" v-for="item of listLinkFour" :key="item.id">
            <router-link
              :to="{ path: `/learningcentre/beginner/detail/${item.id}.html` }"
            ></router-link>
            <span><img :src="`https://cerexx.com/${item.img}`" /></span>
            <p>{{ item.title }}</p>
          </div>
        </div>
        <div class="swiper s_pic_group_m" id="m_list1">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <div class="s_pic_group page1">
                <div
                  class="s_pic"
                  v-for="item of listLinkFour.slice(0, 2)"
                  :key="item.id"
                >
                  <router-link
                    :to="{
                      path: `/learningcentre/beginner/detail/${item.id}.html`,
                    }"
                  ></router-link>
                  <span><img :src="`https://cerexx.com/${item.img}`" /></span>
                  <p>{{ item.title }}</p>
                </div>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="s_pic_group">
                <div
                  class="s_pic"
                  v-for="item of listLinkFour.slice(2, 4)"
                  :key="item.id"
                >
                  <router-link
                    :to="{
                      path: `/learningcentre/beginner/detail/${item.id}.html`,
                    }"
                  ></router-link>
                  <span><img :src="`https://cerexx.com/${item.img}`" /></span>
                  <p>{{ item.title }}</p>
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
import Swiper from "@/assets/js/swiper-bundle.js";
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
    };
  },
  computed: {
    sideLink() {
      return this.newbie_list.slice(5, 10);
    },
    listLinkFirst() {
      return this.newbie_list.slice(0, 1);
    },
    listLinkFour() {
      return this.newbie_list.slice(1, 5);
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
    swiper() {
      var swiper = new Swiper("#m_list1", {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: false,
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
@import "@/assets/css/swiper.css";
</style>
