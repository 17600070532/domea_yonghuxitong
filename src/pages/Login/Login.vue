<template>
  <section class="loginContainer">
    <!--logo区-->
    <div class="banckground_img">
      <span class="logina" @click="logina"></span>
    </div>
    <!--登陆区-->
    <div class="loginInner" :style="{height:loginWay?'395px':'460px'}">
      <div class="login_header">
          <a href="javascript:;" :class="{on: loginWay}" @click="loginWay=true">账号登录</a>
          <a href="javascript:;" :class="{on: !loginWay}" @click="loginWay=false">短信登录</a>
      </div>
      <div class="login_content">
        <!--账号登陆-->
          <div :class="{on:loginWay}">
            <section class="login_message">
              <input  placeholder="输入账号（手机/邮箱）" v-model="phoneEmail"
                      :style="{color:phoneEmail!==''?'#333333':'#666666'}"
                      @blur="checkPhoneEmail">
              <div class="errorMsg" v-show="showUserMessage">
                <span class="wrong_img"></span>
                <span class="wrong_error">{{userMsg}}</span>
              </div>
            </section>
            <section class="login_password">
              <input type="password" name="password"
                     minlength="8"
                     placeholder="输入密码" v-model="pwd"
                     :style="{color:this.pwd!==''?'#333333':'#666666'}"
                     @blur="checkpasswordNumber">
              <div class="errorMsg" v-show="showPwdMessage">
                <span class="wrong_img"></span>
                <span class="wrong_error">{{pwdMsg}}</span>
              </div>
            </section>
            <section class="login_hint">
              <router-link to="/register" tag="a" @click="registera">账号注册</router-link>
              <router-link to="/forgetPwd" tag="a">忘记密码</router-link>
            </section>
          </div>
          <!--短信登陆-->
          <div :class="{on: !loginWay}">
              <div class="phone_area">
                <div class="citySelect">
                  <span>中国+86</span>
                  <img src="../../assets/login/group.svg" alt="">
                </div>
                 <input type="tel" maxlength="11" placeholder="输入手机号" v-model="phone" :style="{color:phone!==''?'#333333':'#666666' }" @blur="checkPhoneNumber">
                 <div class="errorMsg" v-show="showPhoneError">
                   <span class="wrong_img"></span>
                   <span class="wrong_error">{{phoneError}}</span>
                 </div>
               </div>
              <div class="verification_area">
                <div class="verification">
                  <input type="text" maxlength="4" placeholder="输入图片验证码" v-model="captcha"
                         :style="{color:captcha!==''?'#333333':'#666666' }"
                         @blur="checkImgNumber"
                  >
                  <div class="errorMsg" v-show="showCaptchaError">
                    <span class="wrong_img"></span>
                    <span class="wrong_error">{{captchaError}}</span>
                  </div>
                </div>
                <div class="imgCaptcha">
                  <img :src="captchaSrc()" alt="加载失败" @click="changeCaptcha">
                </div>
               </div>
              <div class="phoneCode_area">
              <div class="phoneCode"
                   :style="{width:codeCapture==='发送验证码'?'78%':(codeCapture==='重新发送'?'82%':'91%') }">
                <input type="text" v-model="code" maxlength="4" placeholder="输入验证码" :style="{color:code!==''?'#333333':'#666666' }" @blur="checkcodeNumber">
                <div class="errorMsg" v-show="showCodeError">
                  <span class="wrong_img"></span>
                  <span class="wrong_error">{{codeError}}</span>
                </div>
              </div>
              <span @click="sendCode" @mouseover="codeCaptureHover($event)" @mouseout="codeCaptureLeave($event)">{{codeCapture}}</span>
            </div>
              <section class="login_hint">
                <router-link to="/register" tag="a" @click="registera">账号注册</router-link>
                <router-link to="/forgetPwd" tag="a">忘记密码</router-link>
              </section>
          </div>
        <!--登陆按钮-->
          <button class="login_submit"
                  :style="{background:(pwd&&phoneEmail)||(code&&captcha&&phone)?'#00A0E9':'#F1F1F2',
                  color:(pwd&&phoneEmail)||(code&&captcha&&phone)?'#FFFFFF':'#999999'}"
                  @click="login"
                  :disabled="disabled"
          >登录</button>
      </div>
    </div>
    <router-view></router-view>
  </section>
</template>

<script>
 //倒计时初始化数据
  const TIME_COUNT = 60;//倒计时
 var operationUserId;//用户操作id
 $.extend({
   getUrlVars: function(){
     var vars = [], hash;
     var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
     for(var i = 0; i < hashes.length; i++)
     {
       hash = hashes[i].split('=');
       vars.push(hash[0]);
       vars[hash[0]] = hash[1];
     }
     return vars;
   },
   getUrlVar: function(name){
     return $.getUrlVars()[name];
   }
 });
 // Getting URL var by its nam
 const client_id = $.getUrlVar('client_id');
 var  retUrl = $.getUrlVar('retUrl');
 retUrl = decodeURIComponent(retUrl);
 var indexUrl = $.getUrlVar('indexUrl');
 indexUrl = decodeURIComponent(indexUrl);
 var tdUrl = $.getUrlVar('tdUrl');
 tdUrl = decodeURIComponent(tdUrl);
 console.log(retUrl,client_id,indexUrl,tdUrl);
 //ajax引入
 import ajax from '../../../src/api/index'

  export default {
    mounted(){
      // Getting URL var by its nam
      ajax('get','/getOptId',{},function (res) {
        if(res.data.operationId){
          operationUserId= res.data.operationId
          console.log(operationUserId)
        }
      })
    },//首屏显示操作id的问题，先获取后显示
    data(){
      return {
        loginWay:true, //登陆方式，true代表账号登陆, false代表短信登陆

        //账户登陆信息
        phoneEmail: '', // 手机号或邮箱
        pwd: '', // 密码

        showUserMessage:false,//默认不显示账户错误信息
        userMsg:'',//账户提示信息
        showPwdMessage:false,//默认不显示密码错误信息
        pwdMsg:'',//密码提示信息

        //短信登陆信息
        phone:'',//手机号
        showPhoneError:false,//默认不显示手机号错误信息
        phoneError:'',//手机号错误信息

        showCaptchaError:false,//图片验证码默认不显示
        captcha:'',//图片验证码
        captchaError:'验证码有误',//图片验证错误信息


        codeCapture:'发送验证码',//发送验证码初始化显示
        code:'', // 短信验证码
        computeTime:'',//倒计时
        timer:null,//倒计时时间中间值变量
        showCodeError:false,//是否显示验证码错误
        codeError:'',//验证码错误详细内容


        disabled:false, //按钮是否能点击

        float:true  //点击一次
      }
    },
    computed: {
      phoneExp(){
        return /^1(3[0-9]|4[5-9]|5[0-35-9]|6[6]|7[0-8]|8[0-9]|9[8|9])\d{8}$/.test(this.phoneEmail)
      },
      emailExp(){
        return /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(this.phoneEmail)
      },
      rightPhone(){
        return /^1(3[0-9]|4[5-9]|5[0-35-9]|6[6]|7[0-8]|8[0-9]|9[8|9])\d{8}$/.test(this.phone)
      }, //手机号的正则
      right__validationcodefor_maind(){
        return /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(this.Email)
      }, //邮箱的正则
      // right_passwords(){
      //   return /^\S*([a-zA-Z]+\S*[0-9]+|[0-9]+\S*[a-zA-Z]+)\S*$/.test(this.pwd)
      // },//密码的正则
      canSubmit(){
        return this.phone  && this.captcha && this.code && this.pwd
      }//提交正则
    },
    methods:{
      //点击账号注册
      registera(){
        this.$router.push({path:'/register',name:'Register',params:{
            indexUrl:indexUrl
          }})
      },
      checkPhoneEmail(){
         //非空校验
          if(!this.phoneEmail){
            this.showUserMessage=true
            this.userMsg='账户名不能为空'
          }
         if(this.phoneEmail.indexOf('@')!==-1){ //邮箱
            this.showUserMessage=!this.emailExp
            this.userMsg='邮箱格式不正确'
          }else{
            this.showUserMessage=!this.phoneExp
            this.userMsg='手机号格式不正确'
           }
        }, //账户输入函数
      checkpasswordNumber(){
        //非空校验
        if(!this.pwd){
          this.showPwdMessage = true
          this.pwdMsg='密码不能为空'
        }
        if(this.pwd){
          this.showPwdMessage= false
          // this.pwdMsg='需8位以上，同时包含大小写及数字'
        }
        //后台验证（ajax)


      },//密码输入函数
      login(){
        var username;
        //数据组装与值的判断，没有传空值
        if(this.loginWay){
          username=this.phoneEmail
        }else {
          username=this.phone
        }
        var loginType =this.loginWay?'0':'1'
        //ajax请求
        ajax('post','/login',{
          client_id:client_id,  //项目名
          client_secret:'ee484ae7-5f1f-4e67-8274-c4f5a92a60aa',//服务密钥
          grant_type:'password',//授权生成类型
          loginType:loginType,//登陆类型，0表示账号登陆，1表示手机登陆
          username:username,//账户名'
          mobile:this.phone,//手机号
          operationId:operationUserId||'',//操作id
          password:this.pwd||'',//密码
          verifyCode:this.code,//验证码
          scope:'read'
        },(res)=> {
          if(res.code==='0000'){
            console.log(res);
            console.log(res.data)
            if(tdUrl!='undefined'){
              if(tdUrl.indexOf('?')>0){
                 window.location.href = `https://${tdUrl}&access_token=${res.data.access_token}&user_name=${username}`
              }else{
                 window.location.href = `https://${tdUrl}?access_token=${res.data.access_token}&user_name=${username}`
              }

            }else {
              localStorage.token=res.data.access_token//保存token，页面跳转
              //登录成功后跳转改为 https://localhost:9090?access_token=3123123123&user_name=18910160957
              if(res.data.access_token){
                console.log(res);
                if(retUrl.indexOf('?')>0){
                   window.location.href = `${retUrl}&access_token=${res.data.access_token}&user_name=${username}`
                }else {
                   window.location.href = `${retUrl}?access_token=${res.data.access_token}&user_name=${username}`
                }
              }
            }
          }else if(res.code === '0003'){
              //保留
          }else if(res.code === '0004'){
            if (res.code==='0004') {
              if(res.data.access_token){
              }else{
                this.showUserMessage = true
                this.userMsg = '账号或密码有误'
                this.showPhoneError = true
                this.phoneError = '手机号格式错误'
              }
            }
          }
        })
      }, //登陆函数
      checkPhoneNumber(){
        if(!this.phone){
          this.showPhoneError = true
          this.phoneError='手机号不能为空'
          return
        }
        if (this.phone){
          this.showPhoneError =!this.rightPhone
          this.phoneError='手机号格式错误'
          return
        }
      },//手机失去焦点（手机验证码接口)
      captchaSrc(){
        if(operationUserId){
          //发送ajax
          var src='https://info.blockdigg.com/authinterface/getImgVerifyCode?operationId='
          var capsrc =src+operationUserId
          console.log(operationUserId)
          return capsrc
        }
      },//图片验证码图片路径接口
      changeCaptcha(event){
        //实时更改图片路径
        if(operationUserId){
          var src='https://info.blockdigg.com/authinterface/getImgVerifyCode?operationId='
          var capsrc =src+operationUserId+'&newDate='+new Date()
          event.target.src=capsrc
        }
      },//点击图片改变验证码  operationId
      checkImgNumber(){
        //图片验证码长度校验
        if(this.captcha.length!==4 && this.capture){
          this.showCaptchaError=true
          this.captchaError='验证码错误'
          return
        }
        //图片验证码发送请求校验是否正确
        ajax('post','/isVerifyCodeCorrect',{
          imgVerifyCode:this.captcha,
          operationId:operationUserId
        },(res)=> {
          if(res.code==='0002'){
            this.showCaptchaError=true
            this.captchaError='验证码错误'
            return
          }
          if(res.code==='0000'){
            this.showCaptchaError=false//关闭验证码错误信息
            this.captchaError=''//验证码错误信息关闭
          }else {
            this.showCaptchaError=true
            this.captchaError='验证码错误'
          }
        })
      },//图片验证码（判断图片验证码是否正确）
      sendCode(){
        if(this.phone){
        }else{
          this.showPhoneError = true
          this.phoneError = '请输入手机号'
        }
        if(this.captcha){
        }else{
          this.showCaptchaError = true
          this.captchaError = '验证码错误'
        }
        //倒计时函数
        //发送ajax请求判断验证码
        if(this.float){
          this.float = false;
          ajax('get','/sendSMS',{
            phoneNum:this.phone,
            operationId:operationUserId,
            imgVerifyCode:this.captcha,
            smsType:'0'
          },(res)=> {
            if(res.code==='0003'){
              this.showCodeError=true
              this.codeError='验证码错误'

              this.codeCapture='重新发送'
              this.timer = null;
              this.computeTime = TIME_COUNT
              return
            }
            if(res.code==='0000'){
              this.showCodeError=false
              this.codeError=''
              if (!this.timer) {
                this.computeTime = TIME_COUNT;
                this.timer = setInterval(() => {
                  if (this.computeTime > 0 && this.computeTime <= TIME_COUNT) {

                    this.computeTime--;
                    this.codeCapture=this.computeTime+'s'

                    this.showCodeError=false
                    this.codeError=''

                    if(this.codeCapture==='0s'){
                      clearInterval(this.timer);
                      this.timer = null;
                      this.codeCapture='重新发送'

                      this.showCodeError=false
                      this.codeError=''
                      this.float = true
                      return
                    }
                  }else {
                    clearInterval(this.timer);
                    this.timer = null;
                  }
                }, 1000)
              }
            }

          })
        }

      },//点击发送验证码
      codeCaptureHover($event){
        if(this.codeCapture==='发送验证码'){
          event.target.style.color='#00A0E9'
        }else if(this.codeCapture==='重新发送'){
          event.target.style.color='#00A0E9'
        }else {
          event.target.style.color='#666666'
        }
      },//发送验证码鼠标移入效果
      codeCaptureLeave($event){
        event.target.style.color='#666666'
      },//发送验证码鼠标移出效果
      checkcodeNumber(){
        if(!this.code){
          this.showCodeError=true
          this.codeError='验证码不能为空'
          return
        }
        //判断验证码长度
        if(this.code.length<4 && this.code){
          this.showCodeError=true
          this.codeError='验证码至少四位'
          return
        }else {
          this.showCodeError=false
          this.codeError=''
        }
      },//输入验证码验证（短信验证码接口）
      //点击登入跳转
      logina(){
        console.log(tdUrl)
        if(tdUrl!='undefined'){
          window.location.href = 'https://'+tdUrl;
          console.log(tdUrl)
           return
        }
        if(indexUrl){
          // indexUrl = indexUrl.substring(indexUrl.length-8)
          window.location.href = indexUrl;
        }else{
          return;
        }

      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .loginContainer
     width 100%
     height 100%
     position relative
     background url("../../assets/login/background.svg") no-repeat
     background-size cover
    .banckground_img
      overflow hidden
      position absolute
      left 120px
      top 48px
      .logina
        display block
        width 192px
        height 24px
        background url("../../assets/login/chaindigg、logo.svg") no-repeat center
        background-size 100%
        cursor pointer
    .loginInner
      position absolute
      top 50%
      left 50%
      margin-left -230px
      margin-top -197.5px
      width 460px
      background #fff
      border-radius 4px
      padding 64px 0
      box-sizing border-box
      .login_header
        text-align center
        >a
          color #666666
          font-size 16px
          padding-bottom 8px
          &:first-child
           margin-right 120px
          &.on
           border-bottom 2px solid #00A0E9
           color #00A0E9
           font-family PingFangSC-Regular
           font-size 16px
           letter-spacing 0
           text-align center
           line-height 16px
          &:hover
           color #00A0E9
      .login_content
          margin 51px 60px 64px
          >div
            display none
            &.on
              display block
            .errorMsg
               float right
               right 0
               .wrong_img
                width 14px
                height 14px
                display block
                background url("../../assets/login/error.svg")
                background-size 100%
                float left
                margin-top 2px
               .wrong_error
                 height 12px
                 display block
                 font-family PingFangSC-Regular;
                 font-size 12px
                 color #e44b47
                 line-height 12px
                 margin-left 23px
                 margin-top 4px
            input
              font-family: PingFangSC-Regular
              font-size 16px
              color #999999;
              line-height 16px
              outline none
              float left
              &:focus
                font-family PingFangSC-Regular
                font-size 16px
                line-height 16px
            span
              font-family PingFangSC-Regular
              font-size 14px
              color #666666
              line-height 16px
            .login_message
              width 100%
              position relative
              margin-top 41px
              height 16px
              line-height 16px
              padding-bottom 10px
              font-size 14px
              background #fff
              border-bottom 1px solid #F1F1F2
              >input
                width 60%
            .login_password
              margin-top 40px
              height 16px
              line-height 26px
              font-size 14px
              background #fff
              border-bottom 1px solid #F1F1F2
              padding-bottom 10px
              >input
               width 38%
            .phone_area
              width 100%
              border-bottom 1px solid #F1F1F2
              height 16px
              margin-top 51px
              padding-bottom 10px
              >input
                width 39%
              .citySelect
                float left
                left 0
                margin 4px
                margin-right 23px
                >span
                  font-family PingFangSC-Regular
                  font-size 14px
                  color #666666
            .verification_area
              width 100%
              border-bottom 1px solid #F1F1F2
              height 38px
              line-height 38px
              margin-top 22px
              padding-bottom 4px
              .verification
                float left
                >input
                  float left
                  left 0
                  width 112px
                  height 16px
                  margin-top 18px
                .errorMsg
                  margin-top 17px
                  height 14px
                  float right
                  margin-left 21px
              .imgCaptcha
                width 120px
                height 38px
                float right
                >img
                  width 100%
                  height 100%
            .phoneCode_area
              width 100%
              height 16px
              line-height 16px
              border-bottom 1px solid #F1F1F2
              padding-bottom 10px
              margin-top 40px
              .phoneCode
                float left
                height 16px
                >input
                 float left
                 width 35%
                .errorMsg
                  float right
              >span
                float right
                &:hover
                 color #666
            .login_hint
              margin-top 24px
              font-size 14px
              line-height 20px
              >a
                ont-family PingFangSC-Regular
                font-size 14px
                letter-spacing 0
                text-align center
                line-height 14px
                &:first-child
                  margin-right 222px
                &:hover
                  color #00A0E9
          .login_submit
            display block
            width 340px
            height 48px
            margin-top 24px
            border-radius 4px
            background #00A0E9
            font-family PingFangSC-Medium
            font-size 18px
            line-height 18px
            text-align center
            border 0
            outline 0
            cursor pointer
</style>
