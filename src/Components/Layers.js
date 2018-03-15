import React, { Component } from 'react';
import L from 'leaflet';
import LayersCheckbox from './Elements/LayersCheckbox';
import _ from 'underscore';

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
  );
});

class GroupLayers extends Component {

  constructor(props) {
    super(props);
    var checkedLayers = {};
    Object.keys(props.layers).forEach(function (val) {
      checkedLayers[val] = false;
    });
    this.state = {
      ckeckAll: false,
      collapsed: true,
      checkedLayers: checkedLayers
    };
  }

  countChecked(update = false) {
    const allCount = Object.keys(this.state.checkedLayers).length;
    const values = _.filter(_.values(this.state.checkedLayers), (val) => val).length;
    if (values > 0 && allCount > values) {
      if (!this.state.ckeckAll && update) {
        this.setState({ckeckAll: true});
      }
      return 2;
    }
    else if(values > 0 && allCount === values) {
      if (!this.state.ckeckAll && update) {
        this.setState({ckeckAll: true});
      }
      return 1;
    }
    else {
      if (this.state.ckeckAll && update) {
        this.setState({ckeckAll: false});
      }
      return 0;
    }
  }

  // Control all checkboxes states.
  checkBoxChange(e, name, value) {
    var checkedLayers = this.state.checkedLayers;
    checkedLayers[name] = value;
    this.countChecked(true);
    this.setState({checkedLayers: checkedLayers});
  }

  // Check/uncheck all checkboxes.
  checkUncheckAll(e) {
    this.setState({
      ckeckAll: !this.state.ckeckAll,
      checkedLayers: _.mapObject(this.state.checkedLayers, () => !this.state.ckeckAll)
    });
  }

  // Collapse checkboxes event.
  collapse(e) {
    this.setState({collapsed: !this.state.collapsed });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reset) {
      this.setState({
        ckeckAll: false,
        checkedLayers: _.mapObject(this.state.checkedLayers, () => false)
      });
    }
  }

  render() {
    const {map, layers} = this.props;
    const checkedLayers = this.state.checkedLayers;
    const that = this;
    const checkAllModifier = this.countChecked();
    return (
      <div className={"collapsible-group layers-group" + (this.state.collapsed ? ' collapsed' : '')}>
        <div className="group-name">
          <div className={"checkbox" + ((checkAllModifier === 2) ? ' not-all': '')}>
            <label>
              <input type="checkbox" onChange={this.checkUncheckAll.bind(this)} checked={this.state.ckeckAll} className={"check-all"} />
              <span></span>
            </label>
          </div>
          <span className="name toggler" onClick={this.collapse.bind(this)}>
            {this.props.name}
            {this.state.collapsed && <i className="icon-b icon-b-sortdown"></i>}
          </span>
        </div>
        <div className="checkboxes collapsible">
          {Object.keys(layers).map(function (name, i) {
            return(
              <LayersCheckbox
                checked={checkedLayers[name]}
                onChange={that.checkBoxChange.bind(that)}
                key={'layers-checkbox-' + i}
                map={map}
                id={name}
                layer={layers[name]}>
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

    this.close = this.close.bind(this);

    this.state = {
      reset: false,
    };
  }

  close(e) {
    e.preventDefault()
    this.props.toggleLink(e, 'showLayers');
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
        <div className="groups-wrapper layers-wrapper">
          <div className="title">
            <h3>Layers</h3>
            <a href="/" className="close" onClick={this.close}>
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
