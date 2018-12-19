import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import { BrowserRouter, Route } from 'react-router-dom'
import App from './containers/App'
import './assets/css/index.less'
import 'antd/lib/date-picker/style/css'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { message, LocaleProvider } from 'antd'
import Config from '../config/config'
import Candy from './containers/candypc/candy'


window.projectEnv = 'candypc'

moment.locale('zh-cn')

message.config({
  duration: 3
})

let Router = BrowserRouter
ReactDOM.render(
  <LocaleProvider locale={zhCN}>
    <Router>
      <Route path="/" component={Candy}/>
    </Router>
  </LocaleProvider>
  , document.getElementById('root')
)
