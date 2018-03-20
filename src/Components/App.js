import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import HelpCenter from './HelpCenter/HelpCenter';
import Utilities from '../Utilities/Utilities.js';
import _ from 'underscore';
import LMap from './Map/Map';
import Doc from './Doc/Doc';
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
      document.body.classList.remove('left-overlay-enabled');
      document.body.classList.toggle(Utilities.cleanCssIdentifier(varName + '-enabled'), prevState[varName]);
      document.body.classList.toggle('left-overlay-enabled', _.filter(prevState).length);
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
          <Switch>
            <Route path="/map/us/:p1/:p2" exact render={props=><LMap toggleLink={this.toggleLink} showLayers={showLayers} {...props}/>} />
            <Route path="/us/:p1/:p2" component={Doc}/>
          </Switch>
          <div id="popup-container" />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
