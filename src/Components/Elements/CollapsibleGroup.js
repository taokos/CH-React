import React, { Component } from 'react';

class CollapsibleGroup extends Component {

  constructor(props) {
    super(props);

    this.state = {
      collapsed: true
    };
  }

  // Collapse group.
  collapse(e) {
    this.setState({collapsed: !this.state.collapsed });
  }

  render() {
    const dangerHtml = (this.props.dangerouslySetInnerHTML) ? this.props.dangerouslySetInnerHTML : '';
    return (
      <div className={"collapsible-group" + (this.state.collapsed ? ' collapsed' : '')}>
        <div className="group-name">
          <span className="name toggler" onClick={this.collapse.bind(this)}>
            {this.props.name}
            {this.state.collapsed ? <i className="icon-b icon-b-sortdown"></i> : <i className="icon-b icon-b-sortup"></i>}
          </span>
        </div>
        <div className="collapsible" dangerouslySetInnerHTML={dangerHtml}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default CollapsibleGroup;
