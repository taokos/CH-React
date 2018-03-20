import React, { Component } from 'react';
import createBrowserHistory from 'history/createBrowserHistory';

const history = createBrowserHistory();
const siteUrl = process.env.REACT_APP_SETTINGS_URL;
const accountUrl = process.env.REACT_APP_ACCOUNTS_SITE;
const userAPI = siteUrl + '/api/v1/sso-user?_format=json';

class UserBlock extends Component {

  constructor(props) {
    super(props);
    this.state = {userData: ''};
  }

  componentWillMount() {
    fetch(userAPI, {
      credentials: 'include'
    })
      .then(results => results.json())
      .then(data => this.setState({userData: data}))
      .catch(function (e) {
        console.error(e);
      });
  }

  render() {
    return (
      <div className="user-block">
        {this.state.userData ? (
          <a href={accountUrl + '/user'} className="user">
            <span className="image"><img alt="Avatar" src={this.state.userData.picture} /></span>
            <span className="name">{this.state.userData.field_user_first_name + ' ' + this.state.userData.field_user_last_name}</span>
          </a>
        ) : (
          <a href={accountUrl + '/user/login?destination-url=' + window.location} className="user">
            <span className="image default"></span>
            <span className="name">Login</span>
          </a>
        )}
      </div>
    );
  }

}

class LeftMenu extends Component {
  componentWillMount() {
    const dataUrl = siteUrl + this.doc + '?_format=json';
    const that = this;
    fetch(dataUrl)
      .then(results => results.json())
      .then(function (data) {
        if (data && !data.message) {
          that.setState({pageData: data});
        }
      }
    );
  }

  constructor(props) {
    super(props);
    const pathname = history.location.pathname.split('/');
    if (pathname[1] === 'map') {
      pathname.splice(1, 1);
    }
    if (pathname[4] === 'search') {
      pathname.splice(4, 1);
    }
    this.doc = pathname.join('/');
    this.map = '/map' + this.doc;
    this.state = {
      pageData: '',
      expanded: false
    };
    document.body.classList.add('app-nav');
  }

  toggleMenu(e) {
    e.preventDefault();
    this.setState(prevState => ({
      expanded: !prevState.expanded
    }));
    document.body.classList.toggle('expanded-menu', !this.state.expanded);
  }

  isActive(url) {
    if (history.location.pathname === url) {
      return ' active';
    }
    return '';
  }

  render() {
    return (
      <div className={"ch-menu" + (this.state.expanded ? ' expanded' : '')}>
        <button onClick={this.toggleMenu.bind(this)} className="toggle button-link"></button>
        {this.state.pageData && this.state.pageData.field_logo[0] ? (
          <section className="ch-city-logo">
            <img alt="City Logo" src={this.state.pageData.field_logo[0].url} className="logo" />
            <span className="title">{this.state.pageData.name[0].value}</span>
          </section>
        ) : ''}
        <nav className="ch-top-menu">
          <a href={this.map} className={"map" + this.isActive(this.map)}>
            <i className="icon-b icon-b-ic-properties"></i>
            <span className="title">Properties</span>
          </a>
          {history.location.pathname.indexOf(this.map) > -1 && (
            <a onClick={(e) => this.props.toggleLink(e, 'showLayers')} href="/" className={"layers" + (this.props.showLayers ? ' active' : '')}>
              <i className="icon-b icon-b-ic-layers"></i>
              <span className="title">Layers</span>
            </a>
          )}
        </nav>
        <nav className="menu ch-bottom-menu">
          <a onClick={(e) => this.props.toggleLink(e, 'showHelp')} href="/" className={"help" + (this.props.showHelp ? ' active' : '')}>
            <i className="icon-b icon-b-ic-help"></i>
            <span className="title">Help</span>
          </a>
          <ul className="toggle-menu">
            <li>
              <a href="#sub-menu" className="sub-menu">
                <i className="icon-b icon-b-ic-lines"></i>
                <span className="title">Switch Products</span>
              </a>
              <ul className="submenu">
                <li>
                  <a href="https://zonar.gridics.com/" className="zonar">
                    <i className="icon-b icon-b-ic-zonar-logo-white"></i>
                    <span className="title">Zonar</span>
                  </a>
                </li>
                <li>
                  <a href={siteUrl + this.map} className={"map" + this.isActive(this.map)}>
                    <i className="icon-b icon-b-ic-3-d-map-logo">
                    </i>
                    <span className="title">Map</span>
                  </a>
                </li>
                <li>
                  <a href={siteUrl + this.doc} className={"codehub" + this.isActive(this.doc)}>
                    <i className="icon-b icon-b-ic-codehub"></i>
                    <span className="title">CodeHub</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
          <UserBlock />
        </nav>
      </div>
    );
  }
}

export default LeftMenu;
