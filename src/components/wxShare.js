
import { weChatShare } from "@/config/mobileApi"

export default function weChatShareCopy(params){
  weChatShare(params).then(res=>{
    //分享给用户的链接中带有邀请码
    let link = res.line_link +"?shareMyself="+localStorage.getItem('shareMyselfInvite')
    wx.config({
      debug: false,
      appId: res.app_id,   // 必填，公众号的唯一标识   由接口返回
      timestamp: res.timestamp, // 必填，生成签名的时间戳 由接口返回
      nonceStr: res.nonce_str,    // 必填，生成签名的随机串 由接口返回
      signature: res.signature,   // 必填，签名 由接口返回
      jsApiList: ['onMenuShareAppMessage'] // 此处填你所用到的方法
    });
    wx.ready(function(){
      wx.checkJsApi({
        jsApiList: [
          'checkJsApi',
          // 'openLocation',
          // 'getLocation',
          'onMenuShareAppMessage'
        ],
        success: function (res) {
          console.log('成功');
        }
      });
      wx.onMenuShareAppMessage({
        title:  res.share_title,       // 分享标题
        desc: res.desc_content,   // 分享描述      
        link: link,       // 分享链接 默认以当前链接
        imgUrl: res.img_url,// 分享图标
        // 用户确认分享后执行的回调函数
        triger: function () {
          // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
          console.log('用户点击发送给朋友');
        },
        success: function () {
          
          console.log("分享成功")
        },
        // 用户取消分享后执行的回调函数
        cancel: function () {
          console.log('分享到朋友取消');
        },
        fail: function (res) {
          console.log('失败');
        }
      });
      
    });
    wx.error(function(res){
      console.log("error")
      // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也
      // 可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    });
  })
}