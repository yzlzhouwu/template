export default {
  getCookies () {
    let cookies = {};
    document.cookie &&
      document.cookie.split('; ').forEach(item => {
        let temp = item.split('=');
        try {
          cookies[temp[0]] = JSON.parse(decodeURI(temp[1]));
        } catch (error) {
          cookies[temp[0]] = decodeURI(temp[1]);
        }
      });
    return cookies;
  },
  // 获取cookie、
  getCookie (name) {
    var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    if (arr = document.cookie.match(reg)) { return (arr[2]); } else { return null; }
  },
  // 设置cookie,增加到vue实例方便全局调用
  setCookie (c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString()) + '; path=/';
  },
  // 删除cookie
  delCookie (name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.getCookie(name);
    if (cval != null) { document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString(); }
  },
  clone (value) {
    return JSON.parse(JSON.stringify(value))
  },

  deleteNotParams (obj) {
    return JSON.parse(JSON.stringify(obj, (key, val) => val || val === 0 ? val : undefined))
  },

  removeAllSpace (str) {
    return str && str.replace(/\s+/g, '');
  },
  // DatePacker格式化
  parseTime (time, cFormat) {
    if (arguments.length === 0) {
      return null;
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    let date;
    if (typeof time === 'object') {
      date = time;
    } else {
      if (('' + time).length === 10) time = parseInt(time) * 1000;
      date = new Date(time);
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key];
      if (key === 'a') { return ['一', '二', '三', '四', '五', '六', '日'][value - 1]; }
      if (result.length > 0 && value < 10) {
        value = '0' + value;
      }
      return value || 0;
    });
    return time_str;
  },
  // 时间格式化
  dateFormat (time, fmt) {
    if (!time) return
    if (time == '0001-01-01T00:00:00') return
    if (typeof time === 'string' && time.includes('T')) {
      time = time.replace('T', ' ').replace(/\-/g, '/');
    };
    if (typeof time === 'string' && time.indexOf('.') !== -1) {
      time = time.split('.')[0]
    }
    time = new Date(time);
    var o = {
      'M+': time.getMonth() + 1,
      'd+': time.getDate(),
      'h+': time.getHours(),
      'm+': time.getMinutes(),
      's+': time.getSeconds(),
      'q+': Math.floor((time.getMonth() + 3) / 3),
      'S': time.getMilliseconds()
    }

    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length))

    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }

    return fmt;
  },

  query (page) {
    let vars = {};
    let hash;
    let hashes = location.search.slice(1).split('&');
    for (var i = 0; i < hashes.length; i++) {
      if (hashes[i]) {
        hash = hashes[i].split('=');
        vars[hash[0]] = decodeURIComponent(hash[1]);
      }
    }
    vars.pageindex = page;
    return vars
  },

  queryString () {
    let vars = {};
    let hash;
    let hashes = [];
    if (location.href.indexOf('?') > -1) {
      hashes = location.href.slice(location.href.indexOf('?') + 1).split('&');
    }
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars[hash[0]] = decodeURIComponent(hash[1]);
    }
    return vars;
  },
  /**
 * a标签下载
 * @param {String} url 下载地址
 * @param {String} name 文件名称
 */
  downloadFile (url, name = '') {
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
  }
}

