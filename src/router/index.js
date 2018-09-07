import Vue from 'vue'
import Router from 'vue-router'


//登陆页
import Login from '../pages/Login/Login'

//路由注册
import Register from  '../pages/Register/Register'

//忘记密码页
import ForgetPassword from '../pages/ForgetPassword/ForgetPassword'
//重置密码
import ResetPassword from '../pages/ForgetPassword/ResetPassword/ResetPassword'

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
      path: '/login',
      name: 'Login',
      component: Login  //登陆页面
    },
    {
      path:'/forgetPwd',
      name:'ForgetPassword',
      component:ForgetPassword
    },
    {
      path:'/resetPwd',
      name:'ResetPassword',
      component:ResetPassword
    },
    {
      path:'/register',
      name:'Register',
      component:Register
    },
    {
      path:'/',
      redirect:'/login'  //路由重定向
    }
  ]
})
