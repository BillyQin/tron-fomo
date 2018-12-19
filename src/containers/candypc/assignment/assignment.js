import React, { Component } from 'react';
import { Pagination, Form, Modal, message } from 'antd';
import Clipboard from "react-clipboard";
import copy from 'copy-to-clipboard';
import { taskList, taskDetail, taskAddWx } from '@/config/mobileApi';
import './assignment.less';

import MyFormLogin from '@/components/loginpc';
import MyFormForgetPass from '@/components/forgetpasspc';


// 已结束/去做任务
let ref = null
const FormItem = Form.Item
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

const MyForm = Form.create()(DOTasks)

class Assignment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flag:false,
            taskLists:[],
            active: 0,
            name:'',
            icon:'',
            finish_count:'',
            prospectus:'',
            quota:''
        } 
    }

    componentWillMount() {
        this.taskList();//所有任务列表
    }

    // 所有任务列表
    taskList = () => {
        let params = {}
        taskList(params).then(res=>{
            this.setState({
                taskLists:res
            })
            this.choose(0, res[0].id)
            console.log(res,'res')
        })
    }

    choose(i, id) {
        this.setState({
            active: i
        })
        taskDetail({id:id}).then(res=>{ // 项目任务详情
            this.setState({
                name:res.name,
                icon:res.icon,
                quota:res.quota,
                finish_count:res.finish_count,
                prospectus:res.prospectus.replace(/<[^>]+>/g,""),
                trigger:res.trigger.split('@')
            })
        })
    }

    showModal = (id) => {
        if (localStorage.getItem('isLogin')) {
            ref = Modal.info({
                title: '',
                maskClosable: true,
                content: <MyForm id={id} submit={this.addUser} history ={this.props.history}></MyForm>,
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

  render() {
    const { name, icon, quota, finish_count, prospectus, trigger } = this.state
    return (
      <div className="assignment-center">
        <div className="assignment-content">
            <div className="content-left">
                <div className="left-top">
                    <h1>任务列表</h1>
                    {
                        this.state.taskLists?this.state.taskLists.map((item,i)=>(
                            <div className={this.state.active === i ? "task-list active" : "task-list" }  key={i} onMouseOver={this.choose.bind(this, i, item.id) }>
                                <div className="list-left" >
                                    <img  src={item.icon} />
                                    <div className="symbol-info">
                                        <span className="symbol">{item.name}</span>
                                        <span className="info">{item.prospectus.replace(/<[^>]+>/g,"").replace(/&nbsp;/ig, " ")}</span>
                                    </div>
                                </div>
                                <div className="list-right">
                                    <span>+{item.quota} {item.trigger.split('@')}</span>
                                    {
                                        (() => {
                                          switch (Number(item.status)){
                                            case 1 : return <div>{item.finished?<button className="Completed" onClick={this.showModal.bind(this,item.id)}>已完成</button>:<button className="todoTask" onClick={this.showModal.bind(this,item.id)}>去做任务</button>}</div>
                                            case 2 :
                                            case 3 : return <button className="finished">已结束</button>
                                            default: return <button></button>
                                          }
                                        })()
                                    }
                                </div>
                            </div>
                        )):''
                    }
                    
                </div>
                  
            </div>
            <div className="content-right">
                <div className="right-bottom">
                    <h1>{name}</h1>
                    <div className="bottom-list">
                        <div className="list-top">
                            <div className="list-left">
                                <img src={icon}/>
                                <span>+{quota} {trigger}</span>
                            </div>
                            <div className="list-right">
                                <span>已完成</span>
                                <span>{finish_count} 人</span>
                            </div>
                        </div>
                        <div className="list-bottom">{prospectus}</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }
}

export default Assignment

