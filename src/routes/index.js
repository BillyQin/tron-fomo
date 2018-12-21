import React, { Component } from 'react'
import { Route, BrowserRouter, Redirect } from 'react-router-dom';
import AuthorizedRoute from './authorizedRoute';
import ScrollTop from '../components/scrollTop';
import Loadable from 'react-loadable';
import { Spin } from 'antd';
const Loading = () => <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}><Spin tip="Loading..."></Spin></div>;

const Home = Loadable({
  loader:() => import('@/containers/mobile/home'),
  loading:Loading
})

const Guide = Loadable({
  loader:() => import('@/containers/mobile/guide'),
  loading:Loading
})

class Routes extends Component {
  render() {
    return (
      <BrowserRouter>
        <ScrollTop>
          <div>
            <Route exact path="/" component={Home}/>
            <Route exact path="/guide" component={Guide}/>
            
          </div>
        </ScrollTop>
      </BrowserRouter>
    );
  }
}

export default Routes
