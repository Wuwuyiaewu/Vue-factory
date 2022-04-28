<template>
  <div class="main_content">
    <Newbie />
    <div class="teaching_content2">
      <Adv />
      <Skill />
    </div>
  </div>
</template>

<script>

import Newbie from "@/components/Newbie_grid";
import Adv from "@/components/Adv_grid";
import Skill from "@/components/Skill_grid";
export default {
  components: {
    Newbie,
    Adv,
    Skill,
  },
};
</script>

<style>
</style>