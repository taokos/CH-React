import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import Layers from './Layers.js';
import MapPopup from "./Elements/MapPopup.js";
import BaseLayer from './Elements/BaseLayer.js';
import MapSearch from './Elements/MapSearch.js';
import _ from 'underscore';

const urlSettings = '?action=_property_record&type=_property_record&geometryFormat=json&rows=10&offset=0&ignoreStatus=&indent=&';

let address = '', googleApiKey = '', checkedLayers={};

const fieldsMapping = {
  'Property Information': {
    'id': '',
    'title': '',
    'folioNumber': 'Folio',
    'address': 'Address',
    'owners': 'Owner(s)',
    'owner_mailing_address': 'Owner Address',
    'legalDesc': 'Property Description',
    'landUseDorCode': 'Detailed Use',
    'yearBuilt': 'Year Built of Property',
    'buildings': 'Number of Buildings',
    'bedrooms': 'Bed Count',
    'baths': 'Bath Count',
    'livingUnits': 'Number of Units',
    'propertySize': 'Property Sq Ft',
    'abuttingProperties': 'Neighboring Properties',
    'streetName': 'Places - Street(s)',
    'building:real': 'Places - Related Building / Condominium Name'
  }
};

class ActiveChecboxes extends React.Component {
  render() {
    return (
      <div>
      {_.values(_.mapObject(checkedLayers, function(grop, title) { let failter = false;
        {_.values(_.mapObject(grop, function(status, filter) {
          if(status) {
            failter = true;
          }
        }))};
        if (failter) {
        return(
          <div key={title}>{title}
            {_.values(_.mapObject(grop, function(status, filter) {
              if(status) return(
                <div>{filter}</div>
              );
              else return('')
            }))}
          </div>
        )} else {return('')}
      }))}
      </div>
    )
  }
}

class DetailsMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeLayers: {},
      settings:{}
    };
    let settings = {};
    settings[this.props.layer._leaflet_id] = this.props;
    if ('layer' in this.props) {
      this.setState({settings:settings});
    }
    this.showPropertyDetails = this.showPropertyDetails.bind(this);
  }

  saveLayersSate(layers) {
    if (typeof layers !== 'undefined' && 'saveState' in this.props) {
      this.props.saveLayersState(layers);
    }
  }

  showPropertyDetails() {
    this.props.renderPopup(this.props.data, this.props.e)
  }

  render() {
    const item = this.props.data.data.items[0],
      map = this.props.map;
    return(
      <div>
        <div className={'head-title'} onClick={this.showPropertyDetails}>{item.title[0]} </div>
        <div className={'list-active-layers'}>
          <span>Activaded Layers</span>
          <ActiveChecboxes />
        </div>
        <div className={'list-layers'}>
          <span>All Applicable Layers</span>
          <Layers
            map={map}
            {...this.props}
            DetailsPopupL={1}
            saveLayersSate={this.saveLayersSate.bind(this)}
            activeLayers={checkedLayers}
            showLayers={this.props.showLayers}
          />
        </div>
      </div>
    )
  }

}

class LMap extends React.Component {

  constructor(props) {
    super(props);
    this.map = this.map.bind(this);
    this.propertyLayer = this.propertyLayer.bind(this);
    this.state = {
      map: '',
      baseLayers: {},
      mapData: {},
      layerExist: true,
      layers: {}
    };
  }

  saveLayersSate(layers) {
    if (typeof layers !== 'undefined') {
      checkedLayers[layers.group] = layers.layers;
      this.setState({layers: checkedLayers})
    }
  }


  prepareFieldsRequest(fieldsKey) {
    return _.values(_.mapObject(fieldsMapping[fieldsKey], (val, key) => 'fields[]=' + key + '&')).join('')
  }

  getPropertyLayer(key) {
    let fieldsRequest = this.prepareFieldsRequest('Property Information');

    fetch(process.env.REACT_APP_API + '/api/ui-api' + urlSettings + fieldsRequest + 'address=' + key + '&publicToken=' + process.env.REACT_APP_API_PUBLIC_TOKEN)
    .then(results => results.json())
    .then(data => this.propertyLayer(this.state.map, {data}))
    .catch(function (e) {
      console.error(e);
    });
  }

  propertyLayer(map, data, e, that) {
    let popupData = {
        fields: {},
        data:{},
        lng: '',
        lat: '',
      },
      layerExist  = false;

    if (data && 'data' in data && 'items' in data.data && data.data.items[0]) {
      const shape = {
        'type': 'Feature',
        'geometry': {
          'type': data.data.items[0].gisData.geom.type ? data.data.items[0].gisData.geom.type : 'Poligon',
          'coordinates': data.data.items[0].gisData.geom.coordinates ? data.data.items[0].gisData.geom.coordinates : ''
        }
      };

      const newLeayer =  L.geoJson(shape, {type:'property-layer', key:'property-layer-' + data.data.items[0].id});

      newLeayer.bindPopup('<div id="l-map-popup"></div>');

      // Remove current property layer if needed.
      map.eachLayer(function (layer) {
        if ('options' in layer && 'options' in newLeayer &&  layer.options.type ===  'property-layer') {
          if (layer.options.key !== newLeayer.options.key) {
            map.removeLayer(layer);
            hide();
            layerExist = false;
          }
          else {
            layerExist = true;
            renderPopup(data);
          }
        }
      });

      // Remove popup.
      function hide() {
        map.eachLayer(function (layer) {
          if ('options' in layer && 'options' in newLeayer &&  layer.options.type ===  'property-layer') {
            map.removeLayer(layer);
          }
        });
        ReactDOM.render('', document.getElementById('popupWrapper'));
      }

      // Render popup.
      function renderPopup(data, e) {
        popupData['data'] = data;
        popupData['fields'] = fieldsMapping;
        popupData['address'] = address;
        popupData['googleApiKey'] = googleApiKey;
        if (e) {
          popupData['lng'] = e.latlng.lng;
          popupData['lat'] = e.latlng.lat;
          map.setView(new L.LatLng(e.latlng.lat, e.latlng.lng), 17);
        }
        else if ('data' in data && 'items' in data.data && data.data.items[0] && 'gisData' in data.data.items[0] && 'geom' in data.data.items[0].gisData) {
          const lngLan = data.data.items[0].gisData.geom.coordinates[0][0];
          map.setView(new L.LatLng(lngLan[1], lngLan[0]), 17);
          popupData['lng'] = lngLan[0];
          popupData['lat'] = lngLan[1];
        }
        ReactDOM.render(<MapPopup
          popupData={popupData}
          onCloseClicked={() => hide()}
        />, document.getElementById('popupWrapper'));
      }

      // If new layer was added update popup.
      if (!layerExist) {
        if (e) {
          popupData['lng'] = e.latlng.lng;
          popupData['lat'] = e.latlng.lat;
        }
        else if ('data' in data && 'items' in data.data && data.data.items[0] && 'gisData' in data.data.items[0] && 'geom' in data.data.items[0].gisData) {
          const lngLan = data.data.items[0].gisData.geom.coordinates[0][0];
          popupData['lng'] = lngLan[0];
          popupData['lat'] = lngLan[1];
        }
        newLeayer.addTo(map);
        map.fitBounds(newLeayer.getBounds());
        map.eachLayer(function (layer) {
          if ('options' in layer && 'options' in newLeayer &&  layer.options.type ===  'property-layer') {
            layer.openPopup();
            if (typeof that !== 'undefined' && layer.isPopupOpen() && 'props' in that && !_.isEmpty(e)) {
              ReactDOM.render(<DetailsMap
                layer={layer}
                data={data}
                e={e}
                map={map}
                renderPopup={renderPopup}
                saveLayersState={that.saveLayersSate}
                {...that.props}/>, document.getElementById('l-map-popup'));
            }
          }
        });
      }
    }
  }

  componentDidMount() {
    const that = this;
    this.map(that);
  }

  map(that) {
    const map = L.map('map');

    this.setState({
      map: map
    });

    // Add property layer and open popup with property info.
    map.on('click', function(e) {
      let fieldsRequest = _.values(_.mapObject(fieldsMapping['Property Information'], (val, key) => 'fields[]=' + key + '&')).join('');

      fetch(process.env.REACT_APP_API + '/api/ui-api' + urlSettings + fieldsRequest + 'point_search={"geometry":"POINT (' + e.latlng.lng + ' ' + e.latlng.lat + ')"}&publicToken=' + process.env.REACT_APP_API_PUBLIC_TOKEN)
        .then(results => results.json())
        .then(data => that.propertyLayer(this, {data}, e, that))
        .catch(function (e) {
          console.error(e);
        });
    });

    const baseUrl = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_LOCAL_SETTINGS_URL : process.env.REACT_APP_SETTINGS_URL;
    const requestUrl = baseUrl + '/api/v1/codehub_react/' + this.props.match.params.p2
      + '?alias=/us/'
      + this.props.match.params.p1
      + '/'
      + this.props.match.params.p2
      + '&_format=json';

    fetch(requestUrl)
      .then(results => results.json())
      .then(data => setMapOptions(data))
      .catch(function (e) {
        console.error(e);
      });

    function setMapOptions(data) {
      if ('bounds' in data) {
        const StateBounds = new L.LatLngBounds(
          new L.LatLng(data['bounds'][0][0], data['bounds'][0][1]),
          new L.LatLng(data['bounds'][1][0], data['bounds'][1][1])
        );
        address = data['address'];
        googleApiKey = data['google_api_key'];
        let zoom = map.getBoundsZoom(StateBounds, false);
        map.options.minZoom = zoom;
        map.setView([data['center'][0], data['center'][1]], zoom);
        map.setMaxBounds(StateBounds);
      }
    }

    this.setState({
      map: map
    });

  }

  render() {
    let baseLayer = '',
        layers = '';
    if (this.state.map) {
      layers = <Layers
          match = {this.props.match}
          toggleLink={this.props.toggleLink}
          map={this.state.map}
          saveLayersSate={this.saveLayersSate.bind(this)}
          activeLayers={checkedLayers}
          showLayers={this.props.showLayers} />;
      baseLayer = <BaseLayer map={this.state.map} />;
    }
    return (
      <div className="map-wrapper">
        <div id="popupWrapper"> </div>
        <MapSearch getPropertyLayer={this.getPropertyLayer.bind(this)}/>
        {layers}
        {baseLayer}
        <div id="map" className="ch-map"> </div>
      </div>
    );
  }
}

export default LMap;
