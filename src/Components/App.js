import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";

import LMap from './Map';
import Doc from './Doc';
import LeftMenu from './LeftMenu';

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
          <LeftMenu toggleLayers={this.toggleLayers} showLayers={this.state.showLayers} />
          <Switch>
            <Route path="/map/us/:p1/:p2" exact render={props=><LMap toggleLayers={this.toggleLayers} showLayers={showLayers} {...props}/>} />
            <Route path="/us/:p1/:p2" component={Doc}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
