import React, { Component } from 'react';
import { Input,Icon, Breadcrumb, Select } from 'antd';
import './candyDetail.less';
import SearchTable from '../../../../../components/SearchTable';
import { candyLogList } from '@/config/mobileApi';
import { formatTime, transFloat } from '@/utils/common';

class CandyDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [100,200,300,400,500,600,700],
            pagination: {
                current: 1,
                total: 0,
                showTotal: (total) => '共 ' + total + ' 条数据'
            },
            detail:''
          }
    }

    componentWillMount() {
        this.candyLogList();// 全部记录/我的明细
    }

    // 我的明细/全部记录 
    candyLogList = () => {
        console.log(this.props.history.location.search.split('=')[1])
        let candy_id = parseInt(this.props.history.location.search.split('=')[1])
        let params = {
            candy_id,
            limit:10,
            page:1
        }
        candyLogList(params).then(res=>{
            res.records!=null?res.records.map(item => {
                switch (item.type) {
                  case 1: item['title'] = '邀请获得糖果'; item['mark'] = '+'; break;
                  case 2: item['title'] = '被邀请获得糖果'; item['mark'] = '+'; break;
                  case 3: item['title'] = '领取糖果'; item['mark'] = '+'; break;
                  case 4:
                    switch (item.status) {
                      case 1: item['title'] = '提取糖果(审核中)'; item['mark'] = ''; break;
                      case 2: item['title'] = '提取糖果成功'; item['mark'] = '-'; break;
                      case 3: item['title'] = '提取糖果失败'; item['mark'] = ''; break;
                    }
                    break;
                  case 5: item['title'] = '项目分享获糖果'; item['mark'] = '+'; break;
                  case 6: item['title'] = '做任务获糖果'; item['mark'] = '+'; break;
                  case 7: item['title'] = '任务上层奖励'; item['mark'] = '+'; break;
                  case 8: item['title'] = '兑减糖果';item['mark'] = '-';break;
                  case 9: item['title'] = '兑增糖果';item['mark'] = '+';break;  
                  case 10: item['title'] = '转出糖果';item['mark'] = '-';break;   
                  case 11: item['title'] = '转入糖果';item['mark'] = '+';break;  
                  case 12: item['title'] = '发糖果';item['mark'] = '-';break;   
                  case 13: item['title'] = '减糖果';item['mark'] = '-';break;
                  default: item['title'] = ''; item['mark'] = ''; break;
                }
              }):''
            this.setState({
                detail:res.records
            })
            console.log(res,'提币记录/糖果明细')
        })
    }

    options = {
        table: {
          columns: [{
              title: '时间',
              dataIndex: 'created_at',
              key: 'created_at',
              width: '20%',
              render: (value) => {
                return (<span>{value? formatTime(value, true) : ''}</span>)
              }
            },
            {
              title: '事件',
              width: '50%',
              render: (value) => {
                return (<div><span>{value.title}</span>   :   <span>{value.remark?value.remark:'无'}</span></div>)
              }
            },
            {
              title: '数量',
              dataIndex: 'amount',
              key: 'amount',
              width: '20%',
              render: (value) => {
                return (<span>{value? transFloat(value, 3) : ''}</span>)
              }
            }]
        }
    }

    render() {
        return (
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item onClick={() => {this.props.history.goBack()}}>我的糖果</Breadcrumb.Item>
                    <Breadcrumb.Item>糖果明细</Breadcrumb.Item>
                </Breadcrumb>
                
                {/* 列表 */}
                <div className="listsWarp">
                    <SearchTable options={this.options} data={this.state.detail} pagination={this.state.pagination} {...this.props}/>
                </div>
            </div>
        )
    }
}
export default CandyDetail