import React from 'react';
import {BrowserRouter, Route} from "react-router-dom"

import '../css/App.css';

import LMap from './Map';
import Doc from './Doc';
import LeftMenu from './LeftMenu';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div  className="ch">
          <LeftMenu />
          <Route path="/map" component={LMap}/>
          <Route path="/us" component={Doc}/>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
