import Vue from 'vue'
import Router from 'vue-router'
import routeManage from './routeManage'

import $ from 'jquery'
global.$ = global.jQuery = $
Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: '/',
  routes: [
    ...routeManage
  ]
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}-${process.env.COMPANY || ''}`
  next()
})

export default router
