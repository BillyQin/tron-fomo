import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom';

export default class AuthorizedRoute extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { component: Component, ...rest } = this.props
    const token = localStorage.getItem('userToken') || ''
    return (
      <Route {...rest} render={props => {
        return token
          ? <Component {...props} />
          : <Redirect to={{pathname:"/login", state: { from: props.location }}} />
      }} />
    )
  }
}
