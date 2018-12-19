import React, { Component } from 'react';
import { Button,Input,Select,Form,Modal,message,Spin} from 'antd'
import SearchTable from '@/components/SearchTable';
import {formatTime} from '@/utils/common';
import {candyLogLists,candyLogExcel,candySymbolList} from '@/utils/request'
import pageData from '@/utils/pageData'
const Option = Select.Option
const FormItem = Form.Item
const candyType = [
  {type: 0, name: '全部', unit: ''},
  {type: 1, name: '邀请奖励', unit: '+'},
  {type: 2, name: '被邀请奖励', unit: '+'},
  {type: 3, name: '领取', unit: '+'},
  {type: 4, name: '提币', unit: '-'},
  {type: 5, name: '项目分享获得糖果', unit: '+'},
  {type: 6, name: '完成任务获得糖果', unit: '+'},
  {type: 7, name: '任务上层奖励糖果', unit: '+'},
  {type: 8, name: '兑换减少糖果', unit: '-'},
  {type: 9, name: '兑换增加糖果', unit: '+'},
  {type: 10, name: '转出糖果', unit: '-'},
  {type: 11, name: '转入糖果', unit: '+'},
  {type: 12, name: '平台发放糖果', unit: '+'},
  {type: 13, name: '平台扣除糖果', unit: '-'},
  {type: 14, name: '专属邀请领取糖果', unit: '+'},
  {type: 15, name: '手续费', unit: '-'}
]
let ref = null

class AddForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      symbol: '',
      symbolLists: []
    }
  }
  
  handleSubmit = () => {
    const { account, symbol } = this.state 
    const { submit } = this.props
    if (account.length !== 11 || !account.startsWith('1')) {
      message.info('请输入正确的手机号')
      return
    }
    if (!symbol) {
      message.info('请选择糖果类型')
      return
    }
    ref.destroy()
    submit({account, symbol})
  }

  componentWillMount() {
    candySymbolList().then(res => {
      this.setState({symbolLists: res})
    })
  }

  render () {
    return (
      <Form className="formModal" >
        <FormItem label="手机号码">
          <Input type='text' value={this.state.account} onChange={(e)=>{this.setState({account: e.target.value})}}/>
        </FormItem>
        <FormItem label="选择糖果">
          <Select placeholder="选择糖果" style={{width: '170px'}} onChange={(e)=>{this.setState({symbol: e})}}>
            {
              this.state.symbolLists && this.state.symbolLists.map(item => (
                <Option value={item.symbol}>{item.symbol}</Option>
              ))
            }
          </Select>
        </FormItem>
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

class RecordLists extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pagination: {
        current: 1,
        total: 0,
        showTotal: (total) => '共 ' + total + ' 条数据'
      },
      data: [],
      account: '',
      type: '',
      loading: false
    }
  }
  options = {
    buttons: [
      {
        text: '新增/扣除',
        onClick: () => {
          const { history } = this.props
          history.push('/main/garnishemnt/oper')
        }
      },
      {
        text: '下载列表',
        onClick: () => {
          this.showModal()
        }
      },
      {
        text: '新增/扣除Excel',
        onClick: () => {
          const { history } = this.props
          history.push('/main/garnishemnt/new')
        }
      },
    ],
    table: {
      columns: [
        {
          title: '帐号',
          dataIndex: 'account',
          key: 'account'
        },
        {
          title: '事件',
          dataIndex: 'type',
          key: 'type',
          render: (value) => {
            return (<span>{candyType[value]? candyType[value].name : ''}</span>)
          }
        },
        {
          title: '币种',
          dataIndex: 'candy_symbol',
          key: 'candy_symbol'
        },
        {
          title: '数量',
          dataIndex: 'amount',
          key: 'amount',
          render: (value, row) => {
            return (<span>{candyType[row.type]?candyType[row.type].unit:''}{value}</span>)
          }
        },
        {
          title: '时间',
          dataIndex: 'updated_at',
          key: 'updated_at',
          render: (value) => {
            return (<span>{formatTime(value,true)}</span>)
          }
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          render: (value, row) => {
            return (<span>{this.getStatusName(row)}</span>)
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark'
        }
      ]
    }
  }

  downloadExcel = (param) => {
    this.setState({loading: true})
    candyLogExcel(param).then(res => {
      if (res === 'data installing!') {
        setTimeout(() => {
          this.downloadExcel(param)
        }, 2000)
      } else {
        window.location.href = res
        this.setState({loading: false})
      }
    }).catch(e => {
      this.setState({loading: false})
    })
  }

  getStatusName = (row) => {
    if (row.type === 4 ) {
      switch(row.status) {
        case 1: return '申请中';
        case 2: return '审核通过';
        case 3: return '审核不通过';
        default: return ''
      }
    } else {
      return '完成'
    }
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

    candyLogLists (requestData).then(data => {
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

  query = () => {
    const { account, type } = this.state
    const { history } = this.props
    pageData.save(history, {
      page: 1, 
      account, 
      type
    }, 'query')

    this.search(parseInt(this.state.pagination.current), 7, 
    {account, type})
  }

  showModal = (row) => {
    ref = Modal.info({
      title: '下载列表',
      maskClosable: true,
      content: <MyModal submit={this.downloadExcel} ></MyModal>,
      okText: '',
      okType: 'none'
    })
  }

  render() {
    return (
      <div>
        <Spin spinning={this.state.loading} tip="正在生成文件...">
          <Form layout="inline">
            <div className="search-table-head">
              {
                <div className="search-form">
                  <Form.Item>
                    <Input placeholder="请输入账号" value={this.state.account} onChange={(e) => this.setState({account: e.target.value})}/>
                  </Form.Item>
                  <Form.Item>
                    <Select placeholder="选择事件" defaultValue={candyType[0].value} onChange={(e) => this.setState({type: e})}>
                      {
                        candyType.map((item,key) => (
                          <Option key={key} value={item.type}>{item.name}</Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                  <Button type="primary" onClick={() => {this.query()}} style={{marginLeft: '10px'}}>查询</Button>
                </div>
              }
            </div>
          </Form>
          <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
        </Spin>
      </div>
    );
  }
}

export default RecordLists
