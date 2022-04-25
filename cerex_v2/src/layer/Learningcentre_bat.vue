<template>
  <div class="main_content">
    <Newcome />
    <div class="teaching_content2">
      <Adv />
      <Skill />
    </div>
  </div>
</template>

<script>

import Newcome from "@/components/Newcome";
import Adv from "@/components/Adv";
import Skill from "@/components/Skill";
export default {
  components: {
    Newcome,
    Adv,
    Skill,
  },
};
</script>

<style>
</style>