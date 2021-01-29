<!--
 * @Description: 表格模板
 * @Date: 2020-07-21 14:17:26
 * @FilePath: \教学过程质量监控与评价系统\src\views\project\list.vue
-->
<template>
  <div>
    <Breadcrumb :style="{padding: '20px'}">
      <BreadcrumbItem>统计项管理</BreadcrumbItem>
    </Breadcrumb>
    <div class="container-box">
      <Content :style="{minHeight: '480px'}">
        <div class="iv-header clearfix">
          <div style="float:left;margin-top: 5px">
            <Button
              type="error"
              @click="toWarn(table.selectionIDs)"
              :class="operate.multDelete?'':'disabled'"
            >批量删除</Button>
            <router-link :to="addUrl">
              <Button type="primary">新增统计项</Button>
            </router-link>
          </div>
          <div class="iv-s-item">
            <i-input
              type="text"
              clearable
              placeholder="请输入统计项名称进行搜索"
              @on-enter="search"
              class="search-item"
              v-model="table.searchParam.searchName"
            ></i-input>
            <Button icon="ios-search" @click="search">查询</Button>
          </div>
        </div>
        <Table
          stripe
          size="small"
          :loading="loading"
          :columns="table.columns"
          :data="table.data"
          @on-sort-change="handleSortChange"
          @on-selection-change="handleSelectionChange"
        ></Table>
        <ivPages ref="page" v-model="page" v-on:refreshData="loadList"></ivPages>
      </Content>
    </div>
  </div>
</template>

<script>
import { api_config, common_config } from "@/config.js";
import { utils } from "@/utils.js";
import ivPages from "@/components/iv-pages.vue";
export default {
  components: { ivPages },
  data() {
    return {
      addUrl: "/project/add",
      operate: {
        multDelete: false, //显示批量删除
        seniorSearch: false, //显示高级查询
        fileInput: false, //显示导入
      },

      loading: false, //表格是否正在加载数据

      // 分页
      page: {
        pageIndex: parseInt(this.$route.query.pageindex) || 0, //当前页
        current: parseInt(this.$route.query.pageindex) || 1, //当前页码
        pageSize: common_config.list_pagesize, //每页显示个数
        pagesizes: common_config.list_pagesizes, //允许切换的页大小数组
        total: 0, //数据总数
      },

      listOrder: {
        prop: "S_Name", //指定默认的排序的列
        order: "asc", //定默认排序的顺序 ascending, descending
      },

      // 表格数据
      table: {
        //查询条件
        searchParam: {
          specid: "",
          classid: "",
          stu: "",
          isTeacher: "",
        },
        selectionIDs: "", //选中项id集合
        columns: [
          {
            type: "selection",
            width: 50,
            align: "center",
          },
          {
            width: 70,
            align: "center",
            title: "序号",
            render: (h, params) => {
              return h(
                "span",
                params.index + 1 + this.page.pageIndex * this.page.pageSize
              );
            },
          },
          {
            title: "统计项名称",
            align: "center",
            key: "projectName",
            sortable: "custom", //自定义排序
          },
          {
            title: "排序",
            key: "sort",
            align: "center",
            sortable: "custom", //自定义排序
          },
          {
            title: "是否周课表取值",
            key: "isTimeTable",
            align: "center",
            render: (h, params) => {
              return h("span", params.row.isTimeTable == 0 ? "否" : "是");
            },
          },
          {
            title: "默认值",
            key: "defaultValue",
            align: "center",
          },
          {
            title: "备注",
            key: "remark",
            align: "center",
          },
          {
            title: "操作",
            key: "action",
            width: 150,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "router-link",
                  { attrs: { to: `${this.addUrl}?id=${params.row.id}` } },
                  "编辑"
                ),
                h(
                  "a",
                  {
                    style: {
                      marginLeft: "8px",
                      color: "#ce1010",
                    },
                    on: {
                      click: () => {
                        let row = params.row;
                        //删除
                        this.toWarn(row.id);
                      },
                    },
                  },
                  "删除"
                ),
              ]);
            },
          },
        ],
        data: [],
      },
    };
  },
  mounted() {
    //加载数据
    // this.loadList();
  },
  methods: {
    /**
     * 加载数据列表
     * @method loadList
     */
    loadList() {
      let _this = this;

      _this.loading = true;

      //组成统一参数
      var params = Object.assign(_this.table.searchParam, {
        pageindex: _this.page.pageIndex,
        pagesize: _this.page.pageSize,
        prop: _this.listOrder.prop,
        order:
          _this.listOrder.prop == ""
            ? ""
            : _this.listOrder.order == "asc"
            ? "asc"
            : "desc",
      });

      //获取列表
      _this.$http
        .get(api_config.get_api_url("SchoolInfo_GetPaged"), {
          params: utils.deleteNotParams(params),
        })
        .then((r) => {
          _this.loading = false;

          let $data = r.body.result;
          console.log($data);
          // 渲染数据
          _this.table.data = [...$data.items];
          _this.page.total = $data.totalCount;
          if (_this.page.current > 1 && !_this.table.data.length) {
            _this.$router.push({ query: utils.query(_this.page.current - 1) });
            _this.$refs.page.$emit("changeCurrent", _this.page.current - 1);
          }
        })
        .catch((err) => {
          _this.loading = false;
        });
    },
    /**
     * 删除数据警告
     * @method deleteObjs
     * @param {String} ids 要删除的数据id集合,分割
     */
    toWarn(ids) {
      let _this = this;
      if (ids == "") {
        return;
      }

      _this.$Modal.confirm({
        title: "提示",
        content: `此操作将永久删除${
          ids.split(",").length >= 2 ? "选中" : "该"
        }数据, 是否继续?`,
        onOk: () => {
          _this.deleteObjs(ids);
        },
      });
    },
    /**
     * 删除数据
     * @method deleteObjs
     * @param {String} ids 要删除的数据id集合,分割
     */
    async deleteObjs(ids) {
      let _this = this;
      let r = await _this.$http.delete(api_config.get_api_url("api_project"), {
        params: {
          ids: ids,
        },
      });

      _this.$Message.success("删除成功!");
      _this.loadList();
    },

    /**
     * 当表格的排序条件发生变化的时候会触发该事件
     * @method handleSortChange
     * @param {Json} obj  { column, prop, order }
     */
    handleSortChange(obj) {
      let _this = this;
      _this.listOrder.prop = obj.key;
      _this.listOrder.order = obj.order;
      _this.loadList();
    },
    /**
     * 在多选模式下有效，只要选中项发生变化时就会触发
     * @method handleSelectionChange
     * @param {Json} selection 已选项数据
     */
    handleSelectionChange(selection) {
      let _this = this;

      //显示批量删除
      _this.operate.multDelete = selection.length > 0;

      //选中的 id集合
      _this.table.selectionIDs = "";
      for (let index in selection) {
        _this.table.selectionIDs += selection[index].id + ",";
      }
    },

    search() {
      this.$router.push({ query: utils.query(0) });
      this.$refs.page.$emit("changeCurrent", 1);
    },
  },
};
</script>
<style scoped>
.iv-header {
  margin-bottom: 10px;
}

.iv-s-item {
  float: right;
}
</style>
