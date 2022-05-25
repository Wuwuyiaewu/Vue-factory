import _ from 'lodash';
import vue from './vue.js';
import printMe from './print.js';
HTTP_BASE_URL = "https://api.mircoinfolab9.com:1315"
let vm = new Vue({
	el: "#register-form",
	data() {
		return {
			authorization: "",
			appKey: "JW666key",
			baseUrl: HTTP_BASE_URL,
			successUrl: "",
			failUrl: "",
			requestHeaders: {
				"Content-Type": "application/json;charset=UTF-8",
				httpMethod: "post",
				rpcType: "http",
				module: "uat-account",
				method: "/account/appProperties/getAccountProperties",
			},
			defaultParams: {
				mobilePhonePrefix: "86",
				gaCookies: "?__utmc=57589994&__utmz=57589994.1577693628.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)&__utma=57589994.2015188273.1564986937.1577699484.1577772209.3",
				protocol: true,
				openFrom: "WEBSITE",
				chineseName: "",
				idCardNo: "",
				email: "",
				utmcsr: "",
				utmcmd: "",
				utmccn: "",
				utmcct: "",
				utmctr: "",
			},
			inputValue: {
				phoneNum: "",
				ruleCode: "",
				email: "",
				passWord: "",
			},
			checkState: {
				//3個狀態 "":初始未填 wrong:錯誤 pass:正確
				checkPhone: "",
				checkRuleCode: "",
				checkEmail: "",
				checkPassWord: "",
				checkcheckAgree: true,
			},
			codeCheckMobile: false,
			newregister_account: "null",
			codeBtn: "获取验证码",
			show_password:false,
			urlParams: {},
			timer: null,
		};
	},
	watch: {
		authorization() {
			if (this.authorization === "") {
				this.getAuthorization();
			}
		},
	},
	created() {
		this.getAuthorization();
		this.getURLQueryObject();
	},
	mounted() {
		this.getSourceParams();
	},
	methods: {
		// 設定密碼小眼睛
		pw_btn() {
			console.log('pw_btn');
			this.$refs.pw_btn.classList.toggle("show_pw")
			this.show_password = !this.show_password
		},
		//獲取token
		getAuthorization() {
			return new Promise((resolve, reject) => {
				let vm = this;
				$.ajax({
					headers: vm.requestHeaders,
					data: JSON.stringify({
						head: {
							appKey: vm.appKey
						},
						data: {}
					}), // {"accountNo":"15986639372","passWord":"p123456","accountType":"real"}
					type: "POST",
					url: vm.baseUrl + "/account/appProperties/getAccountProperties",
					dataType: "json",
					success: function (data, textStatus, jqXHR) {
						// console.log(data)
						// console.log(jqXHR)
						vm.authorization = jqXHR.getResponseHeader("authorization");
						console.log(vm.authorization);

						vm.requestHeaders.authorization = vm.authorization;
						vm.requestHeaders.method =
							"/account/appProperties/getAppProperties";
						// console.log(requestHeaders)
						// checkRealMobileIsExit()
					},
				});
			});
		},
		resetInput(ele) {
			if (ele.classList.contains("wrong")) {
				ele.classList.remove("wrong");
				ele.value = "";
				ele.parentElement.classList.remove("error");
			}
		},
		//手機驗證
		checkMobile(blur) {
			return new Promise((resolve, reject) => {
				if (true) {
					let vm = this;
					let phoneNum = vm.inputValue.phoneNum;
					let mobileReg = /^(13|14|15|16|17|18|19)\d{9}$/;
					let mobilePatternHK = /^(\+852\s)?[5689]{1}\d{7}$/;
					if ((phoneNum === "" || phoneNum === undefined) && !blur) {
						vm.checkState.checkPhone = "wrong";
						$(".form_tips").text("手机号重复 / 格式有误 请重新提交").show().delay(1500).fadeOut();
						vm.inputValue.phoneNum = ""
						resolve(false);
					} else if (!mobileReg.test(phoneNum) && phoneNum.length > 1) {
						vm.checkState.checkPhone = "wrong";
						$(".form_tips").text("请输入有效的手机号码").show().delay(1500).fadeOut();
						resolve(false);
					} else if (phoneNum.length > 1) {
						if (
							vm.requestHeaders.method != "/account/open/checkRealMobileIsExit"
						) {
							vm.requestHeaders.method = "/account/open/checkRealMobileIsExit";
						}
						$.ajax({
							headers: vm.requestHeaders,
							data: JSON.stringify({
								head: {
									appKey: vm.appKey
								},
								data: {
									mobilePhone: phoneNum,
									mobilePhonePrefix: "86",
								},
							}), // {"accountNo":"15986639372","passWord":"p123456","accountType":"real"}
							type: "POST",
							url: vm.baseUrl + "/account/open/checkRealMobileIsExit",
							dataType: "json",
							success: function (result, textStatus, jqXHR) {
								console.log(result);
								console.log(textStatus);
								console.log(jqXHR);
								if (!result || result.code !== 1 || result.data) {
									vm.checkState.checkPhone = "wrong";
									$(".form_tips").text("请勿重复输入手机号").show().delay(1500).fadeOut();
									resolve(false);
									return;
								} else {
									vm.checkState.checkPhone = "pass";
									vm.requestHeaders.method = "/account/open/sendVerifyRealCode";
									resolve(true);
								}
							},
						});
					}
				}
			});
		},
		//傳送驗證碼
		async sendVerifyRealCode() {
			let vm = this;
			if (vm.authorization === "" || vm.authorization === null) {
				vm.getAuthorization();
			}
			console.log("send");
			let phoneNum = vm.inputValue.phoneNum;
			let checkPhone = vm.checkState.checkPhone;
			// if(vm.checkState.checkPhone === 'wrong'){
			//   vm.checkMobile()
			// }
			codeCheckMobile = true;
			let checked = await vm.checkMobile();
			if (checked) {
				console.log("成功");
				codeCheckMobile = false;
				vm.requestHeaders.method = "/account/open/sendVerifyRealCode";
				vm.codeBtn = "信息传送中...";
				$.ajax({
					headers: vm.requestHeaders,
					data: JSON.stringify({
						head: {
							appKey: vm.appKey
						},
						data: {
							mobilePhone: phoneNum,
							mobilePhonePrefix: "86",
						},
					}), // {"accountNo":"15986639372","passWord":"p123456","accountType":"real"}
					type: "POST",
					url: vm.baseUrl + "/account/open/sendVerifyRealCode",
					dataType: "json",
					success: function (result, textStatus, jqXHR) {
						console.log(result);
						console.log(textStatus);
						console.log(jqXHR);
						vm.authorization = jqXHR.getResponseHeader("authorization");
						if (!result || result.code !== 1) {
							$(".form_tips").text("请输入正确的验证码").show().delay(1500).fadeOut();
						} else {
							vm.requestHeaders.method = "/account/open/openRealAccount";
							//倒計時
							$(".form_tips").text("短信验证码已发送").show().delay(1500).fadeOut();
							vm.countdown(60);
						}
						vm.codeBtn = "获取验证码";
					},
				});
			}
			// else{
			//   console.log('555');
			//   // vm.btnClick = false
			//   vm.checkMobile(0)
			//   vm.codeBtn = '获取验证码'
			// }
		},
		//倒計時
		countdown(sec) {
			let vm = this;
			let i = sec;
			vm.timer = window.setInterval(() => {
				if (i == 0) {
					vm.codeBtn = "获取验证码";
					clearInterval(vm.timer);
					return;
				} else {
					i--;
					vm.codeBtn = `重新获取${i}s`;
				}
			}, 1000);
		},
		//驗證碼
		checkRuleCode(blur) {
			return new Promise((resolve, reject) => {
				let vm = this;
				let ruleCode = vm.inputValue.ruleCode;
				if ((ruleCode === "" || ruleCode === undefined) && !blur) {
					$(".form_tips").text("请输入短信验证码").show().delay(1500).fadeOut();
					vm.checkState.checkRuleCode = "wrong";
					resolve(false);
				} else {
					vm.checkState.checkRuleCode = "pass";
					resolve(true);
				}
			});
		},
		//信箱驗證
		checkEmail(blur) {
			return new Promise((resolve, reject) => {
				let vm = this;
				let regEmail =
					/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; //正则表达式
				let email = vm.inputValue.email;
				if (blur && email == "") {
					return;
				} else if (!regEmail.test(email)) {
					vm.checkState.checkEmail = "wrong";
					//正则验证不通过，格式不对
					$(".form_tips").text("请输入有效的邮箱地址").show().delay(1500).fadeOut();
					resolve(false);
				} else {
					vm.checkState.checkEmail = "pass";
					if (vm.requestHeaders.method != "/account/open/checkEmail") {
						vm.requestHeaders.method = "/account/open/checkEmail";
					}
					$.ajax({
						headers: vm.requestHeaders,
						data: JSON.stringify({
							head: {
								appKey: vm.appKey
							},
							data: {
								email: email,
							},
						}), // {"accountNo":"15986639372","passWord":"p123456","accountType":"real"}
						type: "POST",
						url: vm.baseUrl + "/account/open/checkEmail",
						dataType: "json",
						success: function (result, textStatus, jqXHR) {
							console.log(result);
							console.log(textStatus);
							console.log(jqXHR);
							if (!result || result.code !== 1 || result.data) {
								$(".form_tips").text("请勿重复输入电子邮箱").show().delay(1500).fadeOut();
								resolve(false);
								vm.checkState.checkEmail = "wrong";
								resolve(false);
							} else {
								resolve(true);
							}
						},
					});
					// return true;
				}
			});
		},
		//密碼驗證
		checkPassword(blur) {
			return new Promise((resolve, reject) => {
				let vm = this;
				let passWord = vm.inputValue.passWord;
				if (blur && passWord === "") {
					return;
				} else if ((passWord === "" || passWord === undefined) && !blur) {
					vm.checkState.checkPassWord = "wrong";
					$(".form_tips").text("请输入密码").show().delay(1500).fadeOut();
					resolve(false);
				} else if (
					!passWord ||
					passWord.length < 7 ||
					passWord.length > 16 ||
					vm.isEnglishAndChinese(passWord)
				) {
					console.log("wrong password");

					vm.checkState.checkPassWord = "wrong";
					$(".form_tips").text("请正确输入密码格式(字母＋数字，6-16位)").show().delay(1500).fadeOut();
					resolve(false);
				} else vm.checkState.checkPassWord = "pass";

				resolve(true);
			});
		},
		//密碼英文判斷
		isEnglishAndChinese(str) {
			// 包含字母和数字
			var reg = /^[A-Za-z0-9]+$/;
			var reg2 = /^[0-9]*$/;
			var reg3 = /^[A-Za-z]+$/;
			if (reg.test(str) && !reg2.test(str) && !reg3.test(str)) {
				return false;
			} else {
				return true;
			}
		},
		//開戶
		async openRealAccount() {
			let vm = this;

			let checkMobile = await vm.checkMobile();
			if (!checkMobile) {
				return;
			}
			let checkRuleCode = await vm.checkRuleCode();
			if (!checkRuleCode) {
				return;
			}
			let checkEmail = await vm.checkEmail();
			if (!checkEmail) {
				return;
			}
			let checkPassword = await vm.checkPassword();
			if (!checkPassword) {
				return;
			}
			let checkContinue = true;

			vm.getSourceParams();
			// if (!checkMobile) {
			//     checkContinue = false;
			// }
			// if (!checkRuleCode) {
			//     checkContinue = false;
			// }
			// if (!checkEmail) {
			//     checkContinue = false;
			// }
			// if (!checkPassword) {
			//     checkContinue = false;
			// } else if (!vm.checkState.checkcheckAgree) {
			//     // layer.open({ content: "请勾选确认", skin: "msg", time: 2 });
			//     checkContinue = false;
			// }
			if (!checkContinue) {
				return;
			} else {
				if (vm.requestHeaders.method != "/account/open/openRealAccount") {
					vm.requestHeaders.method = "/account/open/openRealAccount";
				}
				let registerParams = {
					mobilePhone: vm.inputValue.phoneNum,
					checkCode: vm.inputValue.ruleCode,
					passWord: vm.inputValue.passWord,
					email: vm.inputValue.email,
				};
				let reqParams = Object.assign(vm.defaultParams, registerParams);
				$("#tip").fadeIn().css("display", "flex").delay(6000).fadeOut();
				$.ajax({
					headers: vm.requestHeaders,
					data: JSON.stringify({
						head: {
							appKey: vm.appKey
						},
						data: reqParams,
					}),
					type: "POST",
					url: vm.baseUrl + "/account/open/openRealAccount",
					dataType: "json",
					success: function (result, textStatus, jqXHR) {
						if (!result || result.code !== 1) {
							// console.log(textStatus);
							// console.log(jqXHR);
							console.log(result.msg)
							if (result.msg == "验证码错误或者已经超时") {
								$("#tip").css('display','none')
								$(".form_tips").text(result.msg).show().delay(1500).fadeOut();
							} else {
								$("#tip").css('display','none')
								$(".form_tips").text(result.msg).show().delay(1500).fadeOut();
							}
							clearInterval(vm.timer);
							vm.countdown(0);
						} else {
							console.log(result);
							sessionStorage.setItem("phone", vm.inputValue.phoneNum);
							sessionStorage.setItem("accountNum", result.data.account.customerNumber);
							sessionStorage.setItem("passWord", vm.inputValue.passWord);
							let accountLength = result.data.account.accountList.length;
							if (accountLength < 2) {
								//location.assign(vm.failUrl);
								$("#tip").fadeOut();
								$(".form_tips").text("发生错误").show().delay(1500).fadeOut();
							} else {
								let url = new URL(window.location.href);
								let utm_source = url.searchParams.get("utm_source") == null ? '' : url.searchParams.get("utm_source");
								if (utm_source == "fd5"){
									VAD_EVENT.sendAction('submit', {act:'submit', name:'註冊成功'});
								}
								setTimeout(() => {
									//let search = window.location.search;
									//toMineLogined_wcjy(mobilePhone,passWord)
									let theSource = window.location.search;
									theSource = theSource.substring(1);
									window.location.href = "/success.html?param=50829&" + theSource;
								}, 1000);
							}
						}
					},
				});
			}
		},
		//utm_source
		getURLQueryObject(url) {
			if (url === null || url === undefined) {
				url = window.location.href;
			}

			let search = decodeURIComponent(url.substring(url.lastIndexOf("?") + 1));
			const reg = /([^?&=]+)=([^?&=]*)/g;
			let obj = {};

			search.replace(reg, (rs, $1, $2) => {
				let name = decodeURIComponent($1);
				let val = decodeURIComponent($2);
				val = String(val);
				obj[name] = val;
				return rs;
			});
			obj.utm_source ? obj.utm_source.replace("-tr", "") : "";
			console.log(obj);
			this.urlParams = obj;
		},
		getSourceParams() {
			let vm = this;
			if (vm.urlParams.utm_source) {
				vm.defaultParams.utmcsr = vm.urlParams.utm_source;
			}
			if (vm.urlParams.utm_medium) {
				vm.defaultParams.utmcmd = vm.urlParams.utm_medium;
			}
			if (vm.urlParams.utm_campaign) {
				vm.defaultParams.utmccn = vm.urlParams.utm_campaign;
			}
			if (vm.urlParams.utm_content) {
				vm.defaultParams.utmcct = vm.urlParams.utm_content;
			}
			if (vm.urlParams.utm_term) {
				vm.defaultParams.utmctr = vm.urlParams.utm_term;
			}
		},
		toggleFixedButton(isShow) {
			isShow ? $(".fixed").show() : $(".fixed").hide()
		}
	},
});