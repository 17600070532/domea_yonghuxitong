<template>
  <div class="box">
    <div class="banckground_img">
      <span class="logina" @click="loginaa"></span>
    </div>
    <div class="rejus">
      <div class="rejus_box">
        <!--注册区-->
        <div class="tab_box">
                    <span :class="!loginWay?'phone_subscriptions boredr_box':'phone_subscriptions'" @click="loginchock(false)">
                        手机注册
                    </span>
                  <span :class="loginWay?'Register_Email boredr_box':'Register_Email'" @click="loginchock(true)">
                        邮箱注册
                    </span>
        </div>
        <!--手机注册-->
        <div class="phone_zhuce" v-if="!loginWay">
          <div class="phone_code">
            <span class="China">中国+86</span>
            <span class="Group"></span>
            <input type="tel" maxlength="11" @blur="checkPhoneNumber" class="number_phone" placeholder="输入手机号" v-model="phone">
            <div class="wrong" v-show="phone_show">
              <span class="wrong_img"></span>
              <span class="wrong_fontsize">{{format_error}}</span>
            </div>
          </div>
        </div>
        <!--邮箱注册-->
        <div class="Register_Email_box" v-else>
          <div class="_validationcodefor">
            <input type="tel" class="_validationcodefor_maind" placeholder="输入邮箱" v-model="Email" @blur="checkEmailNumber">
            <div class="wrong" v-show="emailcomit">
              <span class="wrong_img"></span>
              <span class="wrong_fontsize">{{wraod}}</span>
            </div>
          </div>
        </div>
        <!--图片验证码   输入验证码   输入密码-->
        <div class="Image_Verification" >
          <input type="tel" maxlength="4" class="image_code" placeholder="输入图片验证码" v-model="captcha" @blur="checkImgNumber">
          <div class="Verification" v-show="Verification_show">
            <span class="wrong_VerificationImg"></span>
            <span class="wrong_fonts">{{security_code1}}</span>
          </div>
          <img class="image_yancoede" :src="captchaUrl" @click="changeCaptcha">
        </div>

        <div class="Security_Code">
          <input type="tel"  class="text_code" maxlength="4" placeholder="请输入短信验证码" v-model="code"
                 @blur="checkcodeNumber"
                 :disabled="disbaed"
          >
          <div class="security_wang" v-show="security_wang1_show">
            <span class="fals_wang"></span>
            <span class="guoqi">{{Security_code}}</span>
          </div>
          <span class="text_veriftion" @click="sendCode" v-show="codenumber"
                :style="{color:colorsa?'#00A0E9':'#666666'}"
                :disabled="dislasv"
          >
            {{codeCapture}}
          </span>
        </div>
        <div class="input_paw">
          <input type="password" class="passwords" placeholder="输入密码" v-model="pwd"
                 :style="{width:font_pass_show?'75px':'124px'}"
                 @blur="checkpasswordNumber"
                 @keyup="checkpassnumber">
          <span class="font_pass" v-show="font_pass_show" >（最小长度8字母，含字母和数字）</span>
          <div class="wang_pass" v-show="wang_pass_show">
            <span class="pass_img"></span>
            <span class="pass_font">需8位以上，同时包含字母及数字</span>
          </div>
        </div>
        <div class="user_agreement">
          <input type="checkbox" class="checkbox_checkd" v-model="cheed">
          <span class="user_agreement_font">同意 《chaindigg 用户注册服务协议》</span>
        </div>

        <button class="button_a" :style="{background: canSubmit ? '#00A0E9' : '',color:canSubmit? '#ffffff':''}"
                :disabled="!canSubmit"
                @click="register"
        >注册</button>

        <div class="account">
          <span >已有账号,</span>
          <router-link to="/login">马上登录</router-link>
        </div>

      </div>
    </div>
    <router-view></router-view>
  </div>
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
//引入ajax
  import ajax from '../../api/index'

  //倒计时初始化数据
  var TIME_COUNT = 60;

  var  cliId;
    export default {
      mounted(){
        ajax('get','/getOptId',{
        },function (res) {
          cliId = res.data.operationId
        })

      },

      data () {
        return {
          captchaUrl: 'https://info.blockdigg.com/authinterface/getImgVerifyCode?operationId=' + cliId,
          loginWay: false, //登陆方式 false代表手机注册, true代表邮箱注册

          //邮箱注册信息
          Email: '', // 邮箱
          pwd: '', // 密码
          cheed : true, //check多选框
          wraod : '请输入邮箱', //邮箱文字
          format_error : '请输入手机号',
          float : true, //判断点击一次 当秒数是0的时候改变
          showUserMessage:false,//默认不显示账户错误信息
          userMsg:'',//账户提示信息
          showPwdMessage:false,//默认不显示密码错误信息
          pwdMsg:'',//密码提示信息
          Security_code : '验证码四位', //输入验证码提示错误信息
          security_code1 : '验证码有误',
          colorsa : true, //初始颜色值
          dislasv:false, //发送验证码禁止
          //手机注册信息
          phone:'',//手机号
          showPhoneError:false,//默认不显示手机号错误信息
          phoneError:'',//手机号错误信息

          showCaptchaError:false,//图片验证码默认不显示
          captcha:'',//图片验证码
          captchaError:'',//图片验证错误信息
          // 图片验证路径，需提供初始化路径
          disbaed:true, //禁止输入
          codeCapture:'发送验证码',
          code:'', // 短信验证码
          computeTime:'',//倒计时
          showCode:true,
          timer:null,
          showCodeError:false,//是否显示验证码错误
          codeError:'',//验证码错误详细内容

          phone_show:false, //手机错误提示
          emailcomit:false,//邮箱错误提示
          Verification_show:false, //图片验证码错误提示
          security_wang1_show:false, //验证码过期提示
          wang_pass_show:false, //密码格式错误
          font_pass_show:true,
          codenumber:true, //发送验证码消失隐藏

          reglstype:0 //注册类型
        }
      },
      computed: {

        //手机号的正则
        rightPhone () {
          return /^1[3456789]\d{9}$/.test(this.phone)
        },
        //邮箱的正则
        right__validationcodefor_maind () {
          return /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,6}$/.test(this.Email)
        },
        //图片输入的正则
        right_image_code () {
          return
        },
        //发送验证码的正则
        right_text_code() {

        },
        //密码的正则
        right_passwords () {
          return /^\S*([a-zA-Z]+\S*[0-9]+|[0-9]+\S*[a-zA-Z]+)\S*$/.test(this.pwd)
        },
        canSubmit(){
          return Boolean(this.captcha && this.code && this.pwd && this.cheed && (!this.loginWay ? this.phone : this.Email));

        },

      },
      methods: {
        //点击logo
        loginaa(){

          window.location.href = indexUrl
        },
        sendCode(){//显示效果
          this.disbaed = false
          if(this.phone){

          }else {
            this.phone_show = true
          }
          if(this.Email) {
          }else{
            this.emailcomit =  true
          }
          if(this.captcha){

          }else {
            this.Verification_show = true
          }

          // this.dislasv = this.Verification_show || (isEmail ? !this.emailcomit : this.phone_show);


          if (this.loginWay){
            this.dislasv = this.Verification_show || this.emailcomit;
          } else{
            this.dislasv = this.Verification_show || this.phone_show;
          }

          //判断手机号和图片验证码是否格式正确
          if(this.float){
            if(!this.dislasv){
              if(this.loginWay){
                this.float = false
                // this.phone = ''
                // this.captcha = ''
                // this.code = ''
                // this.pwd = ''
                //邮箱
                ajax('get','/sendEmail',{
                  emailAddress : this.Email,
                  imageVerifyCode : this.captcha,
                  operationId : cliId
                },function (res) {
                })
                if (!this.timer) {
                  this.computeTime = TIME_COUNT;
                  this.timer = setInterval(() => {
                    this.colorsa = false;
                    this.showCode= false;
                    if (this.computeTime > 0 && this.computeTime <= TIME_COUNT) {
                      this.computeTime--;
                      this.codeCapture=this.computeTime+'s'
                      if(this.codeCapture==='0s'){
                        clearInterval(this.timer);
                        this.colorsa = true;
                        this.showCode= true;
                        this.timer = null;
                        this.codeCapture='重新发送';
                        this.float = true
                        return
                      }
                    }
                  }, 1000)
                }
              }else {
                //手机
                this.float = false;
                ajax('get','/sendSMS',{
                  imgVerifyCode : this.captcha,
                  operationId : cliId,
                  phoneNum : this.phone,
                  smsType : 1
                },function (res) {
                  console.log(res)
                })
                if (!this.timer) {
                  this.computeTime = TIME_COUNT;
                  this.timer = setInterval(() => {
                    this.colorsa = false;
                    this.showCode= false;
                    if (this.computeTime > 0 && this.computeTime <= TIME_COUNT) {
                      this.computeTime--;
                      this.codeCapture=this.computeTime+'s'
                      if(this.codeCapture==='0s'){
                        clearInterval(this.timer);
                        this.colorsa = true;
                        this.showCode= true;
                        this.timer = null;
                        this.codeCapture='重新发送';
                        this.float = true;
                        return
                      }
                    }
                  }, 1000)
                }

              }
            }
          }

        },
        //手机失去焦点
        checkPhoneNumber(){
          if (this.phone && this.phone.length<=11){
            this.phone_show = !this.rightPhone;
          }else {
            this.phone_show = true
          }
        },
        //邮箱失去焦点
        checkEmailNumber(){
          if(this.Email){
            this.emailcomit = !this.right__validationcodefor_maind
          }
        },
        //图片验证码失去焦点
        checkImgNumber(){
          if(this.captcha && this.captcha.length>=4){
            //获取图片验证码
            console.log(this.loginWay)
            //图片验证判断
            if(this.loginWay){
              ajax('post','/isVerifyCodeCorrect',{
                imgVerifyCode:this.captcha,
                operationId : cliId
              }, (res)=> {
                if(res.code == '0000'){
                  this.Verification_show = false
                }else {
                  this.security_code1 = '验证码有误'
                  this.Verification_show = true
                }
              })
            }else {
              ajax('post','/isVerifyCodeCorrect',{
                imgVerifyCode:this.captcha,
                operationId : cliId
              }, (res)=> {
                if(res.code == '0000'){
                  this.Verification_show = false
                }else {
                  this.security_code1 = '验证码有误'
                  this.Verification_show = true
                }
              })
            }

          }else {
            this.Verification_show = true
          }
        },
        //发送验证码失去焦点
        checkcodeNumber () {
          if(this.code && this.code.length>=4){
            this.codenumber = true
            this.security_wang1_show = false
          }else{
            this.codenumber = true
            this.security_wang1_show = true
          }
        },
        //输入密码失去焦点
        checkpasswordNumber () {
          this.font_pass_show = false
          if(this.pwd){
            this.wang_pass_show = !this.right_passwords
          }
        },
        //tab手机和邮箱的切换为空
        loginchock (flal){
          if(flal){
            this.loginWay = flal
            //清空手机注册
            this.phone = ''
            this.captcha = ''
            this.code = ''
            this.pwd = ''
            this.reglstype = 1
            clearInterval(this.timer);
            this.codeCapture = '发送验证码'
            this.timer = null;
            TIME_COUNT = 60
            this.colorsa = true
            this.disbaed = true
            this.security_wang1_show = false
            this.codenumber = true
            this.emailcomit = false
            this.phend_onea = false
            this.Verification_show = false
          }else {
            this.loginWay = flal
            //清空邮箱注册
            this.Email = ''
            this.captcha = ''
            this.code = ''
            this.pwd = ''
            this.reglstype = 0
            clearInterval(this.timer);
            this.codeCapture = '发送验证码'
            this.timer = null;
            TIME_COUNT = 60
            this.colorsa = true
            this.disbaed = true
            this.security_wang1_show = false
            this.codenumber = true
            this.emailcomit = false
            this.phend_onea = false
            this.Verification_show = false
            this.phone_show = false
          }
        },
        //点击图片验证码
        changeCaptcha(){
          var src='https://info.blockdigg.com/authinterface/getImgVerifyCode?operationId='
          this.captchaUrl = src + cliId + '&newDate=' + Date.now()

        },
        //获取输入密码的键盘抬起的时候
        checkpassnumber (){
          this.font_pass_show = false
        },
        register(){
          var that = this
          if (this.phone_show && this.Verification_show && this.security_wang1_show && this.wang_pass_show){
            return;
          } else if(this.emailcomit &&  this.Verification_show && this.security_wang1_show && this.wang_pass_show) {
            return
          }else {
            if(this.reglstype == 0){
              ajax('post','/register',{
                operationId : cliId,
                password:this.pwd,
                userName : this.phone,
                userType:this.reglstype,
                verifyCode : this.code
              },(res)=> {

                if (res.code==='0000'){
                  this.$router.push('/login')
                  console.log(res);
                }
                if(res.code==='0007'){
                  that.phone_show = true
                  that.format_error = '该手机已注册'
                }
              })
            }else {
              ajax('post','/register',{
                operationId : cliId,
                password:this.pwd,
                userName : this.Email,
                userType:this.reglstype,
                verifyCode : this.code
              }, (res)=> {
               if(res.code==='0000'){
                 this.$router.push('/login')
                 console.log(res);
               }
               if(res.code==='0007'){
                 console.log((1111, that.emailcomit, that.wraod));
                 that.emailcomit = true
                 that.wraod = '该邮箱已注册'
                 console.log(2222, that.emailcomit, that.wraod);
               }
              })
            }


          }
        }
      }
    }

</script>

<style lang="stylus" rel="stylesheet/stylus">
  *
    margin 0
    padding 0
  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder
    color  #999999!important

  input:-moz-placeholder, textarea:-moz-placeholder
    color  #999999!important

  input::-moz-placeholder, textarea::-moz-placeholder
    color  #999999!important

  input:-ms-input-placeholder, textarea:-ms-input-placeholder
    color  #999999!important

  ul,li
    list-style none
  html,body
    width 100%
    height 100%
    cursor pointer
  .box
    width 100%
    height 100%
    background url("../../assets/login/background.svg") no-repeat center
    background-size cover
    overflow hidden
    position relative
    .banckground_img
      overflow  hidden
      position  absolute
      left  120px
      top  48px
      z-index 100
      .logina
        display block
        width 192px
        height 24px
        background url("../../assets/login/chaindigg、logo.svg") no-repeat center
        background-size 100%
    .rejus
      width 1200px
      height 100%
      margin 0 auto
      position relative
      .rejus_box
        width 460px
        height 564px
        background #ffffff
        border-radius 4px
        margin 0 auto
        position absolute
        left 50%
        top 160px
        transform translateX(-230px)
        .tab_box
          overflow hidden
          .phone_subscriptions
            display block
            width 64px
            height 26px
            font-family  PingFangSC-Regular
            font-size 16px
            color #666666
            letter-spacing 0
            text-align center
            line-height 16px
            float: left
            margin-left 106px
            margin-top 64px
          .phone_subscriptions:hover
            color #00a0e9
          .Register_Email
            display block
            width 64px
            height 26px
            font-family: PingFangSC-Regular
            font-size 16px
            color #666666
            letter-spacing 0
            text-align center
            line-height 16px
            float right
            margin-right 106px
            margin-top 64px
          .Register_Email:hover
            color #00a0e9
          .boredr_box
            color #00A0E9
            border-bottom 2px solid #00A0E9
        .phone_zhuce
          .phone_code
            width 340px
            height 24px
            border-bottom 1px solid #F1F1F2
            margin-top 42px
            margin-left 60px
            position relative
            .China
              display block
              height 16px
              font-family PingFangSC-Regular
              font-size 14px
              color #666666
              line-height 16px
              float left
              margin-top  3px
            .Group
              display block
              width 8px
              height 12px
              background url("../../assets/login/group.svg") no-repeat center
              background-size 100%
              margin-left 8px
              float  left
              margin-top 4px
            .number_phone
              display block
              float left
              width 120px
              height 16px
              color #333333
              font-size 16px
              line-height 16px
              font-family PingFangSC-Regular
              margin-left 23px
              border 0
              outline none
              margin-top 1px
            .wrong
              float right
              overflow hidden
              .wrong_img
                width 14px
                height 14px
                display block
                background url("../../assets/login/error.svg") no-repeat center
                background-size 100%
                float left
                margin-top 2px
              .wrong_fontsize
                height 12px
                display block
                font-family PingFangSC-Regular
                font-size 12px
                color #E44B47
                line-height 12px
                margin-left 23px
                margin-top: 4px;
        .Image_Verification
          width 340px
          height 50px
          border-bottom 1px solid #F1F1F2
          margin-left 60px
          margin-top 14px
          .image_code
            display block
            float left
            width 120px
            height 20px
            font-size 16px
            font-family  PingFangSC-Regular
            color #333333
            line-height 20px
            margin-top 23px
            border 0
            outline none
          .image_yancoede
            display block
            float right
            width 120px
            height 38px
            margin-top 8px
          .Verification
            overflow hidden
            float left
            margin-top 28px
            .wrong_VerificationImg
              display  block
              width 14px
              height 14px
              background url("../../assets/login/error.svg") no-repeat center
              background-size 100%
              float left
            .wrong_fonts
              display block
              height 12px
              font-size 12px
              color #E44B47
              line-height 12px
              font-family PingFangSC-Regular
              float right
              margin-left 8px
              margin-top 1px
        .Security_Code
          width 340px
          height 50px
          border-bottom 1px solid #F1F1F2
          margin-top 14px
          margin-left 60px
          position relative
          .text_code
            display block
            width 140px
            height 20px
            border 0
            font-family PingFangSC-Regular
            font-size 16px
            color #333333
            line-height 20px
            margin-top 23px
            float left
            outline none
          .text_veriftion
            display block
            float right
            height 16px
            font-family PingFangSC-Regular
            font-size 14px
            color #666666
            line-height 16px
            margin-top 27px
          .security_wang
            position absolute
            right 123px
            top 28px
            .fals_wang
              width 14px
              height 14px
              background url("../../assets/login/error.svg") no-repeat center
              background-size 100%
              float left
            .guoqi
              height 12px
              font-family  PingFangSC-Regular
              font-size  12px
              color  #E44B47
              line-height  12px
              float right
              margin-left 8px
              margin-top 1px
          .posiiton_right
            top 5px
            right 52px
            .botton_chonxin
              position absolute
              height 16px
              font-family PingFangSC-Regular
              font-size  14px
              color  #666666
              line-height  16px
              right -66px
        .input_paw
          width 340px
          height 50px
          border-bottom 1px solid #f1f1f2
          margin-top 14px
          margin-left 60px
          .passwords
            width 75px
            height 16px
            font-family PingFangSC-Regular
            font-size 16px
            color #333333
            line-height 16px
            outline none
            border 0
            margin-top 27px
            float left
          .font_pass
            display block
            height 14px
            font-size 14px
            font-family  PingFangSC-Regular
            color  #999999
            line-height  14px
            float left
            margin-top 28px
          .wang_pass
            overflow hidden
            margin-top 27px
            float right
            .pass_img
              display block
              width 14px
              height 14px
              background url("../../assets/login/error.svg") no-repeat center
              background-size 100%
              float  left
            .pass_font
              display block
              height 12px
              font-family  PingFangSC-Regular
              font-size  12px
              color  #E44B47
              line-height  12px
              margin-left 20px
              margin-top 1px
        .Register_Email_box
          ._validationcodefor
            width 340px
            height 50px
            margin-top 14px
            overflow hidden
            margin-left 60px
            border-bottom 1px solid  #F1F1F2
            ._validationcodefor_maind
              display block
              width 220px
              height 20px
              font-family  PingFangSC-Regular
              font-size  16px
              color  #333333
              line-height  20px
              margin-top 23px
              outline none
              border 0
              float left
            .wrong
              float right
              overflow hidden
              margin-top 27px
              .wrong_img
                width 14px
                height 14px
                display block
                background url("../../assets/login/error.svg") no-repeat center
                background-size 100%
                float left
                margin-top 2px
              .wrong_fontsize
                height 12px
                display block
                font-family PingFangSC-Regular
                font-size 12px
                color #E44B47
                line-height 12px
                margin-left 23px
                margin-top: 4px;
          .Image_Verification
            width 340px
            height 50px
            border-bottom 1px solid #F1F1F2
            margin-left 60px
            margin-top 14px
            .image_code
              display block
              float left
              width 120px
              height 20px
              font-size 16px
              font-family  PingFangSC-Regular
              color #999999
              line-height 20px
              margin-top 23px
              border 0
              outline none
            .image_yancoede
              display block
              float right
              width 120px
              height 38px
              background  #B8E986
              margin-top 8px
            .Verification
              overflow hidden
              float left
              margin-top 28px
              .wrong_VerificationImg
                display  block
                width 14px
                height 14px
                background url("../../assets/login/error.svg") no-repeat center
                background-size 100%
                float left
              .wrong_fonts
                display block
                height 12px
                font-size 12px
                color #E44B47
                line-height 12px
                font-family PingFangSC-Regular
                float right
                margin-left 8px
                margin-top 1px
          .Security_Code
            width 340px
            height 50px
            border-bottom 1px solid #F1F1F2
            margin-top 14px
            margin-left 60px
            position relative
            .text_code
              display block
              width 80px
              height 20px
              border 0
              font-family PingFangSC-Regular
              font-size 16px
              color #999999
              line-height 20px
              margin-top 23px
              float left
            .text_veriftion
              display block
              float right
              height 16px
              font-family PingFangSC-Regular
              font-size 14px
              line-height 16px
              margin-top 27px
              color #666666
            .security_wang
              position absolute
              right 138px
              top 28px
              .fals_wang
                width 14px
                height 14px
                background url("../../assets/login/error.svg") no-repeat center
                background-size 100%
                float left
              .guoqi
                height 12px
                font-family  PingFangSC-Regular
                font-size  12px
                color  #E44B47
                line-height  12px
                float right
                margin-left 8px
                margin-top 1px
            .posiiton_right
              top 5px
              right 52px
              .botton_chonxin
                position absolute
                height 16px
                font-family PingFangSC-Regular
                font-size  14px
                color  #666666
                line-height  16px
                right -66px
          .input_paw
            width 340px
            height 50px
            border-bottom 1px solid #f1f1f2
            margin-top 14px
            margin-left 60px
            .passwords
              width 64px
              height 16px
              font-family PingFangSC-Regular
              font-size 16px
              color #999999
              line-height 16px
              outline none
              border 0
              margin-top 27px
              float left
            .font_pass
              display block
              height 14px
              font-size 14px
              font-family  PingFangSC-Regular
              color  #999999
              line-height  14px
              float left
              margin-top 27px
            .wang_pass
              overflow hidden
              margin-top 27px
              float right
              .pass_img
                display block
                width 14px
                height 14px
                background url("../../assets/login/error.svg") no-repeat center
                background-size 100%
                float  left
              .pass_font
                display block
                height 12px
                font-family  PingFangSC-Regular
                font-size  12px
                color  #E44B47
                line-height  12px
                margin-left 20px
        .user_agreement
          width 340px
          overflow hidden
          margin-left 60px
          margin-top 24px
          .checkbox_checkd
            width 16px
            height 16px
            display block
            float left
            cursor pointer
          .user_agreement_font
            display block
            float left
            height 14px
            font-family  PingFangSC-Regular
            font-size  14px
            color  #666666
            letter-spacing  0
            text-align  center
            line-height  14px
            margin-left 5px
        .button_a
          width 340px
          height 48px
          background #F1F1F2
          border-radius 4px
          margin-top 24px
          text-align center
          line-height 48px
          font-family  PingFangSC-Medium
          font-size  18px
          color  #999999
          border 0
          outline none
          cursor pointer
        .account
          height 14px
          overflow hidden
          margin-left 167px
          margin-top 24px
          span
            display block
            float left
            height 14px
            font-family PingFangSC-Regular
            font-size  14px
            color  #666666
            letter-spacing  0
            text-align  center
            line-height  14px
          a
            display block
            float left
            text-decoration none
            height 14px
            font-family  PingFangSC-Regular
            font-size  14px
            color  #00A0E9
            letter-spacing 0
            text-align  center
            line-height  14px

</style>
