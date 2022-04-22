<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <ul>
      <li v-for="i in 5" :key="i">
        <router-link :to="`/user_child/${i}`">/user_child/{{i}}</router-link>
      </li>
    </ul>
  </nav>
  <router-view/>
  {{userInfo}}
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
    // async userId(val) {
    //   this.userInfo = await this.fetchUserInfo(val);
    // },
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
  },
  
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
