<template>
<Banner/>
  <div class="teaching_center_page" v-if="detail_init">
    <h1>{{ detail_init.title }}</h1>
    <div class="teaching_center_page_wrap">
      <div v-html="detail_init.content"></div>
      <div class="next_btn">
        <router-link :to="{ path: `${detail_des.id}` }" v-show="detail_init.index !== 0"
          >上一篇</router-link
        >
        <router-link :to="{ path: `${detail_asc.id}` }" v-show="detail_init.index + 1 !== skill_length"
          >下一篇</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import Banner from "@/components/Banner";
export default {
  components:{
    Banner
  },
  props: ["id"],
  data() {
    return {
      scripts:
        "https://cerexx.com/fApi/freeDirection?categoryId=743&callback=gotSkill",
      skill_list: [],
      skill_length: [],
      indexMover: 0,
    };
  },
  computed: {
    queryAttr() {
      if (Object.keys(this.$route.query).length !== 0) {
        return { query: this.$route.query, id: this.id.split(".")[0] };
      } else {
        return { id: this.id.split(".")[0] };
      }
    },
    // 取得ID，但是以 index 切換顯示
    // 原因是要搭配上下篇移動
    detail_init() {
      let data = {};
      return this.skill_list[this.pollingIndex(data)];
    },
    // 上一篇按鈕
    detail_des() {
        let data = {};
        if(this.pollingIndex(data) === 0){
          return this.skill_list[0];
        }else{
          return this.skill_list[this.pollingIndex(data) -1];
        }
    },
    // 下一篇按鈕
    detail_asc() {
        let data = {};
        if(this.pollingIndex(data) !== this.skill_list.length -1){
          return this.skill_list[this.pollingIndex(data) + 1];
        }else{
          return this.skill_list[this.skill_list.length -1];
        }
    },
  },
  methods: {
    callBack() {
      const vm = this;
      let tag = document.createElement("script");
      tag.setAttribute("src", `${vm.scripts}&nocache=${new Date().getTime()}`);
      document.body.appendChild(tag);
    },
    getJSON() {
      const vm = this;
      window.gotSkill = function (data) {
        data.list.forEach((element, i) => {
          element.index = i;
          vm.skill_list.push(element);
          vm.skill_length = vm.skill_list.length;
        });
      };
      vm.callBack();
    },
    // 遍歷資料取索引
    pollingIndex(data){
      this.skill_list.forEach((el) => {
        if (el.id === this.queryAttr.id) {
          data = el;
        }
      });
      return data.index
    },
  },
  created() {
    this.getJSON();
  },
};
</script>

<style lang="scss" scoped>
.next_btn {
  a {
    cursor: pointer;
  }
}
</style>