import React, { Component } from 'react';
import { candyList } from '@/config/mobileApi';
import { countDownTimeDays, countDownTimeHour, countDownTimeMinutes, getScrollTop, getClientHeight, getScrollHeight } from '@/utils/common';
import './home.less';

class HomePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      homeList:[],
      pageNum:'',
      pageSize:'',
      total:'',
      lists:[]
    }
    this.page = 1,
    this.loading = false,
    this.loadMore = null
  }

  componentWillMount() {
    this.getLists(this.page);//  糖果小镇列表
  }

  componentDidMount() {
    const loadMore = () => {
      this.getData()
    }
    this.loadMore = loadMore
    window.addEventListener('scroll', this.loadMore);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.loadMore);
  }

  getData = () => {
    if (this.loading && getScrollTop() + getClientHeight() + 200 > getScrollHeight()) {
      this.loading = false
      this.page ++;
      if (this.state.pageNum*this.state.pageSize<this.state.total) {
        this.getLists(this.page);
      }
    }
  }

  //  糖果小镇列表
  getLists = (page=1) => {
    let params = {
      limit:6,
      page:page
    }
    candyList(params).then(res=>{
      // 
      this.setState({
        homeList:res.records  
      })
      // this.state.homeList[0].push(cardNumObj)
      // this.setState({
      //   homeList:homeList
      // })
      this.state.lists = this.state.lists.concat(this.state.homeList?this.state.homeList:[]);
      
      let cardNumObj = { hot: 'hot' };
      this.state.lists[0].hot = "hot";
      if (this.state.lists.length) {
        this.state.lists.map((item,i)=>{
          
          if (item.status === 3) {
            item.color = 'grey-box';
            item.color1 = 'grey-box1';
          } else {
            switch(i%4) {
              case 0: item.color = 'pink-box',item.color1 = 'pink-box1';break;
              case 1: item.color = 'blue-box',item.color1 = 'blue-box1';break;
              case 2: item.color = 'purple-box',item.color1 = 'purple-box1';break;
              case 3: item.color = 'plum-box',item.color1 = 'plum-box1';break;
              default: item.color = 'plum-box',item.color1 = 'plum-box1';break;
            }
          }
        })
      }
      this.setState({pageNum:res.pageNum,pageSize:res.pageSize,total:res.total})
      if (this.state.lists.length < parseInt(this.state.total)) {
        this.loading = true;
      }
    })
  }

  detail(id) {
    this.props.history.push('project/'+id);
    // this.props.history.push('/detail?Id='+id);
  }


  render() {
    const { pageNum, pageSize, total } = this.state
    return (
      <div className="candy-content">
        <img className="candyBG" src={require('../../../assets/img/background_img.png')}/>
        <div className="content">
          <div className="content-top">
            <div className="top-left">
              <h1>CandyTown</h1>
              <p>让每一个人都拥有数字货币</p>
            </div>
            <img className="top-right" src={require('../../../assets/img/home.png')}/>
          </div>
          <div className="content-bottom-content">
            <div className="content-bottom">

              {
                this.state.lists?this.state.lists.map((item,i)=>(
                  <div className="bottom-list" onClick={()=>{this.detail(item.id)}} id={item.color} key={i}>
                  {item.hot=='hot'?<img className="hotImg" src={require('../../../assets/img/hot.png')}/>:""}
                    <div className="list-top">
                      <img className="top-img" src={item.candy_icon}/>
                      <div className="top-symbol">
                        <h1>{item.candy_symbol}</h1>
                        <span>{item.brief}</span>
                      </div>
                    </div>
                    <div className="list-center">
                      <div className="center-left">
                        <span className="number">{parseInt(item.total+item.taken)}</span>
                        <span className="total">糖果总数</span>
                      </div>     
                      <div className="center-right">
                        {
                          (() => {
                            switch (item.status) {
                              case 1: return <div className="time"><span>{countDownTimeDays(item.end_time)}</span> 天 <span>{countDownTimeHour(item.end_time)}</span> 时 <span>{countDownTimeMinutes(item.end_time)}</span> 分</div>
                              case 2: return <div className="time times">未开始</div>
                              case 3: return <div className="time times">已结束</div>                            
                            }
                          })()
                        }
                        <p className="time-remaining">剩余时间</p>
                      </div>
                    </div>
                    <div className="list-bottom">
                      <button className={item.color}>查看详情</button>
                    </div>
                    <div className={item.color1}></div>
                  </div>
                )):<div className="loading-start">糖果正在加载中...</div>
              }

            </div>
            {
              pageNum*pageSize<total?<div className="loading">正在加载更多...</div>:''
            } 
          </div>
          <div className="home-logos">
            <div className="investor">
              <div className="investor1"></div>
              <h1>合作投资机构</h1>
              <div className="investor2"></div>
            </div>
            <img src={require('../../../assets/img/cssSp.png')}/>
          </div> 
        </div>         
        </div>
    );
  }
}

export default HomePage

