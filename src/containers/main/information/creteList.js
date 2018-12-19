import React, { Component } from 'react';
import { message, Popconfirm } from 'antd'
import {formatTime} from '@/utils/common';
import SearchTable from '../../../components/SearchTable';
import { newLists, newStick, newsDelete } from '../../../utils/request';

class CreteList extends Component {

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
            name: 'name',
            placeholder: '请输入资讯名称'
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
              history.push('/main/information/creteNews')
            }
          }
        ],
        table: {
          columns: [
            {
              title: '资讯名称',
              dataIndex: 'title',
              key: 'title'
            },
            {
              title: '资讯type',
              dataIndex: 'type',
              key: 'type'
            },
            {
              title: '资讯来源',
              dataIndex: 'origin',
              key: 'origin'
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
              title: '资讯链接',
              dataIndex: 'url',
              key: 'Url',
            },
            {
                title: '资讯logo',
                dataIndex: 'icon',
                key: 'icon',
                render: (value) => {
                  return (<img src={value} width='60'/>)
                }
            },
            {
              title: '操作',
              key: 'action',
              render: (value,row, index) => (
                <span>
                  <a className="mt-10" onClick={() => this.props.history.push('/main/information/editNews?id='+row.id)} target="_blank">编辑 </a>
                  <Popconfirm title="你确定要删除这条数据吗？" okText="Yes" cancelText="No" onConfirm={() => this.deleteNews(row.id)}>
                    <a href="#" style={{color:'red'}}>删除</a>
                  </Popconfirm>
                  <a className="mt-10" onClick={() => this.editNews(index,row.stick === true ? 2 : 1,row.id)}>{row.stick == true ? '置顶 ' : '取消置顶 '} </a>
                </span>
              )
            }
          ]
        }
      }

      //删除
    deleteNews = (id) => {
        newsDelete({id :id}).then(res => {
          const { data } = this.state
          let newData = data.filter(item => {return item.id !== id})
          this.setState({data: newData})
        })
    }
    //置顶
    editNews = (index,stick,id) => {
        newStick({status:stick,id:id}).then(() => {
            let newRow = this.state.data
            newRow[index].stick = stick
            this.setState({data: newRow})
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
        newLists (requestData).then(data => {
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
          <div className="">
            <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
          </div>
        );
      }
}
export default CreteList