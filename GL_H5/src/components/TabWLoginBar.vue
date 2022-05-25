<template>
  <div class="fixed-bottom">
      <LoginBar />
      <Tab />
  </div>
</template>

<script>
import Tab from "@/components/Tab.vue";
import LoginBar from "@/components/home/LoginBar.vue";
export default {
    name: "TabWLoginBar",
    components: { LoginBar, Tab }
}
</script>

<style>
.fixed-bottom {
    position: fixed;
    bottom: 0;
    z-index: 99;
    width: 100%;
    max-width: 750px;
    /* height: 1.65rem; */
}
.fixed-bottom .login_bar{
    position: relative;
    bottom: unset;
}
.fixed-bottom #tab {
    position: relative;
    bottom: unset;
}
</style>