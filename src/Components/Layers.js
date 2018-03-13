import React, { Component } from 'react';
import L from 'leaflet';
import {GroupedLayers} from 'leaflet-groupedlayercontrol';
import LayersCheckbox from './Elements/LayersCheckbox';

// Temporary solution for the ST1.
import api_layers from '../data.json';
import LoadGeoJSON from "./Elements/geoJSONLayer";

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
        groupedOverlays["Land Use"][layer.layer_title] = LoadGeoJSON(apiUrl, options)
      }
      else {
        groupedOverlays["Place"][layer.layer_title] = LoadGeoJSON(apiUrl, options)
      }
    })
  )
});

class BaseLayers extends Component {
  baseLayers = {
    'streets': {
      'name': 'Street View',
      'url': 'https://{s}.tiles.mapbox.com/v3/inhabitmiami.l269hdof/{z}/{x}/{y}.png',
      'options': {
        'attribution': '©<a href=\'https://www.mapbox.com/about/maps/\'>Mapbox</a> © <a href=\'http://www.openstreetmap.org/copyright\'>OpenStreetMap</a> contributors',
        'zIndex': -99
      }
    },
    'satelite': {
      'name': 'Satelite',
      'url': 'https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaW5oYWJpdG1pYW1pIiwiYSI6IlVqbDFmYW8ifQ._WCxjKTHYFmq6bdIUeLwYA',
      'options': {
        'attribution': '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a> <a class="mapbox-improve-map" href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a> <a href="https://www.digitalglobe.com/" target="_blank">© DigitalGlobe</a>',
        'zIndex': -99
      }
    }
  };

  constructor(props) {
    super(props);
    const defaultLayer = new L.TileLayer(this.baseLayers['streets'].url, this.baseLayers['streets'].options);
    this.state = {
      checked: 'streets',
      baseLayer: defaultLayer.addTo(props.map)
    };

    // This binding is necessary to make `this` work in the callback
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const checked = e.target.value;
    if (checked !== this.state.checked) {
      const defaultLayer = new L.TileLayer(this.baseLayers[checked].url, this.baseLayers[checked].options)
      this.state.baseLayer.remove();
      this.setState({
        checked: checked,
        baseLayer: defaultLayer.addTo(this.props.map)
      });
    }
  }

  render() {
    const _this = this;
    return (
      <div className="radios">
        {Object.keys(this.baseLayers).map(function(layer, index) {
          return (
            <div key={'base-layers-' + index} className={"radio " + layer}>
              <label>
                <input id={"base-layer-" + layer}
                       name="base-layers"
                       type="radio"
                       onChange={_this.handleChange}
                       value={layer}
                       {...(layer === _this.state.checked) && {'checked': 'checked'}}
                />
                <span>{_this.baseLayers[layer].name}</span>
              </label>
            </div>
          );
        })}
      </div>
    );
  }
}

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
      <div className={"controls" + hideClass}>
        <BaseLayers map={map} />
        {Object.keys(groupedOverlays).map(function (layer, i) {
          return (
            <GroupLayers key={'group-layers-' + i} map={map} name={layer} layers={groupedOverlays[layer]} reset={reset} />
          );
        })};
        <button className="reset" onClick={this.clickReset.bind(this)}>Reset</button>
      </div>
    );
  }
}
// export {Layers, groupedOverlays};
export default Layers;
