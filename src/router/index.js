import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
// 单独引入组件
import {
  Message
} from 'element-ui';

Vue.use(Router)

const router= new Router({
  routes: [{
    path: '/',
    component: Login
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: '/users',
        component: Users
      },
      {
        path:'/rights',
        component:Rights
      },
      {
        path:'/roles',
        component:Roles
      }
    ]
  }
  ]
})

router.beforeEach((to,from,next)=>{
  console.log('路由守卫拦截了路由配置---')
  if(to.path==='/login'){
    next()
  }else{
    const token = localStorage.getItem('token')

    if(token){
      next()
    }else{
      Message.warning("请先登录");
      router.push({
        path:'/login'
      })
    }
  }
  
})
export default router
