import React, { Component } from 'react';
import { Form, Radio, Input, Modal, Button } from 'antd'
import SearchTable from '@/components/SearchTable';
import {transformAudit,transformLists} from '@/utils/request'
import { formatTime } from '@/utils/common';

const FormItem = Form.Item
const RadioGroup = Radio.Group
let ref = null

class AddForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 2,
      reason: ''
    }
  }
  
  handleSubmit = () => {
    const { status, reason } = this.state 
    const { submit } = this.props 
    ref.destroy()
    submit({id: this.props.index, status, reason},this.props.row)
  }
  
  onChange = (e) => {
    this.setState({
      status: e.target.value,
    });
  }

  render () {
    return (
      <Form className="formModal">
        <FormItem label="审核">
          <RadioGroup onChange={this.onChange} value={this.state.status}>
            <Radio value={2}>通过</Radio>
            <Radio value={3}>拒绝</Radio>
          </RadioGroup>
        </FormItem>
        {
          this.state.status === 3 &&
          <FormItem label="原因">
            <Input placeholder="请输入拒绝原因" maxLength={20} onChange={(e) => this.setState({reason: e.target.value})}/>
            <span>最多20个汉字(含字符)</span>
          </FormItem>
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

class Convert extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pagination: {
        current: 1,
        total: 0,
        showTotal: (total) => '共 ' + total + ' 条数据'
      },
      visible: [false, false, false],
      data: []
    }
  }
  
  options = {
    form: [
      {
        element: 'input',
        name: 'account',
        placeholder: '请输入联系方式'
      },
      {
        element: 'hidden',
        name: 'result'
      }
    ],
    table: {
      columns: [
        {
          title: '账号',
          dataIndex: 'account',
          key: 'account'
        },
        {
          title: '转让时间',
          dataIndex: 'updated_at',
          key: 'updated_at',
          render: (value) => {
            return (<span>{value? formatTime(value, true) : ''}</span>)
          }
        },
        {
          title: '转让账户',
          dataIndex: 'target_account',
          key: 'target_account'
        },
        {
          title: '转让币种',
          dataIndex: 'symbol',
          key: 'symbol'
        },
        {
          title: '转让数量',
          dataIndex: 'amount',
          key: 'amount'
        },
        {
          title: '手续费',
          dataIndex: 'charge',
          key: 'charge'
        },
        {
          title: '实际到账',
          dataIndex: 'target_amount',
          key: 'target_amount'
          // render: (value,row) => {
          //   return (<span>{parseFloat(row.amount-row.charge)}</span>)
          // }
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          filteredValue: [],
          filterMultiple: false,
          render: (value) => {
            return (<span>{value===1 ? '待审核' : value===2?'审核通过':'拒绝转让'}</span>)
          }
        },
        {
          title: '操作',
          key: 'action',
          render: (text, row) => (
            <span>
              {row.status === 1 ? (
                <span>
                  <a onClick={(e) => this.showModal(row)}>审核 </a>
                </span>
              ) : (<span>{row.status === 2?'已通过':'已拒绝'}</span>)}
            </span>
          )
        }
      ]
    }
  }

  showModal = (row) => {
    ref = Modal.info({
      title: '转让审核',
      maskClosable: true,
      content: <MyModal submit={this.verify} row={row} index={row.id}></MyModal>,
      okText: '',
      okType: 'none'
    })
  }

  verify = (params, row) => {
    transformAudit(params).then(() => {
      row.status = params.status
      Object.assign(this.state.data, row)
      this.setState({data: this.state.data})
    })
  }

  handleVisibleChange = (visible, type, index, id) => {
    this.setState(prveState => {
      prveState.visible[index] = visible
      return {
        visible: prveState.visible
      }
    })
  }

  operate = (status, id, index) => {
    transformAudit({status,id}).then(res => {
      let data = this.state.data
      data[index].status = status
      this.setState({data})
    })
  }

  search = (page, pageSize, values = null) => {
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
    transformLists (requestData).then(data => {
      this.setState({
        pagination: {
          current: data.pageNum,
          total: data.total,
          showTotal: (total) => '共 ' + total + ' 条数据'
        },
        data: data.records
      })
    })
  }
 
  render() {
    return (
      <div className={this.state.visible}>
        <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
      </div>
    );
  }
}

export default Convert
