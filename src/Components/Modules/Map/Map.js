import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import Layers from './Elements/Layers.js';
import MapPopup from "./Elements/MapPopup.js";
import BaseLayer from './Elements/BaseLayer.js';
import MapSearch from './Elements/MapSearch.js';
import _ from 'underscore';

const urlSettings = '?action=_property_record&type=_property_record&geometryFormat=json&rows=1&offset=0&ignoreStatus=&indent=&publicToken=' + process.env.REACT_APP_API_PUBLIC_TOKEN + '&';
const requestSettings = {
  'Property Information': '?action=_property_record&type=_property_record&geometryFormat=json&rows=1&offset=0&ignoreStatus=&indent=&publicToken=' + process.env.REACT_APP_API_PUBLIC_TOKEN + '&',
  'Transit': '?action=_transit_stop&type=_transit_stop&geometryFormat=json&rows=1&offset=0&ignoreStatus=&indent=&publicToken=' + process.env.REACT_APP_API_PUBLIC_TOKEN + '&',
  'Planning & Community Development': '?action=_property_record&type=_property_record&geometryFormat=json&rows=1&offset=0&ignoreStatus=&indent=&publicToken=' + process.env.REACT_APP_API_PUBLIC_TOKEN + '&',
  'Administrative / Regulatory': '?action=_school&type=_school&geometryFormat=json&rows=1&offset=0&ignoreStatus=&indent=&publicToken=' + process.env.REACT_APP_API_PUBLIC_TOKEN + '&',
  'Assessments': '?action=_tax&type=_tax&geometryFormat=none&order_by=taxYear&sort_order=desc&rows=1&offset=0&ignoreStatus=&indent=&publicToken=' + process.env.REACT_APP_API_PUBLIC_TOKEN + '&',
  'Sales History': '?action=_recorded_sale&type=_recorded_sale&order_by=saleDate&sort_order=desc&geometryFormat=json&rows=1&offset=0&ignoreStatus=&indent=&publicToken=' + process.env.REACT_APP_API_PUBLIC_TOKEN + '&'
};

const propertySectionName = 'Property Information';

let address = '', googleApiKey = '', checkedLayers={}, popupResults = {}, allResults = {};

const fieldsMapping = {
  'Property Information': [
    {title: '', fields: ['address'], prefix: '', suffix: ''},
    {title: '', fields: ['place'], prefix: '', suffix: ''},
    {title: '', fields: ['landUse'], prefix: '', suffix: ''},
    {title: '', fields: ['id'], prefix: '', suffix: ''},
    {title: '', fields: ['title'], prefix: '', suffix: ''},
    {title: '', fields: ['floodZone'], prefix: '', suffix: ''},
    {title: 'Folio', fields: ['folioNumber'], prefix: '', suffix: ''},
    {title: 'Address', fields: ['title','city','state', 'postalCode'], prefix: '', suffix: ''},
    {title: 'Owner(s)', fields: ['primary_owners'], prefix: '', suffix: ''},
    {title: 'Owner Address', fields: ['owner_mailing_address', 'ownerAddressCity', 'OwnerAddressCountry'], prefix: '', suffix: ''},
    {title: 'Property Description', fields: ['legalDesc'], prefix: '', suffix: ''},
    {title: 'Millage Code', fields: ['millageCode'], prefix: '', suffix: ''},
    {title: 'Detailed Use', fields: ['landUseDorCode'], prefix: '', suffix: ''},
    {title: 'Year Built of Property', fields: ['yearBuilt'], prefix: '', suffix: ''},
    {title: 'Number of Buildings', fields: ['buildings'], prefix: '', suffix: ''},
    {title: 'Bed Count', fields: ['bedrooms'], prefix: '', suffix: ''},
    {title: 'Bath Count', fields: ['baths'], prefix: '', suffix: ''},
    {title: 'Number of Units', fields: ['livingUnits'], prefix: '', suffix: ''},
    {title: 'Property Sq Ft', fields: ['propertySize'], prefix: '', suffix: ' ft²'},
    {title: 'Neighboring Properties', fields: ['abuttingProperties'], prefix: '', suffix: ''},
    {title: 'Places - Related Building / Condominium Name', fields: ['building:real'], prefix: '', suffix: ''},
    {title: 'Places - Street(s)', fields: ['streetName'], prefix: '', suffix: ''},
    {title: 'Places - Neighborhood', fields: ['neighborhood:real'], prefix: '', suffix: ''},
    {title: 'Places - Zip Code', fields: ['postalCode'], prefix: '', suffix: ''},
    {title: 'Places - City', fields: ['city'], prefix: '', suffix: ''},
    {title: 'Places - County', fields: ['county'], prefix: '', suffix: ''},
  ],
  // @todo needs to implement subcategories.
  // 'Transit': [
  //   {title: 'Buses', fields: ['county1'], prefix: '', suffix: ''},
  //   {title: 'Trains', fields: ['county2'], prefix: '', suffix: ''},
  //   {title: 'Airport - County', fields: ['county3'], prefix: '', suffix: ''},
  // ],
  // 'Planning & Community Development': [
  //   {title: 'FEMA Flood Zone', fields: ['floodZone'], prefix: '', suffix: ''},
  // ],
  'Administrative / Regulatory': [
    {title: 'Assigned Elementary School', fields: ['name'], prefix: '', suffix: ''},
    {title: 'School grades, capacity, enrollment, school rating', fields: ['schoolGradesName','capacity', 'schoolEnroll', 'currentGrade'], prefix: '', suffix: ''},
    // @todo needs to implement subcategories.
    // {title: 'Assigned Middle School', fields: ['name'], prefix: '', suffix: ''},
    // {title: 'School grades, capacity, enrollment, school rating', fields: ['schoolGradesName','capacity', 'schoolEnroll', 'currentGrade'], prefix: '', suffix: ''},
    // {title: 'Assigned High School', fields: ['name'], prefix: '', suffix: ''},
    // {title: 'School grades, capacity, enrollment, school rating', fields: ['schoolGradesName','capacity', 'schoolEnroll', 'currentGrade'], prefix: '', suffix: ''},
  ],
  'Assessments': [
    {title: 'Just Land Value', fields: ['landValue'], prefix: '', suffix: ''},
    {title: 'Just Building Value', fields: ['buildingValue'], prefix: '', suffix: ''},
    {title: 'Just Other Value', fields: ['extraFeatureValue'], prefix: '', suffix: ''},
    {title: 'Current Just / Market Value', fields: ['marketValue'], prefix: '', suffix: ''},
    // @todo needs to implement subcategories.
    // {title: 'Last Year\'s Just / Market Value', fields: ['marketValue'], prefix: '', suffix: ''},
    {title: 'Current Assessed / Save Our Home Value', fields: ['assessedValue'], prefix: '', suffix: ''},
    // @todo needs to implement subcategories.
    // {title: 'Last Year\'s Assessed / Save Our Home Value', fields: ['assessedValue'], prefix: '', suffix: ''},
    {title: 'City Taxable Value', fields: ['cityTax'], prefix: '', suffix: ''},
    {title: 'County Taxable Value', fields: ['countyTax'], prefix: '', suffix: ''},
    {title: 'School Taxable Value', fields: ['schoolTax'], prefix: '', suffix: ''},
  ],
  'Sales History': [
    {title: '1st Sale Date', fields: ['saleDate'], prefix: '', suffix: ''},
    {title: '1st Sale Amount', fields: ['price'], prefix: '$', suffix: ''},
    {title: 'Avg Price per Sq Ft', fields: ['pricePerPropertysf'], prefix: '$', suffix: ' ft²'},
    {title: '1st Deed Type', fields: ['transferCode'], prefix: '', suffix: ''},
  ]
};

class ActiveChecboxes extends React.Component {
  render() {
    return (
      <div className="active-layers-wrapper">
      {
        _.values(_.mapObject(checkedLayers, function(grop, title) {
          let failter = false;
          {_.values(_.mapObject(grop, function(status, filter) {
            if(status) {
              failter = true;
            }
          }))}
          if (failter) {
            return(
              <div className="group" key={title}><div className={'group-layers'}>{title}</div>
                {_.values(_.mapObject(grop, function(status, filter) {
                  if(status) return(
                    <div>{filter}</div>
                  );
                  else return('');
                }))}
              </div>
            );
          }
          else {
            return('');
          }
        }))
      }
      </div>
    );
  }
}

class DetailsMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeLayers: {},
      settings:{},
      activeTab: 'activated'
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
    this.props.layer.closePopup();
    this.props.layer.unbindPopup();
    this.props.renderPopup(this.props.data, this.props.e);
  }

  switchTab(e, tab) {
    e.preventDefault();
    this.setState({activeTab: tab});
  }

  render() {
    const item = popupResults[propertySectionName].data.items[0],
      map = this.props.map;
    const DetailsPopupL = item['landUse'].concat(item['__extra__']['place']['raw']);
    const activeTab = this.state.activeTab;
    return(
      <div>
        <div className="popup-header">
          <h3 className="head-title" onClick={this.showPropertyDetails}>{typeof item.title === 'object' ? item.title[0] : item.title}<i class="icon-b icon-b-ic-shere"></i></h3>
          <div className="ssl"><span>SSL:</span>{item.folioNumber}</div>
        </div>
        <div className="tabs">
          <a href="#actived-layers" className={(activeTab == 'activated' ? ' active' : '')} onClick={(e) => this.switchTab(e, 'activated')}>Activated Layers</a>
          <a href="#all-layers" className={(activeTab == 'all' ? ' active' : '')} onClick={(e) => this.switchTab(e, 'all')}>All Applicable Layers</a>
        </div>
        <div className={"list-active-layers" + (activeTab == 'activated' ? '' : ' hide')}>
          <ActiveChecboxes />
        </div>
        <div className={"list-layers" + (activeTab == 'all' ? '' : ' hide')}>
          <Layers
            map={map}
            {...this.props}
            DetailsPopupL={DetailsPopupL}
            saveLayersSate={this.saveLayersSate.bind(this)}
            activeLayers={checkedLayers}
            showLayers={this.props.showLayers}
          />
        </div>
      </div>
    );
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
      this.setState({layers: checkedLayers});
    }
  }

  prepareFieldsRequest(fieldsKey) {
    return _.values(_.mapObject(
      fieldsMapping[fieldsKey], (val, key) =>
        val.fields.map((result) => {
          return 'fields[]=' + result + '&';
        })
    )).join('');
  }

  getPropertyLayer(key) {
    let fieldsRequest = this.prepareFieldsRequest(propertySectionName);

    fetch(process.env.REACT_APP_API + '/api/ui-api' + urlSettings + fieldsRequest + 'address=' + key)
    .then(results => results.json())
    .then(data => this.propertyLayer(this.state.map, {data}))
    .catch(function (e) {
      console.error(e);
    });
  }

  propertyLayer(map, data, e, that, type) {
    let popupData = {
        fields: {},
        data:{},
        lng: '',
        lat: '',
      },
      layerExist  = false;
    const propertyData = popupResults[propertySectionName];
    if (propertyData && 'data' in propertyData && 'items' in propertyData.data && propertyData.data.items[0]) {
      const shape = {
        'type': 'Feature',
        'geometry': {
          'type': propertyData.data.items[0].gisData.geom.type ? propertyData.data.items[0].gisData.geom.type : 'Poligon',
          'coordinates': propertyData.data.items[0].gisData.geom.coordinates ? propertyData.data.items[0].gisData.geom.coordinates : ''
        }
      };

      const newLeayer =  L.geoJson(shape, {type:'property-layer', key:'property-layer-' + propertyData.data.items[0].id});

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
            layer.closePopup();
            map.removeLayer(layer);
          }
        });
        ReactDOM.render('', document.getElementById('popupWrapper'));
      }

      // Render popup.
      function renderPopup(data, e) {
        const propertyData = popupResults[propertySectionName];
        newLeayer.unbindPopup();
        popupData['data'] = popupResults;
        popupData['fields'] = fieldsMapping;
        popupData['address'] = address;
        popupData['googleApiKey'] = googleApiKey;
        if (e) {
          popupData['lng'] = e.latlng.lng;
          popupData['lat'] = e.latlng.lat;
          map.fitBounds(newLeayer.getBounds());
        }
        else if ('data' in propertyData && 'items' in propertyData.data && propertyData.data.items[0] && 'gisData' in propertyData.data.items[0] && 'geom' in propertyData.data.items[0].gisData) {
          const lngLan = propertyData.data.items[0].gisData.geom.coordinates[0][0];
          map.fitBounds(newLeayer.getBounds());
          popupData['lng'] = lngLan[0];
          popupData['lat'] = lngLan[1];
        }
        ReactDOM.render(<MapPopup
          popupData={popupData}
          onCloseClicked={() => hide()}
        />, document.getElementById('popupWrapper'));
      }

      // If new layer was added update popup.
      if (!layerExist && type !== 'details') {
        if (e) {
          popupData['lng'] = e.latlng.lng;
          popupData['lat'] = e.latlng.lat;
        }
        else if ('data' in propertyData && 'items' in propertyData.data && propertyData.data.items[0] && 'gisData' in propertyData.data.items[0] && 'geom' in data.data.items[0].gisData) {
          const lngLan = propertyData.data.items[0].gisData.geom.coordinates[0][0];
          popupData['lng'] = lngLan[0];
          popupData['lat'] = lngLan[1];
        }
        newLeayer.closePopup();
        newLeayer.unbindPopup();
        newLeayer.addTo(map);
        map.eachLayer(function (layer) {
          if ('options' in layer && 'options' in newLeayer &&  layer.options.type ===  'property-layer') {
            renderPopup(data);
          }
        });
      }

      function renderDetailsPopup(data, e) {
        hide();
        map.fitBounds(newLeayer.getBounds());
        newLeayer.addTo(map);
        newLeayer.bindPopup('<div id="l-map-popup' + newLeayer['_leaflet_id'] + '"></div>');
        newLeayer.on('popupopen', function (popup) {
          if (typeof that !== 'undefined' && 'props' in that && !_.isEmpty(e)) {
            ReactDOM.render(<DetailsMap
              layer={newLeayer}
              data={data}
              e={e}
              map={map}
              renderPopup={renderPopup}
              saveLayersState={that.saveLayersSate}
              {...that.props}/>, document.getElementById('l-map-popup' + newLeayer['_leaflet_id']));
          }
        });
        newLeayer.openPopup();
      }

      newLeayer.on('click',function(e) {
        renderPopup(data, e);
        e.target.unbindPopup();
      });

      if (type === 'details') {
        renderDetailsPopup(data, e);
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

    function openPopup(e, map, type) {
      popupResults = {};
      let fieldsRequest = that.prepareFieldsRequest(propertySectionName);
      fetch(process.env.REACT_APP_API + '/api/ui-api' + requestSettings[propertySectionName] + fieldsRequest + 'point_search={"geometry":"POINT (' + e.latlng.lng + ' ' + e.latlng.lat + ')"}&publicToken=' + process.env.REACT_APP_API_PUBLIC_TOKEN)
        .then(results => results.json())
        .then(data => popupResults[propertySectionName] = {data})
        .then(data => loadAdditionalData(e, map, type))
        .catch(function (e) {
          console.error(e);
        });
    }

    function loadAdditionalData(e, map, type) {
      if (type === 'details') {
        that.propertyLayer(map, {popupResults}, e, that, type);
      }
      else {
        let id = '';
        if (
          typeof popupResults[propertySectionName]['data'] !== 'undefined'
          && typeof popupResults[propertySectionName]['data']['items'] !== 'undefined'
          && typeof popupResults[propertySectionName]['data']['items'][0] !== 'undefined'
          && typeof popupResults[propertySectionName]['data']['items'][0]['id'] !== 'undefined'
        ) {
          id = popupResults[propertySectionName]['data']['items'][0]['id'];
        }
        let fetches = [];
        let mapping = Object.assign({}, fieldsMapping);
        delete mapping[propertySectionName];
        _.mapObject(mapping, function (value, key) {
          let fieldsRequest = that.prepareFieldsRequest(key);
          fetches.push(fetch(process.env.REACT_APP_API + '/api/ui-api' + requestSettings[key] + fieldsRequest + 'folio_by_id=' + id + '&publicToken=' + process.env.REACT_APP_API_PUBLIC_TOKEN)
            .then(results => results.json())
            .then(data => popupResults[key] = {data})
            .catch(function (e) {
              console.error(e);
            })
          );
          return fetches;
        });
        Promise.all(fetches).then(data => that.propertyLayer(map, {data}, e, that, type));
      }
    }

    // Add property layer and open popup with property info.
    map.on('click', function(e) {
      openPopup(e, this);
      e.target.closePopup();
    });

    map.on('contextmenu',function(e){
      openPopup(e, this, 'details');
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
  };

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
