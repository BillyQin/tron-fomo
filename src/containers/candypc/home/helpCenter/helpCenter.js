import React, { Component } from 'react';
import './helpCenter.less';


class HelpCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

  render() {
    return (
        <div className="helpCenter">
            <div className="helpCenter-content">
                <div className="candy-town">
                    <p>Q1：糖果小镇是一个什么样的平台？</p>
                    <p>A1：糖果小镇是一个数字资产的糖果分发平台，每周将持续上新数种糖果，用户可以持续领取总值近千元的数字资产。目前糖果小镇已获上市公司及多家顶级 Token Fund（Turing 图灵基金、Tureway 筹帷资本、genesis 创世资本等）联合投资，近百家区块链知名媒体、交易所、矿池、机构已加入糖果小镇，成为节点伙伴。</p>
                    <p>Q2：持有CT（CandyToken）享有什么权益？</p>
                    <p>CandyToken（CT）是糖果小镇生态发行的通证。目前 CT 已由多家顶级资本和项目方认购。</p>
                    <p>【糖果项目兑换媒介】 糖果小镇进行长期运营之后，会形成糖果池，未来参与者可完成相应的任务获得Candy Token，通过Candy Token可兑换各类糖果。</p>
                    <p>【信息源奖励Token】 Candy Token将用于激励为各类项目提供精准信息，同时热衷于推动数字货币经济发展的社区成员。</p>
                    <p>【VIP消费Token】 未来糖果小镇的各项针对C端服务，都将通过Candy Token进行支付消费。</p>
                    <p>【其他平台导流结算】 用于其他平台导流结算，全球ICO、OTC、交易所等平台，通过购买CandyToken享受糖果小镇提供的导流服务。</p>
                    <p>Q3：什么是小镇代理人</p>
                    <p>A:1.可获得糖果小镇分润权益。邀请注册的用户在平台领取糖果，代理人也将获得等值的糖果，最高享受 6 级分润。而且用户领取其他糖果，项目代理人也会奖励（非代理用户只能得到通过二维码或链接领取的直接奖励）；</p>
                    <p>2.定制专属海报，获得邀请码，每次活动所得奖励归代理人所有；表现优异的代理人，将获得固定薪资，获赠CT</p>
                    <p>Q4：如何申请小镇代理人</p>
                    <p>A：申请小镇代理人请联系微信candydior。</p>
                    <p>Q5：糖果小镇APP使用手册</p>
                </div>
                <div className="imgs">
                    <img src={require("../../../../assets/img/imgs_1.png")}/>
                    <img src={require("../../../../assets/img/imgs_2.png")}/>
                    <img src={require("../../../../assets/img/imgs_3.png")}/>
                    <img src={require("../../../../assets/img/imgs_4.png")}/>
                    <img src={require("../../../../assets/img/imgs_5.png")}/>
                    <img src={require("../../../../assets/img/imgs_6.png")}/>
                    <img src={require("../../../../assets/img/imgs_7.png")}/>
                    <img src={require("../../../../assets/img/imgs_8.png")}/>
                </div>
            </div>
        </div>
    )
  }


}
export default HelpCenter