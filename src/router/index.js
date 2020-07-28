import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* constantRoutes a base page that does not have permission requirements all roles can be accessed*/
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes需要校验登录权限的路由
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  /** when your routing map is too long, you can split it into small modules **/
  {
    path: '/book',
    name: 'Book',
    component: Layout,
    redirect: '/book/create',
    meta: {
      title: '图书管理', icon: 'documentation', roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/book/create'),
        meta: { title: '上传图书', icon: 'edit', roles: ['admin'] }
      },
      {
        path: 'component',
        name: 'Component',
        meta: { title: 'component内置标签', icon: 'bug' },
        component: () => import('@/views/book/component.vue')
      },
      {
        path: 'list',
        component: () => import('@/views/error-page/401'),
        meta: { title: '图书列表', icon: 'edit', roles: ['editor'] },
        children: [
          {
            // 这里可以设置跳转到外部链接,这里菜单为a标签
            path: 'http://www.baidu.com',
            meta: { title: '百度一下', icon: 'edit', roles: ['admin'] }
          },
          {
            // path为路由时，这里的菜单是router-link
            path: 'create',
            component: () => import('@/views/book/create'),
            meta: { title: '上传图书', icon: 'edit', roles: ['admin'] }
          }
        ]
      }
    ]
  }, {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    hidden: true,
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
  mode: 'history'
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
