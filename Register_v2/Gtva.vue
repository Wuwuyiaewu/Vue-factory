<template>
  <!--极验组件-->
  <!-- Add a dummy div to remove the linting problems -->
  <div></div>
</template>

<script>
import "@/plugins/gt";
import api from "@/plugins/api";
export default {
  /*
         此组件使用方法:
         1、引入此插件
         2、需要弹出极验框时调用此组件的this.verify();
         3、接口需要验证极验时，调用this.verifySuc()携带此组件的this.gtVaParam中的参数,并在请求头中携带{"visitorId":this.visitorId}
        */
  name: "Gtva",
  data() {
    return {
      visitorId: "",
      captchaObj: null,
      cachedVaParam: null
    };
  },
  mounted() {
    this.register();
  },
  methods: {
    // 弹出极验框进行验证
    verify() {
      console.log(this.captchaObj);
      this.captchaObj.verify();
    },
    verifySuc(vaParam) {
      this.$emit("verifySuc", vaParam);
    },
    // 初始化极验
    register() {
      if (!this.captchaObj) {
        fetch('https://misapi.glamexapp.com/api/account/geetest/verifyInit?gt_open=true').then((res) => {
          console.log(res);
          //if (res.data && res.data.code == 0 && res.data.result.success == 1) {
          if (res.data && res.data.success == 1) {
            //const data = res.data.result
            const data = res.data;
            //this.visitorId = data.visitorId
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
        api.verifyRealCaptchaCode(params).then((res) => {
          console.log(res);
          // initGeetest(
          //   {
          //     // 以下 4 个配置参数为必须，不能缺少
          //     gt: data.gt,
          //     challenge: data.challenge,
          //     offline: !data.success, // 表示用户后台检测极验服务器是否宕机
          //     new_captcha: data.new_captcha, // 用于宕机时表示是新验证码的宕机
          //     product: "bind", // 产品形式，包括：float，popup
          //     width: "300px",
          //   },
          //   (captchaObj) => {
          //     this.captchaObj = captchaObj;
          //     captchaObj.onSuccess(() => {
          //       const vaParam = captchaObj.getValidate(); // 极验验证需要参数
          //       // 极验成功调用函数
          //       this.verifySuc(vaParam);
          //     });
          //   }
          // );
        });
      }
    },
  },
};
</script>
