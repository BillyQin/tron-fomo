import React, { Component } from 'react';
import { message, Form, Modal, Input, Button } from 'antd'
import SearchTable from '@/components/SearchTable';
import { exclusiveCreate,exclusiveEdit,exclusiveList, ipProgress, exclusiveLog } from '@/utils/request';
import {formatTime} from '@/utils/common';

let ref = null
const FormItem = Form.Item

class AddForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      quota: 0,
      total: 0,
      taken: 0
    }
  }
  
  handleSubmit = () => {
    const { quota, total } = this.state 
    const { submit } = this.props 
    ref.destroy()
    submit({quota, total, row:this.props.row})
  }

  componentWillMount() {
    const { row } = this.props
    const { quota, total, taken } = row
    this.setState({
      quota, total, taken
    }) 
  }

  render () {
    return (
      <Form className="formModal" >
        {/* <div style={{flexDirection:'column',display:'flex',justifyContent:'center',alignItems:'flex-end'}}> */}
        <FormItem label="单人领取">
          <Input type='num' value={this.state.quota} onChange={(e)=>{this.setState({quota: parseFloat(e.target.value)||0})}}/>
        </FormItem>
        <FormItem label=" 总数量 ">
          <Input type='num' value={this.state.total} onChange={(e)=>{this.setState({total: parseFloat(e.target.value-this.state.taken)})}}/>
        </FormItem>
        {/* </div> */}
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

class IpManage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pagination: {
        current: 1,
        total: 0,
        showTotal: (total) => '共 ' + total + ' 条数据'
      },
      data: [],
      logData: [],
      detail: {},
      visible: [false, false, false],
    }
  }
  logOptions = {
    table: {
      columns: [
        {
          title: '单人领取',
          dataIndex: 'quota',
          key: 'quota'
        },
        {
          title: '总数量',
          dataIndex: 'total',
          key: 'total',
          render: (value, row) => (
            <span>
              {value+row.taken}
            </span>
          )
        },
        {
          title: '已领取',
          dataIndex: 'taken',
          key: 'taken'
        },
        {
          title: '领取人数',
          dataIndex: 'finish_count',
          key: 'finish_count'
        },
        {
          title: '操作',
          key: 'time',
          render: (row) => (
            <span>
              {
                row.id === 0?
                <a className="mt-10" onClick={()=>this.showModal(row)}>新增</a>:
                <a className="mt-10" onClick={()=>this.showModal(row)}>编辑</a>
              }
            </span>
          )
        }
      ]
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
          title: '账号',
          dataIndex: 'account',
          key: 'account'
        },
        // {
        //   title: '微信昵称',
        //   dataIndex: 'wx_id',
        //   key: 'wx_id'
        // },
        {
          title: '领取数量',
          dataIndex: 'amount',
          key: 'amount'
        },
        {
          title: '邀请人',
          dataIndex: 'inviter_account',
          key: 'inviter_account'
        },
        {
          title: '领取时间',
          dataIndex: 'updated_at',
          key: 'updated_at',
          render: (value) => {
            return (<span>{value? formatTime(value, true) : ''}</span>)
          }
        }
      ]
    }
  }

  operate = (index, status, ip) => {
    ipProgress({
      ip,
      status: status === 2 ? 1 : 2
    }).then((data) => {
      if (data) {
        this.setState(prveState => {
          prveState.visible[index] = false
          prveState.data[index].status = status === 2 ? 1 : 2
          return {
            visible: prveState.visible,
            data: prveState.data
          }
        })
      } else {
        message.error('操作不成功，请联系管理员')
        return true
      }
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

  search = (page, pageSize, ip=null) => {
    exclusiveList({
      page: page,
      limit: pageSize,
      ...ip
    }).then(data => {
      this.setState({
        logData: [data]
      })
    })

    exclusiveLog({
      page: page,
      limit: pageSize,
      ...ip
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

  showModal = (row) => {
    ref = Modal.info({
      title: '编辑专属邀请',
      maskClosable: true,
      content: <MyModal submit={this.editSubmit} row={row}></MyModal>,
      okText: '',
      okType: 'none'
    })
  }

  editSubmit = (params) => {
    const { total, quota, row } = params
    const {id, taken} = row
    id ? 
    (exclusiveEdit({
      total,
      quota,
      id, 
      symbol: 'CT',
      taken
    }).then(() => {
      let logData = this.state.logData
      Object.assign(logData[0],{total,quota,taken})
      this.setState({logData})
      message.info('编辑成功')
    })):
    (exclusiveCreate({
      total,
      quota,
      symbol: 'CT',
      taken
    }).then(() => {
      this.search(1,7)
      message.info('创建成功')
    }))
  }

  render() {
    return (
      <div>
        <SearchTable options={this.logOptions} data={this.state.logData} pagination={this.state.pagination} {...this.props}/>
        <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
      </div>
    );
  }
}

export default IpManage

