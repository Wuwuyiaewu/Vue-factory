
<template>
  <!-- 擷取 router id 發送api 取 json 資料 -->
  <h1>User: {{ UserId }} - {{ userInfo?.name }}</h1>
  <div>username: @{{ userInfo.username }}</div>
  <div>email: {{ userInfo.email }}</div>
  <div>phone: {{ userInfo.phone }}</div>

  <hr />

  Show
  <router-link :to="{name:'User_child_post',params:{userId:userId}}">/user_child/{{userId}}/posts</router-link>


  <hr>

  <router-view></router-view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {},
    };
  },
  computed: {
    userId() {
      return this.$route.params.userId;
    },
  },
  watch: {
    // 若沒有監聽，因為同個元件切換並不會銷毀，會導致只有created 時候發一次，之後變動都不再更新
    async userId(val) {
      this.userInfo = await this.fetchUserInfo(val);
    },
  },
  methods: {
    fetchUserInfo(id) {
      return fetch("https://jsonplaceholder.typicode.com/users/" + id)
        .then((res) => res.json())
        .then((json) => json);
    },
  },
  async created() {
    this.userInfo = await this.fetchUserInfo(this.userId);
    console.log(this.userInfo);
  },
  // 同步非同步設定，能幫助等待 fetch 取得資料後回傳
  // async beforeRouteUpdate(to, from) {
  //   this.userInfo = await this.fetchUserInfo(to.params.userId);
  //   console.log(to.params.userId, from);
  // },
};
</script>

<style>
</style>