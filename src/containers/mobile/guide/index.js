import React, { Component } from 'react';
import Footer from '@/components/footer';
import Header from '@/components/header';
import './index.less';

function Guide(props) {
  return (
    <div className='guide'>
      <Header title='游戏指南'/>
      <div className="image">
        <img src='http://ofostatic.openfomo.com/20181108150937_68643.jpg' />
      </div>
      <main>
        <p>
          SuperWin是公平、超高频的轻博彩区块链游戏，挑个1000以内的号码，大于随机开奖号即可获胜！选定数字越大胜率越高，选定数字越小赔率越高！
        </p>
        
        <p>1、玩家可拉动滑竿调整中奖概率与赔率，点击下注后立即开奖！</p>
        <p>2、游戏支持Tron和won投注，使用tron投注以投注额1：100赠送won。</p>
        <p>3、won是本平台的Token，目前可玩1000WIN游戏，也可使用190won创建FOMO游戏获得更高收益，won近期将登陆交易所。</p>
        平台支持tron、won投注，以tron为统一结算单位，其他币种充币收取2%的充币转换服务费，建议新手先以tron参与游玩。
        
        <p>适度游戏，惊喜人生，愿您好运常伴。</p>
      </main>
    <Footer history={props.history} />
    </div >
  );
}

export default Guide

