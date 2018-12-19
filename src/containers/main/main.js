import React, { PureComponent } from 'react'
import '../../assets/css/App.less'
import { Menu, Icon, Avatar, Dropdown } from 'antd'
import { Link, Route, Switch, Redirect } from 'react-router-dom'
import menuList from '../../config/menu'
import { loginSuccessPage, loginSuccessMenu } from '../../config'
import UserList from './users'
import CandyList from './candys'
import TaskList from './task'
import Agent from './agent'
import CandyType from './candysType'
import TaskType from './taskType'
import CandyDetail from './candysDetail'
import TaskDetail from './taskDetail'
import ProjectType from './projectType'
import PhotoType from './photoType'
import photoList from './photo'
import Exchange from './exchange'
import ExchangeDetail from './exchangeType'
import DrawCandy from './drawCandy'
import ProjectList from './projects'
import Curreny from './curreny'
import Identify from './identify'
import Comment from './comment'
import Setting from './setting'
import AdminList from './adminers'
import CovertManage from './covert/manage'
import CovertReview from './covert/review'
import CovertEdit from './covert/new'
import InviteRecord from './inviteRecord'
import InviteDetail from './inviteRecord/inviteDetail'
import IpManage from './ipManage'
import CandyLogLists from './garnishment'
import GarnishemntOper from './garnishment/operation'
import GarnishemntNewDeduct from './garnishment/newDeduct'
import TransformLists from './transform'
import MessageLists from './message'
import MessageEdit from './message/edit'
import ExclusiveLists from './exclusive'
import GameInformation from './GameInformation/GameInformation'
import AddGame from './GameInformation/gameAdd'
import EditGame from './GameInformation/gameEdit'
import CreteList from './information/creteList'
import CreteNews from './information/creteNews'
import EditNews from './information/editNews'
import BannerList from './banner/bannerList'
import BannerAdd from './banner/bannerAdd'
import BannerEdit from './banner/bannerEdit'

const Item = Menu.Item

const components = [
  [
    UserList
  ],
  [
    Agent
  ],
  [
    CandyList
  ],
  [
    photoList
  ],
  [
    DrawCandy
  ],
  [
    Exchange
  ],
  [
    ProjectList
  ],
  [
    TaskList
  ],
  [ 
    CovertManage
  ],
  [ 
    CovertReview
  ],
  [
    Curreny
  ],
  [
    Identify
  ],
  [
    Comment
  ],
  [
    Setting
  ],
  [
    AdminList
  ],
  [
    InviteRecord
  ],
  [
    IpManage
  ],
  [
    CandyLogLists
  ],
  [
    TransformLists
  ],
  [
    MessageLists
  ],
  [
    ExclusiveLists
  ],
  [
    GameInformation
  ],
  [
    AddGame
  ],
  [
    EditGame
  ],
  [
    CreteList
  ],
  [
    CreteNews
  ],
  [
    EditNews
  ],
  [
    BannerList
  ],
  [
    BannerAdd
  ],
  [
    BannerEdit
  ],
]

class Main extends PureComponent {
  constructor(props){
    super(props)
    this. state = {
      openKeys: [],
      selectedKeys: []
    }
  }
  onOpenChange (openKeys) {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf('' + key) === -1)
    let rootSubmenuKeys = menuList.filter(item => item.children).map(i => i.key)
    if (rootSubmenuKeys.indexOf('' + latestOpenKey) === -1) {
      this.setState({ openKeys })
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : []
      })
    }
  }
  onSelect = ({selectedKeys}) => {
    this.setState({
      selectedKeys
    })
  }
  filter (pathname) {
    let openKey = menuList.filter(item => {
      if (item.children) {
        return !item.children.every(i => {
          if (i.key !== pathname) {
            return true
          }
          return false
        })
      }
      return true
    })
    return openKey
  }
  exit = () => {
    const { history } = this.props
    localStorage.removeItem('admin')
    localStorage.removeItem('adminer')
    history.push('/login')
  }
  componentWillMount () {
    const { history } = this.props
    let openKey = this.filter(history.location.pathname)
    let selectedKeys = []
    selectedKeys = [history.location.pathname]
    if (!openKey.length) {
      let arr = history.location.pathname.split('/')
      if (arr.length > 2) {
        let parentPath = '/' + arr[1] + '/' + arr[2]
        openKey = this.filter(parentPath)
        selectedKeys = [parentPath]
      } else {
        openKey = [{
          key: loginSuccessMenu
        }]
        selectedKeys = [loginSuccessPage]
      }
    }
    this.setState({
      openKeys: [openKey[0].key],
      selectedKeys: selectedKeys
    })
  }
  render () {
    const menu = (
      <Menu>
        <Menu.Item>
          <a><Icon type="user" /> 修改密码</a>
          <a onClick={this.exit}><Icon type="logout" /> 退出</a>
        </Menu.Item>
      </Menu>
    );
    const user = JSON.parse(localStorage.getItem('adminer'))
    if (!localStorage.getItem('adminer')) {
      this.exit()
    }
    return (
      <div className="main-container">
        <div className="header">
          <span className="title">糖果管理后台</span>
          <div className="right-msg-box">
            <Dropdown overlay={menu}>
              <Avatar className="avatar" size="large" icon="user" />
            </Dropdown>
            <span className="username">{user.user_name}</span>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-start'}}>
          <div className="sider">
            <Menu
              openKeys={this.state.openKeys}
              selectedKeys={this.state.selectedKeys}
              onOpenChange={this.onOpenChange}
              onSelect={this.onSelect}
              mode="inline"
              theme="dark"
            >
              {menuList.map((item) => {
                return (
                  <Item key={item.key}>
                    <Link to={item.key}>
                      <Icon type={item.icon} />
                      <span>{item.title}</span>
                    </Link>
                  </Item>
                )
              })}
            </Menu>
          </div>
          <div className="content">
            <Switch>
              <Route exact path="/main" render={() => <Redirect to={loginSuccessPage} />} />
              <Route path="/main/candyList/:type" component={CandyType}/>
              <Route path="/main/taskList/:type" component={TaskType}/>
              <Route path="/main/candy/detail" component={CandyDetail}/>
              <Route path="/main/task/detail" component={TaskDetail}/>
              <Route path="/main/projectList/:type" component={ProjectType}/>
              <Route path="/main/photoList/:type" component={PhotoType}/>
              <Route path="/main/exchange/:type" component={ExchangeDetail}/>
              <Route path="/main/invite/record/:user" component={InviteDetail}/>
              <Route path="/main/garnishemnt/oper" component={GarnishemntOper}/>
              <Route path="/main/garnishemnt/new" component={GarnishemntNewDeduct}/> 
              <Route path="/main/covert/edit" component={CovertEdit}/>
              <Route path="/main/message/edit" component={MessageEdit}/>
              <Route path="/main/GameInformation/GameInformation" component={GameInformation}/>
              <Route path="/main/GameInformation/gameAdd" component={AddGame}/>
              <Route path="/main/GameInformation/gameEdit" component={EditGame}/>
              <Route path="/main/information/creteList" component={CreteList}/>
              <Route path="/main/information/creteNews" component={CreteNews}/>
              <Route path="/main/information/editNews" component={EditNews}/>
              <Route path="/main/banner/bannerList" component={BannerList}/>
              <Route path="/main/banner/bannerAdd" component={BannerAdd}/>
              <Route path="/main/banner/bannerEdit" component={BannerEdit}/>
              
              
              
              
              {menuList.map((item,index) =>
                (<Route exact key={item.key} path={item.key} component={components[index][0]} />)
              )}
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

export default Main

