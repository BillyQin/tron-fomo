import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'antd-mobile'
import './index.less';

class Header extends Component {

  constructor (props) {
    super(props);
    this.isApp = false
    this.webview = null
  }

  gobackUrl = () => {
    const {history} = this.props
    if (history.length <= 2) {
      history.push('/')
    } else {
      if (this.isApp) {
        this.webview.back()
      } else {
        history.goBack()
      }
    }
    localStorage.removeItem("shareCodeMyself")
    localStorage.removeItem("shareMyselfInvite")
  }
  render() {
    const {history} = this.props
    return (
      <div className="header">
        <div className="left" onClick={this.gobackUrl}>
          <Icon size='sm' type="left" />
        </div>
        <div className="center">
          <span>{this.props.title || ''}</span>
        </div>
        <div className="right">
          {this.props.extends}
        </div>
      </div>
    );
  }
}

export default Header
