<!--
 * @Description:上传文件
 * @events:
 * @methods:
 * @props:
 * @Date: 2020-08-01 15:09:49
 * @FilePath: \教学过程质量监控与评价系统\src\components\updated.vue
-->
<template>
  <div class="iv-upload">
    <Upload
     :disabled="disabled"
      :action="uploadUrl"
      :data="uploadData"
      ref="file"
      :max-size="maxSize"
      :format="format"
      :accept="accept"
      :show-upload-list="false"
      :on-success="handleSuccess"
      :before-upload="handleBeforeUpload"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :on-progress="handleProgress"
    >
      <Button :disabled="disabled">上传材料</Button>
    </Upload>
    <div class="updated-file" v-if="fileList && fileList.name">
      <template v-if="fileList.status === 'finished'">
        <div class="update-name">
          <a :title="fileList.name" target="_blank" :href="fileList.url">{{fileList.name}}</a>
        </div>
      </template>
      <template v-else>
        <div class="update-progress">
          <Progress :percent="fileList.percentage" hide-info />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { api_config, common_config } from "@/config.js";
import { utils } from "@/utils.js";
export default {
  props: {
    maxSize: {
      type: Number,
      default: 102400,
    },
    format: {
      type: Array,
      default: () => ["xlsx", "xls"],
    },
    data:{
      type: Object
    },
    disabled:{
      type: Boolean,
      default:false
    }
  },
  data() {
    return {
      uploadUrl: api_config.get_api_url("FileUpload_Upload"), //上传接口
      uploadData: {
        sourceId: Math.uuidCompact(),
      }, //上传参数
      accept: "",
      fileList: {},
    };
  },
  mounted() {
    this.format.forEach((item, i, arr) => {
      this.accept += `.${item}${i < arr.length ? ", " : ""}`;
    });
  },
  methods: {
    handleBeforeUpload(file) {
      const { name } = file;
      let nameArr = name.split(".");
      const fileInfo = {
        name: nameArr[0] || "",
        format: nameArr[nameArr.length - 1].toLowerCase() || "",
      };
      if (this.fileList.name === fileInfo.name) {
        this.$Message.error({
          content: `${fileInfo.name}文件已上传，请重新上传！`,
          duration: 3,
        });
        return false;
      }
      this.fileList = {
        name: file.name,
        format: fileInfo.format,
        url: "",
        status: "loading",
        percentage: 0,
      };
    },
    handleSuccess(res, file) {
      let _this = this;
      this.fileList.url = api_config.api_host + res.result[0].url;
      this.fileList.status = "finished";
      this.fileList.percentage = 100;
      _this.$emit("uploadSuccess", this.fileList,res.result[0].fileInfoId);
    },
    handleFormatError(file) {
      this.$Message.warning(`请上传 ${this.format} 格式的文件！`);
      this.fileList = {};
      return false;
    },
    handleMaxSize(file) {
      this.$Message.warning(
        `文件${file.name}过大，请上传小于${this.maxSize / 1024}M的文件`
      );
      this.fileList = {};
      return false;
    },
    handleProgress(event, file, fileList) {
      this.fileList.percentage = event.percent;
    },
  },
};
</script>

<style scoped>
</style>

