
wow = new WOW(
  {
	animateClass: 'animated',
	offset:       100,
  }
);
wow.init();


$(window).scroll(function(){
	var window_now_top = $(window).scrollTop();
	top_menu(window_now_top);
});	

$(window).resize(function() {
});

$(document).ready(function(){

});




function top_menu(win_top) {
	if(win_top > 150) {
		$("#header").addClass("w-bg");
	}
	else {
		$("#header").removeClass("w-bg");
	}
}	


function back_top() {
	
		$('html,body').animate({
			scrollTop: 0
		}, 500);
}



function show_mobile_menu() {
	$("body").toggleClass("show_m_menu");
	var this_height = $(window).height() - $("#header").outerHeight() - $(".mobile_menu_btn").outerHeight();
	$(".main_menu>ul").css({
		"max-height" : this_height+"px"
	})
}

function mobile_submenu(this_o) {
	this_o.parent("li").toggleClass("sub_hide");
}

