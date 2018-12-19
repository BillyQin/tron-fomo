import apiUrl from '../config/apiUrl'
import api from './api'

const commonPost = (url, params, options = {}) => {
  return api.post(url, params, options)
}

const commonGet = (url, params, options = {}) => {
  return api.get(url,{params: params}, options)
}

export const loginRequest = (params) => {
  return commonPost(apiUrl.login, params)
}

export const getCode = (params) => {
  return commonPost(apiUrl.getCode, params)
}

export const userList = (params) => {
  return commonPost(apiUrl.userList, params)
}
export const addAgent = (params) => {
  return commonPost(apiUrl.addAgent, params)
}
export const showAgent = (params) => {
  return commonPost(apiUrl.showAgent, params)
}
export const editAgent = (params) => {
  return commonPost(apiUrl.editAgent, params)
}
export const candyDetail = (params) => {
  return commonPost(apiUrl.candyDetail, params)
}
export const itemDetail = (params) => {
  return commonPost(apiUrl.itemDetail, params)
}

export const operateUser = (params) => { // 解封
  return commonPost(apiUrl.operateUser, params)
}
export const commentList = (params) => {
  return commonPost(apiUrl.commentList, params)
}

export const commentDetail = (params) => {
  return commonPost(apiUrl.commentDetail, params)
}
export const comment = (params) => {
  return commonPost(apiUrl.comment, params)
}

export const indifyList = (params) => {
  return commonPost(apiUrl.indifyList, params)
}

export const indifyDetail = (params) => {
  return commonPost(apiUrl.indifyDetail, params)
}
export const indify = (params) => {
  return commonPost(apiUrl.indify, params)
}

export const itemList = (params) => {
  return commonPost(apiUrl.itemList, params)
}

export const itemProgress = (params) => {
  return commonPost(apiUrl.itemProgress, params)
}
export const editItem = (params) => {
  return commonPost(apiUrl.editItem, params)
}

export const addItem = (params) => {
  return commonPost(apiUrl.addItem, params)
}

export const drawList = (params) => {
  return commonPost(apiUrl.drawList, params)
}

export const drawCandy = (params) => {
  return commonPost(apiUrl.drawCandy, params)
}

export const ruleList = (params) => {
  return commonPost(apiUrl.ruleList, params)
}

export const candyProgress = (params) => {
  return commonPost(apiUrl.candyProgress, params)
}

export const candyList = (params) => {
  return commonPost(apiUrl.candyList, params)
}

export const candyHoldList = (params) => {
  return commonPost(apiUrl.candyHoldList, params)
}

export const editCandy = (params) => {
  return commonPost(apiUrl.editCandy, params)
}

export const drawCandyList = (params) => {
  return commonPost(apiUrl.drawCandyList, params)
}

export const addCandy = (params) => {
  return commonPost(apiUrl.addCandy, params)
}

export const addAdmin = (params) => {
  return commonPost(apiUrl.addAdmin, params)
}

export const adminDetail = (params) => {
  return commonPost(apiUrl.adminDetail, params)
}

export const editeAdmin = (params) => {
  return commonPost(apiUrl.editeAdmin, params)
}

export const manageAdmin = (params) => {
  return commonPost(apiUrl.manageAdmin, params)
}

export const operateAdmin = (params) => {
  return commonPost(apiUrl.operateAdmin, params)
}

export const showExchanges = (params) => { // 交易所
  return commonPost(apiUrl.showExchanges, params)
}
export const editExchange = (params) => {
  return commonPost(apiUrl.editExchange, params)
}
export const getExchange = (params) => {
  return commonPost(apiUrl.getExchange, params)
}
export const addExchange = (params) => {
  return commonPost(apiUrl.addExchange, params)
}
export const indifyKyc = (params) => {
  return commonPost(apiUrl.indifyKyc, params)
}
export const upload = (params) => {
  return commonPost(apiUrl.upload, params)
}
export const exchangeAll = (params) => {
  return commonPost(apiUrl.exchangeAll, params)
}
export const exchangeDel = (params) => {
  return commonPost(apiUrl.exchangeDel, params)
}

export const downExcel = (params) => {
  return commonPost(apiUrl.downExcel, params, {responseType: 'arraybuffer'})
}

export const agentList = (params) => { // 代理人
  return commonPost(apiUrl.agentList, params)
}
export const agentEdit = (params) => {
  return commonPost(apiUrl.agentEdit, params)
}
export const agentIndentify = (params) => {
  return commonPost(apiUrl.agentIndentify, params)
}
export const agentDetail = (params) => {
  return commonPost(apiUrl.agentDetail, params)
}
export const agentReject = (params) => {
  return commonPost(apiUrl.agentReject, params)
}
export const agentAdd = (params) => {
  return commonPost(apiUrl.agentAdd, params)
}

export const taskList = (params) => { // 任务
  return commonPost(apiUrl.taskList, params)
}
export const itemNames = (params) => {
  return commonPost(apiUrl.itemNames, params)
}
export const taskFList = (params) => {
  return commonPost(apiUrl.taskFList, params)
}
export const taskEdit = (params) => {
  return commonPost(apiUrl.taskEdit, params)
}
export const taskAdd = (params) => {
  return commonPost(apiUrl.taskAdd, params)
}
export const taskDetail = (params) => {
  return commonPost(apiUrl.taskDetail, params)
}

export const addBg = (params) => { // 背景图管理
  return commonPost(apiUrl.addBg, params)
}
export const showBg = (params) => { // 背景图管理
  return commonPost(apiUrl.showBg, params)
}
export const allBg = (params) => { // 背景图管理
  return commonPost(apiUrl.allBg, params)
}
export const editBg = (params) => { // 背景图管理
  return commonPost(apiUrl.editBg, params)
}
export const bgList = (params) => { // 背景图管理
  return commonPost(apiUrl.bgList, params)
}
export const inviteLists = (params) => { // 邀请人列表
  return commonPost(apiUrl.inviteLists, params)
}
export const inviteDetail = (params) => { // 邀请人详情
  return commonPost(apiUrl.inviteDetail, params)
}

export const ipLists = (params) => { // ip管理列表
  return commonPost(apiUrl.ipLists, params)
}

export const ipProgress = (params) => { // ip解禁/封禁
  return commonPost(apiUrl.ipProgress, params)
}

export const candyLogLists = (params) => { // ip解禁/封禁
  return commonPost(apiUrl.logLists, params)
}

export const garnishemntLists = (params) => { // 糖果增加/扣除列表
  return commonPost(apiUrl.garnishemntLists, params)
}

export const candyGarnishemnt = (params) => { // 糖果增加/扣除操作
  return commonPost('/cms/admin/candy/garnishment', params)
}


export const coverLists = (params) => { // 糖果兑换配置列表
  return commonPost('/cms/admin/convert/list', params)
}

export const coverProgress = (params) => { // 暂停糖果兑换
  return commonPost('/cms/admin/convert/progress', params)
}

export const coverEdit = (params) => { // 编辑兑换
  return commonPost('/cms/admin/convert/edit', params)
}

export const coverDetail = (params) => { // 兑换详情
  return commonPost('/cms/admin/convert/detail', params)
}

export const coverCreate = (params) => { // 添加兑换
  return commonPost('/cms/admin/convert/create', params)
}

export const candyCoverLists = (params) => { // 兑换明细
  return commonPost('/cms/admin/candy/convert/list', params)
}

export const candyCoverAudit = (params) => { // 兑换通过
  return commonPost('/cms/admin/candy/convert/audit', params)
}

export const transformAudit = (params) => { // 糖果转让通过/拒绝
  return commonPost('/cms/admin/candy/transform/audit', params)
}

export const transformLists = (params) => { // 糖果转让列表
  return commonPost('/cms/admin/candy/transform/list', params)
}

export const transformStatus = (params) => { // 糖果转让状态
  return commonPost('/cms/admin/user/transform/status', params)
}

export const candySymbolList = (params) => { // 糖果标志列表
  return commonPost('/cms/admin/candy/symbol/list', params)
}

export const candyStick = (params) => { // 糖果置顶
  return commonPost('/cms/admin/candy/stick', params)
}

export const userCandy = (params) => { // 用户糖果列表
  return commonPost('/cms/admin/user/candy', params)
}

export const adminCandyList = (params) => { // 所有糖果列表
  return commonPost('/cms/admin/candy/list', params)
}

export const adminItemList = (params) => { // 所有项目列表
  return commonPost('/cms/admin/item/name/list', params)
}

// 专属邀请
export const exclusiveLog = (params) => { // log记录
  return commonPost('/cms/admin/exclusive/log/list', params)
}
export const exclusiveCreate = (params) => { // 创建
  return commonPost('/cms/admin/exclusive/create', params)
}
export const exclusiveDetail = (params) => { // 详情
  return commonPost('/cms/admin/exclusive/detail', params)
}
export const exclusiveEdit = (params) => { // 编辑
  return commonPost('/cms/admin/exclusive/edit', params)
}
export const exclusiveList = (params) => { // 列表
  return commonPost('/cms/admin/exclusive/list', params)
}
// 消息列表
export const messageCreate = (params) => { // 创建
  return commonPost('/cms/admin/message/create', params)
}
export const messageDelete = (params) => { // 删除
  return commonPost('/cms/admin/message/delete', params)
}
export const messageDetail = (params) => { // 详情
  return commonPost('/cms/admin/message/detail', params)
}
export const messageEdit = (params) => { // 编辑
  return commonPost('/cms/admin/message/edit', params)
}
export const messageList = (params) => { // 列表
  return commonPost('/cms/admin/message/list', params)
}

// 用户列表下载
export const excelDownload = (params) => {
  return commonPost('/cms/admin/user/list/excel', params)
}

// 糖果记录下载
export const candyLogExcel = (params) => {
  return commonPost('/cms/admin/candy/log/list/excel', params)
}

// 提交交易hash
export const candyExtractApply = (params) => {
  return commonPost('/cms/admin/candy/extract/apply', params)
}

// 强制通过提币
export const candyExtractForceAudit = (params) => {
  return commonPost('/cms/admin/candy/extract/force/audit', params)
}
//游戏资讯列表
export const gameList = (params) => {
  return commonPost(apiUrl.gameList, params)
}
export const addGame = (params) => {
  return commonPost(apiUrl.addGame, params)
}
export const editGame = (params) => {
  return commonPost(apiUrl.editGame, params)
}
export const editSave = (params) => {
  return commonPost(apiUrl.editSave, params)
}
export const deleteGame = (params) => {
  return commonPost(apiUrl.deleteGame, params)
}
export const stickGame = (params) => {
  return commonPost(apiUrl.stickGame, params)
}
//资讯列表
export const newLists = (params) => {
  return commonPost(apiUrl.newLists, params)
}
export const creteNew = (params) => {
  return commonPost(apiUrl.creteNew, params)
}
export const newDetail = (params) => {
  return commonPost(apiUrl.newDetail, params)
}
export const newsSave = (params) => {
  return commonPost(apiUrl.newsSave, params)
}
export const newsDelete = (params) => {
  return commonPost(apiUrl.newsDelete, params)
}
export const newStick = (params) => {
  return commonPost(apiUrl.newStick, params)
}
//banner
export const bannerList = (params) => {
  return commonPost(apiUrl.bannerList, params)
}
export const bannerCrete = (params) => {
  return commonPost(apiUrl.bannerCrete, params)
}
export const bannerEdit = (params) => {
  return commonPost(apiUrl.bannerEdit, params)
}
export const bannerDetail = (params) => {
  return commonPost(apiUrl.bannerDetail, params)
}
export const bannerDelete = (params) => {
  return commonPost(apiUrl.bannerDelete, params)
}
//新增扣除Excel
export const uploadExcle = (params) => {
  return commonPost(apiUrl.uploadExcle, params)
}
export const excelLists = (params) => {
  return commonPost(apiUrl.excelLists, params)
}








