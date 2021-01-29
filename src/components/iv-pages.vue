<template>
  <div class="iv-page">
    <Page
      :total="value.total"
      :page-size="value.pageSize"
      :page-size-opts="value.pagesizes"
      :current="value.current"
      show-sizer
      show-total
      show-elevator
      @on-change="handlePageChange"
      @on-page-size-change="handleSizeChange"
    ></Page>
  </div>
</template>

<script>
import { utils } from "@/utils.js";
export default {
  props: {
    value: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    /**
     * 翻页
     * @method handleChange
     * @param {int} page 当前页
     */
    handlePageChange(page) {
      let _this = this;

      _this.value.pageIndex = page - 1;
      _this.value.current = page;
      _this.$router.push({ query: utils.query(page - 1) });
      _this.$emit("input", _this.value);
      _this.$emit("refreshData");
    },
    /**
     * 改变每页条数
     * @method handleSizeChange
     * @param {int} size 页大小
     * **/
    handleSizeChange(size) {
      let _this = this;

      _this.value.pageSize = size;
      _this.value.pageIndex = 0;
      _this.value.current = 1;
      _this.$router.push({ query: utils.query(0) });

      _this.$emit("input", _this.value);
      _this.$emit("refreshData");
    },
  },
  mounted() {
    this.$on("changeCurrent", (val) => {
      this.handlePageChange(val);
    });
  },
};
</script>

<style>
.iv-page {
  text-align: right;
  margin-top: 10px;
}
</style>


