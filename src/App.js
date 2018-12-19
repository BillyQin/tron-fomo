import React, { Component } from 'react';
import Routes from './routes';

class App extends Component {

  componentWillMount() {
    // 字体使用 rem, 1rem = 100px;
    const devWidth = document.documentElement.clientWidth
    const size = ((devWidth > 640 ? 640 : devWidth) / 3.75) + 'px'
    document.documentElement.style.fontSize = size
    window.addEventListener('orientationchange', function () {
      document.documentElement.style.fontSize = size
    })
    window.addEventListener('resize', function () {
      document.documentElement.style.fontSize = size
    })
    document.getElementById("root").style.height = '100vh'
  }

  render() {
    return (
      <Routes/>
    );
  }
}

export default App;
