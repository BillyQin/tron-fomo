import React, { Component } from 'react';
import { Input,Icon, Breadcrumb, Select, message } from 'antd';
import './candyChange.less';
import SearchTable from '../../../../../components/SearchTable';
import { userCandyDetail } from '@/config/mobileApi';
import { transFloat, transAmount, transCharge, formatTime } from '@/utils/common';
import { exchangeCandy, exchangeCandyRecords } from '@/config/mobileApi';

const Option = Select.Option

class CandyChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [100,200,300,400,500,600,700],
            pagination: {
                current: 1,
                total: 0,
                showTotal: (total) => '共 ' + total + ' 条数据'
            },
            amount:'',
            rate:'',
            detail:'',
          }
          this.totalAmount = 0 
    }

    componentWillMount() {
        this.userCandyDetail();// 用户糖果详情
        this.exchangeCandyRecords();// 兑换记录
    }

    handleChange(value) {
        console.log(`selected ${value}`);
    }
      
    handleBlur() {
        console.log('blur');
    }
      
    handleFocus() {
        console.log('focus');
    }


    // 用户糖果详情
    userCandyDetail = () => {
        this.symbol = this.props.history.location.search.split('=')[2];
        let candy_id = parseInt(this.props.history.location.search.split('=')[1].split('&')[0]);
        userCandyDetail({candy_id}).then(res => {
            this.totalAmount = Number(res.total)
            this.setState({
                drawAmount: transAmount(this.totalAmount,res.charge_count),charge: transCharge(this.totalAmount,res.charge_count),
                charge_count:res.charge_count,
                rate:res.rate
            })
            console.log(res,'用户糖果详情')
        })
    }

    // 兑换糖果
    submitMess = () => {
        if (this.state.amount == '') {
            message.error('请输入兑换数据');
            return ;
        }
        let amount = transFloat(parseFloat(this.state.rate*this.state.amount),3);
        let params = {
            amount:parseFloat(this.state.amount),
            symbol:this.symbol,
            target_amount:parseFloat(amount),
            target_symbol:'CT'
        }
        exchangeCandy(params).then(res=>{
            if (res.code === 0) {
                this.props.history.goBack()
                message.success('兑换审核中！')
            }
            console.log(res)
        })
    }

    // 兑换记录
    exchangeCandyRecords = () => {
        let candy_id = parseInt(this.props.history.location.search.split('=')[1].split('&')[0]);
        let params = {
            candy_id,
            limit:10,
            page:1
        }
        exchangeCandyRecords(params).then(res=>{
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
            console.log(res,'兑换明细')
        })
    }

    options = {
        table: {
          columns: [{
              title: '兑换时间',
              dataIndex: 'created_at',
              key: 'created_at',
              render: (value) => {
                return (<span>{value? formatTime(value, true) : ''}</span>)
              }
            },
            {
              title: '兑换数量(个)',
              dataIndex: 'amount',
              key: 'amount',
              render: (value) => {
                return (<span>{value? transFloat(value, 3) : ''}</span>)
              }
            },
            {
              title: '兑换比例',
              render: () => {
                return (<div><span>1</span>   :   <span>{this.state.rate}</span></div>)
              }
            },
            {
              title: '实际到账',
              dataIndex: 'amount',
              key: 'amount1',
              render: (value) => {
                return (<span>{value? transFloat(value, 3) : ''}</span>)
              }
            },
            {
              title: '当前状态',
              dataIndex: 'title',
              key: 'title',
            },
            {
              title: '备注',
              dataIndex: 'remark',
              key: 'remark',
            }]
        }
      }

    render() {
        return (
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item onClick={() => {this.props.history.goBack()}}>我的糖果</Breadcrumb.Item>
                    <Breadcrumb.Item>糖果兑换</Breadcrumb.Item>
                </Breadcrumb>
                <div className="candyExtract">
                    <div className="form-item">
                        <span className="cts">兑换数量</span>
                        <div className="vscode">
                            <input max={this.totalAmount} type='text' placeholder='请输入兑换数量' value={this.state.amount} onChange={(e) => this.setState({amount: e.target.value})}/>
                            <span className="extend" style={{color:'#1F88E6'}} onClick={()=>{this.setState({amount: this.totalAmount})}}>全部</span>
                        </div>
                    </div>
                    <div className="form-item1 form-item2">
                        <span className="cts">兑换比例</span>
                        <i style={{paddingLeft:20}}>1 {this.symbol} = {this.state.rate} CT</i>
                    </div>
                    <div className="form-item1">
                        <span className="cts">到账数量</span>
                        
                        {
                            this.state.amount?<input type='number' style={{color:'#E62A80'}} value={transFloat(this.state.amount,3)}  disabled/>:
                            <input type='number' style={{color:'#E62A80'}} value="0.000"  disabled/>
                        }
                    </div>
                    <div className="tpBtn" onClick={this.submitMess}>兑换</div>
                </div>
                {/* 列表 */}
                <div className="listsWarp">
                    <h5>兑换记录</h5>
                    <SearchTable options={this.options} data={this.state.detail} pagination={this.state.pagination} {...this.props}/>
                </div>
            </div>
        )
    }
}
export default CandyChange