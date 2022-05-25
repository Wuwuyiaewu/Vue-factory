import axios from "axios";

export default {
  isAjax() {
    const headers = {
      isAjax: true,
      businessType: "default",
      lang: "cn",
    };
    return headers;
  },
  /* 登录*/
  login(data) {
    return axios.post(process.env.VUE_APP_WEBUI_URL + `/login`, data, {
      headers: this.isAjax(),
    });
  },
  /* 自动登录用户中心去存款*/
  getLoginToken(data) {
    return axios.post(
      process.env.VUE_APP_API_URL + `/realAccount/getLoginToken`,
      data,
      { headers: this.isAjax() }
    );
  },
  /* 通过token自动登录*/
  getUserInfoByToken(data) {
    return axios.post(
      process.env.VUE_APP_WEBUI_URL + `/getUserInfoByToken`,
      data
    );
  },
  /* 获取用户中心token*/
  getUserCenterToken(data) {
    return axios.get(
      process.env.VUE_APP_MIS_URL + `/accountApi/getChestBoxToken`,
      data,
      {
        headers: this.isAjax(),
      }
    );
  },
  /* 刷新用户状态*/
  acstatus(data) {
    return axios.post(process.env.VUE_APP_WEBUI_URL + `/acstatus`, data);
  },
  /* 真实模拟互转*/
  transCustomerNumberForH5(data) {
    return axios.post(
      process.env.VUE_APP_WEBUI_URL + `/transCustomerNumberForH5`,
      data
    );
  },
  /* 验证手机号码是否注册*/
  checkContainPhone(data) {
    return axios.post(
      process.env.VUE_APP_API_URL + `/realAccount/checkContainPhone`,
      data,
      { headers: this.isAjax() }
    );
  },
  /* 极验*/
  gtva(data) {
    /*return axios.post(process.env.VUE_APP_API_URL + `/sms/register`, data, {
      headers: this.isAjax()
    })*/
    //return axios.post(process.env.VUE_APP_API_URL + `/account/geetestValidate`, data)
    return axios.post(
      "https://testmis.wcjy88.com/se_mis/api/account/geetest/verifyInit?gt_open=true"
    );
  },
  /* 发送验证玛*/
  sendWithVa(data, header) {
    /*return axios.post(process.env.VUE_APP_API_URL + `/sms/sendWithVa`, data, {
      headers: header
    })*/
    return axios.post(
      process.env.VUE_APP_API_URL + `/account/sendVerifyCode`,
      data
    );
  },
  /* 注册第一步*/
  firstOpenAccountSubmit(data) {
    return axios.post(
      process.env.VUE_APP_API_URL + `/realAccount/firstOpenAccountSubmit`,
      data,
      { headers: this.isAjax() }
    );
  },
  /* 验证邮箱是否注册*/
  checkContainEmail(data) {
    return axios.post(
      process.env.VUE_APP_API_URL + `/realAccount/checkContainEmail`,
      data,
      { headers: this.isAjax() }
    );
  },
  /* 验证身份证二元素*/
  validateIdCard(data) {
    return axios.post(
      process.env.VUE_APP_API_URL + `/realAccount/validateIdCard`,
      data,
      { headers: this.isAjax() }
    );
  },
  /* 手机号、密码解密*/
  decryptPhoneAndPwd(data) {
    return axios.post(
      process.env.VUE_APP_API_URL + `/realAccount/decryptPhoneAndPwd`,
      data,
      { headers: this.isAjax() }
    );
  },
  /* 创建账户*/
  createAccount(data) {
    return axios.post(
      process.env.VUE_APP_API_URL + `/realAccount/createAccount`,
      data,
      { headers: this.isAjax() }
    );
  },
  /* 排行*/
  getLastTradeDataForH5() {
    return axios.get(
      process.env.VUE_APP_API_RANK_URL + `/cfvnRealTrade/getLastTradeDataForH5`,
      { headers: this.isAjax() }
    );
  },
  /* CMS API DATA */
  getAppProperties() {
    return axios.get(process.env.VUE_APP_CMS + "/gm_platform/conf.json");
  },
  getTradeRanking() {
    return axios.get(
      process.env.VUE_APP_CMS + "/gm_platform/tradeRanking.json"
    );
  },
  /* Register API */
  verifyInit() {
    return axios.post(
      process.env.VUE_APP_MIS_URL +
        "/api/account/geetest/verifyInit?gt_open=true"
    );
  },
  verifyRealCaptchaCode(params) {
    return axios.post(
      process.env.VUE_APP_MIS_URL +
        "/api/account/geetest/verifyRealCaptchaCode" +
        params
    );
  },
  getVerifyCode(params) {
    return axios.post(
      process.env.VUE_APP_MIS_URL + "/accountApi/sendVerifyCode" + params
    );
  },
  sendResetCustomerPwdVerifyCode(params) {
    return axios.post(
      process.env.VUE_APP_MIS_URL + "/accountApi/sendResetCustomerPwdVerifyCode" + params
    );
  },
  validateVerifyCode(params) {
    return axios.post(
      process.env.VUE_APP_MIS_URL + "/accountApi/validateVerifyCode" + params
    );
  },
  openGTS2Account(params) {
    return axios.post(
      process.env.VUE_APP_MIS_URL + "/accountApi/openGTS2Account" + params
    );
  },
  openGTS2AccountWUuid(params) {
    return axios.post(
      process.env.VUE_APP_MIS_URL + "/accountApi/openGTS2AccountWUuid" + params
    );
  },
  openDemoGTS2Account(params) {
    return axios.post(
      process.env.VUE_APP_MIS_URL + "/accountApi/openDemoGTS2Account" + params
    );
  },
  loginMIS(params) {
    return axios.post(
      process.env.VUE_APP_MIS_URL + "/accountApi/login" + params
    );
  },
  switchAccount(params) {
    return axios.post(
      process.env.VUE_APP_MIS_URL + "/accountApi/switchRDLogin" + params
    );
  },
  getCustomerByMobile(params) {
    return axios.post(
      process.env.VUE_APP_MIS_URL + "/accountApi/getCustomerByMobile" + params
    );
  },
  updatePassword(params) {
    return axios.post(
      process.env.VUE_APP_MIS_URL + "/accountApi/updatePassword" + params
    );
  },
  checkContainActivateMobile(params) {
    return axios.post(
      process.env.VUE_APP_MIS_URL +
        "/accountApi/checkContainActivateMobile" +
        params
    );
  },
  checkDemoContainActivateMobile(params) {
    return axios.post(
      process.env.VUE_APP_MIS_URL +
        "/accountApi/checkDemoContainActivateMobile" +
        params
    );
  },
  checkContainActivateID(params) {
    return axios.post(
      process.env.VUE_APP_MIS_URL +
        "/accountApi/checkContainActivateID" +
        params
    );
  },
  checkContainActivateEmail(params) {
    return axios.post(
      process.env.VUE_APP_MIS_URL +
        "/accountApi/checkContainActivateEmail" +
        params
    );
  },
  getUserPortfolio(params) {
    return axios.post(
      process.env.VUE_APP_MIS_URL + "/accountApi/getConfig" + params
    );
  },
  updateUserPortfolio(params) {
    return axios.post(
      process.env.VUE_APP_MIS_URL + "/accountApi/updateConfig",
      params
    );
  },
};
