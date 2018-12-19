import React, { Component } from 'react';
import SearchTable from '../../components/SearchTable';
import {Breadcrumb} from 'antd'
import {taskFList} from '../../utils/request'
import { Link } from 'react-router-dom';
import {formatTime} from '@/utils/common';

class CandyDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pagination: {
        current: 1,
        total: 0,
        showTotal: (total) => '共 ' + total + ' 条数据'
      },
      type: '',
      data: []
    }
  }
  options = {
    form: [
      {
        element: 'input',
        name: 'account',
        placeholder: '请输入账户名称'
      },
      {
        element: 'hidden',
        name: 'result'
      }
    ],
    table: {
      columns: [
        {
          title: '账户',
          dataIndex: 'account',
          key: 'account'
        },
        {
          title: '领取时间',
          dataIndex: 'created_at',
          key: 'created_at',
          render: (value, row) => {
            return (<span>{formatTime(value, true)}</span>)
          }
        },
        {
          title: '数量',
          dataIndex: 'quota',
          key: 'quota'
        }
      ]
    }
    // table: {
    //   columns: [
    //     {
    //       title: '持有账户',
    //       dataIndex: 'account',
    //       key: 'account'
    //     },
    //     {
    //       title: '持有总数',
    //       dataIndex: 'total',
    //       key: 'total'
    //     },
    //     {
    //       title: '领取数量',
    //       dataIndex: 'draw_count',
    //       key: 'draw_count'
    //     },
    //     {
    //       title: '一级奖励',
    //       dataIndex: 'first_count',
    //       key: 'first_count'
    //     },
    //     {
    //       title: '二级奖励',
    //       dataIndex: 'second_count',
    //       key: 'second_count',
    //     },
    //     {
    //       title: '三级奖励',
    //       dataIndex: 'third_count',
    //       key: 'third_count',
    //     },
    //     {
    //       title: '四级奖励',
    //       dataIndex: 'fourth_count',
    //       key: 'fourth_count',
    //     },
    //     {
    //       title: '五级奖励',
    //       dataIndex: 'fifth_count',
    //       key: 'fifth_count',
    //     },
    //     {
    //       title: '六级奖励',
    //       dataIndex: 'sixth_count',
    //       key: 'sixth_count',
    //     }
    //   ]
    // }
  }

  search = (page, pageSize, values = null) => {
    console.log('candy_id: ',this.state.type)
    let requestData = {
      page: parseInt(page),
      limit: pageSize,
      id: this.state.type,
      ...values
    }
    console.log(requestData)
    for (let i in requestData) {
      if(i !== 'account') {
        requestData[i] = parseInt(requestData[i])
      } else if (i === 'id') {
        delete requestData[i]
      }
    }
    taskFList (requestData).then(data => {
      console.log(data)
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
  componentWillMount () {
    this.setState({type: this.props.history.location.search.split('=')[1].split('&')[0]})
  }
  render() {
    return (
      <div className="">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/main/candyList">任务管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>明细</Breadcrumb.Item>
        </Breadcrumb>
        <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
      </div>
    );
  }
}

export default CandyDetail

