export default {
  path: '/',
  meta: { title: '加载中' },
  component: { template: '<router-view></router-view>' },
  children: [
    {
      path: '500',
      meta: { title: '暂无权限' },
      component: (resolve) => require(['@/views/error/500.vue'], resolve)
    },
    {
      path: '*',
      meta: { title: '404' },
      component: (resolve) => require(['@/views/error/404.vue'], resolve)
    }
  ]
}
