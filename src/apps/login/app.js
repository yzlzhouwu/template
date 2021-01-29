import Vue from 'vue'
import App from './app.vue'
import Resource from 'vue-resource'
import iView from 'view-design'
import 'view-design/dist/styles/iview.css'
import '@/assets/styles/index.less'
import '@/assets/styles/common.css'

Vue.use(iView);
Vue.use(Resource);

Vue.http.options.emulateJSON = true;
new Vue({
  el: '#main',
  render: x => x(App)
});
