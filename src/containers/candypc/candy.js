import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './candy.less';
import { Form, Modal, Input, Icon, Button, message } from 'antd';
import HomePage from './home/home';
import Assignment from './assignment/assignment';
import Information from './information/information';
import MinePage from './mine/mine';
import DetailPage from './home/detail/project';
import HelpCenter from './home/helpCenter/helpCenter';
import Partner from './home/partner/partner';
import Welcome from './home/welcome/welcome';
import checkForm from '@/utils/checkForm';
import { getImgCode, getCodev, login, register, userCenter, forgetPassword } from '@/config/mobileApi';

import MyFormLogin from '@/components/loginpc';
import MyFormForgetPass from '@/components/forgetpasspc';

//注册账号弹框
let ref = null
const FormItem = Form.Item
class RegisterAccount extends Component {
  constructor(props) {
      super(props)
      this.state = {
        isShow:false,
        getImgCode:'',
        captcha_id:'',
        captcha_data:'',
        code:'',
        iphone:'',
        password:'',
        NickNames:''
      }
      this.second = -1;
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

    // 获取图形验证码(注册)
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
            type: 1,
            user_name:values.user_name
          }).then(res=>{
            console.log(res)
              this.countDown()
              if (res.code === 0) {
                  message.success('验证码发送成功，请注意查收！')
              }
          }).catch(e => {
            this.getVeriCode()
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

    // 失去焦点
    inputOnBlur1 = () => {
      console.log(this.state.iphone)
      // 验证手机号
      var reg = /^1[0-9]{10}$/ || '';
      if (!reg.test(this.state.iphone)) {
        message.error('请输入正确的手机号!');
        return ;
      } 
      console.log('inputOnBlur')
    }

    inputOnBlur2 = () => {
      console.log(this.state.code)
      // 验证验证码
      var reg1 = /^[\w]{6,8}$/ || '';
      if (!reg1.test(this.state.code)) {
        message.error('请输入正确的验证码！');
        return ;
      }
    }

    inputOnBlur3 = () => {
        console.log(this.state.password)
      // 验证密码
      if (this.state.password.length < 6 || this.state.password.length > 20) {
        message.error('请输入6-16位字符的密码!');
        return ;
      }
    }
    
    inputOnBlur4 = () => {
      // 验证昵称是否为空
      if (this.state.NickNames == '') {
        message.error('请输入昵称！');
        return ;
      }
    }

    // 获取焦点
    inputOnFocus = ()=> {
      console.log('inputOnFocus')
    }

    // 提交(注册)
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let params = {
              code: values.VsCode,
              nickname: values.nick_name,
              password: values.password,
              user_name: values.user_name
            }
          register(params).then(res=>{
            localStorage.setItem('userTokenpc', res)
            console.log(res,'register')
            if (res) {
              this.props.hideModal();
            }
          })
          console.log('Received values of form: ', values);
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
                        <Input placeholder="请输入手机号" 
                          onBlur={this.inputOnBlur1 }
                          onFocus={this.inputOnFocus1 }
                          onChange={(e)=>this.setState({iphone:e.target.value})}
                          maxLength="11"
                        />
                        )}
                    </FormItem>
                    <FormItem label="图形码">
                        {getFieldDecorator('captcha_solution', {
                        rules: [{ required: true, message: '请输入图形验证码' }]
                        })(
                        <Input className="VsCodeVerificate" maxLength="6" placeholder="请输入图形验证码" />
                        )}
                        <img onClick={this.getVeriCode} className="VsCodeImg" src={"data:image/png;base64,"+this.state.captcha_data} />
                    </FormItem>
                    <FormItem label="验证码">
                        {getFieldDecorator('VsCode', {
                        rules: [{ required: true, message: '请输入验证码' }]
                        })(
                        <Input className="VsCodeVerificate" placeholder="请输入验证码" 
                          onBlur={this.inputOnBlur2 } 
                          onFocus={this.inputOnFocus2 }  
                          maxLength="6"
                          onChange={(e) => this.setState({code: e.target.value})}/>
                        )}
                        <button className="CodeButton" style={{color:'#1F88E6'}} disabled={this.second>0 && this.second<60} onClick={()=>{this.getCode()}} >{this.second > 0&&this.second < 60?this.second+'S':'获取验证码'}</button>
                    </FormItem>
                    <FormItem className="mima" label="密码">
                        {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入6-16位密码' }]
                        })(
                          <Input placeholder="请输入6-16位密码" type={ this.state.isShow ? "text" : "password"} 
                            onBlur={this.inputOnBlur3 } 
                            onFocus={this.inputOnFocus3 }
                            maxLength="16" 
                            onChange={(e)=>this.setState({password:e.target.value})}/>
                        )}
                        {
                          this.state.isShow?<img src="https://candytownoss.oss-cn-hangzhou.aliyuncs.com/candytown/eye_open.png" onClick={()=>this.openEyes()} />:<img src="https://candytownoss.oss-cn-hangzhou.aliyuncs.com/candytown/eye_close.png" onClick={()=>this.openEyes()} />
                        }
                    </FormItem>
                    <FormItem label="昵称">
                        {getFieldDecorator('nick_name', {
                        rules: [{ required: true, message: '请输入昵称' }]
                        })(
                        <Input placeholder="请输入昵称" 
                          onBlur={this.inputOnBlur4 } 
                          onFocus={this.inputOnFocus4 } 
                          onChange={(e)=>this.setState({NickNames:e.target.value})}
                        />
                        )}
                    </FormItem>
                    <FormItem label="邀请码">
                        {getFieldDecorator('invite_code', {
                        rules: [{ required: false, message: '请输入邀请码(可不填)' }]
                        })(
                        <Input placeholder="请输入邀请码(可不填)" />
                        )}
                    </FormItem>
                    <FormItem className="registerLastChild">
                        <Button className="buttonSubmit" type="primary" htmlType="submit" style={{width: '100%',height:'46px',border:'none',marginLeft:'100px',background:'linear-gradient(to left, rgb(254,154,139), rgb(253,134,140), rgb(249,116,143), rgb(247,140,160))'}} ref='formBtn'>注册</Button>
                    </FormItem>
                    <div className="registerText">
                        注册即表示同意<a onClick={this.props.hideChild1}>《注册协议》</a>和<a onClick={this.props.hideChild2}>《隐私权政策》</a>  
                    </div>
                </Form>
            </div>
        )
    }

}

const MyForm = Form.create()(RegisterAccount)

// 注册协议
class Agreement extends Component {
  
  render() {
      const { getFieldDecorator } = this.props.form
      return(
          <div>
            <p style={{background:'#fff',fontSize:'18px',marginTop:'-25px'}}>
            重要提示：
            杭州万塔科技有限公司（以下简称“本公司”）通过旗下运营管理的糖果小镇平台(www.candytown.io)（以下简称“本网站”）依据本协议的规定向本公司的用户（以下简称“您或用户”）提供信息咨询与管理服务。本协议在您和本公司之间具有合同法上的法律效力。为保障您的合法权益，请您在通过本网站注册成为网站用户时，务必仔细阅读以下条款并完全理解本协议的全部内容，特别是其中所涉及的免除及限制本公司责任的条款，对用户权利限制的条款。请您审慎阅读并选择接受或不接受本协议。
          若您一旦注册，即视为您已不加修改地无条件完全接受本协议所包含的内容和本公司通过本网站已经发布的或将来可能发布的各类规则。各类规则为协议不可分割的一部分，与本协议具有同等法律效力。本协议是由您与本公司共同签订的，适用于您在本网站的全部行为。如您不接受本协议的任一条款，请您立即停止注册或主动停止使用本公司的服务。
          本公司有权根据法律的规定及业务发展的需要不时地制定、修改本协议或各类规则，如本协议及规则有任何变更，一切变更以本网站最新公布的为准。经修订的协议、规则一经在本网站公布，即自动生效或在该等协议、规则指定的时间生效。您应不时地注意本协议及附属规则地变更，若您不同意相关变更，本公司有权不经任何告知终止、中止本协议或限制您使用本网站的全部或部分功能且不承担任何法律责任，或您主动停止使用本网站的服务。但该终止、中止或限制行为并不能豁免您通过本网站已经进行的交易下所应承担的义务。本协议的约定不涉及您与本网站的其他用户之间因网上交易而产生的法律关系及法律纠纷。

          本协议包括以下内容：
          第一条	用户注册
          第二条	用户须知
          第三条	用户的陈述及保证
          第四条	服务内容和费用的收取
          第五条	通知
          第六条	用户信息的维护及使用
          第七条	用户注销或限制访问、服务协议的中止或终止
          第八条	免责声明 
          第九条	知识产权保护
          第十条	保密协定
          第十一条 赔偿责任
          第十二条 使用法律和管辖
          第十三条 税收
          第十四条 继承或赠与
          第十五条 投诉与咨询
          第十六条 其他
          第一条 用户注册
          1.1 您通过PC端、移动端等登陆“糖果小镇平台”网站进入注册程序。
          1.2点击确认“我已经阅读并且同意” 糖果小镇平台网站注册服务协议前的方框。
          1.3 按照本网站发布的规定填写注册用户账户，手机号码及密码等信息，通过手机验证，确认后即成为本公司的用户。
          1.4根据《中华人民共和国合同法》等相关法律、法规，如您通过进入注册程序并按照本网站规定的注册程序成功注册为用户，即表示您同意并签署了本协议，自愿接受本协议；此后，您不得以未阅读本协议内容作任何形式的抗辩，也不得以未签署书面协议为由否认本协议的效力。
    第二条 用户须知
2.1本网站的用户分为自然人用户和项目方用户，本公司仅接受符合以下任一条件的一般自然人或项目方自然人或法人成为本网站用户：
（1）持有中国（包括港澳台地区）有效身份证件的18周岁以上的具有完全民事行为能力的自然人；
（2）在中国（包括港澳台地区）合法注册的项目方法人。
2.2 未成年人（年龄18周岁以下人士）、限制行为能力人、中国（包括港澳台地区）以外地区自然人及项目方法人无资格注册成为本网站用户，本网站要求未成年人、限制行为能力人、中国（包括港澳台地区）以外地区的自然人及项目方法人不要向本网站提交任何注册资料。
如您不符合资格，请勿注册，否则本公司保留随时中止或终止您用户资格的权利。您在此向本公司保证，您已符合上述关于年龄和国籍的条件，如因您通过本网站提供虚假信息或承诺而导致本公司蒙受任何损失，您将承担全部责任并赔偿相关损失。
2.3 您注册成功后，不得将本网站的用户账户转让给第三方使用。您确认，您使用在本网站注册和设置的用户账户和密码登录本网站后在本网站的一切行为均代表您自身做出的行为并由您承担相应的法律后果。任何利用您的用户账户及密码登陆本网站并从事咨询、交易等行为均将被视为您的行为。因此，您有义务谨慎妥善的保管您的用户账户及密码。本公司对您的用户账户和密码的遗失或被盗取所产生的后果不承担任何责任。
2.4在本网站消费需订立的合同均采用电子合同方式。用户使用用户账户登录本网站后，以用户账户用户名在本网站通过点击确认或类似方式签署的电子合同即视为用户真实意愿并以用户本人名义签署的合同，具有法律效力。用户应妥善保管自己的账户密码等账户信息，通过前述方式订立的电子合同对合同各方具有法律约束力，用户不得以其账户密码等账户信息被盗用或其他理由否认已订立的合同的效力或不按照该等合同履行相关义务。
2.5您有义务在注册时提供真实资料，并保证诸如电子邮件地址、联系电话、联系地址等内容的有效性及安全性。如您因网上交易与其他用户产生诉讼的，其他用户有权通过司法部门要求本公司提供相关资料。
2.6您如变更账户信息、通讯地址、电话等相关重要信息，须及时通过本网将通知本公司。因您未及时通知而导致自身受到的一切损失，由您自行承担责任。
第三条 用户陈述与保证
3.1 本网站用户应保证严格遵守中国现行法律、法规、政府规章及其他应该遵守的规范性文件，不通过本网站从事危害国家安全、洗钱、套现、传销等任何违法活动或其他有违社会公共利益或公共道德的行为。
3.2 您确认在签署本协议前已阅读包括但不限于以下与本协议及相关协议的订立及履行有关的风险提示，包括政策风险、信用风险、不可抗力风险等，并对该等风险有充分理解和预期，您自愿承担该等风险可能给带来的一切责任和损失和责任。 
3.3 您承诺合法使用本网站提供的服务及网站内容。禁止通过本网站从事任何可能违反中华人民共和国现行法律、法规、规章和政府规范性文件的行为，禁止任何未经授权使用本网站的行为，如擅自进入本网站的未公开的系统、不正当的使用密码和网站的任何内容、窃取他人的账号和密码、窃取他人的个人隐私信息等。
3.4您承诺将依据本协议和本网张发布的规则查阅、保存和使用电子合同，不得擅自修改电子合同，不得私自仿制、伪造签订的电子合同或印章，不得用伪造的合同进行招摇撞骗或进行其他非法使用，否则由您自行承担责任。
3.5您承诺您在本网站发布的内容拥有合法权利。您在本网站发布的内容不侵犯任何第三人的肖像权、隐私权、著作权、商标权、专利权或者其它合法权利。否则因此给本公司或任何第三方造成的一切损失均由您自行承当赔偿责任。
3.6 您承诺未经本公司同意，将不得对本网站的任何部分或全部以及通过本网站取得的任何形式的信息，进行复制、拷贝、出售、转售或用于任何其它商业目的。
第四条 服务内容及费用收取
4.1本网站的用户分为项目方和信息咨询者两种，本公司通过本网站提供信息咨询与管理服务，其中本公司通过PC端、移动端的“糖果小镇平台”网站向用户（包括项目方和信息咨询者）提供以下核心服务：
 （1）项目信息发布
本公司接受项目方用户的委托在“糖果小镇平台”网站上发布项目信息，包括但不限于项目方主体情况、项目介绍、项目评论等信息。项目方在本网站上发布项目信息的，应先通过本公司的尽职调查、审核等风险控制措施后方可在本网站上发布。
（2）信息咨询服务
投资者用户可以在本网站上浏览公告、项目介绍、项目评论等网站开放信息，同时还可以依据本网站提供的服务和相关规则参与自己感兴趣的项目的探讨、询问等事宜。
  （3）其他相关服务
3.2您可以根据实际需要通过本公司的PC端、移动端的“糖果小镇平台”网站获得您需要的服务。本公司可以暂时停止、限制或改变本公司通过本网站提供的部分服务内容，或提供新的服务内容。
3.3用户在接受本网站各项服务的同时，同意自动接受本公司提供的各类信息服务。用户在此授权本公司可以向其电子邮件、手机等发送商业信息。用户有权选择不接受本公司提供的各类信息服务，用户应自行通过本网站的相关页面进行更改。 
3.4本公司就向您提供的服务是否收取服务费及具体标准和规则由本公司与您另行签署其他协议，或以本网站公布的规则确定。
3.5用户在下载或浏览本网站时，必须自行准备相关设备并承担如下开支：
（1）包括并不限于手机等上网装置购置费；
（2）包括并不限于手机流量费等上网费用。
3.6为防止他人冒用您的身份注册、使用本公司的服务，本公司可能会给您的手机发送短信进行验证，由此产生的短信费用由本公司支付，用户不需支付任何费用。
第五条 通知
5.1 本协议项下的通知以公示方式作出，一经在本网站公示即视为已经送达。除此，其他向您个人发布的具有专属性的通知，本公司向您在注册时提供的电子邮箱，或在您的个人账户中为您设置的站内消息系统栏，或您在注册时提供的手机发送，一经发送即视为已经送达。您须密切关注您的电子邮箱 、站内消息系统栏中的邮件、信息及手机中的短信。
5.2 您同意本公司出于向您提供服务之目的，可以向您的电子邮箱、站内消息系统栏和手机发送有关通知或提醒。若您设置不接收有关通知或提醒，则您有可能无法接受该等通知信息，您不得以您未收到或未阅读该等通知信息主张相关通知未送达于您。
第六条 用户信息的维护与使用 
6.1本公司收集和储存您的用户信息的目的在于提高为您提供服务的效率和质量。 本公司收集个人资料的主要目的在于向您提供一个顺利、有效和度身订造的服务经历。本公司会通过以下方式收集或获取您的资料：
（1）自公开及私人资料来源收集关于您的额外资料；
（2）按照您在本网站网址上的行为自动追踪关于您的某些资料。本公司在本网站的某些网页上使用诸如“Cookies”的资料收集装置；
（3）如果您将个人通讯信息（例如：手机短信、电邮或信件）交付给本公司，或如果其他用户或第三方向本公司发出关于您在本网站上的活动或登录事项的通讯信息，本公司可以将这些资料收集在您的专门档案中；
（4）其他合理的资料收集或获取方式。
6.2 您同意本公司在业务运营中使用您的用户信息，包括但不限于：
（1）进行用户身份、信息核实；
（2）出于提供服务的需要在本网站公示您的相关信息；
（3）向本公司的合作机构（该合作机构仅限于本公司为了完成拟向您提供的服务而合作的机构）提供您的用户信息；
（4）由人工或自动程序对您信息进行评估、分类、研究；
（5）使用您的用户信息以改进本网站的推广；
（6）使用您提供的联系方式与您联络并向您传递有关业务和管理方面的信息，向您传递针对您的兴趣而提供的信息；
（7）用于配合有权机关依职权调取证据材料；
（8）解决争议、调停纠纷、确保通过本网站的交易安全；
（9）执行本公司与用户之间签署的其他协议。
6.3您可以授权本公司帮助您修改您在本网站填写的一切个人资料。如您违反本协议及相关规则，本网站有权经电子邮件告知后在网站数据库中删除您的个人资料。网站有权根据实际审核结果在不通知您的情况下对您所填写的与事实不符的资料进行修正或更改。
6.4您须对使用您的用户账户和密码所采取的一切行为负责。因此，本公司建议您不要向任何第三方披露您在本网站的用户账户和密码。
6.5 您不得使用本公司提供的服务或其他电子邮件转发服务发送垃圾邮件或其他可能影响本网站系统运行或违反协议的内容。 如果您利用本公司的服务向没有在本网站内注册的电子邮件地址发出电子邮件,本公司除了利用该电子邮件地址发出您的电子邮件之外将不作任何其他用途。本公司不会出租或出售这些电子邮件地址。本公司不会永久储存电子邮件信息或电子邮件地址。
第七条 账户注销或限制访问、服务协议的中止或终止
7.1 若您决定不再使用本公司服务，应清偿所有应付款项（包括但不限于服务费、违约金、管理费等），在满足本公司提现规则的前提下将您的用户账户下所对应的可用款项（如有）全部提现，并通过本网站申请注销您的账户，经本公司审核同意后可正式注销您的账户。
7.2 若发生以下任一情况的，本公司有权通过电子邮件等方式告知方式终止本协议、关闭您的账户或限制您使用本网站：
（1）您提供的资料不准确、不真实、不合法有效，违反了本协议及相关规则的约定；
（2）您长时间（注册后连续超过12个月）未能使用其账号的；
（3）您在本网站的行为违反本协议及相关规则的约定或相关法律法规的规定；
（4）依据政府机构、司法机构等要求，需要终止本协议、关闭您的账户或限制您使用本网站的。
7.3 如因本公司或第三方支付机构、银行等任何第三方的原因导致系统维护或升级、对于网络设备进行必要的保养及施工、出现突发性的网络设备故障时而需暂停服务的，本公司将尽可能事先进行通告并减少给您带来的不便。
7.4 发生以下事宜后，用户使用本网站服务的权利立即终止：
（1）用户注销用户账户；
（2）本公司终止本协议或关闭您的账户。
从终止用户使用本网站服务的权利时起，本公司不再对用户承担任何责任和义务。服务终止后，本公司没有义务为您保留原账号中或与之相关的任何信息，或转发任何未曾阅读或发送的信息给您或第三方，本公司可将您在本网站中留存的任何内容加以移除或删除。此外，本公司亦不会就终止用户账户使用而对您或任何第三者承担任何责任。
7.5 用户账户的注销、协议的终止等不代表用户责任的终止，用户仍应对其使用本公司提供服务期间的行为承担可能的违约或损害赔偿责任。
    第八条 免责声明 
8.1 除非另有书面协议约定，本公司在任何情况下，对用户使用本网站服务而产生的任何形式的直接或间接损失均不承担法律责任，包括但不限于资金损失、收益损失、营业中断损失等。 
8.2 本网站的内容可能涉及由第三方所有、控制或运营的其他网站的内容或链接（下称“第三方网站”）。对于该等内容或链接，您确认按照第三方网站的使用协议确定相关权利义务，第三方网站的内容、产品、广告和其他任何信息均由您自行判断并承担风险，与本公司无关。 
8.3 因不可抗力或本网站服务器死机、网络故障、数据库故障、软件升级等问题造成的服务中断和对用户个人数据及资料造成的损失，本公司不承担任何责任，亦不予赔偿，但将尽可能减少因此而给用户造成的损失和影响。 
8.4 因黑客、病毒或密码被盗、泄露等非本公司原因所造成损失概由您本人自行承担。
8.5 您对您本人在使用本网站所提供的服务时的一切行为、行动（不论是否故意）负全部责任。 
第九条 知识产权保护
本网站中的全部内容的著作权、版权及其他知识产权均属于本公司所有，该等内容包括但不限于文本、数据、文章、设计、源代码、软件、图片、照片及其他全部信息（以下称“网站内容”）。网站内容受中华人民共和国著作权法及各国际版权公约的保护。未经本公司事先书面同意，您保证并承诺不以任何方式、不以任何形式复制、模仿、传播、出版、公布、展示网站内容，包括但不限于电子的、机械的、复印的、录音录像的方式和形式等。您承认网站内容是属于本公司的财产。未经本公司书面同意，您亦不得将本网站包含的资料等任何内容镜像到任何其他网站或服务器。任何未经授权对网站内容的使用均属于违法行为，本公司将追究您的法律责任。
第十条 保密协定
10.1 用户在接受本公司提供服务的过程中了解到的所有信息，包括但不限于本网站信息资料、业务运营情况、商业秘密等，不得向任何第三人披露。
10.2 除本协议另有约定外，本公司必须根据中国法律的规定对本网站用户个人信息、资产情况和相关资料予以保密。本公司采用行业标准惯例以保护您的个人资料，但鉴于技术限制，本公司不能确保您的全部私人通讯及其他个人资料不会通过本协议中未列明的途径泄露出去，对此本公司不承担任何责任。
10.3 本公司有权根据有关法律和监管要求，本公司风险控制要求以及相关协议要求向司法机关等政府部门、社会组织或团体、其他第三方服务或合作机构提供您的个人资料。
10.4在您未能按照以下协议的约定履行自己应尽的义务时：
（1）与本公司签订的服务协议、消费协议等；
（2）通过本网站提供的项目而与其他方签署的服务协议、消费协议等。
 本公司有权根据自己的判断或者与协议有关的第三方的请求披露您的个人资料，并做出评论。
10.5在本网站提供的项目活动中，您无权要求本公司提供其他用户的个人资料，除非符合以下条件： 
   （1）您已向法院起诉其他用户的在本网站活动中的违约行为； 
   （2）本公司被吊销营业执照、解散、清算、宣告破产或者其他有碍于您收回投资的情形。
    第十一条 赔偿责任
11.1 如您的行为使本公司及/或其关联公司遭受损失（包括自身的直接经济损失、商誉损失及对外支付的赔偿金、和解款、律师费、诉讼费等间接经济损失），您应赔偿本公司及/或其关联公司的上述全部损失。
11.2 如您的行为使本公司及/或其关联公司遭受第三人主张权利，用户承诺无条件承担相应责任并使本公司免责。若因此给本公司造成损失的，应予赔偿，赔偿范围包括但不限于本网站的维权费、商誉损失以及本公司向第三方支付的补偿金等。
第十二条 适用法律和管辖
因本公司提供服务所产生的争议均适用中华人民共和国法律，并由杭州万塔科技有限公司住所地的人民法院管辖。
第十三条  关于税费
用户在投资、收益过程产生的相关税收缴纳义务，请根据中国法律的规定自行向其主管税务机关申报、缴纳，本网站不承担任何代扣代缴的义务及责任。
第十四条 继承或赠与
如本公司用户出现资产的继承或赠与，必须由主张权利的继承人或受赠人向本公司出示经公证机关公证的继承或赠与权利归属证明文件，经本公司确认后方可予以协助办理资产权属变更手续，由此产生的各项费用等，由主张权利的继承人或受赠人向其主管税务机关申报、缴纳，本网站不负责相关事宜处理。
第十五条 投诉和咨询
若您在使用本网站的过程中有任何的疑问、投诉和咨询，请先在客服作息时间拨打热线或发送电子邮件到本网站指定的电子邮箱：【kefu@candytown.io】。
第十六条 其他
16.1 本公司对本服务协议拥有最终的解释权。
16.2 本网站的某些部分或页面中、或您使用本公司相关服务产品的过程中，存在除本协议以外的服务条款或协议，若与本协议存在不一致的，则本协议以外的服务条款或协议将优先适用。
16.3 本协议中的任何条款或部分条款因被认定为无效或无法实施的，不影响本协议其他条款的效力。
16.4 您确认并同意本公司有权不时地根据法律、法规、政府要求透露、修改、屏蔽或删除必要的、合适的信息，以便更好地运营本网站并保护本公司用户的合法权益。


杭州万塔科技有限公司
2018年06月01日
            </p>
          </div>
      )
  }

}

const MyForm11 = Form.create()(Agreement)

// 隐私权政策
class PrivacyPolicy extends Component {
  
  render() {
      const { getFieldDecorator } = this.props.form
      return(
          <div>
            <p style={{background:"#fff",fontSize:'18px',marginTop:'-25px'}}>
            我们注重保护用户个人信息及个人隐私。本隐私政策解释了用户个人信息收集和使用的有关情况，本隐私政策适用于本网站的相关服务。
            一、您个人信息的收集
            在您注册、使用本网站服务时，经您的同意，我们收集与个人身份有关的信息，例如姓名、住址、手机号码等。如果您无法提供此类信息，可能会不能使用对应服务。
            我们也会基于优化用户体验的目的，收集其他有关的信息。例如当用户访问本网站网站，我们收集哪些网页的受欢迎程度、浏览器软件信息等以便优化我们的网站服务。
            二、您个人信息的管理
            本网站会在如下情形使用您的个人信息：
            1、符合法律法规的要求。
            2、根据您的授权。
            3、符合本网站相关服务条款、软件许可使用协议的约定。
            本网站不会未经允许向第三方披露您的个人信息。除非满足下述情形之一：
            1、根据法律法规的规定。
            2、符合您与本网站之间的相关服务条款、软件许可使用协议的约定。
            三、您个人信息的安全
            本网站严格保护您的个人信息安全。我们使用各种制度、安全技术和程序等措施来保护您的个人信息不被未经授权的访问、使用或泄漏。如果您对我们的个人信息保护有任何疑问，请联系我们。
            四、访问您的个人信息
            如果您注册了本网站相关服务，您可以查阅或编辑您提交给本网站的个人信息。一般情况下，您可随时浏览、修改自己提交的信息，但出于安全性和身份识别的考虑，您可能无法修改注册时提供的初始注册信息及其他验证信息。
            五、cookies的使用
            本网站使用cookies来帮助您实现个性化的联机体验。cookies是由网页服务器存放在您的访问设备上的文本文件。指定给您的cookies是唯一的，它只能被将cookies发布给您的域中的Web服务器读取。
            cookies的主要用途之一是提供一种节约时间的实用功能。例如，如果您在本网站的上注册，cookies会帮助您在后续访问时调用您的信息。这样可以简化记录您填写个人信息的流程。当您返回本网站时，本网站可以调出您以前所提供的信息，使您能够容易地使用您自定义的功能。
            本网站在进行与其产品及服务相关的工作时，会使用网络beacon进入我们的网站提取cookies。
            您有权接受或拒绝cookies。大多数浏览器会自动接受cookies，但您通常可根据自己的需要来修改浏览器的设置以拒绝cookies。如果选择拒绝cookies，那么您可能无法完全体验所访问的本网站服务或网站的互动功能。
            六、第三方cookies的使用
            我们可能不定时邀请第三方为我们的网站提供更多的功能，如在线视频，流量数据统计以及其他功能。此外，第三方亦可在本网站放置信息，如横幅广告，这些广告将允许第三方服务器发送cookies给您的浏览器。请注意，我们只可以访问我们发送给的您的浏览器上的cookies，而不是由其他公司或机构等发送给您的cookies。我们也可能使用其他第三方cookies来跟踪自己的广告效果。由第三方cookies提供给第三方的信息并不包含个人信息，但这些信息可能在我们收到后与您的个人信息重新关联。
            第三方对cookies的使用不受限于我们的隐私声明。本站并无权限访问或控制这些cookies。您可将您的浏览器设置为接受所有cookies，拒绝所有cookies，或当接收一个cookies的时候通知您。但是，如果您将浏览器设置为拒绝接收cookies，您可能无法查看或使用我们的某些服务。因此，您对浏览器关于cookies的设置，决定了您对cookies所传递信息的获得权限。
            七、网络Beacon的使用
            本网站网页上常会包含一些电子图象（称为"单像素" GIF 文件或 "网络 Beacon"），它们可以帮助网站计算浏览网页的用户或访问某些cookies。本网站使用网络 beacon 的方式有：
            1、本网站通过使用网络Beacon，计算用户访问数量，并通过访问cookies 辨认注册用户。
            2、本网站通过得到的cookies 信息，可以在本网站网站提供个性化服务。
            八、日志文件的使用
            正如大多数网站一样，本网站会自动收集某些信息并存储在日志文件中。这些信息包括互联网协议（IP）地址，浏览器类型，互联网服务提供商（ISP），参考/退出页面，操作系统，日期/时间标记和点击流数据。
            本网站使用这些不会识别个人用户的信息，来分析趋势，管理网站，追踪用户在网站上的活动等等。个人信息不会被本网站链接到自动收集的数据上。
            九、widgets的使用
            我们的网站包括社交媒体功能，如新浪微博的分享按钮等widgets。这些功能可能会收集您的IP地址，您正在本网站所浏览的网页，并可能设置一个cookies来保证分享等功能的正常工作等。这些Widgets是由第三方所有或者直接托管在本网站。
            您与这些功能的交互行为，是受功能提供方的隐私政策的约束。在提供您个人信息给我们的代理商或服务提供商的范畴内，我们会采取合理的商业措施来确保它们维护这些信息的机密性，并仅用于预期目的。但是，我们对本网站可能链接到的第三方网站的行为（包含的信息等）不负有责任。我们建议您查看其他网站的隐私声明，以了解其信息行为和服务条款。
            十、用户的访问与选择
            如果您的个人信息发生变化，或者如果你不再需要本网站的服务，您可以进入本网站的个人账户界面进行更新、停用等操作。
            只要您的帐户被激活，或者需要根据您的请求提供服务。本网站有必要保留和使用您的信息来遵守本网站的法律义务，解决纠纷，并执行本网站的协议。
            如果本网站和/或其所有公司有涉及合并，收购或出售部分或全部资产的情况，任何涉及到您个人信息所有权、使用方式、以及任何可能涉及到您个人信息的决定，都会通过电子邮件或本网站醒目的提示来通知您。
            十一、邮件通知设置
            您可以通过点击本网站发送的邮件下方停止订阅按钮，来退订我们的简讯或营销邮件，或者在本网站个人账户里面设置您的电子邮件接收选项。
            十二、隐私政策适用范围
            我们的隐私政策适用于由上杭州万塔科技有限公司及其关联机构提供的所有服务，其中包括在其他网站上提供的服务，但是不包括具有独立隐私政策（未并入本隐私政策）的服务。
            我们的隐私政策不适用于由其他公司或个人提供的服务，例如在搜索结果中向您显示的产品或网站、可能包含本网站服务服务的网站或者在我们的服务中链接到的其他网站。对于为我们的服务进行广告宣传，以及可能使用cookies、网络Beacon和其他技术来投放和提供相关广告的其他公司和组织，我们的隐私政策并未涵盖其信息处理惯例。
            十三、政策的遵守以及与监管机构的配合
            我们会定期检查隐私政策的遵守情况。此外，我们还遵循一些自我监管框架。我们收到投诉后，会进行调查，以便采取进一步行动。我们会与有关监管机构合作，以处理涉及到相关法律法规的隐私的案例。
            十四、隐私政策变更通知
            我们的隐私政策随时都可能变更。如果隐私政策有任何变更，我们会在本页面上发布对隐私政策所做的任何变更。对于重大变更，我们还会提供更为显著的通知（包括对于某些服务，我们会通过电子邮件发送通知，说明隐私政策的具体变更内容）。我们建议您定期查看本网站隐私信息，以获取最新信息。
            </p>
          </div>
      )
  }

}

const MyForm22 = Form.create()(PrivacyPolicy)


class Candy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: localStorage.getItem('currentIndex')?localStorage.getItem('currentIndex'):0,
      userName:'',
      visible:false,
      isGoTop:false,
      isQRCode:false,
      isContact:false,
    }
    this.avatar = ''
    this.setCurrentIndex = this.setCurrentIndex.bind(this)
  }

  componentWillMount() {
    this.avatar = localStorage.getItem('avatar');
    this.getUserInfo();// 个人中心 
    this.setState({
      userName: localStorage.getItem('nick_name') || '',
    })
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = (event) => {
    let scrollTop = window.scrollY;
    if (scrollTop > 500) {
      this.setState({
        isGoTop:true
      })
    } else {
      this.setState({
        isGoTop:false
      })
    }
  }

  setCurrentIndex(event) {
    this.setState({
      currentIndex: parseInt(event.currentTarget.getAttribute('index'), 10)
    })
    if (parseInt(event.currentTarget.getAttribute('index'), 10) === 0) {
      this.props.history.push('/') 
    } 
    if (parseInt(event.currentTarget.getAttribute('index'), 10) === 1) {
      this.props.history.push('/information') 
    }
    if (parseInt(event.currentTarget.getAttribute('index'), 10) === 2){
      this.props.history.push('/assignment')
    }
    localStorage.setItem('currentIndex',event.currentTarget.getAttribute('index'))
  }

   // 个人中心 
   getUserInfo = () => {
    userCenter().then(res=>{
      localStorage.setItem('user_name',res.account)
      localStorage.setItem('nick_name',res.nickname)
      localStorage.setItem('avatar',res.avatar)
      localStorage.setItem('is_agent',res.is_agent)
      console.log(typeof(res.is_agent))
      console.log(typeof(localStorage.getItem('is_agent')))
      this.setState({
        centers:res
      })
    })
  }


  showModal = () => {
    ref = Modal.info({
      title: '注册账号',
      maskClosable: true,
      content: <MyForm submit={this.addUser} hideChild1={this.hideChild1} hideChild2={this.hideChild2} hideModal={this.hideModal} history ={this.props.history}></MyForm>,
      okText: ' ',
      okType: 'none',
      closable: true,
      iconType:'none',
    })
  }

  hideModal = () => {
    ref.destroy()
  }

  showModalLogin = () => {
    ref = Modal.info({
      title: '登录账号',
      maskClosable: true,
      content: <MyFormLogin submit={this.addUser} childModalPass={this.childModalPass} history ={this.props.history}></MyFormLogin>,
      okText: ' ',
      okType: 'none',
      closable: true,
      iconType:'none',
    })
}

childModalPass = () => {
    ref.destroy();
    this.showModalForgetPass();
}

showModalForgetPass = () => {
    ref = Modal.info({
      title: '忘记密码',
      maskClosable: true,
      content: <MyFormForgetPass submit={this.addUser} hidePass={this.hidePass} history ={this.props.history}></MyFormForgetPass>,
      okText: ' ',
      okType: 'none',
      closable: true,
      iconType:'none',
    })
  }

  hidePass = () => {
    ref.destroy();
  }

  showModal11 = () => {
    ref = Modal.info({
      title: '注册协议',
      maskClosable: true,
      content: <MyForm11 submit={this.addUser}  history ={this.props.history}></MyForm11>,
      okText: ' ',
      okType: 'none',
      closable: true,
      iconType:'none',
    })
  }

  showModal22 = () => {
    ref = Modal.info({
      title: '隐私权政策',
      maskClosable: true,
      content: <MyForm22 submit={this.addUser} history ={this.props.history}></MyForm22>,
      okText: ' ',
      okType: 'none',
      closable: true,
      iconType:'none',
    })
  }

  hideChild1 = () => {
    ref.destroy();
    this.showModal11();
  }

  hideChild2 = () => {
    ref.destroy();
    this.showModal22();
  }

  cancel = () => {
    localStorage.clear();
    window.location.reload();
  }

  backTop = () => {
    let scrollToTop = window.setInterval(function() {
      let pos = window.pageYOffset;
      if ( pos > 0 ) {
          window.scrollTo( 0, pos - 20 ); 
      } else {
          window.clearInterval( scrollToTop );
      }
    }, 2);
  }

  QRcodeEnter = () => {
    this.setState({
      isQRCode:true
    })
    console.log('11')
  }

  QRcodeLeave = () => {
    this.setState({
      isQRCode:false
    })
    console.log('22')
  }

  ContactEnter = () => {
    this.setState({
      isContact:true
    })
  }

  ContactLeave = () => {
    this.setState({
      isContact:false
    })
  }

  render() {
    let categoryArr = ['首页', '资讯', '任务'];
    let itemList = [];
    for(let i = 0; i < categoryArr.length; i++) {
      itemList.push(<li key={i}
      className={this.state.currentIndex == i ? 'active' : ''}
      index={i} onClick={this.setCurrentIndex}>{categoryArr[i]}</li>);
    } 
    let css = {
      right:(document.body.clientWidth - 1280) < 100? 0 : ((document.body.clientWidth-1280)/2-70)+'px'
    }
    console.log(typeof(document.body.clientWidth),'1111')
    return (
      <div className="candy">
        <div className="header">  
          <header>   
            <div className="left">
              <img 
                onClick={()=> {
                  this.setState({currentIndex: 0});
                  localStorage.setItem('currentIndex', 0);
                  this.props.history.push('/');
                }}
                src={require('../../assets/img/logo.png')}
              />
              <ul>{itemList}</ul>
            </div>
            <div className="right">
            {
              this.state.userName !== '' ?
              <div className="user-name">
                <img className="head-portrait"  onClick={()=>this.props.history.push('/mine')} src={`https://candytownoss.oss-cn-hangzhou.aliyuncs.com/candytown/${this.avatar}.png`}/>
                <span className="userNames" onClick={()=>this.props.history.push('/mine')}>
                  <span className="userName">{this.state.userName}</span>
                </span>
                <span className="cancel" onClick={this.cancel}><span onClick={()=>this.props.history.push('/')}>退出</span></span>
              </div>
              :
              <div className="login-register">
                <button className="register" onClick={this.showModal}>注册账号</button>
                <button className="login" onClick={this.showModalLogin}>登录</button>
              </div>
            }
            </div>
          </header>
        </div>
        <div className="candy-content">
            <Switch>
              <Route exact path='/' component={ HomePage }></Route>
              <Route path="/assignment" component={ Assignment }/>
              <Route path="/information" component={ Information }/>
              <Route path="/mine" component={ MinePage }/>
              <Route path="/project" component={ DetailPage } />
              <Route path="/home/helpCenter" component={ HelpCenter } />
              <Route path="/home/partner" component={ Partner } />
              <Route path="/home/welcome" component={ Welcome } />
            </Switch>     
        </div>
        <div className="positionRight" style={css}>
            <ul>
              {this.state.isGoTop?<li onClick={this.backTop}><a><Icon type="up" /></a></li>:''}
              <li className="QRcode" onMouseEnter={this.QRcodeEnter} onMouseLeave={this.QRcodeLeave}>
                <a><Icon type="qrcode" /></a>
                <div className="imgs" style={{display:this.state.isQRCode?"block":"none"}}>
                  <img src={require('../../assets/img/QRcodeImg.png')}/>
                  <p><span className="imgs1 img2">扫描联系客服</span> <span className="imgs1">candytownio</span><br/>（添加时建议备注<span>您的姓名 + 手机号</span>，便于提供更好的服务）</p>
                </div>
              </li>
              <li className="Message" onMouseEnter={this.ContactEnter} onMouseLeave={this.ContactLeave}>
                <a><Icon type="phone" /></a>
                <p className="contact" style={{display:this.state.isContact?"block":"none"}}>
                  15394220167
                  <span>周一至周五9:00~18:00</span>
                </p>
              </li>
            </ul>
        </div>
        <div className="footer">
          <footer>
            <div className="footer-left">
              <h1>关于我们</h1>
              <ul>
                <li onClick={()=>this.props.history.push('/home/welcome/welcome')}>About CandyTown</li>
                <li onClick={()=>this.props.history.push('/home/partner/partner')}>合作伙伴</li>
                <li onClick={()=>this.props.history.push('/home/helpCenter/helpCenter')}>帮助中心</li>
              </ul>
            </div>
            <div className="footer-center">
              <h1>联系我们</h1>
              <p>Email: <span>kefu@candytown.net</span></p>
              <p>Wechat: <span>candytownio</span></p>
              <p>官方微博: <span>糖果小镇CandyTown</span></p>
              <p>Telegram: <span>18167138300</span></p>
            </div>
            <div className="footer-right">
              <div className="left">
                <h1>关注我们</h1>
                <img src="http://candytownoss.oss-cn-hangzhou.aliyuncs.com/candyPC/qrcode.png"/>
              </div>
              <div className="right">
                <h1>APP下载</h1>
                <img src={require('../../assets/img/APP.png')}/>
              </div>
            </div>
          </footer>
        </div>
      </div>
    );
  }
}

export default Candy

