import React, { Component } from 'react';
import { message, Popconfirm } from 'antd'
import SearchTable from '@/components/SearchTable';
import {coverProgress, itemProgress,downExcel,coverLists} from '@/utils/request'

class redeemManage extends Component {
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
        name: 'candy_symbol',
        placeholder: '请输入基准资产名称'
      }
    ],
    buttons: [
      {
        text: '新增',
        onClick: () => {
            const { history } = this.props
            history.push('/main/covert/edit')
        }
      }
    ],
    table: {
        columns: [
        {
            title: '基准资产',
            dataIndex: 'base_symbol',
            key: 'base_symbol'
        },
        {
            title: '目标资产',
            dataIndex: 'target_symbol',
            key: 'target_symbol'
        },
        {
            title: '兑换比例',
            dataIndex: 'rate',
            key: 'rate',
            render: (value) => {
            return (<span>{`1:${value}`}</span>)
            }
        },
        {
            title: '当前状态',
            dataIndex: 'status',
            key: 'status',
            filters: [
            { text: '不可兑换', value: 2 },
            { text: '可兑换', value: 1 }
            ],
            filteredValue: [],
            filterMultiple: false,
            render: (value) => {
            return (<span>{value>1 ? '不可兑换' : '可兑换'}</span>)
            }
        },
        {
            title: '兑换总数',
            dataIndex: 'total',
            key: 'total'
        },
        {
            title: '已兑换',
            dataIndex: 'taken',
            key: 'taken',
        },
        {
            title: '操作',
            key: 'action',
            render: (value,row, index) => (
            <span>
                <a className="mt-10" onClick={() => this.props.history.push(`/main/covert/edit?id=${row.id}`)} target="_blank">编辑 </a>
                <Popconfirm title={`你确定要${row.status>1 ? '开启':'暂停'}该兑换吗?`} visible={this.state.visible[index]} onVisibleChange={(visible) => this.handleVisibleChange(visible, row.status, index, row.id)}
                 onConfirm={(e) => this.operate(index, row.status, row.id)} onCancel={this.cancel} okText="确定" cancelText="取消">
                <a>{row.status>1 ?'开启 ':' 暂停 '}</a>
                </Popconfirm>
                <a className="mt-10" onClick={() => this.props.history.push('/main/covert-review?convert_symbol='+row.base_symbol+'&converted_symbol=CT')} target="_blank">明细</a>
            </span>
            )
        }
        ]
    }
  }

  downUsers=(name,id)=>{
    downExcel({item_id:id}).then(data=>{
      if (data) {
        window.location = data
      } else {
      }
    })
  }
  
  operate = (index, status, id) => {
    coverProgress({
      status: status === 2 ? 1 : 2,
      id: id
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

  search = (page, pageSize, values = null, filters) => {
    let requestData = {
      page: parseInt(page),
      limit: pageSize,
      ...values
    }
    for (let i in requestData) {
      if(i !== 'candy_symbol' && i !== 'symbol') {
        requestData[i] = parseInt(requestData[i])
      }
    }
    coverLists(requestData).then(data => {
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
      <div className="">
        <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
      </div>
    );
  }
}

export default redeemManage
