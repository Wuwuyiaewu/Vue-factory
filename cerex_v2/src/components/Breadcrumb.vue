<template>
  <div class="hierarchy_menu">
    <ul>
      <li v-for="link of metaLink" :key="link.name">
      <router-link :to="{path:`${link.link}`,hash:'#main_content'}" >{{ link.name }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Breadcrumb",
  data() {
    return {
      breadcrumbList: [],
    };
  },
  methods: {
    updateList() {
      this.breadcrumbList = this.$route.meta.breadcrumb;
    },
  },
  computed: {
    metaLink() {
      return this.breadcrumbList;
    },
  },
  mounted() {
    this.updateList();
  },
};
</script>

<style lang="scss" scoped>
ul {
  a{
    text-decoration: none;
    color:rgba(255, 255, 255, 0.5);
  }
  .router-link-exact-active{
    color:#fff;
  }
  a[href*='detail']{
    color:#fff;
  }
  display: block;
  margin: auto;
  font-size: 18px;
  max-width: 1200px;
  color: rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
  line-height: 20px;
  padding: 0.1rem 0.2rem;
  li {
    display: inline-block;
  }
  li + li {
    position: relative;
    margin: 0 0.02rem;
    &::before {
      content: ">";
      margin-right: 0.02rem;
    }
  }
}
</style>