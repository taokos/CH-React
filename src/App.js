import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="ch">
        <div className="ch-menu">
          <section className="ch-city-logo">
             <a href="#" className="logo">Logo</a>
          </section>
          <nav className="ch-top-menu">
            <a href="#" className="home">Home</a>
            <a href="#" className="home">Layers</a>
          </nav>
          <nav className="ch-bottom-menu">
            <a href="#" className="home">Help</a>
            <a href="#" className="home">Menu</a>
            <a href="#" className="home">User</a>
          </nav>
        </div>
        <div className="ch-content">
           Some content.
        </div>
      </div>
    );
  }
}

export default App;
