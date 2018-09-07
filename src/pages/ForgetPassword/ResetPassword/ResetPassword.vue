<template>
    <div class="box">
      <div class="box_imga" @click="logisdsg">
        <img src="../../../assets/login/chaindigg、logo.svg" alt="chaindigg、logo.svg">
      </div>
      <div class="setpassword_box">
        <div class="box_word">
          <a href="#" class="box_word1">重置密码</a>
          <div class="passwords">
            <input type="password" placeholder="输入密码" class="passworda" v-model="paw"
                   @focus="focus_Chock"
                   :style="{width:passwrads?'':'200px'}"
                   @blur="blur_Chock"
            >
            <span class="font-size_pass" v-show="passwrads">(最小长度8字母，含英文大小写和数字)</span>
            <div class="wangsd" v-show="mobile_phone">
              <span class="wangsd_svg"></span>
              <span class="wangds_font">密码格式错误</span>
            </div>
          </div>

          <div class="sestpass">
            <input type="password" class="setpassword" placeholder="再次确认密码"  v-model="pawone" @blur="blur_pass">
            <div class="wangsd" v-show="mobile_phone_pass">
              <span class="wangsd_svg"></span>
              <span class="wangds_font">密码不一致</span>
            </div>
          </div>

          <button class="accomplish" :style="{background:canSubmit?'#00A0E9':'',color:canSubmit ? '#ffffff':''}"
                  :disabled="!canSubmit"
                  @click="accomplish">完成</button>
          <div class="bottom_font">
            <span class="user_css">已有账号,</span>
            <router-link to="/login" class="login_css">马上登录</router-link>
          </div>
        </div>
      </div>
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

    import ajax from "../../../api";

    export default {
     mounted(){

       console.log(this.$route.params.email,this.$route.params.capture,this.$route.params.code,this.$route.params.phone);
     },//页面跳转携带参数如何取值的函数，在重置密码点击确认时发送字段
     data (){
          return{

            paw : '', //密码
            pawone :'', //再次密码
            passwrads : true, //显示最小长度等

            mobile_phone : false, //手机格式错误显示
            mobile_phone_pass : false //密码不一致
          }
        },
     computed:{
          //密码的正则
        right_passwords () {
          return /^\S*([a-zA-Z]+\S*[0-9]+|[0-9]+\S*[a-zA-Z]+)\S*$/.test(this.paw)
        },
        //完成样式与禁止点击
        canSubmit () {
          return Boolean(this.paw && this.pawone && (this.paw === this.pawone))
        }
      },
     methods:{
       //点击logintu跳转
       logisdsg(){
         window.location.href = indexUrl
       },
        //密码获取焦点
        focus_Chock () {
            this.passwrads = false
          },
        //密码失去焦点
        blur_Chock () {
            if(this.paw.length>=8&&this.paw){
              this.mobile_phone = !this.right_passwords
            }
        },
        //二次密码失去焦点
        blur_pass(){
          if(this.paw === this.pawone){
            this.mobile_phone_pass = false
          }else {
            this.mobile_phone_pass = true
          }
        },
        //点击完成
        accomplish(){
          if(this.mobile_phone && this.mobile_phone_pass){
          }else{
            if(this.$route.params.type === '1' ){
              //手机
              ajax('post','/resetPassword',{
                operationId:this.$route.params.operationId,
                password:this.pawone,
                userName:this.$route.params.phone,
                userType:'0',
                verifyCode:this.$route.params.code
              }, (res)=> {
                if(res.code==='0000'){
                  this.$router.push('/login')
                }
              })
            }else if(this.$route.params.type === '2'){
              //邮箱
              ajax('post','/resetPassword',{
                operationId:this.$route.params.operationId,
                password:this.pawone,
                userName:this.$route.params.email,
                userType:'1',
                verifyCode:this.$route.params.code
              }, (res)=> {
                if(res.code==='0000'){
                  this.$router.push('/login')
                }
              })
            }
          }


        }
      }
   }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
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
  .box
    width 100%
    height 100%
    background url("../../../assets/login/background.svg") no-repeat center
    background-size 100%
    .box_imga
      width 192px
      height 24px
      position absolute
      left 120px
      top 48px
      z-index 100
      img
        display block
        width 100%
    .setpassword_box
      width 1200px
      height 100%
      margin 0 auto
      overflow hidden
      .box_word
        width 460px
        height 395px
        background #ffffff
        border-radius 4px
        overflow hidden
        position absolute
        left 50%
        top 160px
        transform translateX(-230px)
        .box_word1
          display block
          width 64px
          height 16px
          font-family  PingFangSC-Regular
          font-size  16px
          color  #00A0E9
          letter-spacing: 0
          text-align  center
          line-height  16px
          margin-left 198px
          margin-top 64px
        .passwords
          width 340px
          height 64px
          border-bottom 1px solid #F1F1F2
          margin-left 60px
          margin-top 10px
          .passworda
            width 64px
            height 16px
            display block
            font-family  PingFangSC-Regular
            font-size  16px
            color  #999999
            line-height  16px
            float left
            margin-top 40px
            outline none
          .font-size_pass
            display block
            width 261px
            height 14px
            font-family  PingFangSC-Regular
            font-size  14px
            color  #999999
            line-height  14px
            float left
            margin-top 41px

          .wangsd
            height 14px
            float right
            margin-top 40px
            .wangsd_svg
              display block
              float left
              width 14px
              height 14px
              background url("../../../assets/login/error.svg") no-repeat center
              background-size 100%

            .wangds_font
              display block
              float left
              height 12px
              font-family  PingFangSC-Regular
              font-size  12px
              color  #E44B47
              line-height  12px
              margin-top 1px
              margin-left 8px
        .sestpass
          width 340px
          height 64px
          border-bottom 1px solid #F1F1F2
          margin-left 60px
          .setpassword
            width 200px
            height 16px
            display block
            font-family  PingFangSC-Regular
            font-size  16px
            color  #999999
            line-height  16px
            margin-top 40px
            float left
            outline none
          .wangsd
            height 14px
            float right
            margin-top 40px
            .wangsd_svg
              display block
              float left
              width 14px
              height 14px
              background url("../../../assets/login/error.svg") no-repeat center
              background-size 100%

            .wangds_font
              display block
              float left
              height 12px
              font-family  PingFangSC-Regular
              font-size  12px
              color  #E44B47
              line-height  12px
              margin-top 1px
              margin-left 8px
        .accomplish
          display  block
          width 340px
          height 48px
          margin-top 24px
          background  #F1F1F2
          border-radius 4px
          color #999999
          font-family PingFangSC-Medium
          font-size 18px
          line-height 18px
          margin-left 60px
          border 0
          outline none
        .bottom_font
          height 14px
          margin-top 24px
          margin-left 167px
          .user_css
            display  block
            height  14px
            font-family  PingFangSC-Regular
            font-size  14px
            color  #666666
            letter-spacing  0
            text-align  center
            line-height  14px
            float left
          .login_css
            display block
            text-decoration none
            height 14px
            float left
            font-family  PingFangSC-Regular
            font-size 14px
            color #00a0e9
            letter-spacing 0
            text-align center
            line-height 14px
            margin-left 3px
</style>
