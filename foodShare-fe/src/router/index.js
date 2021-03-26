import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import {userInfo} from '@/service/api';
import Store from '@/store'

import Home from '@/views/home/Home.vue'   

const Recipe = () => import( '@/views/recipe/recipe' );
const Create = () => import( '@/views/create/create' );
const Edit = () => import( '@/views/user-space/edit' );

const Space = () => import( /* webpackChunkName: "space" */ '@/views/user-space/space');
const MenuList = () => import( /* webpackChunkName: "space" */ '@/views/user-space/menu-list');
const Fans = () => import( /* webpackChunkName: "space" */ '@/views/user-space/fans');
// Vue中运用import的懒加载语句以及webpack的魔法注释，在项目进行webpack打包的时候，对不同模块进行代码分割，在首屏加载时，用到哪个模块再加载哪个模块，实现懒加载进行页面的优化
const Detail = () => import( '@/views/detail/detail');
const Login = () => import( '@/views/user-login/index');

const viewsRoute = [
  {
    path: '/recipe',
    name: 'recipe',
    title: '菜谱大全',
    component: Recipe
  },
  {
    path: '/create',
    name: 'create',
    title: '发布菜谱',
    component: Create,
    meta: {
      login: true
    }
  },
  {
    path: '/edit',
    title: '编辑个人资料',
    name: 'edit',
    meta: {
      login: true
    },
    component: Edit
  },
  {
    path: '/space',
    title: '个人空间',
    name: 'space',
    component: Space,
    redirect: {
      name: 'works'
    },
    meta: {
      login: true
    },
    children: [
      {
        path: 'works',
        name: 'works',
        title: '作品',
        component: MenuList,
        meta: {
          login: true
        },
      },
      {
        path: 'fans',
        name: 'fans',
        title: '我的粉丝',
        component: Fans,
        meta: {
          login: true
        },
      },
      {
        path: 'following',
        name: 'following',
        title: '我的关注',
        component: Fans,
        meta: {
          login: true
        },
      },
      {
        path: 'collection',
        name: 'collection',
        title: '收藏',
        component: MenuList,
        meta: {
          login: true
        },
      }
    ]
  },
  {
    path: '/detail',
    name: 'detail',
    title: '菜谱细节',
    component: Detail
  }
]



const router = new Router({
  mode: 'history', 
  routes: [
    {
      path: '/',
      name: 'home',
      title: '首页',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      title: '登录页',
      component: Login,
      meta: {
        login: true
      },
    },
    ...viewsRoute,
    {
      path: '*',
      name: 'noFound',
      title: '未找到',
      redirect: {
        name: 'home'
      }
    }
  ]
})

router.beforeEach(async (to, from, next) => {

  const token = localStorage.getItem('token');
  const isLogin = !!token;
  const data = await userInfo();
  Store.commit('chnageUserInfo', data.data);

  if(to.matched.some(item => item.meta.login)){
    if(isLogin) {
      if(data.error === 400){
        next({name: 'login'});
        localStorage.removeItem('token');
        return;
      }
      if(to.name === 'login'){
        next({name: 'home'})
      }else {
        next();
      }
      return;
    }
    
    if(!isLogin && to.name === 'login'){
      next();
    }
    
    if(!isLogin && to.name !== 'login'){
      next({name: 'login'})
    }

  } else {
    next();
  }

})

export default router;