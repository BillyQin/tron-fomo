import React, { PureComponent } from 'react'
import AsyncBundle from '../components/AsyncBundle'
import { Route, Switch, Redirect } from 'react-router-dom'
import { loginSuccessPage } from '../config'
import Main from './main/main'
import ErrorBoundary from '../components/ErrorBoundary'
import Login from './login/Login'

class App extends PureComponent {

  render () {
    const { history } = this.props
    window.reactHistory = history
    return (
      <ErrorBoundary>
        <Switch>
        {/* <Route exact path="/" render={(props) => {
          const user = JSON.parse(localStorage.getItem('admin'))
          return user ? <Redirect to={loginSuccessPage}/> : <Redirect load={Login}/>
        }}/> */}
          <Route exact path="/" render={(props) => {
            return localStorage.getItem('admin') ? <Redirect to={loginSuccessPage}/> : <Redirect to='/login'/>
          }}/>
          <Route path="/login" component={Login}/>
          <Route path="/main" component={Main}/>
          <Redirect to="/404" />
        </Switch>
      </ErrorBoundary>
    )
  }
}

export default App
