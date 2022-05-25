<template>
  <!-- header begin -->
  <div class="header w-bg" id="header" v-show="headfoot !== 'none'">
    <div class="header_inside">
      <a :href="`/index.html?utm_source=${linkDefault.utm_source}&utm_medium=${linkDefault.utm_medium}`" class="top_logo">
        <img src="@/assets/images/top_logo.png" />
      </a>
      <div class="main_menu">
        <ul>
          <li>
            <a :href="`/?utm_source=${linkDefault.utm_source}&utm_medium=${linkDefault.utm_medium}`">首页</a>
          </li>
          <li class="sub_hide">
            <p @click="mobile_submenu('product_list')" class="product_list">
              产品
              <svg
                id="icon"
                x="0px"
                y="0px"
                viewBox="0 0 100 100"
                xml:space="preserve"
              >
                <polygon
                  class="st0"
                  points="93.48,30.98 50,39.18 6.52,30.98 50,76.9 "
                />
              </svg>
            </p>
            <ul>
              <li><a :href="`/products_overview.html?utm_source=${linkDefault.utm_source}&utm_medium=${linkDefault.utm_medium}`">产品概览</a></li>
              <li><a :href="`/agreement.html?utm_source=${linkDefault.utm_source}&utm_medium=${linkDefault.utm_medium}`">合约细则</a></li>
              <li><a :href="`/transaction.html?utm_source=${linkDefault.utm_source}&utm_medium=${linkDefault.utm_medium}`">交易安排</a></li>
              <li>
                <a
                  :href="`@/assets/images/products/Cerex_expiry_date.pdf`"
                  target="_blank"
                  >合约到期日</a
                >
              </li>
              <li><a :href="`/products_details.html?utm_source=${linkDefault.utm_source}&utm_medium=${linkDefault.utm_medium}`">产品优势</a></li>
            </ul>
          </li>
          <li class="">
            <a :href="`/download.html?utm_source=${linkDefault.utm_source}&utm_medium=${linkDefault.utm_medium}`">平台下载</a>
          </li>
          <li class="sub_hide select">
            <p @click="mobile_submenu('info_list')" class="info_list">
              资讯中心
              <svg
                id="icon"
                x="0px"
                y="0px"
                viewBox="0 0 100 100"
                xml:space="preserve"
              >
                <polygon
                  class="st0"
                  points="93.48,30.98 50,39.18 6.52,30.98 50,76.9 "
                />
              </svg>
            </p>
            <ul>
              <li><a :href="`/news_comment.html?utm_source=${linkDefault.utm_source}&utm_medium=${linkDefault.utm_medium}`">新闻评论</a></li>
              <li><a :href="`/calendar.html?utm_source=${linkDefault.utm_source}&utm_medium=${linkDefault.utm_medium}`">财经日历</a></li>
              <li><a :href="`/teaching_center.html?utm_source=${linkDefault.utm_source}&utm_medium=${linkDefault.utm_medium}`">教学中心</a></li>
              <li><a :href="`/qna.html?utm_source=${linkDefault.utm_source}&utm_medium=${linkDefault.utm_medium}`">常见问题</a></li>
              <li><a :href="`/news.html?utm_source=${linkDefault.utm_source}&utm_medium=${linkDefault.utm_medium}`">最新公告</a></li>
            </ul>
          </li>
          <li class="sub_hide">
            <p @click="mobile_submenu('com_list')" class="com_list">
              公司简介
              <svg
                id="icon"
                x="0px"
                y="0px"
                viewBox="0 0 100 100"
                xml:space="preserve"
              >
                <polygon
                  class="st0"
                  points="93.48,30.98 50,39.18 6.52,30.98 50,76.9 "
                />
              </svg>
            </p>
            <ul>
              <li><a :href="`/about_us.html?utm_source=${linkDefault.utm_source}&utm_medium=${linkDefault.utm_medium}`">品牌故事</a></li>
              <li><a :href="`/contact_us.html?utm_source=${linkDefault.utm_source}&utm_medium=${linkDefault.utm_medium}`">联系我们</a></li>
              <li><a :href="`/event.html?utm_source=${linkDefault.utm_source}&utm_medium=${linkDefault.utm_medium}`">优惠活动</a></li>
            </ul>
          </li>
        </ul>

        <div class="top_right">
          <a href="#" class="btn1"
            ><svg x="0px" y="0px" viewBox="0 0 100 100">
              <path
                class="st0"
                d="M15.08,36.69c0,8.96,4.15,15.42,11.48,18.01v26.99L33.67,90h10.94V79.58l-3.28-2.59v-0.34l3.28-3.11V69.3
	l-3.28-3.71v-0.47l3.28-2.59v-3.95h0.84c2.69-0.01,5.15-0.44,7.33-1.31l19.24,19.6h10.46l7.32-7.79l-6.48-6.97h-4.27v-4.64
	l-4.28-3.56h-3.93v-4.69l-6.54-6.37c1.1-6.05-0.91-12.42-5.41-16.92c-0.11-0.12-0.23-0.22-0.35-0.33v-2.04
	c0-7.23-5.88-13.12-13.12-13.12c-5.18,0-9.66,3.03-11.79,7.4C23.2,18,15.08,26.22,15.08,36.69z M32.3,31.77h3.28v-1.82
	c0.5,0.45,0.82,1.1,0.82,1.82c0,1.36-1.1,2.46-2.46,2.46s-2.46-1.1-2.46-2.46c0-0.72,0.32-1.37,0.82-1.82V31.77z M55.24,23.1
	c-1.76-1.07-3.69-1.85-5.72-2.29l-0.34-0.07l-4.58,0.31c-2.16-1.46-4.66-2.46-7.37-2.92c1.77-2.65,4.78-4.4,8.19-4.4
	C50.69,13.73,54.99,17.89,55.24,23.1z M44.61,53.67v-1.24c2.69-2.54,8.2-8.61,8.2-15.73c0-4.04-1.22-7.74-3.3-10.78
	c2.22,0.66,4.25,1.84,5.91,3.5c3.63,3.62,5.09,8.84,3.82,13.61l-0.37,1.39l7.06,6.88v4.5l1.33,3.04H73l1.13,0.94v4.63l1.81,2.63
	h5.24l1.89,2.03l-2.72,2.89h-6.27L53.77,51.28l-1.63,0.88c-1.87,1.02-4.06,1.51-6.7,1.51H44.61z M19.99,36.69
	c0-7.28,5.3-13.08,12.34-13.85c-0.02,0.25-0.04,0.48-0.04,0.73v1.02c-3.28,0.75-5.74,3.68-5.74,7.18c0,4.07,3.31,7.38,7.38,7.38
	s7.38-3.31,7.38-7.38c0-3.5-2.46-6.43-5.74-7.18v-1.02c0-0.25,0.02-0.48,0.04-0.72c7,0.81,12.27,6.59,12.27,13.84
	c0,4.7-3.8,9.69-7.36,12.8l-0.84,0.74l0,9.94l-3.28,2.59v4.72l3.28,3.71v0.26l-3.28,3.11v4.84l3.28,2.59v3.09h-3.75l-4.45-5.21
	V50.95l-1.87-0.46C21.25,48.41,20,40.95,19.99,36.69z"
              /></svg
            >开立账户</a
          >
          <a href="#" class="btn2"
            ><svg x="0px" y="0px" viewBox="0 0 100 100">
              <path
                class="st0"
                d="M60.72,52.04C76.19,56.69,87.35,71.15,87.84,88h-4.51C82.74,69.92,68.31,54.98,50,54.98
	c-18.31,0-32.74,14.95-33.33,33.02h-4.51c0.49-16.85,11.66-31.31,27.13-35.97c-6.15-3.66-10.27-10.37-10.27-18.05
	C29.01,22.4,38.41,13,50,13c11.58,0,20.99,9.41,20.99,20.99C70.99,41.66,66.87,48.37,60.72,52.04L60.72,52.04z M50,17.51
	c-9.1,0-16.48,7.38-16.48,16.48c0,9.11,7.37,16.48,16.48,16.48c9.1,0,16.48-7.38,16.48-16.48C66.48,24.88,59.11,17.51,50,17.51z"
              /></svg
            >用户中心</a
          >

          <a href="#" class="btn3">下载APP</a>
          <a href="#" class="btn4"
            ><img src="@/assets/images/mobile_cs.png"
          /></a>
          <p class="mobile_menu" @click="show_mobile_menu">
            <img src="@/assets/images/mobile_top_menu1.png" />
            <img src="@/assets/images/mobile_top_menu2.png" />
          </p>
        </div>
        <!-- /top_right-->

        <div class="mobile_menu_btn">
          <a href="#">用户中心</a>
          <a href="#">开立账户</a>
        </div>
      </div>
      <!--/main_menu-->
    </div>
    <!-- /header_inside-->

	<div class="right_menu">
	<a href="#">
		<svg  x="0px" y="0px"  viewBox="0 0 40 40" >
		<circle class="st0" cx="20" cy="24" r="2"/>
		<path class="st0" d="M17.92,17.06c0-1.97,2.48-4.04,3.63-5.23c0.98-1.01,0.89-2.72-0.32-3.57c-0.72-0.5-1.68-0.53-2.42-0.05
			c-0.64,0.41-0.99,1.06-1.06,1.74c0,0.85-0.07,1.24-0.9,1.24h-2.13c-0.83,0-0.72-0.39-0.72-1.24c0.07-1.74,0.84-3.46,2.33-4.66
			c2.01-1.61,4.86-1.73,6.97-0.27c3.24,2.25,3.57,6.9,0.89,9.55c-0.84,0.83-2.73,2.21-2.73,3.23v1.47c0,0.41-0.23,0.73-0.63,0.73H18.7
			c-0.39,0-0.8-0.33-0.8-0.73v-2.21H17.92z"/>
		<path class="st0" d="M14.04,36c-0.21,0-0.43-0.04-0.64-0.12c-0.65-0.26-1.07-0.88-1.07-1.59V31H9.81C7.74,31,6,29.17,6,27V16.84
			C6,14.72,7.71,13,9.81,13h2.11v2H9.81C8.81,15,8,15.83,8,16.84V27c0,1.07,0.85,2,1.81,2h4.52v4.59l4.7-4.59H30c1.01,0,2-0.99,2-2
			V16.84c0-1.01-0.81-1.84-1.81-1.84h-2.11v-2h2.11c2.1,0,3.81,1.72,3.81,3.84V27c0,2.13-1.87,4-4,4H19.85l-4.61,4.5
			C14.93,35.82,14.49,36,14.04,36z M13.83,34.08c0,0-0.01,0.01-0.01,0.01L13.83,34.08z"/>
		</svg>
		在线客服
	</a>
	<a href="#">
		<svg  x="0px" y="0px"  viewBox="0 0 40 40" >
		<path class="st0" d="M6,14.56c0,3.6,1.65,6.2,4.56,7.25v10.85L13.38,36h4.34v-4.18l-1.3-1.04v-0.14l1.3-1.25v-1.71l-1.3-1.49V26
		l1.3-1.04v-1.59h0.33c1.07,0,2.05-0.18,2.91-0.53l7.64,7.88h4.15l2.91-3.13l-2.57-2.81h-1.7v-1.87l-1.7-1.43h-1.56V19.6l-2.6-2.56
		c0.44-2.43-0.36-4.99-2.15-6.81c-0.04-0.05-0.09-0.09-0.14-0.13V9.28c0-2.91-2.34-5.28-5.21-5.28C16,4,14.22,5.22,13.37,6.98
		C9.23,7.04,6,10.34,6,14.56z M12.84,12.58h1.3v-0.73c0.2,0.18,0.33,0.44,0.33,0.73c0,0.55-0.44,0.99-0.98,0.99
		c-0.54,0-0.98-0.44-0.98-0.99c0-0.29,0.13-0.55,0.33-0.73V12.58z M21.95,9.09c-0.7-0.43-1.47-0.74-2.27-0.92l-0.14-0.03l-1.82,0.12
		c-0.86-0.59-1.85-0.99-2.93-1.17c0.7-1.06,1.9-1.77,3.25-1.77C20.15,5.32,21.85,6.99,21.95,9.09z M17.73,21.38v-0.5
		c1.07-1.02,3.26-3.47,3.26-6.33c0-1.62-0.48-3.11-1.31-4.33c0.88,0.27,1.69,0.74,2.35,1.41c1.44,1.46,2.02,3.56,1.52,5.48
		l-0.15,0.56l2.81,2.77v1.81l0.53,1.22h2.28l0.45,0.38v1.86l0.72,1.06h2.08L33,27.58l-1.08,1.16h-2.49l-8.07-8.32l-0.65,0.35
		c-0.74,0.41-1.62,0.61-2.66,0.61H17.73z M7.95,14.56c0-2.93,2.11-5.26,4.9-5.57c-0.01,0.1-0.01,0.19-0.01,0.29v0.41
		c-1.3,0.3-2.28,1.48-2.28,2.89c0,1.64,1.32,2.97,2.93,2.97s2.93-1.33,2.93-2.97c0-1.41-0.98-2.59-2.28-2.89V9.28
		c0-0.1,0.01-0.19,0.01-0.29c2.78,0.32,4.87,2.65,4.87,5.57c0,1.89-1.51,3.9-2.92,5.15L15.77,20v4l-1.3,1.04v1.9l1.3,1.49v0.11
		l-1.3,1.25v1.95l1.3,1.04v1.24h-1.49l-1.77-2.1V20.29l-0.74-0.19C8.62,19.31,7.95,16.65,7.95,14.56z"/>
		</svg>
		在线客服
	</a>
	<a href="#">
		<svg  x="0px" y="0px"  viewBox="0 0 40 40" >
		<path class="st0" d="M24.53,20.66C31.07,22.64,35.79,28.81,36,36h-1.91C33.84,28.29,27.74,21.91,20,21.91
		c-7.74,0-13.84,6.38-14.09,14.09H4c0.21-7.19,4.93-13.36,11.47-15.35c-2.6-1.56-4.34-4.43-4.34-7.7C11.13,8.01,15.1,4,20,4
		c4.9,0,8.87,4.01,8.87,8.96C28.87,16.23,27.13,19.09,24.53,20.66L24.53,20.66z M20,5.93c-3.85,0-6.97,3.15-6.97,7.03
		c0,3.89,3.12,7.03,6.97,7.03c3.85,0,6.97-3.15,6.97-7.03C26.97,9.07,23.85,5.93,20,5.93z"/>
		</svg>
		在线客服
	</a>
	<a href="#">
		<svg  x="0px" y="0px"  viewBox="0 0 40 40" >
		<g>
			<path class="st0" d="M12.95,7.16c-0.55,0-0.99,0.44-0.99,0.99s0.44,0.99,0.99,0.99h5.21c0.55,0,0.99-0.44,0.99-0.99
				s-0.44-0.99-0.99-0.99H12.95z"/>
			<path class="st0" d="M24.14,29.73H7.99V7.74c0-0.97,0.79-1.75,1.75-1.75H21.4c0.87,0,1.62,0.66,1.73,1.54
				c0.07,0.54,0.56,0.93,1.11,0.86c0.54-0.07,0.93-0.56,0.86-1.11C24.86,5.41,23.27,4,21.4,4H9.74C7.68,4,6,5.68,6,7.74v22.98v1.54
				C6,34.32,7.68,36,9.74,36H21.4c2.06,0,3.74-1.68,3.74-3.74v-1.54C25.14,30.17,24.69,29.73,24.14,29.73z M23.14,32.26
				c0,0.97-0.79,1.75-1.75,1.75H9.73c-0.97,0-1.75-0.79-1.75-1.75v-0.55h15.17V32.26z"/>
			<path class="st0" d="M24.48,10.03c-5.19,0-9.42,4.22-9.42,9.42c0,1.72,0.46,3.38,1.34,4.85l-0.64,2.67
				c-0.08,0.34,0.02,0.69,0.26,0.93c0.24,0.24,0.6,0.35,0.93,0.26l2.67-0.64c1.46,0.88,3.13,1.34,4.85,1.34
				c5.19,0,9.42-4.22,9.42-9.42C33.9,14.25,29.67,10.03,24.48,10.03z M24.48,26.88c-1.47,0-2.9-0.43-4.12-1.25
				c-0.16-0.11-0.36-0.17-0.55-0.17c-0.08,0-0.16,0.01-0.23,0.03l-1.51,0.36l0.36-1.51c0.06-0.27,0.01-0.55-0.14-0.78
				c-0.82-1.22-1.25-2.64-1.25-4.12c0-4.1,3.33-7.43,7.43-7.43c4.1,0,7.43,3.33,7.43,7.43C31.91,23.55,28.58,26.88,24.48,26.88z"/>
			<path class="st0" d="M27.37,19.25l-2.13,2.28v-6.35c0-0.49-0.4-0.89-0.89-0.89c-0.49,0-0.89,0.4-0.89,0.89v6.35l-2.13-2.28
				c-0.34-0.36-0.9-0.38-1.26-0.05c-0.36,0.34-0.38,0.9-0.05,1.26l3.67,3.93c0.34,0.36,0.9,0.38,1.26,0.05
				c0.02-0.01,0.03-0.03,0.05-0.05c1.22-1.31,2.45-2.62,3.67-3.93c0.34-0.36,0.32-0.93-0.05-1.26C28.27,18.87,27.71,18.89,27.37,19.25
				z"/>
		</g>
		</svg>
		在线客服
	</a>
	<p onClick="back_top()">
	<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
		 width="50px" height="50px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve">
	<polygon points="25,13 37.499,24 50,35 25,35 0,35 12.5,24 "/>
	</svg>
	</p>	
	</div>	
		
  </div>
  <!-- header end -->
</template>

<script>
export default {
  data() {
    return {
      query: this.$route.query,
    };
  },
  computed: {
    store(){
      return this.$store.state.st
    },
    headfoot() {
      return this.query.headfoot;
    },
    linkDefault() {
      let text = location.href;
      let patternM =  /m\./gi;
      let patternWWW = /www\./gi;
      let patternLocalhost = /localhost\:/gi;
      let result1 = patternM.test(text);
      let result2 = patternWWW.test(text);
      let result3 = patternLocalhost.test(text);
      let obj = {
        utm_source: this.query.utm_source || "o7",
        utm_medium: result3?"local":""|result1?"m-guanwang":""|result2?"pc-guanwang":"",
      };
      // if(this.query.utm_source)
      return obj;
    },
  },
  methods: {
    show_mobile_menu() {
      $("body").toggleClass("show_m_menu");
      var this_height =
        $(window).height() -
        $("#header").outerHeight() -
        $(".mobile_menu_btn").outerHeight();
      $(".main_menu>ul").css({
        "max-height": this_height + "px",
      });
    },
    mobile_submenu(this_o) {
      $(`.${this_o}`).parent("li").toggleClass("sub_hide");
    },
  },
};
</script>
<style>
</style>