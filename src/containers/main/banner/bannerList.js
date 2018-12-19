import React, { Component } from 'react';
import { message, Popconfirm,Form,Modal,Input,Button,DatePicker } from 'antd'
import SearchTable from '../../../components/SearchTable';
import { bannerList, bannerDelete } from '../../../utils/request';
import {formatTime} from '@/utils/common';


class BannerList extends Component {

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
            placeholder: '请输入banner名称'
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
              history.push('/main/banner/bannerAdd')
            }
          }
        ],
        table: {
          columns: [
            {
              title: '创建时间',
              dataIndex: 'created_at',
              key: 'created_at',
              render: (value) => {
                return (<span>{value? formatTime(value, true) : ''}</span>)
              }
            },
            {
              title: 'BannerType',
              dataIndex: 'type',
              key: 'type',
            },
            {
              title: 'BannerLink',
              dataIndex: 'link',
              key: 'link',
            },
            {
                title: 'banner',
                dataIndex: 'url',
                key: 'url',
                render: (value) => {
                  return (<img src={value} width='80'/>)
                }
            },
            {
              title: '操作',
              key: 'action',
              render: (value,row, index) => (
                <span>
                  <a className="mt-10" onClick={() => this.props.history.push('/main/banner/bannerEdit?id='+row.id)} target="_blank">编辑 </a>
                  <Popconfirm title="你确定要删除这条数据吗？" okText="Yes" cancelText="No" onConfirm={() => this.deleteBanner(row.id)}>
                    <a href="#" style={{color:'red'}}>删除</a>
                  </Popconfirm>
                </span>
              )
            }
          ]
        }
      }


       //删除
       deleteBanner = (id) => {
        bannerDelete({id :id}).then(res => {
          const { data } = this.state
          let newData = data.filter(item => {return item.id !== id})
          this.setState({data: newData})
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
        bannerList (requestData).then(data => {
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
export default BannerList