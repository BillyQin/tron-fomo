import React, { Component } from 'react'
import '../../assets/css/login.less'
import { loginSuccessPage } from '../../config'
import { Form, Input, Icon, Button} from 'antd'
import { loginRequest, getCode } from '../../utils/request'
import './login.less'
const FormItem = Form.Item

class LoginForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      isLogin: false,
      captcha_id: '',
      captcha_data: ''
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { history } = this.props
    this.props.form.validateFields((err, values) => {
      values.captcha_id = this.state.captcha_id
      if (!err) {
        loginRequest(values).then((data) => {
          if (data) {
            localStorage.setItem('admin', JSON.stringify(data.token))
            localStorage.setItem('adminer', JSON.stringify(data))
            history.push(loginSuccessPage)
          }
        })
      }
    })
    this.getCode()
  }
  getCode = () => {
    getCode().then((data) => {
      if (data) {
        this.setState({
          captcha_id: data.captcha_id,
          captcha_data: data.captcha_data
        })
      } else {
        this.getCode()
      }
    })
  }
  componentWillMount () {
    this.getCode()
  }
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <div className="login-container">
        <div className="head"></div>
        <div className="login-box">
          <h1>糖果管理后台</h1>
          <Form className="login-form" onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('user_name', {
                rules: [
                  {
                    required: true,
                    message: '用户名是必需的'
                  }
                ]
              })(
                <Input size="large" prefix={<Icon type="user" style={{ fontSize: 13 }} size="large"/>} placeholder="用户名" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '密码是必需的'
                  }
                ]
              })(
                <Input size="large" prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
              )}
            </FormItem>
            <FormItem className="captcha">
                {getFieldDecorator('captcha_solution', {
                  rules: [{ required: true, message: '验证码是必需的' }],
                })(
                  <span>
                    <Input size="large" prefix={<Icon type="edit" style={{ fontSize: 13 }} />} type="text" placeholder="验证码" />
                   <img onClick={this.getCode} src={'data:image/png;base64,' + this.state.captcha_data}/>
                  </span>
                )}
            </FormItem>
            <FormItem>
              <Button className="login-btn" size="large" type="primary" htmlType="submit">登录</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
}
const Login = Form.create()(LoginForm)
export default Login
