<template>
  
<body>
    <!--#set var="menu_select" value="4" -->
    <!--#if expr="$QUERY_STRING=/headfoot=none/"-->
    <!--#else-->
    <!--#include file="main/tags/header.html" -->
    <!--#endif-->

    <div class="hierarchy_menu">
        <p>
            首页 &gt; 资讯中心 &gt; <b>教学中心</b>
        </p>
    </div>

    <div class="content_page_banner">
        <p class="bg">
            <img src="@/assets/images/information/teaching_banner.jpg">
        </p>
        <div>
            <p>
                <b class="wow fadeInDown">教学中心</b>
                <span class="wow fadeInUp">交易知识系统学习<i></i>运筹帷幄</span>
            </p>
        </div>
    </div>

    <div class="teaching_content1">

        <div class="teaching_pic_list">
            <div class="left_menu list1 wow fadeInLeft">
                <h2>新手入门</h2>
                <p>
                    <a href="#">产品简介</a>
                    <a href="#">报价机制</a>
                    <a href="#">交易规则</a>
                    <a href="#">市场简介</a>
                    <a href="#">影响因素</a>
                </p>
                <a href="learningcentre_beginner.html" class="more">更多&gt;</a>
            </div>
            <div class="right_pic wow fadeIn">
                <div class="big_pic">
                    <a href="#"></a>
                    <span><img src="@/assets/images/information/teaching_list1_pic1.jpg"></span>
                    <p>告别混乱生活：人生十二法则</p>
                </div>
                <div class="s_pic_group">
                    <div class="s_pic">
                        <a href="#"></a>
                        <span><img src="@/assets/images/information/teaching_list1_pic2.jpg"></span>
                        <p>如何在手机上拍摄专</p>
                    </div>
                    <div class="s_pic">
                        <a href="#"></a>
                        <span><img src="@/assets/images/information/teaching_list1_pic3.jpg"></span>
                        <p>入门级甜点制作教程</p>
                    </div>
                    <div class="s_pic">
                        <a href="#"></a>
                        <span><img src="@/assets/images/information/teaching_list1_pic4.jpg"></span>
                        <p>超J吉他:吉他入门教程</p>
                    </div>
                    <div class="s_pic">
                        <a href="#"></a>
                        <span><img src="@/assets/images/information/teaching_list1_pic5.jpg"></span>
                        <p>看完后改变人生的纪录片</p>
                    </div>
                </div>
                <div class="swiper s_pic_group_m" id="m_list1">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide">
                            <div class="s_pic_group page1">
                                <div class="s_pic">
                                    <a href="#"></a>
                                    <span><img src="@/assets/images/information/teaching_list1_pic2.jpg"></span>
                                    <p>如何在手机上拍摄专</p>
                                </div>
                                <div class="s_pic">
                                    <a href="#"></a>
                                    <span><img src="@/assets/images/information/teaching_list1_pic4.jpg"></span>
                                    <p>超J吉他:吉他入门教程</p>
                                </div>
                            </div>
                        </div>
                        <div class="swiper-slide">
                            <div class="s_pic_group">
                                <div class="s_pic">
                                    <a href="#"></a>
                                    <span><img src="@/assets/images/information/teaching_list1_pic3.jpg"></span>
                                    <p>入门级甜点制作教程</p>
                                </div>
                                <div class="s_pic">
                                    <a href="#"></a>
                                    <span><img src="@/assets/images/information/teaching_list1_pic5.jpg"></span>
                                    <p>看完后改变人生的纪录片</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="swiper-pagination1"></div>
                </div>
            </div>
        </div>

    </div> <!-- teaching_content1-->



    <div class="teaching_content2">


        <div class="teaching_pic_list">
            <div class="left_menu list2 wow fadeInLeft">
                <h2>进阶教学</h2>
                <p>
                    <a href="#">K线入门</a>
                    <a href="#">基本面因素</a>
                    <a href="#">技术分析</a>
                    <a href="#">交易系统构建</a>
                </p>
                <a href="learningcentre_beginner.html" class="more">更多&gt;</a>
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


        <div class="teaching_pic_list">
            <div class="left_menu list3 wow fadeInLeft">
                <h2>技术指标</h2>
                <p>
                    <a href="#">均线及均线组</a>
                    <a href="#">MACD指标</a>
                    <a href="#">布林带</a>
                    <a href="#">KD指标</a>
                    <a href="#">黄金分割线</a>
                </p>
                <a href="learningcentre_beginner.html" class="more">更多&gt;</a>
            </div>
            <div class="right_pic wow fadeIn">
                <div class="big_pic">
                    <a href="#"></a>
                    <span><img src="@/assets/images/information/teaching_list3_pic1.jpg"></span>
                    <p>上海交通大学公开课：高等数学</p>
                </div>
                <div class="s_pic_group">
                    <div class="s_pic">
                        <a href="#"></a>
                        <span><img src="@/assets/images/information/teaching_list3_pic2.jpg"></span>
                        <p>渤海大学：公关与沟通</p>
                    </div>
                    <div class="s_pic">
                        <a href="#"></a>
                        <span><img src="@/assets/images/information/teaching_list3_pic3.jpg"></span>
                        <p>麻省理工：计算机科学导论</p>
                    </div>
                    <div class="s_pic">
                        <a href="#"></a>
                        <span><img src="@/assets/images/information/teaching_list3_pic4.jpg"></span>
                        <p>武汉理工大学：心理学</p>
                    </div>
                    <div class="s_pic">
                        <a href="#"></a>
                        <span><img src="@/assets/images/information/teaching_list3_pic5.jpg"></span>
                        <p>复旦大学：感染病学总论</p>
                    </div>
                </div>

                <div class="swiper s_pic_group_m" id="m_list3">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide">
                            <div class="s_pic_group page1">
                                <div class="s_pic">
                                    <a href="#"></a>
                                    <span><img src="@/assets/images/information/teaching_list3_pic2.jpg"></span>
                                    <p>渤海大学：公关与沟通</p>
                                </div>
                                <div class="s_pic">
                                    <a href="#"></a>
                                    <span><img src="@/assets/images/information/teaching_list3_pic4.jpg"></span>
                                    <p>武汉理工大学：心理学</p>
                                </div>
                            </div>
                        </div>
                        <div class="swiper-slide">
                            <div class="s_pic_group">
                                <div class="s_pic">
                                    <a href="#"></a>
                                    <span><img src="@/assets/images/information/teaching_list3_pic3.jpg"></span>
                                    <p>麻省理工：计算机科学导论</p>
                                </div>
                                <div class="s_pic">
                                    <a href="#"></a>
                                    <span><img src="@/assets/images/information/teaching_list3_pic5.jpg"></span>
                                    <p>复旦大学：感染病学总论</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="swiper-pagination3"></div>
                </div>
            </div>
        </div>

    </div> <!-- teaching_content2-->








    <!--#if expr="$QUERY_STRING=/headfoot=none/"-->
    <!--#else-->
    <!--#include file="main/tags/footer.html" -->
    <!--#endif-->

</body>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
