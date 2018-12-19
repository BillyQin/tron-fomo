import React, { Component } from 'react';
import { Input,Icon, Breadcrumb } from 'antd';
import { Route, Switch } from 'react-router-dom';
import './mine.less';
import MineCandy from './myCandy/myCandy';
import MyInvite from './myInvite/myInvite';
import SecurityCenter from './securitycenter/securitycenter';
import Message from './message/message';

import CandyMake from './myCandy/candyMake/candyMake';
import CandyTransfer from './myCandy/candyTransfer/candyTransfer';
import CandyDetail from './myCandy/candyDetail/candyDetail';
import CandyChange from './myCandy/candyChange/candyChange';

class MinePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: localStorage.getItem('currentIndex2')?localStorage.getItem('currentIndex2'):0
        } 
        this.setCurrentIndex = this.setCurrentIndex.bind(this)
        this.name = ''
        this.avatar = ''
        this.is_agent = ''
      }

      componentWillMount() {
        this.name = localStorage.getItem('nick_name');
        this.avatar = localStorage.getItem('avatar');
        this.is_agent = localStorage.getItem('is_agent');
        console.log(this.avatar)
      }

      setCurrentIndex(event) {
        this.setState({
          currentIndex: parseInt(event.currentTarget.getAttribute('index'), 10)
        })
        if (parseInt(event.currentTarget.getAttribute('index'), 10) == 0) {
            this.props.history.push('/mine');
        }
        if (parseInt(event.currentTarget.getAttribute('index'), 10) == 1) {
            this.props.history.push('/mine/myInvite');
        }
        if (parseInt(event.currentTarget.getAttribute('index'), 10) == 2) {
            this.props.history.push('/mine/SecurityCenter');
        }
        if (parseInt(event.currentTarget.getAttribute('index'), 10) == 3) {
            this.props.history.push('/mine/Message');
        }
        localStorage.setItem('currentIndex2',event.currentTarget.getAttribute('index'))
      }

    render() {
        let categoryArr = ['我的糖果', '我的邀请', '安全中心','消息中心'];
        let itemList = [];
        for(let i = 0; i < categoryArr.length; i++) {
            itemList.push(<li key={i}
                     className={this.state.currentIndex == i ? 'liActive' : ''}
                     index={i} onClick={this.setCurrentIndex}
                   >{categoryArr[i]}</li>);
        }
        return (
            <div className="mineWarp">
                <div className="mineLeftWarp">
                    <div className="mineMsg">
                        <img src={`https://candytownoss.oss-cn-hangzhou.aliyuncs.com/candytown/${this.avatar}.png`}/>
                        <p>
                            <p className="userName"><span>{this.name}</span></p>
                            {
                                this.is_agent === 'true'?<p className="isAgent"><span>代理人</span></p>:''
                            }
                        </p>
                    </div>
                    
                    <ul className="mineLsits">{itemList}</ul>
                </div>
                <div className="mineRightWarp">
                <Switch>
                    <Route exact path='/mine' component={ MineCandy }></Route>
                    <Route path='/mine/myInvite' component={ MyInvite }></Route>
                    <Route path='/mine/SecurityCenter' component={ SecurityCenter }></Route>
                    <Route path='/mine/Message' component={ Message }></Route>
                    <Route path='/mine/myCandy/candyMake' component={ CandyMake }></Route>
                    <Route path='/mine/myCandy/candyTransfer' component={ CandyTransfer }></Route>
                    <Route path='/mine/myCandy/candyDetail' component={ CandyDetail }></Route>
                    <Route path='/mine/myCandy/candyChange' component={ CandyChange }></Route>
                </Switch>  
                </div>
            </div>
        )
    }


}
export default MinePage