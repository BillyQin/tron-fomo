import React, { Component } from 'react';
import { countDownTime, countDownTimeDays, transFloat, formatTimeCopy } from '@/utils/common';
import { candyDetail, drawCandy, officalCommun, projecttaskList, comingTrade, trendList, shareCode, createMsg, taskAddWx, communityDetail, upperForm } from '@/config/mobileApi';
import { Pagination, Form, Modal, message } from 'antd';
import copy from 'copy-to-clipboard';
const QRCode = require('qrcode.react');
import './detail.less';

import MyFormLogin from '@/components/loginpc';
import MyFormForgetPass from '@/components/forgetpasspc';

// 邀请好友弹框
let ref = null
const FormItem = Form.Item
class InviteFriends extends Component {
    constructor(props) {
        super(props)
        this.state = {
            url:'',
            code:'',
            imgUrl:'',
            inputCode:'',
            bg:''
        }
    }

    componentWillMount(){
        this.shareCodes();// 邀请码
    }

    邀请码
    shareCodes = () => {
        let params = {
            candy_id:this.props.id,
            item_id:this.props.item_id
        }
        return new Promise((resolve, reject) => {
            shareCode(params).then(res => {
                this.setState({url: res.url, code: res.share_code, imgUrl: res.background, inputCode: res.input_share_code})
                if(res.background){
                    let img = new Image();   // 创建一个<img>元素
                    img.crossOrigin ='anonymous'
                    let c = document.getElementById('canvas');
                    const devWidth = document.documentElement.clientWidth
                    let size = ((devWidth > 640 ? 640 : devWidth) / 3.75)
                    let _width = 3.35 * size
                    let _height = 3.34 * size
                    c.width = _width;
                    c.height = _height;
                    let ctx=c.getContext('2d');
                    img.onload = () => {
                    ctx.drawImage(img,0,0,_width,_height);
                    let bg = c.toDataURL("image/png", 1.0)
                    this.setState({bg}, resolve())
                    }
                    img.src = res.background; // 设置图片源地址
                }
            }).catch(() => {
                reject()
            })
        })
    }

    // 二维码转为图片
    cardToImg = () => {
        html2canvas(document.querySelector("#card"),{
        useCORS: true,
        logging: true
        }).then((canvas) => {
        this.imageUrl = canvas.toDataURL("image/png")
        this.setState({isUpdate: !this.state.isUpdate})
        })
    }

    copyCode = () => {
        if (copy(this.state.inputCode)) {
            message.success('复制成功');
        }else{
            message.error('复制失败')
        }
    }

    render() {
        const { id,item_id } = this.props
        const { getFieldDecorator } = this.props.form
        return(
            <div>
                <Form onSubmit={this.handleSubmit} className="formPerple" layout="inline">
                {
                    this.imageUrl?
                    <img cross-origin='anonymous' src={this.imageUrl} className="main-image"/>:
                    <main id="card" className="main-box" style={{background: 'url('+this.state.bg+')'}}>
                      <span className="name">CandyTown</span>
                      <span className="intro">诸多糖果免费领取</span>
                      <div className="qrcode">
                        <QRCode id="qrc" value={`${this.state.url}/project/${id}?invite=${this.state.code}`} />
                      </div>
                      { this.state.bg ? null : <canvas id='canvas' className="canvas"></canvas>}
                    </main>
                  }
                  <div className="share-code" onClick={()=>{this.copyCode()}}>
                    <p>专属邀请码,点击复制</p>
                    <strong>{this.state.inputCode}</strong>
                  </div>
                </Form>
            </div>
        )
    }
}
const MyForm1 = Form.create()(InviteFriends)

// 邀请好友弹框（立即分享 => 进入）
class InviteFriends1 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            url:'',
            code:'',
            imgUrl:'',
            inputCode:'',
            bg:''
        }
    }

    componentWillMount(){
        this.shareCodes();// 邀请码
        console.log(this.props)
    }

    邀请码
    shareCodes = () => {
        let params = {
            candy_id:this.props.id,
            item_id:this.props.item_id
        }
        return new Promise((resolve, reject) => {
            shareCode(params).then(res => {
                this.setState({url: res.url, code: res.share_code, imgUrl: res.background, inputCode: res.input_share_code})
                if(res.background){
                    let img = new Image();   // 创建一个<img>元素
                    img.crossOrigin ='anonymous'
                    let c = document.getElementById('canvas');
                    const devWidth = document.documentElement.clientWidth
                    let size = ((devWidth > 640 ? 640 : devWidth) / 3.75)
                    let _width = 3.35 * size
                    let _height = 3.34 * size
                    c.width = _width;
                    c.height = _height;
                    let ctx=c.getContext('2d');
                    img.onload = () => {
                    ctx.drawImage(img,0,0,_width,_height);
                    let bg = c.toDataURL("image/png", 1.0)
                    this.setState({bg}, resolve())
                    }
                    img.src = res.background; // 设置图片源地址
                }
            }).catch(() => {
                reject()
            })
        })
    }

    // 二维码转为图片
    cardToImg = () => {
        html2canvas(document.querySelector("#card"),{
        useCORS: true,
        logging: true
        }).then((canvas) => {
        this.imageUrl = canvas.toDataURL("image/png")
        this.setState({isUpdate: !this.state.isUpdate})
        })
    }

    copyCode = () => {
        if (copy(this.state.inputCode)) {
            message.success('复制成功');
        }else{
            message.error('复制失败')
        }
    }

    render() {
        const { id,item_id } = this.props
        const { getFieldDecorator } = this.props.form
        return(
            <div>
                <Form onSubmit={this.handleSubmit} className="formPerple" layout="inline">
                {
                    this.imageUrl?
                    <img cross-origin='anonymous' src={this.imageUrl} className="main-image"/>:
                    <main id="card" className="main-box" style={{background: 'url('+this.state.bg+')'}}>
                    <span className="name">CandyTown</span>
                    <span className="intro">诸多糖果免费领取</span>
                    <div className="qrcode">
                        <QRCode id="qrc" value={`${this.state.url}/project/${id}?invite=${this.state.code}`} />
                    </div>
                    { this.state.bg ? null : <canvas id='canvas' className="canvas"></canvas>}
                    </main>
                }
                <div className="share-code" onClick={()=>{this.copyCode()}}>
                    <p>专属邀请码,点击复制</p>
                    <strong>{this.state.inputCode}</strong>
                </div>
                </Form>
            </div>
        )
    }
}
const MyForm11 = Form.create()(InviteFriends1)

// 立即领取弹框
class RightNowReceive extends Component {
  constructor(props) {
      super(props)
      this.state = {
        count:'',
        price:'',
        draw_info:''
      }
  }

  componentWillMount() {
    this.candyDetails();// 糖果详情
  }

  candyDetails = () => {
      console.log(this.props.symbol)
      let params = {
        share_code:null,
        symbol:this.props.symbol
      }
      drawCandy(params).then(res=>{
        this.setState({
            count:res.count,
            price:res.price,
            draw_info:res.draw_info
        })
        if (res) {
            window.location.reload();
        }
        console.log(res)
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { count, price, draw_info } = this.state
    return(
        <div>
            <Form onSubmit={this.handleSubmit} className="formPerple" layout="inline"> 
              <h1>你已获得</h1>
              <p className="span">{count}个{this.state.symbol}糖果</p>
              <p className="Equal span">≈</p>
              <p className="span">￥{price}</p>
              <p className="contentText">{draw_info}</p>
              <div className="buttons">
                <p onClick={this.props.childModal}>立即分享</p>
              </div>
            </Form>
        </div>
    )
  }
}
const MyForm = Form.create()(RightNowReceive) 

// 立即爆料弹框
class ImmediateReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message:''
        }
    }
  
    // 消息留言
    createMsgs = () => {
        let params = {
            item_id:this.props.item_id,
            message:this.state.message
        }
        createMsg(params).then(res=>{
            if (res.code == 0) {
                message.success('该资料已提交，正在等待工作人员审核！');
                setTimeout(() => {
                    this.props.hideModal();
                }, 1000);
            }
        })
    }
    
    render() {
        const { getFieldDecorator } = this.props.form
        return(
            <div>
                <Form onSubmit={this.handleSubmit} className="formPerple" layout="inline">
                    <p className="messages">消息留言</p>
                    <textarea placeholder="请输入留言" onChange={(e) => this.setState({message:e.target.value})}></textarea>
                    <div className="messageDiv"> 
                        <button className="messageButton" onClick={this.createMsgs}>提交</button>
                    </div>
                </Form>
            </div>
        )
    }
  
  }
const MyForm2 = Form.create()(ImmediateReport)

// 做任务弹框
class DOTasks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            key_word:'',
            weixin:'',
            weixin_url:''
        }
    }

    componentWillMount() {
      this.taskAddWxs();// 项目任务微信加群
    }

    // 项目任务微信加群
    taskAddWxs = () => {
        let params = {id:this.props.id}
        taskAddWx(params).then(res=>{
            this.setState({
                key_word:res.key_word,
                weixin:res.weixin,
                weixin_url:res.weixin_url
            })
            console.log(res)
        })
    }

    // 复制
    copyText = (key_word) =>{
        if(copy(key_word)){
            message.success('复制成功！');
        }else{
            message.error('复制失败！');
        }
    }
    
    render() {
        const { key_word, weixin, weixin_url } = this.state
        const { getFieldDecorator } = this.props.form
        return(
            <div>
                <Form onSubmit={this.handleSubmit} className="formPerple" layout="inline">
                    <h1 className="taskH1">CandyToken</h1>
                    <div className="addCard">
                        <span className="card">您的专属加群码</span>
                        <span className="card-detail" id="card-detail">{key_word}</span>
                        <div className="copy" id="copy" data-clipboard-target="#card-detail" onClick={()=>{this.copyText(key_word)}}>复制</div>
                    </div>
                    <div className="describe">
                        <p>1.复制您的专属加群码。</p>
                        <p className="p_1">2.长按下方二维码添加机器人<span className="p_s1">{weixin}</span>为好友。</p>
                        <p className="p_2">3.进群后粘贴您的专属加群码<br/><span className="p_s2">{key_word}</span></p>
                        <span className="span_2">长按或扫描二维码即可添加好友</span>
                        <div className="qrCodebox">
                            <div className="qrCode">
                                <img src={weixin_url} />
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        )
    }
}
const MyForm3 = Form.create()(DOTasks)

// 官方社群弹框
class Communitys extends Component {
    constructor(props) {
        super(props)
        this.state = {
            channel:'',
            identifier:'',
            community_name:''
        }
    }

    componentWillMount() {
        console.log(this.props)
      this.officalCommuns(); // 官方社群
    }

    // 官方社群 => 待定
    officalCommuns = () => {
        let params = {
            item_id:this.props.item_id 
        }
        officalCommun(params).then(res=>{
            res.map((item,i)=>{
                if (this.props.channel == item.channel) {
                    this.setState({
                        channel:item.channel,
                        identifier:item.identifier,
                        community_name:item.community_name
                    })
                    console.log(item)
                }
            })
            console.log(res)
        })
    }

    // 复制
    copyText = (community_name) =>{
        if(copy(community_name)){
            message.success('复制成功！');
        }else{
            message.error('复制失败！');
        }
    }
    
    render() {
        const { channel, identifier, community_name } = this.state
        return(
            <div>
                <Form onSubmit={this.handleSubmit} className="formPerple" layout="inline">
                  <p className="community-h1">{channel}</p>  
                  <div className="community-content">
                    <img src={identifier} />
                    <p className="community_name" id="community_name">{community_name}</p>
                  </div>
                  <div className="community-button">
                    <button className="community-button" onClick={()=>{this.copyText(community_name)}}>复制</button>
                  </div>
                </Form>
            </div>
        )
    }
}
const MyForm4 = Form.create()(Communitys)

class DetailPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
        detail:'',
        prospectus:'',
        id:'',
        item_id:'',
        offCommun:[],
        taskLists:[],
        prospectus1:'',
        comingTrades:[],
        upperForms:[],
        trendListsData:[],
        total:1,
        current:1,
        user_draw:'',
        symbol:'',
        active:0,
        active0:0,
        active1:0,
        status:'',
        user_draw:''
    }
  }

  componentWillMount() {
      this.candyDetail();//  项目详情
      this.maodian();
  }

  maodian = () => {
    document.body.scrollTop = 0;
  }

  //  项目详情
  candyDetail = () => {
    let detailId = parseInt(this.props.history.location.pathname.split('/').pop());
    candyDetail({id:detailId}).then(res=>{
        this.setState({
            detail:res,
            id:res.id,
            item_id:res.item_id,
            user_draw:res.user_draw,
            symbol:res.candy_symbol,
            status:res.status,
            user_draw:res.user_draw,
        })
        console.log(res,'detail11')
        if(document.getElementById('intro-content')) {
            document.getElementById('intro-content').innerHTML = res.prospectus
        }
        this.officalCommun();//  官方社群
        this.projecttaskList();// 所有任务列表 =>todo项目任务列表
        this.comingTrade();// 马上交易
        this.upperForm();// 已上平台
        this.trendList();// 最新动态/评论
        console.log(this.state.detail,'detail')
    })
  }

  //  官方社群
  officalCommun = () => {
    let params = {
        item_id:this.state.item_id
    }
    officalCommun(params).then(res=>{
        this.setState({
            offCommun:res
        })
        console.log(res)
    })
  }  
  
  //  项目任务列表
  projecttaskList = () => {
    let params = {
        id:this.state.item_id
    }
    projecttaskList(params).then(res=>{
        this.setState({
            taskLists:res
        })
        console.log(res,'taskLists')
    })
  }

  // 已上平台
  upperForm = () => {
      let params = {
          item_id:this.state.item_id
      }
      upperForm(params).then(res=>{
          this.setState({
            upperForms:res 
          })
          console.log(res)
      })
  }

  // 马上交易
  comingTrade = () => {
      let params = {
          item_id:this.state.item_id
      }
      comingTrade(params).then(res=>{
          this.setState({
            comingTrades:res
          })
        //   console.log(res,'comingTrade')
      })
  }

  // 最新动态/评论
  trendList = (page) => {
    let params = {
        item_id:this.state.item_id,
        limit:10,
        page:page
    }
    trendList(params).then(res=>{
        this.setState({
            trendListsData:res.records,
            total:res.total,
        })
        console.log(res,'trendList')
    })
  }

  //  页码改变的回调，参数是改变后的页码及每页条数
  onChange = (page) => {
    this.trendList(page);
  }

  // item跳转外链
  goTo(item) {
        if(item.exchange_url.split('/')[2]){
            window.open(item.exchange_url,"_blank")
        }else{
            window.open(item.exchange_url,"_blank")
        }
   }

    // 立即领取
    showModal = (symbol) => {
        if (localStorage.getItem('isLogin')) {
            ref = Modal.info({
                title: '',
                maskClosable: true,
                content: <MyForm symbol={symbol} submit={this.addUser}  childModal={this.childModal} history ={this.props.history}></MyForm>,
                okText: ' ',
                okType: 'none',
                closable: true,
                iconType:'none',
            })
        } else {
            this.showModalLogin();
        }
        
    }

    showModalLogin = () => {
        ref = Modal.info({
          title: '登录账号',
          maskClosable: true,
          content: <MyFormLogin submit={this.addUser} childModalPass={this.childModalPass} history ={this.props.history}></MyFormLogin>,
          okText: ' ',
          okType: 'none',
          closable: true,
          iconType:'none',
        })
    }

    childModalPass = () => {
        ref.destroy();
        this.showModalForgetPass();
    }

    showModalForgetPass = () => {
        ref = Modal.info({
          title: '忘记密码',
          maskClosable: true,
          content: <MyFormForgetPass submit={this.addUser} hidePass={this.hidePass} history ={this.props.history}></MyFormForgetPass>,
          okText: ' ',
          okType: 'none',
          closable: true,
          iconType:'none',
        })
    }

    hidePass = () => {
        ref.destroy();
    }

    // 邀请好友
    showModal1 = (id,item_id) => {
        if (localStorage.getItem('isLogin')) {
            ref = Modal.info({
                title: '邀请好友',
                maskClosable: true,
                content: <MyForm1 id={id} item_id={item_id} submit={this.addUser}></MyForm1>,
                okText: ' ',
                okType: 'none',
                closable: true,
                iconType:'none',
            })
        } else {
            this.showModalLogin();
        }
        console.log(id,item_id)
    }

    // 邀请好友（立即分享）
    showModal11 = (id,item_id) => {
        ref = Modal.info({
            title: '邀请好友',
            maskClosable: true,
            content: <MyForm11 id={this.state.id} item_id={this.state.item_id} submit={this.addUser}></MyForm11>,
            okText: ' ',
            okType: 'none',
            closable: true,
            iconType:'none',
        })
        console.log(id,item_id)
    }

    childModal = () => {
        ref.destroy();
        this.showModal11(this.state.id,this.state.item_id);
    }

    hideModal = () => {
        ref.destroy();
    }

    // 立即爆料
    showModal2 = (item_id) => {
        if (localStorage.getItem('isLogin')) {
            ref = Modal.info({
                title: '',
                maskClosable: true,
                content: <MyForm2 item_id={item_id} hideModal={this.hideModal} submit={this.addUser}></MyForm2>,
                okText: ' ',
                okType: 'none',
                closable: true,
                iconType:'none',
            })  
        } else {
            this.showModalLogin();
        }
        
        console.log(item_id)
    }

    // 做任务/已结束
    showModal3 = (id) => {
        if (localStorage.getItem('isLogin')) {
            ref = Modal.info({
                title: '',
                maskClosable: true,
                content: <MyForm3 id={id} submit={this.addUser}></MyForm3>,
                okText: ' ',
                okType: 'none',
                closable: true,
                iconType:'none',
            })
        } else {
            this.showModalLogin();
        } 
        console.log(id)
    }

    // 官方社群
    showModal4 = (item_id,channel) => {
        ref = Modal.info({
            title: '',
            maskClosable: true,
            content: <MyForm4 item_id={item_id} channel={channel} submit={this.addUser}></MyForm4>,
            okText: ' ',
            okType: 'none',
            closable: true,
            iconType:'none',
        })
        console.log(item_id,channel)
    }

    choose = (i) => {
        this.setState({
            active:i
        })
    }

    choose0 = (i) => {
        this.setState({
            active0:i
        })
    }

    choose1 = (i) => {
        this.setState({
            active1:i
        })
    }

  render() {
    return (
      <div className="detail-center">
        <div className="detail-content">
          <div className="content-left">
            <div className="left-introduce">
              <h1>{this.state.detail.candy_symbol} 项目介绍</h1>
              <div className="intro-content" id="intro-content"></div>
            </div>
            <div className="left-association">
              <h1>{this.state.detail.candy_symbol} 官方社群</h1>
              <div className="buttons">
              {
                 this.state.offCommun?this.state.offCommun.map((item,i)=>(
                    <button onClick={this.showModal4.bind(this,this.state.item_id,item.channel)} key={i}>{item.channel}</button>
                 )):'' 
              }
              </div>
            </div>

            {
                this.state.taskLists.length>0?
                <div className="left-tasklist">
                <h1>{this.state.detail.candy_symbol} 任务列表</h1>
                {
                    this.state.taskLists.length>0?
                    this.state.taskLists.map((item,i)=>(
                      <div className={this.state.active === i ? "task-list active" : "task-list" } key={i} onMouseOver={this.choose.bind(this,i) }>
                          <div className="list-left" >
                              <p><img src={item.icon} /></p>
                              <div className="symbol-info">
                                  <span className="symbol">{item.name}</span>
                                  <span className="info" id="info">{item.prospectus.replace(/<[^>]+>/g,"").replace(/&nbsp;/ig, " ")}</span>
                              </div>
                          </div>
                          <div className="list-right">
                              <span>+{item.quota} CT</span>
                              {
                                  (() => {
                                    switch (Number(item.status)){
                                      case 1 : return <div>{item.finished?<button onClick={this.showModal3.bind(this,item.id)} className="Completed">已完成</button>:<button className="gotoTask" onClick={this.showModal3.bind(this,item.id)}>去做任务</button>}</div>
                                      case 2 :
                                      case 3 : return <button className="finished">已结束</button>
                                      default: return <button></button>
                                    }
                                  })()
                                }
                          </div>
                      </div>
                    )):<div>暂无任务列表</div>
                } 
              </div>:''
            }
            
            {
                this.state.upperForms.length>0?<div className="left-exchange">
                <h1>马上交易</h1>
                {
                    this.state.upperForms?this.state.upperForms.map((item,i)=>(
                      <div className={this.state.active0 === i ? "task-list active" : "task-list"} key={i}>
                          <div className="list-left" onClick={this.choose0.bind(this,i) }>
                              <img src={item.icon} />
                              <div className="symbol-info">
                                  <span className="symbol">{item.name}</span>
                                  <span className="info">{item.brief}</span>
                              </div>
                          </div>
                          <div className="list-right">
                              <button onClick={()=>this.goTo(item)}>立即访问</button>
                          </div>
                      </div>
                    )):''
                }
              </div>:''
            }

            {
                this.state.comingTrades.length>0?<div className="left-exchange">
                <h1>已上平台</h1>
                {
                    this.state.comingTrades?this.state.comingTrades.map((item,i)=>(
                      <div className={this.state.active1 === i ? "task-list active" : "task-list" } key={i}>
                          <div className="list-left" onClick={this.choose1.bind(this,i) }>
                              <img src={item.icon} />
                              <div className="symbol-info">
                                  <span className="symbol">{item.name}</span>
                                  <span className="info">{item.brief}</span>
                              </div>
                          </div>
                          <div className="list-right">
                              <button onClick={()=>this.goTo(item)}>立即访问</button>
                          </div>
                      </div>
                    )):''
                }
              </div>:''
            }
            
          </div>
          <div className="content-right">
            <div className="right-candy">
              <h1>糖果</h1>
              <div className="top-content">
                  <div className="total">
                      <span className="total-one">糖果总数</span>
                      <span>{this.state.detail.taken + this.state.detail.total} {this.state.symbol}</span>
                  </div>
                  <div className="num">
                      <span className="num-one">领取总量</span>
                      <span>{this.state.detail.taken} {this.state.symbol}</span>
                  </div>
                  <div className="time">
                      <span className="time-one">剩余时间</span>
                      {
                        (() => {
                          switch (this.state.status) {
                            case 1: return <p>{countDownTime(this.state.detail.end_time)}</p>
                            case 2: return <span>未开始</span>
                            case 3: return <span>已结束</span>                           
                          }
                        })()
                      }
                  </div>
                  {
                    localStorage.getItem('isLogin') && this.state.user_draw?
                        <div className="alreadyReceived">
                            <span className="receive">已领取</span>
                            <span className="already">{this.state.detail.hold_count} {this.state.symbol} ≈ ￥ {parseFloat(this.state.detail.price*this.state.detail.hold_count).toFixed(2)}</span>
                        </div>:''
                  }
                  
              </div>
              <div className="buttons">
                {
                    this.state.user_draw==false && this.state.status==1?<button className="right-array" onClick={this.showModal.bind(this,this.state.symbol)}>立即领取</button>:''
                }
                <button className="invite-friend" onClick={this.showModal1.bind(this,this.state.id,this.state.item_id)}>邀请好友一起领糖果</button>
              </div>
            </div>
            <div className="right-comment">
              <h1>评论</h1>
              {
                  this.state.trendListsData?this.state.trendListsData.map((item,i)=>(
                    <div className="bottom-list" key={i}>
                        <div className="list-top">
                            <img src={`https://candytownoss.oss-cn-hangzhou.aliyuncs.com/candytown/${item.avatar  || 1}.png`} />
                            <div className="top-right">
                                <span className="symbol">
                                    {item.nick_name}
                                    {item.source?<img className="officalIcon" src="https://candytownoss.oss-cn-hangzhou.aliyuncs.com/candytown/offical_icon.png"/>:''}
                                    {item.is_agent?<span className="isAgent">代理人</span>:''}
                                </span> 
                                <span>{formatTimeCopy(item.updated_at)}</span>
                            </div>
                        </div>
                        <div className="list-bottom">{item.message}</div>
                    </div>
                  )):<div className="bottom-list-content">暂无</div>
              }
              <div className="pagination">
                <Pagination hideOnSinglePage={true} onChange={this.onChange} total={this.state.total} />
              </div>
              <div className="buttons">
                <button onClick={this.showModal2.bind(this,this.state.item_id)}>立即爆料</button>
              </div>
            </div>
          </div>
        </div> 
      </div>
    );
  }
}

export default DetailPage

