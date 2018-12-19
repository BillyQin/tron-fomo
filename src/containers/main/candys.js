import React, { Component } from 'react';
import { message, Popconfirm } from 'antd'
import SearchTable from '@/components/SearchTable';
import {candyList,candyProgress, candyStick} from '@/utils/request'
import {formatTime} from '@/utils/common';

class CandyList extends Component {
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
        placeholder: '请输入糖果名称'
      },
      {
        element: 'hidden',
        name: 'result'
      }
    ],
    table: {
      columns: [
        {
          title: '糖果名称',
          dataIndex: 'candy_symbol',
          key: 'candy_symbol'
        },
        {
          title: '所属项目',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '当前状态',
          dataIndex: 'status',
          key: 'status',
          filters: [
            { text: '领取中', value: 1 },
            { text: '未开始', value: 2 },
            { text: '已结束', value: 3 }
          ],
          filteredValue: [],
          filterMultiple: false,
          render: (value) => {
            return (<span>{value === 1? '领取中': (value === 2? '未开始':'已结束')}</span>)
          }
        },
        {
          title: '单人领取',
          dataIndex: 'quota',
          key: 'quota'
        },
        {
          title: '发放总量',
          dataIndex: 'total',
          key: 'total',
          render: (value,row) => {
            return (<span>{row.taken?(value+row.taken).toFixed(3):value}</span>)
          }
        },
        {
          title: '领取数量',
          dataIndex: 'taken',
          key: 'taken',
        },
        {
          title: '领取时间段',
          dataIndex: 'start_time',
          key: 'start_time',
          render: (value,row) => {
            return (<span>{value? formatTime(value, true) : ''}<br/>{row.end_time? formatTime(row.end_time, true) : ''}</span>)
          }
        },
        {
          title: '操作',
          key: 'action',
          render: (text, row, index) => (
            <span >
              <a className="mt-10" onClick={() => this.props.history.push('/main/candyList/edit?id='+row.id)}>编辑 </a>
              {row.status !== 3? (
                <Popconfirm title={`你确定要${row.status === 1? '结束': '开始'}该糖果吗?`} visible={this.state.visible[index]} onVisibleChange={(visible) => this.handleVisibleChange(visible, row.status, index, row.id)} onConfirm={(e) => this.operate(index, row.status, row.id)} onCancel={this.cancel} okText="确定" cancelText="取消">
                <a>{row.status === 1? '结束': '开始'}</a>
              </Popconfirm>
              ):(
                <span>已结束</span>
              )}
              {/* <a className="mt-10" onClick={() => this.props.history.push('/main/candy/detail?id='+row.id)} target="_blank"> 持有详情</a> */}
              {row.status === 1 && <a className="mt-10" onClick={() => this.setCandyStick(row.id, row.status,row.candy_symbol)}> 置顶</a>}
            </span>
          )
        }
      ]
    }
  }

  setCandyStick = (id,status,name) => {
    candyStick({id, status}).then(res => {
      message.info(`${name}置顶成功`)
    })
  }

  search = (page, pageSize, values = null) => {
    let requestData = {
      page: parseInt(page),
      limit: pageSize,
      ...values
    }
    for (let i in requestData) {
      if(i !== 'candy_symbol') {
        requestData[i] = parseInt(requestData[i])
      }
    }
    // console.log(requestData)
    candyList (requestData).then(data => {
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
  operate = (index, status, id) => {
    candyProgress({
      status: status === 2 ? 1 : 3,
      id: id
    }).then((data) => {
      if (data) {
        this.setState(prveState => {
          prveState.visible[index] = false
          prveState.data[index].status = status === 2 ? 1 : 3
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
  render() {
    return (
      <div className="">
        <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
      </div>
    );
  }
}

export default CandyList

