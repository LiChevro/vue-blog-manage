import {RouteConfig} from "vue-router";
import Layout from "@/layout/index.vue";


const systemRouter: RouteConfig = {
  path: '/system',
  component: Layout,
  redirect: '/system/roles',
  meta: {
    title: 'system',
    icon: 'lock',
    roles: ['ROLE_ADMIN','ROLE_EDITOR'], // you can set roles in root nav
    alwaysShow: true // will always show the root menu
  },
  children: [
    {
      path: 'roles',
      component: () => import(/* webpackChunkName: "permission-role" */ '@/views/system/roles.vue'),
      name: 'RolePermission',
      meta: {
        title: 'rolePermission',
        icon: 'peoples',
        roles: ['ROLE_ADMIN']
      }
    }
  ]


};


export default systemRouter;
