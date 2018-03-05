import React, { Component } from 'react';
import '../css/App.css';

import LMap from './Map';
import LeftMenu from './LeftMenu';

class App extends Component {
  render() {
    return (
      <div className="ch">
        <LeftMenu />
        <div className="ch-map">
           <LMap />
        </div>
      </div>
    );
  }
}

export default App;
