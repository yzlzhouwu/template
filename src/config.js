import httpconfig from './httpconfig';
/* 公共常量 */
const common_config = {
  list_pagesize: 10, //  每页显示个数
  list_pagesizes: [10, 15, 30, 50, 100] // 允许切换的页大小数组
}
/* 接口地址 */
const api_config_url = {
  ...httpconfig
}
const env = process.env;
const api_config = {
  api_host: env.API_URL, // 主地址
  img_host: env.IMG_URL, // 内网测试网图片
  api_url: api_config_url,

  get_api_url: function (api_name) {
    let url = this.api_url[api_name]
    if (!url) console.log(api_name + '%c未找到当前接口！', 'color: red')
    let api = url && url.startsWith('http://') || url.startsWith('https://') ? url : this.api_host + url
    return api;
  }
}

export {
  common_config,
  api_config,
  api_config_url
}
