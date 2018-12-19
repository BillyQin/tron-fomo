import React, { Component } from 'react';
import { message } from 'antd'
import SearchTable from '@/components/SearchTable';
import {messageList,messageDelete} from '@/utils/request'
import { formatTime } from '@/utils/common';

class ProjectList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pagination: {
        current: 1,
        total: 0,
        showTotal: (total) => '共 ' + total + ' 条数据'
      },
      visible: 'visible',
      data: []
    }
  }
 
  options = {
    form: [
      {
        element: 'input',
        name: 'title',
        placeholder: '请输入标题'
      },
      {
        element: 'hidden',
        name: 'result'
      }
    ],
    buttons: [
      {
        text: '新增',
        onClick: () => {
          const { history } = this.props
          history.push('/main/message/edit')
        }
      }
    ],
    table: {
      columns: [
        {
          title: '标题',
          dataIndex: 'title',
          key: 'title'
        },
        {
          title: '修改时间',
          dataIndex: 'updated_at',
          key: 'updated_at',
          render: (value) => {
            return (<span>{value? formatTime(value, true) : ''}</span>)
          }
        },
        {
          title: '操作',
          key: 'action',
          render: (row) => (
            <span>
              <a className="mt-10" onClick={() => this.props.history.push('/main/message/edit?id='+row.id)} target="_blank">编辑 </a>
              <a className="mt-10" onClick={() => {this.deleteMessage(row.id)}}>删除 </a>
            </span>
          )
        }
      ]
    }
  }

  deleteMessage = (id) => {
    messageDelete({id}).then(res => {
      const { data } = this.state
      let newData = data.filter(item => {return item.id !== id})
      this.setState({data: newData})
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
    let requestData = {
      page: parseInt(page),
      limit: pageSize,
      ...values
    }

    messageList (requestData).then(data => {
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
      <div className={this.state.visible}>
        <SearchTable options={this.options} data={this.state.data} 
        pagination={this.state.pagination} search={this.search} {...this.props}/>
      </div>
    );
  }
}

export default ProjectList
