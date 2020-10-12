import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {RouteConfig} from 'vue-router'
import {asyncRoutes, constantRoutes} from '@/router'
import store from '@/store'
import Layout from '@/layout/index.vue'
import {UserModule} from "@/store/modules/user";

// 通过mata.roles判断是否与当前用户权限匹配
const hasPermission = (roles: string[], route: RouteConfig) => {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

// 递归过滤异步路由表，返回符合用户角色权限的路由表
export const filterAsyncRoutes = (routes: RouteConfig[], roles: string[]) => {
  const res: RouteConfig[] = [];
  routes.forEach(route => {
    const r = {...route}
    if (hasPermission(roles, r)) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, roles)
      }
      res.push(r)
    }
  })
  return res
}

export const formatRoutes = (data: any[]) => {
  let fmtRoutes: RouteConfig[] = []
  data.forEach(item => {
    if (item.children) {
      item.children = formatRoutes(item.children);
    }
    let fmtRoute = {
      path: item.path,
      component: item.component === 'Layout' ? Layout : (resolve: any) => require([`@/views/${item.component}.vue`], resolve),
      redirect: item.redirect,
      meta: {
        title: item.title,
        icon: item.icon,
        alwaysShow: item.alwaysShow,
        hidden: item.hidden,
        roles: item.roles
      },
      children: item.children
    };
    fmtRoutes.push(fmtRoute);
  });
  return fmtRoutes;
};

export interface IPermissionState {
  routes: RouteConfig[]
  dynamicRoutes: RouteConfig[]
}

@Module({dynamic: true, store, name: 'permission'})
class Permission extends VuexModule implements IPermissionState {
  public routes: RouteConfig[] = []
  public dynamicRoutes: RouteConfig[] = []

  @Mutation
  private SET_ROUTES(routes: RouteConfig[]) {
    this.routes = constantRoutes.concat(routes)
    this.dynamicRoutes = routes
  }

  @Action({rawError: true})
  public GenerateRoutes(routes: RouteConfig[]) {
    // console.log("我的路由" + JSON.stringify(routes))
    // console.log("前端的路由" + JSON.stringify(asyncRoutes))
    const roles = UserModule.roles
    const accessedRoutes = filterAsyncRoutes(routes, roles)
    // let accessedRoutes;
    // if (roles.includes('ROLE_BLOGGER')) {
    //   accessedRoutes = asyncRoutes
    // } else {
    //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
    // }
    console.log(accessedRoutes)
    this.SET_ROUTES(accessedRoutes)
  }
}

export const PermissionModule = getModule(Permission)
