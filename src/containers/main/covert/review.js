import React, { Component } from 'react';
import { message, Radio,Form,Modal,Button,Input } from 'antd'
import SearchTable from '@/components/SearchTable';
import {candyCoverAudit,candyCoverLists} from '@/utils/request'
import 'moment/locale/zh-cn'
import {formatTime} from '@/utils/common';
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

class redeemReview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pagination: {
        current: 1,
        total: 0,
        showTotal: (total) => '共 ' + total + ' 条数据'
      },
      data: [],
      detail: {},
      visible: [false, false, false],
      show:'',
    },
    this.symbol = ''
  }
  
  options = {
    form: [
      {
        element: 'input',
        name: 'account',
        placeholder: '请输入用户'
      },
      {
        element: 'hidden',
        name: 'result'
      }
    ],
    table: {
      columns: [
        {
          title: '用户',
          dataIndex: 'account',
          key: 'account'
        },
        {
          title: '兑换时间',
          dataIndex: 'updated_at',
          key: 'updated_at',
          render: (value) => {
            return (<span>{formatTime(value, true)}</span>)
          }
        },
        {
          title: '交易对',
          dataIndex: 'convert_symbol',
          key: 'convert_symbol',
          render: (value,row) => {
            return (<span>{`${value}/${row.converted_symbol}`}</span>)
          }
        },
        {
          title: '基准资产数量',
          dataIndex: 'amount',
          key: 'amount'
        },
        {
          title: '兑换资产数量',
          dataIndex: 'target_amount',
          key: 'target_amount1'
        },
        // {
        //   title: '费率',
        //   dataIndex: 'charge',
        //   key: 'charge'
        // },
        {
          title: '实际到账',
          dataIndex: 'target_amount',
          key: 'target_amount'
        },
        {
          title: '审核状态',
          dataIndex: 'status',
          key: 'status',
          filters: [
            { text: '审核未通过', value: 3 },
            { text: '审核通过', value: 2 },
            { text: '未审核', value: 1 }
          ],
          filteredValue: [],
          filterMultiple: false,
          render: (value) => (
            <span>{value === 1 ? '未审核' : (value === 2 ? '审核通过' : '审核未通过')}</span>
          )
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

  operate = (status, id,index) => {
    candyCoverAudit({
      id,
      status
    }).then((res) => {
      if (res) {
        let data = this.state.data
        data[index].status = status
        this.setState({data})
      } else {
        message.error('操作不成功，请联系管理员')
        return true
      }
    })
  }

  showModal = (row) => {
    ref = Modal.info({
      title: '兑换审核',
      maskClosable: true,
      content: <MyModal submit={this.verify} row={row} index={row.id}></MyModal>,
      okText: '',
      okType: 'none'
    })
  }

  verify = (params, row) => {
    candyCoverAudit(params).then(() => {
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

  search = (page, pageSize,values) => {
    let params = {
      page: page,
      limit: pageSize,
      ...values
    }
   
    candyCoverLists (params).then(data => {
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
      <div className={this.state.show}>
        <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
      </div>
    );
  }
}

export default redeemReview

