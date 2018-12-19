import React, { Component } from 'react';
import { message, Form } from 'antd'
import SearchTable from '../../components/SearchTable';
import {drawCandyList} from '../../utils/request'
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
        name: 'account',
        placeholder: '请输入注册账户'
      },
      {
        element: 'hidden',
        name: 'result'
      }
    ],
    table: {
      columns: [
        {
          title: '领取用户',
          dataIndex: 'account',
          key: 'account'
        },
        {
          title: '糖果',
          dataIndex: 'symbol',
          key: 'symbol'
        },
        {
          title: '领取时间',
          dataIndex: 'draw_at',
          key: 'draw_at',
          render: (value) => {
            return (<span>{value? formatTime(value, true) : ''}</span>)
          }
        },
        {
          title: '领取数量',
          dataIndex: 'amount',
          key: 'amount'
        },
        {
          title: '邀请人',
          dataIndex: 'inviter_name',
          key: 'inviter_name',
        },
      ]
    }
  }
  operate = (index, status, id) => {
    operateUser({
      status: status,
      user_id: id
    }).then((data) => {
      if (data) {
        this.setState(prveState => {
          prveState.visible[index] = false
          prveState.data[index].status = status
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
  search = (page, pageSize, values = null) => {
    
    drawCandyList ({
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
      <div className=''>
        <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
      </div>
    );
  }
}

export default CandyList

