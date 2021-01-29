<template>
  <Header class="header-box">
    <div class="clearfix">
      <div :style="{ float: 'left', height: '64px', padding: '2px 10px' }">
        <img width="550" style="margin-top: 8px" src="../assets/images/logo.png" alt="logo" />
      </div>
      <Dropdown
        trigger="click"
        :style="{ float: 'right', marginRight: '50px', cursor: 'pointer' }"
      >
        <div class="userinfo-head">
          <div class="img-box">
            <div
              class="head-img"
              :style="{ backgroundImage: `url('${headerImg}')` }"
            ></div>
          </div>
          <span
            >&nbsp;&nbsp;{{ userInfo.personName || userInfo.userName }}</span
          >
        </div>
        <DropdownMenu slot="list">
          <DropdownItem>
            <a @click="editPsw" title="修改密码" class="a-link">修改密码</a>
          </DropdownItem>
          <DropdownItem>
            <a href="javascript:void(0);" @click="logout" title="安全退出" class="a-link"
              >安全退出</a
            >
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <Modal v-model="showModal" title="修改密码" :mask-closable="false">
      <Form ref="form" :model="editData" :label-width="130" class="clearfix">
        <FormItem
          label="旧密码"
          prop="oldPw"
          :rules="[
            { required: true, message: '旧密码不能为空', trigger: 'blur' },
          ]"
        >
          <Row>
            <i-col span="20">
              <i-input
                v-model="editData.oldPw"
                type="password"
                autocomplete="new-password"
                placeholder="请输入旧密码"
              ></i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem
          label="新密码"
          prop="newPw"
          :rules="[
            { required: true, message: '新密码不能为空', trigger: 'blur' },
          ]"
        >
          <Row>
            <i-col span="20">
              <i-input
                v-model="editData.newPw"
                type="password"
                autocomplete="new-password"
                placeholder="请输入新密码"
              ></i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem
          label="确认密码"
          prop="newPwAgain"
          :rules="[
            { required: true, message: '确认密码不能为空', trigger: 'blur' },
            { validator: newPwValidator },
          ]"
        >
          <Row>
            <i-col span="20">
              <i-input
                v-model="editData.newPwAgain"
                autocomplete="new-password"
                type="password"
                placeholder="请输入确认密码"
              ></i-input>
            </i-col>
          </Row>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="showModal = false">取消</Button>
        <Button type="primary" :laoding="btnLoading" @click="toSubmit"
          >修改</Button
        >
      </div>
    </Modal>
  </Header>
</template>

<script>
import { api_config } from "@/config.js";
export default {
  data() {
    return {
      logoType: process.env.LOGO_TYPE,
      host: api_config.api_host,
      mainLogo: "",
      userInfo: {
        userName: "",
        userImg: "",
      },
      showData: false,
      showModal: false,
      btnLoading: false,
      editData: {
        oldPw: "",
        newPw: "",
        newPwAgain: "",
      },
    };
  },
  computed: {
    headerImg() {
      return this.userInfo.userImgUrl
        ? api_config.api_host + this.userInfo.userImgUrl
        : require("../assets/images/notHead.png");
    },
  },
  created() {
    this.getUserInfo();
    eventBus.$on("setHeaderImg", (url) => {
      this.userInfo.userImg = url;
      sessionStorage.setItem("user", JSON.stringify(this.userInfo));
    });
  },
  methods: {
    /**头像加载错误 */
    headimgError() {
      this.userInfo.userImg = "";
    },
    logout() {
      let _this = this;

      _this.$Modal.confirm({
        title: "提示",
        content: "是否确认退出？",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          _this.toLogout();
        },
      });
    },
    getUserInfo() {
      let _this = this;
      let $data = {};
      const user = sessionStorage.getItem("user");
      $data.user = user && JSON.parse(user);
      if (!$data.user.userImg) {
        _this.$http
          .get(api_config.get_api_url("Account_GetUserInfo"))
          .then((res) => {
            let _data = res.body.result;
             Object.assign($data.user, {
              userImgUrl: _data.userImgUrl,
              userImg: _data.userImg,
              userName:_data.name,
              cityId:_data.cityId,
              city: _data.city,
              creationTime: _data.creationTime,
              isActive: _data.isActive
            });
            sessionStorage.setItem("user", $data && JSON.stringify($data.user));
            this.$set(this,'userInfo', $data.user)
          });
      } else {
        Object.assign(this.userInfo, $data.user);
      }
    },
    toLogout() {
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");
      window.location = "/login.html";
    },
    editPsw() {
      this.showModal = true;
      this.$refs.form.resetFields();
      this.editData = {
        oldPw: "",
        newPw: "",
        newPwAgain: "",
      };
    },
    newPwValidator(rule, value, callback) {
      if (value) {
        let { newPw, newPwAgain } = this.editData;
        if (newPw == newPwAgain) callback();
        else callback("确认密码与新密码不同！");
      } else {
        callback();
      }
    },
    toSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.editPassword();
        }
      });
    },
    editPassword() {
      this.btnLoading = true;
      this.$http
        .post(
          api_config.get_api_url("Account_RevisePassWordByOld"),
          JSON.stringify(this.editData)
        )
        .then((res) => {
          this.$Message.success("修改成功");
          this.showModal = false;
          this.btnLoading = false;
        })
        .catch((err) => {
          this.btnLoading = false;
        });
    },
  },
};
</script>

<style scoped>
.header-box {
  background: #fff;
  padding: 0;
  box-shadow: 1px 1px 6px 0px rgba(220, 220, 220, 0.6);
  position: relative;
  z-index: 9;
}
.userinfo-head {
  display: flex;
  align-items: center;
}
.img-box {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.head-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
}
.ivu-select-dropdown{
  padding: 0 !important;
}
.ivu-dropdown-item {
  padding: 0;
}
.a-link {
  display: block;
  text-align: center;
  padding: 10px 16px;
}
</style>
