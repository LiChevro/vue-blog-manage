import {RouteConfig} from "vue-router";
import Layout from "@/layout/index.vue";


const articleRouter : RouteConfig = {
    path: '/article',
    component: Layout,
    redirect: '/article/list',
    name: 'Article',
    meta: {
      title: 'article',
      icon: 'education'
    },
    children: [
      {
        path: '/new',
        component: () => import(/**/'@/views/article/article-new.vue'),
        name: 'ArticleNew',
        meta: {
          title: 'articleNew',
          icon: 'edit',
          noCache: true
        }
      },
      {
        path: 'list',
        component: () => import(/* webpackChunkName: "bar-chart" */ '@/views/charts/bar-chart.vue'),
        name: 'ArticleList',
        meta: {
          title: 'articleList',
          icon: 'list',
          noCache: true
        }
      }
    ]

};


export default articleRouter;
