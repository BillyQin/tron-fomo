import React, { Component } from 'react';
import { message, Form, Input, Button, Breadcrumb, Upload, Select, Col, Modal, Icon,Checkbox} from 'antd'
import Editor from 'react-umeditor';
import {addBg,editBg,showBg,upload} from '../../utils/request'
import './candysType.less'
import Config from '@/../config/config'
import {transArr} from '../../utils/common'
import apiUrl from '../../config/apiUrl'

const FormItem = Form.Item
const Option = Select.Option

class PhotoForm extends Component {
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
    }
  }
  componentWillMount () {
    let type = this.props.history.location.pathname.split('/').pop()
    let id = this.props.history.location.search.split('=').pop()
    type === 'edit'?this.getData(parseInt(id)):null
  }
  getData = (id) => {
    showBg({id:id}).then(data => {
      if (data) {
        this.setState({data:data,status: data['status']})
        this.state.fileListUrl[0].url = this.state.data['url']
        this.props.form.setFieldsValue({
          name: data['name'],
          status: this.list[data['status']-1],
          url: data['url'],
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
  update = (file) => {
    // console.log(file.file)
    if (file.file.size > 1024*500) {
      message.error('上传图片过大,请重新选择图片！')
      return false
    }
  }
  list= ['可用','不可用']
  changeUrl = (file) => {
    let fileListUrl = [{
      uid: -1,
      url: file.data,
    }]
    this.setState({fileListUrl: fileListUrl})
  }
  handleSubmit=(e)=>{
    let type = this.props.history.location.pathname.split('/').pop()
    let id = parseInt(this.props.history.location.search.split('=').pop())
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.url = this.state.fileListUrl[0].url
        values.status = type !== 'add' ? parseInt(this.state.value)&&this.state.value||!parseInt(values.status)&&this.list.indexOf(values.status)+1 : values.status
        type !== 'add' ? Object.assign(values,{id, id}) : values
        console.log(values)
        type === 'add' ?
        (addBg(values).then(
          (data) => {
            console.log(data)
            if (data.code === 0) {
              message.success('添加成功')
              this.props.history.goBack()
            }
          }
        ))
        :(editBg(values).then(
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
  onChange=(e)=>{
    console.log(e)
    this.setState({status:e})
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
          <Breadcrumb.Item>{type === 'add' ? '新增': '编辑'}背景图</Breadcrumb.Item>
        </Breadcrumb>
        <Form onSubmit={this.handleSubmit} className="formRow" layout="inline">
          <FormItem label="名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入项目名称!' }]
            })(
              <Input placeholder="项目名称" />
            )}
          </FormItem>
          <FormItem label="使用状态">
            {getFieldDecorator('status', {
              rules: [{ required: true, message: '请选择使用状态!' }]
            })(
              <Select placeholder="使用状态" onChange={this.onChange}>
                <Option value={1}>可用</Option>
                <Option value={2}>不可用</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="背景图">
            {getFieldDecorator('url', {
              rules: [{ required: true, message: '请上传背景图片!' }]
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
          <FormItem>
            <Button type="primary" htmlType="submit" style={{width: '100%'}} ref='formBtn'>
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
const PhotoType = Form.create()(PhotoForm)

export default PhotoType

