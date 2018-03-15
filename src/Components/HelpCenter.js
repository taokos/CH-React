import React, { Component } from 'react';
import CollapsibleGroup from './Elements/CollapsibleGroup';


const siteUrl = process.env.REACT_APP_SETTINGS_URL;

class HelpCenter extends Component {

  constructor(props) {
    super(props);

    this.close = this.close.bind(this);

    this.state = {
      helpData: '',
      collapsed: true
    };
  }

  componentWillMount() {
    const dataUrl = siteUrl + '/help-center/api?_format=json';
    const that = this;
    fetch(dataUrl)
      .then(results => results.json())
      .then(function (data) {
        if (data) {
          that.setState({helpData: data});
        }
      });
  }

  close(e) {
    e.preventDefault()
    this.props.toggleLink(e, 'showHelp');
  }

  // Collapse group.
  collapse(e) {
    this.setState({collapsed: !this.state.collapsed });
  }

  render() {
    const hideClass = this.props.showHelp ? '' : ' hide';
    const helpData = this.state.helpData;
    return (
      <div className={"left-overlay help" + hideClass}>
        <div className="head-title">
          <h3>Help</h3>
          <a href="/" className="close" onClick={this.close}>
            <i className="icon-b icon-b-close"></i>
          </a>
        </div>
        {helpData && (
          <div className="groups-wrapper">
            {Object.keys(helpData).map(function (group, i) {
              return (
                <CollapsibleGroup key={i} dangerouslySetInnerHTML={{__html: helpData[group]['body']}} name={helpData[group]['title']}>
                </CollapsibleGroup>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default HelpCenter;
