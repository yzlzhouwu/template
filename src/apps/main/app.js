import Vue from 'vue'
import App from './app.vue'
import Resource from 'vue-resource'
import router from '@/router'
import iView from 'view-design'
import ivNotData from '@/components/iv-notData.js'
import 'view-design/dist/styles/iview.css'
import '@/assets/styles/index.less'
import '@/assets/styles/common.css'

Vue.use(iView);
Vue.use(Resource);

// 无数据时全局组件
Vue.component('iv-notdata', ivNotData);

window.eventBus = new Vue(); // 全局bus，用于兄弟组件之间数据的传递
router.beforeEach((to, from, next) => {
  // let accessToken = localStorage.getItem('accessToken');
  if (to.path === '/' ) {
    localStorage.removeItem('user');
    location.href = '/login.html';
  } else next();
});

Vue.http.options.emulateJSON = true;
new Vue({
  el: '#main', router, render: x => x(App)
});

// 捕捉全局异常
Vue.http.interceptors.push(function (request, next) {
  let accessToken = localStorage.getItem('accessToken');
  let user = sessionStorage.getItem('user');
  if (!accessToken || !user) {
    window.location = '/login.html';
  };

  request.headers.set('Authorization', 'Bearer ' + accessToken);

  next(function (response) {

    let data = response.body;
    if (response.status !== 200) {
      if (response.status === 401 && response.statusText === 'Unauthorized') {
        sessionStorage.removeItem('user');
        this.$Message.error('未登录');
        sessionStorage.setItem('returnBack', location.pathname)
        setTimeout(() => {
          window.location = '/login.html';
        }, 500);
      } else {
        this.$Message.error(
          { content: (data && data.error) ? data.error.message : '发生未知错误', duration: 5 }
        );
      }
    }
  });
});

