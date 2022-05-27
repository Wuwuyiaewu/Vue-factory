HTTP_BASE_URL = "https://api.mircoinfolab9.com:1315"
const vm = Vue.createApp({
	data() {
		return {
			// 成功頁面連結
			successUrl: "",
			// 失敗連結
			failUrl: "",
			// * log_api
			baseUrl: "https://misapi.glamexapp.com",
			accountApi: {
				// 檢查手機重複
				checkContainActivateMobile: "/accountApi/checkContainActivateMobile",
				// 檢查信箱重複
				checkContainActivateEmail: "/accountApi/checkContainActivateEmail",
				// 檢查身分證重複
				checkContainActivateID: "/accountApi/checkContainActivateID",
				// 發送驗證碼
				sendVerifyCode: "/accountApi/sendVerifyCode",
				// 檢查驗證碼正確
				validateVerifyCode: "/accountApi/validateVerifyCode",
				// 註冊 GTS2 帳號
				openGTS2Account: "/accountApi/openGTS2Account"
			},
			// 樣本參數
			demoValue: "?mobilePhone=18000002970&password=abcd1234&idDocumentNumber=226835198001013775&email=ray032309@test.com&accountLevel=STD&chineseName=%E5%93%88%E7%B6%AD%E4%B8%89&code=963732",
			// 表單偵測項目 全為 true 時通過驗證即可開戶
			inputValue: {
				phoneNum: "",
				code: "",
				email: "",
				passWord: "",
				name: "",
				id: ""
			},
			// 驗證狀態
			registerFinally: {
				phoneNum: false,
				code: false,
				email: false,
				name: false,
				id: false,
				passWord: false
			},
			// 註冊相關提示 * log_text
			checkState: {
				phoneNum: {
					failKeyIn: "手机号有误 请重新輸入",
					failReg: "请输入有效的手机号码",
					failCode: "手机号已重复登记"
				},
				code: {
					failKeyIn: "请输入正确的验证码",
					failCode: "验证码错误或者已经超时",
					failReg: "请输入正确六位数字",
				},
				email: {
					failKeyIn: "邮箱地址有误 请重新輸入",
					failReg: "请输入有效的邮箱地址",
					failCode: "电子邮箱已重复登记"
				},
				id: {
					failKeyIn: "身份证有误 请重新輸入",
					failReg: "请输入有效的身份证",
					failCode: "身份证已重复登记"
				},
				name: {
					failKeyIn: "请输入您的大名",
				},
				passWord: {
					failKeyIn: "输入密码有误 请重新輸入",
					failReg: "请正确输入密码格式(字母＋数字，6-16位)",
				},
			},
			// * log_reg
			// 驗證REG
			regRule: {
				mobileReg: { reg0: /^(1+\d{10})$/ },
				mobileHkReg: { reg0: /^(\+852\s)?[5689]{1}\d{7}$/ },
				emailReg: { reg0: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,5})$/ },
				ruleReg: { reg0: /\d{6}/ },
				passwordReg: {
					reg0: /([A-Za-z0-9_\-]){6,16}/,
				},
				IdReg: { reg0: /[1-9]{1}[0-9]{5}(19|20)[0-9]{2}((0[1-9]{1})|(1[0-2]{1}))((0[1-9]{1})|([1-2]{1}[0-9]{1}|(3[0-1]{1})))[0-9]{3}[0-9x]{1}/ },
			},
			// 註冊類型 demo / real (用於極驗參數)
			registerType: 'real',
			codeBtn: "获取验证码",
			verifyTrigger: false,
			show_password: false,
			urlParams: {},
			timer: null,
		};
	},
	watch: {
	},
	created() {
		this.getURLQueryObject();
	},
	mounted() {
		this.getSourceParams();
	},
	methods: {
		// * log_api
		// 手機、信箱重複驗證確認 (透過 api 發送取得檢驗)
		fetchSend(_data) {
			const vm = this
			let url = `${vm.baseUrl}${_data.link}?${_data.query}=${_data.params}`
			return fetch(url, {
				method: 'POST',
			}).then(res => {
				return res.json()
			}).then(response => {
				return response.message;
			})
		},
		// 驗證碼 驗證
		fetchVerifyCode(url) {
			const vm = this
			return fetch(url).then(res => {
				return res.json()
			}).then(response => {
				console.log(response);
				if (response.result === 0) {
					vm.registerFinally.code = true
					return response.message
				} else {
					throw response.message
				}
			}).catch(err => {
				return err
			})
		},
		// * log_text
		// * log_reg
		// 手機、密碼、郵件等 REG 與 空數值相關檢查
		// (數值,錯誤提示,驗證規則)
		checkData(value, text, reg, key) {
			const vm = this
			let _value = value
			let _text = text
			let _reg = []
			for (const iterator of Object.keys(reg).map(el => reg[el])) {
				_reg.push(iterator);
			}
			return new Promise((resolve, reject) => {
				if (_value === "" || _value === undefined) {
					reject(_text.failKeyIn)
				}
				for (const iterator of _reg) {
					if (!new RegExp(iterator).test(_value)) {
						reject(_text.failReg);
					}
				}
				vm.$refs[key].classList.remove("shake")
				resolve(true)
			})
		},
		// 設定密碼小眼睛
		pw_btn() {
			console.log('pw_btn');
			this.$refs.pw_btn.classList.toggle("show_password")
			this.show_password = !this.show_password
		},
		resetInput(ele) {
			if (ele.classList.contains("wrong")) {
				ele.classList.remove("wrong");
				ele.value = "";
				ele.parentElement.classList.remove("error");
			}
		},
		//手機驗證
		async checkPhoneNum(el) {
			const vm = this
			let data = {
				link: vm.accountApi[el],
				query: "mobilePhone",
				params: vm.inputValue.phoneNum,
			}
			try {
				vm.registerFinally.phoneNum = await vm.checkData(vm.inputValue.phoneNum, vm.checkState.phoneNum, vm.regRule.mobileReg, "phoneNum")
				// 獲取後台重複驗證
				vm.$refs.ruleCode_phone.textContent = await vm.fetchSend(data)
				// 清除紅色錯誤提示
				vm.$refs.ruleCode_phone.textContent = ""
				vm.registerFinally.phoneNum = true
			} catch (error) {
				vm.$refs.ruleCode_phone.textContent = error
				vm.registerFinally.phoneNum = false
			}
		},
		//傳送驗證碼 ( 需極驗拼圖通過才會發送 )
		geeTest() {
			let vm = this;
			if(!vm.registerFinally.phoneNum){
				vm.$refs.phoneNum.classList.add('shake')
					let clearInet = setTimeout(() => {
						vm.$refs.phoneNum.classList.remove('shake')
					}, 500);
			}
			if (vm.registerFinally.phoneNum && !vm.verifyTrigger) {
				vm.$refs.gt.verify();
			}
		},
		getVerifyCode(geetestres) {
			const vm = this
			const url = `${vm.baseUrl}${vm.accountApi.sendVerifyCode}`
			// 目前僅設定 電話必填(需要通過前端驗證)
			// 註冊類型必須是 real 才能在 bo 後台收到驗證碼
			const params =
				"?openAccType=" +
				this.registerType +
				"&channel=S" +
				"&chineseName=" +
				this.inputValue.name +
				"&email=" +
				this.inputValue.email +
				"&mobilePhone=" +
				this.inputValue.phoneNum +
				"&visitorId=" +
				geetestres.visitor_id;
			fetch(url + params).then(res => {
				return res.json()
			}).then((response) => {
				vm.countdown(5)
			})
		},
		//倒數計時
		countdown(sec) {
			let time = sec;
			let vm = this;
			vm.verifyTrigger = true
			vm.timer = setInterval(() => {
				if (time == 0) {
					clearInterval(vm.timer);
					vm.codeBtn = "获取验证码";
					vm.verifyTrigger = false
				} else {
					vm.codeBtn = `(${time}S) 重新发送`;
					time--;
				}
			}, 1000);
		},
		//驗證碼
		async checkCode(el) {
			const vm = this
			let url = `${vm.baseUrl}${vm.accountApi[el]}?channel=S&mobilePhone=${vm.inputValue.phoneNum}&code=${vm.inputValue.code}`
			try {
				await vm.checkData(vm.inputValue.code, vm.checkState.code, vm.regRule.ruleReg, "code")
				vm.$refs.ruleCode_verify.textContent = await vm.fetchVerifyCode(url)
				vm.registerFinally.code = true
				vm.$refs.ruleCode_verify.textContent = ""
			} catch (error) {
				vm.$refs.ruleCode_verify.textContent = error
				vm.registerFinally.code = false
			}
		},
		//信箱驗證
		async checkEmail(el) {
			const vm = this
			let data = {
				link: vm.accountApi[el],
				query: "email",
				params: vm.inputValue.email,
			}
			try {
				vm.registerFinally.email = await vm.checkData(vm.inputValue.email, vm.checkState.email, vm.regRule.emailReg, "email")
				vm.$refs.ruleCode_email.textContent = await vm.fetchSend(data)
				vm.registerFinally.email = true
				vm.$refs.ruleCode_email.textContent = ""
			} catch (error) {
				vm.$refs.ruleCode_email.textContent = error
				vm.registerFinally.email = false
			}
		},
		// 身分證驗證
		async checkId(el) {
			const vm = this
			let data = {
				link: vm.accountApi[el],
				query: "idDocumentNumber",
				params: vm.inputValue.id,
			}
			try {
				vm.registerFinally.id = await vm.checkData(vm.inputValue.id, vm.checkState.id, vm.regRule.IdReg, "id")
				vm.$refs.ruleCode_id.textContent = await vm.fetchSend(data)
				vm.registerFinally.id = true
				vm.$refs.ruleCode_id.textContent = ""
			} catch (error) {
				vm.$refs.ruleCode_id.textContent = error
				vm.registerFinally.id = false
			}
		},
		// 姓名驗證
		async checkName() {
			const vm = this
			if (vm.inputValue.name === "" || vm.inputValue.name === undefined) {
				vm.registerFinally.name = false
				vm.$refs.ruleCode_name.textContent = "请输入您的大名"
				return
			}
			vm.registerFinally.name = true
			vm.$refs.ruleCode_name.textContent = ""
		},
		//密碼驗證
		async checkPassWord(el) {
			const vm = this
			try {
				vm.registerFinally.passWord = await vm.checkData(vm.inputValue.passWord, vm.checkState.passWord, vm.regRule.passwordReg, "passWord")
				vm.$refs.ruleCode_password.textContent = "通过"
				vm.$refs.ruleCode_password.setAttribute('style', 'color:green;')
				vm.registerFinally.passWord = true
			} catch (error) {
				vm.$refs.ruleCode_password.textContent = error
				vm.$refs.ruleCode_password.setAttribute('style', 'color:red;')
				vm.registerFinally.passWord = false
			}
		},
		//開戶

		async registerRealAccount() {
			const vm = this
			for (const key of Object.keys(vm.registerFinally)) {
				if (!vm.registerFinally[key]) {
					vm.$refs[key].classList.add('shake')
					let clearInet = setTimeout(() => {
						vm.$refs[key].classList.remove('shake')
					}, 500);
					return
				}
			}
			let message = await fetch(`${vm.baseUrl}${vm.accountApi.openGTS2Account}?mobilePhone=${vm.inputValue.phoneNum}&password=${vm.inputValue.passWord}&idDocumentNumber=${vm.inputValue.id}&email=${vm.inputValue.email}&accountLevel=STD&chineseName=${vm.inputValue.name}&code=${vm.inputValue.code}`)
				.then(res => {
					return res.json()
				}).then(response => {
					console.log(response);
					sessionStorage.setItem('mobilePhone', vm.inputValue.phoneNum)
					sessionStorage.setItem('password', vm.inputValue.passWord)
					sessionStorage.setItem('accountNum', response.iResult.customerNumber)
					alert(`註冊成功 手機號碼為 ${vm.inputValue.phoneNum} 密碼為 ${vm.inputValue.passWord}`)
					return response.message
				}).catch(err => {
					alert(err.message)
					return err.message
				})
			console.log(message);
		},
		async openRealAccount() {
			let vm = this;

			let checkMobile = await vm.checkMobile();
			if (!checkMobile) {
				return;
			}
			let code = await vm.code();
			if (!code) {
				return;
			}
			let email = await vm.email();
			if (!email) {
				return;
			}
			let passWord = await vm.passWord();
			if (!passWord) {
				return;
			}
			let checkContinue = true;
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
							console.log(result.msg)
							if (result.msg == "验证码错误或者已经超时") {
								$("#tip").css('display', 'none')
								$(".form_tips").text(result.msg).show().delay(1500).fadeOut();
							} else {
								$("#tip").css('display', 'none')
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
								if (utm_source == "fd5") {
									VAD_EVENT.sendAction('submit', { act: 'submit', name: '註冊成功' });
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
	},
})

vm.component('Gtva', {
	template: `<div></div>`,
	name: "Gtva",
	data() {
		return {
			visitorId: "",
			captchaObj: null,
			cachedVaParam: null,
			initApi: 'https://misapi.glamexapp.com/api/account/geetest/verifyInit?gt_open=true'
		};
	},
	mounted() {
		this.register();
	},
	methods: {
		// 弹出极验框进行验证
		verify() {
			this.captchaObj.verify();
		},
		verifySuc(vaParam) {
			this.$emit("verify_suc", vaParam);
		},
		// 初始化极验
		register() {
			if (!this.captchaObj) {
				fetch(this.initApi)
					.then((res) => {
						return res.json()
					})
					.then((respone) => {
						if (respone && respone.success == 1) {
							const data = respone;
							this.visitorId = data.visitor_id;
							// 调用 initGeetest 进行初始化
							// 参数1：配置参数
							// 参数2：回调，回调的第一个参数验证码对象，之后可以使用它调用相应的接口
							initGeetest(
								{
									// 以下 4 个配置参数为必须，不能缺少
									gt: data.gt,
									challenge: data.challenge,
									offline: !data.success, // 表示用户后台检测极验服务器是否宕机
									new_captcha: data.new_captcha, // 用于宕机时表示是新验证码的宕机
									product: "bind", // 产品形式，包括：float，popup
									width: "300px",
								},
								(captchaObj) => {
									this.captchaObj = captchaObj;

									captchaObj.onSuccess(() => {
										const vaParam = captchaObj.getValidate(); // 极验验证需要参数
										// 极验成功调用函数
										this.cachedVaParam = { ...vaParam, visitor_id: this.visitorId }
										this.verifySuc(this.cachedVaParam);
									});
								}
							);
						}
					});
			} else {
				const params = "?geetest_challenge=" + this.cachedVaParam.challenge + "&geetest_validate=" + this.cachedVaParam.validate + "&geetest_seccode=" + this.cachedVaParam.seccode;
				fetch(`https://misapi.glamexapp.com/api/account/geetest/verifyRealCaptchaCode${params}`).then((res) => {
					return res.json()
				}).then((response) => {
					console.log(response);
				});
			}
		},
	}
})
vm.mount('#register')