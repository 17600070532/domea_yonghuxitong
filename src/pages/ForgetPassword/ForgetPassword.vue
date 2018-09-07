<template>
  <section class="loginContainer">
    <!--logo区-->
    <div class="banckground_img">
      <span class="logina" @click="loginadd"></span>
    </div>
    <!--登陆区-->
    <div class="loginInner">
      <div class="login_header">
        <a href="javascript:;" :class="{on: loginWay}" @click="forgetWay(true)">手机找回</a>
        <a href="javascript:;" :class="{on: !loginWay}" @click="forgetWay(false)">邮箱找回</a>
      </div>
      <!--登陆区-->
      <div class="login_content">
        <!--手机找回-->
        <div :class="{on: loginWay}">
          <div class="phone_area">
            <div class="citySelect">
              <span>中国+86</span>
              <img src="../../assets/login/group.svg" alt="">
            </div>
            <input type="tel" maxlength="11" placeholder="输入手机号" v-model="phone"
                   :style="{color:phone!==''?'#333333':'#666666' }"
                   @blur="checkPhoneNumber">
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
              <img :src="captchaSrc" alt="" @click="changeCaptcha">
            </div>
          </div>
          <div class="phoneCode_area">
            <div class="phoneCode"  :style="{width:codeCapture==='发送验证码'?'78%':(codeCapture==='重新发送'?'82%':'75%')}">
              <input type="text" v-model="code" maxlength="4" placeholder="输入验证码" :style="{color:code!==''?'#333333':'#666666' }" @blur="checkcodeNumber">
              <div class="errorMsg" v-show="showCodeError">
                <span class="wrong_img"></span>
                <span class="wrong_error">{{codeError}}</span>
              </div>
            </div>
            <span @click="sendCode" @mouseover="codeCaptureHover($event)" @mouseout="codeCaptureLeave($event)">{{codeCapture}}</span>
          </div>
        </div>
        <!--邮箱找回-->
        <div :class="{on:!loginWay}">
          <div class="email_area">
            <input type="tel" placeholder="输入邮箱" v-model="email"
                   :style="{color:email!==''?'#333333':'#666666'}"
                   @blur="checkEmailNumber"
            >
            <div class="errorMsg" v-show="showEmailError">
              <span class="wrong_img"></span>
              <span class="wrong_error">{{emailError}}</span>
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
              <img :src="captchaSrc" alt="" @click="changeCaptcha">
            </div>
          </div>
          <div class="phoneCode_area">
            <div class="phoneCode"  :style="{width:codeCapture==='发送验证码'?'78%':(codeCapture==='重新发送'?'82%':'75%')}">
              <input type="text" v-model="code" maxlength="4" placeholder="输入验证码" :style="{color:code!==''?'#333333':'#666666' }" @blur="checkcodeNumber">
              <div class="errorMsg" v-show="showCodeError">
                <span class="wrong_img"></span>
                <span class="wrong_error">{{codeError}}</span>
              </div>
            </div>
            <span @click="sendEmailCode" @mouseover="codeCaptureHover($event)" @mouseout="codeCaptureLeave($event)">{{emailCodeCapture}}</span>
          </div>
        </div>
        <!--登陆按钮-->
        <button class="login_submit"
                :style="{background:canSubmit?'#00A0E9':'#F1F1F2',color:!canSubmit?'#999999':'#FFFFFF'}"
                :disabled="!canSubmit"
                @click="resetPwd"
        >确认</button>
      </div>
      <!--已有账号，马上登陆-->
      <div class="immiteRegister">
        <span>已有账号,</span>
        <span class="tologin" @click="$router.push('/login')">马上登录</span>
      </div>
    </div>
    <router-view></router-view>
  </section>
</template>

<script>
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
  console.log(retUrl,client_id,indexUrl);
  //初始化数据
  const TIME_COUNT = 60;//倒计时初始化
  var operationUserId;//操作数据
  const EMAIL_TIME_COUNT = 60;//倒计时初始化

  //ajax引入
  import ajax from '../../api/index'

  export default {
    mounted(){
      ajax('get','/getOptId',{},function (res) {
        operationUserId= res.data.operationId
      })
    },//获取操作id
    data(){
      return {
        captchaSrc: 'https://info.blockdigg.com/authinterface/getImgVerifyCode?operationId=' + operationUserId,
        loginWay:true, //登陆方式，true代表手机找回, false代表邮箱找回

        //手机找回信息
        phone:'',//手机号
        showPhoneError:false,//默认不显示手机号错误信息
        phoneError:'请输入手机号',//手机号错误信息

        //邮箱找回信息
        email:'',//邮箱地址
        showEmailError:false,
        emailError:'',//邮箱错误信息

        //图片验证码
        showCaptchaError:false,//图片验证码默认不显示
        captcha:'',//图片验证码
        captchaError:'验证码错误',//图片验证错误信息


        //短信验证码
        code:'', // 短信验证码
        computeTime:'',//手机倒计时
        emailComputeTime:'',//邮箱倒计时
        timer:null,
        emialTimer:null,//邮箱定时器
        showCodeError:false,//是否显示验证码错误
        codeError:'',//验证码错误详细内容
        codeCapture:'发送验证码',//发送验证码初始化显示
        emailCodeCapture:'发送验证码',//邮箱验证码
        //显示密码
        newPassword:'',//新密码
        pwd:'',
        showminCode:true,//显示最小八字符的话
        floatck : true , //第一次点击 开关
        float: true  //第一次点击开关
      }
    },
    computed:{
      rightPhone(){
        return /^1(3[0-9]|4[5-9]|5[0-35-9]|6[6]|7[0-8]|8[0-9]|9[8|9])\d{8}$/.test(this.phone)
      }, //手机号的正则
      right__validationcodefor_maind(){
        return /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(this.email)
      }, //邮箱的正则
      right_passwords(){
        return /^\S*([a-zA-Z]+\S*[0-9]+|[0-9]+\S*[a-zA-Z]+)\S*$/.test(this.pwd)
      },//密码的正则
      canSubmit(){
        return Boolean(this.captcha && this.code && (!this.loginWay ? this.email : this.phone));

      }
    },
    methods:{
      //ligon图跳转
      loginadd(){
        window.location.href = indexUrl
      },
      forgetWay(loginWay){
        this.loginWay=loginWay //切换验证方式
        this.phone=''  //手机置空
        this.captcha=''//验证码置空
        this.code=''//手机或邮箱验证码置空
        this.newPassword='' //密码置空
        this.email='' //邮箱置空

        this.showCaptchaError=false
        this.showCodeError=false
        this.showEmailError=false
        this.showPhoneError=false
      },//登陆方式验证
      checkPhoneNumber(){
        if(!this.phone){
          this.showPhoneError = true
          this.phoneError='手机号不能为空'
        }
        if (this.phone){
          this.showPhoneError =!this.rightPhone
          this.phoneError='手机号格式错误'
        }
      },//手机号码输入验证
      // captchaSrc(){
      //   //发送ajax
      //   var src='https://10.0.0.22:9091/getImgVerifyCode?operationId='
      //   var capsrc =src+operationUserId
      //   return capsrc
      // },//图片验证码图片路径接口
      changeCaptcha(){
        var src='https://info.blockdigg.com/authinterface/getImgVerifyCode?operationId='
        this.captchaSrc = src + operationUserId + '&newDate=' + Date.now()
      },//改变图片验证码
      checkImgNumber(){
        //图片验证码长度校验
        if(this.captcha.length!==4 &&this.captcha){
          this.showCaptchaError=true
          this.captchaError='验证码错误'
          return
        }else{
          //图片验证码发送请求校验是否正确
          ajax('post','/isVerifyCodeCorrect',{
            operationId:operationUserId,
            imgVerifyCode:this.captcha
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
        }
      },//图片验证码（图片验证码接口）
      sendCode(){
        if(this.phone){
        }else{
          this.showPhoneError = true
        }
        if(this.captcha){
        }else{
          this.showCaptchaError = true
          this.captchaError = '验证码错误'
        }
        //邮箱验证
        if(this.floatck){
          this.floatck = false;
          ajax('get','/sendSMS',{
            phoneNum:this.phone,
            operationId:operationUserId,
            imgVerifyCode:this.captcha,
            smsType:'0'
          },(res)=> {
            if(res.code==='0003'){
              this.floatck = true;
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
              //手机倒计时
              if (!this.timer) {
                this.computeTime = TIME_COUNT;
                this.timer = setInterval(() => {
                  if (this.computeTime > 0 && this.computeTime <= TIME_COUNT) {
                    this.computeTime--;
                    this.codeCapture=this.computeTime+'s'
                    if(this.codeCapture==='0s'){
                      clearInterval(this.timer);
                      this.timer = null;
                      this.codeCapture='重新发送'
                      this.floatck = true;
                      return
                    }
                  }else {
                    clearInterval(this.timer);
                    this.timer = null;
                  }
                }, 1000)
              }
            }else{
              this.showCaptchaError = true
            }
          })
        }

    },//手机倒计时函数+验证
      sendEmailCode(){
        if(this.email){
          this.showCaptchaError = false
        }else{
          this.showEmailError = true
          this.emailError = '邮箱格式错误'
        }
        if(this.captcha){
          this.showCaptchaError = false
        }else{
          this.showCaptchaError = true
        }
        if(this.float){
          this.float = false;
          ajax('get','/sendEmail',{
            emailAddress:this.email,
            operationId:operationUserId,
            imageVerifyCode:this.captcha
          },(res)=> {
            if(res.code==='0004'){
              this.showCodeError=true
              this.codeError='验证码错误'

              this.emialTimer = null;
              this.emailCodeCapture='重新发送'
              return
            }
            if(res.code==='0000'){
              this.showCodeError = false
              this.codeError=''
              if (!this.emialTimer) {
                this.emailComputeTime =EMAIL_TIME_COUNT;
                this.emialTimer = setInterval(() => {
                  if (this.emailComputeTime > 0 && this.emailComputeTime <= TIME_COUNT) {
                    this.emailComputeTime--;
                    this.emailCodeCapture=this.emailComputeTime+'s'
                    if(this.emailCodeCapture==='0s'){
                      clearInterval(this.emialTimer);
                      this.emialTimer = null;
                      this.emailCodeCapture='重新发送'
                      this.float = true;
                      return
                    }
                  }else {
                    clearInterval(this.emialTimer);
                    this.emialTimer= null;
                  }
                }, 1000)
              }
            }else {
              this.float = true
            }
          })
        }
        },//邮箱倒计时发送函数
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
      checkEmailNumber(){
        if(!this.email){
          this.showEmailError=false
          this.emailError='邮箱不能为空'
        }
        if(this.email){
          this.showEmailError= !this.right__validationcodefor_maind
          this.emailError='邮箱格式错误'
        } else {
          this.showCodeError=false
          this.codeError=''
        }
      },//邮箱失去焦点
      checkcodeNumber(){
        //判断验证码长度
        if(this.code.length!==4 && this.code){
          this.showCodeError=true
          this.codeError='验证码错误'
          return
        }
      },//输入验证码验证
      resetPwd(){
        if(this.loginWay){
          ajax('post','/isSMSVerifyCodeCorrect',{
            operationId : operationUserId,
            smsVerifyCode:this.code,
          },(res)=> {
            if(res.code === '0000'){
              this.$router.push({path:'/resetPwd',name:'ResetPassword',params:{
                  phone:this.phone,
                  capture:this.captcha,
                  code:this.code,
                  type:'1',
                  operationId: operationUserId
                }})
            }else {
              this.showCodeError = true
              this.codeError = '手机验证码错误'
            }
          })

        }else{
          ajax('post','/isSMSVerifyCodeCorrect',{
            operationId : operationUserId,
            smsVerifyCode:this.code,
          },(res)=> {
            if(res.code === '0000'){
              this.$router.push({path:'/resetPwd',name:'ResetPassword',params:{
                  email:this.email,
                  capture:this.captcha,
                  code:this.code,
                  type:'2',
                  operationId: operationUserId
                }})
            }else {
              this.showCodeError = true
              this.codeError = '邮箱验证码错误'
            }
          })
        }
        } //忘记密码点击确认
      },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .loginContainer
    cursor pointer
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
    z-index 100
    .logina
      display block
      width 192px
      height 24px
      background url("../../assets/login/chaindigg、logo.svg") no-repeat center
      background-size 100%
  .loginInner
    position absolute
    top 50%
    left 50%
    margin-left -230px
    margin-top  -230px
    width 460px
    height 460px
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
      margin 51px 60px 0
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
            margin-top 5px
        input
          font-family: PingFangSC-Regular
          font-size 16px
          color #999999;
          line-height 16px
          outline 0
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
          position relative
          margin-top 16px
          height 48px
          font-size 14px
          background #fff
          border-bottom 1px solid #F1F1F2
          .get_verification
            position absolute
            top 50%
            right 10px
            transform translateY(-50%)
            border 0
            color #ccc
            font-size 14px
            background transparent
            &.right_phone
              color black
        .login_password
          position relative
          margin-top 16px
          height 48px
          font-size 14px
          background #fff
          border-bottom 1px solid #F1F1F2
        .phone_area
          width 100%
          border-bottom 1px solid #F1F1F2
          height 16px
          margin-top 51px
          padding-bottom 13px
          >input
            width 39%
          .citySelect
            float left
            margin 4px
            margin-right 23px
            >span
              font-family PingFangSC-Regular
              font-size 14px
              color #666666
        .email_area
          width 100%
          border-bottom 1px solid #F1F1F2
          height 16px
          line-height 16px
          margin-top 40px
          padding-bottom 13px
          >span
           font-family PingFangSC-Regular
           font-size 14px
           color #666666
        .verification_area
          width 100%
          border-bottom 1px solid #F1F1F2
          box-sizing border-box
          height 44px
          line-height 44px
          margin-top 22px
          padding-bottom 4px
          .verification
            float left
            >input
              float left
              width 112px
              height 20px
              margin-top 18px
            .errorMsg
              margin-top 13px
              height 14px
              float right
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
          padding-bottom 13px
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
              color #00A0E9
        .sendNewPwd
          width 100%
          height 16px
          line-height 16px
          margin-top 40px
          border-bottom 1px solid #F1F1F2
          padding-bottom 13px
          .inputSend
            float left
            left 0
            width 100%
            height 16px
            line-height 16px
            box-sizing border-box
            padding-bottom 13px
            >input
              float left
              left 0
            >span
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: #999999;
              line-height: 14px
              margin-left -26px
          .errorMsg
            margin-top -13px
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
    .immiteRegister
      margin 24px 167px 64px 167px
      >span
        font-family PingFangSC-Regular
        font-size 14px
        color #666666
        letter-spacing 0
        text-align center
        line-height 14px
       .tologin
         color #00A0E9
</style>
