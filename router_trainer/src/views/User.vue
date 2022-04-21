<template>
  <h1>User id {{ $route.params.userId }}</h1>
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
    async userId(val) {
      this.userInfo = await this.fetchUserInfo(val);
    },
  },
  methods: {
    async fetchUserInfo(id) {
      return await fetch("https://jsonplaceholder.typicode.com/users/" + id)
        .then((res) => res.json())
        .then((json) => json);
    },
  },
};
</script>

<style>
</style>