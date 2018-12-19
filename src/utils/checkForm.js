import { Toast } from 'antd-mobile';

const check = {
  email: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
  veriCode: /^[\w]{6,8}$/,
  nickName: /^[^\s]{2,12}$/,
  password: /^[\s\S]{6,16}$/,
  IDCard: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
  name: /^[\s\S]{1,20}$/,
  phone: /^1[0-9]{10}$/,
  tokenAmount: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/,
  wxName:/^[a-z_\d]+$/
}

const alertMsg = {
  email: {title:'', msg: '请输入正确的邮箱地址'},
  veriCode: {title:'', msg: '请输入正确的验证码'},
  password: {title:'', msg: '请输入6-16位字符的密码'},
  nickName: {title:'', msg: '请输入2-12位非特殊字符的昵称'},
  repeat: {title:'', msg: '两次输入的密码不一致'},
  IDCard: {title:'', msg: '请输入正确的身份证号码'},
  name: {title:'', msg: '请输入正确的姓名'},
  phone: {title: '', msg: '请输入正确的手机号'},
  tokenAmount: {title: '', msg: '请输入正确的Token数量'},
  wxName:  {title: '', msg: '请输入正确的微信号'}
}

function checkInput(value, type) {
  return check[type].test(value)
}

function getAlertMsg(type) {
  return alertMsg[type]
}

export default function checkForm(type={}) {
  let password = ''
  let content = null
  for (let item of type) {
    content = null
    if (typeof item.type === 'string') {
      switch (item.type) {
        case 'repeat':
          if (password !== item.value) {
            content = getAlertMsg(item.type)
            password = ''
          }
          break
        case 'password':
          password = item.value
        default: if (!checkInput(item.value, item.type)) {
          content = getAlertMsg(item.type)
        }
      }
      if (content) {
        Toast.info(item.msg || content.msg, 2, null, false);
        return false
      }
    } else if (Array.isArray(item.type) && item.type.length > 0) {
      content = false
      for (let i = 0, len = item.type.length; i < len; i++) {
        if (checkInput(item.value, item.type[i])) {
          content = true
          break;
        }
      }
      if (!content) {
        Toast.info(item.msg || '输入有误，请重新输入', 2, null, false);
        return false
      }
    } else {
      return false
    }
  }
  return true
}
