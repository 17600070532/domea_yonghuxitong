import Vue from 'vue'
import Router from 'vue-router'


//个人信息
import Personal from '../pages/Personal/Personal'

// //页面找不到页面
// import NotFoundComponent from '../components/NotFoundComponent/NotFoundComponent'


//插件声明使用
Vue.use(Router)


//路由路径设置
export default new Router({
  // mode:'history',//历史模式，去掉hash值
  // base:'',//打包加载文件
  routes: [
    {
      path:'/personal',
      name:'Personal',
      component:Personal
    },
    {
      path:'/',
      redirect:'/personal'  //路由重定向
    }
  ]
})
