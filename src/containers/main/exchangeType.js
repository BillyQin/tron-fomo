import React, { Component } from 'react';
import { message, Form, Input, Button, Breadcrumb, Upload, Modal, Icon,Select} from 'antd'
import {addExchange,editExchange,getExchange} from '../../utils/request'
import { Link } from 'react-router-dom';
import './candysType.less'
import Config from '@/../config/config'
import apiUrl from '../../config/apiUrl'

const FormItem = Form.Item
const Option = Select.Option
class ProjectForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileListUrl: [{
        uid: -1,
        url: '',
      }],
      data: {},
      status: '',
      visible: [false, false, false],
    }
  }
  handleSubmit = (e) => {
    let type = this.props.history.location.pathname.split('/').pop()
    e.preventDefault()
    let id = this.props.history.location.search.split('=').pop()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.icon = this.state.fileListUrl[0].url
        values.status = parseInt(values.status)
        type !== 'add' ? Object.assign(values,{id, id}) : values
        type !== 'add' ? values.id = parseInt(values.id) : values
        console.log(values)
        type === 'add' ?
        (addExchange(values).then(
          (data) => {
            if (data) {
              message.success('添加成功')
              this.props.history.goBack()
            }
          }
        ))
        :(editExchange(values).then(
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

  componentWillMount () {
    let type = this.props.history.location.pathname.split('/').pop()
    let id = this.props.history.location.search.split('=').pop()
    type === 'edit'?this.getData(parseInt(id)):''
  }
  getData = (id) => {
    getExchange({id:id}).then(data => {
      if (data) {
        this.setState({data:data,list:data.exchange_status})
        this.state.fileListUrl[0].url = data['icon']
        this.props.form.setFieldsValue({
          name: data['name'],
          brief: data['brief'],
          exchange_url: data['exchange_url'],
          status: data['status'],
          icon: data['icon'],
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
          <Breadcrumb.Item>{type === 'add' ? '新增': '编辑'}交易所</Breadcrumb.Item>
        </Breadcrumb>
        <Form onSubmit={this.handleSubmit} className="formRow" layout="inline">
          <FormItem label="交易所名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入交易所名称!' }]
            })(
              <Input placeholder="交易所名称" />
            )}
          </FormItem>
          <FormItem label="简介">
            {getFieldDecorator('brief', {
              rules: [{ required: true, message: '请输入简介!' }]
            })(
              <Input placeholder="简介" />
            )}
          </FormItem>
          <FormItem label="地址">
            {getFieldDecorator('exchange_url', {
              rules: [{ required: true, message: '请输入地址!' }]
            })(
              <Input placeholder="地址" />
            )}
          </FormItem>
          <FormItem label="logo">
            {getFieldDecorator('icon', {
              rules: [{ required: true, message: '请上传logo图片!' }]
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
            <Button type="primary" htmlType="submit" style={{width: '100%'}}>
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
const ProjectType = Form.create()(ProjectForm)

export default ProjectType

