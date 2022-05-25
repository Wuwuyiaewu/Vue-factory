<template>
  <div class="quote headNav">
    <div class="navTitle">
      <div class="navItem">
        <img class="black" src="@/assets/images/nav/a_top_return.png" @click="back">
        <span>添加自选</span>
      </div>
    </div>
    <div class="content">
      
      <div class="quoteNav">
        <input value="" v-model="keyword">
      </div>

      <div class="conList">
        <div class="item"><p>交易产品(点差)</p><p>最新价/涨跌幅</p><p>买入价</p></div>
        <ul>
          <li v-for="(data,index) in filteredTickList">
            <span>{{data.symbolName}}
              <em>{{data.symbol}}
                <i 
                v-if="!data.symbolData"
                >({{Math.abs((data.bid - data.ask) / quote.notify[data.uiCodeID].pipv).toFixed(quote.notify[data.uiCodeID].diff)}})
                </i>
                <i
                  v-else
                >({{Math.abs((data.bid - data.ask) / data.symbolData.pipv).toFixed(data.symbolData.diff)}})
                </i>
              </em>
            </span>
            <p />
          </li>
        </ul>
      </div>
    </div>
    <div class="checkAll">
      <em /><span>全选</span><span class="color">全选</span>
    </div>
  </div>
</template>
<script>
require('@/assets/css/quotation.css')
import { mapState } from "vuex";

export default {
  name: 'Optional',
  data() {
    return {
      istrue: 0,
      keyword : ''
    }
  },
  mounted() {
    this.$bus.$emit('loading', true)
    this.removeFixed()
  },
  activated() {
    this.$bus.$emit('loading', true)
    this.removeFixed()
  },
  computed: {
    ...mapState(["quote", "user"]),

    filteredTickList: function() {

      let keyword = this.keyword.trim().toLowerCase();
      let filtarr = this.quote.tickList

        //filt2arr= this.tickList2.filter((ele) =>this.Product(ele) && this.checkids.includes(this.quote.notify[ele.uiCodeID].searchflag))
        //filt2arr= this.quote.tickList.filter(tick => this.suggestIDs.includes(tick.uiCodeID))
        //filt2arr= this.quote.tickList.filter((ele) => this.quote.notify[ele.uiCodeID].searchflag == 2)

        if(!keyword){
          return filtarr;
        }

        let filteredTickList = this.quote.tickList.filter(function(item){
          if(item.symbol.toLowerCase().indexOf(keyword) !== -1 || item.symbolName.indexOf(keyword) !== -1){
            return item;
          }
        })

        //filt2arr = this.tickList2.filter((ele) =>this.Product(ele) && this.quote.notify[ele.uiCodeID].uchZone === id);

        //console.log(filt2arr)
        //return filt2arr.sort(this.sortByRate("profit"))

        return filteredTickList
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    removeFixed() {
      const mainH = document.getElementById('main')
      mainH.classList.remove('mainFixed')
      mainH.style.width = '750px'
    },
    tabclick: function(index) {
      this.istrue = index
    }
  }
}
</script>
