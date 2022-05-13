<template>
<Banner/>
  <div class="main_content">
    <div class="teaching_center_list">
      <ul class="page_list">
        <li v-for="item of dataList" :key="item.id" class="line_clamp">
          <span class="pic"
            ><img :src="`https://cerexx.com/${item.img}`"
          /></span>
          <div>
            <p>
              <b>{{ item.title }}</b>
              <div class="content" v-if="item.content" v-html="item.content"></div>
              
              <router-link
                :to="{
                  path: `/learningcentre/beginner/detail/${item.id}.html`,
                  query:{headfoot:headfoot}
                }">阅读全文&gt;</router-link>
            </p>
          </div>
        </li>
      </ul>
     <PageBtn @setIndex="setIndex"/>

    </div>
  </div>
</template>

<script>
import PageBtn from "@/components/Page_btn";
import Banner from "@/components/Banner";
export default {
  provide() {
    return {
      getCategoryId: 741,
      btnValue: this.fApiValue,
    };
  },
  components: {
    Banner,
    PageBtn,
  },
  data() {
    return {
      scripts:
        "https://cerexx.com/fApi/freeDirection?categoryId=741&callback=gotNewbie",
      fApiValue: {
        // 頁數
        pageIndex: 1,
        // 每頁顯示幾筆
        PageSize: 8,
        // 總筆數
        totalCount: 0,
      },
      // 物件
      newbie_list: [],
      // 當頁長度
      newbie_length: 0,
      headfoot: new URL(window.location.href).searchParams.get("headfoot"),
    };
  },
  methods: {
    setCallBack() {
      const vm = this;
      let tag = document.createElement("script");
      tag.setAttribute(
        "src",
        `https://cerexx.com/fApi/freeDirection?categoryId=741&callback=gotNewbie&nocache=${new Date().getTime()}`
      );
      document.body.appendChild(tag);
    },
    getJSON() {
      const vm = this;
      vm.newbie_list = [];
      window.gotNewbie = function (data) {
        data.list.forEach((element, i) => {
          element.index = i;
          vm.newbie_list.push(element);
        });
        // 當下頁數文章長度
        vm.newbie_length = vm.newbie_list.length;
        // 總頁數 (使用 fapi 設定非自行計算)
        vm.fApiValue.TotalPage = data.totalPage;
        vm.fApiValue.totalCount = data.totalCount;
      };
    },
    // setIndex *c
    setIndex(val) {
      if (val.asign) {
        this.fApiValue.pageIndex = val.num;
      }
      if (!val.asign) {
        this.fApiValue.pageIndex += val.num;
      }
    },
  },
  computed: {
    // 計算當前總頁數
    TotalPage() {
      return Math.ceil(this.fApiValue.totalCount / this.fApiValue.PageSize);
    },
    // 更新頁面引導
    pageUpdated() {
      return this.fApiValue.pageIndex;
    },
    pageCount() {
      return this.fApiValue.PageSize;
    },
    // 取 fApi 資料做渲染
    dataList() {
      let vm = this;
      let newArr = [];
      // 不更動原本 fApi 的資料，從原本的資料裡做 CRUD ，並與分頁按鈕做連動處理
      for (
        let index = 0;
        index < vm.newbie_length / vm.fApiValue.PageSize;
        index++
      ) {
        newArr.push(
          vm.newbie_list.slice(
            index * vm.fApiValue.PageSize,
            (index + 1) * vm.fApiValue.PageSize
          )
        );
      }
      return newArr[vm.pageUpdated - 1];
    },
  },
  watch: {
    // 監聽頁簽變動時，最末與最首鎖定
    pageUpdated(nval, _2) {
      if (nval == this.TotalPage + 1) {
        this.fApiValue.pageIndex = this.TotalPage;
      }
      if (nval <= 0) {
        this.fApiValue.pageIndex = 1;
      }
    },
  },
  created() {
    this.setCallBack();
    this.getJSON();
  },
};
</script>

<style lang="scss">
@import "@/assets/css/page_btn.css";
.line_clamp {
  div.content {
    p{
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box !important;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      padding-bottom: 0;
    }
  }
}
</style>