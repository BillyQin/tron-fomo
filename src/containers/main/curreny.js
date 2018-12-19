import React, { Component } from 'react';
import { message, Form, Button, Modal, Radio, Input, Popconfirm } from 'antd'
import SearchTable from '@/components/SearchTable';
import {formatTime} from '@/utils/common';
import {drawList,drawCandy,candyExtractApply,candyExtractForceAudit} from '@/utils/request'
import '@/utils/MetaMask_ERC20.js';

let ref = null
const FormItem = Form.Item
const RadioGroup = Radio.Group

const curStatus = [
  {value: 0, name: ''},
  {value: 1, name: '待审核'},
  {value: 2, name: '已通过'},
  {value: 3, name: '已拒绝'},
  {value: 4, name: '转账中'}
]

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
        {
          this.state.status === 2 &&
          <FormItem>
            <span>请提币交易成功后再点击确认。</span>
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

class Curreny extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pagination: {
        current: 1,
        total: 0,
        showTotal: (total) => '共 ' + total + ' 条数据'
      },
      data: [],
      visibleY: [false, false, false],
      visibleN: [false, false, false],
      statusRow: ''
    }
  }
  options = {
    form: [
      {
        element: 'input',
        name: 'account',
        placeholder: '请输入注册账号'
      },
      {
        element: 'hidden',
        name: 'result'
      }
    ],
    table: {
      columns: [
        {
          title: '注册账户',
          dataIndex: 'account',
          key: 'account'
        },
        {
          title: '币种',
          dataIndex: 'symbol',
          key: 'symbol'
        },
        {
          title: '实际到账数量',
          dataIndex: 'gene',
          key: 'gene',
          render: (value,row) => {
            return (<span>{value+row.amount}</span>)
          }
        },
        {
          title: '手续费',
          dataIndex: 'charge',
          key: 'charge',
        },
        {
          title: '提取数量',
          dataIndex: 'amount',
          key: 'amount'
        },
        {
          title: '实际到账时间',
          dataIndex: 'updated_at',
          key: 'updated_at',
          render: (value, row) => {
            return (<span>{row.status === 1? "" : formatTime(value, true)}</span>)
          }
        },
        {
          title: '申请时间',
          dataIndex: 'created_at',
          key: 'created_at',
          render: (value) => {
            return (<span>{value? formatTime(value, true) : ''}</span>)
          }
        },
        {
          title: '提币地址',
          dataIndex: 'address',
          key: 'address'
          // render: (value) => {
          //   return (<span title={value}>{value? value.slice(0,4)+"...."+value.slice(-4) : value}</span>)
          // }
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          render: (value) => {
            return (<span>{curStatus[value].name}</span>)
          }
        },
        {
          title: '操作',
          key: 'action',
          render: (text, row, index) => (
            <span>
              {row.status === 1 || row.status === 4 ? (
                // <span style={{display:'flex',flexDirection:'column'}}>
                <span>
                  <a onClick={(e) => this.showModal(row)}>审核 </a>
                  {!row.tx_hash && <Popconfirm title={`你确定要通过该提币吗?`}  onConfirm={(e) => this.tokenTransfer(row)} onCancel={this.cancel} okText="确定" cancelText="取消">
                    <a>强制通过</a>
                  </Popconfirm>}
                </span>
              ) : (<span>{curStatus[row.status].name}</span>)
              }
            </span>
          )
        }
      ]
    }
  }

  showModal = (row) => {
    if (!row.contract_address) {
      message.error('合约地址不能为空!')
      this.props.history.push(`candyList/edit?id=${row.candy_id}`)
      return
    }
    ref = Modal.info({
      title: '提币审核',
      maskClosable: true,
      content: <MyModal submit={this.verify} row={row} index={row.id}></MyModal>,
      okText: '',
      okType: 'none'
    })
  }

  drawCandyAudio = (params, row) => {
    drawCandy(params).then((res) => {
      if (res === 'transaction unconfirmed') {
        message.info('该交易打包中，请稍后再审核')
        return 
      } else if (res === 'transaction failed') {
        message.info('该交易打包失败，请重新审核发起交易')
        return 
      } else {
        row.status = params.status
        Object.assign(this.state.data, row)
        this.setState({data: this.state.data})
      }
    })
  }

  tokenTransfer = (row) => {
    //status为2 提币状态强制设为通过
    candyExtractForceAudit({id: row.id, status: 2}).then(res => {
      row.status = 2
      Object.assign(this.state.data, row)
      this.setState({data: this.state.data})
    })
  }

  verify = (params, row) => { 
    // 审核通过则打比币
    if (params.status===2 && row.status === 1) {
      const token = new Token({
        contract_address: row.contract_address
      })
      token.transfer(row.address,row.amount, row.decimal).then((res) => {
        candyExtractApply({id: row.id, tx_hash: res.data}).then(res => {
          row.status = 4
          Object.assign(this.state.data, row)
          this.setState({data: this.state.data})
        })
      }).catch((e) => {
        message.info('提币失败，请重新发起提币')
      })
    } else {
      this.drawCandyAudio(params, row)
    }
  }

  handleVisibleChange = (visible, type, index, id) => {
    if (type > 2) {
      this.setState(prveState => {
        prveState.visibleN[index] = visible
        return {
          visible: prveState.visible
        }
      })
    } else {
      this.setState(prveState => {
        prveState.visibleY[index] = visible
        return {
          visible: prveState.visible
        }
      })
    }
  }
  search = (page, pageSize, values = null) => {
    drawList ({
      page: page,
      limit: pageSize,
      ...values
    }).then(data => {
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
      <div className={this.state.statusRow}>
        <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
      </div>
    );
  }
}

export default Curreny
