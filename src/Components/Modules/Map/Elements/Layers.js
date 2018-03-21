import React, { Component } from 'react';
import L from 'leaflet';
import LayersCheckbox from './LayersCheckbox';
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
    {title:"Parcel Lines", urlTemplate:process.env.REACT_APP_TILES_SERVER + '/property_records_parcel_lines/{z}/{x}/{y}.png'},
    {title:"Property Size", urlTemplate:process.env.REACT_APP_TILES_SERVER + '/property_records_property_size/{z}/{x}/{y}.png'},
    {title:"Age of Property by Decade", urlTemplate:process.env.REACT_APP_TILES_SERVER + '/property_records_year_built/{z}/{x}/{y}.png'},
    {title:"Property Type", urlTemplate:process.env.REACT_APP_TILES_SERVER + '/property_records_property_type/{z}/{x}/{y}.png'},
    {title:"Vacant Land", urlTemplate:process.env.REACT_APP_TILES_SERVER + '/property_records_vacant_type/{z}/{x}/{y}.png'},
    {title:"Zoning Code", urlTemplate:process.env.REACT_APP_TILES_SERVER + '/land_use_zoning_code/{z}/{x}/{y}.png'},
    {title:"Zoning Overlays", urlTemplate:process.env.REACT_APP_TILES_SERVER + '/land_use_zoning_overlay/{z}/{x}/{y}.png'},
    {title:"Transit Route", urlTemplate:process.env.REACT_APP_TILES_SERVER + '/transit_route/{z}/{x}/{y}.png'},
    {title:"Transit Stops", urlTemplate:process.env.REACT_APP_TILES_SERVER + '/transportation_stop_types/{z}/{x}/{y}.png'},
    {title:"Streets", urlTemplate:process.env.REACT_APP_TILES_SERVER + '/streets_line/{z}/{x}/{y}.png'},
    {title:"Public Elementary School Boundaries", urlTemplate:process.env.REACT_APP_TILES_SERVER + '/elementary_schools/{z}/{x}/{y}.png'},
    {title:"Public Middle School Boundaries", urlTemplate:process.env.REACT_APP_TILES_SERVER + '/middle_schools/{z}/{x}/{y}.png'},
    {title:"Public High School Boundaries", urlTemplate:process.env.REACT_APP_TILES_SERVER + '/high_schools/{z}/{x}/{y}.png'},
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
    if (typeof this.props.activeLayers !== 'undefined') {
      checkedLayers = checkedLayers !== this.props.activeLayers ? this.props.activeLayers : checkedLayers;
    }
    this.state = {
      ckeckAll: false,
      collapsed: true,
      checkedLayers: checkedLayers
    };

    this.props.sl({group:this.props.name ,layers:checkedLayers});
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
    this.props.sl({group:this.props.name ,layers:checkedLayers});
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
    let {map, layers} = this.props;
    const checkedLayers = this.state.checkedLayers;
    const that = this;
    const checkAllModifier = this.countChecked();
    const DetailsPopupL = this.props.DetailsPopupL;
    if (typeof DetailsPopupL !== 'undefined' && !('Parcel Lines' in layers)) {
      let newLayers = {};
      for (const layer in layers) {
        const args = Object.values(layers[layer]);
        if (DetailsPopupL.indexOf(parseInt(args[2])) !== -1) {
          newLayers[layer] = layers[layer];
        }
      }
      layers = newLayers;
    }
    if (typeof DetailsPopupL === 'undefined' || 'Parcel Lines' in layers || typeof DetailsPopupL !== 'undefined' && Object.keys(layers).length > 0) {
      return (
        <div
          className={"collapsible-group layers-group" + (this.state.collapsed ? ' collapsed' : '')}>
          <div className="group-name">
            <div
              className={"checkbox" + ((checkAllModifier === 2) ? ' not-all' : '')}>
              <label>
                <input type="checkbox"
                   onChange={this.checkUncheckAll.bind(this)}
                   checked={this.state.ckeckAll} className={"check-all"}/>
                <span></span>
              </label>
            </div>
            <span className="name toggler" onClick={this.collapse.bind(this)}>
            {this.props.name}
              {this.state.collapsed &&
              <i className="icon-b icon-b-sortdown"></i>}
          </span>
          </div>
          <div className="checkboxes collapsible">
            {Object.keys(layers).map(function (name, i) {
              return (
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
    else {
      return('');
    }
  }
}

class Layers extends Component {

  constructor(props) {
    super(props);

    this.close = this.close.bind(this);
    if (!_.isEmpty(this.props.activeLayers)) {
      this.state = this.props.activeLayers;
    }
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
      .then(data => saveLayers(data, that))

    function saveLayers(data, that) {
      _.mapObject(data, function(group, id) {
        _.mapObject(group['layers'], function(layer, i) {
          const options = {
            color: colors[i % colors.length],
            weight: 2,
            fillOpacity: 0.15,
            opacity: 0.7
          };

          const apiUrl = process.env.REACT_APP_MAP_SHAPE_URL + group.group_l_type + '=' + layer.layer_id;
          const id = layer.layer_id;

          if (!(group['group'] in groupedOverlays)) {
            groupedOverlays[group['group']] = {};
          }
          groupedOverlays[group['group']][layer.layer_title] = {apiUrl, options, id};
        });
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
    const saveLayersSate = this.props.saveLayersSate;
    const activeLayers=this.props.activeLayers;
    if (this.props.DetailsPopupL) {
      const DetailsPopupL = this.props.DetailsPopupL;
      return (
        <div className={"layers"}>
          <div className="groups-wrapper layers-wrapper">
            <div className="overlays">
              {Object.keys(groupedOverlays).map(function (layer, i) {
                return (
                  <GroupLayers
                    key={'group-layers-' + i}
                    sl={saveLayersSate}
                    map={map}
                    name={layer}
                    activeLayers={activeLayers[layer]}
                    layers={groupedOverlays[layer]}
                    DetailsPopupL={DetailsPopupL}
                    reset={reset} />
                );
              })}
            </div>
          </div>
        </div>
      );
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
                  <GroupLayers
                    key={'group-layers-' + i}
                    sl={saveLayersSate}
                    map={map}
                    name={layer}
                    activeLayers={activeLayers[layer]}
                    layers={groupedOverlays[layer]}
                    reset={reset} />
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
      );
    }
  }
}

export default Layers;
