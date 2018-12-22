import React, { Component } from 'react';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { Slider } from 'antd-mobile';
import './index.less';

class User extends Component {

  constructor(props) {
    super(props);
    this.state = {
      address: '',
      balance: 0
    }
  }
  componentDidMount() {
  }

  render() {
    return (
      <div className='user' ref="lists">
        <Header title='个人中心'/>
        <div className="bound-number">number</div>
        <div className="cathectic">
          <div className="user-in-title">
            <p className="addr">{this.state.address}</p>
            <div className="balance">
              <p className="">Balance: {this.state.balance} Tron</p>
              <div className="base-btn">Take the prize</div>
            </div>
          </div>
        </div>
        <Footer history={this.props.history} />
        </div>
    );
  }
}

export default User

