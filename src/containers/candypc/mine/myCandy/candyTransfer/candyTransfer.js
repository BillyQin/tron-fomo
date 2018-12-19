import React, { Component } from 'react';
import { Breadcrumb, Select, message } from 'antd';
import './candyTransfer.less';
import SearchTable from '../../../../../components/SearchTable';
import { TransferState, userCandyDetail, getUserImgCode, TransferCandyButton, getImgCode, candyTransferRecords } from '@/config/mobileApi';
import { transAmount, transCharge, transFloat, formatTime } from '@/utils/common';


const Option = Select.Option

class CandyTransfer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [100,200,300,400,500,600,700],
            pagination: {
                current: 1,
                total: 0,
                showTotal: (total) => '共 ' + total + ' 条数据'
            },
            target_account:'',
            amount:'',
            code:'',
            captcha_id:'',
            detail:''
          }
          this.totalAmount = 0 
          this.second = -1;
    }

    componentWillMount() {
        this.userCandyDetail();// 用户糖果详情
        this.getImgCode();// 获取图片验证码
        this.candyTransferRecords();// 转让记录
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

    // 获取图片验证码
    getImgCode = () => {
        let params = {}
        getImgCode(params).then(res=>{
            this.setState({
                captcha_id:res.captcha_id
            })
        })
    }


    // 用户转让状态查询
    search = () => {
        if (this.state.target_account == '') {
            message.error('请输入手机号！');
            return ;
        }
        // 验证手机号
        var reg = /^1[0-9]{10}$/ || '';
        if (!reg.test(this.state.target_account)) {
          message.error('请输入正确的手机号!');
          return ;
        } 
        let params = {
            target_account:this.state.target_account
        }
        TransferState(params).then(data=>{
            if (data === '该用户不可转让') {
                message.error('该用户不可转让，请重新输入！');
            }
            if (data === '该用户可以转让') {
                message.success('该用户可以转让!');
            }
        })
    }

    // 用户糖果详情
    userCandyDetail = () => {
        this.symbol = this.props.history.location.search.split('=')[2];
        let candy_id = parseInt(this.props.history.location.search.split('=')[1].split('&')[0]);
        userCandyDetail({candy_id}).then(res => {
            this.totalAmount = Number(res.total)
            this.setState({
                drawAmount: transAmount(this.totalAmount,res.charge_count),charge: transCharge(this.totalAmount,res.charge_count),
                charge_count:res.charge_count
            })
            console.log(res,'用户糖果详情')
        })
    }

    // 获取转让验证码
    getCode = () => {
        this.second = 60
        if (this.state.target_account == '') {
            message.error('请输入手机号');
            return ;
        }

        // 验证手机号
        var reg = /^1[0-9]{10}$/ || '';
        if (!reg.test(this.state.target_account)) {
          message.error('请输入正确的手机号!');
          return ;
        } 

        if (this.state.target_account == localStorage.getItem('user_name')) {
            message.error('自己不能转给自己，请换一个手机号');
            return ;
        }

        if (this.state.amount == '') {
            message.error('请输入转让数量');
            return ;
        }
        // 转让验证码
        let params = {
            type:3,
            user_name:localStorage.getItem('user_name')
        }
        getUserImgCode(params).then(res=>{
            this.countDown()
            if (res.code === 0) {
                message.success('验证码发送成功，请注意查收！')
            }
            console.log(res)
        })
    }

    // 倒计时
    countDown () {
        const downPerSecond = () => {
            this.second --
            this.setState({updated: !this.state.updated})
            if (this.timer !== null) {
                clearTimeout(this.timer)
            }
            if (this.second > 0) {
                this.timer = setTimeout(downPerSecond, 1000)
            }
        }
        downPerSecond()
    }

    // 转让糖果
    submitMess = () => {
        if (this.state.target_account == '') {
            message.error('请输入手机号！');
            return ;
        }

         // 验证手机号
         var reg = /^1[0-9]{10}$/ || '';
         if (!reg.test(this.state.target_account)) {
           message.error('请输入正确的手机号!');
           return ;
         } 

        if (this.state.target_account == localStorage.getItem('user_name')) {
            message.error('自己不能转给自己，请换一个手机号');
            return ;
        }

        if (this.state.amount == '') {
            message.error('请输入转让数量');
            return ;
        }

        if (this.state.code == '') {
            message.error('请输入验证码');
            return ;
        }

        let params = {
            amount:parseInt(this.state.amount),
            captcha_id:this.state.captcha_id,
            captcha_solution:this.state.code,
            charge:0,
            symbol:this.symbol,
            target_account:this.state.target_account

        }
        TransferCandyButton(params).then(res=>{
            if (res.code === 0) {
                this.props.history.goBack()
                message.success('转让审核中！')
            }
            console.log(res)
        })
    }

    // 转让记录
    candyTransferRecords = () => {
        let candy_id = parseInt(this.props.history.location.search.split('=')[1].split('&')[0]);
        let params = {
            candy_id,
            limit:10,
            page:1
        }
        candyTransferRecords(params).then(res=>{
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
              title: '转让时间',
              dataIndex: 'created_at',
              key: 'created_at',
              render: (value) => {
                return (<span>{value? formatTime(value, true) : ''}</span>)
              }
            },
            {
              title: '转让数量(个)',
              dataIndex: 'amount',
              key: 'amount',
            },
            {
              title: '手续费(个)',
              dataIndex: 'charge',
              key: 'charge',
            },
            {
              title: '转让账户',
              dataIndex: 'target_account',
              key: 'target_account',
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
                    <Breadcrumb.Item>糖果转让</Breadcrumb.Item>
                </Breadcrumb>
                <div className="candyExtract">
                    <div className="divAdress">
                        <span style={{marginBottom:'10px'}}>手机号</span>
                        <input type='text' placeholder="请输入手机号" 
                            onChange={(e) => this.setState({target_account: e.target.value})}
                        />
                        <div className="searchIphone" onClick={this.search}>搜索</div>
                    </div>
                    <div className="form-item">
                        <span>转让数量</span>
                        <div className="vscode">
                            <input max={this.totalAmount} type='text' placeholder="请输入转让数量" value={this.state.amount} onChange={(e) => this.setState({amount: e.target.value})} />
                            <span className="extend" style={{color:'#1F88E6'}} onClick={()=>{this.setState({amount: this.totalAmount})}}>全部</span>
                        </div>
                    </div>
                    <div className="form-item1">
                        <span>到账数量</span>
                        {
                            this.state.amount?<input className="account-number" type='number' value={transFloat(this.state.amount,3)} disabled/>:
                            <input className="account-number" type='number' value='0.000' disabled/>
                        }
                    </div>
                    <div className="form-item">
                        <span>验证码</span>
                        <div className="vscode">
                            <input type='text' placeholder="请输入验证码" onChange={(e) => this.setState({code: e.target.value})}/>
                            <button className="extend" style={{color:'#1F88E6'}} disabled={this.second>0&&this.second<60} onClick={()=>{this.getCode()}} >{this.second > 0&&this.second < 60?this.second+'S':'获取验证码'}</button>
                        </div>
                    </div>
                    <div className="tpBtn" onClick={this.submitMess}>转让</div>
                </div>
                {/* 列表 */}
                <div className="listsWarp">
                    <h5>转让记录</h5>
                    <SearchTable options={this.options} data={this.state.detail} pagination={this.state.pagination} {...this.props}/>
                </div>
            </div>
        )
    }
}
export default CandyTransfer