import React, { Component } from 'react';
import { Input,Icon, Breadcrumb, Select, message, Form, Modal } from 'antd';
import './candyMake.less';
import SearchTable from '../../../../../components/SearchTable';
import { addressLists, userCandyDetail, getUserImgCode, drawCandyList, extractCandy, addAddress, candySymbolList } from '@/config/mobileApi';
import { transFloat, transAmount, transCharge, formatTime } from '@/utils/common';

// 添加提币地址弹框
let ref = null
const FormItem = Form.Item
class addAddress1 extends Component {
    constructor(props) {
        super(props)
        this.state = {
          symbolLists:[]
        }
    }
  
    componentWillMount() {
      this.candySymbolLists();// 糖果标志列表
    }
  
    // 糖果标志列表
    candySymbolLists = () => {
      candySymbolList().then(res=>{
        this.setState({
          symbolLists:res
        })
      })
    }
  
    handleChange = (value) => {
      console.log(value)
      this.setState({candy_id: value})
    }
   
    // 添加地址
    handleSubmit = (e) => {
      e.preventDefault();
        this.props.form.validateFieldsAndScroll((err,values)=>{
          if (!err) {
            console.log(values)
            let params = {
              address:values.address,
              remark:values.comment,
              symbol:values.type
            }
            addAddress(params).then(res=>{
              if (res.code == 0) {
                message.success('地址添加成功！');
                this.addRessSucc();
              } 
            })
          }
        })
    }

    addRessSucc = () => {
        console.log('11')
        ref.destory();
    }
  
    render() {
      const { getFieldDecorator } = this.props.form
      return(
          <div>
              <Form onSubmit={this.handleSubmit} className="formPerple" layout="inline">
                <FormItem label="类型">
                    {getFieldDecorator('type', {
                    rules: [{ required: true, message: '请选择Token类型' }]
                    })(
                      <Select
                        onChange={this.handleChange}
                        showSeach
                        style={{ width: '100%', padding: 0, margin: 0 }}
                        placeholder="选择Token类型"
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        dropdownMatchSelectWidth={false}
                        dropdownAlign={{
                            points: ['tr', 'br'],
                            overflow: false,
                        }}
                    > 
                    {
                      this.state.symbolLists.map((item,i)=>(
                        <Option key={i} value={item.symbol}>{item.symbol}</Option>
                      ))
                    }
                    </Select>
                    )}
                </FormItem>
                <FormItem label="提币地址">
                    {getFieldDecorator('address', {
                    rules: [{ required: true, message: '请填写正确的地址' }]
                    })(
                    <Input type="text" placeholder="请填写正确的地址" />
                    )}
                </FormItem>
                <FormItem label="备注">
                    {getFieldDecorator('comment', {
                    rules: [{ required: true, message: '请填写备注信息' }]
                    })(
                    <Input type="text" placeholder="请填写备注信息" />
                    )}
                </FormItem>   
                <div className="certificate">
                  <button>提交</button>
                </div>
              </Form>
          </div>
      )
    }
  }
  const MyForm = Form.create()(addAddress1)   

const Option = Select.Option

class CandyMake extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [100,200,300,400,500,600,700],
            pagination: {
                current: 1,
                total: 0,
                showTotal: (total) => '共 ' + total + ' 条数据'
            },
            symbol:'',
            amount:'',
            addressList:[],
            extractLists:[],
            updated: false,
            address:'',
            charge_count:'',
            code:'',
            address1:''
        }
        this.totalAmount = 0 
        this.second = -1;
    }

    componentWillMount() {
        this.addressList();// 提币地址。
        this.userCandyDetail();// 用户糖果详情
        this.drawCandyList();// 糖果提取记录/糖果明细
    }

    handleChange = (address) => {
        this.setState({address})
        
    }
      
    showModal = () => {
        ref = Modal.info({
          title: '添加提币地址',
          maskClosable: true,
          content: <MyForm submit={this.addUser}></MyForm>,
          okText: ' ',
          okType: 'none',
          closable: true,
          iconType:'none',
        })
    }

    // 提币地址。
    addressList = () => {
        let candy_id = parseInt(this.props.history.location.search.split('=')[1].split('&')[0]);
        let params = {
            candy_id,
            limit:10,
            page:1
        }
        addressLists(params).then(res=>{
            this.setState({
                addressList:res.records
            })
            console.log(res.records)
            if (res.records == null) {
                message.error("请添加提币地址！")
                this.showModal();
            }
        })
    }

    

    // 提币地址
    mentionMoney = (value) => {
        console.log(value)
        let candy_id = parseInt(this.props.history.location.search.split('=')[1].split('&')[0]);
        let params = {
            candy_id,
            limit:10,
            page:1
        }
        addressLists(params).then(res=>{
            res.records.map((item,index)=>{
                if(item.id == value){
                    this.setState({
                        address:item.address
                    })
                }
            })
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

    // 获取提币验证码
    getCode = () => {
        this.second = 60
        if (this.state.address == '') {
            message.error('请选择提币地址');
            return ;
        }

        if (this.state.amount == '') {
            message.error('请输入提币数量');
            return ;
        }
        // 提币验证码
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

    // 提取糖果
    submitMess = () => {
        if (this.state.address == '') {
            message.error('请选择提币地址');
            return ;
        }

        if (this.state.amount == '') {
            message.error('请输入提币数量');
            return ;
        }

        if (this.state.code == '') {
            message.error('请输入验证码');
            return ;
        }
        let params = {
            address:this.state.address,
            amount:parseInt(this.state.amount),
            charge:this.state.charge_count,
            code:this.state.code,
            symbol:this.symbol
        }
        extractCandy(params).then(res=>{
            if (res.code === 0) {
                this.props.history.goBack()
                message.success('提币审核中！')
            }
            
            console.log(res,'提取糖果')
        })
        
    }

    // 提币记录/糖果明细
    drawCandyList = () => {
        let candy_id = parseInt(this.props.history.location.search.split('=')[1].split('&')[0]);
        let params = {
            candy_id,
            limit:10,
            page:1
        }
        drawCandyList(params).then(res=>{
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
                extractLists:res.records
            })
            console.log(res,'提币记录/糖果明细')
        })
    }

    options = {
        table: {
          columns: [{
              title: '提取时间',
              dataIndex: 'created_at',
              key: 'created_at',
              width:'24%',
              render: (value) => {
                return (<span>{value? formatTime(value, true) : ''}</span>)
              }
            },
            {
              title: '提取数量(个)',
              dataIndex: 'amount',
              key: 'amount',
              width:'16%'
            },
            {
              title: '手续费(个)',
              dataIndex: 'charge',
              key: 'charge',
              width:'14%'
            },
            {
              title: '提取地址',
              dataIndex: 'address',
              key: 'address',
              width:'16%'
            },
            {
              title: '当前状态',
              dataIndex: 'title',
              key: 'title',
              width:'14%'
            },
            {
              title: '备注',
              dataIndex: 'remark',
              key: 'remark',
              width:'16%'
            }]
        }
    }

    render() {
        return (
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item onClick={() => {this.props.history.goBack()}}>我的糖果</Breadcrumb.Item>
                    <Breadcrumb.Item>糖果提取</Breadcrumb.Item>
                </Breadcrumb>
                <div className="candyExtract">
                    <div className="divAdress">
                        <span style={{marginBottom:'10px'}}>提币地址</span>
                        <Select
                            onSelect={this.mentionMoney}
                            showSearch
                            style={{ width: 376,height:'60px' }}
                            placeholder="请选择提币地址！"
                            optionFilterProp="children"
                            onChange={this.handleChange}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                        {
                            this.state.addressList?this.state.addressList.map((item,i)=>(
                                <Option key={i} value={item.id}>{item.remark} : {item.address}</Option>
                            )):''
                        }
                        </Select>
                        <i>{this.symbol}</i>
                    </div>
                    <div className="form-item">
                        <span>提币数量</span>
                        <div className="vscode">
                            <input max={this.totalAmount} type='text' placeholder="请输入提币数量" value={this.state.amount} onChange={(e) => this.setState({amount: e.target.value})}/>
                            <span className="extend extends" style={{color:'#1F88E6'}} onClick={()=>{this.setState({amount: this.totalAmount})}}>全部</span>
                        </div>
                    </div>
                    <div className="form-item1">
                        <span>手续费</span>
                        <input type='number' value="0.2"  disabled/>
                    </div>
                    <div className="form-item1">
                        <span>到账数量</span>
                        {
                            this.state.amount?<input className="accountNumber" type='number' placeholder="请输入到账数量" value={transFloat(this.state.amount,3)} disabled/>: <input className="accountNumber" type='number' placeholder="请输入到账数量" value="0.000"  disabled/>
                        }
                    </div>
                    <div className="form-item">
                        <span>验证码</span>
                        <div className="vscode">
                            <input type='text' placeholder="请输入验证码" onChange={(e) => this.setState({code: e.target.value})}/>
                            <button className="extend" style={{color:'#1F88E6'}} disabled={this.second>0 && this.second<60} onClick={()=>{this.getCode()}} >{this.second > 0&&this.second < 60?this.second+'S':'获取验证码'}</button>
                        </div>
                    </div>
                    <div className="tpBtn" onClick={this.submitMess}>提取</div>
                </div>
                {/* 列表 */}
                <div className="listsWarp">
                    <h5>糖果明细</h5>
                    <SearchTable options={this.options} data={this.state.extractLists} pagination={this.state.pagination} {...this.props}/>
                </div>
            </div>
        )
    }
}
export default CandyMake