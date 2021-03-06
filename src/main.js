// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Http from './plugins/http'
import ElementUI from 'element-ui'
import moment from 'moment'
//导出的是组件所在对象
import Mybread from '@/components/cusBread.vue'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/index.css'

//声明一个全局组件
Vue.component(Mybread.name,Mybread)
// 处理日期格式（全局过滤器）
Vue.filter('formdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

Vue.config.productionTip = false
Vue.use(Http)
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
