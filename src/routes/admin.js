import React, { Component } from 'react'
import { Route, BrowserRouter } from 'react-router-dom';

import Home from '../containers/admin/home';

class Routes extends Component {

  render() {
    return (
      <BrowserRouter >
        <div>
          <Route exact path="/" component={Home}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default Routes
