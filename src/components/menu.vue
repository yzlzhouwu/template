<template>
  <Sider class="menu-box">
    <Menu style="width: 200px" ref="child" :open-names="nameArr" accordion>
      <template v-for="item in menuList">
        <Submenu
          v-if="item.children.length"
          :name="item.urlAddr.split('/')[1]"
          :key="item.id"
        >
          <template slot="title">
            <Icon type="navicon-round"></Icon>
            <span style="font-size: 15px; font-weight: 700">{{
              item.name
            }}</span>
          </template>
          <ul class="ivu-menu menu-list">
            <li
              v-for="val in item.children"
              :key="val.id"
              :id="val.urlAddr.split('/')[2]"
              :data-value="val.id"
            >
              <router-link
                :to="{
                  path: val.urlAddr,
                  query: { plan: Date.now().toString() },
                }"
                :class="[
                  'ivu-menu-item',
                  {
                    'router-link-active': curPath == val.urlAddr.split('/')[2],
                  },
                ]"
                >{{ val.name }}</router-link
              >
            </li>
          </ul>
        </Submenu>
      </template>
    </Menu>
  </Sider>
</template>

<script>
import { api_config } from "@/config";
import { utils } from "@/utils.js";
export default {
  data() {
    return {
      nameArr: [location.pathname.split("/")[1]],
      menuList: [],
      userType: null, //用户类型
    };
  },
  computed: {
    curPath() {
      const path = this.$route.path.split("/");
      return path[2] ? path[2] : path[1];
    },
  },
  mounted() {
    const user = sessionStorage.getItem("user");
    this.userType = JSON.parse(user).userType;
    this.getMenu();
  },
  methods: {
    // 获取菜单树
    getMenu() {
      //管理员菜单
      let AdminMenu = [
        {
          children: [
            {
              name: "账号管理",
              urlAddr: "/account/account",
            },
            {
              name: "修改密码",
              urlAddr: "/account/password",
            },
          ],
          menuId: null,
          name: "账号管理",
          urlAddr: "/account",
        },
        {
          children: [
            {
              name: "学校管理",
              urlAddr: "/school/school",
            }
          ],
          menuId: null,
          name: "学校管理",
          urlAddr: "/school",
        },
        {
          children: [
            {
              name: "指标管理",
              urlAddr: "/targets/observeItems",
            },
            {
              name: "指标分类管理",
              urlAddr: "/targets/observeGroup",
            },

          ],
          menuId: null,
          name: "指标管理",
          urlAddr: "/targets",
        }
      ];
      //省级菜单
      let provinceMenu = [
        {
          children: [
            {
              name: "账号信息",
              urlAddr: "/account/personInfo",
            },
            {
              name: "修改密码",
              urlAddr: "/account/password",
            },
            {
              name: "账号管理",
              urlAddr: "/account/paccount/list/1",
            },
            {
              name: "专家组管理",
              urlAddr: "/account/expertGroup/list",
            },
          ],
          menuId: null,
          name: "账号管理",
          urlAddr: "/account",
        },
        {
          children: [
            {
              name: "指标管理",
              urlAddr: "/targets/observeItems",
            },
            {
              name: "指标分类管理",
              urlAddr: "/targets/observeGroup",
            },

          ],
          menuId: null,
          name: "指标管理",
          urlAddr: "/targets",
        },
        {
          children: [
            {
              name: "教学过程质量评价",
              urlAddr: "/assess/onlineprovince/list/1",
            }
          ],
          menuId: null,
          name: "教学过程质量评价",
          urlAddr: "/assess",
        },
      ];
      //评审专家菜单
      let ExpertLevelMenu = [
        {
          children: [
            {
              name: "账号信息",
              urlAddr: "/account/personInfo",
            },
            {
              name: "修改密码",
              urlAddr: "/account/password",
            },
          ],
          menuId: null,
          name: "账号管理",
          urlAddr: "/account",
        },
        {
          children: [
            {
              name: "教学过程质量评价",
              urlAddr: "/assess/onlineExpert/list/0",
            },
          ],
          menuId: null,
          name: "教学过程质量评价",
          urlAddr: "/assess",
        }
      ];
      //高校菜单
      let schoolMenu = [
        {
          children: [
            {
              name: "账号信息",
              urlAddr: "/account/personInfo",
            },
            {
              name: "修改密码",
              urlAddr: "/account/password",
            },
          ],
          menuId: null,
          name: "账号管理",
          urlAddr: "/account",
        },
        {
          children: [
            {
              name: "教学过程质量评价",
              urlAddr: "/assessSchool/assess/index",
            },
            {
              name: "当前进度",
              urlAddr: "/assessSchool/progress/index?type=0",
            },
          ],
          menuId: null,
          name: "教学过程质量评价",
          urlAddr: "/assessSchool",
        }
      ];
      this.menuList =
        this.userType == 0
          ? AdminMenu
          : this.userType == 1
          ? provinceMenu
          : this.userType == 2
          ? ExpertLevelMenu
          : schoolMenu;

      this.$nextTick(() => {
        // 更新展开的子目录
        this.$refs.child.updateOpened();
        this.isHasMenu();
      });
    },
    // 判断是否有改菜单权限
    isHasMenu() {
      let dom = document.getElementById(this.curPath);
      let temp = this.$route.path;
      if (!dom && temp != "/") {
        this.$Message.warning("无该菜单权限");
      }
    },
  },
}
</script>
<style scoped>
</style>
<style>
::-webkit-scrollbar {
  width: 6px;
  background-color: #d8d8d8;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: #bfc1c4;
}
.menu-box.ivu-layout-sider {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
.menu-box .ivu-menu-item {
  padding-left: 43px;
  color: #333;
}
.ivu-layout-sider {
  background: #fff;
  border-right: 1px solid #ddd;
  padding-top: 10px;
}

.ivu-menu-light.ivu-menu-vertical .menu-list > li > a.router-link-active {
  font-weight: 700;
}
.ivu-menu-light.ivu-menu-vertical
  .menu-list
  > li
  > a.router-link-active::after {
  content: "";
  display: block;
  width: 2px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
}
.ivu-menu-ul {
  padding: 14px 24px;
  position: relative;
  cursor: pointer;
  z-index: 1;
  transition: all 0.2s ease-in-out;
}
.ivu-menu- {
  display: inline-block;
  width: 100%;
  font-size: 15px;
  font-weight: 700;
  padding-left: 13px;
  color: #515a6e;
}
</style>
