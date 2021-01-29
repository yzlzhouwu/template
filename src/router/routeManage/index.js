import test from './test'
import error from './error'

export default [{
  path: '/',
  meta: { title: '加载中...' },
  component: reslove => require(['@/views/frame.vue'], reslove),
  children: [test]
}, error]
