import React, { Component } from 'react';
import { message, Popconfirm,Form,Modal,Input,Button,DatePicker } from 'antd'
import SearchTable from '../../../components/SearchTable';
import { gameList, deleteGame, stickGame } from '../../../utils/request';
import {formatTime} from '@/utils/common';

class GameInformation extends Component {

    constructor(props) {
        super(props)
        this.state = {
          pagination: {
            current: 1,
            total: 0,
            showTotal: (total) => '共 ' + total + ' 条数据'
          },
          visible: [false, false, false],
          data: [],
        }
      }


    options = {
        form: [
          {
            element: 'input',
            name: 'name',
            placeholder: '请输入游戏名称'
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
              history.push('/main/GameInformation/gameAdd')
            }
          }
        ],
        table: {
          columns: [
            {
              title: '游戏名称',
              dataIndex: 'title',
              key: 'title'
            },
            {
              title: '游戏介绍',
              dataIndex: 'brief',
              key: 'brief',
              width:"20%"
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
              title: '游戏星级',
              dataIndex: 'type',
              key: 'type',
            },
            {
              title: '游戏链接',
              dataIndex: 'link',
              key: 'link',
            },
            {
                title: 'logo',
                dataIndex: 'icon',
                key: 'icon',
                render: (value) => {
                  return (<img src={value} width='80'/>)
                }
            },
            {
              title: '操作',
              key: 'action',
              render: (value,row, index) => (
                <span>
                  <a className="mt-10" onClick={() => this.props.history.push('/main/GameInformation/gameEdit?id='+row.id)} target="_blank">编辑 </a>
                  <Popconfirm title="你确定要删除这条数据吗？" okText="Yes" cancelText="No" onConfirm={() => this.deleteGame(row.id)}>
                    <a href="#" style={{color:'red'}}>删除</a>
                  </Popconfirm>
                  <a className="mt-10" onClick={() => this.editGame(index,row.stick === true ? 2 : 1,row.id)}>{row.stick == true ? '置顶 ' : '取消置顶 '} </a>
                </span>
              )
            }
          ]
        }
      }
      //删除
      deleteGame = (id) => {
          deleteGame({id :id}).then(res => {
            const { data } = this.state
            let newData = data.filter(item => {return item.id !== id})
            this.setState({data: newData})
          })
      }
      //置顶
      editGame = (index,stick,id) => {
        stickGame({
            status : stick,
            id : id
        }).then(() => {
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
        gameList (requestData).then(data => {
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

export default GameInformation