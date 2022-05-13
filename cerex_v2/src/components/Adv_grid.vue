<template>
  <div class="teaching_pic_list">
    <div class="left_menu list2 wow fadeInLeft">
      <h2>进阶教学</h2>
      <p v-if="sideLink.length">
        <router-link
          v-for="i of sideLink"
          :key="i.id"
          :to="{ path: `/learningcentre/advanced/detail/${i.id}.html` }"
          >{{ i.title }}</router-link
        >
      </p>
      <router-link :to="{ path: `/learningcentre/advanced.html` }" class="more"
        >更多&gt;</router-link
      >
    </div>
    <div class="right_pic wow fadeIn">
      <div class="big_pic" v-if="listLinkFirst.length">
        <router-link
          :to="{
            path: `/learningcentre/advanced/detail/${listLinkFirst[0].id}.html`,
          }"
        ></router-link>
        <span><img :src="`https://cerexx.com/${listLinkFirst[0].img}`" /></span>
        <p>{{ listLinkFirst[0].title }}</p>
      </div>
      <div class="s_pic_group">
        <div class="s_pic" v-for="item of listLinkFour" :key="item.id">
          <router-link
            :to="{ path: `/learningcentre/advanced/detail/${item.id}.html` }"
          ></router-link>
          <span><img :src="`https://cerexx.com/${item.img}`" /></span>
          <p>{{ item.title }}</p>
        </div>
      </div>
      <div class="swiper s_pic_group_m" id="m_list2">
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
                    path: `/learningcentre/advanced/detail/${item.id}.html`,
                  }"
                ></router-link>
                <span><img :src="`https://cerexx.com/${item.img}`" /></span>
                <p>{{ item.title }}</p>
              </div>
            </div>
          </div>
          <div class="swiper-slide">
            <div class="s_pic_group">
              <div class="s_pic_group">
                <div
                  class="s_pic"
                  v-for="item of listLinkFour.slice(2, 4)"
                  :key="item.id"
                >
                  <router-link
                    :to="{
                      path: `/learningcentre/advanced/detail/${item.id}.html`,
                    }"
                  ></router-link>
                  <span><img :src="`https://cerexx.com/${item.img}`" /></span>
                  <p>{{ item.title }}</p>
                </div>
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
import Swiper from "@/assets/js/swiper-bundle.js";
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
    };
  },
  computed: {
    sideLink() {
      return this.adv_list.slice(5, 10);
    },
    listLinkFirst() {
      return this.adv_list.slice(0, 1);
    },
    listLinkFour() {
      return this.adv_list.slice(1, 5);
    },
  },
  methods: {
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
    swiper() {
      var swiper = new Swiper("#m_list2", {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: false,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination2",
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
