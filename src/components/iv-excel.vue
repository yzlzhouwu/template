<!--
 *  @pageName: 'iv-excel 导入导出组件'
 *  @events  @refreshData  导入成功触发
    @methods changeExcelParams  接收获取列表的参数
    @props   value Object {
      exportUrl: "", // 导出数据接口 !!!
      importUrl: "", //导入数据接口  !!!
      templateParams: {} 下载模板参数
      templateUrl: "" //下载模板接口  !!!
      postParams: {},//导入参数
      format: "",//导出文件格式 默认xlsx
      downName: "",//下载文件名字
    }
 -->

<template>
  <div
    class="iv-excel"
    :style="{ display: 'inline-block', verticalAlign: 'middle' }"
  >
    <div
      v-if="value.exportUrl"
      :style="{ display: 'inline-block', verticalAlign: 'middle' }"
    >
      <Button
        :loading="expLoading"
        class="iv-button"
        @click="exportExcel(exportUrl, fileData)"
      >
        <Icon size="26" custom="iconfont icon-excel" />
        导出{{ title }}
      </Button>
    </div>
    <template v-if="value.templateUrl">
      <Dropdown trigger="click" :style="{ verticalAlign: 'middle' }">
        <Button class="iv-button" :loading="excelLoading">
          <Icon size="18" type="ios-exit-outline" />
          &nbsp;导入{{ title }}&nbsp;
          <Icon size="18" type="md-arrow-dropdown" />
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem @click.native="toWarn">
            <Spin fix v-show="downLoading"></Spin>
            <Icon type="md-download" />下载模板
          </DropdownItem>
          <DropdownItem :name="1">
            <Spin fix v-show="inputLoading"></Spin>
            <Icon type="md-arrow-round-up" />
            <Upload
              style="display: inline-block"
              :action="uploadUrl"
              :data="this.value.postParams"
              ref="file"
              :headers="{ Authorization: 'Bearer ' + uploadHeader }"
              :max-size="102400"
              :format="['xlsx', 'xls']"
              accept=".xlsx, .xls"
              :before-upload="
                () => {
                  inputLoading = true;
                }
              "
              :show-upload-list="false"
              :on-success="handleSuccess"
              :on-error="handleError"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              >导入{{ title }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Upload
            >
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </template>
    <template v-else-if="!value.templateUrl && value.importUrl">
      <Upload
        :action="uploadUrl"
        ref="file"
        :headers="{ Authorization: 'Bearer ' + uploadHeader }"
        :max-size="102400"
        :format="['xlsx', 'xls']"
        accept=".xlsx, .xls"
        :show-upload-list="false"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
      >
        <Button class="iv-button">
          <Icon size="26" custom="iconfont icon-excel" />
          导入{{ title }}
        </Button>
      </Upload>
    </template>
  </div>
</template>

<script>
import { api_config } from "@/config.js";
import { utils } from "../utils";
export default {
  props: {
    value: {
      type: Object,
    },
    title: String,
    name: {
      type:String,
      default:"",
    }
  },
  data() {
    return {
      excelLoading: false, //加载状态
      inputLoading: false, //导入加载状态
      expLoading: false, //导出加载状态
      downLoading: false, //导出模板加载状态
      exportParams: {}, //导出参数
      // uploadUrl: api_config.get_api_url("File_Upload"),
      uploadUrl: "",
      uploadHeader: "",
      exportUrl: "",
      exportUrlList: [],
      fileData: {},
    };
  },
  watch: {
    value: {
      handler: function (val) {
        this.init();
      },
      deep: true,
    },
  },
  mounted() {
    console.log(this.value)
    this.init();
    // 接收获取列表的参数
    this.$on("changeExcelParams", (params) => {
      this.exportParams = { ...params };
    });
  },
  methods: {
    init() {
      this.uploadHeader = localStorage.getItem("accessToken");
      let { exportUrl, downName, format, importUrl } = this.value;
      this.exportUrl = exportUrl;
      this.uploadUrl = api_config.get_api_url(importUrl);
      this.fileData = { downName, format };
    },
    // 导出数据
    exportExcel(api, format) {
      this.expLoading = true;
      console.log("_this.exportParams", this.exportParams);
      this.$http
        .post(api_config.get_api_url(api), this.exportParams)
        .then((r) => {
          let $data = r.body.result;
          if (typeof $data == "string") {
            window.open(api_config.img_host + $data);
            this.expLoading = false;
          } else _this.exportForm($data, format);
        })
        .catch((err) => {
          this.expLoading = false;
        });
    },
    toWarn() {
      this.$Modal.confirm({
        title: "提示",
        content: `确定要下载${this.name}模板吗?`,
        onOk: () => {
          this.downloadModel();
        },
      });
    },
    // 下载模板
    async downloadModel() {
      let _this = this;
      _this.excelLoading = true;
      _this.downLoading = true;
      let r = await _this.$http.get(
        api_config.get_api_url(_this.value.templateUrl),
        { params: _this.value.templateParams }
      );
      let $data = r.body.result;
      let temp = { fileName: $data.fileName, isModel: true };
      if ($data.filePath) this.fileToUrl($data.filePath);
      else _this.exportForm($data, temp);
      _this.excelLoading = false;
    },

    // 导入模版
    async ImportModel(data) {
      let _this = this;
      let postData = {
        excelFile: data[0].url,
      };
      console.log('this.value.postParams',this.value.postParams)
      if (this.value.postParams) {
        Object.assign(postData, { ...this.value.postParams });
      }
      console.log(data, postData);
      let r = await _this.$http.post(
        api_config.get_api_url(_this.value.importUrl),
        JSON.stringify(postData)
      );
      let $data = r.body.result;
      // if ($data && !$data.result) {
      //   _this.$Message.success(
      //desc: "导入异常，下载异常数据中...",
      //  );
      //   let $fileData = {
      //     downName: $data.fileInfo.fileName.split(".")[0],
      //     format: $data.fileInfo.fileName.split(".")[1],
      //   };
      //   this.exportForm($data.fileInfo);
      // } else {
      _this.$Message.success("导入成功");
      _this.$emit("refreshData", 0);
      // }
    },
    fileToUrl(url) {
      window.open(api_config.img_host + "/" + url);
      this.downLoading = false;
    },
    //下载excel文件
    exportForm(data, fileData) {
      let _this = this;
      if (!fileData.fileName) fileData.fileName = data.fileName;
      _this.$http
        .post(
          api_config.get_api_url("File_DownloadTempFile"),
          {
            fileName: data.fileName,
            fileType: data.fileType,
            fileToken: data.fileToken,
          },
          { responseType: "blob" }
        )
        .then(
          (res) => {
            _this.downloadFile(res.body, fileData);
            this.downLoading = false;
          },
          (response) => {
            _this.$Message.error("下载失败，请稍后重试！");
          }
        );
    },

    // 下载文件
    downloadFile(data, fileData) {
      if (!data) {
        return;
      }
      let { downName, format } = this.value;
      let fileName =
        downName && !fileData.isModel
          ? `${downName}.${
              format ? format : fileData.format ? fileData.format : "xlsx"
            }`
          : fileData
          ? `${
              fileData.downName
                ? fileData.downName
                : fileData.fileName
                ? fileData.fileName
                : "数据导出"
            }.${format ? format : fileData.format ? fileData.format : "xlsx"}`
          : "数据导出.xlsx";
      let url = window.URL.createObjectURL(new Blob([data]));
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      this.expLoading = false;
    },

    handleSuccess(res, file) {
      this.inputLoading = false;
      if (!res.success) {
        this.$Message.error(res.error || "导入出错，请稍后再试");
        return;
      }
      this.$Message.success("导入成功");
      this.$emit("refreshData", 0);
      // this.ImportModel(res.result);
    },
    handleError(error, file, fileList) {
      this.inputLoading = false;
      this.$Message.error(file.error.message || "导入出错，请稍后再试");
    },
    handleFormatError(file) {
      _this.$Message.error("文件" + file.name + "格式错误！");
      return false;
    },
    handleMaxSize(file) {
      _this.$Message.error(
        "文件" + file.name + "过大！" + "请导入100M以内文件"
      );
      return false;
    },
  },
};
</script>
<style scoped>
.iv-excel >>> .ivu-dropdown-item {
  position: relative;
}
</style>

