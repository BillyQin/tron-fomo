import React, { Component } from 'react';
import { Input,Icon, Breadcrumb } from 'antd';
import { Route, Switch } from 'react-router-dom';
import './information.less';
import Article from './article/article';
import Notice from './notice/notice';


class Information extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: localStorage.getItem('currentIndex1')?localStorage.getItem('currentIndex1'):0
        } 
        this.setCurrentIndex = this.setCurrentIndex.bind(this)
      }

      setCurrentIndex(event) {
        this.setState({
          currentIndex: parseInt(event.currentTarget.getAttribute('index'), 10)
        })
        if (parseInt(event.currentTarget.getAttribute('index'), 10) == 0) {
            this.props.history.push('/information');
        }
        if (parseInt(event.currentTarget.getAttribute('index'), 10) == 1) {
            this.props.history.push('/information/Notice');
        }   
        localStorage.setItem('currentIndex1',event.currentTarget.getAttribute('index'))
      }

    render() {
        let categoryArr = ['文章', '公告'];
        let itemList = [];
        for(let i = 0; i < categoryArr.length; i++) {
            itemList.push(<li key={i}
                     className={this.state.currentIndex == i ? 'liActive' : ''}
                     index={i} onClick={this.setCurrentIndex}
                   >{categoryArr[i]}</li>);
        }
        return (
            <div className="infoWarp">
                <div className="infoLeftWarp">
                    <ul className="infoLsits">{itemList}</ul>
                </div>
                <div className="infoRightWarp">
                <Switch>
                    <Route exact path='/information' component={ Article }></Route>
                    <Route path='/information/Notice' component={ Notice }></Route>
                </Switch>  
                </div>
            </div>
        )
    }


}
export default Information