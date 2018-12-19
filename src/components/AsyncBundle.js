import React, { Component  } from 'react'

class AsyncBundle extends Component  { // PureComponent
  constructor() {
    super();
    this.state = {
      mod: null
    }
  }
  load = (props) => {
    this.setState({
      mod: this.props.load
    })
  }
  componentWillMount () {
    this.load(this.props) // return ?
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.load !== this.props.load) { // this.props.load
      this.load(nextProps)
    }
  }
  load (props) {
    this.setState({
      mod: this.props.load
    })
    // console.log(new Date().getSeconds())
    props.load(mode => {
      console.log(new Date().getSeconds())
      this.setState({
        mod: mod.default ? mod.default : mod
      })
    })
  }

  // render () {
  //   const Bundle = this.state.mod
  //   return this.state.mod ? <Bundle {...this.props}></Bundle> : null
  // }
  render() {
    if (!this.state.mod)
      return false
    return this.props.children(this.state.mod)
  }
}

export default AsyncBundle
