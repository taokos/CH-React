import React from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import Layers from './Layers.js';
import MapPopup from "./Elements/mapPopup.js";

const urlSettings = '?action=_property_record&type=_property_record&geometryFormat=json&rows=10&offset=0&ignoreStatus=&indent=&';

const center = [26.1224, -80.1373];
const StateBounds = new L.LatLngBounds(
  new L.LatLng(26.2142, -80.0570),
  new L.LatLng(26.0743, -80.2333)
);
const fields =[
  ['title', ''],
  ['folioNumber', 'Folio'],
  ['address', 'Address'],
  ['owners', 'Owner(s)'],
  ['owner_mailing_address','Owner Address'],
  ['legalDesc', 'Property Description'],
  ['landUseDorCode','Detailed Use'],
  ['yearBuilt', 'Year Built of Property'],
  ['buildings','Number of Buildings'],
  ['bedrooms','Bed Count'],
  ['baths','Bath Count'],
  ['livingUnits', 'Number of Units'],
  ['propertySize', 'Property Sq Ft'],
  ['abuttingProperties','Neighboring Properties'],
  ['streetName', 'Places - Street(s)'],
  ['building:real','Places - Related Building / Condominium Name']
];

class LMap extends React.Component {

  constructor(props) {
    super(props);

    this.map = this.map.bind(this);

    this.state = {
      map: '',
      baseLayers: {},
      mapData: {},
      layerExist: true,
    };
  }

  componentDidMount() {
    this.map();
  }

  map() {
    const map = L.map('map').setView(center, 10);

    this.setState({
      map: map
    });

    map.setMaxBounds(StateBounds);
    map.options.minZoom = map.getBoundsZoom(StateBounds);

    let popupData = {
        fields: {},
        data:{}
      },
    layerExist  = false;

    map.on('click', function(e) {
      // Add property layer and open popup with property info.
      function propertyLayer(map, data) {
        if (data.data.items[0]) {
          const shape = {
            'type': 'FeatureCollection',
            'features': [{
              'type': 'Feature',
              'geometry': {
                'type': data.data.items[0].gisData.geom.type ? data.data.items[0].gisData.geom.type : 'Poligon',
                'coordinates': data.data.items[0].gisData.geom.coordinates ? data.data.items[0].gisData.geom.coordinates : ''
              }
            }]
          };
          const newLeayer =  L.geoJson(shape, {type:'property-layer', key:'property-layer-' + data.data.items[0].id});

          // Remove current property layer if needed.
          map.eachLayer(function (layer) {
            if ('options' in layer && 'options' in newLeayer &&  layer.options.type ===  'property-layer') {
              if (layer.options.key !== newLeayer.options.key) {
                  map.removeLayer(layer);
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
          function renderPopup(data) {
            popupData['data'] = data;
            popupData['fields'] = fields;

            ReactDOM.render(<MapPopup
              popupData={popupData}
              onCloseClicked={() => hide()}
            />, document.getElementById('popupWrapper'));
            newLeayer.addTo(map);
          }

          // If new layer was added update popup.
          if (!layerExist) {
            renderPopup(data);
          }
        }
      }

      let fieldsRequest = '';

      fields.map(function(value, index) {
        fieldsRequest += 'fields[]=' + value[0] + '&';
      });

      fetch(process.env.REACT_APP_PUBLIC_API + urlSettings + fieldsRequest + 'point_search={"geometry":"POINT (' + e.latlng.lng + ' ' + e.latlng.lat + ')"}&publicToken=' + process.env.REACT_APP_API_PUBLIC_TOKEN)
        .then(results => results.json())
        .then(data => propertyLayer(this, {data}))

    });
  }

  render() {
    return (
      <div className="wrapper">
        {(this.state.map) ? <Layers map={this.state.map} showLayers={this.props.showLayers} /> : ''}
        <div id="popupWrapper"> </div>
        <div id="map" className="ch-map"> </div>
      </div>
    );
  }
}


export default LMap;
