<template>
  <div class="home-small-btns">
    <div
      v-for="(btn, index) in btns"
      :key="index"
      @click="clickHandler(btn)"
      class="button"
    >
      <img :src="btn.pic" :alt="'btn' + index" />
      <p>{{ btn.buttonText }}</p>
    </div>
  </div>
</template>

<script>
import hrefDict from "@/utils/apiHrefMap";

export default {
  props: ['btns'],
  methods: {
    clickHandler(btn) {
      console.log(btn);
      if (btn.other_href != "") {
        if (btn.href == "gotoOther") {
          let url_text = btn.other_href;
          let url = new URL(btn.other_href);
          let modifier = url.search != "" ? "&" : "?";
          if (!url.searchParams.get("utm_source")) url_text += modifier + "utm_source=" + sessionStorage.getItem("utm_source");
          if (!url.searchParams.get("utm_medium") && sessionStorage.getItem("utm_medium")) url_text += modifier + "utm_medium=" + sessionStorage.getItem("utm_medium");
          if (!url.searchParams.get("utm_campaign") && sessionStorage.getItem("utm_campaign")) url_text += modifier + "utm_campaign=" + sessionStorage.getItem("utm_campaign");
          if (!url.searchParams.get("utm_content") && sessionStorage.getItem("utm_content")) url_text += modifier + "utm_content=" + sessionStorage.getItem("utm_content");
          if (!url.searchParams.get("utm_term") && sessionStorage.getItem("utm_term")) url_text += modifier + "utm_term=" + sessionStorage.getItem("utm_term");
          this.$router.push({
            path: "/home/BannerUrl",
            query: {
              title: btn.buttonText,
              url: url_text,
            },
          });
        } else {
          // for handling cases like going to a specific product quotation view / article
        }
      } else {
        this.$router.push({
          path: hrefDict[href],
        });
      }
    },
  },
};
</script>

<style></style>
