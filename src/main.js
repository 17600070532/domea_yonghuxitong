// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import '../static/css/reset.css'


//阻止启动生产提示
Vue.config.productionTip = false

//mock数据引入
import './mock/mockServer'



//路由导航守卫
// router.beforeEach((to, from, next) => {
//   if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
//     if(localStorage.getItem('access_token')){ //判断本地是否存在access_token
//       next();
//     }else {
//       next({
//         path:'/login'
//       })
//     }
//   }
//   else {
//     next();
//   }
//   /*如果本地 存在 token 则 不允许直接跳转到 登录页面*/
//   if(to.fullPath === "/login"){
//     if(localStorage.getItem('access_token')){
//       next({
//         path:from.fullPath
//       });
//     }else {
//       next();
//     }
//   }
// });


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
