import React, { Component } from 'react';
import { message, Form, Input, Button, Breadcrumb,Select} from 'antd'
import {coverEdit,coverCreate,candySymbolList,coverDetail} from '@/utils/request'

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
      symbolLists: []
    }
    this.id = 0
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.minimum = parseFloat(values.minimum)
        values.rate = parseFloat(values.rate)
        values.maximum = parseFloat(values.maximum)
        values.total = parseFloat(values.total)
        values.target_symbol = 'CT'
        if (this.id) {
          values.id = this.id
          coverEdit(values).then(
            (data) => {
              if (data) {
                message.success('编辑成功')
                this.props.history.goBack()
              }
            }
          )
        } else {
          coverCreate(values).then((data) => {
            if (data) {
              message.success('添加成功')
              this.props.history.goBack()
            }}
          )
        }
      }
    })
  }

  componentWillMount () {
    candySymbolList().then(res => {
      this.setState({symbolLists: res})
    })
  }

  componentDidMount () {
    this.id = parseInt(this.props.history.location.search.split('=').pop()) || 0
    if (this.id) {
      this.getData(parseInt(this.id))
    }
  }

  getData = (id) => {
    coverDetail({id}).then(data => {
      console.log(data)
      if (data) {
        this.props.form.setFieldsValue({
          base_symbol: data.base_symbol,
          target_symbol: data.target_symbol,
          rate: data.rate,
          minimum: data.minimum,
          maximum: data.maximum,
          total: data.total
        })
      }
    })
  }

  handleCancel = () => this.setState({ previewVisible: false })

  changeUrl = (file) => {
    let fileListUrl = [{
      uid: -1,
      url: file.data,
    }]
    this.setState({fileListUrl: fileListUrl})
  }
  
  

  render () {
    const { getFieldDecorator } = this.props.form
    let type = this.props.history.location.pathname.split('/').pop()
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => {this.props.history.goBack()}}>返回</Breadcrumb.Item>
          <Breadcrumb.Item>兑换{this.id ? '编辑':'新增'}</Breadcrumb.Item>
        </Breadcrumb>
        <Form onSubmit={this.handleSubmit} className="formRow" layout="inline">
          <FormItem label="基准资产">
            {getFieldDecorator('base_symbol', {
              rules: [{ required: true, message: '请选择基准资产!' }]
            })(
              <Select style={{ width: 120 }}>
                {this.state.symbolLists.map((item,key) => (
                  <Option value={item.symbol} key={key}>{item.symbol}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="目标资产">
            {getFieldDecorator('target_symbol', {
            })(
              // <Input placeholder="目标资产" value="CT" defaultValue="CT" />
              <span>CT</span>
            )}
          </FormItem>
          <FormItem label="兑换比例">
            {getFieldDecorator('rate', {
              rules: [{ required: true, message: '请输入兑换比例!' }]
            })(
              <Input type="number" placeholder="兑换比例" />
            )}
          </FormItem>
          <FormItem label="最低兑换">
            {getFieldDecorator('minimum', {
              rules: [{ required: true, message: '请输入最低兑换!' }]
            })(
              <Input type="number" placeholder="最低兑换" />
            )}
          </FormItem>
          <FormItem label="最高兑换">
            {getFieldDecorator('maximum', {
              rules: [{ required: true, message: '请输入最高兑换!' }]
            })(
              <Input type="number" placeholder="最高兑换" />
            )}
          </FormItem>
          {/* <FormItem label="兑换费率">
            {getFieldDecorator('exchange_url', {
              rules: [{ required: true, message: '请输入地址!' }]
            })(
              <Input placeholder="兑换费率" />
            )}
          </FormItem> */}
          <FormItem label="兑换总额">
            {getFieldDecorator('total', {
              rules: [{ required: true, message: '请输入兑换总额!' }]
            })(
              <Input type="number" placeholder="兑换总额" />
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

