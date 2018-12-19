import React, { Component } from 'react';
import { message, Form, Input, Button, Breadcrumb, Upload, Select, Modal, Icon } from 'antd'
import Editor from 'react-umeditor';
import {addItem,editItem,itemDetail,exchangeAll} from '../../utils/request'
import Config from '@/../config/config'
import {transArr} from '../../utils/common'
import apiUrl from '../../config/apiUrl'
import './candysType.less'

let ref = null
const FormItem = Form.Item
const Option = Select.Option

class AddForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 2,
      data: [],
      channel: '',
      community_name: '',
      identifier: '',
      fileListUrl: [{
        uid: -1,
        url: '',
      }],
      loading: false
    }
  }
  
  form = [
    {name: '名称', field: 'channel', value: ''},
    {name: '地址', field: 'community_name', value: ''},
    {name: '图片', field: 'identifier', value: ''}
  ]

  componentDidMount() {
    this.setState({data: this.props.data})
  }

  handleSubmit = () => {
    const { channel, community_name, identifier } = this.state
    const { submit } = this.props 
    if (!channel) {
      message.error('名称不能为空')
      return
    }
    let repeat = this.props.community.find(item => {
      return item.channel === channel
    })
    if (repeat) {
      message.error('名称不能重复')
      return
    }
    ref.destroy()
    submit({ channel, community_name, identifier })
  }
  
  changeUrl = (file) => {
    let fileListUrl = [{
      uid: -1,
      url: file.data,
    }]
    this.setState({fileListUrl, identifier: file.data})
  }

  update = (file) => {
    if (file.file.size > 1024*500) {
      message.error('上传图片过大,请重新选择图片！')
      return false
    }
  }
  
  render () {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
      </div>
    );
    const optionsUrl = {
      action: Config.backend + apiUrl.upload,
      headers: {
        Authorization: JSON.parse(localStorage.getItem('admin') || '{}')
      },
      fileList:this.state.fileListUrl[0].url ? this.state.fileListUrl : null
    }
    return (
      <Form className="formModal">
        {
          this.form.map((item,key) => (
            <FormItem key={key} label={item.name}>
              {
                item.field !== 'identifier'?
                <Input placeholder={item.channel} onChange={(e)=>{this.setState({[item.field]: e.target.value})}}/>:
                <div className="clearfix">
                  <Upload {...optionsUrl}
                    accept = 'image/*'
                    listType="picture-card"
                    onPreview={this.handlePreview}
                    onSuccess = {this.changeUrl}
                    onChange = {this.update}
                  >
                    {this.state.fileListUrl.length > 1 ? null : uploadButton}
                  </Upload>
                  <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                  </Modal>
                </div>
              }
            </FormItem> 
          ))
        }
        <FormItem>
          <Button type="primary" onClick={()=> this.handleSubmit()}>
            确认
          </Button>
        </FormItem>
      </Form>
    )
  }
}
const MyModal = Form.create()(AddForm)

class ProjectForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [{
        uid: -1,
        url: '',
      }],
      fileListUrl: [{
        uid: -1,
        url: '',
      }],
      data: {},
      status: '',
      list: null,
      editor:'',
      update: false,
      other_community: []
    },
    this.imgLists = {}
  }

  componentWillMount () {
    let type = this.props.history.location.pathname.split('/').pop()
    let id = this.props.history.location.search.split('=').pop()
    type === 'edit'?this.getData(parseInt(id)):this.getAllName()
  }

  getIcons(){
		return [
				"source | undo redo | bold italic underline strikethrough fontborder | ",
				"paragraph fontfamily fontsize | superscript subscript | ",
				"forecolor backcolor | removeformat | insertorderedlist insertunorderedlist | selectall | ",
				"cleardoc  | indent outdent | justifyleft justifycenter justifyright | touppercase tolowercase | ",
				"horizontal date time  | image formula spechars | inserttable"
			]
  }
  
	getDefaultUploader(){
    return {
			url:Config.backend+'/ims/file/upload',
      name:"file",
      type:'local',
      request: "image_src",
    }
  }

	handleFormChange(e){
		e = e || event;
		var editor = this.refs.editor.getContent();
		form_data.editor = editor;
  }
  
  showModal = () => {
    ref = Modal.info({
      title: '添加社群',
      maskClosable: true,
      content: <MyModal submit={this.verify} community={this.state.data.other_community?this.state.data.other_community:[]}></MyModal>,
      okText: '',
      okType: 'none'
    })
  }

  verify = (params) => {
    if (this.state.data.other_community && this.state.data.other_community.length) {
      this.state.data.other_community.push(params)
    } else {
      this.state.data.other_community = [params]
    }
    this.imgLists[params.channel] = [{
      uid: -1,
      url: params.identifier,
    }]
    this.setState({data: this.state.data})
  }

  getAllName = ()=>{
    exchangeAll().then(res=>{
      if (Array.isArray(res)) {
        this.props.form.setFieldsValue({
          exchange_status: [],
          exchange_recommend: []
        })
        this.setState({list:res})
      }
    })
  }

  deleteItem = (channel) => {
    let data = this.state.data
    let other_community = this.state.data.other_community.filter(item => item.channel !== channel)
    data.other_community = other_community
    this.setState({data})
  }

  getData = (id) => {
    itemDetail({id:id}).then(data => {
      if (data) {
        this.setState({data:data,list:data.exchange_status,editor:data['prospectus']})
        this.state.fileList[0].url = this.state.data['icon']
        this.state.fileListUrl[0].url = this.state.data['weixin_url']
        const exchange_status = data['exchange_status'].filter(item => item.online===true) || []
        const exchange_recommend = data['exchange_status'].filter(item => item.recommend===true) || []
        let other_community = data['other_community'] || []
        other_community.length && other_community.map(item => {
          this.imgLists[item.channel] = [{
            uid: -1,
            url: item.identifier
          }]
        })
        this.props.form.setFieldsValue({
          name: data['name'],
          identifier: data['identifier'],
          brief: data['brief'],
          title: data['title'],
          community_name: data['community_name'],
          // status: data['status'],
          other_community: other_community,
          weixin: data['weixin'],
          weixin_url: data['weixin_url'],
          // facebook_url: data['facebook_url'],
          exchange_status: transArr(exchange_status,'name')|| null,
          exchange_recommend: transArr(exchange_recommend,'name')|| null,
          sixth_reward: data['sixth_reward'],
          icon: data['icon'],
        });
      }
    })
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  onChange=(e)=>{
    this.setState({editor:e})
  }

  changeIcon = (file) => {
    let fileList = [{
      uid: -1,
      url: file.data,
    }]
    this.setState({fileList: fileList})
  }

  update = (file) => {
    if (file.file.size > 1024*500) {
      message.error('上传图片过大,请重新选择图片！')
      return false
    }
  }

  groupChangeUrl = (file,name) => {
    let params = [{
      uid: -1,
      url: file.data,
    }]
    this.imgLists[name] = params
    this.setState({update: !this.state.update})
  }

  changeUrl = (file) => {
    let fileListUrl = [{
      uid: -1,
      url: file.data,
    }]
    this.setState({fileListUrl: fileListUrl})
  }

  submit=()=>{
    let type = this.props.history.location.pathname.split('/').pop()
    let id = this.props.history.location.search.split('=').pop()
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.state.data.hasOwnProperty('other_community') && this.state.data.other_community && this.state.data.other_community.length && this.state.data.other_community.map(item => {
        item.identifier = this.imgLists[item.channel][0].url
      })
      if (!err) {
        values.other_community = this.state.data.other_community || []
        values.prospectus=this.state.editor
        values.weixin_url = this.state.fileListUrl[0].url
        values.icon = this.state.fileList[0].url
        values.exchange_recommend = values.exchange_recommend
        values.exchange_status = values.exchange_status===true?[]:values.exchange_status
        values.other_community = this.state.data.other_community || []
        type !== 'add' ? Object.assign(values,{id, id}) : values
        type !== 'add' ? values.id = parseInt(values.id) : values
        type === 'add' ?
        (addItem(values).then(
          (data) => {
            if (data.code === 0) {
              message.success('添加成功')
              this.props.history.goBack()
            }
          }
        ))
        :(editItem(values).then(
          (data) => {
            if (data.code === 0) {
              message.success('编辑成功')
              this.props.history.goBack()
            }
          }
        ))
      }
    })
  }

  groupImgLists = (name='') => {
    let common = {
      action: Config.backend + apiUrl.upload,
      headers: {
        Authorization: JSON.parse(localStorage.getItem('admin') || '{}')
      },
      fileList: this.imgLists[name]? this.imgLists[name] : null
    }
    return common
  }

  render () {
    const { getFieldDecorator } = this.props.form
    let type = this.props.history.location.pathname.split('/').pop()
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    let icons = this.getIcons();
		// 如果你是本地上传，请调用下面这行代码
		var uploader = this.getDefaultUploader();
		// 注意上传接口的返回值，应该是 {'data': {'image_src': xxx} , 'status':'success'}
		let plugins = {
			image:{
				uploader:uploader
			}
		}
    const optionsIcon = {
      action: Config.backend + apiUrl.upload,
      headers: {
        Authorization: JSON.parse(localStorage.getItem('admin') || '{}')
      },
      fileList:this.state.fileList[0].url ? this.state.fileList : null
    }
    const optionsUrl = {
      action: Config.backend + apiUrl.upload,
      headers: {
        Authorization: JSON.parse(localStorage.getItem('admin') || '{}')
      },
      fileList:this.state.fileListUrl[0].url ? this.state.fileListUrl : null
    }
   
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => {this.props.history.goBack()}}>返回</Breadcrumb.Item>
          <Breadcrumb.Item>{type === 'add' ? '新增': '编辑'}项目</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{paddingLeft: '32px', paddingTop: '15px'}}>
          <Button type="primary" onClick={()=>{this.showModal()}}>添加社群</Button>
        </div>
        <Form onSubmit={this.handleSubmit} className="formRow" layout="inline">
          <FormItem label="项目名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入项目名称!' }]
            })(
              <Input placeholder="项目名称" />
            )}
          </FormItem>
          <FormItem label="项目简介">
            {getFieldDecorator('brief', {
              rules: [{ required: true, message: '请输入项目简介!' }]
            })(
              <Input placeholder="项目简介" />
            )}
          </FormItem>
          <FormItem label="分享标题">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入分享标题!' }]
            })(
              <Input placeholder="分享标题" />
            )}
          </FormItem>
          <FormItem label="联系人">
            {getFieldDecorator('community_name', {
              rules: [{ required: true, message: '请输入联系人!' }]
            })(
              <Input placeholder="联系人" />
            )}
          </FormItem>
          <FormItem label="联系方式">
            {getFieldDecorator('identifier', {
              rules: [{ required: true, message: '请输入联系方式!' }]
            })(
              <Input placeholder="联系方式" />
            )}
          </FormItem>
          <FormItem label="微信号">
            {getFieldDecorator('weixin', {
              rules: [{ required: true, message: '请输入微信号!' }]
            })(
              <Input placeholder="微信号" />
            )}
          </FormItem>
          {
            this.state.data && this.state.data.other_community && this.state.data.other_community.map((item,key) => (
              <div key={key} style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between', alignItems:'center' , width: '84%'}}>
                <span>{item.channel}:</span>
                <div style={{width: '30%'}}>
                <Input value={item.community_name} 
                  onChange={(e) => {
                    this.state.data.other_community.map(i => {
                      if (i.channel === item.channel) {
                        i.community_name = e.target.value
                      }
                    })
                    this.setState({data: this.state.data}) 
                  }}
                />
                </div>
                <div className="clearfix" >
                  <Upload {...this.groupImgLists(item.channel)}
                    accept = 'image/*'
                    listType="picture-card"
                    onPreview={this.handlePreview}
                    onSuccess = {(file) => this.groupChangeUrl(file, item.channel)}
                    onChange = {this.update}
                  >
                    {this.state.fileListUrl.length > 1 ? null : uploadButton}
                  </Upload>
                  <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                  </Modal>
                </div>
                <Button type="danger" onClick={()=>{this.deleteItem(item.channel)}}>删除</Button>
              </div>
            ))
          }
          
          <FormItem label="微信二维码">
            {getFieldDecorator('weixin_url', {
              rules: [{ required: true, message: '请上传微信二维码图片!' }]
            })(
              <div className="clearfix">
                <Upload {...optionsUrl}
                  accept = 'image/*'
                  listType="picture-card"
                  onPreview={this.handlePreview}
                  onSuccess = {this.changeUrl}
                  onChange = {this.update}
                >
                  {this.state.fileListUrl.length > 1 ? null : uploadButton}
                </Upload>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
              </div>
            )}
          </FormItem>
          <FormItem label="ICON">
            {getFieldDecorator('icon', {
              rules: [{ required: true, message: '请上传项目ICON!' }]
            })(
              <div className="clearfix">
                <Upload {...optionsIcon}
                  accept = 'image/*'
                  listType="picture-card"
                  onPreview={this.handlePreview}
                  onSuccess = {this.changeIcon}
                  onChange = {this.update}
                >
                  {this.state.fileList.length > 1 ? null : uploadButton}
                </Upload>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
              </div>
            )}
          </FormItem>
          <FormItem style={{ width: '100%' }} label="交易所(马上交易)">
            {getFieldDecorator('exchange_status', {
              initialValue: true,
              type: 'array'
            })(
              <Select style={{ width: '100%' }} placeholder="支持选择多个交易所" mode='multiple'>
                { Array.isArray(this.state.list) && this.state.list.length > 0 && this.state.list.map(i=>(
                  <Option value={i.name} key={i.name}>{i.name}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem style={{ width: '100%' }} label="交易所(已上平台)">
            {getFieldDecorator('exchange_recommend', {
              initialValue: true,
              type: 'array'
            })(
              <Select style={{ width: '100%' }} placeholder="支持选择多个交易所"
                mode='multiple'>
                { Array.isArray(this.state.list) && this.state.list.length > 0 && this.state.list.map(i=>(
                  <Option value={i.name} key={i.name}>{i.name}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" style={{width: '100%',display:'none'}} ref='formBtn'>
              提交
            </Button>
          </FormItem>
        </Form>
        <p>项目介绍：</p>
        <Editor ref="editor" icons={icons} plugins={plugins} onChange={(e)=>this.onChange(e)} value={this.state.editor}/>
        <Button type="primary" onClick={this.submit} style={{width: '50%',marginTop:20}}>
        提交
      </Button>
      </div>
    )
  }
}
const ProjectType = Form.create()(ProjectForm)

export default ProjectType

