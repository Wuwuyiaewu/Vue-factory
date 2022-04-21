function recalc(x,bol) {
	var clientWidth = document.body.clientWidth;

	if (bol && (!clientWidth || clientWidth > x)) {
		document.documentElement.style.fontSize = "";
		return;
	};
	document.documentElement.style.fontSize = 100 * (clientWidth / x) + 'px';
};
var remCompute = function (width,device) {
	if (window.addEventListener) {
		recalc(width,device);
		var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
		window.addEventListener(resizeEvt, function () {recalc(width,device)}, false);
	};
};

export default remCompute(750,true)