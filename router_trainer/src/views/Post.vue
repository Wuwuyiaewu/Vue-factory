<template>
<h1>Post from User - {{userId}}</h1>
<ol>
    <li v-for="post in posts" :key="post.id">
        <h3>{{post.title}}</h3>
        <p>{{post.body}}</p>
    </li>
</ol>
</template>

<script>
export default {
  data() {
    return {
      posts: [],
    };
  },
  computed: {
    userId() {
      return this.$route.params.userId;
    },
  },
  watch: {
    // 若沒有監聽，因為同個元件切換並不會銷毀，會導致只有created 時候發一次，之後變動都不再更新
    // async userId(val) {
    //   this.userInfo = await this.fetchUserInfo(val);
    // },
  },
  methods: {
    fetchUserInfo(id) {
      return fetch("https://jsonplaceholder.typicode.com/posts?userId" + id)
        .then((res) => res.json())
        .then((json) => json);
    },
  },
  async created() {
    this.posts = await this.fetchUserInfo(this.userId);
  },
  // 同步非同步設定，能幫助等待 fetch 取得資料後回傳
//   async beforeRouteUpdate(to,from){
//     this.userInfo = await this.fetchUserInfo(to.params.userId);
//     console.log(to.params.userId,from);
//   }
};
</script>

<style>
</style>