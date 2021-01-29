<template>
  <Footer class="layout-footer-center">
    Copyright ©{{ time }}
    <a style="color: #333" target="_blank" :href="copyrightUrl">{{
      copyright
    }}</a
    >. All Rights Reserved &nbsp;&nbsp; 技术支持：
    <a style="color: #333" :href="companyUrl" target="_blank"
      >安徽渔之蓝教育软件技术有限公司</a
    >
  </Footer>
</template>

<script>
import { api_config } from "@/config.js";
export default {
  data() {
    return {
      copyright: "",
      copyrightUrl: "http://www.hfuu.edu.cn/",
      companyUrl: "http://www.zhijiao361.com/",
      time: new Date().getFullYear(),
      logoType: process.env.LOGO_TYPE,
    };
  },
  created() {
    //监听兄弟组件方法
    eventBus.$on("footer", (footer) => {
      this.copyright = footer;
    });
  },
  mounted() {
    this.copyright = sessionStorage.getItem("schoolTitle");
  },
};
</script>

<style scoped>
.layout-footer-center {
  position: absolute;
  bottom: 0;
  left: 201px;
  width: calc(100% - 201px);
  padding: 10px 50px;
  text-align: center;
}
</style>

