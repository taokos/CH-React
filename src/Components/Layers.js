import React, { Component } from 'react';
import L from 'leaflet';
import {GroupedLayers} from 'leaflet-groupedlayercontrol';
import LayersCheckbox from './Elements/LayersCheckbox';

// Temporary solution for the ST1.
import api_layers from '../data.json';
import LoadGeoJSON from "./Elements/GeoJSONLayer";

const colors = [
  "#db4c4c",
  "#93db4c",
  "#4c70db",
  "#00bf70",
  "#ff1f62",
  "#4caaff",
  "#934cdb",
  "#dbb74c",
  "#db4cb7"
],
  tailLaers = [
  {title:"Parcel Lines", urlTemplate:'//st1-tiles.gridics.com/property_records_parcel_lines/{z}/{x}/{y}.png'},
  {title:"Future Land Use", urlTemplate:'//st1-tiles.gridics.com/land_use_future_land_use/{z}/{x}/{y}.png'},
  {title:"Zoning Code", urlTemplate:'//st1-tiles.gridics.com/land_use_zoning_code/{z}/{x}/{y}.png'},
  {title:"Zoning Overlay", urlTemplate:'//st1-tiles.gridics.com/land_use_zoning_overlay/{z}/{x}/{y}.png'},
];


let groupedOverlays = {
  "Layers": {},
  "Land Use": {},
  "Place": {}
};

tailLaers.map((layer) => {
  groupedOverlays["Layers"][layer.title] = L.tileLayer(layer.urlTemplate, {attribution: ''});
  return (groupedOverlays);
});

// fetch(LAPI)
//   .then(lresults => lresults.json())
//   .then(ldata => layers[ldata]);


Object.keys(api_layers).map(group => {
  return (
    api_layers[group].layers.map((layer, i) => {
      const options = {color: colors[i % colors.length], weight: 2, fillOpacity: 0.15, opacity: 0.7};
      const apiUrl = process.env.REACT_APP_MAP_SHAPE_URL + api_layers[group].layer_type + '=' + layer.layer_id;
      if (api_layers[group].layer_type === 'land_use') {
        groupedOverlays["Land Use"][layer.layer_title] = LoadGeoJSON(apiUrl, options);
      }
      else {
        groupedOverlays["Place"][layer.layer_title] = LoadGeoJSON(apiUrl, options);
      }
      return (groupedOverlays);
    })
  )
});

class GroupLayers extends Component {
  render() {
    const layers = this.props.layers;
    const reset = this.props.reset;
    const map = this.props.map;
    return (
      <div className="layers-group">
        <div className="group-name">
          {this.props.name}
        </div>
        <div className="checkboxes">
          {Object.keys(layers).map(function (name, i) {
            return(
              <LayersCheckbox  key={'layers-checkbox-' + i} map={map} id={name} layer={layers[name]} reset={reset}>
                {name}
              </LayersCheckbox>
            );
          })}
        </div>
      </div>
    );
  }
}

class Layers extends Component {

  constructor(props) {
    super(props);

    this.state = {
      reset: false,
    };

  }
  clickReset(e) {
    e.preventDefault();
    this.setState({reset: true});
  }

  componentWillReceiveProps() {
    this.setState({reset: false});
  }

  render() {
    const {reset} = this.state;
    const map = this.props.map;
    const hideClass = this.props.showLayers ? '' : ' hide';
    return (
      <div className={"layers" + hideClass}>
        <div className="layers-wrapper">
          <div className="title">
            <h3>Layers</h3>
            <a href="/" className="close" onClick={this.props.toggleLayers}>
              <i className="icon-b icon-b-close"></i>
            </a>
          </div>
          <div className="overlays">
            {/*<BaseLayers map={map} />*/}
            {Object.keys(groupedOverlays).map(function (layer, i) {
              return (
                <GroupLayers key={'group-layers-' + i} map={map} name={layer} layers={groupedOverlays[layer]} reset={reset} />
              );
            })}
          </div>
        <div className="form-actions">
          <button className="reset form-submit" onClick={this.clickReset.bind(this)}>Reset</button>
        </div>
        </div>
      </div>
    );
  }
}

export default Layers;
