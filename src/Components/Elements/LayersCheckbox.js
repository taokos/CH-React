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
    this.switchCheckbox(newState);
    this.props.onChange(this, this.props.id, newState);
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
    this.switchCheckbox(nextProps.checked);
  }

  render() {
    return (
      <div className="checkbox">
        <label>
          <input id={this.props.id} type="checkbox" onChange={this.handleChange} checked={this.props.checked} className={"layers-group"} />
          <span>{this.props.children}</span>
        </label>
      </div>
    );
  }
}
