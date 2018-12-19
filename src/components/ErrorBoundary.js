import React, { Component } from 'react'

class ErrorBoundary extends Component {
  constructor() {
    super();
    this.state = {
      hasError: false
    }
  }
  componentDidCatch (error, info) {
    this.setState({ hasError: true })
    console.log(error, info)
  }
  render () {
    if (this.state.hasError) {
      return <div style={{'fontSize': 30, 'textAlign': 'center', 'color': '#c50b0b', 'marginTop': 60}}>发生错误,请尝试刷新页面或联系管理员</div>
    }
    return this.props.children
  }
}

export default ErrorBoundary
