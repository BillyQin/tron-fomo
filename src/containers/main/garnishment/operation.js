import React, { Component } from 'react';
import { message, Form, Input, Button, Breadcrumb, Radio, Select, Col, Modal, Icon,Checkbox} from 'antd'
import {candyGarnishemnt,garnishemntLists,userCandy,candySymbolList} from '@/utils/request'
import SearchTable from '@/components/SearchTable';
import {formatTime} from '@/utils/common';

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group;

const optionsWithOper = [
  { label: '新增', value: 1 },
  { label: '扣除', value: 2 }
];

class GarnishemntOper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      status: '',
      symbolLists: [],
      selectedRowKeys: [],
      account: [],
      pagination: {
        current: 1,
        total: 0,
        showTotal: (total) => '共 ' + total + ' 条数据'
      }
    }
  }
  options = {
    form: [
      {
        element: 'input',
        name: 'account',
        placeholder: '请输入联系方式'
      }
    ],
    table: {
      columns: [
        {
          title: '帐号',
          dataIndex: 'account',
          key: 'account'
        },
        {
          title: '注册ip',
          dataIndex: 'created_ip',
          key: 'created_ip'
        },
        {
          title: '币种',
          dataIndex: 'symbol',
          key: 'symbol'
        },
        {
          title: '资产',
          dataIndex: 'total',
          key: 'total'
        }
      ]
    }
  }

  handleSubmit=(e)=>{
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.amount = parseFloat(values.amount)
        values.account = this.state.account
        candyGarnishemnt(values).then(
          (data) => {
            if (data.code === 0) {
              values.type === 1? message.success('增加成功'):message.success('扣除成功')
              this.props.history.goBack()
            }
          }
        )
      }
    })
  }

  search = (page, pageSize, values = null) => {
    if (!values.type) {
      delete values['type']
    }
    let requestData = {
      page: parseInt(page),
      limit: pageSize,
      ...values
    }
    for (let i in requestData) {
      if(i !== 'account') {
        requestData[i] = parseInt(requestData[i])
      }
    }

    userCandy (requestData).then(data => {
      this.setState({
        pagination: {
          current: data.pageNum,
          total: data.total,
          showTotal: (total) => '共 ' + total + ' 条数据'
        },
        data: data.records
      })
    })
    candySymbolList().then(res => {
      this.setState({symbolLists: res})
    })
  }

  onChange=(e)=>{
    this.setState({status:e})
  }

  onSelectChange = (selectedRowKeys) => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    const { data } = this.state
    let account = []
    data.map(item => {
      if(selectedRowKeys.includes(item.id)) {
        account.push(item.account)
      }
    })
    this.setState({ selectedRowKeys,account });
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    }
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => {this.props.history.goBack()}}>返回</Breadcrumb.Item>
          <Breadcrumb.Item>糖果新增/扣除</Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} 
          search={this.search} rowSelection={rowSelection} {...this.props}/>
        </div>
        <Form onSubmit={this.handleSubmit} className="formRow" layout="inline">
          
          <FormItem label="选择糖果">
            {getFieldDecorator('symbol', {
              rules: [{ required: true, message: '请选择使用状态!' }]
            })(
              <Select placeholder="选择糖果" onChange={this.onChange}>
                {
                  this.state.symbolLists.map(item => (
                    <Option value={item.symbol}>{item.symbol}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
          <FormItem label="操作">
            {getFieldDecorator('type', {
              rules: [{ required: true, message: '请操作!' }]
            })(
              <RadioGroup options={optionsWithOper} onChange={this.onChange1} value={this.state.value1} />
            )}
          </FormItem>
          <FormItem label="数量">
            {getFieldDecorator('amount', {
              rules: [{ required: true, message: '请输入数量!' }]
            })(
              <Input placeholder="数量" />
            )}
          </FormItem>
          <FormItem label="原因">
            {getFieldDecorator('remark', {
              rules: [{ required: true, message: '请输入原因!' }]
            })(
              <Input placeholder="原因" />
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
const PhotoType = Form.create()(GarnishemntOper)

export default PhotoType

