import React, { Component } from 'react';
import { message, Form, Input, Button, Breadcrumb, Upload, Select, Modal, Icon } from 'antd'
import Editor from 'react-umeditor';
import Config from '@/../config/config'
import apiUrl from '../../../config/apiUrl'
import { creteNew } from '../../../utils/request';

const FormItem = Form.Item

class CreteNews extends Component {
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
          editor:'',
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
        this.setState({editor:e})
    }

    //提交
    handleSubmit=(e)=>{
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            values.icon = this.state.fileListUrl[0].url
            values.type = parseInt(values.type)
            values.prospectus = this.state.editor
            creteNew(values).then(
                  (data) => {
                    console.log(data)
                    if (data.code === 0) {
                      message.success('添加成功')
                      this.props.history.goBack()
                    }
                }
            )
            console.log(values)
          }
        })
    }

    render() {
        let icons = this.getIcons();
        // 如果你是本地上传，请调用下面这行代码
		var uploader = this.getDefaultUploader();
		// 注意上传接口的返回值，应该是 {'data': {'image_src': xxx} , 'status':'success'}
		let plugins = {
			image:{
				uploader:uploader
			}
		}
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
                <Breadcrumb.Item>新增资讯</Breadcrumb.Item>
            </Breadcrumb>
            <Form onSubmit={this.handleSubmit} className="formRow" layout="inline">
                <FormItem label="名称">
                    {getFieldDecorator('title', {
                    rules: [{ required: true, message: '请输入游戏名称!' }]
                    })(
                    <Input placeholder="title" />
                    )}
                </FormItem>
                <FormItem label="资讯链接">
                    {getFieldDecorator('Url', {
                    rules: [{ required: true, message: '请输入资讯链接!' }]
                    })(
                    <Input placeholder="url" />
                    )}
                </FormItem>
                <FormItem label="资讯type">
                    {getFieldDecorator('type', {
                    rules: [{ required: true, message: '资讯type!' }]
                    })(
                    <Input placeholder="1~5" />
                    )}
                </FormItem>
                <FormItem label="资讯来源">
                    {getFieldDecorator('origin', {
                    rules: [{ required: true, message: '请输入资讯来源!' }]
                    })(
                    <Input placeholder="资讯来源" />
                    )}
                </FormItem>
                <FormItem label="资讯logo">
                    {getFieldDecorator('icon', {
                    rules: [{ required: true, message: '请上传资讯logo!' }]
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
                
                {/* <FormItem> */}
                    <p>项目介绍：</p>
                    <Editor style={{ marginBottom: 30 }} ref="editor" icons={icons} plugins={plugins} onChange={(e)=>this.onChange(e)} value={this.state.editor}/>
                    <Button type="primary" htmlType="submit" style={{width: '100%'}} ref='formBtn'>
                    提交
                    </Button>
                {/* </FormItem> */}
            </Form>
            
          </div>
        );
      }

}
const CreteNewsType = Form.create()(CreteNews)
export default CreteNewsType