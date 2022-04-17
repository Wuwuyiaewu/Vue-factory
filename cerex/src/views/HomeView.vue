<template>
  <div class="home">
    <Learningcentre msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Learningcentre from '@/components/learningcentre.vue'
export default {
  name: 'HomeView',
  components: {
    Learningcentre
  }
}
</script>
