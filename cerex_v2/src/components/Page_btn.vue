<template>
  <div class="page_btn" v-if="btnValue">
    <!-- setIndex *a -->
    <a @click="setIndex({asign:false,num:-1})" class="left"
      ><svg x="0px" y="0px" viewBox="0 0 40 40">
        <polygon points="9.35,0 13.12,20 9.35,40 30.47,20 "></polygon></svg
    ></a>
    <a @click="setIndex({asign:true,num:item})" v-for="item in pageShow" :key="item" :class="btnValue.pageIndex===item?'selected':''">{{item}}</a>
    <a @click="setIndex({asign:false,num:1})" class="right"
      ><svg x="0px" y="0px" viewBox="0 0 40 40">
        <polygon points="9.35,0 13.12,20 9.35,40 30.47,20 "></polygon></svg
    ></a>
  </div>
</template>

<script>
export default {
  inject: ["btnValue"],
  data() {
    return {
    };
  },
  computed:{
    // 計算 inject 後的資料 (父層並非用 vue computed 傳入因此不可更改)
    pageNum(){
      return Math.ceil(this.btnValue.totalCount / this.btnValue.PageSize)
    },
    // 預設 pagination 顯示至多五筆
    pageShow(){
      // 傳遞進來的格式參考
      // "btnValue":{"pageIndex":num,"PageSize":num,"totalCount":num,"TotalPage":num}
      let start = new Number
      let end = new Number
      let arr = []
      // 設定起始 index -2
      start = this.btnValue.pageIndex-2 <= 1 ? 1 : this.btnValue.pageIndex-2
      // 設定結尾 index +2
      end = this.btnValue.pageIndex+2 >= this.pageNum ? this.pageNum : this.btnValue.pageIndex+2
      // 堆疊 pagination 和避免負數出現
      while(end-start < 4 && this.pageNum >3){
        if(end === this.pageNum){
          start -= 1
        }
        if(start === 1){
          end += 1
        }
      }
      for (let index = start -1; index < end; index++) {
        arr.push(index+1)
      }
      return arr
    }
  },
  methods: {
    // setIndex *b
    // 切換顯示與判斷隱藏
    setIndex(val){
      this.$emit("setIndex",val)
    },
  },
  created(){
  }
};
</script>

<style lang="scss" scoped>
.page_btn {
  display: block;
  text-align: center;
  font-size: 0px;
}
.page_btn a {
  display: inline-block;
  width: 0.3rem;
  height: 0.3rem;
  font-size: 20px;
  vertical-align: top;
  box-sizing: border-box;
  color: #58595b;
}
.page_btn a.selected {
  color: #253266;
  font-weight: bold;
}
.page_btn a:hover {
  cursor: pointer;
  color: #253266;
}
.page_btn a svg {
  display: block;
  width: 100%;
  height: 100%;
  fill: #dfdfdf;
}
.page_btn a:hover svg {
  fill: #253266;
}
.page_btn a.left {
  padding: 0.05rem;
  margin-right: 0.1rem;
  transform: rotateY(180deg);
}
.page_btn a.right {
  padding: 0.05rem;
  margin-left: 0.1rem;
}

@media (max-width: 750px) {
  .page_btn a {
    width: 0.3rem;
    height: 0.3rem;
    font-size: 0.24rem;
    margin: 0 0.1rem;
  }
}
</style>
