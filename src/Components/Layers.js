import React, { Component } from 'react';
import L from 'leaflet';
import LayersCheckbox from './Elements/LayersCheckbox';
import _ from 'underscore';


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
};

tailLaers.map((layer) => {
  groupedOverlays["Layers"][layer.title] = L.tileLayer(layer.urlTemplate, {attribution: ''});
  return (groupedOverlays);
});

class GroupLayers extends Component {

  constructor(props) {
    super(props);
    let checkedLayers = {};
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
    else if (values > 0 && allCount === values) {
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
    let checkedLayers = this.state.checkedLayers;
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
      layers: false
    };
  }

  componentDidMount() {
    const baseUrl = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_LOCAL_SETTINGS_URL : process.env.REACT_APP_SETTINGS_URL,
    requestUrl = baseUrl + '/api/v1/codehub_layers/' + this.props.match.params.p2
      + '?alias=/us/'
      + this.props.match.params.p1
      + '/'
      + this.props.match.params.p2
      + '&_format=json',
    that = this;

    fetch(requestUrl)
    .then(results => results.json())
    .then(data => saveLayers(data, that));

    function saveLayers(data, that) {
      _.mapObject(data, function(group, id) {
        _.mapObject(group['layers'], function(layer, i) {
          const options = {
            color: colors[i % colors.length],
            weight: 2,
            fillOpacity: 0.15,
            opacity: 0.7
          };

          const apiUrl = process.env.REACT_APP_MAP_SHAPE_URL + layer.layer_type + '=' + layer.layer_id;

          if (!(group['group'] in groupedOverlays)) {
            groupedOverlays[group['group']] = {};
          }
          groupedOverlays[group['group']][layer.layer_title] = {apiUrl, options};
        })
      });
      that.setState({layers: true});
    }
  }

  close(e) {
    e.preventDefault();
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

    if ('detailsPopup' in this.props) {
      return (
        <div className="overlay-layers">
          <GroupLayers map={map} name={'Layers'} layers={groupedOverlays['Layers']}/>
        </div>
      )
    }

    if (this.state.layers) {
      return (
        <div className={"layers" + hideClass}>
          <div className="groups-wrapper layers-wrapper">
            <div className="head-title">
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
              <button className="reset form-submit"
                onClick={this.clickReset.bind(this)}>Reset
              </button>
            </div>
          </div>
        </div>
      );
    }
    else {
      return(
        <div className={"layers" + hideClass}>
          Loading ...
        </div>
      )
    }
  }
}

export default Layers;
