import React from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import HelpCenter from './HelpCenter';

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
    this.state = {
      showLayers: false,
      showHelp: false
    };
    this.toggleLink = this.toggleLink.bind(this);
  }

  toggleLink(e, varName) {
    e.preventDefault();
    this.setState(function (prevState) {
      prevState[varName] = !prevState[varName];
      return prevState;
    });
  }

  render() {
    const showLayers = this.state.showLayers;
    return (
      <BrowserRouter>
        <div  className="ch">
          <LeftMenu
            toggleLink={this.toggleLink}
            showLayers={this.state.showLayers}
            showHelp={this.state.showHelp}
          />
          <HelpCenter toggleLink={this.toggleLink} showHelp={this.state.showHelp} />
          <Route path="/map/us/:p1/:p2" render={()=><LMap toggleLink={this.toggleLink} showLayers={showLayers}/>} />
          <Route path="/us/:p1/:p2" component={Doc}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
