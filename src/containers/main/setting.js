import React, { Component } from 'react';
import SearchTable from '../../components/SearchTable';
import {ruleList} from '../../utils/request'
// import { Link } from 'react-router-dom';

class Setting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pagination: {
        current: 1,
        total: 0,
        showTotal: (total) => '共 ' + total + ' 条数据'
      },
      data: []
    }
  }
  options = {
    form: [
      {
        element: 'input',
        name: 'symbol',
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
          title: '参数名称',
          dataIndex: 'candy_symbol',
          key: 'candy_symbol'
        },
        {
          title: '一级奖励',
          dataIndex: 'first_reward',
          key: 'first_reward'
        },
        {
          title: '二级奖励',
          dataIndex: 'second_reward',
          key: 'second_reward',
        },
        {
          title: '三级奖励',
          dataIndex: 'third_reward',
          key: 'third_reward',
        },
        {
          title: '四级奖励',
          dataIndex: 'fourth_reward',
          key: 'fourth_reward',
        },
        {
          title: '五级奖励',
          dataIndex: 'fifth_reward',
          key: 'fifth_reward',
        },
        {
          title: '六级奖励',
          dataIndex: 'sixth_reward',
          key: 'sixth_reward',
        }
      ]
    }
  }

  search = (page, pageSize, values = null) => {
    console.log(values)
    ruleList ({
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
  componentWillMount(){
  }
  render() {
    return (
      <div className="">
        <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
      </div>
    );
  }
}

export default Setting
