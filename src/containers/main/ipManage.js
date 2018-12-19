import React, { Component } from 'react';
import { message, Popconfirm } from 'antd'
import SearchTable from '@/components/SearchTable';
import { ipLists, ipProgress } from '@/utils/request';

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
      detail: {},
      visible: [false, false, false],
    }
  }
 
  options = {
    form: [
      {
        element: 'input',
        name: 'ip',
        placeholder: '请输入ip地址'
      },
      {
        element: 'hidden',
        name: 'result'
      }
    ],
    table: {
      columns: [
        {
          title: 'IP地址',
          dataIndex: 'ip',
          key: 'ip'
        },
        {
          title: '24H注册用户数',
          dataIndex: 'recent_count',
          key: 'recent_count'
        },
        {
          title: '累计注册用户',
          dataIndex: 'total',
          key: 'total'
        },
        {
          title: '当前状态',
          dataIndex: 'status',
          key: 'status',
          render: (text, row) => (
            <span>{row.status>1 ? '封禁' : '正常'}</span>
          )
        },
        {
          title: '操作',
          key: 'action',
          render: (text, row, index) => (
            <span>
              <Popconfirm title={`你确定要${row.status>1 ? '解封' : '封禁'}该IP吗?`} visible={this.state.visible[index]} onVisibleChange={(visible) => this.handleVisibleChange(visible, row.status, index, row.admin_id)} onConfirm={(e) => this.operate(index, row.status, row.ip)} onCancel={this.cancel} okText="确定" cancelText="取消">
                <a>{row.status>1 ? '解封' : '封禁'}</a>
              </Popconfirm>
            </span>
          )
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
    ipLists({
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

  render() {
    return (
      <div>
        <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
      </div>
    );
  }
}

export default IpManage

