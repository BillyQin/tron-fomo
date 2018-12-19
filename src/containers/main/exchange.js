import React, { Component } from 'react';
import { message, Popconfirm } from 'antd'
import SearchTable from '../../components/SearchTable';
import {showExchanges,exchangeDel} from '../../utils/request'

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
  delete=(id)=>{
    exchangeDel({id:id}).then(res=>{
      if(res.code===0){
        this.state.data = this.state.data.filter((item) => {
          return item.id !== id
        })
        this.setState({visible: 'visible'+id})
        message.success('删除成功')
      }
    })
  }
  options = {
    form: [
      {
        element: 'input',
        name: 'name',
        placeholder: '请输入交易所名称'
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
          history.push('/main/exchange/add')
        }
      }
    ],
    table: {
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '链接',
          dataIndex: 'exchange_url',
          key: 'exchange_url'
        },
        // {
        //   title: '当前状态',
        //   dataIndex: 'status',
        //   key: 'status',
        //   filters: [
        //     { text: '推荐', value: 1 },
        //     { text: '普通', value: 0 }
        //   ],
        //   filteredValue: [],
        //   filterMultiple: false,
        //   render: (value) => {
        //     return (<span>{value===1 ? '推荐' : '普通'}</span>)
        //   }
        // },
        {
          title: '添加时间',
          dataIndex: 'created_at',
          key: 'created_at'
        },
        {
          title: '操作',
          key: 'action',
          render: (row) => (
            <span>
              <a className="mt-10" onClick={() => this.props.history.push('/main/exchange/edit?id='+row.id)} target="_blank">编辑 </a>
              <a className="mt-10" onClick={() => this.delete(row.id)} target="_blank">删除 </a>
            </span>
          )
        }
      ]
    }
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
    for (let i in requestData) {
      if(i !== 'name') {
        requestData[i] = parseInt(requestData[i])
      }
    }
    showExchanges (requestData).then(data => {
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
      <div className={this.state.visible}>
        <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
      </div>
    );
  }
}

export default ProjectList
