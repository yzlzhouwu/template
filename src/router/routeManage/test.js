export default {
  path: '/',
  meta: { title: '测试' },
  component: {
    template: '<router-view></router-view>'
  },
  children: [
    {
      path: 'test',
      meta: { title: '测试' },
      component: {
        template: '<router-view></router-view>'
      },
      children: [
        {
          path: 'list',
          meta: { title: '测试' },
          component: resolve => require(['@/views/project/list.vue'], resolve)
        }, {
          path: 'add',
          meta: { title: '测试' },
          component: resolve => require(['@/views/project/add.vue'], resolve)
        }
      ]
    }
  ]
}
