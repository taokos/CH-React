import React, { Component, PropTypes } from 'react';

export default class LayersCheckbox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isToggleOn: false,
      added: props.layer
    };

    // This binding is necessary to make `this` work in the callback
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const newState = e.target.checked;
    this.setState({isToggleOn: newState});
    this.switchCheckbox(newState);
  }

  switchCheckbox(newState) {
    if (newState) {
      const added = this.state.added.addTo(this.props.map);
      this.setState({
        added: added
      });
    }
    else {
      this.state.added.remove();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reset) {
      this.setState({isToggleOn: false});
      this.switchCheckbox(false);
    }
  }

  render() {
    return (
      <div className="checkbox">
        <label>
          <input id={this.props.layer} type="checkbox" onChange={this.handleChange} checked={this.state.isToggleOn} className={"layers-group"} />
          <span>{this.props.children}</span>
        </label>
      </div>
    )
  }
}
