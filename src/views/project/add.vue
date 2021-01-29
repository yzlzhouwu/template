<!--
 * @Description: 添加模板
 * @Date: 2020-07-21 14:18:11
 * @FilePath: \教学过程质量监控与评价系统\src\views\project\add.vue
-->
<template>
  <div>
    <Breadcrumb :style="{padding: '20px'}">
      <BreadcrumbItem :to="backUrl">统计项管理</BreadcrumbItem>
      <BreadcrumbItem>{{title}}</BreadcrumbItem>
    </Breadcrumb>
    <div class="container-box">
      <Content :style="{minHeight: '480px'}">
        <Form ref="form" :model="form" :label-width="130" class="clearfix">
          <FormItem
            label="统计项名称"
            prop="projectName"
            :rules="{ required: true, message: '统计项名称不能为空',trigger: 'blur' }"
          >
            <Row>
              <i-col span="20">
                <i-input
                  type="text"
                  v-model="form.projectName"
                  @on-change="changeFormula"
                  placeholder="请输入统计项名称"
                ></i-input>
              </i-col>
            </Row>
          </FormItem>

          <FormItem label="排序" prop="sort" :rules="{ required: true, message: '排序不能为空' }">
            <Row>
              <i-col span="20">
                <InputNumber :min="0" v-model="form.sort" style="width:100%"></InputNumber>
              </i-col>
            </Row>
          </FormItem>

          <FormItem label="备注" prop="remark">
            <Row>
              <i-col span="20">
                <i-input type="textarea" v-model="form.remark" placeholder="请输入备注"></i-input>
              </i-col>
            </Row>
          </FormItem>

          <FormItem style="width: 100%;">
            <router-link :to="backUrl">
              <Button>取消</Button>
            </router-link>
            <Button type="primary" size="large" @click="handleSubmit('form')">提交</Button>
          </FormItem>
        </Form>
      </Content>
    </div>
  </div>
</template>

<script>
import { api_config } from "@/config.js";
export default {
  data() {
    return {
      backUrl: "/project/list",
      title: this.$route.query.id ? "编辑统计项" : "新增统计项",
      id: this.$route.query.id || "",
      form: {
        projectName: "", // 统计项名称
        defaultValue: 0, // 默认值
        sort: 0, // 排序
        formula: "", // 公式
        isTimeTable: 0, //是否周课表取值
        isTempChange: 0,
        teacherID: "", // 打分人员id
        remark: "", // 备注
      },
    };
  },
  methods: {
    /**
     * 验证表单数据
     * @method handleSubmit
     */
    handleSubmit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.dataEdit();
        }
      });
    },
    /**
     * 修改或编辑表单数据
     * @method dataEdit
     */
    async dataEdit() {
      let r = await this.$http.post(
        api_config.get_api_url("api_project"),
        this.form
      );

      if (this.id) {
        this.$Message.success("编辑成功");
        this.$router.push(this.backUrl);
      } else {
        this.$Modal.confirm({
          title: "提示",
          content: "添加成功， 是否继续",
          okText: "继续",
          cancelText: "取消",
          onOk() {
            window.location.reload();
          },
          onCancel() {
            this.$router.push({
              path: this.backUrl,
            });
          },
        });
      }
    },

    /**
     * 获取表单数据
     * @method getData
     */
    async getData() {
      let r = await this.$http.get(api_config.get_api_url("School_GetById"), {
        params: { id: this.id },
      });

      let $data = r.body.result;
      this.form = { ...$data };
    },
  },

  mounted() {
    if (this.id) {
      // 判断是否是编辑还是新增
      this.getData();
    }
  },
};
</script>

<style scoped>
.ivu-form-item {
  width: 60%;
  /* float: left; */
}
</style>
