<template>
  <div class="login-wrap">
    <div class="layout">
      <div class="header">
        <img src="../../assets/images/login-logo.png" alt="" />
        <p>教学过程质量监控与评价系统</p>
      </div>
      <!-- 主体登录区域 -->
      <div class="main" style="height: 732px">
        <Card dis-hover>
          <Form :model="form">
            <!-- 用户名 -->
            <FormItem
              class="username"
              prop="userNameOrEmailAddress"
              :rules="{ required: true, message: '用户名不能为空!' }"
            >
              <Input
                v-model.trim="form.userNameOrEmailAddress"
                prefix="ios-person-outline"
                placeholder="请输入您的账号"
                @keyup.enter="login"
                style="width: 320px"
                type="text"
                size="large"
              />
            </FormItem>
            <!-- 密码 -->
            <FormItem
              class="password"
              prop="password"
              :rules="{ required: true, message: '密码不能为空!' }"
            >
              <Input
                v-model.trim="form.password"
                prefix="ios-lock-outline"
                placeholder="请输入您的密码"
                @keyup.enter="login"
                style="width: 320px"
                type="password"
                size="large"
              />
            </FormItem>
            <!-- 验证码 -->
            <FormItem
              class="code"
              prop="code"
              :rules="{ required: true, message: '验证码不能为空!' }"
            >
              <Row>
                <i-col span="12">
                  <Input
                    id="rzCode"
                    v-model="form.code"
                    placeholder="验证码"
                    @on-enter="login"
                  />
                </i-col>
                <i-col span="12">
                  <img
                    :src="rzCode.imgUrl"
                    @click="getImg"
                    alt="验证码"
                    style="
                      vertical-align: middle;
                      padding-left: 16px;
                      height: 32px;
                    "
                  />
                  <a href="#" @click="btnclick">换一张</a>
                </i-col>
              </Row>
            </FormItem>
            <!-- 登录按钮 -->
            <FormItem>
              <Button class="submit" @click="login">{{ btnTitle }}</Button>
            </FormItem>
          </Form>
        </Card>
      </div>
      <!-- 页面尾部 -->
      <div class="footer">
        Copyright &copy; {{ time }}. All Rights Reserved
        <br />

        技术支持：<a href="http://www.zhijiao361.com/" target="_blank"
          >安徽渔之蓝教育软件技术有限公司</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import { api_config } from "@/config";
import { utils } from "@/utils.js";
export default {
  data() {
    return {
      // 登录所需要的字段
      form: {
        userNameOrEmailAddress: "",
        password: "",
        code: "",
        rememberClient: false,
      },
      user: {},
      time: "",
      loginType: 0, //登录的状态码
      rzCode: {
        //验证码
        imgUrl: "",
        md5: "",
      },
    };
  },
  computed: {
    //登录按钮的loading状态
    btnTitle() {
      let btnText = {
        0: "立即登录",
        1: "登录中...",
        2: "登录成功",
      };
      return btnText[this.loginType];
    },
  },
  mounted() {
    this.time = new Date().getFullYear();
    this.getImg(); // 调用验证码
    let token = localStorage.getItem("accessToken");
  },
  methods: {
    // 登录时间
    login() {
      const { userNameOrEmailAddress, password, code } = this.form;
      if (!userNameOrEmailAddress) {
        this.warnShow("请输入账号!");
        return;
      }
      if (!password) {
        this.warnShow("请输入密码!");
        return;
      }
      if (!code) {
        this.warnShow("请输入验证码!");
        return;
      }
      this.loginType = 1;
      // 登录时所携带的参数
      let postData = {
        userNameOrEmailAddress: userNameOrEmailAddress,
        password: password,
        rememberClient: true,
        md5key: this.rzCode.md5,
        rzCode: code,
      };
      // 登录请求
      this.$http
        .post(
          api_config.get_api_url("TokenAuth_Authenticate"),
          JSON.stringify(postData)
        )
        .then((res) => {
          const $data = res.body.result;
          this.loginType = 2;
          localStorage.setItem("accessToken", $data.accessToken);
          sessionStorage.setItem("user", JSON.stringify($data));
          let url =
            $data.userType == 0
              ? "/account/account/list"
              : "/account/personInfo";
          location.href = url;
        })
        .catch((error) => {
          let err = error.body.error;
          this.warnShow("账号或密码错误！,请重新登录");
          this.loginType = 0;
          this.getImg();
        });
    },
    async getImg() {
      let _this = this;
      let r = await _this.$http.get(
        api_config.get_api_url("Account_GetRzCode"),
        {
          params: {
            time: new Date().getTime(),
          },
        }
      );
      if (!r || !r.body.success) {
        this.warnShow("发生错误，请稍后重试");
        return false;
      }
      let $data = r.body.result;
      _this.rzCode.imgUrl = "data:image/jpg;base64," + $data.code;
      _this.rzCode.md5 = $data.md5Key;
    },
    btnclick() {
      this.getImg();
    },
    warnShow(title, callback) {
      this.$Modal.error({
        title: "提示",
        content: title,
        onOk: () => {
          callback && callback();
        },
      });
    },
  },
};
</script>

<style scoped>
.login-wrap {
  height: 100%;
  width: 100%;
}
.header {
  height: 110px;
  background: #fff;
  width: 100%;
  display: flex;
  justify-content: center;
}
.header p {
  font-size: 30px;
  overflow: hidden;
  color: #333333;
  margin-left: 20px;
  font-weight: bold;
  text-align: center;
  line-height: 110px;
}
.main {
  height: 100%;
  background: url("../../assets/images/Background-pic.jpg") no-repeat;
  background-size: cover;
}
.ivu-card {
  width: 413px;
  height: 366px;
  border-radius: 30px;
  position: relative;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  background: url("../../assets/images/form.jpg") no-repeat;
  background-size: cover;
}
.ivu-form {
  height: 100%;
  margin-top: 30px;
}
.code a {
  border: 0;
  background: #fff;
  border-bottom: 1px solid #ccc;
  outline: none;
  margin-left: 3px;
  color: #ccc;
  height: 28px;
}
.ivu-form-item {
  width: 320px;
  height: 40px;
  margin-left: 20px;
}
.ivu-input-wrapper {
  height: 40px;
  border: 0;
  outline: none;
}
.ivu-input-wrapper input {
  border: 0;
  border-radius: 30px;
}
.ivu-btn {
  width: 320px;
  height: 40px;
  background: #7150e7;
  border-radius: 20px;
  border: 0;
  outline: none;
  font-size: 16px;
  color: #fff;
}
.footer {
  overflow: hidden;
  background: #fff;
  text-align: center;
  padding-top: 40px;
  color: #000;
}
.footer > a {
  color: #000;
}
.ivu-form-item-error >>> .ivu-input:hover {
  border-color: #6035ed;
}
.login-wrap >>> .ivu-input:hover {
  border-color: #6035ed;
}
.ivu-form-item-error >>> .ivu-input {
  border: 1px solid #6035ed;
}
.ivu-input-wrapper-large >>> .ivu-input-prefix i {
  font-size: 25px;
  line-height: 40px;
  margin-left: 10px;
}
.login-wrap >>> .ivu-input {
  border-radius: 20px;
  padding-left: 35px;
}
/* >>> .ivu-form-item-error-tip {
  left: 20px;
  color: #6035ed;
} */
</style>
