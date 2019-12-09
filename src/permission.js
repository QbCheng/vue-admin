import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

// 路由钩子函数(全局前置守卫)
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // 设置页面的title
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否已登录
  const hasToken = getToken()

  if (hasToken) {
    // hasToken存在，用户已经登录
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      // 如果已登录，则重定向到主页
      next({ path: '/' })
      // 结束加载bar
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      // 确定用户是否通过getInfo获得了他的权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        // 角色信息不存在
        try {
          // get user info 角色信息不存在，去获取角色
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          // 注意:角色必须是一个对象数组!例如:['admin']或，['developer'，'editor']
          const { roles } = await store.dispatch('user/getInfo')
          // generate accessible routes map based on roles
          // 根据角色生成可访问的路由映射
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // dynamically add accessible routes
          // 动态添加可访问路由
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          // 失败了，删除令牌，进入登录页面重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    // token不存在，检查该界面是否是白名单,白名单直接过
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // 其他没有访问权限的页面被重定向到登录页面。
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

// 钩子函数，没一个路由加载完成之后
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
