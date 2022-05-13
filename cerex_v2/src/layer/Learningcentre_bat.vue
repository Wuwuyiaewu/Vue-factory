<template>
<Banner/>
  <div class="main_content">
    <Newbie />
    <div class="teaching_content2">
      <Adv />
      <Skill />
    </div>
  </div>
</template>

<script>
import Banner from "@/components/Banner";
import Newbie from "@/components/Newbie_grid";
import Adv from "@/components/Adv_grid";
import Skill from "@/components/Skill_grid";
export default {
  components: {
    Banner,
    Newbie,
    Adv,
    Skill,
  },
};
</script>

<style>
</style>