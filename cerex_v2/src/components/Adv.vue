<template>
   <div class="teaching_pic_list">
	<div class="left_menu list2 wow fadeInLeft">
    	<h2>进阶教学</h2>
        <p>
        	<!-- <a href="#">K线入门</a>
        	<a href="#">基本面因素</a>
        	<a href="#">技术分析</a>
        	<a href="#">交易系统构建</a>   -->
            <button href="" @click="goPath">goPath by @click</button>
            <router-link :to="{path:'/learningcentre/beginner.html'}">beginner</router-link>
        </p>
    	<a href="teaching_center_list.html" class="more">更多&gt;</a>
    </div>
	<div class="right_pic wow fadeIn">
    	<div class="big_pic">
	        <a href="#"></a>
        	<span><img src="@/assets/images/information/teaching_list2_pic1.jpg"></span>
        	<p>日常对话，疯狂跟读10遍，口语原地起飞！</p>
        </div>
        <div class="s_pic_group">        
                <div class="s_pic">
                    <a href="#"></a>
                    <span><img src="@/assets/images/information/teaching_list2_pic2.jpg"></span>
                    <p>英语谚语：Once bitten</p>
                </div>    
                <div class="s_pic">
                    <a href="#"></a>
                    <span><img src="@/assets/images/information/teaching_list2_pic3.jpg"></span>
                    <p>英语语法入门</p>
                </div>    
                <div class="s_pic">
                    <a href="#"></a>
                    <span><img src="@/assets/images/information/teaching_list2_pic4.jpg"></span>
                    <p>乔治亚理工学院：专业英语</p>
                </div>    
                <div class="s_pic">
                    <a href="#"></a>
                    <span><img src="@/assets/images/information/teaching_list2_pic5.jpg"></span>
                    <p>萌版生活爆炸尔顿首登场</p>
                </div>        
        </div>    
        <div class="swiper s_pic_group_m" id="m_list2">
              <div class="swiper-wrapper">
                    <div class="swiper-slide">
                            <div class="s_pic_group page1">
                                <div class="s_pic">
                                    <a href="#"></a>
                                    <span><img src="@/assets/images/information/teaching_list2_pic2.jpg"></span>
                                    <p>英语谚语：Once bitten</p>
                                </div>    
                                <div class="s_pic">
                                    <a href="#"></a>
                                    <span><img src="@/assets/images/information/teaching_list2_pic4.jpg"></span>
                                    <p>乔治亚理工学院：专业英语</p>
                                </div>    
                           </div>     
                    </div>
                    <div class="swiper-slide">
                            <div class="s_pic_group">
                                <div class="s_pic">
                                    <a href="#"></a>
                                    <span><img src="@/assets/images/information/teaching_list2_pic3.jpg"></span>
                                    <p>英语语法入门</p>
                                </div>    
                                <div class="s_pic">
                                    <a href="#"></a>
                                    <span><img src="@/assets/images/information/teaching_list2_pic5.jpg"></span>
                                    <p>萌版生活爆炸尔顿首登场</p>
                                </div>     
                           </div>         
                    </div>
              </div>
           <div class="swiper-pagination2"></div>
        </div>
    </div>
</div>    
    
</template>

<script>
export default {
  name: "Adv",
  methods:{
      goPath(){
          console.log(this.$router);
          this.$router.push({name: 'Beginner'})
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
