import React, { Component } from 'react';
import { Toast } from 'antd-mobile'
import { getCodev, getUserImgCode } from '@/config/mobileApi'
import './index.less';
import checkForm from '@/utils/checkForm';

class VeriCode extends Component {

  constructor (props) {
    super(props);
    this.state = {
      updated: false
    }
    this.second = -1;
  }

  getVeriCode = () => {
    const { captchaId=null, captchaSolution=null } = this.props
    let type = [
      {type: ['phone'], value: this.props.name, msg: '请输入正确的手机号'}
    ]
    if (captchaId !== null) {
      type.push({type: 'veriCode', value: captchaSolution, msg: '请输入正确的图形验证码'})
    }

    if (!checkForm(type)) {
      return
    }
    if(this.props.type){
      if (!this.props.state.address) {
        Toast.info('请选择提币地址！',2,null,false)
        return
      }
      const type = [
        {type: 'tokenAmount', value: this.props.state.amount}
      ]
      if (!checkForm(type)) {
        return
      }
    }
    this.second = 60
    let params = {
      user_name: this.props.name,
      type: this.props.vsCodeType
    }
    
    if (captchaId !== null) {
      // 注册/忘记密码需要输入图形验证码
      params.captcha_id = captchaId
      params.captcha_solution = captchaSolution
    
      getCodev(params).then(res => {
        this.countDown()
        Toast.info('验证码已发送', 2, null, false);
      }).catch(() => {
        this.second = -1;
        this.props.getCodeFail()
      })
    } else {
      // 提币无需图形验证码
      getUserImgCode(params).then(res => {
        this.countDown()
        Toast.info('验证码已发送', 2, null, false);
      }).catch(() => {
        this.second = -1;
      })
    }
  }

  countDown () {
    const downPerSecond = () => {
      this.second --
      this.setState({updated: !this.state.updated})
      if (this.timer !== null) {
        clearTimeout(this.timer)
      }
      if (this.second > 0) {
        this.timer = setTimeout(downPerSecond, 1000)
      }
    }
    downPerSecond()
  }

  render() {
    return (
      <div>
        <button disabled={this.second>0} onClick={()=>{this.getVeriCode()}} className="veri-btn">{this.second > 0?this.second+'S':'获取验证码'}</button>
      </div>
    );
  }
}

export default VeriCode
