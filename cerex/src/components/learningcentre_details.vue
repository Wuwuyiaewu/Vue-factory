<template>
  
<body>
    <!--#set var="menu_select" value="4" -->
	<!--#if expr="$QUERY_STRING=/headfoot=none/"-->
	<!--#else-->
	<!--#include file="main/tags/header.html" -->
	<!--#endif-->

	<div class="hierarchy_menu">
		<p>
			首页 &gt; 资讯中心 &gt; <a href="learningcentre.html">教学中心</a> &gt; <b>新手入门</b>
		</p>
	</div>

	<div class="content_page_banner">
		<p class="bg">
			<img src="main/images/information/teaching_banner.jpg">
		</p>
		<div>
			<p>
				<b class="wow fadeInDown">教学中心</b>
				<span class="wow fadeInUp">交易知识系统学习<i></i>运筹帷幄</span>
			</p>
		</div>
	</div>


	<div class="teaching_center_page">
		<h1>外汇汇率如何看? 你只需要看懂走势图</h1>
		<div>
			大盘分析又叫做外汇布局，既然是布局，就需要了解清楚局中的形势，比如发展趋势，趋势好就要趁势而上，并针对投资大盘中的发展趋势进行细心的分析与讨论。这不仅关乎投资的收益，也是投资生涯的一次积累，对于新手来说，难能可贵。不过，需要注意的是，观察外汇行情时一定要特别关注发展趋势的高矮定位点，它的分析价值是非常高的。
			<br><br>
			<b>2、设止损止盈，定位点要找准</b><br>
			成熟的投资者往往不会关注一次进场的收益与得失，因为在进场之前，他们已做出了周密的预测，并及时设置好止盈和止损点。换句话说，即便是输了，也不会伤筋动骨。外汇投资大盘的发展趋势能够分析出实际操作方位，为进场时间、止盈止损点提供充分的参考。除此之外，长期发展趋势的好坏必须分开去看，因为不同的趋势有不一样的特点，每一次的数据信号也都不尽相同。
			<br><br>
			<b>3、看周期时间、形态</b><br>
			外汇行情的起伏与国际形势息息相关，平日里我们也要养成关注新闻以及国内外形势的习惯。不同于新手，很多成熟的老玩家会考虑到国际政治、数据，从而进行足够深入、透彻的分析，这样就可以保证我们投资的可行性。在观察大盘走势期间，也要看周期时间和形态，根据周期时间变换着看日线图、月曲线图，从而互相认证获得最可靠的交易信号，提高成功率。


			<div class="next_btn">
				<a href="#">上一篇</a>
				<a href="#">下一篇</a>
			</div>

		</div>

	</div>
	<!--#if expr="$QUERY_STRING=/headfoot=none/"-->
	<!--#else-->
	<!--#include file="main/tags/footer.html" -->
	<!--#endif-->

</body>
</template>

<script>
export default {
  name: 'Learningcentre_details',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
