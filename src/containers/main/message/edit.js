import React, { Component } from 'react';
import { message, Form, Input, Button, Breadcrumb,Select} from 'antd'
import Editor from 'react-umeditor';
import {messageCreate,messageDetail,messageEdit,adminItemList} from '@/utils/request'
import Config from '@/../config/config'

const FormItem = Form.Item
const Option = Select.Option

class ProjectForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      status: '',
      list: null,
      editor:'',
      itemLists: []
    }
    this.id = 0
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
  
  componentWillMount () {
    this.id = parseInt(this.props.history.location.search.split('=').pop()) || 0
    if (this.id) {
      this.getData(this.id)
    }
    this.getItemList()  // 获取所有项目列表
  }

  getItemList = () => {
    adminItemList().then(data => {
      let itemLists = []
      data.map(item => {
        itemLists.push({name: item, value: item})
      })
      itemLists.push({name: '其他',value: ''})
      this.setState({itemLists})
    })
  }

  getData = (id) => {
    messageDetail({id}).then(data => {
      if (data) {
        this.setState({editor:data['prospectus']})
        this.props.form.setFieldsValue({
          title: data['title'] || '',
          item_name: data['item_name'] || '',
          origin: data['origin'] || ''
        });
      }
    })
  }

  onChange=(e)=>{
    this.setState({editor:e})
  }

  submit= () => {
    const id = parseInt(this.props.history.location.search.split('=').pop()) || 0
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.prospectus = this.state.editor
        values.item_name =  values.item_name? values.item_name : ''
        values.id = parseInt(id)
        console.log(values)
        !id ?
        (messageCreate(values).then(
          (data) => {
            if (data.code === 0) {
              message.success('添加成功')
              this.props.history.goBack()
            }
          }
        ))
        :(messageEdit(values).then(
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

  render () {
    const { getFieldDecorator } = this.props.form
  
    let icons = this.getIcons();
		// 如果你是本地上传，请调用下面这行代码
		var uploader = this.getDefaultUploader();
		// 注意上传接口的返回值，应该是 {'data': {'image_src': xxx} , 'status':'success'}
		let plugins = {
			image:{
				uploader
			}
		}
   
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => {this.props.history.goBack()}}>返回</Breadcrumb.Item>
          <Breadcrumb.Item>{this.id? '编辑':'新增'}消息</Breadcrumb.Item>
        </Breadcrumb>
        <Form onSubmit={this.handleSubmit} className="formRow" layout="inline">
          <FormItem label="消息标题">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入消息标题!' }]
            })(
              <Input placeholder="消息标题" />
            )}
          </FormItem>
          <FormItem label="所属项目">
            {getFieldDecorator('item_name', {
              rules: [{ required: false, message: '请选择所属项目!' }]
            })(
              <Select style={{ width: 120 }}>
                {this.state.itemLists.map((item,key) => (
                  <Option value={item.value} key={key}>{item.name}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="消息来源">
            {getFieldDecorator('origin', {
              rules: [{ required: true, message: '请输入消息来源!' }]
            })(
              <Input placeholder="消息来源" />
            )}
          </FormItem>
          
          <FormItem>
            <Button type="primary" htmlType="submit" style={{width: '100%',display:'none'}} ref='formBtn'>
              提交
            </Button>
          </FormItem>
        </Form>
        <p>消息内容：</p>
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

