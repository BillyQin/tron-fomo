import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { Slider } from 'antd-mobile';
import './index.less';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
     
    }
  }
  componentDidMount() {
  }

  render() {
    return (
      <div className='home' ref="lists">
        <Header />
        <div className="bound-number">number</div>
        <div className="cathectic">
          <div>
            <span>输入投注额</span>
            <span>余额</span>
          </div>
          <div>
            <Slider/>
          </div>
        </div>
        <Footer history={this.props.history} />
        </div>
    );
  }
}

export default Home

