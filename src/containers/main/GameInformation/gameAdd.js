import React, { Component } from 'react';
import { message, Form, Input, Button, Breadcrumb, Upload, Select, Modal, Icon } from 'antd'
import Config from '@/../config/config'
import apiUrl from '../../../config/apiUrl'
import { addGame } from '../../../utils/request';


const FormItem = Form.Item
class AddGame extends Component {

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
    onChange=(e)=>{
        console.log(e)
        this.setState({status:e})
    }
    //提交
    handleSubmit=(e)=>{
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            values.icon = this.state.fileListUrl[0].url
            values.type = parseInt(values.type)
            addGame(values).then(
                  (data) => {
                    console.log(data)
                    if (data.code === 0) {
                      message.success('添加成功')
                      this.props.history.goBack()
                    }
                }
            )
            console.log(values.type)
          }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form
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
          <div className="">
            <Breadcrumb>
                <Breadcrumb.Item onClick={() => {this.props.history.goBack()}}>返回</Breadcrumb.Item>
                <Breadcrumb.Item>新增游戏</Breadcrumb.Item>
            </Breadcrumb>
            <Form onSubmit={this.handleSubmit} className="formRow" layout="inline">
                <FormItem label="名称">
                    {getFieldDecorator('title', {
                    rules: [{ required: true, message: '请输入游戏名称!' }]
                    })(
                    <Input placeholder="title" />
                    )}
                </FormItem>
                <FormItem label="游戏链接">
                    {getFieldDecorator('link', {
                    rules: [{ required: true, message: '请输入游戏链接!' }]
                    })(
                    <Input placeholder="url" />
                    )}
                </FormItem>
                <FormItem label="游戏星级">
                    {getFieldDecorator('type', {
                    rules: [{ required: true, message: '请输入游戏星级!' }]
                    })(
                    <Input placeholder="1~5" />
                    )}
                </FormItem>
                <FormItem label="游戏介绍">
                    {getFieldDecorator('brief', {
                    rules: [{ required: true, message: '请输入游戏简介!' }]
                    })(
                    <Input placeholder="游戏简介" />
                    )}
                </FormItem>
                <FormItem label="游戏logo">
                    {getFieldDecorator('icon', {
                    rules: [{ required: true, message: '请上传游戏logo!' }]
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
        );
      }
}
const AddGameType = Form.create()(AddGame)
export default AddGameType