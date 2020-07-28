import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
// 判断 当前用户的 角色 在 当前所在的路由 meta中 支持的roles 是否存在
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    // 遍历单个路由中的元信息
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        // 递归再判断
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      // 将过滤后的路由返回
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [], // constantRoutes和asyncRout中符合权限的路由合并最后生成的路由表
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    // 在生成sideBar的时候是根据这里的routes来的
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        // 如果用户的角色是admin，会将整体的asyncRoutes赋值给accessedRoutes
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      // 将通过以上步骤过滤后的accessedRoutes赋予state.routes,并与constantRoutes合并
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
