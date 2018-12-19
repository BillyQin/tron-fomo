import React, { Component } from 'react';
import './partner.less';


class Partner extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

  render() {
    return (
        <div className="partner">
            <div className="partner-content">
                <div className="imgs">
                    <img src={require('../../../../assets/img/investment.png')} />
                </div>
            </div>
        </div>
    )
  }


}
export default Partner