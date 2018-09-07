<template>
    <div class="box">
      <!--头部-->
      <div class="box_header">
        <div class="content">
          <a href="/" class="logina"></a>
          <div class="header_right">
            <span class="phop">{{userNamea}}</span>
            <span class="quit" @click="esca">退出</span>
          </div>
        </div>
      </div>
      <!--内容-->
      <div class="bodys">
        <div class="content1">
          <div class="h1_a"><span>我的账户</span></div>
        </div>
        <div class="wrap">
          <ul class="content2">
            <li class="list">
              <span class="list_span_uid">UID：</span>
              <span class="list_span_number">{{userMessage.id}}</span>
            </li>
            <li class="list">
              <span class="list_span_uid">上次登录时间：</span>
              <span class="list_span_number">{{userMessage.lastLoginTime}}</span>
            </li>
            <li class="list">
              <span class="list_span_uid">注册时间：</span>
              <span class="list_span_number">{{userMessage.registTime}}</span>
            </li>
            <li class="list">
              <span class="list_span_uid">登录密码：</span>
              <span class="list_span_number">******</span>
              <span class="list_span_change_password" @click.stop="xiugai_password" v-show="userMessage.userRegisteType != '1'">
                        修改密码
                    </span>
            </li>
            <li class="list" v-show="userMessage.mobile">
              <span class="list_span_uid" v-show="userMessage.mobile">手机：</span>
              <span class="list_span_number">{{userMessage.mobile}}</span>
              <span class="list_span_change_password backgrounds" @click="bang_phone" v-show="false">
                        绑定手机号
            </span>
            </li>
            <li class="list" v-show="userMessage.email">
              <span class="list_span_uid">邮箱：</span>
              <span class="list_span_number cal">{{userMessage.email?'已绑定':'未绑定'}}</span>
              <span class="list_span_change_password" v-show="false">
                       绑定邮箱
            </span>
            </li>
          </ul>
        </div>
      </div>
      <!--尾部-->
      <div class="footer">
        <div class="fonntet_conten">
          <div class="fonnter_wrap">
            <span class="span_we">关于我们</span>
            <span class="span_disclaimer" @click="disclaimer">免责声明</span>
          </div>
          <div class="cooyr">
            Copyright © 2017 - 2018 北京知帆科技有限公司 版权所有    京ICP备17074962号
          </div>
        </div>
      </div>
      <!--图层-->
      <div class="coverage" v-show="coveragea">
      </div>
      <div >
        <!--修改密码-->
        <div class="_change_password" v-show="change_password" @click.stop>
          <span class="_passwr">修改密码</span>
          <span class="paaawrad_span">
                <span class="yuan_pass">原密码:</span>
                <span class="qing_pass">（请先验证原密码）</span>
                <span class="cuowutishi" v-show="cuowutishi_1">密码错误</span>
            </span>
          <input type="password" class="pass_input" v-model="passwea" @blur.stop="yuan_passwd">
          <span class="paaawrad_span margin_span">
                <span class="yuan_pass">新密码:</span>
                <span class="qing_pass">（最小长度8字符，含英文大小写和数字）</span>
                <span class="cuowutishi cuowua" v-show="cuowua">密码格式错误</span>
            </span>
          <input type="password" class="pass_input" v-model="xin_pass" @blur.stop="xin_passwd">
          <span class="paaawrad_span margin_span">
                <span class="yuan_pass">确认新密码：</span>
                <span class="cuowutishi cuowua" v-show="pass_buyi">密码不一致</span>
            </span>
          <input type="password" class="pass_input" v-model="buyi_passw" @blur.stop="queren_passwd">
          <button class="buttona"
                  :disabled="!countersign"
                  :style="{background:!countersign?'#E6E6E6':'#00A0E9',color:!countersign?'':'#ffffff'}"
                  @click="querenchock"
          >确认</button>
          <span class="chasss" @click="cha_click"></span>
        </div>
        <!--修改成功-->
        <div class="modify_successfully" v-show="successfully_show"
        >
          修改成功
        </div>
      </div>
      <!--绑定手机号-->
      <div>
        <div class="phone_number" v-show="phone_numbera">
          <span class="bang_phone">绑定手机号</span>
          <span class="import_phone">输入手机号：</span>
          <input type="text" class="phone_input">
          <div class="xiala_phone">
            <span class="phdasd">中国+86</span>
            <span class="paone_img"></span>
          </div>
          <span class="import_phone asone">输入手机号：</span>
          <input type="text" maxlength="4" class="input_yan">
          <span class="import_phone asone">验证码：</span>
          <input type="text" maxlength="4" class="input_yan">
          <button class="butto_phone">确认</button>
          <img src="#" class="img_tupian">
          <span class="huoqu_code">获取验证码</span>
          <span class="svg_gad" @click="svg_gad"></span>
        </div>
      </div>
      <!--<router-view></router-view>-->
    </div>
</template>

<script>

  //userName = userName.substring(0,3)+'****'+userName.substr(userName.length-4,4);


  var rurc = location.host;
  console.log(rurc);
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
  const token = $.getUrlVar('access_token');
  const userName = $.getUrlVar('userName');
  const client_id = $.getUrlVar('client_id');
  console.log(token,userName,client_id)
  //引入ajax
  import ajax from './api/index'

  export default {
    mounted () {
      if(token){
        var that=this
        ajax('get','/security/userInfo/getUserInfo',{
          type :'',
          userEml :userName,
          userPhone :userName
        }, (res)=> {
          if(res.code==='0000'){
            that.userMessage=res.data
            that.userNamea = userName.substring(0,3)+'****'+userName.substr(userName.length-4,4)
          }else{
            window.location.href = 'https://10.0.0.18/?client_id='+client_id+'&'+'tdUrl='+this.rurca+'&';
          }
        },token)
      }else {
        //如果没有token  跳转登入页

      }

    },
    data () {
      return{
        passwea:'' , //初始化原密码
        xin_pass:'' ,//新密码
        buyi_passw:'' ,//密码不一致
        userNamea:userName,
        userMessage:{},
        rurca :rurc,
        phone_postbox : [
          {bound_phone:'绑定手机号',import_phone1_:'输入手机号'},
          {bound_postbox:'绑定邮箱号',import_postbox_:'输入邮箱号'}
        ],    //初始化数据绑定手机和邮箱
        phone_numbera: false,  //显示隐藏绑定邮箱或手机号
        coveragea : false,  //图层
        successfully_show:false, //修改成功  显示隐藏

        //修改密码显示隐藏
        change_password:false,

        cuowutishi_1 : false, //密码错误提示
        cuowua : false, //密码格式错误提示
        pass_buyi : false //密码不一致提示
      }
    },
    computed : {
      //新密码的正则
      right_passwords () {
        return /^\S*([a-zA-Z]+\S*[0-9]+|[0-9]+\S*[a-zA-Z]+)\S*$/.test(this.xin_pass)
      },
      //确定密码
      right_buyi_passw () {
        return /^\S*([a-zA-Z]+\S*[0-9]+|[0-9]+\S*[a-zA-Z]+)\S*$/.test(this.buyi_passw)
      },
      //他们都不为空
      countersign (){
        return Boolean(this.passwea && this.xin_pass && this.buyi_passw);
      },
      ReSetPasswordNotMatch (){
        return Boolean(this.buyi_passw === this.xin_pass)
      }
    },
    methods : {
      //原密码失去焦点
      yuan_passwd(){
        if(!this.passwea){
          this.cuowutishi_1 = true
        }else {
          this.cuowutishi_1 = false
        }
      },
      //新密码失去焦点
      xin_passwd(){
        if(this.xin_pass && this.right_passwords){
          this.cuowua = false
        }else {
          this.cuowua = true
        }

      },
      //确认新密码失去焦点
      queren_passwd(){
        if(this.buyi_passw && this.right_buyi_passw){
          this.pass_buyi = !this.ReSetPasswordNotMatch
        }else{
          this.pass_buyi = true
        }

      },
      //点击差号关闭图层
      cha_click(){
        this.change_password = false
        this.coveragea = false
        this.successfully_show = false
      },
      //点击确认
      querenchock(){
        if(this.cuowua || this.pass_buyi ){
          console.log(2222)
          return;
        }else{
          console.log(1111)
          if(token){
            ajax('get','/security/userInfo/changeUserPwd',{
              newPwd:this.buyi_passw,
              oldPwd :this.passwea,
              userEml :userName,
              userPhone :userName
            }, (res)=> {
              if(res){
                if(res.code==='0000'){
                  this.successfully_show = true;
                  this.change_password = false;
                  setTimeout(()=>{
                    this.successfully_show = false
                    this.coveragea = false
                  },3000)
                  $(document).click(()=> {
                    this.successfully_show = false
                    this.coveragea = false
                    this.change_password = false
                  })
                }else{
                  this.cuowutishi_1 = true
                }
              }
            },token)
          }
        }
      },
      //点击修改成功
      successfully(){

      },
      //点击修改密码
      xiugai_password(){
        this.passwea = ''
        this.xin_pass = ''
        this.buyi_passw = ''
        this.cuowutishi_1 = false
        this.cuowua = false
        this.pass_buyi = false
        this.change_password = true
        this.coveragea = true

      },
      //点击绑定手机号
      bang_phone(){

      },
      //点击绑定叉号事件
      svg_gad(){

      },
      //点击退出按钮
      esca(){
        console.log(localStorage.getItem('access_token'),localStorage.getItem('username'));
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        console.log(localStorage.getItem('access_token'),localStorage.getItem('username'));
        ajax('post','/security/userInfo/logOut',{
        }, (res)=> {
          console.log(res)
          console.log(token)
          if(res.code==='0000'){
            window.location.href = 'https://test.blockdigg.com/auth/?client_id='+client_id+'&'+'tdUrl='+this.rurca+'&';
          }else{
            window.location.href = 'https://test.blockdigg.com/auth/?client_id='+client_id+'&'+'tdUrl='+this.rurca+'&';
          }
        },token)
      },
      //点击免则声明
      disclaimer(){
        window.location.href = 'https://info.chaindigg.cn/announcement'
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../static/headers.css'
@import '../static/bodys.css'
@import '../static/footers.css'
</style>
