import React, { Component } from 'react';
import { message } from 'antd'
import SearchTable from '@/components/SearchTable';
import {formatTime} from '@/utils/common';
import {inviteLists} from '@/utils/request'

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
      showV: '',
      visible: [false, false, false],
      detail: {}
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
          title: '帐号',
          dataIndex: 'account',
          key: 'account_table'
        },
        {
          title: '邀请用户数',
          dataIndex: 'count',
          key: 'count'
        },
        {
          title: '代理状态',
          dataIndex: 'is_agent',
          key: 'is_agent',
          filters: [
            { text: '代理中', value: 2 },
            { text: '非代理', value: 1 }
          ],
          filteredValue: [],
          filterMultiple: false,
          render: (value) => {
            return (<span>{value === 1? '非代理': (value === 2? '代理中': '未知')}</span>)
          }
        },
        {
          title: '操作',
          key: 'action',
          dataIndex: 'action',
          render: (text, row) => (
            <span>
              <a className="mt-10"
                onClick={() => this.props.history.push(`/main/invite/record/${row.user_id}`)}
              >明细</a>
            </span>
          )
        }
      ]
    }
  }

  indify = (row,status,index) => {
    indify({
      id: row.id,
      status: status
    }).then(
      (data) => {
        if (data) {
          if (status === 2) {
            message.success('审核通过')
          } else if (status === 3) {
            message.error('已拒绝')
          }
          row.status = status
          row.audit_at = formatTime(data,true)
          this.setState({showV: 'comment'+row.id})
        }
      }
    )
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
    inviteLists (requestData).then(data => {
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
      <div>
        <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
      </div>
    );
  }
}

export default RecordLists
