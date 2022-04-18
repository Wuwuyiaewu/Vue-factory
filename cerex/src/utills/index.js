var index_content3_id = 0;	
var index_content3_max = 1;	
var Xstart = 0	
var Xend = 0	
var Xchange = 0;
var Xmov = 0;	
var src = document.getElementById("index_content3_list");
	
var index_content3_auto;	
	
function index_content3( ) {
	
	var show_id = index_content3_id;
	var left_id = show_id - 1;
	var right_id = show_id + 1;
	
	if(left_id < 0 ) {
		left_id = index_content3_max;
	}
	if(right_id > index_content3_max) {
		right_id = 0;
	}
	
	$("#index_content3_list li").removeClass();
	$("#index_content3_list li:eq("+show_id+")").addClass("show");
	$("#index_content3_list li:eq("+left_id+")").addClass("left");
	$("#index_content3_list li:eq("+right_id+")").addClass("right");
}	
function index_content3_change(show_id ) {
	index_content3_id++;
	
	if(index_content3_id > index_content3_max) {
		index_content3_id = 0;
	}
	index_content3();
}

function load_index_content3() {
	if($(window).width() <= 750 ) {
		
	
		var li_length = $("#index_content3_list li").length;
		$("#index_content3_list li").removeClass();
		$("#index_content3_list li").removeAttr( 'style' );
		var temp_html = $("#index_content3_list").html();
		if(li_length == 2 ) {
			$("#index_content3_list").html(temp_html+temp_html);
		}

		index_content3_max = $("#index_content3_list li").length - 1;
		
		clearInterval(index_content3_auto);
		index_content3();
		index_content3_auto = setInterval(index_content3_change, 4000);
	}	
}	
	
var content2_title = [];
content2_title[0] = "专";
content2_title[2] = "业";
content2_title[4] = "平";
content2_title[6] = "台";

var content2_title_count = 0
var content2_title_count_id = 1;
var content2_title_show = 0

function content2_title_check() {
	var win_top = $(window).scrollTop();
	var content2_top = $(".content2_group").offset().top- ($(window).height() / 2);
	console.log(win_top+" / "+content2_top);
	if(win_top > content2_top && content2_title_show == 0) {
		content2_title_go = setInterval(content2_title_load , 65);	
		content2_title_show = 1;
	}
}

function content2_title_load() {
	//console.log(content2_title);
	var html_text = "";
	$.each( content2_title , function( i, this_val ) {
		if(this_val && i < content2_title_count ) {
			html_text += this_val;
		}
	});
	
	$("#content2_title").html(html_text);
	
	if(content2_title_count < 0) {
		content2_title_count_id = 1;
	}
	if(content2_title_count > 40) {
		
		clearInterval(content2_title_go);
		$("#content2_title").removeClass("cursor");
		
		content2_title_count_id = -2;
	}
	
	content2_title_count = content2_title_count + content2_title_count_id;
}


var banner_title = [];
banner_title[0] = "<span>一</span>";
banner_title[2] = "<span>个</span>";
banner_title[4] = "<b>账</b>";
banner_title[6] = "<b>户</b>";
banner_title[8] = "<span>&nbsp;&nbsp;</span>";
banner_title[24] = "<span>交</span>";
banner_title[26] = "<span>易</span>";
banner_title[28] = "<b>全</b>";
banner_title[30] = "<b>球</b>";
  

var banner_title_count = 0
var banner_title_count_id = 1;

function banner_title_load() {
	var html_text = "";
	$.each( banner_title , function( i, this_val ) {
		if(this_val && i < banner_title_count ) {
			html_text += this_val;
		}
	});
	$("#banner_title").html(html_text);
	
	if(banner_title_count < 0) {
		banner_title_count_id = 1;
	}
	if(banner_title_count >= 50) {
		clearInterval(banner_title_go);
		$("#banner_title").addClass("clear");
		banner_title_count_id = -2;
	}
	
	banner_title_count = banner_title_count + banner_title_count_id;
	
	if(banner_title_count_id == -2 && banner_title_count == 24) {
		banner_title_count = 10;
	}
//	console.log(banner_title_count);
	
}





$(window).resize(function() {
	
    clearTimeout(window.resizedFinished);
    window.resizedFinished = setTimeout(function(){
		load_index_content3();
    }, 500);
});	
	
	
$(window).scroll(function(){
	content2_title_check();
});	

var banner_title_go;
var content2_title_go;
$(document).ready(function(){

load_index_content3();
content2_title_check();	
banner_title_go = setInterval(banner_title_load , 65);	
	
var swiper = new Swiper(".banner_price_list_m", {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
});	
	
	
src.addEventListener('touchstart', function(e) {
	Xstart = e.changedTouches[0].pageX;
}, false);
	
src.addEventListener('touchmove', function(e) {
	Xmov =  (e.changedTouches[0].pageX - Xstart)/5;
	$("#index_content3_list .show>div").css({
		"transform" : "translate("+Xmov+"px , 0)",
	});
}, false);

src.addEventListener('touchend', function(e) {
	
	Xend = e.changedTouches[0].pageX;
	
	Xchange = Xend- Xstart;
	//console.log(Xchange);	
	
	if(Xchange > 50) {
	   index_content3_id--;
	}
	if(Xchange < -50) {
	   index_content3_id++;
	}
	
	console.log(index_content3_id);	
	if(index_content3_id > index_content3_max ) {
		index_content3_id = 0;
	}
	if(index_content3_id < 0 ) {
		index_content3_id = index_content3_max;
	}
	
	
	$("#index_content3_list li.show>div").css({
		"transform" : "translate(0 , 0)",
	});
	clearInterval(index_content3_auto);
	index_content3();
	index_content3_auto = setInterval(index_content3_change, 4000);
	
}, false);	
		
particlesJS.load('banner_mov', 'main/images/index/banner.json', function() {
  console.log('callback - particles.js config loaded');
});	
	
/*
particlesJS.load('content2_line_bg', 'main/images/index/banner.json', function() {
  console.log('callback - particles.js config loaded');
});	
*/	
	
});	
	