<template>
  <div class="layout" :class="user.loginname ? '' : 'last'">
    <div
      class="title"
    ><span>市场动态</span><a
      @click="goNews"
    >更多动态</a></div>
    <div class="conList1">
      <div id="listNav" class="listNav">
        <ul>
          <li
            v-for="(item, index) in tabs"
            :class="{ checked: isTrue == index }"
            @click="tabclick(index, item)"
          ><span>{{ item.name }}</span><p /></li>
        </ul>
      </div>
      <div class="list">
        <ul>
          <li v-for="news in newsList" @click="geDetail(news)">
            <div class="itemCon">
              <div class="leftCon">
                <div
                  class="item1"
                ><p>{{ news.title }}</p></div>
                <div
                  v-if="news.ctime"
                  class="item2"
                ><img src="@/assets/images/index/home_icon1.png">
                  <time>{{ Number(news.ctime) | time }}</time>
                </div>
              </div>
              <div class="rightCon"><img :src="news.imageUrl"></div>
            </div>
            <div v-if="news.productCode" class="itemKey">
              <div
                v-for="(rate, index) in news.productCode.split(',')"
                v-if="quote.symbolTickMap[rate] && index < 2"
                class="item"
                :class="isOks(quote.symbolTickMap[rate].rate)"
              ><p>{{ quote.symbolTickMap[rate].symbolName }}</p><span>{{ quote.symbolTickMap[rate].rate.toFixed(2) }}%</span></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Util from '@/utils/tradeDataUtil'
export default {
  name: 'NewIndexList',
  filters: {
    time(longTime) {
      return Util.formatDate(longTime, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  computed: {
    ...mapState(['quote', 'user']),
    checkTypeId: {
      get() {},
      set(val) {
        this.getNewList(val)
      }
    }
  },
  data() {
    return {
      tabs: JSON.parse(process.env.VUE_APP_INDEXNEWLIST),
      isTrue: 0,
      newsList: [],
      checkName: '推荐',
      sign: process.env.VUE_APP_GA_SIGN
    }
  },
  mounted() {
    this.getNewList(9119);
  },
  methods: {
    tabclick(index, item) {
      this.isTrue = index
      this.checkTypeId = item.typeId
      this.checkName = item.name
    },
    isOks: function(obj) {
      var val
      if (obj > 0) {
        val = 'rise'
      } else if (obj == 0) {
        val = 'level'
      } else {
        val = 'fall'
      }
      return val
    },
    goNews() {
      this.$bus.$emit('loading', false)
      this.$router.push({ path: '/home/NewsList' })
    },
    getNewList(val) {
      let secondTypeId
      if (val == 9119) secondTypeId = '&secondTypeIds=9139,9121,9151,9185'
      else secondTypeId = '&secondTypeId=' + val
      this.axios
        .get(
          process.env.VUE_APP_INFO +
            '/v2/api/article/getArticleAllList?firstTypeId=9119' +
            secondTypeId +
            '&limit=3',
          { headers: { isAjax: 'true' }}
        )
        .then((res) => {
          if (res.data.code == 0) {
            this.newsList = res.data.data
          }
        })
    },
    geDetail(news) {
      this.$bus.$emit('loading', false)
      this.$router.push({
        path: '/home/NewsDetail',
        query: {
          id: news.articleId,
          title: this.checkName
        }
      })
    }
  }
}
</script>
