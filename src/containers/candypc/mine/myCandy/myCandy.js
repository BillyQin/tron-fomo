import React, { Component } from 'react';
import { Input, Icon, Breadcrumb, Table, Pagination, message } from 'antd';
import './myCandy.less';
import Line from '@/components/lineCharts';
import { candyStatic, userCandyList, userCandyDetail } from '@/config/mobileApi';
import { transFloat } from '@/utils/common'

class MineCandy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      xData: [],
      data: [],
      detail:[],
      totalNum:0
    }
  }

  componentWillMount() {
    console.log(this.props,'props');
    this.candyStatic();// 总糖果价值
    this.userCandyList();// 用户糖果列表
  }

  // 总糖果价值
  candyStatic = () => {
    function format (value) {
      return Number(value) < 10 ? `0${value}` : value
    }
    let today = new Date(); //获取今天日期
    today.setDate(today.getDate() - 6);
    let fullTime = [];
    let showTime = [];
    let dateTemp = '';
    for (let i = 0; i < 7; i++) {
      dateTemp = today.getFullYear() + '-' + format(today.getMonth()+1)+"-"+ format(today.getDate());
      fullTime.push(dateTemp);
      dateTemp = format(today.getMonth()+1)+"-"+ format(today.getDate());
      showTime.push(dateTemp);
      today.setDate(today.getDate()+1);
    }
    this.setState({xData: showTime})
    let params = {
      end_time: fullTime[6],
      start_time: fullTime[0]
    }
    candyStatic(params).then(res => {
      let data = new Array(7).fill(0)
      res.map((item, key) => {
        data[key] = item.cny
      })
      this.setState({data})
    })
  }

  // 用户糖果列表
  userCandyList = (page) => {
    let params = {
      limit:10,
      page:page
    }
    userCandyList(params).then(res=>{
      this.setState({
        detail:res.records,
        totalNum:res.total
      })
      console.log(res,'糖果list')
    })
  }

  onChange = (page) => {
    this.userCandyList(page);
  }
 
  exchanges = (candy_id,symbol) => {
    console.log(candy_id,symbol)
    userCandyDetail({candy_id}).then(res=>{
      if (res.rate == 0 && res.target_id == 0) {
        message.error('暂未开放兑换');
        return ;
      } else {
        this.props.history.push('/mine/myCandy/candyChange?candy_id='+candy_id+'&symbol='+symbol)
        console.log(res,'userCandyDetail')
      }
    })
  }

  render() {
    const columns = [{
      title: '糖果名称',
      dataIndex: 'symbol',
      width: 100,
    },{
      title: '可提现（个）',
      dataIndex: 'total',
      width: 100,
    },{
      title: '冻结（个）',
      dataIndex: 'frozen',
      width: 100,
    },{
      title: '已提（个）',
      dataIndex: 'taken',
      width: 100,
    },{
      title: '操作',
      dataIndex: 'operation',
      width: 200,
      render: (value,row, index) => (
        <span>
          <a className="mt-10" onClick={() => this.props.history.push('/mine/myCandy/candyMake?candy_id='+row.candy_id+'&symbol='+row.symbol)} target="_blank">提取 </a>
          <a className="mt-10" onClick={() => this.exchanges(row.candy_id,row.symbol)} target="_blank">兑换 </a>
          <a className="mt-10" onClick={() => this.props.history.push('/mine/myCandy/candyTransfer?candy_id='+row.candy_id+'&symbol='+row.symbol)} target="_blank">转让 </a>
          <a className="mt-10" onClick={() => this.props.history.push('/mine/myCandy/candyDetail?candy_id='+row.candy_id)} target="_blank">明细 </a>
        </span>
      )
    }];

    
    let option = {
      title: '',
      xData: this.state.xData,
      type: 'line',
      height: 247,
      data: this.state.data
    }
    return (
        <div className="mineRightWarp mineRightWarps">
            <Breadcrumb>
                <Breadcrumb.Item>我的糖果</Breadcrumb.Item>
            </Breadcrumb>
            {/* 图表 */}
            <div className="echartsWarp">
                <div className="echartsTitle">
                    <span className="candyNum">糖果总折合</span>
                    <span className="number">¥{transFloat(this.state.data[this.state.data.length-1],2)}</span>
                </div>
                <div className="echartsBox">
                    <Line option={option}></Line>
                </div>
            </div>
            {/* 列表 */}
            <div className="listsWarp">
                <h5>糖果明细</h5>
                <Table columns={columns} dataSource={this.state.detail} pagination={ false } />
                <div className="pagination">
                  共 {this.state.totalNum} 条数据 &nbsp; 
                  <Pagination  onChange={this.onChange} total={this.state.totalNum} />
                </div>
            </div>
        </div>
    );
  }
}

export default MineCandy

