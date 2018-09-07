/**
 *  @data post或get参数
 *  @url如果接口域名不变的话，可以直接用路径
 *  @success 成功回调
 *  @fail 失败回调
 *  @type='post' 默认post
 * */

 export default function ajax(type,url,data,success,token,fail){

  //基础路径配置
  var defaultDomain = 'https://info.blockdigg.com/authinterface/';

  //统一处理错误
  fail = typeof fail === 'function' ? fail : function(res){

  };

  //参数配置过滤
  type = (type==null || type==="" || typeof(type)==="undefined")? "post" : type
  data = (data==null || data==="" || typeof(data)==="undefined")? {"date": new Date().getTime()} : data

  //ajax统一发送的函数
  $.ajax({
    // 参数设置
    type: type || 'post',//请求类型
    url: defaultDomain + url,//地址url拼接
    dataType: 'json',//期望返回的数据类型
    timeout: 5000,//超时处理
    async:true,//默认异步
    cache: false,//默认不缓存
    data:data,//data设置为对象
    contentType: 'application/x-www-form-urlencoded',
    beforeSend: function(request) {
      request.setRequestHeader("Access-Control-Allow-Origin", "*");   //token值携带--key value
    },
    success: (res)=>{
      success(res) //直接在页面中调取success
    },
    error:fail
  });
}
//    beforeSend: function(request) {
//       request.setRequestHeader("access_token", token||'');   //token值携带--key value
//     },

