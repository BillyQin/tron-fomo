import React, { Component } from 'react';
import { Input,Icon, Breadcrumb, Form, Modal, Button, message } from 'antd';
import './myInvite.less';
import {formatTimeCopy } from '@/utils/common'
import { myInvite, userApplyAgent, shareCode, projectInviteDetail } from '@/config/mobileApi';
import SearchTable from '../../../../components/SearchTable';
import Line from '@/components/lineCharts';
import copy from 'copy-to-clipboard';
const QRCode = require('qrcode.react');

//申请代理人弹框
let ref = null
const FormItem = Form.Item
class InviteForm extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    // 申请成为代理人
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err,values)=>{
            if (!err) {
                console.log(values)
                let params = {
                    email:values.Email,
                    name:values.people,
                    weixin:values.WeXin
                }
                userApplyAgent(params).then(res=>{
                    if (res.code == 0) {
                        message.success('代理人申请已经提交，客服联系方式kefu@candytown.net')
                        this.props.hideAgent();
                    }
                })
            }
        })
    }
    
    render() {
        const { getFieldDecorator } = this.props.form
        return(
            <div>
                <Form onSubmit={this.handleSubmit} className="formPerple" layout="inline">
                    <FormItem label="手机号">
                        {getFieldDecorator('iphone', {
                        rules: [{ required: true, message: '请输入联系人的手机号' }]
                        })(
                        <Input placeholder="请输入联系人的手机号" />
                        )}
                    </FormItem>
                    <FormItem label="联系人">
                        {getFieldDecorator('people', {
                        rules: [{ required: true, message: '请输入联系人的姓名' }]
                        })(
                        <Input placeholder="请输入联系人的姓名" />
                        )}
                    </FormItem>
                    <FormItem label="微信号">
                        {getFieldDecorator('WeXin', {
                        rules: [{ required: true, message: '请输入正确的微信号' }]
                        })(
                        <Input placeholder="请输入正确的微信号" />
                        )}
                    </FormItem>
                    <FormItem label="邮箱">
                        {getFieldDecorator('Email', {
                        rules: [{ required: true, message: '请输入正确的邮箱地址' }]
                        })(
                        <Input placeholder="请输入正确的邮箱地址" />
                        )}
                    </FormItem>
                    <FormItem className="lastChild">
                        <Button type="primary" htmlType="submit" style={{width: '100%',height:'46px',border:'none',marginLeft:'100px',background:'linear-gradient(to left, rgb(254,154,139), rgb(253,134,140), rgb(249,116,143), rgb(247,140,160))'}} ref='formBtn'>提交</Button>
                    </FormItem>
                </Form>
                <p className="contentP">规则：</p>
                <p className="contentP">您邀请注册的用户及其邀请注册的用户领取本平台内任何项目糖果时您都将获得相应的代理人额外奖励。更多细则请联系我们的客服：kefu@candytown.net。越早加入，奖励越多，快来加入吧！</p>
            </div>
        )
    }

}

const MyForm = Form.create()(InviteForm)

// 代理人申请中
class InviteForm11 extends Component {
    
    render() {
        const { getFieldDecorator } = this.props.form
        return(
            <div>
                <p className="contentPs">代理人申请中</p>
            </div>
        )
    }

}
const MyForm11 = Form.create()(InviteForm11)

// 代理人申请已过期
class InviteForm22 extends Component {
    
    render() {
        const { getFieldDecorator } = this.props.form
        return(
            <div>
                <div className="invite-bottom">
                    <p>您的代理已过期，赶快申请成为代理人。<img className="question_icon" src='https://candytownoss.oss-cn-hangzhou.aliyuncs.com/candytown/question.png' /></p>
                    <div className="soonApply"><button onClick={this.props.SoonApply}>立刻申请为代理人</button></div>
                </div>
            </div>
        )
    }

}

const MyForm22 = Form.create()(InviteForm22)

// 邀请好友弹框
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

    // 邀请码
    shareCodes = () => {
        let params = {
            candy_id:this.props.candy_id,
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
        const { candy_id,item_id } = this.props
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
                            <QRCode id="qrc" value={`${this.state.url}/project/${candy_id}?invite=${this.state.code}`} />
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

// 邀请明细弹框
class InviteDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detail:[]
        }
    }

    componentWillMount() {
        this.projectInviteDetails();// 项目邀请详情
    }

    projectInviteDetails = () => {
        let params = {
            candy_id:this.props.candy_id,
            limit:10,
            page:1
        }
        projectInviteDetail(params).then(res=>{
            this.setState({
                detail:res.records
            })
        })
    }
    
    render() {
        const { getFieldDecorator } = this.props.form
        return(
            <div>
                <Form className="formPerple" layout="inline">
                    {
                        this.state.detail?this.state.detail.map((item,i)=>(
                        <div className="list">
                            <div className="list-left">
                                <img className="left-img" src={`https://candytownoss.oss-cn-hangzhou.aliyuncs.com/candytown/${item.avatar}.png`}/>
                                <div className="left-nickName">{item.nickname}</div>
                            </div>
                            <div className="list-right">{formatTimeCopy(item.draw_at)}</div>
                        </div>
                        )):''
                    }
                    <p className="bottom">没有更多，请继续邀请</p>
                </Form>
            </div>
        )
    }
}

const MyForm2 = Form.create()(InviteDetail)


class MyInvite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            xData: [],
            data: [],
            pagination: {
                current: 1,
                total: 0,
                showTotal: (total) => '共 ' + total + ' 条数据'
            },
            allCount: 0,
            missCount:0,
            list:[],
            isAgent:0,
            startTime:'',
            endTime:'',
            day:''
        }
    }

    componentWillMount() {
        this.myInvite();// 我的邀请
        this.showModals();// 弹框
    }

    // 我的邀请
    myInvite = () => {
        myInvite().then(res=>{
            let showTime = [];
            let showCount = [];
            let num = 0;
            // let num = res.invite_count[res.invite_count.length-1].count;

            res.invite_count.map((item) => {
                showTime.push(item.date ? item.date.split('T')[0].slice(5) : '')
                showCount.push(item.count)
                num = parseInt(item.count)
            })

            let date = new Date()
            let currentDate = new Date(date).getTime();
            let startDate = Date.parse(res.start_time ? res.start_time.replace('/-/g', '/') : '');
            let endDate = Date.parse(res.end_time ? res.end_time.replace('/-/g', '/') : '');
                 
            // let diffDate = (endDate - startDate) + 1 * 24 * 60 * 60 * 1000;
            let diffDate = (endDate + 1 * 24 * 60 * 60 * 1000) - ((currentDate-startDate)>0?currentDate:startDate + 1 * 24 * 60 * 60 * 1000);

            let days = diffDate / (1 * 24 * 60 * 60 * 1000) ;

            this.setState({
                day: parseInt(days),
                xData: showTime,
                allCount: num,
                data: showCount,
                list: res.item_count_list,
                pagination: {
                    current: res.pageNum,
                    total: res.total,
                    showTotal: (total) => '共 ' + total + ' 条数据'
                },
                missCount: res.miss_candy,
                isAgent: res.is_agent,
                endTime: res.end_time ? res.end_time.split("T")[0] : '',
                startTime: res.start_time ? res.start_time.split("T")[0] : ''
            })

            // console.log(res,'我的邀请')
        })
    } 


    options = {
        table: {
            columns: [{
                title: '糖果名称',
                dataIndex: 'candy_symbol',
                key: 'candy_symbol',
                width: '38%'
            },
            {
                title: '邀请人数',
                dataIndex: 'invite_count',
                key: 'invite_count',
                width: '38%'
            },
            {
                title: '操作',
                key: 'action',
                width: '24%',
                render: (value,row, index) => (
                <span>
                    <a className="mt-10" target="_blank" onClick={this.showModal1.bind(this,row.candy_id,row.item_id)}>邀请好友 </a>
                    <a className="mt-10" target="_blank" onClick={this.showModal2.bind(this,row.candy_id)}>邀请明细 </a>
                </span>
                )
            }]
        }
    }

    showModals = (isAgent) => {

        if (isAgent == 1) {
            this.showModal();
        }
        if (isAgent == 4) {
            this.showModal11();
        }
        // if (isAgent ==2 ) { }// 代理人申请成功
        if (isAgent == 3) { // 申请代理人已过期
            this.showModal22();
        }
            
    }

    showModal = () => {
        ref = Modal.info({
            title: '申请成为代理人',
            maskClosable: true,
            content: <MyForm hideAgent={this.hideAgent} submit={this.addUser}></MyForm>,
            okText: ' ',
            okType: 'none',
            closable: true,
            iconType:'none',
        })
    }

    showModal11 = () => {
        ref = Modal.info({
            title: '',
            maskClosable: true,
            content: <MyForm11 hideAgent={this.hideAgent} submit={this.addUser}></MyForm11>,
            okText: ' ',
            okType: 'none',
            closable: true,
            iconType:'none',
        })
    }

    showModal22 = () => {
        ref = Modal.info({
            title: '',
            maskClosable: true,
            content: <MyForm22 SoonApply={this.SoonApply} hideAgent={this.hideAgent} submit={this.addUser}></MyForm22>,
            okText: ' ',
            okType: 'none',
            closable: true,
            iconType:'none',
        })
    }

    SoonApply = () => {
        ref.destroy();
        this.showModal();
    }

    hideAgent = () => {
        ref.destroy()
    }

    showModal1 = (candy_id,item_id) => {
        ref = Modal.info({
            title: '邀请好友',
            maskClosable: true,
            content: <MyForm1 candy_id={candy_id} item_id={item_id} submit={this.addUser} {...this.props}></MyForm1>,
            okText: ' ',
            okType: 'none',
            closable: true,
            iconType:'none',
        })
        console.log(candy_id,item_id)
    }

    showModal2 = (candy_id) => {
        ref = Modal.info({
            title: '邀请明细',
            maskClosable: true,
            content: <MyForm2 candy_id={candy_id} submit={this.addUser}></MyForm2>,
            okText: ' ',
            okType: 'none',
            closable: true,
            iconType:'none',
        })
    }

  render() {
    let option = {
        title: '',
        xData: this.state.xData,
        type: 'line',
        height: 247,
        data: this.state.data
      }
    return (
        <div className="mineRightWarp">
            <Breadcrumb>
                {/* <Breadcrumb.Item onClick={() => {this.props.history.goBack()}}>返回</Breadcrumb.Item> */}
                <Breadcrumb.Item>我的邀请</Breadcrumb.Item>
            </Breadcrumb>
            {/* 图表 */}
            <div className="echartsWarp">
                <div className="echartsTitle">
                    <span className="candyNum">邀请总人数</span>
                    <span className="number">{this.state.allCount} 人</span>
                    {
                        localStorage.getItem('is_agent') == 'true'?'':<span className="delinquency">您已经错失 <span className="missCount">{this.state.missCount}</span> 个糖果</span>
                    }
                    
                    {
                        this.state.isAgent == 2?<p className="isAgent2">您的代理人有效期为 {this.state.startTime}~{this.state.endTime}<br />您的代理期还有{this.state.day}天到期</p>:
                        <span className="perpleBtn" onClick={this.showModals.bind(this,this.state.isAgent)}>申请成为代理人</span>
                    }
                </div>
                <div className="echartsBox">
                    <Line option={option}></Line>
                </div>
            </div>
            {/* 列表 */}
            <div className="listsWarp">
                <h5>糖果明细</h5>
                <SearchTable options={this.options} data={this.state.list} pagination={this.state.pagination} {...this.props}/>
            </div>
        </div>
    );
  }


}
export default MyInvite