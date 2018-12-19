import React, { Component } from 'react';
import { message, Form, Input, Button, Breadcrumb, Upload, Select, DatePicker, Modal, Icon} from 'antd'
import Editor from 'react-umeditor';
import {taskAdd,taskEdit,taskDetail,upload,exchangeAll,itemNames} from '../../utils/request'
import moment from 'moment';
import 'moment/locale/zh-cn'
import './candysType.less'
import Config from '@/../config/config'
import {transArr} from '../../utils/common'
import apiUrl from '../../config/apiUrl'

const FormItem = Form.Item
const dateFormat = 'YYYY-MM-DD HH:mm:ss'
const Option = Select.Option

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
      data: null,
      status: '',
      list:[],
      checkedList: [],
      itemNames: [],
      editor:''
    }
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
		var target = e.target || e.srcElement;
		var value = target.value;
		var editor = this.refs.editor.getContent();
		form_data.editor = editor;
	}
  componentWillMount () {
    let type = this.props.history.location.pathname.split('/').pop()
    let id = this.props.history.location.search.split('=').pop()
    type === 'edit'?this.getData(parseInt(id)):this.getAllName()
    this.showItems()
  }
  showItems=()=>{
    itemNames().then(res=>{
      this.setState({itemNames:res})
    })
  }
  getAllName = ()=>{
    exchangeAll().then(res=>{
      this.setState({list:res})
    })
  }
  getData = (id) => {
    taskDetail({id:id}).then(data => {
      if (data) {
        this.setState({data:data,editor:data['prospectus']})
        this.state.fileList[0].url = this.state.data['icon']
        this.state.fileListUrl[0].url = this.state.data['weixin_url']
        this.props.form.setFieldsValue({
          name: data['name'],
          quota: data['quota'],
          item_name: data['item_name'],
          start_time: moment((data['start_time']).slice(0, -6).replace('T',' '), dateFormat),
          end_time: moment((data['end_time']).slice(0, -5).replace('T',' '), dateFormat),
          first_reward: data['first_reward'],
          second_reward: data['second_reward'],
          third_reward: data['third_reward'],
          fourth_reward: data['fourth_reward'],
          fifth_reward: data['fifth_reward'],
          fifth_reward: data['fifth_reward'],
          sixth_reward: data['sixth_reward'],
          trigger: data['trigger'],
          weixin: data['weixin'],
          icon: data['icon'],
          weixin_url: data['weixin_url'],
        });
      }
    })
  }
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    console.log(file)
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  editorChange=(e)=>{
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
    // console.log(file.file)
    if (file.file.size > 1024*500) {
      message.error('上传图片过大,请重新选择图片！')
      return false
    }
  }
  onChange = (type,e,value) => {
    console.log(e)
    console.log(value)
    if (type === 'end') {
      this.end_time=value
      this.setState({end_time: value})
    } else {
      this.start_time=value
      this.setState({start_time: value})
    }
  }
  onOk = (type,e) => {
    console.log(e._d)
    console.log(moment(e).format('YYYY-MM-DD HH:mm:ss'))
    if (type === 'end') {
      this.setState({end_time: moment(e).format('YYYY-MM-DD H:mm:ss')})
    } else {
      this.setState({start_time: moment(e).format('YYYY-MM-DD H:mm:ss')})
    }
  }
  changeUrl = (file) => {
    let fileListUrl = [{
      uid: -1,
      url: file.data,
    }]
    this.setState({fileListUrl: fileListUrl})
  }
  check=(checkedValues) => {
    console.log('checked = ', checkedValues);
  }
  submit=()=>{
    let type = this.props.history.location.pathname.split('/').pop()
    let id = this.props.history.location.search.split('=').pop()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.end_time = this.state.end_time || values.end_time.toDate().toISOString().slice(0, -5).replace('T',' ')
        values.start_time = this.state.start_time || values.start_time.toDate().toISOString().slice(0, -5).replace('T',' ')
        values.prospectus=this.state.editor
        values.icon = this.state.fileList[0].url
        values.weixin_url = this.state.fileListUrl[0].url
        values.quota = parseFloat(values.quota)
        values.fifth_reward = parseFloat(values.fifth_reward)
        values.first_reward = parseFloat(values.first_reward)
        values.fourth_reward = parseFloat(values.fourth_reward)
        values.second_reward = parseFloat(values.second_reward)
        values.sixth_reward = parseFloat(values.sixth_reward)
        values.third_reward = parseFloat(values.third_reward)

        type !== 'add' ? Object.assign(values,{id, id}) : values
        type !== 'add' ? values.id = parseInt(values.id) : values
        console.log(values)
        type === 'add' ?
        (taskAdd(values).then(
          (data) => {
            console.log(data)
            if (data) {
              message.success('添加成功')
              this.props.history.goBack()
            }
          }
        ))
        :(taskEdit(values).then(
          (data) => {
            if (data) {
              message.success('编辑成功')
              this.props.history.goBack()
            }
          }
        ))
      }
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    let type = this.props.history.location.pathname.split('/').pop()
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传icon</div>
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
          <Breadcrumb.Item>{type === 'add' ? '新增': '编辑'}任务</Breadcrumb.Item>
        </Breadcrumb>
        <Form onSubmit={this.handleSubmit} className="formRow" layout="inline">
          <FormItem label="任务名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入任务名称!' }]
            })(
              <Input placeholder="任务名称"/>
            )}
          </FormItem>
          <FormItem label="项目名称">
            {getFieldDecorator('item_name', {
              rules: [{ required: true, message: '请输入项目名称!' }]
            })(
              <Select placeholder="项目名称" disabled={type==='edit'?true:false}>
                {this.state.itemNames.map((i,k)=>{
                  return <Option value={i} key={k}>{i}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <FormItem label="单人领取">
            {getFieldDecorator('quota', {
              rules: [{ required: true, message: '请输入单人领取数量!' }]
            })(
              <Input placeholder="单人领取"  type="number" step={0.001}/>
            )}
          </FormItem>
          <FormItem label="关键词">
            {getFieldDecorator('trigger', {
              rules: [{ required: true, message: '请输入关键词!' }]
            })(
              <Input placeholder="关键词"/>
            )}
          </FormItem>
          <FormItem label="领取开始时间">
            {getFieldDecorator('start_time', {
              rules: [{ type: 'object', required: true, message: '请选择开始时间' }]
            })(
              <DatePicker
                showTime
                format={dateFormat}
                placeholder="请选择开始时间"
                onChange={(e,value) => this.onChange('start',e,value)}
                onOk={(e,value)=>this.onOk('start',e,value)}
              />
            )}
          </FormItem>
          <FormItem label="领取结束时间">
            {getFieldDecorator('end_time', {
              rules: [{ type: 'object', required: true, message: '请选择结束时间' }]
            })(
              <DatePicker
                showTime
                format={dateFormat}
                placeholder="请选择结束时间"
                onChange={(e,value)=>this.onChange('end',e,value)}
                onOk={(e,value)=>this.onOk('end',e,value)}
              />
            )}
          </FormItem>
          <FormItem label="一级奖励">
            {getFieldDecorator('first_reward', {
              rules: [{ required: true, message: '请输入一级奖励!' }]
            })(
              <Input type="number" placeholder="一级奖励" step={0.001}/>
            )}
          </FormItem>
          <FormItem label="二级奖励">
            {getFieldDecorator('second_reward', {
              rules: [{ required: true, message: '请输入二级奖励!' }]
            })(
              <Input type="number" placeholder="二级奖励" step={0.001}/>
            )}
          </FormItem>
          <FormItem label="三级奖励">
            {getFieldDecorator('third_reward', {
              rules: [{ required: true, message: '请输入三级奖励!' }]
            })(
              <Input type="number" placeholder="三级奖励" step={0.001}/>
            )}
          </FormItem>
          <FormItem label="四级奖励">
            {getFieldDecorator('fourth_reward', {
              rules: [{ required: true, message: '请输入四级奖励!' }]
            })(
              <Input type="number" placeholder="四级奖励" step={0.001}/>
            )}
          </FormItem>
          <FormItem label="五级奖励">
            {getFieldDecorator('fifth_reward', {
              rules: [{ required: true, message: '请输入五级奖励!' }]
            })(
              <Input type="number" placeholder="五级奖励" step={0.001}/>
            )}
          </FormItem>
          <FormItem label="六级奖励">
            {getFieldDecorator('sixth_reward', {
              rules: [{ required: true, message: '请输入六级奖励!' }]
            })(
              <Input type="number" placeholder="六级奖励" step={0.001}/>
            )}
          </FormItem>
          <FormItem label="微信号">
            {getFieldDecorator('weixin', {
              rules: [{ required: true, message: '请输入微信号!' }]
            })(
              <Input placeholder="微信号" />
            )}
          </FormItem>
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
          <FormItem>
            <Button type="primary" htmlType="submit" style={{width: '100%',display:'none'}} ref='formBtn'>
              提交
            </Button>
          </FormItem>
        </Form>
        <p>项目介绍：</p>
        <Editor ref="editor" icons={icons} plugins={plugins} onChange={(e)=>this.editorChange(e)} value={this.state.editor}/>
        <Button type="primary" onClick={this.submit} style={{width: '50%',marginTop:20}}>
        提交
      </Button>
      </div>
    )
  }
}
const ProjectType = Form.create()(ProjectForm)

export default ProjectType

