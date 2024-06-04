// 导入
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'
// 使用
Vue.use(VueRouter)

// 解决重复点击导航时，控制台出现报错
const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}
// 导入需要通过路由管理的组件
import findmusic from '../views/FindMusic.vue'
import playlists from '../views/PlayLists.vue'
import newsongs from '../views/NewSongs.vue'
import newmvs from '../views/NewMvs.vue'
import searchresult from '../views/SearchResult.vue'
import playlistdetail from '../views/PlaylistDetail.vue'
import mvdetail from '../views/MvDetail.vue'
import musicdetail from '@/views/MusicDetail.vue';
import userdetail from '@/views/UserDetail.vue'
import userUpdate from '@/views/UserUpdate.vue'
import lrc from '@/views/Lrc.vue'

import login from '../views/Login.vue'
import register from '../views/Register.vue'
import { name } from 'pubsub-js';
// 配置地址和组件对应关系
const routes = [
  {
    name: 'home',
    // 地址
    path: "/",
    // 组件
    redirect: '/findmusic'
  }, {
    path: "/findmusic",
    component: findmusic,
    meta: {
      keepAlive: true
    }
  }, {
    path: "/playlists",
    component: playlists,
    meta: {
      keepAlive: true
    }
  }, {
    path: "/newsongs",
    component: newsongs,
    meta: {
      keepAlive: true
    }
  }, {
    path: "/newmvs",
    component: newmvs,
    meta: {
      keepAlive: true
    }
  }, {
    path: "/searchresult",
    component: searchresult,
    meta: {
      keepAlive: true
    }
  }, {
    path: "/playlistdetail",
    component: playlistdetail,
    meta: {
      keepAlive: true
    }
  }, {
    path: "/mvdetail",
    component: mvdetail,
    meta: {
      keepAlive: true
    }
  }, {
    path: "/musicdetail",
    component: musicdetail,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/userdetail",
    component: userdetail,
    meta: {
      keepAlive: true
    }
  }, {
    name: 'login',
    path: "/login",
    component: login,

  }, {
    name: 'register',
    path: "/register",
    component: register,

  },
  {
    name: 'userupdate',
    path: "/userupdate",
    component: userUpdate,

  },
  {
    name: 'lyrics',
    path: "/lyrics",
    component: lrc,

  },

];

// if (window.localStorage.getItem('token')) {
//   store.commit('setIsLogin', window.localStorage.getItem('isLogin'));
// }


// 创建路由
const router = new VueRouter({
  routes,
})

//导航守卫，未登录时只允许登录和注册
router.beforeEach(async (to, from, next) => {
  if (
    // 检查用户是否已登录
    window.localStorage.getItem('isLogin') != 'true' &&
    // // ❗️ 避免无限重定向
    to.name != 'login' && to.name != 'register'
  ) {
    next({
      name: 'login'
    })
  } else {
    next()
  }

})
export default router
