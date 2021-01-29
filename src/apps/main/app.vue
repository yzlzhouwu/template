<template>
  <router-view />
</template>
<script>
export default {};
</script>

<style>
html,
body {
  height: 100%;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", Arial, sans-serif;
}
ul li {
  list-style: none;
}
#app,
.layout {
  height: 100%;
}
.ivu-layout {
  height: 100%;
  background: #f4f4f4;
}
.clearfix:after,.ivu-form-item-content:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.container-box {
  background: #fff;
  padding: 25px 20px 30px 20px;
  margin-bottom: 5px;
  box-shadow: 1px 1px 6px 0px rgba(220, 220, 220, 0.6);
  border-radius: 6px;
}
.iv-header {
  margin-bottom: 10px;
}
.iv-s-item {
  float: right;
}

.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
.ivu-menu-light.ivu-menu-vertical
  .ivu-menu-item-active:not(.ivu-menu-submenu):after {
  right: auto;
  left: 0;
}
.ivu-table-cell,
.body-item-cell {
  padding-left: 10px !important;
  padding-right: 10px !important;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

