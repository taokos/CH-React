import React, {Component} from 'react';
import LoadGeoJSON from "./GeoJSONLayer";

export default class LayersCheckbox extends Component {

  constructor(props) {
    super(props);
    let added = props.layer;
    if (('apiUrl' in props.layer)) {
      added = false;
    }
    this.state = {
      isToggleOn: false,
      added: added,
      layerData: props.layer
    };

    this.isToggleOn = false;

    // This binding is necessary to make `this` work in the callback
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const newState = e.target.checked;
    this.switchCheckbox(newState);
    this.props.onChange(this, this.props.id, newState);
  }

  switchCheckbox(newState) {
    if (newState && !this.isToggleOn) {
      let layer = this.state.added;
      if (!layer) {
        layer = LoadGeoJSON(this.props.layer.apiUrl, this.props.layer.options);
      }
      const added = layer.addTo(this.props.map);
      this.setState({
        added: added,
        isToggleOn: newState
      });
      this.isToggleOn = true;
    }
    else {
      if (this.state.added) {
        this.state.added.remove();
      }
      this.isToggleOn = false;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== this.isToggleOn) {
      this.switchCheckbox(nextProps.checked);
    }
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
