const city = { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江 ', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北 ', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏 ', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外 ' };
const idNumber = (rule, value, callback) => {
  if (value) {
    if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
      callback(new Error('身份证号格式错误'));
    } else if (!city[value.substr(0, 2)]) {
      callback(new Error('身份证地址编码错误'));
    } else if (value.length === 18) {
      // 18位身份证需要验证最后一位校验位
      value = value.split('');
      // ∑(ai×Wi)(mod 11)
      // 加权因子
      let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      // 校验位
      let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      let sum = 0;
      let ai = 0;
      let wi = 0;
      for (let i = 0; i < 17; i++) {
        ai = value[i];
        wi = factor[i];
        sum += ai * wi;
      }
      if (parity[sum % 11] != value[17]) {
        callback(new Error('身份证校验位错误'));
      } else {
        callback();
      }
    } else {
      callback();
    }
  } else {
    callback();
  }
}
const validateInt = (rule, value, callback) => {
  if (!Number.isInteger(+value)) {
    callback(new Error('请输入整数'));
  } else {
    callback();
  }
}
const validateArray = (rule, value, callback) => {
  let str = `${rule.name ? rule.name : '数组'}不能为空`
  if (!(value instanceof Array)) {
    callback(new Error('请输入数组'));
  } else if (!value.length) {
    callback(new Error(str));
  } else {
    for (const item of value) {
      if (!item) { callback(new Error(str)); return; }
    }
    callback()
  }
}

const rules = {
  rule_idNumber: { // 身份证验证
    validator: idNumber,
    trigger: 'change'
  },
  fixedPhone: {
    message: '请输入正确的固定电话', pattern: /^0\d{2,3}-?[1-9]\d{6,7}$/, trigger: 'blur'
  },
  phone: {
    message: '请输入正确的联系电话', pattern: /^0\d{2,3}-?[1-9]\d{6,7}$|^1\d{10}$/, trigger: 'blur'
  },
  telphone: {
    message: '请输入正确的手机号', pattern: /^1\d{10}$/, trigger: 'blur'
  },
  url: {
    type: 'url', message: '请输入正确的网址', trigger: 'blur'
  },
  email: {
    type: 'email', message: '请输入正确的电子邮箱', pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/, trigger: 'blur'
  },
  fax: {
    message: '请输入正确的传真格式', pattern: /^(\d{3,4}-)?\d{7,8}$/, trigger: 'blur'
  },
  intNumber: { // 整数
    validator: validateInt
  },
  //正浮点数
  float: {
    message: '请输入大于零的数字', pattern: /[1-9]\d*.\d*|0\.\d*[1-9]\d*/, trigger: 'blur'
  },
  array: {
    validator: validateArray
  }
};

export default rules
