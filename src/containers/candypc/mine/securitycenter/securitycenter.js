import React, { Component } from 'react';
import { Input, Form, Modal, Button, Upload, Icon, message, Select, Table, Pagination } from "antd";
import './securitycenter.less';
import Config from '@/../config/config';
import { commonGet, authentication, authDetail, updateName, resetPassword, candySymbolList, addAddress, addressLists } from '@/config/mobileApi';

const Option = Select.Option

// 添加立即认证弹框
let ref = null
const FormItem = Form.Item
class certificateImmediately extends Component {
  constructor(props) {
      super(props)
      this.state = {
        loading: false,
        cardFront:'',
        cardBack:'',
        handHold:'',
        cardBackUrl: '',
        cardFrontUrl: '',
        handHoldUrl: '',
        status:0
      }
      this.authInfo = {}
  }

  componentWillMount() {
    this.authDetails();// 个人认证详情
  }

  beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Toast.info('请上传小于2MB的图片!');
    }
    return isLt2M;
  }

  uploadImg = (file, name) => {
    const img = file.response? file.response.data : ''
    if (img) {
      commonGet(img).then(res => {
        this.setState({
          [name]: `data:image/jpeg;base64,${res}`,
          loading: false,
          [name+'Url']: img
        });
      })
    }
  }

  // 个人认证详情
  authDetails = () => {
    let params = {}
    authDetail(params).then(res=>{
      if (res.status) {
        this.authInfo = res
      }
      this.setState({
        status:res.status
      })
    })
  }

  handleChangeBack = ({file}) => {
    this.uploadImg(file, 'cardBack')
  }

  handleChangeFront = ({file}) => {
    this.uploadImg(file, 'cardFront')
  }

  handleChangeHand = ({file}) => {
    this.uploadImg(file, 'handHold')
  }

  handleSubmit = (e) => {
    e.preventDefault();
      this.props.form.validateFieldsAndScroll((err,values)=>{
        values.n = values.name;
        values.i = values.IDCard;
        if (!err) {
          let params = {
            card_back: this.state.cardBackUrl,
            card_front: this.state.cardFrontUrl,
            card_no: values.i,
            hand_hold: this.state.handHoldUrl,
            name: values.n
          }
          authentication(params).then(res=>{
            if (res.code === 0) {
              message.success('资料提交成功，请耐心等待审核');
              this.props.history.push('/')
            }
          })
        }
      })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    let token = localStorage.getItem('userTokenpc') || ''

    const headers = {
      Authorization: token
    }
    const uploadUrl = `${Config.backend}/ims/user/file/upload`
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
      </div>
    );
    const {cardFront, cardBack, handHold} = this.state;
    return(
      <div>
      {
        (
          ()=>{
            switch (Number(this.state.status)) {
              case 0:
              case 3: return<div>
              <Form onSubmit={this.handleSubmit} className="formPerple" layout="inline">
                <FormItem label="姓名">
                    {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入姓名' }]
                    })(
                    <Input placeholder="请输入姓名" onChange={(e) => this.setState({name:e.target.value})}/>
                    )}
                </FormItem>
                <FormItem label="身份证号">
                    {getFieldDecorator('IDCard', {
                    rules: [{ required: true, message: '请输入18位身份证号码' }]
                    })(
                    <Input placeholder="请输入18位身份证号码" onChange={(e) => this.setState({IDCard:e.target.value})}/>
                    )}
                </FormItem>
                  <div className="lastChild">
                      <h1>身份证照片</h1>
                      <div className="image-group">
                        <div className="upload">
                          <Upload name="file" headers={headers} listType="picture-card" style={{width: '104px', height: '104px', padding: 0, backgroundColor: '#efefef'}} showUploadList={false}
                            action={uploadUrl} beforeUpload={this.beforeUpload} onChange={this.handleChangeFront}>
                            {cardFront ? <img style={{width: '104px', height: '104px', padding: 0}} src={cardFront} alt="avatar" /> : uploadButton}
                          </Upload>
                          <span>正面</span>
                        </div>
                        <div className="upload">
                          <Upload name="file" headers={headers} listType="picture-card" style={{width: '104px', height: '104px', padding: 0, backgroundColor: '#efefef'}} showUploadList={false}
                            action={uploadUrl} beforeUpload={this.beforeUpload} onChange={this.handleChangeBack}>
                            {cardBack ? <img style={{width: '104px', height: '104px', padding: 0}} src={cardBack} alt="avatar" /> : uploadButton}
                          </Upload>
                          <span>反面</span>
                        </div>
                        <div className="upload">
                          <Upload name="file" headers={headers} listType="picture-card" style={{width: '104px', height: '104px', padding: 0, backgroundColor: '#efefef'}} showUploadList={false}
                            action={uploadUrl} beforeUpload={this.beforeUpload} onChange={this.handleChangeHand}>
                            {handHold ? <img style={{width: '104px', height: '104px', padding: 0}} src={handHold} alt="avatar" /> : uploadButton}
                          </Upload>
                          <span>手持身份证</span>
                        </div>
                      </div>
                    </div>
                <div className="certificate">
                  <button>提交</button>
                </div>
              </Form>
          </div>
              case 1: return<p>认证资料已提交，请等待后台审核!</p>
              case 2: return<div>
              <main className="success-box">
                <div className="box">
                  <div className="left">
                    <span className="name">{this.authInfo.name}</span>
                    <span>{this.authInfo.card_no.replace(this.authInfo.card_no.substring(6,14) ,'******')}</span>
                  </div>
                  <div className="right">
                    已认证
                  </div>
                </div>
                <p>*认证已完成，暂不支持修改</p>
              </main>
            </div>
              default:return <div></div>
            }
          }
        )()
      }
      </div>
    )
  }
}
const MyForm = Form.create()(certificateImmediately) 

// 添加重置密码弹框
class resetPasswords extends Component {
  constructor(props) {
      super(props)
      this.state = {
        
      }
  }
 
  // 重置密码
  handleSubmit = (e) => {
    e.preventDefault();
      this.props.form.validateFieldsAndScroll((err,values)=>{
        if (!err) {
          if (values.newPass != values.newPass1) {
            message.error('两次密码输入不一致！');
            return;
          }
          let params = {
            password:values.oldPass,
            new_password:values.newPass
          }
          resetPassword(params).then(res=>{
            if (res.code == 0) {
              message.success('修改密码成功！');
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
              <FormItem label="原密码">
                  {getFieldDecorator('oldPass', {
                  rules: [{ required: true, message: '请输入原密码' }]
                  })(
                  <Input type="password" placeholder="请输入原密码" />
                  )}
              </FormItem>
              <FormItem label="新密码">
                  {getFieldDecorator('newPass', {
                  rules: [{ required: true, message: '请输入6-16位新密码' }]
                  })(
                  <Input type="password" placeholder="请输入6-16位新密码" />
                  )}
              </FormItem>
              <FormItem label="确认密码">
                  {getFieldDecorator('newPass1', {
                  rules: [{ required: true, message: '请再次输入新密码' }]
                  })(
                  <Input type="password" placeholder="请再次输入新密码" />
                  )}
              </FormItem>   
              <div className="certificate">
                <button onClick={this.props.hideAddress}>提交</button>
              </div>
            </Form>
        </div>
    )
  }
}
const MyForm1 = Form.create()(resetPasswords) 

// 新增提币地址
class addNewAddress extends Component {
  constructor(props) {
      super(props)
      this.state = {
        symbolLists:[]
      }
  }

  componentWillMount() {
    this.candySymbolLists();// 糖果标志列表
  }

  // 糖果标志列表
  candySymbolLists = () => {
    candySymbolList().then(res=>{
      this.setState({
        symbolLists:res
      })
    })
  }

  handleChange = (value) => {
    console.log(value)
    this.setState({candy_id: value})
  }
 
  // 添加地址
  handleSubmit = (e) => {
    e.preventDefault();
      this.props.form.validateFieldsAndScroll((err,values)=>{
        if (!err) {
          console.log(values)
          let params = {
            address:values.address,
            remark:values.comment,
            symbol:values.type
          }
          addAddress(params).then(res=>{
            if (res.code == 0) {
              message.success('地址添加成功！');
              this.props.hideAddress(); // 成功时让弹框消失
              this.props.walletLists();
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
              <FormItem label="类型">
                  {getFieldDecorator('type', {
                  rules: [{ required: true, message: '请选择Token类型' }]
                  })(
                    <Select
                      onChange={this.handleChange}
                      showSeach
                      style={{ width: '100%', padding: 0, margin: 0 }}
                      placeholder="选择Token类型"
                      optionFilterProp="children"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      dropdownMatchSelectWidth={false}
                      dropdownAlign={{
                          points: ['tr', 'br'],
                          overflow: false,
                      }}
                  > 
                  {
                    this.state.symbolLists.map((item,i)=>(
                      <Option key={i} value={item.symbol}>{item.symbol}</Option>
                    ))
                  }
                  </Select>
                  )}
              </FormItem>
              <FormItem label="提币地址">
                  {getFieldDecorator('address', {
                  rules: [{ required: true, message: '请填写正确的地址' }]
                  })(
                  <Input type="text" placeholder="请填写正确的地址" />
                  )}
              </FormItem>
              <FormItem label="备注">
                  {getFieldDecorator('comment', {
                  rules: [{ required: true, message: '请填写备注信息' }]
                  })(
                  <Input type="text" placeholder="请填写备注信息" />
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
const MyForm2 = Form.create()(addNewAddress) 

class SecurityCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      xData: [],
      data: [],
      iphone:'',
      IDCard:'',
      name:'',
      card_no:'',
      fail_reason:'',
      isShow:false,
      status:0,
      detail:[],
      nick_name:'',
      nicks:'',
      totalNum:0
    }
  }

  componentWillMount() {
    let user_name = localStorage.getItem('user_name');
    this.state.nicks = localStorage.getItem('nick_name');
    this.state.nick_name = localStorage.getItem('nick_name');
    this.state.iphone = user_name?(user_name.substr(0,3)+"****"+user_name.substr(7)):'';
    this.authDetail();// 个人登录详情
    this.walletLists();// 提币地址管理列表
  }

  showModal = () => {
    ref = Modal.info({
      title: '实名认证',
      maskClosable: true,
      content: <MyForm submit={this.addUser}  history ={this.props.history}></MyForm>,
      okText: ' ',
      okType: 'none',
      closable: true,
      iconType:'none',
    })
  }

  showModal1 = () => {
    ref = Modal.info({
      title: '重置密码',
      maskClosable: true,
      content: <MyForm1 submit={this.addUser} hideAddress={this.hideAddress} history ={this.props.history}></MyForm1>,
      okText: ' ',
      okType: 'none',
      closable: true,
      iconType:'none',
    })
  }

  hideAddress = () => {
    ref.destroy();
  }

  showModal2 = () => {
    ref = Modal.info({
      title: '添加提币地址',
      maskClosable: true,
      content: <MyForm2 submit={this.addUser} walletLists={this.walletLists} hideAddress={this.hideAddress} history ={this.props.history}></MyForm2>,
      okText: ' ',
      okType: 'none',
      closable: true,
      iconType:'none',
    })
  }

  // 个人认证详情
  authDetail = () => {
    let params = {}
    authDetail(params).then(res=>{
      this.setState({
        detail:res,
        name:res.name,
        status:res.status,
        card_no:res.card_no.replace(res.card_no.substring(6,14) ,'******'),
        fail_reason:res.fail_reason
      })
      // console.log(res)
    })
  }

  // 修改昵称
  NickName = () => {
    this.setState({
      isShow:true,
    })
  }

  // 保存
  save = () => {
    updateName({new_nickname:this.state.nick_name}).then(res=>{
      if (res) {
        // localStorage.setItem('nick_name',res)
        message.success('保存成功！')
        this.setState({
          isShow:false,
          nick_name:localStorage.setItem('nick_name',this.state.nick_name)
        })
        window.location.reload();
      }
    })
  }

  cancels = () => {
    this.setState({
      isShow:false
    })
  }

  // 提币地址列表
  walletLists = (page) => {
    let params = {
      limit:10,
      page:page
    }
    addressLists(params).then(res=>{
      this.setState({
        data:res.records,
        totalNum:res.total
      })
    })
  }

  onChange = (page) => {
    this.walletLists(page);
  }

  render() {
    const columns = [{
      title: '类型',
      dataIndex: 'symbol',
      width: '25%',
    }, {
      title: '备注',
      dataIndex: 'remark',
      width: '25%',
    }, {
      title: '地址',
      dataIndex: 'address',
      width: '50%',
    }];
    
    return (
      <div className="security-center">
        <div className="security-content">
          <div className="content-top">
            <h1>安全中心</h1>
            {
              this.state.iphone?<p>
              <span className="text">账户</span>
              <span className="info infos">{this.state.iphone}</span>
            </p>:''
            }
                       
            <p>
              <span className="text">昵称</span>
              {
                this.state.isShow?<Input type='text' className="info amend" defaultValue={this.state.nick_name} placeholder='请输入要修改的昵称' onChange={(e) => this.setState({nick_name:e.target.value})}/>:
                <Input  className="info" placeholder={this.state.nick_name} disabled/>
              }
              {
                this.state.isShow?
                <div className="save-cancel">
                  <span className="save" onClick={this.save}>保存</span>
                  <span className="cancels" onClick={this.cancels}>取消</span>
                </div>:
                <button className="modify" onClick={this.NickName}>修改</button>
              }
            </p>

            <p>
              <span className="LoginPass">登录密码</span>
              <span  className="pass">******</span>
              <span className="resetPass" onClick={this.showModal1}>重置密码</span>
            </p>

            {
              (
                ()=>{
                  switch (Number(this.state.status)) {
                    case 0:
                    case 3:return <div>
                    {
                      this.state.detail?<p>
                      <span className="text">实名认证</span>
                      <span  className="info error">认证失败：{this.state.fail_reason}</span>
                      <span className="Auth" onClick={this.showModal}>立即认证</span>
                    </p>:''
                    }
                    </div>
                    case 1:return <div>
                      <p>
                        <span className="text">实名认证</span>
                        <span  className="info-not">审核中!</span>
                        <span className="immediate" onClick={this.showModal}>立即认证</span>
                      </p>
                    </div>
                    case 2:return <div>
                      {
                        this.state.detail?<p>
                        <span className="text">实名认证</span>
                        <span  className="info">{this.state.name} | {this.state.card_no}</span>
                        <span className="context">已完成认证，暂不支持修改</span>
                      </p>:''
                      }
                    </div>
                    default:return <div></div>
                  }
                }
              )()
            }
            
          </div>
          <div className="content-bottom">
            <div className="title">
              <h1>提币地址</h1>
              <span onClick={this.showModal2}>新增提币地址</span>
            </div>
            <Table columns={columns} dataSource={this.state.data} pagination={ false } />
            <div className="pagination">
                共 {this.state.totalNum} 条数据 &nbsp; 
                <Pagination  onChange={this.onChange} total={this.state.totalNum} />
              </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SecurityCenter

