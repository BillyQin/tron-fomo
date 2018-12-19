import React, { Component } from 'react';
import { message,Breadcrumb } from 'antd'
import SearchTable from '@/components/SearchTable';
import {formatTime,formatQuery} from '@/utils/common';
import {inviteDetail} from '@/utils/request'

class InviteDetail extends Component {
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
      detail: {},
      userId: '',
      update: true
    },
    this.level = 1
  }
  
  options = {
    table: {
      columns: [
        {
          title: '注册帐号',
          dataIndex: 'invitee_account',
          key: 'invitee_account'
        },
        {
          title: '邀请类型',
          dataIndex: 'type',
          key: 'type',
          render: (value) => {
            return (<span>{value === 1? '注册邀请': (value === 2? '项目邀请': '未知')}</span>)
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          render: (text, row) => (
            <span>
              {
                this.level < 6 &&
                <a className="mt-10"
                  onClick={() => {
                    this.props.history.push(`/main/invite/record/${row.invitee}?level=${++this.level}`)
                  }}>
                  明细
                </a>
              }
            </span>
          )
        }
      ]
    }
  }
  
  indify = (row,status,index) => {
    inviteDetail({
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
      user_id: this.userId,
      ...values
    }
    for (let i in requestData) {
      if(i !== 'account') {
        requestData[i] = parseInt(requestData[i])
      }
    }
    inviteDetail (requestData).then(data => {
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

  getParams = (props) => {
    this.userId = props.match.params.user
    const params = formatQuery(props.history.location.search)
    this.level = params.level || 1
  }

  componentWillMount(){
    this.getParams(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.getParams(nextProps)
  }

  render() {
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => {this.props.history.goBack()}}>返回</Breadcrumb.Item>
          <Breadcrumb.Item >第{this.level>0?this.level:1}级邀请用户</Breadcrumb.Item>
        </Breadcrumb>
        <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
      </div>
    );
  }
}

export default InviteDetail
