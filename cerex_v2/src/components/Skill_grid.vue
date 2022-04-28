<template>
    <div class="teaching_pic_list">
      <div class="left_menu list3 wow fadeInLeft">
        <h2>技术指标</h2>
        <p v-if="sideLink.length">
          <router-link v-for="i of sideLink" :key="i.id" :to="{ path: `/learningcentre/technical/detail/${i.id}.html` }">{{ i.title }}</router-link>
        </p>
        <router-link
          :to="{ path: `/learningcentre/technical.html` }"
          class="more"
          >更多&gt;</router-link
        >
      </div>
      <div class="right_pic wow fadeIn">
        <div class="big_pic" v-if="listLinkFirst.length">
          <router-link :to="{ path: `/learningcentre/technical/detail/${listLinkFirst[0].id}.html` }"></router-link>
          <span 
            ><img :src="`https://cerexx.com/${listLinkFirst[0].img}`"
          /></span>
          <p>{{listLinkFirst[0].title}}</p>
        </div>
        <div class="s_pic_group" v-if="listLinkFour.length">
          <div class="s_pic" v-for="item of listLinkFour" :key="item.id">
            <router-link :to="{ path: `/learningcentre/technical/detail/${item.id}.html` }"></router-link>
            <span
              ><img :src="`https://cerexx.com/${item.img}`"
            /></span>
            <p>{{item.title}}</p>
          </div>
        </div>
        <div class="swiper s_pic_group_m" id="m_list3">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <div class="s_pic_group page1" >
                <div class="s_pic" v-for="item of listLinkFour.slice(0,2)" :key="item.id">
                 <router-link :to="{ path: `/learningcentre/technical/detail/${item.id}.html` }"></router-link>
                  <span
                    ><img
                      :src="`https://cerexx.com/${item.img}`"
                  /></span>
                  <p>{{item.title}}</p>
                </div>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="s_pic_group">
                <div class="s_pic" v-for="item of listLinkFour.slice(2,4)" :key="item.id">
                 <router-link :to="{ path: `/learningcentre/technical/detail/${item.id}.html` }"></router-link>
                  <span
                    ><img
                      :src="`https://cerexx.com/${item.img}`"
                  /></span>
                  <p>{{item.title}}</p>
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
    };
  },
  computed: {
     sideLink() {
      return this.skill_list.slice(5,10);
    },
    listLinkFirst(){
      return this.skill_list.slice(0,1)
    },
    listLinkFour(){
      return this.skill_list.slice(1,5)
    }
  },
  methods: {
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
    swiper() {
      var swiper = new Swiper("#m_list3", {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: false,
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
