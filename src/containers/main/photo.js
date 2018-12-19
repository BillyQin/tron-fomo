import React, { Component } from 'react';
import { message, Popconfirm } from 'antd'
import SearchTable from '../../components/SearchTable';
import {allBg,candyProgress} from '../../utils/request'
// import { Link } from 'react-router-dom';
import {formatTime} from '@/utils/common';

class PhotoList extends Component {
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
    buttons: [
      {
        text: '新增',
        onClick: () => {
          const { history } = this.props
          history.push('/main/photoList/add')
        }
      }
    ],
    form: [
      {
        element: 'input',
        name: 'name',
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
          title: '名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '当前状态',
          dataIndex: 'status',
          key: 'status',
          filters: [
            { text: '可用', value: 1 },
            { text: '不可用', value: 2 },
          ],
          filteredValue: [],
          filterMultiple: false,
          render: (value) => {
            return (<span>{value === 1? '可用':'不可用'}</span>)
          }
        },
        {
          title: '创建时间',
          dataIndex: 'updated_at',
          key: 'updated_at',
          render: (value) => {
            return (<span>{value? formatTime(value, true) : ''}</span>)
          }
        },
        {
          title: '图片',
          dataIndex: 'url',
          key: 'url',
          render: (value) => {
            return (<img src={value} width='80'/>)
          }
        },
        // {
        //   title: '所属项目',
        //   dataIndex: 'updated_at',
        //   key: 'updated_at',
        //   render: (value) => {
        //     return (<span>{value? formatTime(value, true) : ''}</span>)
        //   }
        // },
        {
          title: '操作',
          key: 'action',
          render: (text, row, index) => (
            <span >
              <a className="mt-10" onClick={() => this.props.history.push('/main/photoList/edit?id='+row.id)}>编辑 </a>
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
    allBg (requestData).then(data => {
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

export default PhotoList

