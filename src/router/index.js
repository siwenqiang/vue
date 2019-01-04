import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'

Vue.use(Router)

export default new Router({
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
