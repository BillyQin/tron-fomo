import React, { Component } from 'react';
import { Form, Modal, Input, Button, message } from 'antd';
import { getImgCode, getCodev, register, forgetPassword } from '@/config/mobileApi';

let ref = null
const FormItem = Form.Item
class ForgetPass extends Component {
    constructor(props) {
        super(props)
        this.state = {
          captcha_id:'',
          captcha_data:''
        }
      this.second = -1;
    }
  
    componentWillMount() {
      this.getVeriCode();// 获取图片验证码
    }
  
    getVeriCode = () => {// 点击图片时更换图片验证码
      getImgCode().then(res => {
        this.setState({
          captcha_id: res.captcha_id,
          captcha_data: res.captcha_data
        })
      })
    }
  
    // 获取验证码
    getCode = () => {
      this.second = 60
      this.props.form.validateFieldsAndScroll((err,values)=>{
        if (!err) {
          return;
        }
        console.log(err)
        if (!/^1[0-9]{10}$/.test(values.user_name)) {
          message.error('请输入正确的手机号')
        } else if( !/^[\w]{6,8}$/.test(values.captcha_solution)) {
          message.error('请输入正确的图形验证码')
        } else {
          getCodev({
            captcha_id: this.state.captcha_id,
            captcha_solution:values.captcha_solution,
            type: 2,
            user_name:values.user_name
          }).then(res=>{
              this.countDown()
              if (res.code === 0) {
                  message.success('验证码发送成功，请注意查收！')
              }
          })
        }
      })
    }
  
     // 倒计时
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
  
    // 忘记密码
    handleSubmit = (e) => {
      e.preventDefault();
        this.props.form.validateFieldsAndScroll((err,values)=>{
          if (!err) {
            console.log(values);
            let params = {
              code:values.VsCode,
              password:values.newPass,
              user_name:values.user_name
            }
            forgetPassword(params).then(res=>{
              console.log(res);
              if(res) {
                this.props.history.push('/');
                message.success('修改密码成功！')
                // setTimeout(() => {
                //   window.location.reload();
                // }, 1000);
                this.props.hidePass();
                console.log(res,'forget')
              }
            })
          }
        })
    }
    
    render() {
        const { getFieldDecorator } = this.props.form
        return(
            <div>
              <Form onSubmit={this.handleSubmit} className="formPerple" layout="inline">
                <FormItem label="账号">
                  {getFieldDecorator('user_name', {
                  rules: [{ required: true, message: '请输入手机号' }]
                  })(
                  <Input type="text" placeholder="请输入手机号" />
                  )}
                </FormItem>
                <FormItem label="图形码">
                  {getFieldDecorator('captcha_solution', {
                  rules: [{ required: true, message: '请输入图形验证码' }]
                  })(
                  <Input type="text" className="VsCodeVerificate" placeholder="请输入图形验证码" />
                  )}
                  <img onClick={this.getVeriCode} className="VsCodeImg" src={"data:image/png;base64,"+this.state.captcha_data}  />
                </FormItem>
                <FormItem label="验证码">
                  {getFieldDecorator('VsCode', {
                  rules: [{ required: true, message: '请输入验证码' }]
                  })(
                  <Input type="text" className="VsCodeVerificate" placeholder="请输入验证码" 
                    maxLength="6"
                    onChange={(e) => this.setState({code: e.target.value})}/>
                  )}
                  <button className="CodeButton" style={{color:'#1F88E6'}} disabled={this.second>0 && this.second<60} onClick={()=>{this.getCode()}} >{this.second > 0&&this.second < 60?this.second+'S':'获取验证码'}</button>
                </FormItem>
                <FormItem label="重置密码">
                  {getFieldDecorator('newPass', {
                  rules: [{ required: true, message: '请输入6-16位新密码' }]
                  })(
                  <Input type="password" placeholder="请输入6-16位新密码" />
                  )}
                </FormItem>   
                <div className="certificate">
                  <button>提交</button>
                </div>
              </Form>
            </div>
        )
    }
  
  }
  
  const MyFormForgetPass = Form.create()(ForgetPass)

  export default MyFormForgetPass