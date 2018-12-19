import React, { Component } from 'react';
import { message, Popconfirm } from 'antd'
import SearchTable from '../../components/SearchTable';
import {taskList,candyProgress} from '../../utils/request'
// import { Link } from 'react-router-dom';
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
    buttons: [
      {
        text: '新增',
        onClick: () => this.props.history.push('/main/taskList/add')
      }
    ],
    table: {
      columns: [
        {
          title: '所属项目',
          dataIndex: 'item_name',
          key: 'item_name'
        },
        {
          title: '任务名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '任务周期',
          dataIndex: 'end_time',
          key: 'end_time',
          render: (value, row) => {
            return (<span>{formatTime(row.start_time, true)}<br/>至<br/>{formatTime(value, true)}</span>)
          }
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
          title: '任务激励',
          dataIndex: 'quota',
          key: 'quota',
          // render: (value,row) => {
          //   return (<span>{row.taken?value+row.taken:value}</span>)
          // }
        },
        {
          title: '完成人数',
          dataIndex: 'finish_count',
          key: 'finish_count',
        },
        {
          title: '操作',
          key: 'action',
          render: (text, row, index) => (
            <span >
              <a className="mt-10" onClick={() => this.props.history.push('/main/taskList/edit?id='+row.id)}>编辑 </a>
              <a className="mt-10" onClick={() => this.props.history.push('/main/task/detail?id='+row.id)} target="_blank"> 明细</a>
            </span>
          )
        }
      ]
    }
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
    taskList (requestData).then(data => {
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

