import React, { PureComponent } from 'react'
import AsyncBundle from '@/components/AsyncBundle'
import { Route, Switch, Redirect } from 'react-router-dom'
import { loginSuccessPage } from '@/config'
import { BackTop } from 'antd'
import Main from './containers/admin/home'
import ErrorBoundary from './components/ErrorBoundary'
import Login from './containers/admin/login'

class AdminApp extends PureComponent {
  render () {
    const { history } = this.props
    window.reactHistory = history
    return (
      <ErrorBoundary>
        <Switch>
          <Route exact path="/" render={(props) => {
            return localStorage.getItem('admin') ? <Redirect to={loginSuccessPage}/> : <Redirect to='/login'/>
          }}/>
          <Route path="/login" render={(props) => <AsyncBundle {...props} load={Login}/>}/>
          <Route path="/main" component={Main}/>
          <Redirect to="/404" />
          <div>
            <BackTop />
          </div>
        </Switch>
      </ErrorBoundary>
    )
  }
}

export default AdminApp
