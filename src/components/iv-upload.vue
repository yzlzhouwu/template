<!--
 * @Description: 导入数据
 * @events: uploadSuccess 上传成功 触发
 * @props: uploadUrl 上传地址
           maxSize 文件最大上传大小
           format 上传文件格式
 * @Date: 2020-07-22 16:00:05
 * @FilePath: \教学过程质量监控与评价系统\src\components\iv-upload.vue
-->
<template>
  <div class="iv-upload">
    <Upload
      :action="uploadUrl"
      ref="file"
      :max-size="maxSize"
      :multiple="isMultiple"
      :format="format"
      :accept="accept"
      :show-upload-list="false"
      :on-success="handleSuccess"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
    >
      <slot>
        <Button icon="ios-exit">导入</Button>
      </slot>
    </Upload>
  </div>
</template>

<script>
export default {
  props: {
    uploadUrl: { type: String, required: true },
    maxSize: {
      type: Number,
      default: 102400,
    },
    format: {
      type: Array,
      default: () => ["xlsx", "xls"],
    },
    isMultiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return { accept: "" };
  },
  mounted() {
    this.format.forEach((item, i, arr) => {
      this.accept += `.${item}${i < arr.length ? ", " : ""}`;
    });
  },
  methods: {
    handleSuccess(res, file) {
      console.log(res);
      let _this = this;
      if (!res.success) {
        console.log(1, res);
        _this.$Message.warning(res.error || "导入出错，请稍后再试");
        return;
      }
      console.log(2, res);
      _this.$emit("uploadSuccess", res, file);
    },
    handleFormatError(file) {
      this.$Message.warning(
        `文件${file.name}格式错误请传入${format.join("，")}格式`
      );
      return false;
    },
    handleMaxSize(file) {
      this.$Message.warning(
        `文件${file.name}过大，请上传小于${this.maxSize / 1024}M的文件`
      );
      return false;
    },
  },
};
</script>

<style scoped>
.iv-upload {
  display: inline-block;
}
</style>
