import React, { Component } from 'react';
import createBrowserHistory from 'history/createBrowserHistory'
const history = createBrowserHistory();

class LeftMenu extends Component {
  render() {
      const pathname = history.location.pathname.split('/');
      if (pathname[1] == 'map') {
        pathname.splice(1, 1);
      }
      const doc = pathname.join('/');
      const map = '/map' + doc;
      return (
        <div className="ch-menu">
          <section className="ch-city-logo">
            <a href="#" className="logo">Logo</a>
          </section>
          <nav className="ch-top-menu">
            <a href={map} className="home">Home</a>
            <a href={doc} className="home">CH</a>
            <a href="#" className="home">Layers</a>
          </nav>
          <nav className="ch-bottom-menu">
            <a href="#" className="home">Help</a>
            <a href="#" className="home">Menu</a>
            <a href="#" className="home">User</a>
          </nav>
        </div>
      );
    
  }
}

export default LeftMenu;
