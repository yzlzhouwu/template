<template>
  <div class="layout">
    <Layout>
      <x-header></x-header>
      <Layout class="ivu-layout-has-sider">
        <x-menu></x-menu>
        <Layout
          class="container-loading"
          :style="{ padding: '0 24px', height: 'calc(100% - 42px)', minWidth: '900px' }"
        >
          <Content>
            <!-- <keep-alive> -->
              <router-view :key="$route.path + $route.query.plan" />
            <!-- </keep-alive> -->
          </Content>
        </Layout>
        <x-footer></x-footer>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import header from "@/components/header.vue";
import menu from "@/components/menu.vue";
import footer from "@/components/footer.vue";

export default {
  components: { "x-menu": menu, "x-header": header, "x-footer": footer },
  data() {
    return {
      user: {},
    };
  },
  mounted() {
    // this.getUserInfo();
  },
  methods: {
    /**验证页面权限  */
    verifyPage() {
      const userType = this.user.userType;
      if ([4].includes(userType)) {
        this.$Message.error("未获取访问权限！");
        this.$router.push({
          path: userType == 4 ? "/judge" : "/commune",
        });
      }
    },
    async getUserInfo() {
      let _this = this;
      let $data = {};
      const user = sessionStorage.getItem("user");
      $data.user = user && JSON.parse(user);
      if (!$data.user) {
        let r = await _this.$http.get(
          api_config.get_api_url("Account_GetUserInfo")
        );

        if (!r || !r.body.success) {
          _this.$Message.error(
            r ? r.body.error.message : "获取数据失败，请稍后重试！"
          );
          return false;
        };
        $data.user = r.body.result;
        sessionStorage.setItem("user", $data && JSON.stringify($data.user));
      }
      Object.assign(this.user, $data.user);
      this.verifyPage();
    },
  }
};
</script>

<style scoped>
.layout {
  min-width: 1100px;
}
.container-loading {
  background: url(../assets/images/loading.gif) no-repeat;
  background-position: center 300px;
  border-radius: 8px;
}
.ivu-layout.ivu-layout-has-sider {
  height: calc(100% - 64px);
}
</style>
