import React, { Component } from 'react';
import createBrowserHistory from 'history/createBrowserHistory'
const history = createBrowserHistory();

class LeftMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {isOn: false};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.setState(prevState => ({
      isOn: !prevState.isOn
    }));
    this.props.toggleLayers(e);

  }

  render() {
      const pathname = history.location.pathname.split('/');
      if (pathname[1] === 'map') {
        pathname.splice(1, 1);
      }
      if (pathname[4] === 'search') {
        pathname.splice(4, 1);
      }
      const doc = pathname.join('/');
      const map = '/map' + doc;
      return (
        <div className="ch-menu">
          <section className="ch-city-logo">
            <a href="/" className="logo">Logo</a>
          </section>
          <nav className="ch-top-menu">
            <a href={map} className="home">Home</a>
            <a onClick={this.handleClick} href="/" className={"layers" + (this.state.isOn ? ' active' : '')}>Layers</a>
          </nav>
          <nav className="ch-bottom-menu">
            <a href="/" className="help">Help</a>
            <ul className="toggle-menu">
              <li>
                <a href="/" className="menu"></a>
                <ul className="submenu">
                  <li>
                    <a href={doc} className="codehub">CH</a>
                  </li>
                </ul>
              </li>
            </ul>
            <a href="/" className="user">User</a>
            <div className="menu">
            </div>
          </nav>
        </div>
      );
    
  }
}

export default LeftMenu;
