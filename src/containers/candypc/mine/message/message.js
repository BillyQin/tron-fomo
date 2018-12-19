import React, { Component } from 'react';
import { Pagination } from 'antd';
import { formatTime, formatTimeCopy } from '@/utils/common';
import { messageList, messageDetail } from '@/config/mobileApi';
import './message.less';
import { Form, Modal } from "antd";

//添加消息详情弹框
let ref = null
const FormItem = Form.Item
class MessageDetail extends Component {
  constructor(props) {
      super(props)
      this.state = {
        title:'',
        created_at:'',
        origin:'',
        prospectus:'',
        item_id:'',
        id:'',
      }
  }

  componentWillMount() {
    this.messageDetails();// 消息详情
  }

  // 消息详情
  messageDetails = () => {
    let params = {
      id:this.props.id
    }
    messageDetail(params).then(res=>{
      this.setState({
        title:res.title,
        created_at:res.created_at,
        origin:res.origin,
        prospectus:res.prospectus,
        id:res.candy_id,
        item_id:res.item_id
      })
      if(res.prospectus){
        document.getElementById('prospectus').innerHTML = res.prospectus
      }
      if (res) {
        this.props.Messages();
      }
      console.log(res)
    })
  }

  // {
  //   item_id === 0 ||  id === 0? "" : <div className="bottom-btn">
  //     <div className="goProject" onClick={this.props.hideChild}>查看项目详情</div>
  //   </div>
  // }

  render() {
    const { getFieldDecorator } = this.props.form
    const { title, created_at, origin, prospectus, item_id, id } = this.state
    return(
        <div>
            <Form onSubmit={this.handleSubmit} className="formPerple" layout="inline"> 
              <div className="title">{title}</div>
              <div className="create-origin">
               <span className="create">{formatTimeCopy(created_at)}</span>
               <span className="origin">来源：{origin}</span>
              </div>
              <div className="prospectus" id="prospectus"></div>
            </Form>
        </div>
    )
  }
}
const MyForm = Form.create()(MessageDetail) 


class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail:[],
      total: 1,
      id:''
    }
  }

  componentWillMount() {
    this.messageList();// 消息中心
  }

  messageList = (page) => {
    let params = {
      limit:10,
      page:page
    }
    messageList(params).then(res=>{
      this.setState({
        detail:res.records,
        total:res.total
      })
      console.log(res,'消息list')
    })
  }

  onChange = (page) => {
    this.messageList(page);
    console.log(page)
  }

  showModal = (id) => {
    ref = Modal.info({
      title: '消息详情',
      maskClosable: true,
      content: <MyForm id={id} submit={this.addUser} Messages={this.messageList(1)}  hideChild={this.hideChild} history ={this.props.history}></MyForm>,
      okText: ' ',
      okType: 'none',
      closable: true,
      iconType:'none',
    })
    this.messageList(id);
  }

  // 详情 
  messageDetails = (id) => {
    let params = {
      id:id
    }
    messageDetail(params).then(res=>{
      this.setState({
        id:res.candy_id
      })
      console.log(res)
    })
  }

  hideChild = () => {
    ref.destroy();
    // this.props.history.push(`/detail?id=`+this.state.id);
  }

  render() {
    return (
      <div className="message-center">
        <div className="message-content">
          <div className="contents">
            <h1>消息中心</h1>
            {
              this.state.detail?this.state.detail.map((item,i)=>(
                <div className="list" key={i} onClick={this.showModal.bind(this,item.id)}>
                  <div className="list-left">
                    {
                      item.readon?<span></span>:<span className="circle"></span>
                    }
                    <span className="text">{item.title}</span>
                  </div>
                  <div className="time">{formatTime(item.updated_at,true)}</div>
              </div>
              )):""
            }
            <div className="pagination">
              <Pagination onChange={this.onChange} pageSize={10} total={this.state.total} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Message

