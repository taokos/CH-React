import React, { Component } from 'react';
import {BrowserRouter, Route} from "react-router-dom"

import '../css/App.css';

import LMap from './Map';
import Doc from './Doc';
import LeftMenu from './LeftMenu';
import SearchResults from './SearchResults';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div  className="ch">
          <LeftMenu />
          <Route path="/map/us/:p1/:p2" component={LMap}/>
          <Route path="/us/:p1/:p2" component={Doc}/>
          <Route path="/us/:p1/:p2/search" component={SearchResults}/>
        </div>
      </BrowserRouter>
    )
  }
}

 export default App;
