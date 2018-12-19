import React, { Component } from 'react';
import { message, Popconfirm } from 'antd'
import SearchTable from '../../components/SearchTable';
import {formatTime} from '@/utils/common';
import {itemList, itemProgress,downExcel} from '../../utils/request'

class ProjectList extends Component {
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
  downUsers=(name,id)=>{
    downExcel({item_id:id}).then(data=>{
      if (data) {
        // let binaryData = []
        // binaryData.push(data)
        // console.log(data)
        // let url = window.URL.createObjectURL(
        //   new Blob(binaryData)
        // )
        // if (window.navigator.msSaveOrOpenBlob) { // msSaveOrOpenBlob方法返回bool值
        //   navigator.msSaveBlob(binaryData, name + '.xlsx') // 本地保存
        // } else {
        //   var link = document.createElement('a') // a标签下载
        //   link.href = url
        //   link.download = name + '参与用户列表.xlsx'
        //   link.click()
        //   window.URL.revokeObjectURL(link.href)
        // }
        window.location = data
      } else {
      }
    })
  }
  options = {
    form: [
      {
        element: 'input',
        name: 'name',
        placeholder: '请输入项目名称'
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
          history.push('/main/projectList/add')
        }
      }
    ],
    table: {
      columns: [
        {
          title: '项目名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '糖果名称',
          dataIndex: 'candy_symbol',
          key: 'candy_symbol'
        },
        {
          title: '创建时间',
          dataIndex: 'created_at',
          key: 'created_at',
          render: (value) => {
            return (<span>{value? formatTime(value, true) : ''}</span>)
          }
        },
        {
          title: '当前状态',
          dataIndex: 'status',
          key: 'status',
          filters: [
            { text: '已下架', value: 2 },
            { text: '上架中', value: 1 }
          ],
          filteredValue: [],
          filterMultiple: false,
          render: (value) => {
            return (<span>{value>1 ? '已下架' : '上架中'}</span>)
          }
        },
        {
          title: '联系方式',
          dataIndex: 'identifier',
          key: 'identifier'
        },
        {
          title: '联系人',
          dataIndex: 'community_name',
          key: 'community_name',
        },
        {
          title: '操作',
          key: 'action',
          render: (value,row, index) => (
            <span>
              <a className="mt-10" onClick={() => this.props.history.push('/main/projectList/edit?id='+row.id)} target="_blank">编辑 </a>
              <a className="mt-10" onClick={() => this.downUsers(row.name,row.id)} target="_blank">下载用户列表 </a>
              <Popconfirm title={`你确定要${row.status>1 ? '上架' : '下架'}该项目吗?`} visible={this.state.visible[index]} onVisibleChange={(visible) => this.handleVisibleChange(visible, row.status, index, row.id)} onConfirm={(e) => this.operate(index, row.status, row.id)} onCancel={this.cancel} okText="确定" cancelText="取消">
                <a>{row.status>1 ? '上架 ' : '下架 '}</a>
              </Popconfirm>
              {row.candy_symbol? '' : (<a className="mt-10" onClick={() => this.props.history.push('/main/candyList/add?id='+row.id)}> 添加糖果</a>)}
            </span>
          )
        }
      ]
    }
  }
  operate = (index, status, id) => {
    itemProgress({
      status: status === 2 ? 1 : 2,
      id: id
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
  search = (page, pageSize, values = null, filters) => {
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
    itemList (requestData).then(data => {
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

export default ProjectList
