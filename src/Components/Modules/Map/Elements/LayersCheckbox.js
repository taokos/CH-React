import React, {Component} from 'react';
import LoadGeoJSON from "../Plugins/GeoJSONLayer";
import _ from 'underscore';

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

  findLayerOnMap() {
    const that = this;
    this.props.map.eachLayer(function (layer) {
      if ('options' in layer && layer.options['layerId'] ===  that.props.id) {
        return layer;
      }
    });
  };


  switchCheckbox(newState) {
    if (newState && !this.isToggleOn) {
      let layer = this.state.added, i = 0, layerExist = false;
      const map = this.props.map, that = this, countLayers = Object.keys(map._layers).length;
      _.mapObject(map._layers, (mapLayer) => {
        i++;
        if ('options' in mapLayer && mapLayer.options['layerId'] ===  that.props.id) {
          layerExist = mapLayer;
        }
        if (countLayers === i) {
          if (!layerExist) {
            let option = that.props.layer.options;
            option['layerId'] = that.props.id;
            layer = LoadGeoJSON(this.props.layer.apiUrl, option);
            const added = layer.addTo(this.props.map);
            this.setState({
              added: added,
              isToggleOn: newState
            });
            this.isToggleOn = true;
          }
          else {
            this.setState({
              added: layerExist,
              isToggleOn: newState
            });
          }
        }
      });
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
