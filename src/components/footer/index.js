import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {messageList } from '@/config/mobileApi';
import './index.less';

const page = [
  {name: '游戏', link: '/', img: 'https://candytownoss.oss-cn-hangzhou.aliyuncs.com/candytown/game_grey.png', active: 'https://candytownoss.oss-cn-hangzhou.aliyuncs.com/candytown/game_red.png'},
  {name: '资讯', link: '/information', img: 'https://candytownoss.oss-cn-hangzhou.aliyuncs.com/candytown/group.png', active: 'https://candytownoss.oss-cn-hangzhou.aliyuncs.com/candytown/group-red.png'}, 
  {name: '我的', link: '/personal', img: 'https://candytownoss.oss-cn-hangzhou.aliyuncs.com/candytown/personal.png', active: 'https://candytownoss.oss-cn-hangzhou.aliyuncs.com/candytown/personal-red.png'}
]

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messListLenght:false
    }
  }

  componentWillMount () {
    let userToken = localStorage.getItem('userToken')
    if(userToken){
      this.getMessListCopy()
    }
      
  }

  getMessListCopy = () => {
    
    let paramslist = {
      limit: 10,
      page :1
    }
    let readonList = []
    messageList(paramslist).then(res=>{
      if(res.records.length == 0){
        this.setState({messListLenght:false})
      }else{
        res.records.map((item,index)=>{
          
          if(item.readon !== true){
            readonList.push(item)
          }
        })
        if(readonList.length == 0){
          this.setState({messListLenght:false})
        }else{
          this.setState({messListLenght:true})
        }
      }
    })
  }

  isLogin() {
    if (userIsLogin(this.props)) {
      return userIsLogin(this.props)
    }
    return false
  }
  render() {
    const pathName = this.props.history.location.pathname
    return (
      <div className='Footer'>
        {page.map((item, key) => (
          <Link key={key} to={item.link} className="item">
            <img src={pathName === item.link? item.active : item.img}/>
            <span style={{color: pathName === item.link ? 'rgb(230,42,128)' : '#233846'}}>{item.name}</span>
            {
              item.name == '我的' && this.state.messListLenght?<div id="circle"></div>:''
            }
          </Link>
        ))}
      </div>
    );
  }
}

export default Footer
