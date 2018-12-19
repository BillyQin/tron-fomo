import React, { Component } from 'react';
import { Form, Modal, Input, Button, message } from 'antd';
import { getImgCode, login, userCenter } from '@/config/mobileApi';

let ref = null
const FormItem = Form.Item
class LoginAccount extends Component {
    constructor(props) {
        super(props)
        this.state = {
          isShow:false,
          getImgCode:'',
          captcha_id:'',
          captcha_data:'',
          centers:''
        }
    }

    componentWillMount() {
      this.getImgCode();// 获取图形验证码
    }

    getVeriCode = () => {// 点击图片时更换图片验证码
      this.props.form.validateFieldsAndScroll((err,values)=>{
        getImgCode().then(res => {
          this.setState({
            captcha_id: res.captcha_id,
            captcha_data: res.captcha_data,
          })
          this.props.form.setFieldsValue({   // 动态改变表单值 手动设置为空。
            captcha_solution: ''
          })
        })
      })
    }


    //密码的显示与隐藏
    openEyes = () => {
      if(this.state.isShow){
        this.setState({isShow:false})
      }else{
        this.setState({isShow:true})
      }
    }

    // 获取图形验证码(登录)
    getImgCode = () =>  {
      let params = {}
      getImgCode(params).then(res=>{
        this.setState({
          getImgCode:res,
          captcha_id:res.captcha_id,
          captcha_data:res.captcha_data
        })
        // console.log(res,'res')
      })
    }

    // 个人中心 
   getUserInfo = () => {
    userCenter().then(res=>{
      localStorage.setItem('user_name',res.account)
      localStorage.setItem('nick_name',res.nickname)
      localStorage.setItem('avatar',res.avatar)
      this.setState({
        centers:res
      })
    })
  }

    // 提交(登录) 
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err,values)=>{
        if (!err) {
          let params = {
            captcha_id:this.state.captcha_id,
            captcha_solution:values.captcha_solution,
            explorer_type:1,
            password:values.password,
            user_name:values.user_name
          }
          login(params).then(res=>{
            localStorage.setItem('userTokenpc', res)
            if(res) {
              this.getUserInfo();// 个人中心
              this.props.history.push('/');
              message.success('登录成功！')
              localStorage.setItem('isLogin',true);
              setTimeout(() => {
                window.location.reload();
              }, 1000);
              console.log(res,'login')
            }
          }).catch(e => {
            this.getVeriCode()
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
                        <Input placeholder="请输入手机号" />
                        )}
                    </FormItem>
                    <FormItem className="mima" label="密码">
                        {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入6-16位密码' }]
                        })(
                          this.state.isShow?<Input placeholder="请输入6-16位密码" type="text"/>:<Input placeholder="请输入6-16位密码" type="password"/>
                        )}
                        {this.state.isShow?<img src="https://candytownoss.oss-cn-hangzhou.aliyuncs.com/candytown/eye_open.png" onClick={()=>this.openEyes()} />:<img src="https://candytownoss.oss-cn-hangzhou.aliyuncs.com/candytown/eye_close.png" onClick={()=>this.openEyes()} />}
                    </FormItem>
                    <FormItem label="验证码">
                        {getFieldDecorator('captcha_solution', {
                        rules: [{ required: true, message: '请输入图形验证码' }]
                        })(
                        <Input className="VsCodeVerificate" placeholder="请输入图形验证码" />
                        )}
                        <img onClick={this.getVeriCode} className="VsCodeImg" src={"data:image/png;base64,"+this.state.captcha_data} />
                    </FormItem>
                    <FormItem className="registerLastChild">
                        <Button  className="buttonSubmit loginsButton" type="primary" htmlType="submit" style={{width: '100%',height:'46px',border:'none',marginLeft:'100px',background:'linear-gradient(to left, rgb(254,154,139), rgb(253,134,140), rgb(249,116,143), rgb(247,140,160))'}} ref='formBtn'>登录</Button>
                    </FormItem>
                    <div className="registerText" >
                          <a onClick={this.props.childModalPass} className="forgetPass">忘记密码？</a>
                    </div>
                </Form>
            </div>
        )
    }

}
const MyFormLogin = Form.create()(LoginAccount)

export default MyFormLogin