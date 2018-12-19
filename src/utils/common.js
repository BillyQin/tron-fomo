import { serverErrorMsg } from '../config'
import { Toast } from 'antd-mobile'
import Config from '@/../config/config';

export const deepCopy = (source, object = this) => {
  const type = typeof source
  if (type === 'object') {
    let obj = []
    if (typeof source.length === 'undefined') {
      obj = {}
    }
    for (let key in source) {
      obj[key] = deepCopy(source[key], object)
    }
    return obj
  } else if (type === 'function') {
    return source.bind(object)
  } else {
    return source
  }
}

export const transAmount = (draw, count) => {
  return (draw/(1+count))
}

export const transCharge = (draw, count) => {
  return (draw*count/(1+count))
}

export const compare = (obj1, obj2) => {
  let result = true
  if (obj1 === null || obj2 === null || obj1 === undefined || obj2 === undefined) {
    return obj1 === obj2
  }
  if (typeof obj1 === 'object' && typeof obj2 === 'object') {
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)
    if (keys1.length !== keys2.length) {
      result = false
    }
    for (let key in obj1) {
      const type = typeof obj1[key]
      if (type === 'object') {
        if (!compare(obj1[key], obj2[key])) {
          result = false
        }
      } else if (type === 'function') {
      } else {
        if (obj1[key] !== obj2[key]) {
          result = false
        }
      }
    }
  } else {
    return obj1 === obj2
  }
  return result
}

export const filterNull = (obj) => {
  let filterObj = {}
  for (let key in obj) {
    if (obj[key] !== null) {
      filterObj[key] = obj[key]
    }
  }
  return filterObj
}

export const transformDate = (fmt) =>{ //author: meizz
  var o = {
    "M+" : new Date().getMonth()+1,                 //月份
    "d+" : new Date().getDate(),                    //日
    "h+" : new Date().getHours(),                   //小时
    "m+" : new Date().getMinutes(),                 //分
    "s+" : new Date().getSeconds(),                 //秒
    "q+" : Math.floor((new Date().getMonth()+3)/3), //季度
    "S"  : new Date().getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (new Date().getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}

//获取滚动条当前的位置
export const getScrollTop = () => {
  var scrollTop = 0;
  if(document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop;
  } else if(document.body) {
      scrollTop = document.body.scrollTop;
  }
  return scrollTop;
}

  //获取当前可视范围的高度
export const getClientHeight = () => {
  let clientHeight = 0;
  if(document.body.clientHeight && document.documentElement.clientHeight) {
      clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
  } else {
      clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
  }
  return clientHeight;
}

  //获取文档完整的高度
export const getScrollHeight = () => {
  var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
  if (document.body) {
　　　　bodyScrollHeight = document.body.scrollHeight;
　　}
　　if(document.documentElement){
    documentScrollHeight = document.documentElement.scrollHeight;
　　}
　　scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
　　return scrollHeight;
}

export const transNum = (number) => {
  return (number || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}
// 若为小数，固定小数位数
export const transFloat = (number=0, digit=2) => {
  if (typeof(number) === 'string') {
    number = Number.parseFloat(number)
  }
  return number.toFixed(digit)
  // console.log(number)
  // return number % 1 === 0 ? Number.parseInt(number) : number.toFixed(digit)
}


export const isWeiXin = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  }
  return false
}

export const responseHandle = (response, message) => {
  if (typeof response === 'string') {
    response = JSON.parse(response)
  }
  if (!response) {
    if (response !== undefined) {
      message.error(serverErrorMsg, 2)
    }
    return Promise.reject(new Error(serverErrorMsg))
  }
  if (response.code === undefined) {
    return Promise.reject(new Error('返回数据格式存在问题,请联系管理员'))
  }
  if (parseInt(response.code) === 0) {
    // times = 0
    if (response.data) {
      return response.data
    } else {
      return response
    } 
    if (window.projectEnv === 'candypc') {
      return response
    }
  } else if (parseInt(response.code) === 401) {
    localStorage.removeItem('userTokenpc');
    localStorage.removeItem('user_name');
    localStorage.removeItem('nick_name');
    localStorage.removeItem('avatar');
    if (window.projectEnv === 'candypc') {
     return ;
    }
    message.error('请重新登录', 2);
    signOut(1000)
    return Promise.reject(new Error('请重新登录'))
  } else if (parseInt(response.code) === 405) {
    message.error('路由不允许访问，请联系开发人员', 2)
    return Promise.reject(new Error('路由不允许访问，请联系开发人员'))
  } else if (parseInt(response.code) === 403) {
    message.error('禁止访问', 2)
    return Promise.reject(new Error('禁止访问'))
  } else if (parseInt(response.code) === 400) {
    message.error('请求参数错误', 2)
    return Promise.reject(new Error('请求参数错误'))
  } else if (parseInt(response.code) === 10012) {
    message.error('该糖果不可重复领取', 2)
    return Promise.reject(new Error('该糖果不可重复领取'))
  } else if (parseInt(response.code) === 10000) {
    message.error('用户名或密码错误', 2)
    return Promise.reject(new Error('用户名或密码错误'))
  } else if (parseInt(response.code) === 10001) {
    message.error('验证码错误', 2)
    return Promise.reject(new Error('验证码错误'))
  } else if (parseInt(response.code) === 10002) {
    message.error('该用户已注册', 2)
    return Promise.reject(new Error('该用户已注册'))
  } else if (parseInt(response.code) === 10003) {
    message.error('用户未注册', 4)
    return Promise.reject(new Error('用户未注册'))
  } else if (parseInt(response.code) === 10004) {
    message.error('用户未实名认证', 2)
    return Promise.reject(new Error('用户未实名认证'))
  } else if (parseInt(response.code) === 10005) {
    message.error('验证码错误', 2)
    return Promise.reject(new Error('验证码错误'))
  } else if (parseInt(response.code) === 10006) {
    message.error('该项目已被创建，请创建其他名字！', 4)
    return Promise.reject(new Error('该项目已被创建，请创建其他名字！'))
  } else if (parseInt(response.code) === 10007) {
    message.error('该糖果已被创建，请创建其他名字！', 4)
    return Promise.reject(new Error('该糖果已被创建，请创建其他名字！'))
  } else if (parseInt(response.code) === 10008) {
    message.error('操作不支持', 4)
    return Promise.reject(new Error('操作不支持！'))
  } else if (parseInt(response.code) === 10009) {
    message.error('文件过大，请选择500K以下的文件！', 4)
    return Promise.reject(new Error('文件过大，请选择500K以下的文件！'))
  } else if (parseInt(response.code) === 10010) {
    message.error('未找到数据！', 4)
    return Promise.reject(new Error('未找到数据！'))
  } else if (parseInt(response.code) === 10011) {
    message.error('糖果余额不足', 2)
    return Promise.reject(new Error('糖果余额不足！'))
  } else if (parseInt(response.code) === 10012) {
    message.error('提取重复', 2)
    return Promise.reject(new Error('提取重复！'))
  } else if (parseInt(response.code) === 10013) {
    message.error('提取糖果超时', 2)
    return Promise.reject(new Error('提取糖果超时！'))
  } else if (parseInt(response.code) === 10014) {
    message.error('对不起，您的账户已被管理员封禁，如需解封，请联系官方客服人员', 2)
    return Promise.reject(new Error('对不起，您的账户已被管理员封禁，如需解封，请联系官方客服人员'))
  } else if (parseInt(response.code) === 10015) {
    message.error('原密码错误，请重新输入！', 4)
    return Promise.reject(new Error('原密码错误，请重新输入'))
  } else if (parseInt(response.code) === 10016) {
    message.error('地址错误，请重新输入', 2)
    return Promise.reject(new Error('地址错误，请重新输入'))
  } else if (parseInt(response.code) === 10017) {
    message.error('superman信息不能修改', 2)
    return Promise.reject(new Error('superman信息不能修改！'))
  } else if (parseInt(response.code) === 10018) {
    message.error('账号已在别的地方登陆，若账号被盗，请尽快联系管理员', 2)
    signOut(1000)
    return Promise.reject(new Error('账号已在别的地方登陆！'))
  } else if (parseInt(response.code) === 10019) {
    message.error('已有重复昵称，请重新输入', 2)
    return Promise.reject(new Error('已有重复昵称，请重新输入'))
  } else if (parseInt(response.code) === 10020||parseInt(response.code) === 10028) {
    message.error('数据逻辑错误', 2)
    return Promise.reject(new Error('该项目未发糖果！'))
  } else if (parseInt(response.code) === 10021) {
    message.error('禁止输入敏感词汇', 2)
    return Promise.reject(new Error('禁止输入敏感词汇'))
  // } else if (parseInt(response.code) === 10022) {
  //   message.error('禁止输入敏感词汇', 2)
  //   return Promise.reject(new Error('禁止输入敏感词汇'))
  } else if (parseInt(response.code) === 10029) {
    message.warn('已经审核过，不能重复操作', 2)
    return response['data']=0
    // return Promise.reject(new Error('已经审核过，不能重复操作'))
  } else if (parseInt(response.code) === 10022) {
    message.error('验证码发送失败', 2)
    return Promise.reject(new Error('验证码发送失败'))
  } else if (parseInt(response.code) === 10023) {
    message.error('交易所名称已存在', 2)
    return Promise.reject(new Error('交易所名称已存在'))
  } else if (parseInt(response.code) === 10025) {
    message.error('获取微信信息失败', 2)
    return Promise.reject(new Error('获取微信信息失败'))
  } else if (parseInt(response.code) === 10026) {
    message.error('身份证信息错误', 2)
    return Promise.reject(new Error('身份证信息错误'))
  }else if (parseInt(response.code) === 10027) {
    message.error('身份证信息已存在', 2)
    return Promise.reject(new Error('身份证信息已存在'))
  } else if (parseInt(response.code) === 10034) {
    Toast.info('该兑换已存在', 2, null, false)
    return Promise.reject(new Error('该兑换已存在'))
  } else if (parseInt(response.code) === 10035) {
    Toast.info('没有足够的糖果扣除', 2, null, false)
    return Promise.reject(new Error('没有足够的糖果扣除'))
  } else if (parseInt(response.code) === 10036) {
    Toast.info('手续费CT不够', 2, null, false)
    return Promise.reject(new Error('手续费CT不够'))
  }else if (parseInt(response.code) === 10039) {
    Toast.info('邀请码错误', 2, null, false)
    return Promise.reject(new Error('邀请码错误'))
  } else if (parseInt(response.code) === 10041) {
    Toast.info('小于可兑换的最小值',2,null,false)
    return Promise.reject(new Error('小于可兑换的最小值'))
  } else if (parseInt(response.code) === 10042) {
    Toast.info('大于允许值',2,null,false)
    return Promise.reject(new Error('大于允许值'))
  } else if (parseInt(response.code) === 10043) {
    Toast.info('不能转让给自己',2,null,false)
    return Promise.reject(new Error('不能转让给自己'))
  }else if (parseInt(response.code) === 40000) {
    Toast.info('参数错误', 2, null, false)
    return Promise.reject(new Error('参数错误！'))
  } else if (parseInt(response.code) === 40801) {
    Toast.info('账号余额不足', 2, null, false)
    return Promise.reject(new Error('账号余额不足'))
  } if (parseInt(response.code) === 10038) {
    Toast.info('不满足提币下限', 2, null, false)
    return Promise.reject(new Error('不满足提币下限'))
  } else {
    message.error(parseInt(response.code) + serverErrorMsg)
    return Promise.reject(new Error(parseInt(response.code) + serverErrorMsg))
  }
  return Promise.reject(new Error(response.errorMsg))
}

export const formatTime = (time, showAll = false) => {
  function format (value) {
    return Number(value) < 10 ? `0${value}` : value
  }

  let year = new Date(time).getFullYear()
  let month = format(new Date(time).getMonth()+1)
  let day = format(new Date(time).getDate())

  let hour = format(new Date(time).getHours())
  let min = format(new Date(time).getMinutes())
  let seconds = format(new Date(time).getSeconds())
  return showAll? `${year}-${month}-${day} ${hour}:${min}:${seconds}`:`${hour}:${min}:${seconds}`

}

export const formatTimeCopy = (time, showAll = true) => {
  function format (value) {
    return Number(value) < 10 ? `0${value}` : value
  }

  let year = new Date(time).getFullYear()
  let month = format(new Date(time).getMonth()+1)
  let day = format(new Date(time).getDate())

  let hour = format(new Date(time).getHours())
  let min = format(new Date(time).getMinutes())
  let seconds = format(new Date(time).getSeconds())
  return showAll? `${year}-${month}-${day} ${hour}:${min}`:`${hour}:${min}:${seconds}`

}

export const formatTimeCopyQuShiFen = (time, showAll = true) => {
  function format (value) {
    return Number(value) < 10 ? `0${value}` : value
  }

  let year = new Date(time).getFullYear()
  let month = format(new Date(time).getMonth()+1)
  let day = format(new Date(time).getDate())

  let hour = format(new Date(time).getHours())
  let min = format(new Date(time).getMinutes())
  let seconds = format(new Date(time).getSeconds())
  return showAll? `${year}-${month}-${day}`:`${hour}:${min}:${seconds}`

}

export const formatTimeCopyQuYear = (time, showAll = true) => {
  function format (value) {
    return Number(value) < 10 ? `0${value}` : value
  }

  let month = format(new Date(time).getMonth()+1)
  let day = format(new Date(time).getDate())

  let hour = format(new Date(time).getHours())
  let min = format(new Date(time).getMinutes())
  let seconds = format(new Date(time).getSeconds())
  return showAll? `${month}-${day} ${hour}:${min}:${seconds}`:`${month}-${day} ${hour}:${min}`

}

export const countDownTime = (time) => {
   var resTime = new Date(time).getTime() - new Date().getTime();   //时间差的毫秒数

    //计算出相差天数
    const days = Math.floor(resTime / (24*3600*1000))

    //计算出小时数
    const leave1= resTime % (24*3600*1000)    //计算天数后剩余的毫秒数
    const hours=Math.floor(leave1/(3600*1000))

    //计算相差分钟数
    const leave2= resTime % (3600*1000)        //计算小时数后剩余的毫秒数
    const minutes=Math.floor(leave2/(60*1000))

    return `${days}天${hours}时${minutes}分`
}

// 分
export const countDownTimeMinutes = (time) => {
  var resTime = new Date(time).getTime() - new Date().getTime();   //时间差的毫秒数

   //计算出相差天数
   const days = Math.floor(resTime / (24*3600*1000))

   //计算出小时数
   const leave1= resTime % (24*3600*1000)    //计算天数后剩余的毫秒数
   const hours=Math.floor(leave1/(3600*1000))

   //计算相差分钟数
   const leave2= resTime % (3600*1000)        //计算小时数后剩余的毫秒数
   const minutes=Math.floor(leave2/(60*1000))

   return `${minutes}`
}

// 时
export const countDownTimeHour = (time) => {
  var resTime = new Date(time).getTime() - new Date().getTime();   //时间差的毫秒数

   //计算出相差天数
   const days = Math.floor(resTime / (24*3600*1000))

   //计算出小时数
   const leave1= resTime % (24*3600*1000)    //计算天数后剩余的毫秒数
   const hours=Math.floor(leave1/(3600*1000))

   //计算相差分钟数
   const leave2= resTime % (3600*1000)        //计算小时数后剩余的毫秒数
   const minutes=Math.floor(leave2/(60*1000))

   return `${hours}`
}

// 天
export const countDownTimeDays = (time) => {
  var resTime = new Date(time).getTime() - new Date().getTime();   //时间差的毫秒数

   //计算出相差天数
   const days = Math.floor(resTime / (24*3600*1000))

   //计算出小时数
   const leave1= resTime % (24*3600*1000)    //计算天数后剩余的毫秒数
   const hours=Math.floor(leave1/(3600*1000))

   //计算相差分钟数
   const leave2= resTime % (3600*1000)        //计算小时数后剩余的毫秒数
   const minutes=Math.floor(leave2/(60*1000))

   return `${days}`
}


export const countDownTimeCopy = (time) => {
  var resTime = new Date(time).getTime() - new Date().getTime();   //时间差的毫秒数

   //计算出相差天数
   const days = Math.floor(resTime / (24*3600*1000))

   //计算出总的小时数
   const allHours = Math.floor(resTime / (3600*1000))
   //计算出小时数
  //  const leave1= resTime % (24*3600*1000)    //计算天数后剩余的毫秒数
  //  const hours=Math.floor(leave1/(3600*1000))

   //计算相差分钟数
   const leave2= resTime % (3600*1000)        //计算小时数后剩余的毫秒数
   const minutes=Math.floor(leave2/(60*1000))

   //计算相差秒数
   const leave3 = resTime % (60*1000)
   const seconds=Math.floor(leave3/1000)

   return `${allHours}:${minutes}:${seconds}`
}

export const getUniqueKey = (arr, type = 'key', key = null, isNumber = false) => {
  if (key === null) {
    if (isNumber) {
      key = 0
    } else {
      key = '0'
    }
  }
  let hasExist = arr.filter((item) => {
    if (item[type] === key) {
      return true
    }
  })
  if (hasExist.length) {
    return getUniqueKey(arr, type, isNumber ? key + 1 : parseInt(key) + 1 + '', isNumber)
  } else {
    return key
  }
}

export const signOut = (time=0) => {
  setTimeout(() => {
    if (window.projectEnv === 'admin') {
      localStorage.removeItem('admin')
      localStorage.removeItem('adminer')
      window.location.href = Config.adminBaseUrl
    }
     if (window.projectEnv === 'mobile') {
      localStorage.removeItem('userToken')
      window.location.href = '/login'
    }
    if (window.projectEnv === 'candypc') {
      localStorage.removeItem('userTokenpc')
      localStorage.setItem('isLogin',false)
    }
    
  }, time)
}

export const userIsLogin = (props, time=0) => {
  if (window.projectEnv === 'mobile' && localStorage.getItem('userToken')) {
    return true
  }
  Toast.info('该功能需要登陆',2)
  setTimeout(()=> {
    props.history ? props.history.push({
      pathname: "/login",
      state: { from: props.location }
    }):
    window.location.href = '/login'
  }, time?time:1000)
  return false
}

export const formatQuery = (query) => {
  if (query.startsWith('?')) {
    const params = {}
    query = query.substring(1, query.length)
    query.split('&').map(item => {
      params[item.split('=')[0]] = item.split('=')[1] || ''
    })
    return params
  } else {
    return {}
  }
}

export const contactUrl = (url, params) => {
  if (typeof(params)!=='object' || !Object.keys(params)) {
    return url
  } 
  url = url.includes('?')? url : `${url}?`
  Object.keys(params).map((item,key) => {
    if (key) {
      url += '&'
    }
    url += `${item}=${params[item]}`
  })
  console.log(url)
  return url
}

export const transArr = (arr,key,type=null) => {
  let list = []
  if (!Array.isArray(arr)) {
    return list
  }
  !type&&arr.map(item=>{
    list[list.length] = item[key]
  })
  type&&arr.map(item=>{
    if(item[type]){
      list[list.length] = item[key]
    }
  })
  return list
}
