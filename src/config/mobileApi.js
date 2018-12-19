import api from '@/utils/api'

const commonPost = (url, params, options = {}) => {
  return api.post(url, params, options)
}

export const commonGet = (url, params={}, options = {}) => {
  return api.get(url, params, options)
}

// 糖果小镇列表
export const candyList = (params) => {
  return commonPost('/ims/item/candy/list', params)
}

// 糖果详情
export const candyDetail = (params) => {
  return commonPost('/ims/item/candy/detail', params)
}

export const itemList = (params) => {
  return commonPost('/ims/item/list', params)
}
export const itemDetail = (params) => {
  return commonPost('/ims/item/detail', params)
}
export const trendList = (params) => {
  return commonPost('/ims/item/trend/list', params)
}
export const communityDetail = (params) => {
  return commonPost('/ims/item/community/detail', params)
}
export const communityList = (params) => {
  return commonPost('/ims/item/community/list', params)
}

// 提币地址管理列表
export const walletList = (params) => {
  return commonPost('/ims/user/wallet/address/list', params)
}
export const addAddress = (params) => {
  return commonPost('/ims/user/wallet/address/add', params)
}

// 登陆
export const login = (params) => {
  return commonPost('/ims/login', params)
}

// 注册
export const register = (params) => {
  return commonPost('/ims/register', params)
}

// 忘记密码
export const forgetPassword = (params) => {
  return commonPost('/ims/forget/password', params)
}
export const updateName = (params) => {
  return commonPost('/ims/user/reset/nickname', params)
}

// 获取图片验证码
export const getImgCode = (params) => {
  return commonPost('/ims/captcha', params)
}

// 获取提币图片验证码
export const getUserImgCode = (params) => {
  return commonPost('/ims/user/codev', params)
}

// 获取验证码
export const getCodev = (params) => {
  return commonPost('/ims/codev', params)
}

// 用户糖果列表
export const userCandyList = (params) => {
  return commonPost('/ims/user/candy/list', params)
}

// 用户糖果详情
export const userCandyDetail = (params) => {
  return commonPost('/ims/user/candy/detail', params)
}

// 领取糖果
export const drawCandy = (params) => {
  return commonPost('/ims/user/draw/candy', params)
}

// 糖果提取记录
export const drawCandyList = (params) => {
  return commonPost('/ims/user/candy/log/extract/list', params)
}

export const drawCandyDetail = (params) => {
  return commonPost('/ims/user/candy/log/detail', params)
}

// 个人中心
export const userCenter = (params) => {
  return commonPost('/ims/user/center', params)
}

// 个人认证
export const authentication = (params) => {
  return commonPost('/ims/user/kyc/authentication', params)
}

// 个人认证详情
export const authDetail = (params) => {
  return commonPost('/ims/user/kyc/authentication/detail', params)
}

//消息留言
export const createMsg = (params) => {
  return commonPost('/ims/user/item/trend/create', params)
}

//邀请规则
export const shareDetail = (params) => {
  return commonPost('/ims/item/share/detail', params)
}

// 邀请码
export const shareCode = (params) => {
  return commonPost('/ims/user/share/code', params)
}

// 糖果标志列表
export const candySymbolList = (params) => {
  return commonPost('/ims/user/candy/symbol/list', params)
}

// 提币地址列表
export const addressLists = (params) => {
  return commonPost('/ims/user/wallet/address/list', params)
}
export const deleteAddress = (params) => {
  return commonPost('/ims/user/wallet/address/delete', params)
}
export const editAddress = (params) => {
  return commonPost('/ims/user/wallet/address/edit', params)
}
export const showAddress = (params) => {
  return commonPost('/ims/user/wallet/address/detail', params)
}

// 用户糖果全部记录
export const candyLogList = (params) => {
  return commonPost('/ims/user/candy/log/list', params)
}

// 总糖果价值
export const candyStatic = (params) => {
  return commonPost('/ims/user/candy/static', params)
}

// 获取社群列表
export const communGroup = (params) => {
  return commonPost('/ims/item/community/detail', params)
}

//获取官方社群
export const officalCommun = (params) => {
  return commonPost('/ims/item/community', params)
}

// 提取糖果
export const extractCandy = (params) => {
  return commonPost('/ims/user/extract/candy', params)
}

// 修改密码
export const resetPassword = (params) => {
  return commonPost('/ims/user/reset/password', params)
}


// 马上交易
export const comingTrade = (params) => {
  return commonPost('/ims/exchange/recomand/list', params)
}

// 已上平台
export const upperForm = (params) => {
  return commonPost('/ims/item/exchange/list', params)
}

//获取微信appid  /ims/weixin/app/id
export const getAppid = (params) => {
  return commonPost('/ims/weixin/app/id', params)
}

//微信登陆
export const weixinLogin = (params) => {
  return commonPost('/ims/weixin/check', params)
}

//所有任务列表
export const taskList = () => {
  return commonPost('/ims/task/list')
}

//项目任务列表
export const projecttaskList = (params) => {
  return commonPost('/ims/item/task/list', params)
}


//项目任务详情
export const taskDetail = (params) => {
  return commonPost('/ims/task/detail', params)
}

//项目任务微信加群
export const taskAddWx = (params) => {
  return commonPost('/ims/user/task', params)
}

//我的邀请

export const myInvite = (params) => {
  return commonPost('/ims/user/invite/detail', params)
}

//我的邀请 代理人申请

export const userApplyAgent = (params) => {
  return commonPost('/ims/user/agent/authentication', params)
}


//项目邀请详情

export const projectInviteDetail = (params) => {
  return commonPost('/ims/user/invite/item/detail', params)
}

//微信分享

export const weChatShare = (params) => {
  return commonPost('/ims/weixin/share', params)
}

//我的专属邀请分享码

export const mySelfInviteCode = (params) => {
  return commonPost('/ims/user/exclusive/share/code', params)
}

//我的专属邀请领取糖果

export const mySelfInviteCandy = (params) => {
  return commonPost('/ims/user/exclusive/draw/candy', params)
}


//我的专属邀请列表

export const mySelfInviteList = (params) => {
  return commonPost('/ims/user/exclusive/share/list', params)
}

//消息中心 消息列表

export const messageList = (params) => {
  return commonPost('/ims/user/message/list', params)
}

//消息中心 消息详情

export const messageDetail = (params) => {
  return commonPost('/ims/user/message/detail', params)
}
//兑换糖果

export const exchangeCandy = (params) => {
  return commonPost('/ims/user/convert/candy', params)
}

//兑换记录

export const exchangeCandyRecords = (params) => {
  return commonPost('/ims/user/candy/log/convert/list', params)
}

//转让记录

export const candyTransferRecords = (params) => {
  return commonPost('/ims/user/candy/log/transform/list', params)
}

//用户转让状态查询

export const TransferState = (params) => {
  return commonPost('/ims/user/transform/status/check', params)
}

//转让糖果(提交转让按钮)

export const TransferCandyButton = (params) => {
  return commonPost('/ims/user/transform/candy', params)
}


// 游戏资讯中心

export const gameInfoCenter = (params) => {
  return commonPost('/ims/game/info/list', params)
}

// Banner

export const bannerList = (params) => {
  return commonPost('/ims/banner/list', params)
}

// 资讯列表

export const infoList = (params) => {
  return commonPost('/ims/information/list', params)
}

// 资讯详情


export const infoDetails = (params) => {
  return commonPost('/ims/information/detail', params)
}
