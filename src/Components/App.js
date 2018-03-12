import React from 'react';
import {BrowserRouter, Route} from "react-router-dom";

import LMap from './Map';
import Doc from './Doc';
import LeftMenu from './LeftMenu';
import SearchResults from './SearchResults';

// For development use only.
if (process.env.NODE_ENV === 'development') {
  require('../gridics-theme-link/css/gridics.css');
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.toggleLayers = this.toggleLayers.bind(this);
    this.state = {
      showLayers: false
    };
  }

  toggleLayers(e) {
    e.preventDefault();
    this.setState(prevState => ({
      showLayers: !prevState.showLayers
    }));
  }

  render() {
    const showLayers = this.state.showLayers;
    return (
      <BrowserRouter>
        <div  className="ch">
          <LeftMenu toggleLayers={this.toggleLayers} />
          <Route path="/map/us/:p1/:p2" render={()=><LMap showLayers={showLayers}/>} />
          <Route path="/us/:p1/:p2" component={Doc}/>
          <Route path="/us/:p1/:p2/search" component={SearchResults}/>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
